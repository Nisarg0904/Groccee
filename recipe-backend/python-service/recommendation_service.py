from flask import Flask, request, jsonify
from together import Together
from dotenv import load_dotenv
import os
import json
import logging
import re

load_dotenv()
app = Flask(__name__)

api_key = os.getenv("TOGETHER_API_KEY")
client = Together(api_key=api_key)

@app.route('/generate-recipes', methods=['POST'])
def generate_recipes():
    data = request.get_json()
    # Expecting fields from the Node service payload
    expiringGroceries = data.get('expiringGroceries', [])
    allGroceries = data.get('allGroceries', [])
    
    # New parameters for customization
    num_recipes = data.get('numRecipes', 5)  # Default to 5 recipes if not specified
    cuisine_preference = data.get('cuisinePreference', 'global')  # Default to global cuisines
    
    # Convert groceries data to a JSON-formatted string for the prompt
    expiring_str = json.dumps(expiringGroceries, indent=2)
    all_str = json.dumps(allGroceries, indent=2)
    
    # List of diverse cuisines to encourage variety
    cuisines_list = """
    African (Ethiopian, Moroccan, Nigerian, South African), 
    American (Southern, Cajun, Tex-Mex, New England, Hawaiian),
    Asian (Chinese, Japanese, Korean, Vietnamese, Thai, Indian, Indonesian, Malaysian, Filipino),
    Caribbean (Jamaican, Cuban, Puerto Rican),
    European (Italian, French, Spanish, Greek, German, Polish, Hungarian, British, Irish, Scandinavian),
    Latin American (Mexican, Brazilian, Peruvian, Argentinian),
    Middle Eastern (Lebanese, Turkish, Iranian, Israeli),
    Pacific (Australian, New Zealand, Polynesian)
    """
    
    # Build the cuisine instruction based on preference
    cuisine_instruction = f"Include diverse recipes from various world cuisines including but not limited to: {cuisines_list}"
    if cuisine_preference != 'global':
        cuisine_instruction = f"Focus on {cuisine_preference} cuisine, but include some variety from other cuisines as well."
    
    prompt = (
    f"Given the following grocery items:\n\n"
    f"Expiring Soon Items:\n{expiring_str}\n\n"
    f"All Available Items:\n{all_str}\n\n"
    "IMPORTANT: For each recipe, you MUST provide detailed step-by-step cooking instructions in the description field. "
    "DO NOT provide a summary description. The description field MUST be a numbered list of cooking steps starting with '1.' etc.\n\n"
    f"Generate {num_recipes} recipe recommendations based on the ingredients, prioritizing the ingredients that are expiring soon. "
    f"{cuisine_instruction}\n\n"
    "Each recipe must be a valid JSON object with keys: "
    "recipeId (unique string), name (string), description (string with DETAILED STEP-BY-STEP COOKING INSTRUCTIONS), "
    "ingredients (an array of objects with keys: ingredientName, quantity, unit), "
    "cuisine (string specifying the precise regional cuisine), timeToCook (number in minutes), servings (number), and "
    "allergies (an array of objects with keys: allergen and severity, where severity is one of 'Mild', 'Moderate', or 'Severe'). "
    "Output only a valid JSON array with no extra text.\n\n"
    "Here are some examples of the desired output format:\n"
    "Example Recipe 1:\n"
    "{\n"
    '  "recipeId": "recipe-001",\n'
    '  "name": "Spicy Veggie Pasta",\n'
    '  "description": "1. Boil 2 liters of water in a large pot and add 1 teaspoon salt. 2. Add 200g pasta to boiling water and cook for 8-10 minutes until al dente. 3. Meanwhile, dice 3 tomatoes and 1 bell pepper. 4. Heat 2 tablespoons olive oil in a pan over medium heat. 5. Add vegetables and sauté for 5 minutes until softened. 6. Add 1/2 teaspoon chili flakes and stir. 7. Drain pasta and add to the pan with vegetables. 8. Toss everything together and cook for 1 minute more. 9. Serve hot with grated cheese if desired.",\n'
    '  "ingredients": [\n'
    '    { "ingredientName": "Pasta", "quantity": 200, "unit": "grams" },\n'
    '    { "ingredientName": "Tomato", "quantity": 3, "unit": "pieces" },\n'
    '    { "ingredientName": "Bell Pepper", "quantity": 1, "unit": "piece" }\n'
    "  ],\n"
    '  "cuisine": "Italian",\n'
    '  "timeToCook": 30,\n'
    '  "servings": 2,\n'
    '  "allergies": [ { "allergen": "Gluten", "severity": "Moderate" } ]\n'
    "}\n\n"
    "Example Recipe 2:\n"
    "{\n"
    '  "recipeId": "recipe-002",\n'
    '  "name": "Thai Green Papaya Salad",\n'
    '  "description": "1. Peel 1 green papaya and remove seeds. 2. Shred the papaya using a grater or food processor. 3. In a mortar, crush 2 garlic cloves and 2 Thai chilies. 4. Add 1 tablespoon fish sauce and 1 tablespoon lime juice. 5. Mix in 1 teaspoon palm sugar until dissolved. 6. In a large bowl, combine the papaya with the dressing. 7. Add 10 cherry tomatoes, halved. 8. Toss well to combine all ingredients. 9. Garnish with crushed peanuts and fresh cilantro. 10. Serve immediately.",\n'
    '  "ingredients": [\n'
    '    { "ingredientName": "Green Papaya", "quantity": 1, "unit": "piece" },\n'
    '    { "ingredientName": "Thai Chilies", "quantity": 2, "unit": "pieces" },\n'
    '    { "ingredientName": "Fish Sauce", "quantity": 1, "unit": "tablespoon" }\n'
    "  ],\n"
    '  "cuisine": "Thai",\n'
    '  "timeToCook": 15,\n'
    '  "servings": 2,\n'
    '  "allergies": [ { "allergen": "Peanuts", "severity": "Severe" }, { "allergen": "Fish", "severity": "Moderate" } ]\n'
    "}\n\n"
    "REMEMBER: The description MUST contain a detailed numbered list of cooking steps (1., 2., 3., etc.) - NOT a brief summary. "
    f"Generate {num_recipes} recipes in the format shown above, each using the provided ingredients and representing different cuisines."
)
    
    try:
        response = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=6000,  # Increased tokens for more recipes and detailed instructions
            temperature=0.8,  # Slightly increased for more variety
            top_p=0.8,
            top_k=50,
            repetition_penalty=1.1,
            stream=False
        )
        
        # Extract the model's response text
        content = response.choices[0].message.content
        
        # Attempt to parse the response as JSON
        try:
            recommended_recipes = json.loads(content)
            
            # Post-process: Check if the descriptions actually have numbered steps
            for recipe in recommended_recipes:
                description = recipe.get('description', '')
                
                # If the description doesn't contain numbering (1., 2., etc.), add it
                if not re.search(r'\d+\.', description):
                    steps = description.split('. ')
                    numbered_steps = []
                    for i, step in enumerate(steps, 1):
                        if step:  # Skip empty steps
                            step = step.strip()
                            if step:
                                numbered_steps.append(f"{i}. {step}")
                    
                    recipe['description'] = ' '.join(numbered_steps)
                
                # Ensure cuisine is properly specified
                if not recipe.get('cuisine'):
                    recipe['cuisine'] = "International"
            
            return jsonify(recommended_recipes)
                
        except json.JSONDecodeError as e:
            # If JSON parsing fails, try to extract JSON from the text
            pattern = r'\[\s*\{.*\}\s*\]'
            match = re.search(pattern, content, re.DOTALL)
            
            if match:
                try:
                    extracted_json = match.group(0)
                    recommended_recipes = json.loads(extracted_json)
                    return jsonify(recommended_recipes)
                except:
                    pass
            
            # If extraction fails too, return error
            return jsonify({
                "error": "Failed to parse JSON from model response",
                "model_response": content
            }), 500
        
        return jsonify(recommended_recipes)
    except Exception as e:
        logging.error(f"Error generating recipes: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/cuisines', methods=['GET'])
def get_cuisines():
    # Return a list of available cuisines for the frontend to use
    cuisines = [
        "African", "Ethiopian", "Moroccan", "Nigerian", "South African",
        "American", "Southern", "Cajun", "Tex-Mex", "New England", "Hawaiian",
        "Chinese", "Japanese", "Korean", "Vietnamese", "Thai", "Indian", 
        "Indonesian", "Malaysian", "Filipino",
        "Caribbean", "Jamaican", "Cuban", "Puerto Rican",
        "Italian", "French", "Spanish", "Greek", "German", "Polish", 
        "Hungarian", "British", "Irish", "Scandinavian",
        "Mexican", "Brazilian", "Peruvian", "Argentinian",
        "Lebanese", "Turkish", "Iranian", "Israeli",
        "Australian", "New Zealand", "Polynesian",
        "Fusion", "Global", "International"
    ]
    
    return jsonify(cuisines)

if __name__ == '__main__':
    app.run(port=6001, debug=True)
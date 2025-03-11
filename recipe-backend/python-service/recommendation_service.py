from flask import Flask, request, jsonify
from together import Together
from dotenv import load_dotenv
import os
import json
import logging

load_dotenv()
app = Flask(__name__)

api_key = os.getenv("TOGETHER_API_KEY")
client = Together(api_key=api_key)

@app.route('/generate-recipes', methods=['POST'])
def generate_recipes():
    data = request.get_json()
    # Expecting a "groceries" field from the Node service payload
    expiringGroceries = data.get('expiringGroceries', [])
    allGroceries = data.get('allGroceries', [])
    
    # Convert groceries data to a JSON-formatted string for the prompt
    expiring_str = json.dumps(expiringGroceries, indent=2)
    all_str = json.dumps(allGroceries, indent=2)
    
    prompt = (
    f"Given the following grocery items:\n\n"
    f"Expiring Soon Items:\n{expiring_str}\n\n"
    f"All Available Items:\n{all_str}\n\n"
    "Note: When generating recipe recommendations, prioritize the ingredients that are expiring soon, "
    "but feel free to use any of the available items to create a complete recipe. "
    "Each recipe must be a valid JSON object with keys: "
    "recipeId (unique string), name (string), description (string), "
    "ingredients (an array of objects with keys: ingredientName, quantity, unit), "
    "cuisine (string), timeToCook (number in minutes), servings (number), and "
    "allergies (an array of objects with keys: allergen and severity, where severity is one of 'Mild', 'Moderate', or 'Severe'). "
    "Output only a valid JSON array with no extra text.\n\n"
    "Here are some examples of the desired output format:\n"
    "Example Recipe 1:\n"
    "{\n"
    '  "recipeId": "recipe-001",\n'
    '  "name": "Spicy Veggie Pasta",\n'
    '  "description": "A delicious pasta dish with fresh vegetables and a hint of spice.",\n'
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
    '  "name": "Healthy Green Salad",\n'
    '  "description": "A refreshing salad with mixed greens and a light lemon dressing.",\n'
    '  "ingredients": [\n'
    '    { "ingredientName": "Lettuce", "quantity": 100, "unit": "grams" },\n'
    '    { "ingredientName": "Cucumber", "quantity": 1, "unit": "piece" },\n'
    '    { "ingredientName": "Olive Oil", "quantity": 2, "unit": "tablespoons" }\n'
    "  ],\n"
    '  "cuisine": "Mediterranean",\n'
    '  "timeToCook": 10,\n'
    '  "servings": 2,\n'
    '  "allergies": [ { "allergen": "None", "severity": "Mild" } ]\n'
    "}\n\n"
    "Now generate similar recipe recommendations based on the provided grocery items."
)
    
    try:
        response = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2000,
            temperature=0.7,
            top_p=0.7,
            top_k=50,
            repetition_penalty=1,
            stream=False
        )
        
        # Extract the model's response text
        content = response.choices[0].message.content
        
        # Attempt to parse the response as JSON
        try:
            recommended_recipes = json.loads(content)
        except json.JSONDecodeError as e:
            return jsonify({
                "error": "Failed to parse JSON from model response",
                "model_response": content
            }), 500
        
        return jsonify(recommended_recipes)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=6001)

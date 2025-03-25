from flask import Flask, request, jsonify
from together import Together
from dotenv import load_dotenv
import os
import json

load_dotenv()
app = Flask(__name__)

# Initialize the Together client using your API key
api_key = os.getenv("TOGETHER_API_KEY")
client = Together(api_key=api_key)

@app.route('/suggest_shopping_list', methods=['POST'])
def suggest_shopping_list():
    data = request.get_json()
    
    # Extract data from the request payload
    shopping_list_id = data.get('shopping_list_id')
    available_groceries = data.get('availableGroceries', [])
    user_preferences = data.get('userPreferences', [])
    
    # Build a prompt for the ML model:
    # - For each user preference, match by item_id.
    # - If the item is not found in available groceries, assume available quantity = 0.
    # - Calculate: (recommendedPurchaseQuantity - available quantity).
    # - If the result is fractional, round up to the nearest whole number.
    # - Only include items where this computed difference is greater than 0.
    prompt = (
        "You are an ML assistant tasked with generating shopping list item suggestions for a user. "
        "The user has a shopping list with ID: " + str(shopping_list_id) + ".\n\n"
        "Available Groceries (only active and expiring items):\n" 
        + json.dumps(available_groceries, indent=2) + "\n\n"
        "User Preferences (with recommendedPurchaseQuantity):\n" 
        + json.dumps(user_preferences, indent=2) + "\n\n"
        "For each user preference, match the item by its 'item_id'. "
        "If the item is not present in the available groceries, assume its available quantity is 0. "
        "Then calculate the quantity to add as: (recommendedPurchaseQuantity - available quantity). "
        "If this result is fractional, round it up to the nearest whole number. "
        "Only include items where the computed difference is greater than 0. "
        "Do not include any item if the available quantity is equal to or exceeds the recommendedPurchaseQuantity.\n\n"
        "Output a JSON array of objects, where each object is structured as follows:\n\n"
        '[\n'
        '  {\n'
        '    "shopping_list_id": <number>,\n'
        '    "name": <string>,\n'
        '    "unit": <string>,\n'
        '    "quantity": <number>\n'
        '  }\n'
        ']\n\n'
        "Return only valid JSON without any markdown formatting."
    )

    try:
        # Call the ML model using the Together client
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

        ml_output = response.choices[0].message.content.strip()
        
        # Remove markdown formatting if present
        if ml_output.startswith("```"):
            parts = ml_output.split("```")
            if len(parts) >= 2:
                ml_output = parts[1].strip()
        elif ml_output.lower().startswith("json"):
            ml_output = ml_output[4:].strip()

        try:
            suggestions = json.loads(ml_output)
        except Exception as json_err:
            return jsonify({
                "error": "Failed to parse ML output as JSON",
                "raw_output": ml_output
            }), 500

        return jsonify(suggestions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=6000)

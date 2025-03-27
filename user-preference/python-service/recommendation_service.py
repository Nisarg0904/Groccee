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

@app.route('/get_user_preference', methods=['POST'])
def get_user_preference():
    data = request.get_json()
    
    # Extract data from the request payload
    purchase_history = data.get('purchaseHistory', [])
    item_details = data.get('itemDetails', {})
    wastage_data = data.get('wastageData', [])
    old_user_preference = data.get('oldUserPreference', {})

    # Build a prompt for the ML model that instructs it to output a JSON object
    # with the following structure:
    #
    # {
    #   "user_id": <number>,
    #   "item_id": <string>,
    #   "category": <string>,
    #   "packaging": [
    #     {
    #       "unit": <string>,
    #       "averageBuyQuantity": <number>,
    #       "preferred": <boolean>,
    #       "shouldBuyLess": <boolean>,
    #       "shouldBuyMore": <boolean>
    #     }
    #   ],
    #   "averageBuyingPeriod": <number>,
    #   "wastedMoney": <number>,
    #   "recommendedPurchaseQuantity": <number>
    # }
    #
    prompt = (
        "Given the following data, analyze the user's buying habits and generate a user preference in JSON format. "
        "The JSON must have the following structure:\n"
        '{\n'
        '  "user_id": <number>,\n'
        '  "item_id": <string>,\n'
        '  "category": <string>,\n'
        '  "packaging": [\n'
        '    {\n'
        '      "unit": <string>,\n'
        '      "averageBuyQuantity": <number>,\n'
        '      "preferred": <boolean>,\n'
        '      "shouldBuyLess": <boolean>,\n'
        '      "shouldBuyMore": <boolean>\n'
        '    }\n'
        '  ],\n'
        '  "averageBuyingPeriod": <number>,\n'
        '  "wastedMoney": <number>,\n'
        '  "recommendedPurchaseQuantity": <number>\n'
        '}\n\n'
        "The input data is as follows:\n\n"
        "Purchase History:\n" + json.dumps(purchase_history, indent=2) + "\n\n" +
        "Item Details:\n" + json.dumps(item_details, indent=2) + "\n\n" +
        "Wastage Data:\n" + json.dumps(wastage_data, indent=2) + "\n\n" +
        "Old User Preference (if exists):\n" + json.dumps(old_user_preference, indent=2) + "\n\n" +
        "Analyze this data to determine the user's purchasing pattern, usage, and wastage, "
        "and provide the recommendation accordingly. Return only valid JSON without any markdown formatting."
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

        # Get the ML response text and strip any extra whitespace
        ml_output = response.choices[0].message.content.strip()
        
        # Remove markdown code fences if present (e.g., ```json ... ```)
        if ml_output.startswith("```"):
            parts = ml_output.split("```")
            if len(parts) >= 2:
                ml_output = parts[1].strip()
        # Also remove a leading 'json' prefix if present (e.g., "json\n{...}")
        elif ml_output.lower().startswith("json"):
            ml_output = ml_output[4:].strip()

        # Attempt to parse the response as JSON
        try:
            user_preference = json.loads(ml_output)
        except Exception as json_err:
            return jsonify({
                "error": "Failed to parse ML output as JSON",
                "raw_output": ml_output
            }), 500

        return jsonify(user_preference)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 6002))
    app.run(port=port)

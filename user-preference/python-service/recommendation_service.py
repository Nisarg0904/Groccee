from flask import Flask, request, jsonify
from together import Together
from dotenv import load_dotenv
import os
import json

load_dotenv()
app = Flask(__name__)

api_key = os.getenv("TOGETHER_API_KEY")
client = Together(api_key=api_key)

@app.route('/get_recommendation', methods=['POST'])
def get_recommendation():
    data = request.get_json()
    purchase_history = data.get('purchaseHistory', [])
    
    # Convert the purchase history to a nicely formatted JSON string
    purchase_history_str = json.dumps(purchase_history, indent=2)
    
    # Build the prompt with the purchase history and instructions for analysis
    prompt = (
        f"User purchase history (in JSON):\n{purchase_history_str}\n\n"
        "Analyze the user's buying habits based on the above data. "
        "Consider factors such as purchase frequency, item status (e.g., expiring, active, fresh), "
        "and purchased dates. Based on your analysis, provide a recommendation. "
        "For example, tell the user if they usually buy a particular item more frequently and should consider "
        "purchasing it again, or if they tend to buy an item too often and might be wasting it. "
        "Explain your reasoning."
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
            # stop=["[/INST]", "</s>"],
            stream=False
        )
        
        # Directly access the recommendation from the complete response object
        recommendation = response.choices[0].message.content
        
        return jsonify({"recommendation": recommendation})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=6000)

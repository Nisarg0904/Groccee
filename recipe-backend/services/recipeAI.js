const axios = require("axios");
require("dotenv").config();

async function generateRecipe(groceryData) {
  try {
    const prompt = `
      You are a professional chef AI. Generate a structured JSON recipe based on the following grocery list:

      ${JSON.stringify(groceryData, null, 2)}

      Respond ONLY in JSON format with this structure:
      {
        "name": "Dish Name",
        "description": "Brief description",
        "ingredients": [
          { "ingredientName": "Tomato", "quantity": 2, "unit": "pieces" },
          { "ingredientName": "Paneer", "quantity": 200, "unit": "grams" }
        ],
        "cuisine": "Indian",
        "timeToCook": 30,
        "servings": 4,
        "allergies": ["Dairy"],
        "steps": [
          { "stepNumber": 1, "instruction": "Chop the vegetables." },
          { "stepNumber": 2, "instruction": "Cook the paneer with spices." }
        ]
      }

      Important: Do NOT include any text outside of the JSON format.
    `;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/gemma-7b", // ✅ Use Gemma-7B or another free model
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Ensure we get a valid JSON response
    const responseData = response.data;
    console.log("Raw API Response:", responseData);

    // Extract JSON response safely
    const jsonText = responseData[0]?.generated_text;
    const jsonResponse = JSON.parse(jsonText);

    return jsonResponse;
  } catch (error) {
    console.error(
      "Error generating recipe:",
      error.response?.data || error.message
    );
    return { error: "Failed to generate recipe" };
  }
}

module.exports = { generateRecipe };

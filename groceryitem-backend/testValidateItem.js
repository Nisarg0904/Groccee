const { validateItem } = require("./utils/apiHelper"); // Import function from your module
process.env.ITEM_BACKEND_URL = "http://localhost:5006"; // Update if needed

const itemName = "Oranges";
const packaging = { unit: "Dozen" };
const category = "Fruits";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNzM4NzQwNzM4LCJleHAiOjE3Mzg3NDQzMzh9.ok0S4C6CWw3X6IdkATXqmM4xvpYFefJ2O4-eLefPlsE"; // Replace with a valid token

async function testValidateItem() {
  try {
    console.log("🔍 Testing validateItem function...");
    console.log("🔹 Item Name:", itemName);
    console.log("🔹 Packaging:", packaging);
    console.log("🔹 Category:", category);
    console.log("🔹 Token:", token ? "✅ Provided" : "❌ Missing");

    const item = await validateItem(itemName, packaging, category, token);

    console.log(
      "✅ Test Passed! Item response:",
      JSON.stringify(item, null, 2)
    );
  } catch (error) {
    console.error("❌ Test Failed:", error.message);

    if (error.response) {
      console.error("🔹 Response Status:", error.response.status);
      console.error("🔹 Response Data:", error.response.data);
      console.error("🔹 Response Headers:", error.response.headers);
    }
  }
}

// Run the test
testValidateItem();

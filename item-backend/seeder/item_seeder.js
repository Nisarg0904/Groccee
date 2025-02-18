const mongoose = require("mongoose");
const Item = require("../models/Item");
require("dotenv").config();

// Sample grocery items from your uploaded JSON file
const groceryItems = [
  { name: "Milk", category: "Dairy", units: ["Liter", "ml", "Carton", "Bag"] },
  { name: "Greek Yogurt", category: "Dairy", units: ["ml", "Gram", "Tub"] },
  {
    name: "Cheddar Cheese",
    category: "Dairy",
    units: ["Gram", "kg", "Block", "Slice"],
  },
  { name: "Apple", category: "Fruits", units: ["Piece", "kg", "Bag"] },
  {
    name: "Blueberries",
    category: "Fruits",
    units: ["Pint", "Gram", "Container"],
  },
  { name: "Carrot", category: "Vegetables", units: ["Piece", "kg", "Bunch"] },
  { name: "Spinach", category: "Vegetables", units: ["Gram", "Bunch", "Bag"] },
  {
    name: "Chicken Thighs",
    category: "Meat",
    units: ["Gram", "kg", "Package"],
  },
  { name: "Pasta", category: "Grains", units: ["Gram", "kg", "Box"] },
  {
    name: "Orange Juice",
    category: "Beverages",
    units: ["Liter", "ml", "Carton"],
  },
  { name: "Ice Cream", category: "Frozen", units: ["Liter", "ml", "Tub"] },
  { name: "Canned Tuna", category: "Canned Goods", units: ["Gram", "Can"] },
];

// Function to get random items for each user
const getRandomItems = (userId) => {
  return groceryItems.map((item) => ({
    name: item.name,
    category: item.category,
    user_id: userId,
    packaging: [
      {
        unit: item.units[Math.floor(Math.random() * item.units.length)],
        times_bought: Math.floor(Math.random() * 20), // Random purchases
        times_wasted: Math.floor(Math.random() * 5), // Random wastage
      },
    ],
  }));
};

// Seeder function
const seedItems = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB. Seeding data...");

    // Insert items for each user
    const users = [13, 14, 15, 16];
    let itemsToInsert = [];

    users.forEach((userId) => {
      itemsToInsert = itemsToInsert.concat(getRandomItems(userId));
    });

    await Item.insertMany(itemsToInsert);

    console.log("✅ Successfully seeded items!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    mongoose.connection.close();
  }
};

// Run seeder
seedItems();

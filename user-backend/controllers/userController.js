const User = require("../models/user");

// ✅ **Get User Profile**
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      shoppingActivity: user.shoppingActivity,
      dietPreference: user.dietPreference,
      cookingForPeople: user.cookingForPeople,
      cuisinePreference: user.cuisinePreference,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting profile", error: err.message });
  }
};

// ✅ **Edit User Profile**
exports.editProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      shoppingActivity,
      dietPreference,
      cookingForPeople,
      cuisinePreference,
    } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.shoppingActivity = shoppingActivity || user.shoppingActivity;
    user.dietPreference = dietPreference || user.dietPreference;
    user.cookingForPeople = cookingForPeople || user.cookingForPeople;
    user.cuisinePreference = cuisinePreference || user.cuisinePreference;

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: err.message });
  }
};

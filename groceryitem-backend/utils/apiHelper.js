const axios = require('axios');



const USER_BACKEND_URL = process.env.USER_BACKEND_URL || 'http://localhost:5000';
const ITEM_BACKEND_URL = process.env.ITEM_BACKEND_URL || 'http://localhost:5006';

// Validate user_id via user-backend
async function validateUser(userId) {
  try {
    const response = await axios.get(`${USER_BACKEND_URL}/api/users/${userId}`);
    if (response.status === 200) {
      return true; 
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('User does not exist');
    }
    throw new Error('Error validating user');
  }
}

// Validate item_id via item-backend
async function validateItem(itemId) {
  try {
    const response = await axios.get(`${ITEM_BACKEND_URL}/api/items/${itemId}`);
    if (response.status === 200) {
      return true; 
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('Item does not exist');
    }
    throw new Error('Error validating item');
  }
}

module.exports = { validateUser, validateItem };

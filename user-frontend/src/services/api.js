import axios from "axios";

// Base URL configurations
const userAPI = axios.create({
  baseURL: "http://10.0.2.2:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const groceryAPI = axios.create({
  baseURL: "http://10.0.2.2:5004/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const itemAPI = axios.create({
  baseURL: "http://10.0.2.2:5006/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export { userAPI, groceryAPI, itemAPI };
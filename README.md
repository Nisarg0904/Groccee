# Capstone Project

A comprehensive solution for managing grocery items, recipes, shopping lists, user preferences, and wastage tracking. This project leverages multiple microservices and a variety of technologies to create a robust, scalable platform. Below you will find an overview of the project structure, setup instructions, technologies used, and the team behind it.

---

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Technologies](#technologies)
5. [Prerequisites & Installation](#prerequisites--installation)
6. [Running the Project](#running-the-project)
7. [Testing with Postman](#testing-with-postman)
8. [Team Members](#team-members)

---

## Overview
This Capstone project aims to simplify the process of planning, shopping, and managing groceries. Users can:
- Track items they have or need to purchase.
- Create and manage shopping lists.
- Explore and store recipes.
- Set personal preferences for dietary needs or favorite ingredients.
- Monitor and reduce wastage.
- Benefit from machine learning insights (powered by Python) for recommendations or analytics.

The solution is composed of several backend services (Node.js and Python) and a frontend (React Native with Expo). All backend services can be orchestrated using Docker for easy setup and scalability.

---

## Features
1. **User Management**  
   - Create and authenticate users.  
   - Manage user profiles and preferences.

2. **Item & Grocery Management**  
   - Add, update, or remove grocery items.  
   - Categorize and filter items.

3. **Recipe Management**  
   - Create, read, update, and delete recipes.  
   - Link recipes to grocery items needed.

4. **Shopping List**  
   - Generate and manage multiple shopping lists.  
   - Mark items as purchased.

5. **Wastage Tracking**  
   - Track expired or unused items.  
   - Monitor patterns to reduce food waste.

6. **ML/Analytics (Python)**  
   - Generate recommendations based on user preferences.  
   - Analyze usage patterns and wastage data.

7. **Docker Orchestration**  
   - Spin up containers for databases and services with minimal configuration.

8. **Postman Testing**  
   - Comprehensive API testing collection to verify endpoints.

---

## Project Structure
Below is an overview of the main folders and files in the repository:

plaintext
```
CAPSTONE/
├── global-item/
├── groceryitem-backend/
├── item-backend/
├── recipe-backend/
├── shopping-list-backend/
├── shopping-list-item-backend/
├── user-backend/
├── user-preference/
├── wastage-backend/
├── frontend/                 # Formerly "user-frontend" - React Native (Expo) app
├── package.json
├── package-lock.json
├── docker-compose.yml        # Docker Compose file for spinning up all necessary services
└── .gitignore
```

- **Multiple backend services**: Each backend folder (e.g., groceryitem-backend, recipe-backend) houses a distinct service.
- **Frontend**: React Native application built with Expo.
- **docker-compose.yml**: Contains service definitions for databases (MongoDB, PostgreSQL) and other microservices.

---

## Technologies
The project uses a **MPERN** stack plus additional tools:

- **M**ongoDB – NoSQL database for certain services  
- **P**ostgreSQL – Relational database for other services  
- **E**xpo Go – Used for the React Native frontend  
- **R**eact Native – Cross-platform mobile development framework  
- **N**ode.js – Core JavaScript runtime for backend services  
- **Docker** – Containerization of services for easy deployment  
- **Python** – Machine Learning/Analytics module  
- **Postman** – For testing and verifying API endpoints  

---

## Prerequisites & Installation
1. **Node.js & npm**  
   - Ensure you have [Node.js](https://nodejs.org) installed (preferably the latest LTS version).
   - npm is included with Node.js.

2. **Docker**  
   - Install [Docker](https://www.docker.com/) to run databases and any containerized services.

3. **Python 3**  
   - Required if you want to run the ML/analytics service locally.

4. **Expo CLI (optional)**  
   - If you plan to run the mobile app on a device/emulator, install the [Expo CLI](https://docs.expo.dev/get-started/installation/).

---

## Running the Project

### 1. Spin Up Databases

To run the project, you need to start all database containers. Navigate to the folder containing the `docker-compose.yml` file and run:

```bash
  docker-compose up -d
```

This will start MongoDB, PostgreSQL, and any other containerized services required by the project.

---

### 2. Install Dependencies & Start All Services

At the root level, run:

```bash 
  npm install 
  npm run start:all
```

- Installs dependencies for all Node-based services  
- Orchestrates Python services  
- Ensures all backend microservices are up and running

---

### 3. Running the Frontend (React Native + Expo)

Navigate to the frontend folder:

```bash
  cd frontend 
  npm install
```
Start the Expo development server:

```bash
  npm start
```

To test on your device or emulator:

- Use the Expo Go app on your iOS or Android device  
- Scan the QR code generated in your terminal or browser window

---

## Testing with Postman

We have a Postman workspace set up for testing all endpoints.

**Postman Team Invitation:** [Click here to join](https://app.getpostman.com/join-team?invite_code=3ae8b042c6fd532e3786263b7854bb9224b9c818d3bf21d0fabab87954eee82c&target_code=ee9a4bf1d4d3a03fe027a721237850f1) <!-- Replace with actual link -->

Once you’ve joined, you can:

- Import the collection/workspace  
- Run individual requests or use the collection runner to test multiple endpoints at once


## Team Members

This capstone project was collaboratively developed by the following team members:

### Fernando Daniel Chavez Solares  
**Email:** [Daniel.chavez200326@gmail.com](mailto:Daniel.chavez200326@gmail.com)  
**GitHub:** [solaresDC](https://github.com/solaresDC)  
**LinkedIn:** Not Available

### Nisarg Bhatti  
**Email:** [Nisarg.bhatti0904@gmail.com](mailto:Nisarg.bhatti0904@gmail.com)  
**GitHub:** [Nisarg0904](https://github.com/Nisarg0904)  
**LinkedIn:** [https://www.linkedin.com/in/nisarg-bhatti-052654223](https://www.linkedin.com/in/nisarg-bhatti-052654223)

### Helly Chauhan  
**Email:** [hellychauhan37@gmail.com](mailto:hellychauhan37@gmail.com)  
**GitHub:** [helly373](https://github.com/helly373)  
**LinkedIn:** [https://www.linkedin.com/in/hellychauhan](https://www.linkedin.com/in/hellychauhan)

### Kashyap Mavani  
**Email:** [kashmavani@gmail.com](mailto:kashmavani@gmail.com)  
**GitHub:** [Kashh99](https://github.com/Kashh99)  
**LinkedIn:** [https://www.linkedin.com/in/kashyap-mavani](https://www.linkedin.com/in/kashyap-mavani)

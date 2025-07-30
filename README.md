# Fi-Money Inventory Management System

## ALL TEST CASES FOR THE InventoryManagementSystem PASSED
<img width="852" height="330" alt="image" src="https://github.com/user-attachments/assets/cffd4b5d-7e97-46d4-926b-997ec1585991" />

### Note : setup for testing and script for database table creation is mentioned in scripts/README.md



This project is a full-stack inventory management system with a Next.js frontend and a Node.js (Express) backend.

## Tech Stack

### Frontend
- **Framework**: Next.js (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Key Features

- **User Authentication**: Secure user registration and login.
- **Inventory Management**: Add, view, update product quantities, delete products.
- **Product Details**: Store comprehensive product information including SKU, type, description, and images.
- **Search Functionality**: Quickly find products by name, SKU, or type.
- **Responsive Design**: A clean and intuitive user interface that works on all screen sizes.
- **Secure API**: Protected routes using JWT-based authorization.

## Architecture

### Backend
The backend follows a **Controller-Route-Service** architecture, which separates the application's concerns into three distinct layers:
- **Routes**: Define the API endpoints and map them to the appropriate controller functions.
- **Controllers**: Handle incoming HTTP requests, validate data, and call the service layer.
- **Services**: Contain the core business logic and interact with the database.

### Frontend
The frontend is built with Next.js and follows a component-based architecture.
- **Components**: Reusable UI elements built with shadcn/ui.
- **Services**: Functions dedicated to making API calls to the backend.
- **Types**: Centralized TypeScript interfaces for data models.

## API Endpoints

All product-related endpoints require authentication.

| Method | Endpoint               | Description                 |
|--------|------------------------|-----------------------------|
| POST   | `/register`            | Register a new user.        |
| POST   | `/login`               | Log in a user.              |
| GET    | `/products`            | Get all products for a user.|
| POST   | `/products`            | Add a new product.          |
| PUT    | `/products/:id/quantity`| Update a product's quantity.|
| DELETE | `/products/:id`        | Delete a product.           |

## Database Schema

### `users` table
| Column   | Type      | Description      |
|----------|-----------|------------------|
| `id`     | SERIAL    | Primary Key      |
| `name`   | VARCHAR   | User's name      |
| `email`  | VARCHAR   | User's email (unique) |
| `password`| VARCHAR   | Hashed password  |

### `products` table
| Column        | Type      | Description                 |
|---------------|-----------|-----------------------------|
| `id`          | SERIAL    | Primary Key                 |
| `name`        | VARCHAR   | Product name                |
| `type`        | VARCHAR   | Product type                |
| `sku`         | VARCHAR   | Stock Keeping Unit          |
| `image_url`   | VARCHAR   | URL for the product image   |
| `description` | TEXT      | Product description         |
| `quantity`    | INTEGER   | Available stock             |
| `price`       | NUMERIC   | Product price               |
| `userid`      | INTEGER   | Foreign Key to `users.id`   |


## Project Structure

- `Fi-Inventories-backend`: The backend server built with Express.
- `Fi-Inventories-dashboard`: The frontend application built with Next.js.

## Backend Setup (`Fi-Inventories-backend`)

### Prerequisites

- Node.js
- PostgreSQL

### 1. Installation

Navigate to the backend directory and install the dependencies:

```bash
cd Fi-Inventories-backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `Fi-Inventories-backend` directory and add the following variables:

```
PORT=5000
DB_USER=your_db_user
DB_HOST=your_db_host
DB_DATABASE=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=your_db_port
JWT_SECRET=your_jwt_secret
CA_CERT=path/to/your/ca.pem
```

### 3. Creating the `ca.pem` file

For secure SSL connections to your PostgreSQL database, you will need a `ca.pem` file. This file is provided by your database hosting provider (e.g., Aiven, ElephantSQL).`i used Aiven`

1.  Download the `ca.pem` file from your database provider's dashboard.
2.  Place it in a secure location within your project or on your system.
3.  Update the `CA_CERT` variable in your `.env` file with the correct path to the `ca.pem` file.

### 4. Running the Backend

To start the backend server, run the following command:

```bash
node server.js
```

The server will be running at `http://localhost:5000`.

## Frontend Setup (`Fi-Inventories-dashboard`)

### 1. Installation

Navigate to the frontend directory and install the dependencies:

```bash
cd Fi-Inventories-dashboard
npm install
```
### 2. Environment Variables
Create a `.env` file in the `Fi-Inventories-dashboard` directory and add the following variables:
```
NEXT_PUBLIC_API_URL=your _backend_url
```

### 3 Running the Frontend

To start the frontend development server, run the following command:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---
### demo screen shots
<img width="1910" height="1024" alt="image" src="https://github.com/user-attachments/assets/b79a82f6-e23d-4eb7-838b-01cea25cd665" />
<img width="1909" height="1010" alt="image" src="https://github.com/user-attachments/assets/ab310e82-303b-470c-860d-b81ae614dbaa" />
<img width="1907" height="1011" alt="image" src="https://github.com/user-attachments/assets/a018213a-2d2f-4562-9ce3-a7f7858eadc1" />
<img width="1895" height="929" alt="image" src="https://github.com/user-attachments/assets/3ce2c73f-6e37-4ed7-b164-8270725b4bf3" />
<img width="1898" height="905" alt="image" src="https://github.com/user-attachments/assets/0e7dfc97-d556-4c21-83eb-5d28f647a9ae" />
<img width="1898" height="924" alt="image" src="https://github.com/user-attachments/assets/07c78211-a21a-4943-8106-3926698c6b3d" />
<img width="1708" height="846" alt="image" src="https://github.com/user-attachments/assets/87616f12-cc38-41e4-a9dc-de59052d578a" />


Reach out to me at my email zulqarnain4292@gmail.com for any questions or feedback. Thank you! 

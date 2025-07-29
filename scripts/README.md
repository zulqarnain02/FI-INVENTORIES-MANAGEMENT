# Scripts

This directory contains utility scripts for the Fi-Money project.

## Database Setup (`setup-db.js`)

This script initializes the PostgreSQL database by creating the necessary tables as defined in `/schema.sql`.

### Prerequisites

- Node.js
- An active PostgreSQL server.
- A configured `.env` file in the `Fi-Inventories-backend` directory.

### Usage

From the root `Fi-Money` directory, run the following command:

```bash
npm install
```

```bash
npm run setup-db
```

## API Testing (`test_api.py`)

This script runs a series of tests against the backend API to ensure all endpoints are functioning correctly.

### Prerequisites

- Python 3
- A running backend server.

### 1. Install Dependencies

Navigate to the `scripts` directory and install the required Python packages:

```bash
pip install -r requirements.txt
```

### 2. Run the Tests

From the root `Fi-Money` directory, run the following command:

```bash
python scripts/test_api.py
``` 
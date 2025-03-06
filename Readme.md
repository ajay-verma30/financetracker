**Finance Tracker API**
A simple API built using Node.js and Express for tracking financial transactions.

**Tech Stack**
**Backend:** Node.js, Express
**Database:** MongoDB
**Authentication & Encryption:** Bcrypt.js, JSON Web Token (JWT)

**NOTE**
Include .env file with following;
DB_USERNAME:<Username>
DB_PASSWORD:<Password>
JWT_TOKEN:<SECRET_KEY_for_Encryption>

Collections (Tables)
The API consists of two collections:

**Users** – Stores user information.
**Finance** – Stores financial transactions.
Supported HTTP Methods
**POST** – For user registration, login, and transaction recording.
**GET** – For retrieving financial reports.
**Update** - For uploading profile picture to the user DB.
**Delete** -  Deleting user profile from the db.

1️⃣ **Users API**
a. Register User
📌 Endpoint: POST /user/register
This API registers a new user in the system.

**Workflow**:
Accepts username and password from the request body.
Checks if the user already exists. If yes, returns an error.
Encrypts the password using bcrypt.
Stores the user in the database.
Request Example (Postman/Thunder Client)
📌 URL: http://localhost:3001/user/register
📌 Body (JSON):
{
    "username": "<your_username>",
    "password": "<your_password>",
    "confirmPassword": "<confirm_password>"
}
✅ Response: User successfully registered in the database.

b. Login User
📌 Endpoint: POST /user/login
This API logs in an existing user.

**Workflow**:
Accepts username and password from the request body.
Checks if the user exists in the database. If not, returns an error.
Compares the provided password with the hashed password using bcrypt.compare().
If the password is incorrect, returns an error.
Generates an authentication token using jsonwebtoken.
Returns the token in the response.
Request Example (Postman/Thunder Client)
📌 URL: http://localhost:3001/user/login
📌 Body (JSON):
{
    "username": "<your_username>",
    "password": "<your_password>"
}
✅ Response: Token is returned for authentication.

**Possible Errors**
Status Code	Message
500	        Internal Server Error
400	        No username provided / No password provided / No Confirm Password provided


2️⃣ **Finance API**
The Finance API allows users to credit (add funds) and debit (spend funds).

🔐 **Note**: **All Finance API requests require authentication. You must include the token in the request headers.**

Available Finance API Endpoints:
Credit Amount: POST /finance/credit
Debit Amount: POST /finance/debit
View Financial Reports: GET /finance/myfinances

a.** Credit Amount**
📌 Endpoint: POST /finance/credit
Headers:
{
    "Authorization": "Bearer <token>"
}

Request Body (JSON)
{
    "username": "<your_username>",
    "amount": 9.99,
    "expenseType": "Salary"
}
✅ Accepted Expense Type: "Salary"

Response Example:
{
  "message": "Saved transaction",
  "body": {
    "newAmount": 9.99,
    "currentbal": 4256.02,
    "username": "arv30",
    "expenseType": "Salary",
    "transactionType": "Credit",
    "_id": "67c869c38ca083cb566ad0f1",
    "createdAt": "2025-03-05T15:12:03.735Z",
    "__v": 0
  }
}


b. **Debit Amount**
📌 Endpoint: POST /finance/debit
Headers:
{
    "Authorization": "Bearer <token>"
}

Request Body (JSON)
{
    "username": "<your_username>",
    "amount": 750,
    "expenseType": "Rent"
}
✅ Accepted Expense Types: "Food", "Entertainment", "Shopping", "Travel", "Rent", "Others"

Response Example:
{
  "message": "Saved transaction",
  "body": {
    "newAmount": 750,
    "currentbal": 3506.02,
    "username": "arv30",
    "expenseType": "Rent",
    "transactionType": "Debit",
    "_id": "67c86ab08ca083cb566ad0f4",
    "createdAt": "2025-03-05T15:16:00.347Z",
    "__v": 0
  }
}


c. **Get Financial Report**
📌 Endpoint: GET /finance/myfinances
Headers:
{
    "Authorization": "Bearer <token>"
}

Request Body (JSON)
{
    "username": "<your_username>"
}
📌 Response: Returns the full financial report of the user.


Update API:
📌 Endpoint: PUT /user/:<username>
Headers:
{
    "Authorization": "Bearer <token>"
}

Request Body - Form-Data
{
    "image": <SELECT_IMAGE>
}


**Using Delete API will delete entire history of the user from both tables(Finance and User)**

📌 **How to Run This Project Locally**
Clone the repository:
git clone https://github.com/ajay-verma30/financetracker.git

Navigate into the project folder:
cd financetracker

Install dependencies:
npm install

Start the server:
node server.js

Use Postman/Thunder Client to test the API.

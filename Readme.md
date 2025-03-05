Finance Tracker API
A simple API built using Node.js and Express.

Tech Stack
Database: MongoDB
Encryption: Bcrypt.js, JSON Web Token (JWT)
Collections (Tables)
The API consists of two collections:

Users – Stores user information
Finance – Stores financial transactions
The API supports two HTTP methods:

POST – For user registration and login
GET – For retrieving data
1️⃣ Users API
a. Register User
Endpoint: POST /user/register
This API registers a new user.

Workflow:
Accepts username and password from the request body.
Checks if the user already exists. If yes, it returns an error.
Encrypts the password using bcrypt.
Stores the user in the database.
Request Example (Postman/Thunder Client):
📌 URL: http://localhost:3001/user/register
📌 Body (JSON):

{
    "username": "<your_username>",
    "password": "<your_password>",
    "confirmPassword": "<confirm_password>"
}
✅ Response: User successfully registered in the database.

b. Login User
Endpoint: POST /user/login
This API logs in an existing user.

Workflow:
Accepts username and password from the request body.
Checks if the user exists in the database. If not, returns an error.
Compares the provided password with the hashed password using bcrypt.compare().
If the password is incorrect, returns an error.
Generates an authentication token using jsonwebtoken.
Returns the token in the response.
Request Example (Postman/Thunder Client):
📌 URL: http://localhost:3001/user/login
📌 Body (JSON):

{
    "username": "<your_username>",
    "password": "<your_password>"
}
✅ Response: Token is returned for authentication.


Possible Errors:
Status Code: 500
Message: Internal Server Error

Status Code: 400
Message: No username Provided/No password provided/No Confirm Password Provided


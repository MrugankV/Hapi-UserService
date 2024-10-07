# Node Backend Service- Using Hapi.js
## Project Purpose

The purpose of this project is to develop a secure and efficient RESTful API microservice using Hapi.js for user management. The microservice will allow users to create accounts while securely storing their Personally Identifiable Information (PII). The project aims to implement best practices in API development, including data validation, error handling, and secure data storage. By leveraging modern technologies like Sequelize.js for database interactions and implementing CI/CD pipelines for automated deployment, this project aims to ensure code quality, reliability, and maintainability.

## Endpoints
The application consists of the following endpoints

1. _**/login**_: Login API( Autheticates user and generates the necessary JWT token with authorization)
2. _**/createusers**_: Create User API( Registers new User - includes PII data)
3. _**/users/**_: Lists all user(accessible for the Admin Role)
4. _**/users/{userid}**_ : Lists specific user (Accessible by both user and admin)

## General API Flow

1. **Login with Test Credentials**: 
   - Users authenticate by logging in with predefined test credentials.

2. **Token Generation**: 
   - Upon successful login, a token is generated for the user, allowing access to protected routes.

3. **Create User**: 
   - Using the generated token, a request is made to create a new user by providing the necessary fields.

4. **User Creation Confirmation**: 
   - A new user is successfully created, confirming that the operation was successful.

5. **Admin Login**: 
   - An admin user logs in to access administrative functionalities.

6. **Get All Users**: 
   - The admin retrieves a list of all users from the database.

7. **Regular User Login**: 
   - A regular user logs in to access their account.

8. **Get Current User Details**: 
   - The logged-in user can retrieve their personal details from the system.


## Tools Used

This project utilizes the following tools and technologies:

1. **Hapi.js**: A robust framework for building RESTful APIs in Node.js, providing powerful routing and request handling capabilities.

2. **Sequelize.js**: An ORM (Object-Relational Mapping) library for Node.js, used for interacting with the database. It simplifies the management of relational data and supports various database dialects.

3. **Joi**: A powerful validation library used to validate incoming request data, ensuring it meets specified criteria before processing.

4. **Docker**: A platform for developing, shipping, and running applications inside lightweight containers, allowing for consistent environments across development, testing, and production.

5. **GitHub Actions**: A CI/CD service integrated into GitHub that automates the workflow of building, testing, and deploying applications.

6. **MySQL Server(AWS RDS)**: A popular relational database management system used for securely storing user data and Personally Identifiable Information (PII).

7. **OWASP ZAP (Zed Attack Proxy)**: An open-source web application security scanner used to identify vulnerabilities in your application, helping to improve security posture.

8. **Jest**: A testing framework used for writing unit tests to ensure code reliability and maintainability.

9. **Heroku**: A cloud platform for deploying applications, allowing for easy management and scaling of web services.

10. **dotenv**: A zero-dependency module that loads environment variables from a `.env` file into `process.env`, making it easy to manage configuration settings securely.

11. **PM2**: For Log management and automatic server restarts in the deployment phase.

12. **Postman(Optional)** : For API Testing

These tools work together to create a secure, scalable, and efficient application that adheres to best practices in API development.


## Architecture

The architecture of this application is designed with a focus on scalability, security, and ease of use. The key components include:

1. **Hapi.js RESTful API**: 
   - The application is built using the Hapi.js framework, providing a robust structure for defining routes and handling requests.
   - It features a set of API endpoints for user creation and management, which include validation, authentication, and authorization mechanisms to secure sensitive data.

2. **Database Layer**: 
   - The application employs Sequelize.js as an Object-Relational Mapping (ORM) tool to interact with a relational database. 
   - A normalized database schema is defined to ensure data integrity and avoid redundancy, effectively managing user data and Personally Identifiable Information (PII).

3. **Data Validation and Error Handling**: 
   - Incoming requests are validated using libraries such as Joi, ensuring that the data conforms to expected formats before processing.
   - The application includes comprehensive error handling to provide appropriate responses for invalid inputs, database errors, and authentication failures.

4. **Encryption Mechanisms**:
   - **Password Storage**: User passwords are securely hashed using **bcrypt** before being stored in the database.
   - **PII Encryption**: Sensitive user Personally Identifiable Information (PII) is stored using **symmetric AES-256 encryption**, ensuring data confidentiality.
   - **Password Masking**: During data transmission, passwords are masked in the payload using **Base64 encoding** to enhance security.

5. **Unit Testing**: 
   - The codebase includes unit tests written in Jest, utilizing mocking databases and functions to isolate tests and verify the application’s behavior under various scenarios.

6. **CI/CD Pipeline**: 
   - The project is configured with a CI/CD pipeline using GitHub Actions to automate the build, test, and deployment process.
   - The application is packaged into a Docker image, which is pushed to a container registry Heroku Registry and deployed as Heroku Container.

7. **Active Scan**: 
   - ZAP security scans, including active scans and SQL injection tests, have been performed manually. The ZAP API scan is integrated as part of the workflow post-deployment.


By following these architectural principles, the project aims to deliver a robust, secure, and user-friendly API service that can be easily extended and maintained.

## Tests Conducted

The following tests have been conducted to ensure the reliability and functionality of the application:

### User Creation API Tests

1. **Test Case**: User Creation Access Control
   - **Description**: Verifies that a non-admin user without the `create:user` scope receives a 403 Forbidden response.
   - **Outcome**: 
     - **Result**: ✓ should return 403 if user is not admin and does not have create:user scope (31 ms)

2. **Test Case**: Validation Error Handling
   - **Description**: Tests that the API returns a 400 Bad Request when the input validation fails.
   - **Outcome**: 
     - **Result**: ✓ should return 400 for validation error (17 ms)

3. **Test Case**: Password Complexity Check
   - **Description**: Verifies that the API returns a 400 Bad Request for passwords that do not meet complexity requirements.
   - **Outcome**: 
     - **Result**: ✓ should return 400 for password complexity failure (2 ms)

4. **Test Case**: Duplicate User Data Handling
   - **Description**: Tests that the API returns a 409 Conflict when duplicate user data is submitted.
   - **Outcome**: 
     - **Result**: ✓ should return 409 if duplicate user data is found (5 ms)

5. **Test Case**: Successful User Creation
   - **Description**: Verifies that a user can be created successfully with valid input.
   - **Outcome**: 
     - **Result**: ✓ should create a user successfully (2811 ms)

6. **Test Case**: Database Error Handling
   - **Description**: Tests that the API returns a 402 Payment Required status code when a database error occurs.
   - **Outcome**: 
     - **Result**: ✓ should return 402 for database error (486 ms)

### Summary
These tests ensure that the user creation functionality works as intended, handles errors appropriately, and enforces access control. Regularly running these tests helps maintain code quality and application reliability as development progresses.


This repository contains a Node.js application designed for local development and deployment. This README will guide you through the steps to set up the application on your local machine for the first time.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

1. **Node.js** (version 20.14.0)
   - You can download it from [nodejs.org](https://nodejs.org/).
2. **Docker** (for building and running the Docker container)
   - Download from [docker.com](https://www.docker.com/get-started).
3. **Git** (to clone the repository)
   - Install from [git-scm.com](https://git-scm.com/).
4. **Active Heroku Account**
4. **Heroku CLI** (optional for deployment to Heroku)
   - You can install it from [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).
5. **Active MySQL server(Public)**
6. **Active Docker Hub Acess**


## Getting Started

Follow these steps to set up and run the application locally.

### 1. Clone the Repository

Open your terminal and run the following command:

```bash
git clone https://github.com/yourusername/node-service001.git
cd node-service001
```

### 2. Install Dependencies

Navigate to the project directory and install the necessary dependencies:

```bash
npm install
```

### Step 3: Set Up Environment Variables
Create a .env file in the root of your project directory. This file will hold your environment variables. Below is a sample structure of the .env file. Replace the placeholders with your actual values.
```bash
JWT_SECRET=your_jwt_secret
DATABASE_NAME=your_database_name
DATABASE_USER=your_database_user
DATABASE_PASSWORD=your_database_password
DATABASE_HOST=your_database_host
AesKey=your_aes_key
IV=your_initialization_vector
MAILER_USERNAME=your_mailer_username
MAILER_PASSWORD=your_mailer_password
```

### Step 4: Connect to existing DB/Update DB name
Make sure the Database server is up and running. Create an empty Database with any name.Update it in the env file as follows
```bash
DATABASE_NAME=your_database_name
```

### Step 5: Sync Sequelise ORM with DB
Run the following to prefill the database with necessary data and sync the sequelise ORM with DB.
```bash
node syncDB.js && node syncDB2.js
```
### Step 6: Run the Application
1.Build the Docker image:
```bash
docker build -t app-name .
```
2.Run the Docker container:
```bash
docker run -p 3000:3000 app-name
```

Your application should now be running at http://localhost:3000.

### Step 7: Run Tests
To ensure everything is set up correctly, run the tests using the following command:
```bash
npm test
```

### Step 8: Deploying to Heroku (Optional)
If you wish to deploy the application to Heroku, follow these steps:

  1. Log in to Heroku using the CLI:
  ```bash
  heroku login
  ```
  2. Create a new Heroku app:
  ```bash
  heroku create your-app-name
  ```
  3. Set the environment variables on Heroku:
  ```bash
  heroku config:set JWT_SECRET="your_jwt_secret" --app your-app-name
  heroku config:set DATABASE_NAME="your_database_name" --app your-app-name
  heroku config:set DATABASE_USER="your_database_user" --app your-app-name
  heroku config:set DATABASE_PASSWORD="your_database_password" --app your-app-name
  heroku config:set DATABASE_HOST="your_database_host" --app your-app-name
  heroku config:set AesKey="your_aes_key" --app your-app-name
  heroku config:set IV="your_initialization_vector" --app your-app-name
  heroku config:set MAILER_USERNAME="your_mailer_username" --app your-app-name
  heroku config:set MAILER_PASSWORD="your_mailer_password" --app your-app-name
  ```
  4. Deploy the application:
  ```bash
  heroku stack:set container --app your-app-name
  heroku container:login
  heroku container:push web --app your-app-name
  heroku container:release web --app your-app-name
   ```
### Troubleshooting & Additional Points
If you encounter any issues in deployment, check the logs for error messages. You can view the logs using:
```bash
heroku logs --tail --app your-app-name
```
* Postman Collection is provided for testing purpose
* Included docker-compose.yml which includes mysql db image ref for testing the application locally. Build using ```docker-compose up -d --build``` command
* ZAP proxy security scan for Active and Sql Injection scans have been shared for reference.
* Github Actions workflow attached for reference


## Conclusion

Thank you for checking out this project! We encourage you to try it out, contribute, and provide feedback. If you have any questions, suggestions, or issues, please feel free to reach out or create an issue in the repository.



# Dockerfile

# Base image for Node.js application
# Use a smaller base image for Node.js 14
FROM node:14-alpine

# Accept build-time arguments
ARG JWT_SECRET
ARG DATABASE_NAME
ARG DATABASE_USER
ARG DATABASE_PASSWORD
ARG DATABASE_HOST
ARG AesKey
ARG IV
ARG mailer_username
ARG mailer_password

# Set the environment variables for runtime
ENV JWT_SECRET=$JWT_SECRET
ENV DATABASE_NAME=$DATABASE_NAME
ENV DATABASE_USER=$DATABASE_USER
ENV DATABASE_PASSWORD=$DATABASE_PASSWORD
ENV DATABASE_HOST=$DATABASE_HOST
ENV AesKey=$AesKey
ENV IV=$IV
ENV mailer_username=$mailer_username
ENV mailer_password=$mailer_password
# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json for dependencies installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your application runs on (if applicable)
EXPOSE 3000

# Define the command to run your application
CMD ["node", "syncDB.js", "&&","node", "syncDB2.js", "&&","npm", "start"]
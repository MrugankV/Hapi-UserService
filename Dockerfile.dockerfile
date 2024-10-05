# Dockerfile
# Base image for Node.js application
FROM node:14

# Set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the application code
COPY . .

# Expose the port that your app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
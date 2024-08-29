# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory relative to your server directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install TypeScript globally (if not already in your package.json)
RUN npm install -g typescript

# Expose the port the app runs on
EXPOSE 8080

# Command to start the application
CMD ["npm", "start"]

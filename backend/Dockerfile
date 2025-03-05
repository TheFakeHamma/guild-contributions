# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first (to take advantage of Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the application port (must match the one in your backend)
EXPOSE 3001

# Start the application
CMD ["npm", "start"]

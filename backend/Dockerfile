# Use Node.js 18 base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend files
COPY . .

# Expose the port (Ensure your backend uses PORT 3001 or similar)
EXPOSE 3001

# Start the server
CMD ["npm", "start"]

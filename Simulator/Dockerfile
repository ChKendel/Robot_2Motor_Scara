# Use the official Node.js image from Docker Hub
FROM node:22

# Install Python and pip
RUN apt-get update 

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY NodeSimServer/package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY NodeSimServer/ .


# Expose the port the app runs on
#EXPOSE 5022
EXPOSE 5080

# Command to run the application
CMD ["node", "server.js"]

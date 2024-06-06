FROM node:18

# Set the working directory in the container
WORKDIR /app
# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 3101

# Command to run the application
CMD ["npm", "run", "dev"]

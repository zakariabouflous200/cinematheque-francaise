# Use an official Node.js image as the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the project files to the working directory
COPY ./ /app

# Install project dependencies
RUN npm install

# Build the React app
RUN npm run build

# Install the 'serve' package globally to serve the React app
RUN npm install -g serve

# Expose port 3000 (this is the port your app will run on)
EXPOSE 3000

# Serve the build directory
CMD ["serve", "-s", "build"]

# Specify the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

RUN npx prisma generate


# Expose the port the app runs on
EXPOSE 5000
# EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev:server"]
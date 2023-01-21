# Create a layer from the node:19 Docker image
FROM node:19

# Set /app directory as working directory
WORKDIR /usr/src/app

# Install required frontend dependencies
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD npm start
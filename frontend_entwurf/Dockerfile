# Create a layer from the node:19 Docker image
FROM node:19

# Create an application directory
RUN mkdir -p /app

# Set /app directory as working directory
WORKDIR /app

# Install required frontend dependencies
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY /public/backend/ ./
COPY /public/backend/predictions/ ./
COPY ./public/backend/ ./
COPY ./public/backend/predictions/ ./
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
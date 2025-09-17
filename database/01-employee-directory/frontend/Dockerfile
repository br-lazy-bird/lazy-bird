# Use Node.js 18 LTS
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Expose port
EXPOSE 3000

# Command will be overridden by docker-compose for development
CMD ["npm", "start"]
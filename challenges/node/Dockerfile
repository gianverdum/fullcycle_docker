FROM node:latest

WORKDIR /usr/src/app

RUN apt update && \
    apt install -y wget netcat-traditional && \
    wget -q -O /usr/bin/wait-for https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for && \
    chmod +x /usr/bin/wait-for

COPY package*.json ./

# Ensure package.json exists; create it if it doesn't
RUN if [ ! -f package.json ]; then \
      npm init -y; \
    fi && \
    # Ensure a clean state for node_modules
    rm -rf node_modules && \
    # Install required dependencies explicitly
    npm install express moniker mysql --save && \
    # Install any additional dependencies from package.json
    npm install --verbose && \
    # Ensure correct permissions for node_modules
    chmod -R 755 /usr/src/app/node_modules

# Validate that required modules exist
RUN ls -l /usr/src/app/node_modules && \
    ls /usr/src/app/node_modules/express && \
    ls /usr/src/app/node_modules/moniker && \
    ls /usr/src/app/node_modules/mysql

# Copy the rest of the application code
COPY . .

# Make the entrypoint script executable
RUN chmod +x /usr/src/app/start.sh

EXPOSE 3000

# Define the entrypoint script
ENTRYPOINT ["/usr/src/app/start.sh"]


# Stage 1: Build dependencies
# Docker File to build a image to run the Fragments page

# Base image Node version 18.13
FROM node:18.13.0@sha256:d871edd5b68105ebcbfcde3fe8c79d24cbdbb30430d9bd6251c57c56c7bd7646 AS dependencies

LABEL maintainer="Hengyi Zhao <hzhao94@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Use /app as our working directory
WORKDIR /app

# Option 1: explicit path - Copy the package.json and package-lock.json
# files into /app. NOTE: the trailing `/` on `/app/`, which tells Docker
# that `app` is a directory and not a file.
COPY package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm install

# ###############################################

# Stage 2: Build production
FROM node:18.13.0@sha256:d871edd5b68105ebcbfcde3fe8c79d24cbdbb30430d9bd6251c57c56c7bd7646 AS production

LABEL maintainer="Hengyi Zhao <hzhao94@myseneca.ca>"
LABEL description="Fragments node.js microservice"


# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy src to /app/src/
COPY ./src ./src
COPY --from=dependencies /app/package*.json .
COPY --from=dependencies /app/node_modules ./node_modules

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD npm start

# We run our service on port 8080
EXPOSE 8080

# CMD ["bash", "-c", "npm start && sleep 10 && curl -i -u user1@email.com:password1 http://localhost:$PORT/v1/fragments && sleep 5 && curl -i -u user1@email.com:password1 http://localhost:$PORT/v1/fragments"]
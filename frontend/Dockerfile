FROM node:20.6.1-slim

# Creates a directory
RUN mkdir -p /usr/src/fe-app && chown -R node:node /usr/src/fe-app

# Sets the working directory within the container
WORKDIR /usr/src/fe-app

# Copies the package.json and yarn.lock files from your local project directory into the container's working directory. 
COPY package.json yarn.lock ./

# Changes the user within the container to node
USER node

# Installs all the dependencies listed in your package.json
RUN yarn install --pure-lockfile

# Copies all remaining files from your local project directory into the container's working directory
COPY --chown=node:node . .

# Exposes port 3000 from the container
EXPOSE 4000

# Defines the default command that will be executed when the container starts
CMD ["yarn", "start"]

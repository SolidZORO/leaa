FROM mhart/alpine-node

# Set the working directory, copy dependency management files to the working directory,
# and install the dependencies
WORKDIR /app
COPY . .
RUN yarn install

COPY package.json ./
RUN yarn install

# Copy all files to the working directly, build the application
# and purge the development dependencies
COPY . .

RUN yarn run build

EXPOSE 3000

# Start the server for Next.js using Node.js
CMD ["yarn", "start"]

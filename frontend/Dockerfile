# Create image based on the official Node image from dockerhub
FROM node:25-alpine3.22
#Argument that is passed from docer-compose.yaml file
ARG FRONT_END_PORT
# Create app directory
WORKDIR /Pc/source/react-app
#Echo the argument to check passed argument loaded here correctly
RUN echo "Argument port is : $FRONT_END_PORT"
# Copy dependency definitions
COPY package.json /Pc/source/react-app
# Install dependecies
RUN npm install
# Get all the code needed to run the app
COPY . /Pc/source/react-app
# Expose the port the app runs in
EXPOSE ${FRONT_END_PORT}
# Serve the app
CMD ["npm", "start"]
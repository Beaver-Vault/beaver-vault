FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
EXPOSE 3000
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "build"]

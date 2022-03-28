FROM node:16.13.0 as build-environment
WORKDIR /app
COPY . /app/
RUN npm install
RUN npm run build

FROM httpd:latest
COPY --from=build-environment /app/dist/remote-lab-booking/ /usr/local/apache2/htdocs/

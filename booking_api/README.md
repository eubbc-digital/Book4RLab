# Booking API

This is a Django project that provides a Booking API. The Booking API allows users to create, update, and delete bookings using the admin panel.

## Requirements

To use the Booking API, you will need to have [Docker](https://docs.docker.com/get-docker/ "Docker") and docker-compose installed. Alternatively, you could install Django and Postgres 15 locally, altough it is not recomended. 

## Usage

Build docker images for Django and Postgres running the following command:

``` 
docker-compose build 
```

Propagate changes to database:

``` 
docker-compose run --rm app sh -c "python manage.py makemigrations"
docker-compose run --rm app sh -c "python manage.py migrate"
``` 

Create superuser for the admin panel:

``` 
docker-compose run --rm app sh -c "python manage.py createsuperuser"
``` 

Run API in port 8000 (do not forget to update .env files for your needs):

``` 
docker-compose up 
```

Admin panel will be available at http://localhost:8000/admin/

## Running in production

To run the Booking API in a production environment, use the following command:

``` 
docker-compose -f docker-compose.prod.yml up 
```

This command uses the 'docker-compose.prod.yml' file, which is specifically configured for production use. It is important to make sure that the necessary environment variables and configurations are set in the .env file before running the API in production.

Do not forget that in order to serve static files, such as images or stylesheets, you will need to configure your HTTP server to serve static files from Django.

First, you need to run the following command to collect the static files:

``` 
docker-compose run --rm app sh -c "python manage.py collectstatic"
```

This will collect all static files from Booking application and place them in a directory that can be served by your HTTP server.

Then, you need to configure your HTTP server to serve static files from this directory. The specific configuration will depend on the HTTP server you are using.

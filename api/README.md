# Booking API

This is a Django project that provides a Booking API. The Booking API allows users to create, update, and delete bookings using the admin panel.

## Requirements

To use the Booking API, you will need to have [Docker](https://docs.docker.com/get-docker/ "Docker") and docker-compose installed. Alternatively, you could install Django and Postgres 10 locally, altough its not recomended. 

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

Run API in port 8000:

``` 
docker-compose up 
```

Admin panel will be available at http://localhost:8000/admin/

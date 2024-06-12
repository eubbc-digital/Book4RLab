# Booking API

This is a Django project that provides a Booking API.
The Booking API allows users to manage the elements of the project via API calls or using the Django Admin Panel.

## Usage

With the repository already cloned in your system navigate to the *booking_api* directory:

```
cd Book4RLab/booking_api/
```

### Environment Setup

To ensure proper configuration of the Booking API, it's essential to create an environment file named ***.env***. 
This file will contain important environment variables necessary for seamless project execution.

This file can be adapted to setup the project either for a *development* or *production* environment.

#### Configuring .env for Development

```
### APP
DEBUG=1
SECRET_KEY='string'
DB_HOST=db
DB_NAME=string
DB_USER=string
DB_PASSWORD=string
FORCE_SCRIPT_NAME=/
STATIC_URL=/static/
UI_BASE_URL=http://localhost:4200/

### DB
POSTGRES_DB=string
POSTGRES_USER=string
POSTGRES_PASSWORD=string

### DOCKER
RESTART_POLICY=no
```

#### Configuring .env for Production

```
### APP
DEBUG=0
SECRET_KEY='string'
DB_HOST=db
DB_NAME=string
DB_USER=string
DB_PASSWORD=string
FORCE_SCRIPT_NAME=/booking/api
STATIC_URL=/booking/api/static/
UI_BASE_URL=string

### DB
POSTGRES_DB=string
POSTGRES_USER=string
POSTGRES_PASSWORD=string

### DOCKER
RESTART_POLICY=always

```

#### Environment Variables

Replace the variables that contain the value **string** with your own values.
The environment variables used for the project are explained in the following table:

| Variable            | Explanation                                                |
|---------------------|------------------------------------------------------------|
| DEBUG               | Controls debugging behavior; 0 for debugging off           |
| SECRET_KEY          | Secret key for cryptographic functions                     |
| DB_HOST             | Hostname or IP address of the database server              |
| DB_NAME             | Name of the database within the database server            |
| DB_USER             | Username for authenticating to the database server         |
| DB_PASSWORD         | Password for authenticating to the database server         |
| FORCE_SCRIPT_NAME   | Prefix for URLs in the application                         |
| STATIC_URL          | Base URL for static files served by the application        |
| UI_BASE_URL         | Base URL for the application's user interface              |
| 										| 																													 |
| POSTGRES_DB         | Name of the PostgreSQL database                            |
| POSTGRES_USER       | Username for authenticating to the PostgreSQL database     |
| POSTGRES_PASSWORD   | Password for authenticating to the PostgreSQL database     |
| 										| 																													 |
| RESTART_POLICY      | Restart policy for Docker containers                       |

You can create your own SECRET_KEY running this command:

```
docker-compose run --rm app sh -c 'python manage.py shell -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"'
```

### Running the project

Once the environment setup is done you can run the project following the next steps:

 - Build the docker images for Django and Postgres running the following command:

	``` 
	docker-compose build 
	```

 - Propagate changes to database:
  
	``` 
	docker-compose run --rm app sh -c "python manage.py makemigrations"
	docker-compose run --rm app sh -c "python manage.py migrate"
	``` 

 - Create superuser for the admin panel (If needed):

	``` 
	docker-compose run --rm app sh -c "python manage.py createsuperuser"
	``` 

 - Run API:
  
	``` 
	docker-compose up 
	```
 
	> The Django Admin Panel will be available in the path <API_URL>/admin/

## Recommendations

While running in production, do not forget that in order to serve static files, such as images or stylesheets, you will need to configure your HTTP server to serve static files from Django.

First, you need to run the following command to collect the static files:

``` 
docker-compose run --rm app sh -c "python manage.py collectstatic"
```

This will collect all static files from Booking application and place them in a directory that can be served by your HTTP server.

Then, you need to configure your HTTP server to serve static files from this directory. The specific configuration will depend on the HTTP server you are using.

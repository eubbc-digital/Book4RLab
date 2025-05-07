# Booking API

This is a Django project that provides the Booking API.
The Booking API allows users to manage the elements of the project via API calls or using the Django Admin Panel.

## Environment Setup

All environment variables are defined in a single `.env` file located in the `booking_api/` directory.
Replace the placeholders (`{value}`) with your actual configuration:

### `.env` File Template
```env
# GENERAL
ENVIRONMENT={development_or_production}

# DOCKER
RESTART_POLICY={no_or_always}

# DJANGO
DEBUG={1_or_0}
SECRET_KEY={django_secret_key}
DB_HOST={db_host}
DB_NAME={db_name}
DB_USER={db_user}
DB_PASSWORD={db_password}
FORCE_SCRIPT_NAME={/ or /booking/api}
STATIC_URL={/static/ or /booking/api/static/}
UI_BASE_URL={http://localhost:4200 or https://domain.com}
EMAIL_HOST_USER={email_user}
EMAIL_HOST_PASSWORD={email_app_password}

# POSTGRES
POSTGRES_DB={db_name}
POSTGRES_USER={db_user}
POSTGRES_PASSWORD={db_password}
```

## Environment Variables Reference

| Variable | Description | Example Values |
|----------|-------------|----------------|
| `ENVIRONMENT` | Runtime environment | `development` or `production` |
| | | |
| `RESTART_POLICY` | Container restart behavior | `no` (dev), `always` (prod) |
|  |  |  |
| `DEBUG` | Enable debug mode | `1` (on), `0` (off) |
| `SECRET_KEY` | Django secret key | Generated cryptographic key |
| `DB_HOST` | Database host address | `db` (Docker default) |
| `DB_NAME` | Database name | Must match `POSTGRES_DB` |
| `DB_USER` | Database username | Must match `POSTGRES_USER` |
| `DB_PASSWORD` | Database password | Must match `POSTGRES_PASSWORD` |
| `FORCE_SCRIPT_NAME` | API base path | `/` (dev), `/booking/api` (prod) |
| `STATIC_URL` | Static files path | `/static/` (dev), `/booking/api/static/` (prod) |
| `UI_BASE_URL` | Frontend base URL | `http://localhost:4200` (dev), `https://domain.com` (prod) |
| `EMAIL_HOST_USER` | SMTP email user | `user@example.com` |
| `EMAIL_HOST_PASSWORD` | SMTP app password | Application-specific password |
|  |  |  |
| `POSTGRES_DB` | Database name | Must match `DB_NAME` |
| `POSTGRES_USER` | Admin username | Must match `DB_USER` |
| `POSTGRES_PASSWORD` | Admin password | Must match `DB_PASSWORD` |


## Running the Project
To simplify the deployment process, a deployment script has been created. You can execute it with the following command:

```bash
  ./deploy.sh
```

This script handles building the Docker image, running migrations, and starting the project.

>**Note:** Ensure that the script has execution permissions. If not, use the following command to grant them:
>```bash
>sudo chmod +x deploy.sh
>```

## Recommendations

### Create Superuser
To manage the project via the Django Admin Panel you might need to create a superuser. To do so use this command:

```bash
docker-compose run --rm app sh -c "python manage.py createsuperuser"
```

### Static Files
Do not forget that in order to serve static files, such as images or stylesheets, you will need to configure your HTTP server to serve static files from Django.

First, you need to run the following command to collect the static files:
```bash
docker-compose run --rm app sh -c "python manage.py collectstatic"
```
This will collect all static files and place them in a directory that can be served by your HTTP server.

Then, you need to configure your HTTP server to serve static files from this directory. The specific configuration will depend on the HTTP server you are using.

The Django project (dev) can be accessed via [http://localhost:8000](http://localhost:8000)

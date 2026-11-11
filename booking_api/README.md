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

# KEYCLOAK (SSO)
KEYCLOAK_URL=https://eeda.iotecbol.com/auth
KEYCLOAK_HOST=eeda.iotecbol.com
KEYCLOAK_REALM=eeda
KEYCLOAK_ALLOWED_CLIENTS=book4rlab
KEYCLOAK_TIMEOUT=10
# Service account client that gives the instructor role when a request is approved
KEYCLOAK_ADMIN_CLIENT_ID={admin_client_id}
KEYCLOAK_ADMIN_CLIENT_SECRET={admin_client_secret}
# Team mailbox that receives instructor access requests
INSTRUCTOR_REQUEST_EMAIL={team_email}

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
| `KEYCLOAK_URL` | Keycloak issuer, one URL for token validation and server calls (dev `http://eeda.localtest.me:8080/auth`) | `https://eeda.iotecbol.com/auth` |
| `KEYCLOAK_HOST` | Host part of `KEYCLOAK_URL`, mapped to the host gateway in the app container | `eeda.iotecbol.com` |
| `KEYCLOAK_REALM` | Realm name | `eeda` |
| `KEYCLOAK_ALLOWED_CLIENTS` | Comma-separated client ids allowed to call the API | `book4rlab` |
| `KEYCLOAK_TIMEOUT` | Seconds to wait for Keycloak | `10` |
| `KEYCLOAK_ADMIN_CLIENT_ID` | Confidential client with a service account, used to give the `instructor` realm role | `book4rlab-admin` |
| `KEYCLOAK_ADMIN_CLIENT_SECRET` | Secret of that client | Client secret from Keycloak |
| `INSTRUCTOR_REQUEST_EMAIL` | Team mailbox for instructor access requests (defaults to `EMAIL_HOST_USER`) | `team@example.com` |
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

### Instructor Roles in Keycloak
Instructor access comes from the `instructor` realm role in Keycloak. On every request the API makes the local
`instructors` group match the token's roles, and blocking a user is done by disabling them in Keycloak.

Approving a request in the Django admin gives the role through the Keycloak admin API. This needs a confidential
client with service accounts enabled whose service account has the `realm-management` roles `manage-users`,
`query-users` and `view-realm`. Set its id and secret in `KEYCLOAK_ADMIN_CLIENT_ID` and `KEYCLOAK_ADMIN_CLIENT_SECRET`.

Before deploying the switch to Keycloak roles, give the role to everyone already in the local `instructors` group,
or they lose instructor access on their next sign-in:

```bash
docker-compose run --rm app sh -c "python manage.py grant_instructor_roles --dry-run"
docker-compose run --rm app sh -c "python manage.py grant_instructor_roles"
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

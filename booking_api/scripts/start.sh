#!/bin/bash
echo "ENVIRONMENT is set to: ${ENVIRONMENT:-[NOT SET]}"

if [ "$ENVIRONMENT" = "production" ]; then
  echo "Starting in production mode..."
  python manage.py wait_for_db
  gunicorn --bind 0.0.0.0:8000 --workers=2 --timeout 120 app.wsgi:application
elif [ "$ENVIRONMENT" = "development" ]; then
  echo "Starting in development mode..."
  python manage.py wait_for_db
  gunicorn --bind 0.0.0.0:8000 --reload --workers=2 --timeout 120 app.wsgi:application
else
  echo "[ERROR] ENVIRONMENT must be 'development' or 'production'."
  exit 1
fi

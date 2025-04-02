FROM python:3.8
ENV PYTHONUNBUFFERED 1

# Copy the requirements and packages files
COPY ./requirements.txt /requirements.txt
COPY ./packages.txt /tmp/packages.txt
RUN [ -f /tmp/packages.txt ] && sed -i 's/\r$//' /tmp/packages.txt && \
  [ -f /requirements.txt ] && sed -i 's/\r$//' /requirements.txt

# Install system packages and Python dependencies
RUN apt-get update && \
  xargs -a /tmp/packages.txt apt-get install -y && \
  rm -rf /var/lib/apt/lists/* && \
  pip install --no-cache-dir -r /requirements.txt && \
  rm /tmp/packages.txt

# Set up the application directory and copy the application files
RUN mkdir /app /scripts
COPY ./app/ /app
COPY ./scripts/start.sh /scripts/start.sh
RUN sed -i 's/\r$//' /scripts/start.sh && chmod +x /scripts/start.sh

WORKDIR /app

CMD ["sh", "/scripts/start.sh"]

FROM python:3.8

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /requirements.txt
RUN apt-get update
RUN apt-get install -y postgresql-client gcc libc-dev ffmpeg libglib2.0.0 libsm6 libxext6 libxrender-dev netcat-traditional
RUN pip install -r /requirements.txt

RUN mkdir /app
WORKDIR /app
COPY ./app/ /app

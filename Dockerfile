FROM ubuntu:20.04

# Install basic dependencies
RUN apt update && apt upgrade -y
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get -y install tzdata
RUN apt install -y software-properties-common python3-pip
RUN python3 -m pip install pipenv
ENV PIPENV_VENV_IN_PROJECT=1

# copy and install dependencies
RUN mkdir .venv/
COPY Pipfile .
COPY Pipfile.lock .
RUN pipenv sync

# Copy application
COPY static/ ./static
COPY templates/ ./templates
COPY LICENSE .
COPY main.py .

# Expose the application port
EXPOSE 80

# Start
CMD pipenv run gunicorn --bind 0.0.0.0:80 --reload main:app
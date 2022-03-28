# Ballz - Linear Algebra Version
This is a HTML5/JavaScript game that replicates the popular [Ballz](https://play.google.com/store/apps/details?id=com.ketchapp.ballz&hl=en_US&gl=US) game, but adds some more powerups and incorporates linear algebra problem-solving in activating acquired powerups.

## Running
Setup the Python environment for the server using `pipenv sync` and run the webserver using `pipenv run gunicorn --bind host:port main:app`. I recommend you run this as a system service for convenience (e.g. using a `systemd` unit) and using a reverse proxy such as `apache2`, `nginx`, or `caddy` in front of the `gunicorn` server for better control.
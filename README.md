# Ballz - Linear Algebra Version
This is a HTML5/JavaScript game that replicates the popular [Ballz](https://play.google.com/store/apps/details?id=com.ketchapp.ballz&hl=en_US&gl=US) game, but adds some more powerups and incorporates linear algebra problem-solving in activating acquired powerups.

## Running
Build a Docker container using the provided Dockerfile and run with the compose file. The compose file sets the "cheat" variable that allows answers to problems to be revealed at /cheat. 

ALTERNATIVELY:
Setup the Python environment for the server using `pipenv sync` and run the webserver using `pipenv run gunicorn --bind host:port main:app`. I recommend you run this as a system service for convenience (e.g. using a `systemd` unit) and using a reverse proxy such as `apache2`, `nginx`, or `caddy` in front of the `gunicorn` server for better control.

**DEMO: I am hosting this site (deployed via the Dockerfile/compose method) at [linalg.stevensu.dev](https://linalg.stevensu.dev)**

## License
The code written by me in the repository is licensed under the AGPL v3 license, the text of which is included. Content by other parties (e.g. Bootstrap, sound effects, etc.) retain their original licenses and permissions. 

## Note
The [Github](https://github.com/lakewood999/linalg-game) repository currently (automatically) mirrors that on my personal [Gitlab](https://git.stevensu.dev/lakewood999/linalg-game). This may change in the future, but for the present, the Gitlab is the guiding repo. 

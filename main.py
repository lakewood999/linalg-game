from flask import Flask, request, render_template
import datetime, io, json, sympy

app = Flask(__name__)

#pipenv run gunicorn --bind 127.0.0.1:8000 main:app

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run()

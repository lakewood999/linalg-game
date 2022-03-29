"""
Copyright 2022 Steven Su

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
"""
from flask import Flask, request, render_template, session, jsonify, send_from_directory
import datetime, io, json, sympy, os
from random import randint

app = Flask(__name__)
app.secret_key = 'jfjsfS)DF0sF(H)#HODFJSLKDFJSL'

#pipenv run gunicorn --bind 127.0.0.1:8000 main:app

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico')

def matrix_to_latex(m):
    s = "\\begin{bmatrix}"
    for i in range(len(m)):
        r = ""
        for j in range(len(m[i])):
            r += str(m[i][j])
            if j != len(m[i])-1:
                r += "&"
        s += r
        if i != len(m)-1:
            s += "\\\\"
    return s + "\\end{bmatrix}"

def gen_matrix(n=2,nn=-1):
    if nn == -1:
        nn = n
    m = []
    for i in range(n):
        t = []
        for j in range(nn):
            t.append(randint(-7,7))
        m.append(t)
    return m
    
def gen_sol(n=2):
    m = []
    s = 0
    for i in range(n):
        v = randint(-7,7)
        s += v
        m.append([v])
    return m, s

def determinant_problem(n=2):
    m = gen_matrix(n)
    mm = sympy.Matrix(m)
    return matrix_to_latex(m), str(mm.det())

def inner_product_problem(n):
    a = gen_matrix(n,1)
    b = gen_matrix(n,1)
    return [a,b], (sympy.Matrix(a).T * sympy.Matrix(b))[0]

def matrix_power_problem(n,k):
    a = gen_matrix(n)
    return a, sum(sympy.Matrix(a)**k)

def num_pivots(m):
    num_pivots = len(sympy.Matrix(m).rref()[1])
    return num_pivots


@app.route("/")
def home():
    return render_template("index.html")
    
@app.route("/problem")
def problem():
    n = randint(2,3)
    session["checks"] = 3
    if "easy" in request.args and request.args["easy"] == "true":
        n = 2
    num = randint(0,3)
    if num == 0: # 2x2 determinant
        t, a = determinant_problem(n)
        session["answer"] = a
        return jsonify({"text":t,"type":"determinant"})
    elif num == 1: # 2 variable system
        while True:
            A = gen_matrix(n)
            sol, ans = gen_sol(n)
            b = sympy.Matrix(A) *sympy.Matrix(sol)
            if num_pivots(A) == n:
                break
        session["answer"] = ans
        t = ""
        r = randint(0,1)
        if r == 0:
            t = matrix_to_latex(A) + "\mathbf{x}=" + matrix_to_latex(b.tolist())
        elif r == 1:
            b = b.tolist()
            t = "\\begin{cases}"
            for row in range(len(A)):
                temp = ""
                for col in range(len(A[0])):
                    temp += str(A[row][col]) + "x_{" + str(col+1) + "}"
                    if col != len(A[0])-1:
                        temp += "+"
                temp += "=" + str(b[row][0])
                t += temp + "\\\\"
            t += "\\end{cases}"
        return jsonify({"text":t,"type":"matrix_equation"})
    elif num == 2: # inner product
        matrices, ans = inner_product_problem(randint(2,4))
        session["answer"] = int(ans)
        res = {"text":"\mathbf{u}=" + matrix_to_latex(matrices[0]) + " \\textrm{ and } \mathbf{v}=" + matrix_to_latex(matrices[1]),"type":"inner_product"}
        return jsonify({"text":"\mathbf{u}=" + matrix_to_latex(matrices[0]) + " \\textrm{ and } \mathbf{v}=" + matrix_to_latex(matrices[1]),"type":"inner_product"})
    elif num == 3: # matrix power
        k = 2#randint(2,4)
        m, ans = matrix_power_problem(2,k)
        session["answer"] = int(ans)
        res = {"text":matrix_to_latex(m)+"^"+str(k),"type":"matrix_power"}
        return jsonify(res)

@app.route("/check")
def check():
    if "answer" not in request.args:
        return jsonify({"result":"error"})
    else:
        if session["answer"] == "":
            return jsonify({"result":"locked"}) # too many guesses; wrong answer
        try:
            a = float(session["answer"])
            b = float(request.args["answer"])
            if a == b:
                return jsonify({"result":"correct"})
            else:
                a = ""
                session["checks"] -= 1
                if session["checks"] == 0:
                    a = session["answer"]
                    session["answer"] = ""
                return jsonify({"result":"wrong","actual":a})
        except:
            return jsonify({"result":"error"})
            
@app.route("/cheat")
def cheat():
    # very rudimentary cheat enable/disable
    f=open(os.path.join(app.root_path, 'cheat.txt')))
    if f.read().strip() == "true":
        return jsonify({"answer":session.get("answer")})
    return jsonify({"answer":"cheating is disabled"})

if __name__ == "__main__":
    app.run()

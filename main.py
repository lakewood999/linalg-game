from flask import Flask, request, render_template, session, jsonify
import datetime, io, json, sympy
from random import randint

app = Flask(__name__)
app.secret_key = 'jfjsfS)DF0sF(H)#HODFJSLKDFJSL'

#pipenv run gunicorn --bind 127.0.0.1:8000 main:app

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
            t.append(randint(-10,10))
        m.append(t)
    return m
    
def gen_sol(n=2):
    m = []
    s = 0
    for i in range(n):
        v = randint(-10,10)
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

@app.route("/")
def home():
    return render_template("index.html")
    
@app.route("/problem")
def problem():
    num = randint(0,5)
    print(num)
    if num == 0: # 2x2 determinant
        t, a = determinant_problem(2)
        session["answer"] = a
        return jsonify({"text":t,"type":"determinant"})
    elif num == 1: # 3x3 determinant
        t, a = determinant_problem(3)
        session["answer"] = a
        return jsonify({"text":t,"type":"determinant"})
    elif num == 2: # 2 variable system
        A = gen_matrix()
        sol, ans = gen_sol()
        b = sympy.Matrix(A) *sympy.Matrix(sol)
        session["answer"] = ans
        return jsonify({"text":matrix_to_latex(A) + "\mathbf{x}=" + matrix_to_latex(b.tolist()),"type":"matrix_equation"})
    elif num == 3: # 3 variable system
        A = gen_matrix(3)
        sol, ans = gen_sol(3)
        session["answer"] = ans
        b = sympy.Matrix(A) *sympy.Matrix(sol)
        return jsonify({"text":matrix_to_latex(A) + "\mathbf{x}=" + matrix_to_latex(b.tolist()),"type":"matrix_equation"})
    elif num == 4: # inner product
        matrices, ans = inner_product_problem(randint(2,4))
        session["answer"] = int(ans)
        res = {"text":"\mathbf{u}=" + matrix_to_latex(matrices[0]) + " \\textrm{ and } \mathbf{v}=" + matrix_to_latex(matrices[1]),"type":"inner_product"}
        print(res)
        return jsonify({"text":"\mathbf{u}=" + matrix_to_latex(matrices[0]) + " \\textrm{ and } \mathbf{v}=" + matrix_to_latex(matrices[1]),"type":"inner_product"})
    elif num == 5: # matrix power
        k = randint(2,4)
        m, ans = matrix_power_problem(2,k)
        session["answer"] = int(ans)
        res = {"text":matrix_to_latex(m)+"^"+str(k),"type":"matrix_power"}
        print(res)
        return jsonify(res)
        

@app.route("/check")
def check():
    if "answer" not in request.args:
        return jsonify({"result":"error"})
    else:
        if session["answer"] == "":
            return jsonify({"result":"locked"}) # if we previously have a wrong result, then we lock out since the answer is revealed
        try:
            a = float(session["answer"])
            b = float(request.args["answer"])
            if a == b:
                return jsonify({"result":"correct"})
            else:
                a = session["answer"]
                session["answer"] = ""
                return jsonify({"result":"wrong","actual":a})
        except:
            return jsonify({"result":"error"})
            
@app.route("/cheat")
def cheat():
    return jsonify({"answer":session.get("answer")})

if __name__ == "__main__":
    app.run()

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Backend funcionando!"

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    senha = data.get("senha")
    if email == "teste@teste.com" and senha == "123":
        return jsonify({"token": "fake-jwt-token", "nome": "Teste"})
    return jsonify({"erro": "Email ou senha inválidos"}), 401

if __name__ == "__main__":
    app.run()
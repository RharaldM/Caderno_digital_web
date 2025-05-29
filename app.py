import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
import psycopg2
from dotenv import load_dotenv
import hashlib

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'supersecret')
jwt = JWTManager(app)

DB_CONFIG = {
    'host': os.getenv('DATABASE_HOST'),
    'port': os.getenv('DATABASE_PORT'),
    'database': os.getenv('DATABASE_NAME'),
    'user': os.getenv('DATABASE_USER'),
    'password': os.getenv('DATABASE_PASSWORD')
}

def conectar_banco():
    return psycopg2.connect(**DB_CONFIG)

@app.route('/api/cadastrar', methods=['POST'])
def cadastrar():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')
    nome = data.get('nome')
    if not email or not senha or not nome:
        return jsonify({'erro': 'Preencha todos os campos.'}), 400
    senha_hash = hashlib.sha256(senha.encode()).hexdigest()
    try:
        conn = conectar_banco()
        cursor = conn.cursor()
        cursor.execute(
            '''
            INSERT INTO usuarios (email, senha, nome)
            VALUES (%s, %s, %s)
            RETURNING id
            ''',
            (email, senha_hash, nome)
        )
        usuario_id = cursor.fetchone()[0]
        conn.commit()
        conn.close()
        return jsonify({'msg': 'Usuário cadastrado!', 'id': usuario_id})
    except Exception as e:
        return jsonify({'erro': f'Erro ao cadastrar: {str(e)}'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')
    senha_hash = hashlib.sha256(senha.encode()).hexdigest()
    try:
        conn = conectar_banco()
        cursor = conn.cursor()
        cursor.execute(
            '''
            SELECT id, nome FROM usuarios WHERE email = %s AND senha = %s
            ''', (email, senha_hash)
        )
        usuario = cursor.fetchone()
        conn.close()
        if usuario:
            access_token = create_access_token(identity={'id': usuario[0], 'nome': usuario[1]})
            return jsonify({'token': access_token, 'nome': usuario[1]})
        return jsonify({'erro': 'Email ou senha inválidos.'}), 401
    except Exception as e:
        return jsonify({'erro': f'Erro ao fazer login: {str(e)}'}), 500

@app.route('/api/notas', methods=['GET'])
@jwt_required()
def notas():
    user = get_jwt_identity()
    usuario_id = user['id']
    try:
        conn = conectar_banco()
        cursor = conn.cursor()
        cursor.execute(
            '''
            SELECT id, titulo, conteudo, cor, imagens, data
            FROM notas
            WHERE usuario_id = %s
            ORDER BY data DESC
            ''', (usuario_id,)
        )
        notas = cursor.fetchall()
        conn.close()
        notas_list = [
            {
                "id": n[0],
                "titulo": n[1],
                "conteudo": n[2],
                "cor": n[3],
                "imagens": n[4],
                "data": n[5].isoformat() if n[5] else None,
            }
            for n in notas
        ]
        return jsonify(notas_list)
    except Exception as e:
        return jsonify({'erro': f'Erro ao obter notas: {str(e)}'}), 500

@app.route('/api/criar_nota', methods=['POST'])
@jwt_required()
def criar_nota():
    user = get_jwt_identity()
    usuario_id = user['id']
    data = request.get_json()
    titulo = data.get('titulo', '')
    conteudo = data.get('conteudo', '')
    cor = data.get('cor', '#fff')
    imagens = data.get('imagens', '')
    try:
        conn = conectar_banco()
        cursor = conn.cursor()
        cursor.execute(
            '''
            INSERT INTO notas (usuario_id, titulo, conteudo, cor, imagens)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
            ''',
            (usuario_id, titulo, conteudo, cor, imagens)
        )
        nota_id = cursor.fetchone()[0]
        conn.commit()
        conn.close()
        return jsonify({'msg': 'Nota criada', 'id': nota_id})
    except Exception as e:
        return jsonify({'erro': f'Erro ao criar nota: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
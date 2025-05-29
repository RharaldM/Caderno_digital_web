import hashlib
import psycopg2
from psycopg2 import sql
import os
from dotenv import load_dotenv

load_dotenv()

# Configuração do banco de dados
DB_CONFIG = {
    'host': os.getenv('DATABASE_HOST'),
    'port': os.getenv('DATABASE_PORT'),
    'database': os.getenv('DATABASE_NAME'),
    'user': os.getenv('DATABASE_USER'),
    'password': os.getenv('DATABASE_PASSWORD')
}

def conectar_banco():
    return psycopg2.connect(**DB_CONFIG)

def cadastrar_usuario(email, senha, nome):
    try:
        conn = conectar_banco()
        cursor = conn.cursor()
        
        # Hash da senha
        senha_hash = hashlib.sha256(senha.encode()).hexdigest()
        
        # Insere novo usuário
        cursor.execute('''
            INSERT INTO usuarios (email, senha, nome)
            VALUES (%s, %s, %s)
            RETURNING id
        ''', (email, senha_hash, nome))
        
        usuario_id = cursor.fetchone()[0]
        conn.commit()
        conn.close()
        return usuario_id
    except Exception as e:
        print(f"Erro ao cadastrar usuário: {e}")
        return None

def verificar_login(email, senha):
    try:
        conn = conectar_banco()
        cursor = conn.cursor()
        
        # Hash da senha
        senha_hash = hashlib.sha256(senha.encode()).hexdigest()
        
        # Verifica se o usuário existe
        cursor.execute('''
            SELECT id, nome
            FROM usuarios
            WHERE email = %s AND senha = %s
        ''', (email, senha_hash))
        
        usuario = cursor.fetchone()
        conn.close()
        
        if usuario:
            return {'id': usuario[0], 'nome': usuario[1]}
        return None
    except Exception as e:
        print(f"Erro ao verificar login: {e}")
        return None

def obter_notas(usuario_id):
    try:
        conn = conectar_banco()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, titulo, conteudo, cor, imagens, data
            FROM notas
            WHERE usuario_id = %s
            ORDER BY data DESC
        ''', (usuario_id,))
        
        notas = cursor.fetchall()
        conn.close()
        
        return notas
    except Exception as e:
        print(f"Erro ao obter notas: {e}")
        return []

def criar_nota(usuario_id, titulo, conteudo, cor, imagens):
    try:
        conn = conectar_banco()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO notas (usuario_id, titulo, conteudo, cor, imagens)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        ''', (usuario_id, titulo, conteudo, cor, imagens))
        
        nota_id = cursor.fetchone()[0]
        conn.commit()
        conn.close()
        
        return nota_id
    except Exception as e:
        print(f"Erro ao criar nota: {e}")
        return None

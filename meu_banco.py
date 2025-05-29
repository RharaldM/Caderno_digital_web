import psycopg2
from psycopg2 import sql
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

# Configuração do banco de dados PostgreSQL usando variáveis de ambiente
DB_CONFIG = {
    'host': os.getenv('DATABASE_HOST'),
    'port': os.getenv('DATABASE_PORT'),
    'database': os.getenv('DATABASE_NAME'),
    'user': os.getenv('DATABASE_USER'),
    'password': os.getenv('DATABASE_PASSWORD')
}

# Conecta ao banco PostgreSQL
conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor()

# Cria tabela de usuários
cursor.execute('''
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  nome TEXT NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')
conn.commit()

# Cria tabela de notas com referência ao usuário
cursor.execute('''
CREATE TABLE IF NOT EXISTS notas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  titulo TEXT,
  conteudo TEXT,
  cor TEXT,
  imagens TEXT,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')
conn.commit()

# Insere uma nota
cursor.execute('''
INSERT INTO notas (titulo, conteudo, cor, imagens)
VALUES (%s, %s, %s, %s)
''', ('Exemplo', 'Conteúdo', '#fff', 'imagem1.png'))
conn.commit()

# Busca notas
cursor.execute('SELECT * FROM notas')
for row in cursor.fetchall():
    print(row)

conn.close()
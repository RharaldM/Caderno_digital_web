import sqlite3

# Cria/abre o banco em arquivo
conn = sqlite3.connect('meu_banco.db')
cursor = conn.cursor()

# Cria tabela
cursor.execute('''
CREATE TABLE IF NOT EXISTS notas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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
VALUES (?, ?, ?, ?)
''', ('Exemplo', 'Conteúdo', '#fff', 'imagem1.png'))
conn.commit()

# Busca notas
cursor.execute('SELECT * FROM notas')
for row in cursor.fetchall():
    print(row)

conn.close()
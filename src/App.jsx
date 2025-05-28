  import React, { useState } from 'react';
import NotaForm from './components/NotaForm';
import NotaItem from './components/NotaItem';
import './App.css';

function App() {
  const [notas, setNotas] = useState(() => {
    const saved = localStorage.getItem('notas');
    return saved ? JSON.parse(saved) : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notaEditando, setNotaEditando] = useState(null);

  const excluirTodas = () => {
    if (window.confirm('Tem certeza que deseja excluir todas as notas?')) {
      setNotas([]);
      localStorage.removeItem('notas');
    }
  };

  const salvarNota = (novaNota) => {
    if (
      (!novaNota.titulo || !novaNota.titulo.trim()) &&
      (!novaNota.conteudo && !novaNota.texto) &&
      (!novaNota.imagensBase64 || novaNota.imagensBase64.length === 0)
    ) {
      alert('Digite um título, conteúdo ou insira uma imagem para salvar.');
      return;
    }

    const novaNotaPadronizada = {
      id: novaNota.id,
      titulo: novaNota.titulo,
      conteudo: novaNota.conteudo,
      data: new Date().toLocaleString(),
      cor: novaNota.cor,
      imagensBase64: novaNota.imagensBase64
    };

    const novasNotas = notaEditando
      ? notas.map(n => n.id === notaEditando.id ? novaNotaPadronizada : n)
      : [...notas, novaNotaPadronizada];

    setNotas(novasNotas);
    localStorage.setItem('notas', JSON.stringify(novasNotas));
    setIsFormOpen(false);
    setNotaEditando(null);
  };

  const excluirNota = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
      const novasNotas = notas.filter(n => n.id !== id);
      setNotas(novasNotas);
      localStorage.setItem('notas', JSON.stringify(novasNotas));
    }
  };

  const abrirFormulario = (nota = null) => {
    setIsFormOpen(true);
    setNotaEditando(nota || null);
  };

  const fecharFormulario = () => {
    setIsFormOpen(false);
    setNotaEditando(null);
  };

  return (
    <div className="app">
      <h1>Caderno Digital</h1>
      
      <button onClick={() => abrirFormulario()} className="btn btn-azul">
        Nova Nota
      </button>

      {isFormOpen && (
        <NotaForm
          onSubmit={salvarNota}
          onCancel={fecharFormulario}
          nota={notaEditando}
        />
      )}

      <h2>Notas Salvas</h2>
      <button onClick={excluirTodas} className="btn btn-vermelho">
        Excluir Todas as Notas
      </button>

      <div className="notas-lista">
        {notas.length === 0 ? (
          <p>Nenhuma nota encontrada</p>
        ) : (
          notas.map(nota => (
            <NotaItem
              key={nota.id}
              nota={nota}
              onEdit={abrirFormulario}
              onDelete={excluirNota}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import NotaForm from './components/NotaForm';
import NotaItem from './components/NotaItem';
import Toast from './components/Toast';
import FullscreenImage from './components/FullscreenImage';
import { getNotas, saveNotas, clearNotas } from './utils/storage';
import './App.css';

function App() {
  const [notas, setNotas] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notaEditando, setNotaEditando] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [fullscreenImg, setFullscreenImg] = useState({ src: '', alt: '' });
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('maisRecente');
  const unsavedRef = useRef(false);

  // Carregar notas do localStorage ao iniciar
  useEffect(() => {
    setNotas(getNotas());
  }, []);

  // Salvar notas sempre que houver alteração
  useEffect(() => {
    saveNotas(notas);
  }, [notas]);

  // Confirmação de saída se houver alterações não salvas
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedRef.current) {
        e.preventDefault();
        e.returnValue = "Você tem alterações não salvas.";
        return "Você tem alterações não salvas.";
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Excluir todas as notas
  const excluirTodas = useCallback(() => {
    if (window.confirm('Tem certeza que deseja excluir todas as notas?')) {
      setNotas([]);
      clearNotas();
      setToast({ message: 'Todas as notas foram removidas.', type: 'success' });
    }
  }, []);

  // Salvar ou editar nota
  const salvarNota = useCallback(
    (novaNota) => {
      let notaFinal = { ...novaNota };
      if (!notaFinal.id) notaFinal.id = uuidv4();
      notaFinal.data =
        notaEditando && notaEditando.id === notaFinal.id
          ? notaEditando.data // preserva data original
          : new Date().toLocaleString();

      setNotas((prevNotas) =>
        notaEditando
          ? prevNotas.map((n) => (n.id === notaEditando.id ? { ...notaFinal } : n))
          : [...prevNotas, notaFinal]
      );
      setIsFormOpen(false);
      setNotaEditando(null);
      setToast({
        message: notaEditando ? 'Nota editada com sucesso!' : 'Nota criada com sucesso!',
        type: 'success',
      });
    },
    [notaEditando]
  );

  // Excluir uma nota
  const excluirNota = useCallback((id) => {
    if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
      setNotas((prevNotas) => prevNotas.filter((n) => n.id !== id));
      setToast({ message: 'Nota excluída.', type: 'success' });
    }
  }, []);

  // Abrir formulário (novo ou editar)
  const abrirFormulario = useCallback((nota = null) => {
    setIsFormOpen(true);
    setNotaEditando(nota || null);
    unsavedRef.current = false;
  }, []);

  // Fechar formulário com confirmação se houver alterações não salvas
  const fecharFormulario = useCallback(() => {
    if (unsavedRef.current) {
      if (!window.confirm("Você tem alterações não salvas. Deseja realmente sair?")) {
        return;
      }
    }
    setIsFormOpen(false);
    setNotaEditando(null);
    unsavedRef.current = false;
  }, []);

  // Busca e ordenação
  const notasFiltradas = useMemo(() => {
    let filtradas = notas.filter(
      (n) =>
        n.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        n.conteudo.toLowerCase().includes(busca.toLowerCase())
    );
    if (ordenacao === 'maisRecente') {
      filtradas = filtradas.sort((a, b) => new Date(b.data) - new Date(a.data));
    } else if (ordenacao === 'alfabetica') {
      filtradas = filtradas.sort((a, b) => a.titulo.localeCompare(b.titulo));
    }
    return filtradas;
  }, [notas, busca, ordenacao]);

  // Fechar toast
  const fecharToast = useCallback(() => {
    setToast({ message: '', type: 'success' });
  }, []);

  // Abrir imagem em tela cheia
  const abrirImagemFullscreen = useCallback((src, alt) => {
    setFullscreenImg({ src, alt });
  }, []);

  const fecharImagemFullscreen = useCallback(() => {
    setFullscreenImg({ src: '', alt: '' });
  }, []);

  return (
    <main className="app" role="main">
      <h1>Caderno Digital</h1>

      <section className="botoes-topo">
        <button
          onClick={() => abrirFormulario()}
          className="btn btn-azul"
          aria-label="Criar nova nota"
        >
          Nova Nota
        </button>
        <button
          onClick={excluirTodas}
          className="btn btn-vermelho"
          aria-label="Excluir todas as notas"
        >
          Excluir Todas as Notas
        </button>
      </section>

      <section className="busca-filtros">
        <input
          type="text"
          placeholder="Buscar notas..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          aria-label="Buscar notas"
        />
        <select
          value={ordenacao}
          onChange={e => setOrdenacao(e.target.value)}
          aria-label="Ordenar notas"
        >
          <option value="maisRecente">Mais Recentes</option>
          <option value="alfabetica">A-Z</option>
        </select>
      </section>

      {isFormOpen && (
        <NotaForm
          onSubmit={salvarNota}
          onCancel={fecharFormulario}
          nota={notaEditando}
          unsavedRef={unsavedRef}
        />
      )}

      <h2>Notas Salvas</h2>
      <div className="notas-lista">
        {notasFiltradas.length === 0 ? (
          <p>Nenhuma nota encontrada</p>
        ) : (
          notasFiltradas.map(nota => (
            <NotaItem
              key={nota.id}
              nota={nota}
              onEdit={abrirFormulario}
              onDelete={excluirNota}
              onImageClick={abrirImagemFullscreen}
            />
          ))
        )}
      </div>

      <Toast message={toast.message} type={toast.type} onClose={fecharToast} />

      {fullscreenImg.src && (
        <FullscreenImage src={fullscreenImg.src} alt={fullscreenImg.alt} onClose={fecharImagemFullscreen} />
      )}
    </main>
  );
}

export default App;
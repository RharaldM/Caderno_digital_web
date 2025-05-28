import React, { useState } from 'react';
import './NotaForm.css';

function NotaForm({ onSubmit, onCancel, nota = null }) {
  const [titulo, setTitulo] = useState(nota?.titulo || '');
  const [conteudo, setConteudo] = useState(nota?.conteudo || nota?.texto || '');
  const [cor, setCor] = useState(nota?.cor || '#fff');
  const [imagensBase64, setImagensBase64] = useState(nota?.imagensBase64 || []);

  const handleImagemUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagensBase64(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removerImagem = (index) => {
    setImagensBase64(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: nota?.id || Date.now().toString() + Math.random().toString().slice(2),
      titulo,
      conteudo,
      cor,
      imagensBase64
    });
  };

  return (
    <div className="nota-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titulo">Título:</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="conteudo">Conteúdo:</label>
          <textarea
            id="conteudo"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cor">Cor de Fundo:</label>
          <input
            type="color"
            id="cor"
            value={cor}
            onChange={(e) => setCor(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="imagem">Imagem:</label>
          <input
            type="file"
            id="imagem"
            accept="image/*"
            onChange={handleImagemUpload}
          />
        </div>

        {imagensBase64.length > 0 && (
          <div className="imagens-preview">
            {imagensBase64.map((src, index) => (
              <div key={index} className="imagem-preview-item">
                <img src={src} alt="Preview" />
                <button onClick={() => removerImagem(index)}>Remover</button>
              </div>
            ))}
          </div>
        )}

        <div className="form-actions">
          <button type="submit">Salvar</button>
          <button type="button" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default NotaForm;

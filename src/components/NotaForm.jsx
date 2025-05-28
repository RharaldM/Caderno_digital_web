import React, { useState, useRef, useEffect } from 'react';
import './NotaForm.css';

function NotaForm({ onSubmit, onCancel, nota = null, unsavedRef }) {
  const [titulo, setTitulo] = useState(nota?.titulo || '');
  const [conteudo, setConteudo] = useState(nota?.conteudo || nota?.texto || '');
  const [cor, setCor] = useState(nota?.cor || '#fff');
  const [imagensBase64, setImagensBase64] = useState(nota?.imagensBase64 || []);
  const [errors, setErrors] = useState({});
  const inputTitulo = useRef();

  useEffect(() => {
    inputTitulo.current?.focus();
  }, []);

  // Marca alterações não salvas
  useEffect(() => {
    if (unsavedRef) unsavedRef.current = true;
    // eslint-disable-next-line
  }, [titulo, conteudo, cor, imagensBase64]);

  const handleImagemUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagensBase64(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  const removerImagem = (index) => {
    setImagensBase64(prev => prev.filter((_, i) => i !== index));
  };

  function validate() {
    const newErrors = {};
    if (!titulo.trim() && !conteudo.trim() && imagensBase64.length === 0) {
      newErrors.form = "Preencha título, conteúdo ou insira uma imagem.";
    }
    if (titulo.length > 50) newErrors.titulo = "O título deve ter até 50 caracteres.";
    if (conteudo.length > 1000) newErrors.conteudo = "O conteúdo deve ter até 1000 caracteres.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (unsavedRef) unsavedRef.current = false;
    onSubmit({
      id: nota?.id,
      titulo,
      conteudo,
      cor,
      imagensBase64
    });
  };

  return (
    <div className="nota-form" role="dialog" aria-modal="true">
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
          <label htmlFor="titulo">Título:</label>
          <input
            ref={inputTitulo}
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={50}
            placeholder="Digite o título da nota"
            aria-describedby={errors.titulo ? "titulo-erro" : undefined}
          />
          {errors.titulo && <div className="erro" id="titulo-erro">{errors.titulo}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="conteudo">Conteúdo:</label>
          <textarea
            id="conteudo"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            maxLength={1000}
            placeholder="Digite seu conteúdo aqui"
            aria-describedby={errors.conteudo ? "conteudo-erro" : undefined}
          />
          {errors.conteudo && <div className="erro" id="conteudo-erro">{errors.conteudo}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="cor">Cor de Fundo:</label>
          <input
            type="color"
            id="cor"
            value={cor}
            onChange={(e) => setCor(e.target.value)}
            aria-label="Escolha a cor de fundo"
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
                <img src={src} alt={`Preview ${index + 1}`} />
                <button
                  type="button"
                  title="Remover imagem"
                  aria-label={`Remover imagem ${index + 1}`}
                  onClick={() => removerImagem(index)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}

        {errors.form && <div className="erro">{errors.form}</div>}

        <div className="form-actions">
          <button type="submit">Salvar</button>
          <button type="button" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default NotaForm;
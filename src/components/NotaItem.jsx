import React from 'react';
import './NotaItem.css';

function NotaItem({ nota, onEdit, onDelete }) {
  return (
    <div className="nota-item" style={{ backgroundColor: nota.cor }}>
      <h3>{nota.titulo}</h3>
      <p>{nota.conteudo}</p>
      <div className="nota-actions">
        <button onClick={() => onEdit(nota)}>Editar</button>
        <button onClick={() => onDelete(nota.id)}>Excluir</button>
      </div>
      {nota.imagensBase64 && nota.imagensBase64.length > 0 && (
        <div className="nota-imagens">
          {nota.imagensBase64.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Imagem da nota"
              onClick={() => abrirImagemFullscreen(img)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function abrirImagemFullscreen(src) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0,0,0,0.98)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = 99999;
  overlay.style.cursor = 'zoom-out';

  const img = document.createElement('img');
  img.src = src;
  img.style.maxWidth = '98vw';
  img.style.maxHeight = '98vh';
  img.style.boxShadow = '0 0 18px #000';
  img.style.borderRadius = '12px';

  function fechar() {
    document.body.removeChild(overlay);
    document.removeEventListener('keydown', onKeyDown);
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') fechar();
  }

  overlay.onclick = (e) => {
    if (e.target === overlay) fechar();
  };

  document.addEventListener('keydown', onKeyDown);
  overlay.appendChild(img);
  document.body.appendChild(overlay);
}

export default NotaItem;

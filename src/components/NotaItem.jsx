import React, { useCallback } from 'react';
import './NotaItem.css';

function NotaItem({ nota, onEdit, onDelete, onImageClick }) {
  const handleEdit = useCallback(() => onEdit(nota), [nota, onEdit]);
  const handleDelete = useCallback(() => onDelete(nota.id), [nota, onDelete]);

  return (
    <div className="nota-item" style={{ backgroundColor: nota.cor }}>
      <h3>{nota.titulo}</h3>
      <p>{nota.conteudo}</p>
      {nota.data && (
        <div className="nota-data" aria-label={`Data da nota: ${nota.data}`}>{nota.data}</div>
      )}
      <div className="nota-actions">
        <button onClick={handleEdit} aria-label="Editar nota">Editar</button>
        <button onClick={handleDelete} aria-label="Excluir nota">Excluir</button>
      </div>
      {nota.imagensBase64 && nota.imagensBase64.length > 0 && (
        <div className="nota-imagens">
          {nota.imagensBase64.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Imagem da nota ${nota.titulo || ''} - ${index + 1}`}
              tabIndex={0}
              style={{ outline: 'none' }}
              aria-label="Clique para ampliar a imagem"
              onClick={() => onImageClick(img, `Imagem da nota ${nota.titulo || ''} - ${index + 1}`)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') onImageClick(img, `Imagem da nota ${nota.titulo || ''} - ${index + 1}`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(NotaItem);
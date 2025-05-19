import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styles from '../styles/Kanban.module.css';

const KanbanCard = ({ card, index, onClick }) => {
  // Extrai os campos personalizados dos atributos da conversa
  const customFields = card.meta?.sender?.custom_attributes || {};

  return (
    <Draggable draggableId={String(card.id)} index={index}>
      {(provided) => (
        <div
          className={styles.card}
          onClick={onClick}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>
              {customFields.nome || card.meta?.sender?.name || 'Cliente'}
            </h3>
            <span className={styles.cardTime}>
              {new Date(card.last_activity_at).toLocaleString('pt-BR')}
            </span>
          </div>
          
          <div className={styles.cardContent}>
            <p className={styles.cardExcerpt}>
              {customFields.origem && (
                <span className={styles.tag}>{customFields.origem}</span>
              )}
              {customFields.objetivos && (
                <span className={styles.cardDescription}>
                  {truncateText(customFields.objetivos, 60)}
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </Draggable>
  );
};

// Função auxiliar para truncar texto
function truncateText(text, maxLength) {
  if (!text) return '';
  return text.length > maxLength 
    ? text.substring(0, maxLength) + '...' 
    : text;
}

export default KanbanCard;

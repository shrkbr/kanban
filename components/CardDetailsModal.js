import React from 'react';
import styles from '../styles/Kanban.module.css';

const CardDetailsModal = ({ card, onClose }) => {
  const customFields = card.meta?.sender?.custom_attributes || {};
  
  // Lista de campos que desejamos mostrar
  const fieldsToShow = [
    { key: 'dataPreenchimento', label: 'Data de Preenchimento' },
    { key: 'origem', label: 'Origem' },
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'E-mail' },
    { key: 'whatsapp', label: 'WhatsApp' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'idade', label: 'Idade' },
    { key: 'objetivos', label: 'Objetivos' },
    { key: 'meta', label: 'META' },
    { key: 'dores', label: 'Dores' },
    { key: 'oportunidadeIdeal', label: 'Oportunidade Ideal' }
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{customFields.nome || card.meta?.sender?.name || 'Detalhes do Cliente'}</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.fieldsGrid}>
            {fieldsToShow.map(field => (
              <div key={field.key} className={styles.fieldItem}>
                <strong>{field.label}:</strong>
                <span>{customFields[field.key] || 'Não informado'}</span>
              </div>
            ))}
          </div>
          
          <div className={styles.conversationActions}>
            <a 
              href={`${process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL}/app/accounts/${card.account_id}/conversations/${card.id}`}
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.actionButton}
            >
              Abrir Conversa
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsModal;

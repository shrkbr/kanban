import React from 'react';
import { ChatwootConversation } from '../hooks/useChatwoot';

interface CardDetailsModalProps {
  card: ChatwootConversation;
  onClose: () => void;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ card, onClose }) => {
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>
            {customFields.nome || card.meta?.sender?.name || 'Detalhes do Cliente'}
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{ padding: '16px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '16px'
          }}>
            {fieldsToShow.map(field => (
              <div key={field.key} style={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                <strong style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  {field.label}:
                </strong>
                <span style={{
                  fontSize: '16px',
                  color: '#1f2937'
                }}>
                  {customFields[field.key] || 'Não informado'}
                </span>
              </div>
            ))}
          </div>
          
          <div style={{
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <a 
              href={`${process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL || ''}/app/accounts/${card.account_id}/conversations/${card.id}`}
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                transition: 'background-color 0.2s'
              }}
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

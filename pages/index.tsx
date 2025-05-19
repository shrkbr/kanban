import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useChatwoot, ChatwootConversation } from '../hooks/useChatwoot';

interface ColumnType {
  title: string;
  cards: ChatwootConversation[];
}

interface ColumnsType {
  [key: string]: ColumnType;
}

export default function Home() {
  const { data, isLoading, error } = useChatwoot();
  const [columns, setColumns] = useState<ColumnsType>({
    novo: { title: 'Novos Leads', cards: [] },
    emAtendimento: { title: 'Em Atendimento', cards: [] },
    pendente: { title: 'Pendentes', cards: [] },
    resolvido: { title: 'Resolvidos', cards: [] }
  });

  useEffect(() => {
    if (data && data.conversations) {
      // Organize conversations into columns
      const newColumns = {
        novo: { title: 'Novos Leads', cards: [] },
        emAtendimento: { title: 'Em Atendimento', cards: [] },
        pendente: { title: 'Pendentes', cards: [] },
        resolvido: { title: 'Resolvidos', cards: [] }
      };
      
      data.conversations.forEach(conversation => {
        if (conversation.status === 'pending') {
          newColumns.pendente.cards.push(conversation);
        } else if (conversation.status === 'resolved') {
          newColumns.resolvido.cards.push(conversation);
        } else if (conversation.status === 'open') {
          if (conversation.meta?.assignee) {
            newColumns.emAtendimento.cards.push(conversation);
          } else {
            newColumns.novo.cards.push(conversation);
          }
        }
      });
      
      setColumns(newColumns);
    }
  }, [data]);

  if (isLoading) {
    return <div style={{ padding: '2rem' }}>Carregando...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem' }}>Erro: {error}</div>;
  }

  return (
    <div>
      <Head>
        <title>Kanban de Atendimento - Chatwoot</title>
        <meta name="description" content="Dashboard Kanban para Chatwoot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: '2rem' }}>
        <h1>Kanban de Atendimento</h1>
        
        <div style={{ display: 'flex', gap: '1rem', padding: '1rem', overflowX: 'auto' }}>
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} style={{ 
              minWidth: '300px',
              background: 'white',
              borderRadius: '0.5rem',
              padding: '1rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h2>{column.title} <span style={{ 
                fontSize: '0.875rem', 
                backgroundColor: '#e5e7eb', 
                borderRadius: '9999px', 
                padding: '0.25rem 0.5rem' 
              }}>
                {column.cards.length}
              </span></h2>
              
              <div style={{ marginTop: '1rem' }}>
                {column.cards.map(conv => (
                  <div key={conv.id} style={{
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem' 
                    }}>
                      <h3 style={{ margin: 0, fontSize: '0.875rem' }}>
                        {conv.meta?.sender?.custom_attributes?.nome || 
                         conv.meta?.sender?.name || 'Cliente'}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {new Date(conv.last_activity_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    
                    <div>
                      {conv.meta?.sender?.custom_attributes?.origem && (
                        <span style={{
                          display: 'inline-block',
                          background: '#eff6ff',
                          color: '#3b82f6',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          marginRight: '0.5rem'
                        }}>
                          {conv.meta.sender.custom_attributes.origem}
                        </span>
                      )}
                      
                      {conv.meta?.sender?.custom_attributes?.objetivos && (
                        <p style={{ 
                          margin: '0.5rem 0 0',
                          fontSize: '0.875rem',
                          color: '#4b5563'
                        }}>
                          {truncateText(conv.meta.sender.custom_attributes.objetivos, 60)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                
                {column.cards.length === 0 && (
                  <div style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    color: '#6b7280',
                    fontSize: '0.875rem' 
                  }}>
                    Nenhum item nesta coluna
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// Função auxiliar para truncar texto
function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength 
    ? text.substring(0, maxLength) + '...' 
    : text;
}

import { useState, useEffect } from 'react';

// Definir tipos
export interface ChatwootSender {
  id: number;
  name: string;
  email?: string;
  custom_attributes?: {
    dataPreenchimento?: string;
    origem?: string;
    nome?: string;
    email?: string;
    whatsapp?: string;
    instagram?: string;
    idade?: string;
    objetivos?: string;
    meta?: string;
    dores?: string;
    oportunidadeIdeal?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface ChatwootConversation {
  id: number;
  account_id: number;
  inbox_id: number;
  status: string;
  last_activity_at: string;
  meta?: {
    sender?: ChatwootSender;
    assignee?: {
      id: number;
      name: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

export interface ChatwootPayload {
  conversations?: ChatwootConversation[];
  [key: string]: any;
}

export function useChatwoot(): { 
  data: ChatwootPayload | null; 
  isLoading: boolean; 
  error: string | null 
} {
  const [data, setData] = useState<ChatwootPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      try {
        if (typeof event.data === 'string') {
          // Handle string messages (usually from parent iframe)
          if (event.data === 'chatwoot-dashboard-app:data') {
            // In development, use mock data if available
            if (process.env.NODE_ENV === 'development') {
              try {
                const mockData: ChatwootPayload = {
                  conversations: [
                    {
                      id: 1,
                      account_id: 1,
                      inbox_id: 1,
                      status: 'open',
                      last_activity_at: new Date().toISOString(),
                      meta: {
                        sender: {
                          id: 1,
                          name: "Cliente Teste",
                          custom_attributes: {
                            dataPreenchimento: "19/05/2025",
                            origem: "Site",
                            nome: "Cliente Teste",
                            email: "teste@exemplo.com",
                            whatsapp: "5541999999999",
                            instagram: "@teste",
                            idade: "30",
                            objetivos: "Testar o Kanban",
                            meta: "Implementar o sistema",
                            dores: "Problemas com integrações",
                            oportunidadeIdeal: "Sistema completo"
                          }
                        }
                      }
                    }
                  ]
                };
                setData(mockData);
                setIsLoading(false);
              } catch (err) {
                console.error('Error loading mock data:', err);
                setError('Error loading mock data');
                setIsLoading(false);
              }
            }
            return;
          }
          
          try {
            const parsedData = JSON.parse(event.data);
            setData(parsedData);
            setIsLoading(false);
          } catch (err) {
            // Not a JSON string, ignore
          }
        }
      } catch (err) {
        console.error('Error in Chatwoot message handler:', err);
        setError('Error processing Chatwoot data');
        setIsLoading(false);
      }
    }

    window.addEventListener('message', handleMessage);
    
    // Request data from Chatwoot
    if (typeof window !== 'undefined' && window.parent) {
      window.parent.postMessage('chatwoot-dashboard-app:fetch-info', '*');
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return { data, isLoading, error };
}

export default useChatwoot;

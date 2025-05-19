import api from './api';
import { ChatwootConversation, ChatwootPayload } from '../hooks/useChatwoot';

// ID da conta Chatwoot - idealmente deveria vir das variáveis de ambiente
const accountId = process.env.NEXT_PUBLIC_CHATWOOT_ACCOUNT_ID || '1';

// Obter todas as conversas
export async function getConversations(): Promise<ChatwootConversation[]> {
  try {
    // Em desenvolvimento, você pode usar dados de mock
    if (process.env.NODE_ENV === 'development') {
      // Importar dados de mock (você precisaria criar este arquivo)
      try {
        const mockData = {
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
        return mockData.conversations;
      } catch (err) {
        console.error('Error loading mock data:', err);
        return [];
      }
    }
    
    // Em produção, fazer a requisição real
    const response = await api.get(`/accounts/${accountId}/conversations`, {
      params: {
        status_filter_types: 'open,pending,resolved',
        page: 1,
        per_page: 100 // Ajuste conforme necessário
      }
    });
    
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
}

// Atualizar o status de uma conversa
export async function updateConversationStatus(conversationId: number, status: string): Promise<boolean> {
  try {
    await api.post(
      `/accounts/${accountId}/conversations/${conversationId}/toggle_status`,
      { status }
    );
    
    return true;
  } catch (error) {
    console.error('Error updating conversation status:', error);
    throw error;
  }
}

// Atribuir conversa a um agente
export async function assignConversation(conversationId: number, assigneeId: number): Promise<boolean> {
  try {
    await api.post(
      `/accounts/${accountId}/conversations/${conversationId}/assignments`,
      { assignee_id: assigneeId }
    );
    
    return true;
  } catch (error) {
    console.error('Error assigning conversation:', error);
    throw error;
  }
}

// Obter ID do agente atual
export async function getCurrentAgentId(): Promise<number> {
  try {
    // Em um cenário real, isso viria da sessão do usuário ou JWT
    // Por enquanto, vamos retornar um ID fixo para testes
    return 1; // Substitua pelo seu agentId real
  } catch (error) {
    console.error('Error getting current agent ID:', error);
    throw error;
  }
}

export default {
  getConversations,
  updateConversationStatus,
  assignConversation,
  getCurrentAgentId
};

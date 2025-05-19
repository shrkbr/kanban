import api from './api';

// Obter todas as conversas
async function getConversations() {
  try {
    // Se estiver em desenvolvimento, carregar dados de mock
    if (process.env.NODE_ENV === 'development') {
      const mockData = await import('../mocks/conversations.json');
      return mockData.default;
    }
    
    // Obter o ID da conta (você precisará obter isso da sua instância do Chatwoot)
    const accountId = 1; // Substitua pelo seu accountId real
    
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
async function updateConversationStatus(conversationId, status) {
  try {
    const accountId = 1; // Substitua pelo seu accountId real
    
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
async function assignConversation(conversationId, assigneeId) {
  try {
    const accountId = 1; // Substitua pelo seu accountId real
    
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
async function getCurrentAgentId() {
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

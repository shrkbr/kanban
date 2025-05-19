import { useState, useEffect, useCallback } from 'react';
import chatwootService from '../services/chatwootService';

// Define os status das colunas do Kanban
const COLUMN_STATUSES = {
  novo: { id: 'novo', title: 'Novos Leads', status: 'open', assigneeId: null },
  emAtendimento: { id: 'emAtendimento', title: 'Em Atendimento', status: 'open', hasAssignee: true },
  pendente: { id: 'pendente', title: 'Pendentes', status: 'pending' },
  resolvido: { id: 'resolvido', title: 'Resolvidos', status: 'resolved' }
};

export function useKanbanData() {
  const [columns, setColumns] = useState({
    novo: { title: 'Novos Leads', cards: [] },
    emAtendimento: { title: 'Em Atendimento', cards: [] },
    pendente: { title: 'Pendentes', cards: [] },
    resolvido: { title: 'Resolvidos', cards: [] }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar e organizar os dados
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Buscar todas as conversas
      const conversations = await chatwootService.getConversations();
      
      // Organizar as conversas nas colunas apropriadas
      const organizedColumns = {
        novo: { title: 'Novos Leads', cards: [] },
        emAtendimento: { title: 'Em Atendimento', cards: [] },
        pendente: { title: 'Pendentes', cards: [] },
        resolvido: { title: 'Resolvidos', cards: [] }
      };
      
      conversations.forEach(conversation => {
        // Determine which column this conversation belongs to
        let targetColumn = 'novo';
        
        if (conversation.status === 'pending') {
          targetColumn = 'pendente';
        } else if (conversation.status === 'resolved') {
          targetColumn = 'resolvido';
        } else if (conversation.status === 'open') {
          if (conversation.meta?.assignee) {
            targetColumn = 'emAtendimento';
          } else {
            targetColumn = 'novo';
          }
        }
        
        // Add to the appropriate column
        organizedColumns[targetColumn].cards.push(conversation);
      });
      
      // Sort cards by last activity (most recent first)
      Object.keys(organizedColumns).forEach(columnId => {
        organizedColumns[columnId].cards.sort((a, b) => 
          new Date(b.last_activity_at) - new Date(a.last_activity_at)
        );
      });
      
      setColumns(organizedColumns);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching Kanban data:', err);
      setError('Erro ao carregar dados. Por favor, tente novamente.');
      setLoading(false);
    }
  }, []);
  
  // Carregar dados iniciais
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Função para mover um card entre colunas
  const moveCard = async (cardId, sourceColumnId, destColumnId, sourceIndex, destIndex) => {
    if (sourceColumnId === destColumnId) {
      // Reordenar na mesma coluna (implementação opcional)
      const sourceColumn = columns[sourceColumnId];
      const newCards = Array.from(sourceColumn.cards);
      const [movedCard] = newCards.splice(sourceIndex, 1);
      newCards.splice(destIndex, 0, movedCard);
      
      setColumns({
        ...columns,
        [sourceColumnId]: {
          ...sourceColumn,
          cards: newCards
        }
      });
    } else {
      // Mover para outra coluna
      const sourceColumn = columns[sourceColumnId];
      const destColumn = columns[destColumnId];
      
      // Encontrar o card a ser movido
      const cardToMove = sourceColumn.cards.find(card => card.id === parseInt(cardId));
      if (!cardToMove) return;
      
      // Atualizar o status da conversa via API
      const targetColumnConfig = COLUMN_STATUSES[destColumnId];
      try {
        await chatwootService.updateConversationStatus(cardId, targetColumnConfig.status);
        
        // Se estiver movendo para "Em Atendimento" e não tiver atribuído, atribuir
        if (destColumnId === 'emAtendimento' && !cardToMove.meta?.assignee) {
          // Obter o ID do agente atual (você precisará implementar isso)
          const currentAgentId = await chatwootService.getCurrentAgentId();
          await chatwootService.assignConversation(cardId, currentAgentId);
        }
        
        // Otimisticamente atualizar a UI
        const newSourceCards = sourceColumn.cards.filter(card => card.id !== parseInt(cardId));
        const newDestCards = [...destColumn.cards];
        
        // Atualizar os atributos do card conforme seu novo status
        const updatedCard = {
          ...cardToMove,
          status: targetColumnConfig.status
        };
        
        // Inserir na posição de destino
        newDestCards.splice(destIndex, 0, updatedCard);
        
        setColumns({
          ...columns,
          [sourceColumnId]: {
            ...sourceColumn,
            cards: newSourceCards
          },
          [destColumnId]: {
            ...destColumn,
            cards: newDestCards
          }
        });
      } catch (error) {
        console.error('Error moving card:', error);
        // Reverter para o estado anterior em caso de erro
        alert('Erro ao mover o card. Por favor, tente novamente.');
        fetchData(); // Recarregar dados
      }
    }
  };
  
  return {
    columns,
    loading,
    error,
    moveCard,
    refreshData: fetchData
  };
}

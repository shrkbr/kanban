import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import KanbanColumn from './KanbanColumn';
import CardDetailsModal from './CardDetailsModal';
import { useKanbanData } from '../hooks/useKanbanData';
import styles from '../styles/Kanban.module.css';

const KanbanBoard = () => {
  const { columns, loading, error, moveCard, refreshData } = useKanbanData();
  const [selectedCard, setSelectedCard] = useState(null);
  
  // Atualizar periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 60000); // Atualiza a cada minuto
    
    return () => clearInterval(interval);
  }, [refreshData]);
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    moveCard(
      result.draggableId,
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  };
  
  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  
  return (
    <div className={styles.kanbanContainer}>
      <h1 className={styles.kanbanTitle}>Kanban de Atendimento</h1>
      <button 
        className={styles.refreshButton}
        onClick={refreshData}
      >
        Atualizar
      </button>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.columnsContainer}>
          {Object.entries(columns).map(([columnId, column]) => (
            <KanbanColumn
              key={columnId}
              id={columnId}
              title={column.title}
              cards={column.cards}
              onCardClick={(card) => setSelectedCard(card)}
            />
          ))}
        </div>
      </DragDropContext>
      
      {selectedCard && (
        <CardDetailsModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
};

export default KanbanBoard;

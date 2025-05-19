import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import KanbanCard from './KanbanCard';
import styles from '../styles/Kanban.module.css';

const KanbanColumn = ({ id, title, cards, onCardClick }) => {
  return (
    <div className={styles.column}>
      <h2 className={styles.columnTitle}>
        {title} <span className={styles.cardCount}>{cards.length}</span>
      </h2>
      
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            className={styles.cardList}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {cards.map((card, index) => (
              <KanbanCard
                key={card.id}
                index={index}
                card={card}
                onClick={() => onCardClick(card)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;

import React from 'react';

interface KanbanColumnProps {
  id: string;
  title: string;
  cards: any[];
  onCardClick?: (card: any) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, cards, onCardClick }) => {
  return (
    <div>
      <h2>{title} <span>{cards.length}</span></h2>
      <div>
        {cards.map(card => (
          <div key={card.id} onClick={() => onCardClick && onCardClick(card)}>
            {card.id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;

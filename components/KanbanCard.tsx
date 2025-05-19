import React from 'react';

interface KanbanCardProps {
  card: any;
  index: number;
  onClick?: () => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ card, index, onClick }) => {
  return (
    <div onClick={onClick}>
      <h3>{card.meta?.sender?.name || 'Cliente'}</h3>
      <p>{card.last_activity_at}</p>
    </div>
  );
};

export default KanbanCard;

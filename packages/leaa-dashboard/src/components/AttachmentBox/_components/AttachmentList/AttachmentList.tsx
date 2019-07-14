import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import { AttachmentItem } from '../AttachmentItem/AttachmentItem';

import style from './style.less';

interface IProps {
  value?: number | string | undefined;
  onChange?: (checked: boolean) => void;
}

export const AttachmentList = (props: IProps) => {
  const [cards, setCards] = useState([
    {
      id: 1,
      text: 'Write a cool JS library',
    },
    {
      id: 2,
      text: 'Make it generic enough',
    },
    {
      id: 3,
      text: 'Write README',
    },
  ]);

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const dragCard = cards[dragIndex];

    setCards(
      update(cards, {
        $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
      }),
    );
  };

  const stopMoveCard = (isStopMove: boolean) => {
    if (isStopMove) {
      console.log('STOP', cards);
    }
  };

  return (
    <div className={style['wrapper']}>
      <DndProvider backend={HTML5Backend}>
        {cards.map((card, i) => (
          <AttachmentItem
            key={card.id}
            index={i}
            id={card.id}
            text={`#${card.id} ${card.text}`}
            value={`#${card.id} ${card.text}`}
            moveCardCallback={moveCard}
            stopMoveCardCallback={stopMoveCard}
          />
        ))}
      </DndProvider>
    </div>
  );
};

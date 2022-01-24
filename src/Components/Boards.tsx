import React from "react";
import {Droppable, Draggable} from "react-beautiful-dnd";
import Board from "./Board";

interface IDraggabbleBoardProps { 
  title: string;
  index: number;
  list: [];
}

function Boards({title, index, list}: IDraggabbleBoardProps){
  return (
    <Draggable draggableId={title} index={index} key={title}>
      {(magic) => (
        <div
          ref={magic.innerRef}
          {...magic.draggableProps}
          {...magic.dragHandleProps}
        >
          <Board boardId={title} pkey={index} toDos={list} />
        </div>
      )}
    </Draggable>
  );
}
export default React.memo(Boards);
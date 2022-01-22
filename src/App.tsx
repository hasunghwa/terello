import {DragDropContext, Droppable, Draggable, DropResult} from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { toDoOrder, toDoState, IToDoState } from "./atoms";
import Board from "./Components/Board";
import {useForm} from "react-hook-form"
import { useEffect } from "react";

const Wrapper = styled.div`
  display: flex;
  max-width: 6800px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  width: 100%;
  gap: 20px;
  background-color: black;
`;

interface IForm{
  category: string;
}

interface IAreaProps {
  isDraggingOver: boolean;
  isDraaggingFromThis: boolean;
}

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [order, setOrder] = useRecoilState(toDoOrder);
  Object.values(toDos).map((value, index) => {
    // console.log(value);
  });
  useEffect(() => {
    let array:any = [];
    Object.entries(toDos).forEach(([key, value], index) => {
      array.push(key);
    });
    setOrder(array);
  }, [toDos]);

  const onDragEnd = (info: DropResult) => {
    // const {destination, draggableId, source, type} = info;
    // if(!destination) return;
    // if(source.droppableId === "board" && destination.droppableId === "board"){
    //   console.log(info);
    //   setToDos(allBoards=> {
    //     const sourceBoard = [...allBoards[order[source.index]]];  
    //     const targetBoard = [...allBoards[order[destination.index]]]; 
    //     let empty:IToDoState = {};

    //     Object.entries(allBoards).map(([key, value], index) => {
    //       if(index === source.index){
    //         console.log(index);
    //         console.log(order[destination.index], targetBoard);
    //         empty[order[destination.index]] = targetBoard;
    //       }
    //       else if (index === destination.index){
    //         console.log(index);
    //         console.log(order[source.index], sourceBoard);
    //         empty[order[source.index]] = sourceBoard;
    //       }
    //       else { empty[key] = value; }
    //     });
    //     console.log(empty);
    //     return empty;
    //   });
    //   return;
    // }

    // else if( type === "trash"){
    //   setToDos(allBoards => {
    //     const boardCopy = [...allBoards[source.droppableId]];
    //     boardCopy.splice(source.index, 1);
    //     return {
    //       ...allBoards,
    //       [source.droppableId]: boardCopy
    //     };
    //   });
    //   return;
    // }
    
    // if(source.droppableId === destination?.droppableId && source.droppableId !== "board"){
    //   setToDos(allBoards => {
    //     const boardCopy = [...allBoards[source.droppableId]];
    //     const taskObj = boardCopy[source.index];
    //     boardCopy.splice(source.index, 1);
    //     boardCopy.splice(destination?.index, 0, taskObj);
    //     return {
    //       ...allBoards,
    //       [source.droppableId]: boardCopy
    //     };
    //   });
    // }
    
    // if(source.droppableId !== destination?.droppableId){
    //   setToDos(allBoards => {
    //     const sourceBoard = [...allBoards[source.droppableId]];
    //     const targetBoard = [...allBoards[destination.droppableId]];
    //     const taskObj = sourceBoard[source.index];
    //     sourceBoard.splice(source.index, 1);
    //     targetBoard.splice(destination?.index, 0, taskObj);
    //     return {
    //       ...allBoards,
    //       [source.droppableId]: sourceBoard,
    //       [destination?.droppableId]: targetBoard,
    //     }
    //   });
    // }
  };
 
  // const {register, setValue, handleSubmit} = useForm<IForm>();
  // const onValid = ({category}:IForm) => {
  //   setToDos((prev) => {
  //     return {
  //       ...prev,
  //       [category]: [],
  //     };
  //   });   
  // }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* <Droppable droppableId="trash">
        {(magic) => (
          <span 
            ref={magic.innerRef} 
            {...magic.droppableProps}
          >
            trash
          </span>
        )}
      </Droppable>
      <form onSubmit={handleSubmit(onValid)}>
        <input 
          {...register("category", {required:true})} 
          type="text" 
          placeholder=""
        />
      </form> */}
      
      <Wrapper>
        <Droppable droppableId="board" direction="horizontal">
          {(magic) => (
            <Boards
              ref={magic.innerRef} 
              {...magic.droppableProps}
            >
              {Object.values(toDos).map((value, index) => (
                <Draggable draggableId={value.title} key={value.title} index={Number(index)}>
                  {(magic) => (
                    <div
                      ref={magic.innerRef}
                      {...magic.draggableProps}
                      {...magic.dragHandleProps}
                    >
                      <Board boardId={value.title} pkey={index} toDos={value.list} />
                    </div>
                  )}
                </Draggable>
              ))}
            </Boards>
          )}
        </Droppable>
      </Wrapper>     
    </DragDropContext>
  );
}

export default App;

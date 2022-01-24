import {DragDropContext, Droppable, Draggable, DropResult, DragStart} from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { toDoState, IToDoState } from "./atoms";
import Boardss from "./Components/Boards";
import {useForm} from "react-hook-form"
import { useRef, useState } from "react";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Header = styled.div`
  display: flex;
  margin-bottom: 20px;
  width: 100%;
  gap: 30px;
  justify-content: center;
  align-items: center;
`;

const Boards = styled.div`
  display: flex;
  width: 100%;
  gap: 20px;
  justify-content: center;
`;

const TrashBox = styled.section`
  display: flex;
  align-items: center;
  font-size: 5rem;
  margin-top: 20px;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
`;

const Trash = styled.span`
  width: 10px;
  height: 10px;
`;

const Input = styled.input`
  border-radius: 5px;
  padding-left: 5px;
  border: none;
  height: 30px;
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
  const onDragEnd = (info: DropResult) => {
    const {destination, draggableId, source, type} = info;
    console.log(info);
    if(!destination) {
      return;
    }
    if(source.droppableId === "board" && destination.droppableId === "board"){
      setToDos(allBoards=> {
        const boardCopy = {...allBoards};
        const copy= boardCopy[destination.index];
        boardCopy[destination.index] = boardCopy[source.index];
        boardCopy[source.index] = copy;
        return {
          ...boardCopy,
        }
      });
    }

    if(destination.droppableId == "trash-board") {
      setToDos(allBoards => {
        const boardCopy = {...allBoards};
        let len = 0;
        Object.values(toDos).map(() =>{
          len +=1;
        });
        Object.entries(boardCopy).map((value, index)=> {
          if(Number(value[0]) < source.index){
            return;
          }
          if(Number(value[0]) < len-1){
            boardCopy[index] = boardCopy[index+1]; 
          }
          else if(Number(value[0]) === len-1){
            delete boardCopy[len-1];
          }
        });
        return {
          ...boardCopy,
        };
      });
      return;
    } 

    if(destination.droppableId == "trash-ToDo") {
      setToDos(allBoards => {
        const boardCopy = [...allBoards[Number(source.droppableId)].list];
        boardCopy.splice(source.index, 1);       
        return {
          ...allBoards,
          [Number(source.droppableId)] : {
            title: allBoards[Number(source.droppableId)].title,
            list: boardCopy,
          },
        };
      });
      return;
    }
    
    if(source.droppableId === destination?.droppableId && source.droppableId !== "board"){
      setToDos(allBoards => {
        const boardCopy = [...allBoards[Number(source.droppableId)].list];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [Number(source.droppableId)] : {
            title: allBoards[Number(source.droppableId)].title,
            list: boardCopy,
          },
        };
      });
    }
    
    if(source.droppableId !== destination?.droppableId){
      setToDos(allBoards => {
        const sourceBoard = [...allBoards[Number(source.droppableId)].list];
        const targetBoard = [...allBoards[Number(destination?.droppableId)].list];
        const taskObj = sourceBoard[source.index];
        sourceBoard.splice(source.index, 1);
        targetBoard.splice(destination?.index as number, 0, taskObj);
        return {
          ...allBoards,
          [Number(source.droppableId)] : {
            title: allBoards[Number(source.droppableId)].title,
            list: sourceBoard,
          },
          [Number(destination?.droppableId)] : {
            title: allBoards[Number(destination?.droppableId)].title,
            list: targetBoard,
          },
        }
      });
    }
  };
 
  const {register, setValue, handleSubmit} = useForm<IForm>();
  const boardInput = useRef<HTMLInputElement | null>(null);
  const { ref, ...rest } = register('category', {required:true});
  const onValid = ({category}:IForm) => {
    setToDos((prev) => {
      let len = 0;
      Object.values(toDos).map(() =>{
        len +=1;
      });
      return {
        ...prev,
        [len] : {
          title: category,
          list: [],
        },
      };
    }); 
    setValue("category", "");
    boardInput.current?.blur(); 
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Header>
          <form onSubmit={handleSubmit(onValid)}>
            <Input 
              {...rest} 
              type="text" 
              placeholder="Add Board"
              ref={(e) => {
                ref(e)
                boardInput.current = e // you can still assign to ref
              }}
            />
          </form>
        </Header>
        <Droppable droppableId="board" type="board" direction="horizontal">
          {(magic) => (
            <Boards
              ref={magic.innerRef} 
              {...magic.droppableProps}
            >
              {Object.values(toDos).map((value, index) => (
                <Boardss title={value.title} index={index} list={value.list}/>
              ))}{magic.placeholder}
            </Boards>
          )}
        </Droppable>
        <TrashBox>
          <Droppable droppableId="trash-board" type="board">
            {(magic) => (
              <Trash 
                ref={magic.innerRef} 
                {...magic.droppableProps}
              >{magic.placeholder}
              </Trash>
            )}
          </Droppable>  
          🗑
          <Droppable droppableId="trash-ToDo" type="ToDo">
            {(magic) => (
              <Trash 
                ref={magic.innerRef} 
                {...magic.droppableProps}
              >{magic.placeholder}
              </Trash>
            )}
          </Droppable>
        </TrashBox>
             
        </Wrapper>
    </DragDropContext>
  );
}

export default App;

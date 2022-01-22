import {Droppable, Draggable} from "react-beautiful-dnd";
import DragabbleCard from "./DragabbleCard";
import styled from "styled-components";
import {useForm} from "react-hook-form"
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";

const Wrapper = styled.div`
  width: 300px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 1.3rem;
`;

interface IAreaProps {
  isDraggingOver: boolean;
  isDraaggingFromThis: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${props => props.isDraggingOver ? "#dfe6e9" : props.isDraaggingFromThis ? "#b2bec3" : "transparent"};
  flex-grow: 1;
  transition: background-color .3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
`;

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
  pkey: number;
}

interface IForm{
  toDo: string;
}

function Board({toDos, pkey, boardId}: IBoardProps){
  const setToDo = useSetRecoilState(toDoState);
  const {register, setValue, handleSubmit} = useForm<IForm>();
  const onValid = ({toDo}:IForm) => {
    console.log(toDos);
    const newToDo = {
      id: Date.now(),
      text: toDo,
    }
    setToDo((prev) => {
      const title = prev[pkey].title;
      return {
        ...prev,
        [pkey]: {
          title: title,
          list: [newToDo, ...prev[pkey].list],
        },
      };
    });
  }

  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input 
          {...register("toDo", {required:true})} 
          type="text" 
          placeholder=""
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(magic, info) => (
          <Area
            isDraggingOver={info.isDraggingOver} 
            isDraaggingFromThis={Boolean(info.draggingFromThisWith)}
            ref={magic.innerRef} 
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DragabbleCard 
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}
export default Board;
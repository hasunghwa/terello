import {Droppable} from "react-beautiful-dnd";
import DragabbleCard from "./DragabbleCard";
import styled from "styled-components";
import {useForm} from "react-hook-form"
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
import { useRef } from "react";

const Wrapper = styled.div`
  width: 200px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 200px;
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

const Input = styled.input`
  border-radius: 5px;
  padding-left: 5px;
  border: none;
  height: 30px;
  text-align: center;
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
  const taskInput = useRef<HTMLInputElement | null>(null);
  const { ref, ...rest } = register('toDo', {required:true});

  const onValid = ({toDo}:IForm) => {
    const { current } = taskInput;
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
    setValue("toDo", "");
    taskInput.current?.blur();
  }

  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <Input 
          {...rest}
          type="text" 
          placeholder="Add task"
          ref={(e) => {
            ref(e)
            taskInput.current = e // you can still assign to ref
          }}
        />
      </Form>
      <Droppable droppableId={String(pkey)} key={boardId} type="ToDo">
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
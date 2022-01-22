import {atom, selector} from "recoil";

export const toDoOrder = atom({
  key: "toDoOrder",
  default: ["1", "2", "3"],
});

export interface ITodo {
  id: number;
  text: string;
}

export interface IToDoState {
  [key:number]:{
    title: string;
    list: ITodo[];
  }
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    0:{
      title: "ToDo",
      list: [],
    },
    1:{
      title: "Doing",
      list: [],
    },
    2:{
      title: "Done",
      list: [],
    }
  },
});


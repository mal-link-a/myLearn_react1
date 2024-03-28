import React from 'react';

import { Task, FilterType } from './TaskType.ts';
import NewTask from './NewTask.tsx';

interface MyProps {
  tasks: Task[];
  filter: FilterType;
  editID: number | null;
  setAsFinished: (id: number) => void;
  toggieEditMode: (id: number, input: string) => void;
  deleteScr: (id: number, isFinished: boolean) => void;
  editTaskContent: (id: number, text: string) => void;
}
interface MyState {
  time: number;
}

class TaskList extends React.Component<MyProps, MyState> {
  constructor(props) {
    super(props);
    this.state = { time: 0 };
    //Создаем обновление каждую секунду, чтобы обновлялись подписи к таскам
    setInterval((): void => {
      this.setState({ time: this.state.time === 0 ? this.state.time + 1 : 0 });
    }, 1000);
  }

  getTaskList(arr: Task[]): React.JSX.Element[] {
    let counter = 0;
    return arr.slice().map((item: Task): React.JSX.Element => {
      item.id = counter++;
      return this.newTask(item);
    });
  }

  newTask(item: Task): React.JSX.Element {
    return (
      <li key={item.createTime} className="taskList_item">
        <NewTask
          isFinished={item.isFinished}
          id={item.id}
          string={item.name}
          setAsFinished={this.props.setAsFinished}
          toggieEditMode={this.props.toggieEditMode}
          deleteScr={this.props.deleteScr}
          editID={this.props.editID}
          createTime={item.createTime}
          editTaskContent={this.props.editTaskContent}
        />
      </li>
    );
  }

  render(): React.JSX.Element {
    const [tasks, filter] = [this.props.tasks, this.props.filter];
    let toDoData;
    switch (filter) {
      case FilterType.ALL: {
        toDoData = this.getTaskList([...tasks]);
        break;
      }
      case FilterType.AVALIIABLE: {
        toDoData = this.getTaskList(tasks.filter((item) => !item.isFinished));
        break;
      }
      case FilterType.FINISHED: {
        toDoData = this.getTaskList(tasks.filter((item) => item.isFinished));
        break;
      }
      default: {
        break;
      }
    }
    return <ul className="taskList">{toDoData}</ul>;
  }
}

export default TaskList;

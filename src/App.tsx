/* eslint-disable no-unused-vars */
import React from 'react';

import Logo from './img/logo.svg';
import './App.css';
import TaskCreator from './TaskCreator.tsx';
import TaskList from './TaskList.tsx';
import TaskButtonPanel from './TaskButtonPanel.tsx';
import TaskInfoPanel from './TaskInfoPanel.tsx';
//import checkBoxOff from './img/check-off.svg';
//import checkBoxOn from './img/check-on.svg';
import { Task, FilterType } from './TaskType.ts';

interface MyState {
  time: Date;
  editID: number | null;
  filterType: FilterType;
  tasks: Task[];
}

class App extends React.Component {
  state: MyState = {
    time: new Date(),
    editID: null, //id редактируемого итема
    filterType: FilterType.ALL, // if типа предустановленных вариантов фильтрации тасков
    tasks: [
      {
        name: 'Go out',
        createTime: Date.now() - 100000000000,
        id: -1,
        isFinished: false,
      },
      {
        name: 'Eat the meal mom left me',
        createTime: Date.now() - 1000000000,
        id: -1,
        isFinished: false,
      },
      {
        name: 'Fill up the bird feeder',
        createTime: Date.now() - 10000000,
        id: -1,
        isFinished: false,
      },
      {
        name: 'Feed my Tamaghost',
        createTime: Date.now() - 10000,
        id: -1,
        isFinished: false,
      },
      {
        name: 'Say goodbye to Hiro',
        createTime: Date.now() - 100,
        id: -1,
        isFinished: false,
      },
    ],
  };

  //Создание новой таски
  addNewClick = (text: string): void => {
    console.log('Запуск addNewClick');
    const Task: Task[] = [
      {
        name: text,
        createTime: Date.now(),
        endTime: Date.now(),
        isFinished: false,
        id: -1,
      },
    ];
    const newData: Task[] = Task.concat(this.state.tasks);
    console.log(newData);
    this.setState({ tasks: newData });
    console.log('Отработали addNewClick');
  };

  //Новое
  //Редактирование названия таски
  editTaskContent = (id: number, text: string): void => {
    console.log('Запуск editTaskContent');
    const newData: Task[] = [...this.state.tasks];
    newData[id].name = text;
    this.setState({ tasks: newData });
    console.log('Отработали editTaskContent');
  };

  //Фильтруем таски по предустановленным категориям
  //Предустановленные категории зашиты в enum FilterType в TaskType.ts
  filterTaskList = (id: string): void => {
    this.setState({ filterType: id });
    return;
  };

  //Новое
  //Зачищаем все готовые таски и сбрасываем фильтр
  clearAllFinishedTasks = (): void => {
    console.log('Запуск clearAllFinishedTasks');
    const newData: Task[] = this.state.tasks.filter((item: Task) => item.isFinished);
    this.setState({ tasks: newData, filterType: 'ALL' });
    console.log('Отработали clearAllFinishedTasks');
  };

  //Удаление одной таски по id (ивент кнопки)
  deleteTaskByID = (id: number): void => {
    const newData: Task[] = [...this.state.tasks].splice(id, 1);
    this.setState({ tasks: newData });
  };

  //Отметить таску по id как законченную (ивент кнопки)
  setTaskAsFinished = (id: number): void => {
    console.log('Запуск setTaskAsFinished');
    const newData: Task[] = [...this.state.tasks];
    newData[id].isFinished = true;
    newData[id].endTime = Date.now();
    const finishedTask: Task[] = newData.splice(id, 1);
    const newArray: Task[] = newData
      .filter((item: Task) => !item.isFinished)
      .concat(
        finishedTask,
        newData.filter((item: Task) => item.isFinished)
      );
    this.setState({ tasks: newArray });
    console.log('Отработали setTaskAsFinished');
  };

  //Обработаем вход и выход из режима редактирования итема
  toggieEditMode = (id: number, input): void => {
    if (this.state.editID === id) {
      this.setState({ editID: null });
    } else {
      this.setState({ editID: id });
      input.focus();
    }
  };

  getDoneTaskCount(): number {
    return this.state.tasks.reduce((accumulator, currentValue) => {
      if (currentValue.isFinished) {
        return ++accumulator;
      } else return accumulator;
    }, 0);
  }

  render(): React.JSX.Element {
    return (
      <>
        <div className="visual_black" />
        <div className="visual_gray" />
        <div className="main">
          <img className="logo" src={Logo} alt="" />
          <TaskCreator createCall={this.addNewClick} />
          <TaskButtonPanel
            filterType={this.state.filterType}
            filterCall={this.filterTaskList}
            clearFinishedCall={this.clearAllFinishedTasks}
          />
          <TaskInfoPanel doneTaskCount={this.getDoneTaskCount()} taskCount={this.state.tasks.length} />
          <TaskList
            tasks={[...this.state.tasks]}
            filter={this.state.filterType}
            editID={this.state.editID}
            setAsFinished={this.setTaskAsFinished} //Проставить у таски флаг isFinished как true | ивент клика
            toggieEditMode={this.toggieEditMode} //Вход и выход из едит мода таски | ивент submit формы
            deleteScr={this.deleteTaskByID} //Удалить таску | ивент клика
            editTaskContent={this.editTaskContent} //Редактирование содержимого описания | ивент инпута onChange
          />
        </div>
      </>
    );
  }
}

export default App;

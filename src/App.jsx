import React from 'react';

import logo from './img/logo.svg';
import './App.css';
import TaskCreator from './TaskCreator.jsx';
import TaskList from './TaskList.jsx';
import TaskButtonPanel from './TaskButtonPanel.jsx';
import TaskInfoPanel from './TaskInfoPanel.jsx';
//import checkBoxOff from './img/check-off.svg';
//import checkBoxOn from './img/check-on.svg';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      time: new Date(),
      editID: null, //id редактируемого итема
      filterType: 0, // if типа предустановленных вариантов фильтрации тасков
      tasks: [
        {
          name: 'Go out',
          isFinished: false,
          createTime: Date.now() - 10,
        },
        {
          name: 'Eat the meal mom left me',
          isFinished: false,
          createTime: Date.now() - 2000,
        },
        {
          name: 'Fill up the bird feeder',
          isFinished: false,
          createTime: Date.now() - 30000,
        },
        {
          name: 'Feed my Tamaghost',
          isFinished: false,
          createTime: Date.now() - 110400,
        },
        {
          name: 'Say goodbye to Hiro',
          isFinished: false,
          createTime: Date.now() - 1105000,
        },
      ],
    };
    setInterval(() => {
      this.setState({ time: new Date() });
    }, 1000);
  }

  //Получаем количество выполненных задач
  getDoneTaskCount() {
    return this.state.tasks.reduce((accumulator, currentValue) => {
      if (currentValue.isFinished) {
        return ++accumulator;
      } else return accumulator;
    }, 0);
  }
  addNewClick = (text) => {
    //Создание новой таски
    let newData = [...this.state.tasks];
    newData.push({
      name: text,
      isFinished: false,
      createTime: Date.now(),
    });
    this.setState({ tasks: newData });
  };
  editTaskContent = (id, text) => {
    let newData = [...this.state.tasks];
    newData[id].name = text;
    this.setState({ tasks: newData });
  };

  filterTaskList = (id) => {
    //Фильтруем таски по предустановленным категориям
    this.setState({ filterType: id });
  };

  clearAllFinishedTasks = () => {
    //Зачищаем все готовые таски и сбрасываем фильтр
    let newData = [...this.state.tasks].filter(function (a) {
      return !a.isFinished;
    });
    this.setState({ tasks: newData, filterType: 0 });
  };
  //Удаление одной таски по id (ивент кнопки удаления)
  deleteTaskByID = (id) => {
    let newData = [...this.state.tasks];
    newData.splice(id, 1);
    this.setState({ tasks: newData });
  };

  setTaskAsFinished = (id) => {
    let newData = [...this.state.tasks];
    if (!newData[id].isFinished) {
      newData[id].isFinished = true;
      newData[id].endTime = Date.now();
      this.setState({ tasks: newData });
    }
  };

  //Обработаем вход и выход из режима редактирования итема
  toggieEditMode = (id, input) => {
    if (this.state.editID === id) {
      this.setState({ editID: null });
    } else {
      this.setState({ editID: id });
      input.focus();
    }
  };

  render() {
    return (
      <>
        <div className="visual_black" />
        <div className="visual_gray" />
        <div className="main">
          <img className="logo" src={logo} alt="" />
          <TaskCreator createCall={this.addNewClick} />
          <TaskButtonPanel
            filterCall={this.filterTaskList}
            clearFinishedCall={this.clearAllFinishedTasks}
            filterType={this.state.filterType}
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

import React from 'react';

import logo from './img/logo.svg';
import checkBoxOff from './img/check-off.svg';
import checkBoxOn from './img/check-on.svg';
import './App.css';

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
    let newData = this.state.tasks.slice(0);
    newData.push({
      name: text,
      isFinished: false,
      createTime: Date.now(),
    });
    this.setState({ tasks: newData });
  };
  editTaskContent = (id, text) => {
    let newData = this.state.tasks.slice(0);
    newData[id].name = text;
    this.setState({ tasks: newData });
  };

  filterTaskList = (id) => () => {
    //Фильтруем таски по предустановленным категориям
    this.setState({ filterType: id });
  };

  clearAllFinishedTasks = () => {
    //Зачищаем все готовые таски и сбрасываем фильтр
    let newData = this.state.tasks.slice(0);
    for (let i = 0; i < newData.length; i++) {
      if (newData[i].isFinished) {
        newData.splice(i, 1);
        i--;
      }
    }
    this.setState({ tasks: newData, filterType: 0 });
  };
  //Удаление одной таски по id (ивент кнопки удаления)
  deleteTaskByID = (id) => (e) => {
    e.preventDefault();
    let newData = this.state.tasks.slice(0);
    newData.splice(id, 1);
    this.setState({ tasks: newData });
  };

  setTaskAsFinished = (id) => (e) => {
    let newData = Object.assign([], this.state.tasks);
    if (!newData[id].isFinished) {
      newData[id].isFinished = true;
      newData[id].endTime = Date.now();
      this.setState({ tasks: newData });
    }
  };

  enterEditMode = (id) => (e) => {
    //Входим в едитмод для итема
    e.preventDefault();
    let itemClass = '.task_id' + id;
    let item = document.querySelector(itemClass);
    let itemDescription = item.querySelector('.content__tasks__task__description');
    setTimeout(() => {
      itemDescription.focus();
    }, 50);
    this.setState({ editID: id });
  };

  updateTaskDescription = (e) => {
    //Убираем едитмод у таски (Работаем на ентер или на потерю фокуса итемом)
    e.preventDefault();
    this.setState({ editID: null });
    setTimeout(() => {
      console.log('Инициировали выполнение updateTaskDescription' + this.state.editID);
    }, 50);
  };

  checkEditID = (id) => {
    return this.state.editID === id ? 'content__tasks__task__button_edit_active' : '';
  };

  render() {
    return (
      <>
        <div className="visual_black" />
        <div className="visual_gray" />
        <div className="content">
          <img className="logo" src={logo} alt="" />
          <TaskCreator createCall={this.addNewClick} />
          <TaskButtonPanel
            filterCall={this.filterTaskList}
            clearFinishedCall={this.clearAllFinishedTasks}
            filterType={this.state.filterType}
          />
          <TaskInfoPanel doneTaskCount={this.getDoneTaskCount()} taskCount={this.state.tasks.length} />
          <TaskList
            tasks={this.state.tasks.slice(0)}
            filter={this.state.filterType}
            updateTaskDescription={this.updateTaskDescription}
            setAsFinished={this.setTaskAsFinished}
            editTask={this.newTaskDescription}
            startEditTask={this.enterEditMode}
            delete={this.deleteTaskByID}
            editID={this.state.editID}
            editTaskContent={this.editTaskContent}
            checkEditID={this.checkEditID}
          />
        </div>
      </>
    );
  }
}

//Форма для создания новых задач toDo
class TaskCreator extends React.Component {
  constructor() {
    super();
    this.state = { val: '' };
  }
  //Обработка input
  handleChangeValue = (e) => {
    this.setState({ val: e.target.value });
  };
  //Обработка sumbit - создание новой таски
  handleSumbit = (e) => {
    e.preventDefault();
    this.props.createCall(this.state.val);
    this.setState({ val: '' });
  };

  render() {
    return (
      <form onSubmit={this.handleSumbit}>
        <div className="content__textBox">
          <input
            className="content__textBox__text"
            type="text"
            placeholder="Добавить новую задачу..."
            onChange={this.handleChangeValue}
            value={this.state.val}
          />
          <button type="submit" className="content__textBox__button">
            <p>Добавить</p>
            <div className="content__textBox__button_plusVisual">+</div>
          </button>
        </div>
      </form>
    );
  }
}
class TaskButtonPanel extends React.Component {
  render() {
    return (
      <div>
        <button type="button" className="content__navogationBtn_All buttonStyle" onClick={this.props.filterCall(0)}>
          Все задачи
        </button>
        <button type="button" className="content__navogationBtn_Ended buttonStyle" onClick={this.props.filterCall(1)}>
          В процессе
        </button>
        <button
          type="button"
          className="content__navigationBtn_Avaliable buttonStyle"
          onClick={this.props.filterCall(2)}
        >
          Завершённые
        </button>
        <button
          type="button"
          className={`content__navogationBtn_detele-ended buttonStyle ${this.props.filterType === 2 ? '' : 'hidden'}`}
          onClick={this.props.clearFinishedCall}
        >
          Очистить
        </button>
      </div>
    );
  }
}
class TaskInfoPanel extends React.Component {
  render() {
    return (
      <div className="content__info">
        <div>
          Всего задач:
          <span className="content__info_data">{this.props.taskCount}</span>
        </div>
        <div>
          Завершено:
          <span className="content__info_data">{this.props.doneTaskCount + ' из ' + this.props.taskCount}</span>
        </div>
      </div>
    );
  }
}
class TaskList extends React.Component {
  getFinishedTaskList(arr) {
    return arr
      .filter((item) => item.isFinished)
      .sort(function (a, b) {
        if (a.endTime > b.endTime) {
          return -1;
        }
        if (a.endTime < b.endTime) {
          return 1;
        }
        return 0;
      })
      .map((item) => this.newTask(item));
  }
  getUnfinishedTaskList(arr) {
    return arr
      .filter((item) => !item.isFinished)
      .sort(function (a, b) {
        if (a.createTime > b.createTime) {
          return -1;
        }
        if (a.createTime < b.createTime) {
          return 1;
        }
        return 0;
      })
      .map((item) => this.newTask(item));
  }

  newTask(item) {
    return (
      <NewTask
        isFinished={item.isFinished}
        id={item.id}
        string={item.name}
        updateTaskDescription={this.props.updateTaskDescription}
        setAsFinished={this.props.setAsFinished}
        editTask={this.props.editTask}
        startEditTask={this.props.startEditTask}
        delete={this.props.delete}
        editID={this.props.editID}
        createTime={item.createTime}
        editTaskContent={this.props.editTaskContent}
        checkEditID={this.props.checkEditID}
      />
    );
  }
  render() {
    let arrWithId = this.props.tasks.slice(0);
    for (let i = 0; i < arrWithId.length; i++) {
      arrWithId[i].id = i;
    }
    switch (this.props.filter) {
      case 0: {
        return (
          <div className="content__tasks">
            {[].concat(this.getUnfinishedTaskList(arrWithId), this.getFinishedTaskList(arrWithId))}
          </div>
        );
      }
      case 1: {
        return <div className="content__tasks">{this.getUnfinishedTaskList(arrWithId)}</div>;
      }
      case 2: {
        return <div className="content__tasks">{this.getFinishedTaskList(arrWithId)}</div>;
      }
      default: {
        break;
      }
    }
  }
}

class NewTask extends React.Component {
  handleChangeInput = (e) => {
    e.preventDefault();
    console.log('Меняем state итема ' + e.target.value + ' id = ' + this.props.id);
    this.props.editTaskContent(this.props.id, e.target.value);
  };
  render() {
    return (
      <form
        className={`content__tasks__task task_id${this.props.id} ${this.props.isFinished ? 'finished' : ''}`}
        onSubmit={this.props.updateTaskDescription}
      >
        <label className="content__tasks__task__checkbox">
          <button
            type="button"
            className="content__tasks__task__checkbox_check"
            onClick={this.props.setAsFinished(this.props.id)}
          >
            <img
              src={this.props.isFinished ? checkBoxOn : checkBoxOff}
              alt=""
              className="content__tasks__task__checkbox_img"
            />
          </button>
        </label>
        <TaskDescription
          id={this.props.id}
          editableId={this.props.editID}
          description={this.props.string}
          handleSumbit={this.props.handleSumbit}
          titleCreateTime={this.props.createTime}
          updateTaskDescription={this.props.updateTaskDescription}
        />
        <button
          type="button"
          className={`content__tasks__task__button content__tasks__task__button_edit ${this.props.checkEditID(this.props.id)}`}
          onClick={this.props.startEditTask(this.props.id)}
        >
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
              <defs>
                <clipPath id="a">
                  <path fill="#fff" fillOpacity="0" d="M0 0h24v24H0z" />
                </clipPath>
              </defs>
              <path fill="none" d="M0 0h24v24H0z" />
              <g clipPath="url(#a)">
                <path
                  fill="gray"
                  fillRule="evenodd"
                  d="m8.276 14.794 6.761-7.11-.942-.991-6.762 7.11v.99h.943Zm.553 1.402H6V13.22l7.623-8.016A.65.65 0 0 1 14.095 5a.65.65 0 0 1 .47.205l1.887 1.983a.72.72 0 0 1 .195.496.72.72 0 0 1-.195.496l-7.623 8.016ZM6 17.598h12V19H6v-1.402Z"
                />
              </g>
            </svg>
          </div>
        </button>
        <button type="button" className="content__tasks__task__button" onClick={this.props.delete(this.props.id)}>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
              <defs>
                <clipPath id="a">
                  <rect width="24" height="24" fill="#fff" fillOpacity="0" rx="4" />
                </clipPath>
              </defs>
              <rect width="24" height="24" fill="none" rx="4" />
              <g fill="gray" clipPath="url(#a)">
                <path
                  fillRule="evenodd"
                  d="M12.872 9.985h1.33v5.522h-1.33V9.985ZM10.132 9.985h1.33v5.522h-1.33V9.985Z"
                />
                <path d="M18 7.167a.659.659 0 0 0-.126-.377.62.62 0 0 0-.316-.228.576.576 0 0 0-.177-.045h-3.412a2.144 2.144 0 0 0-.745-1.097A2.01 2.01 0 0 0 11.998 5a2.01 2.01 0 0 0-1.227.42 2.145 2.145 0 0 0-.745 1.097H6.614a.593.593 0 0 0-.165.027h-.015a.62.62 0 0 0-.327.251.66.66 0 0 0 .056.796.61.61 0 0 0 .358.2l.684 9.742c.01.38.158.741.412 1.013.255.271.6.434.964.454h6.83c.366-.02.71-.181.966-.453.255-.272.403-.634.413-1.014l.68-9.734a.607.607 0 0 0 .38-.213.652.652 0 0 0 .15-.419Zm-6.002-.952c.124 0 .247.026.362.079a.904.904 0 0 1 .3.223h-1.325a.898.898 0 0 1 .3-.224.866.866 0 0 1 .363-.078Zm3.414 11.575H8.58c-.079 0-.201-.133-.216-.344L7.691 7.81h8.613l-.674 9.635c-.015.211-.137.344-.218.344Z" />
              </g>
            </svg>
          </div>
        </button>
      </form>
    );
  }
}
//this.props.id
//this.props.editableId
//this.props.updateTaskDescription
//this.props.titleCreateTime
class TaskDescription extends React.Component {
  getTitleCreateTime = (createTime) => {
    let time = Math.floor((Date.now() - createTime) / 1000);
    if (time > 60) {
      let min;
      let floorTime = Math.floor(time / 60);
      if (floorTime === 1) {
        min = 'минуту';
      } else if (floorTime < 5) {
        min = 'минуты';
      } else {
        min = 'минут';
      }
      return `Создана ${floorTime} ${min} назад`;
    }
    let sek;
    if (time === 1) {
      sek = 'секунду';
    } else if (time < 5) {
      sek = 'секунды';
    } else {
      sek = 'секунд';
      return `Создана ${time} ${sek} назад`;
    }
  };
  render() {
    if (this.props.id === this.props.editableId) {
      return (
        <input
          type="text"
          className="content__tasks__task__description content__tasks__task__description_editable"
          onChange={this.props.handleChangeInput}
          onBlur={this.props.updateTaskDescription}
        />
      );
    }
    return (
      <input
        type="text"
        value={this.props.description}
        className="content__tasks__task__description"
        title={this.getTitleCreateTime(this.props.titleCreateTime)}
      />
    );
  }
}

export default App;

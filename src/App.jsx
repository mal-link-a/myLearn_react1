import React from 'react';

import logo from './img/logo.svg';
import checkBoxOff from './img/check-off.svg';
import checkBoxOn from './img/check-on.svg';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
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
          isFinished: true,
          createTime: Date.now() - 30000,
          endTime: Date.now(),
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
  }
  getDoneTaskCount() {
    let final = 0;
    for (let i = 0; i < this.state.tasks.length; i++) {
      if (this.state.tasks[i].isFinished) {
        final++;
      }
    }
    return final;
  }

  render() {
    return (
      <>
        <div className="visual_black" />
        <div className="visual_gray" />
        <div className="content">
          <img className="logo" src={logo} alt="" />
          {this.taskListHeader()}

          <div className="content__info">
            <div>
              Всего задач:
              <span className="content__info_data">{this.state.tasks.length}</span>
            </div>
            <div>
              Завершено:
              <span className="content__info_data">{this.getDoneTaskCount() + ' из ' + this.state.tasks.length}</span>
            </div>
          </div>
          <div className="content__tasks">{this.getTaskList()}</div>
        </div>
      </>
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //Голова листа| Поле добавления задачи, кнопки меню
  taskListHeader() {
    return (
      <>
        <form onSubmit={this.addNewClick}>
          <div className="content__textBox">
            <input className="content__textBox__text" type="text" placeholder="Добавить новую задачу..." />
            <button type="submit" className="content__textBox__button">
              <p>Добавить</p>
              <div className="content__textBox__button_plusVisual">+</div>
            </button>
          </div>
        </form>
        <div>
          <button type="button" className="content__navogationBtn_All buttonStyle" onClick={this.filterTaskList(0)}>
            Все задачи
          </button>
          <button type="button" className="content__navogationBtn_Ended buttonStyle" onClick={this.filterTaskList(1)}>
            В процессе
          </button>
          <button
            type="button"
            className="content__navogationBtn_Avaliable buttonStyle"
            onClick={this.filterTaskList(2)}
          >
            Завершённые
          </button>
          <button
            type="button"
            className={
              this.state.filterType === 2
                ? 'content__navogationBtn_detele-ended buttonStyle'
                : 'content__navogationBtn_detele-ended buttonStyle hidden'
            }
            onClick={this.clearAllFinishedTasks}
          >
            Очистить
          </button>
        </div>
      </>
    );
  }

  filterTaskList = (id) => () => {
    //Фильтруем таски по предустановленным категориям
    let newState = this.state;
    newState.filterType = id;
    this.setState(newState);
  };

  clearAllFinishedTasks = () => {
    //Зачищаем все готовые таски и сбрасываем фильтр
    let newState = this.state;
    newState.filterType = 0;
    for (let i = 0; i < newState.tasks.length; i++) {
      if (newState.tasks[i].isFinished) {
        newState.tasks.splice(i, 1);
        i--;
      }
    }
    this.setState(newState);
  };

  addNewClick = (e) => {
    //Создание новой таски
    e.preventDefault();
    let data = document.querySelector('.content__textBox__text');
    let newData = this.state.tasks;
    newData.push({
      name: data.value,
      isFinished: false,
      createTime: Date.now(),
    });
    data.value = '';
    this.setState({ tasks: newData });
  };
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //Формирование списка тасков
  getTaskList() {
    let finished = {};
    let avaliable = {};
    let arr = [];
    for (let i = 0; i < this.state.tasks.length; i++) {
      if (this.state.tasks[i].isFinished) {
        finished[this.state.tasks[i].endTime] = [this.state.tasks[i].name, i];
      } else {
        avaliable[this.state.tasks[i].createTime] = [this.state.tasks[i].name, i];
      }
    }
    switch (this.state.filterType) {
      case 0: {
        let avaliableSort = Object.keys(avaliable).sort().reverse();
        for (let item of avaliableSort) {
          arr.push(avaliable[item]);
        }
        let finishedSort = Object.keys(finished).sort().reverse();
        for (let item of finishedSort) {
          arr.push(finished[item]);
        }
        break;
      }
      case 1: {
        let avaliableSomeSort = Object.keys(avaliable).sort().reverse();
        for (let item of avaliableSomeSort) {
          arr.push(avaliable[item]);
        }
        break;
      }
      case 2: {
        let finishedSomeSort = Object.keys(finished).sort().reverse();
        for (let item of finishedSomeSort) {
          arr.push(finished[item]);
        }
        break;
      }
      default: {
        break;
      }
    }
    let finalArr = [];
    for (let i = 0; i < arr.length; i++) {
      finalArr.push(this.newTask(arr[i][0], arr[i][1]));
    }
    return finalArr;
  }

  newTask(string, id) {
    //Создаем новый итем таски для листа
    let itemClass = 'content__tasks__task finished task_id' + id;
    let itemClass2 = 'content__tasks__task task_id' + id;
    let item = (
      <form className={this.state.tasks[id].isFinished ? itemClass : itemClass2} onSubmit={this.updateTaskDescription}>
        <label className="content__tasks__task__checkbox">
          <input type="radio" className="content__tasks__task__checkbox_check" onChange={this.setTaskAsFinished(id)} />
          <img
            src={this.state.tasks[id].isFinished ? checkBoxOn : checkBoxOff}
            alt=""
            className="content__tasks__task__checkbox_img"
          />
        </label>

        {this.newTaskDescription(string, id)}
        <button type="button" className={this.newTaskButton(id)} onClick={this.enterEditMode(id)}>
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
        <button
          type="button"
          className="content__tasks__task__button"
          onClick={(e) => {
            e.preventDefault();
            let newData = this.state.tasks;
            newData.splice(id, 1);
            this.setState({ tasks: newData });
          }}
        >
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
    return item;
  }

  newTaskDescription(string, id) {
    //Классы для описания таски
    if (id === this.state.editID) {
      return (
        <input
          type="text"
          className="content__tasks__task__description content__tasks__task__description_editable"
          onBlur={this.updateTaskDescription}
          onMouseOver={this.getTitleCreateTime(id)}
        />
      );
    }
    return (
      <input
        type="text"
        value={string}
        className="content__tasks__task__description"
        onMouseOver={this.getTitleCreateTime(id)}
      />
    );
  }
  newTaskButton(id) {
    //Классы для кнопки редактирования описания таски
    let leEditID = this.state.editID;
    if (leEditID === id) {
      return 'content__tasks__task__button content__tasks__task__button_edit content__tasks__task__button_edit_active';
    }
    return 'content__tasks__task__button content__tasks__task__button_edit';
  }

  setTaskAsFinished = (id) => (e) => {
    e.preventDefault();
    e.target.checked = false;
    let newData = this.state;
    if (!newData.tasks[id].isFinished) {
      newData.tasks[id].isFinished = true;
      newData.tasks[id].endTime = Date.now();
      this.setState(newData);
    }
  };

  enterEditMode = (id) => (e) => {
    //Входим в едитмод для итема
    e.preventDefault();
    let itemClass = '.task_id' + id;
    let item = document.querySelector(itemClass);
    let itemDescription = item.querySelector('.content__tasks__task__description');
    let newState = this.state;
    newState.editID = id;
    this.setState(newState);
    setTimeout(() => {
      itemDescription.focus();
    }, 50);
  };

  updateTaskDescription = (e) => {
    //Обновление описания таски (Работаем на ентер или на потерю фокуса итемом)
    let newState = this.state;
    let itemClass = '.task_id' + newState.editID;
    let item = document.querySelector(itemClass);
    let itemDescription = item.querySelector('.content__tasks__task__description');
    newState.tasks[newState.editID].name = itemDescription.value;
    newState.editID = undefined;
    this.setState(newState);
    e.preventDefault();
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //Окошко title при евенте ховера описания, отображаем актуальное время с момента создания таски
  getTitleCreateTime = (id) => (event) => {
    let time = (Date.now() - this.state.tasks[id].createTime) / 1000;
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
      event.target.setAttribute('title', 'Создана ' + Math.floor(time / 60) + ' ' + min + ' назад');
    } else {
      let sek;
      let floorTime = Math.floor(time);
      if (floorTime === 1) {
        sek = 'секунду';
      } else if (floorTime < 5) {
        sek = 'секунды';
      } else {
        sek = 'секунд';
      }
      event.target.setAttribute('title', 'Создана ' + Math.floor(time) + ' ' + sek + ' назад');
    }
  };
}

export default App;

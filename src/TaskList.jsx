import React from 'react';

import checkBoxOff from './img/check-off.svg';
import checkBoxOn from './img/check-on.svg';

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
        setAsFinished={this.props.setAsFinished}
        toggieEditMode={this.props.toggieEditMode}
        deleteScr={this.props.deleteScr}
        editID={this.props.editID}
        createTime={item.createTime}
        editTaskContent={this.props.editTaskContent}
      />
    );
  }
  render() {
    let [tasks, filter] = [this.props.tasks, this.props.filter];
    let counter = 0;
    let arrWithId = [...tasks].map((item) => {
      item.id = counter++;
      return item;
    });
    let toDoData;
    switch (filter) {
      case 0: {
        toDoData = [].concat(this.getUnfinishedTaskList(arrWithId), this.getFinishedTaskList(arrWithId));
        break;
      }
      case 1: {
        toDoData = this.getUnfinishedTaskList(arrWithId);
        break;
      }
      case 2: {
        toDoData = this.getFinishedTaskList(arrWithId);
        break;
      }
      default: {
        break;
      }
    }
    return <div className="taskList">{toDoData}</div>;
  }
}

class NewTask extends React.Component {
  state = {
    textBox: '',
  };
  handleChangeInput = (e) => {
    e.preventDefault();
    console.log('Меняем state итема ' + e.target.value + ' id = ' + this.props.id);
    this.props.editTaskContent(this.props.id, e.target.value);
  };
  handleSetTaskAsFinished = () => {
    let [id, setAsFinished] = [this.props.id, this.props.setAsFinished];
    setAsFinished(id);
  };
  handleToggieEditMode = (e) => {
    console.log(e);
    e.preventDefault();
    return this.props.toggieEditMode(this.props.id, e.target.description);
  };
  handleDeleteTask = (e) => {
    e.preventDefault();
    return this.props.deleteScr(this.props.id);
  };

  render() {
    let [isFinished, editID, id, createTime, string] = [
      this.props.isFinished,
      this.props.editID,
      this.props.id,
      this.props.createTime,
      this.props.string,
    ];
    return (
      <form className={`task ${isFinished ? 'finished' : ''}`} onSubmit={this.handleToggieEditMode}>
        <label className="task__finisher">
          <button type="button" className="task__finisher_btn" onClick={this.handleSetTaskAsFinished}>
            <img src={isFinished ? checkBoxOn : checkBoxOff} alt="" className="task__finisher_img" />
          </button>
        </label>
        <TaskDescription
          id={id}
          editID={editID}
          description={string}
          titleCreateTime={createTime}
          handleChangeInput={this.handleChangeInput}
          toggieEditMode={this.handleToggieEditMode}
        />
        <button type="submit" className={`task__button task__button_edit ${editID === id ? 'button_white' : ''}`}>
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
        <button type="button" className="task__button" onClick={this.handleDeleteTask}>
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

//Получаем строку указания времени со момента создания таски
function getTitleCreateTime(createTime) {
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
}

class TaskDescription extends React.Component {
  render() {
    let [description, titleCreateTime, handleChangeInput, toggieEditMode, isEditing] = [
      this.props.description,
      this.props.titleCreateTime,
      this.props.handleChangeInput,
      this.props.toggieEditMode,
      this.props.id === this.props.editID,
    ];
    return (
      <input
        name="description"
        type="text"
        className={`task__name ${isEditing ? 'task__name_editMode' : ''}`}
        onChange={isEditing ? handleChangeInput : null}
        onBlur={isEditing ? toggieEditMode : null}
        value={description}
        title={isEditing ? '' : getTitleCreateTime(titleCreateTime)}
      />
    );
  }
}

export default TaskList;

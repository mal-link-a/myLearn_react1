import React from 'react';

//Форма для создания новых задач toDo
class TaskCreator extends React.Component {
  state = { val: '' }; //Обработка input
  handleChangeValue = (e) => {
    this.setState({ val: e.target.value });
  }; //Обработка sumbit - создание новой таски
  handleSumbit = (e) => {
    e.preventDefault();
    this.props.createCall(this.state.val);
    this.setState({ val: '' });
  };
  render() {
    return (
      <form onSubmit={this.handleSumbit}>
        <div className="taskCreator">
          <input
            className="taskCreator__textbox"
            type="text"
            placeholder="Добавить новую задачу..."
            onChange={this.handleChangeValue}
            value={this.state.val}
          />
          <button type="submit" className="taskCreator__submitBtn">
            <p>Добавить</p>
            <div className="visual_plusInCircle">+</div>
          </button>
        </div>
      </form>
    );
  }
}

export default TaskCreator;

import React from 'react';

class TaskButtonPanel extends React.Component {
  handleFilterList = (id) => {
    let filterCall = this.props.filterCall;
    return function (e) {
      return filterCall(id);
    };
  };
  render() {
    return (
      <div>
        <button type="button" className="buttonStyle" onClick={this.handleFilterList(0)}>
          Все задачи
        </button>
        <button type="button" className="buttonStyle" onClick={this.handleFilterList(1)}>
          В процессе
        </button>
        <button type="button" className="buttonStyle" onClick={this.handleFilterList(2)}>
          Завершённые
        </button>
        <button
          type="button"
          className={`buttonStyle ${this.props.filterType === 2 ? '' : 'hidden'}`}
          onClick={this.props.clearFinishedCall}
        >
          Очистить
        </button>
      </div>
    );
  }
}

export default TaskButtonPanel;

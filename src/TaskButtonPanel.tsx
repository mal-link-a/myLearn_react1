import React from 'react';

import { FilterType } from './TaskType.ts';

interface MyProps {
  filterType: string;
  filterCall: (id: string) => void;
  clearFinishedCall: () => void;
}

class TaskButtonPanel extends React.Component<MyProps> {
  handleFilterList = (id: string): (() => void) => {
    const funcFilter: (id: string) => void = this.props.filterCall;
    return function (): void {
      funcFilter(id);
    };
  };

  handleClearFinished = (): void => {
    this.props.clearFinishedCall();
  };

  render(): React.JSX.Element {
    return (
      <div>
        <button type="button" className="buttonStyle" onClick={this.handleFilterList(FilterType.ALL)}>
          Все задачи
        </button>
        <button type="button" className="buttonStyle" onClick={this.handleFilterList(FilterType.AVALIIABLE)}>
          В процессе
        </button>
        <button type="button" className="buttonStyle" onClick={this.handleFilterList(FilterType.FINISHED)}>
          Завершённые
        </button>
        <button
          type="button"
          className={`buttonStyle ${this.props.filterType === FilterType.FINISHED ? '' : 'hidden'}`}
          onClick={this.handleClearFinished}
        >
          Очистить
        </button>
      </div>
    );
  }
}

export default TaskButtonPanel;

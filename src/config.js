import './config.html';
import React from 'react';
import ReactDOM from 'react-dom';

// TODO: add router here

class App extends React.PureComponent {
  render() {
    return (
      <div>
        Text editor will be placed here
      </div>
    )
  }
}

// TODO: wait until is DOM is loaded or render on backend

ReactDOM.render(<App/>, document.getElementById('root'));

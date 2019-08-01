import './index.html';
import React from 'react';
import ReactDOM from 'react-dom';

// TODO: add router here

class App extends React.PureComponent {
  render() {
    return (
      <div>
        App Component
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));

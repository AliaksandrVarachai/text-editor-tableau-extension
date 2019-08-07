import './started-tour.html';

import React from 'react';
import ReactDOM from 'react-dom';


class App extends React.PureComponent {
  render() {
    return (
      <div>
        Result will be shown here
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));

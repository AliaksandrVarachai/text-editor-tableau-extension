import './started-tour.html';

import React from 'react';
import ReactDOM from 'react-dom';
import { POP_IS_CLOSED, EXTENSION_ORIGIN } from '../constants/constants';

window.onbeforeunload = function() {
  window.postMessage(POP_IS_CLOSED, EXTENSION_ORIGIN);
};

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

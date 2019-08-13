import React from 'react';
import ReactDOM from 'react-dom';
import DOMPurify from 'dompurify';

import './started-tour.html';
import { POP_IS_CLOSED, EXTENSION_ORIGIN } from '../constants/constants';
import * as mock from '../../mock';
import './started-tour.pcss';

window.onbeforeunload = function() {
  window.postMessage(POP_IS_CLOSED, EXTENSION_ORIGIN);
};


DOMPurify.setConfig({
  ADD_TAGS: ['iframe'],
  ADD_ATTR: ['target'],
});

class App extends React.PureComponent {


  render() {
    return (
      <div styleName="content"
           dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(mock.htmlContent)}}
      />
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));

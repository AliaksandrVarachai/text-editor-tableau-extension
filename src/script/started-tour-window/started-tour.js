import React from 'react';
import ReactDOM from 'react-dom';
import DOMPurify from 'dompurify';

import './started-tour.html';
import { POST_MSG_TYPES, POST_MSG_TYPE_NAME, ENVIRONMENT_MODES } from '../constants/constants';
import './started-tour.pcss';
import services from "../rest-api/services";

window.opener.postMessage({[POST_MSG_TYPE_NAME]: POST_MSG_TYPES.popupIsOpened}, location.origin);

window.onbeforeunload = function() {
  window.opener.postMessage({[POST_MSG_TYPE_NAME]: POST_MSG_TYPES.popupIsClosed}, location.origin);
};


DOMPurify.setConfig({
  ADD_TAGS: ['iframe'],
  ADD_ATTR: ['target'],
});

class App extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      htmlContent: '',
      tourId: '',
    };

    // TODO: create container component to avoid code duplication
    window.addEventListener('message', (eventMsg) => {
      const data = eventMsg.data;
      if (!data || !data[POST_MSG_TYPE_NAME]) {
        console.warn('Post message has undefined type.');
        return;
      }
      switch (data[POST_MSG_TYPE_NAME]) {
        case POST_MSG_TYPES.tourIdPassed:
          const { id } = data;
          services.getTour(id, ENVIRONMENT_MODES.authoring)
            .then(tour => {
              this.setState({htmlContent: tour.htmlContent});
            })
            .catch(err => {
              if (process.env.NODE_ENV === 'development')
                console.log(err);
              this.setState({htmlContent: "Sorry, tour is not found."});
            });
          this.setState({tourId: id});
          break;
        default:
          console.warn(`Unhandled message with "${eventMsg.data[POST_MSG_TYPE_NAME]}" type.`);
      }
    });
  }


  render() {
    const { htmlContent } = this.state;
    return (
      <div styleName="content"
           dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(htmlContent)}}
      />
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));

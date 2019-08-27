import React from 'react';
import ReactDOM from 'react-dom';

import './config-tour.html';
import { POST_MSG_TYPES, POST_MSG_TYPE_NAME, ENVIRONMENT_MODES } from '../constants/constants';
import TextEditor from './components/TextEditor/TextEditor';
import services from '../rest-api/services';
import './config-tour.pcss';

window.opener.postMessage({[POST_MSG_TYPE_NAME]: POST_MSG_TYPES.popupIsOpened}, location.origin);

window.onbeforeunload = function() {
  window.opener.postMessage({[POST_MSG_TYPE_NAME]: POST_MSG_TYPES.popupIsClosed}, location.origin);
};

class App extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      isVisualMode: true,
      htmlContent: '',
      tourId: '',
    };

    window.addEventListener('message', (eventMsg) => {
      const data = eventMsg.data;
      if (!data || !data[POST_MSG_TYPE_NAME]) {
        console.warn('Post message has undefined type.');
        return;
      }
      switch (data[POST_MSG_TYPE_NAME]) {
        case POST_MSG_TYPES.tourIdPassed:
          const { id } = data;
          services.getTour(id, ENVIRONMENT_MODES.authoring).then(tour => {
            this.setState({htmlContent: tour.htmlContent});
          });
          this.setState({tourId: id});
          break;
        default:
          console.warn(`Unhandled message with "${eventMsg.data[POST_MSG_TYPE_NAME]}" type.`);
      }
    });
  }


  saveHtmlContent = (event) => {
    if (!this.state.tourId) {
      console.log('Extension is not ready yet (Tour ID is waiting). Wait a bit please.');
      return;
    }
    if (this.state.isVisualMode) {
      services.updateTour();
      console.log('saveHtmlContent for VISUAL MODE is not implemented yet.');
    } else {
      console.log('saveHtmlContent for TEXT MODE is not implemented yet.');
    }
  };

  changeVisualMode = (event) => {
    this.setState({
      isVisualMode: !this.state.isVisualMode
    });
  };

  showSettings = (event) => {
    console.log('showSettings is not implemented yet.');
  };

  showHelpPage = (event) => {
    window.open('https://example.com', 'Example of help page');
  };

  render() {
    const { isVisualMode, htmlContent } = this.state;
    return (
      <>
        <div styleName="menu">
          <div styleName="menu-item" onClick={this.saveHtmlContent}>Save</div>
          <div styleName="menu-item" onClick={this.changeVisualMode}>{isVisualMode ? 'Text Editor' : 'Visual Editor'}</div>
          <div styleName="menu-item" onClick={this.showSettings}>Settings</div>
          <div styleName="menu-item" onClick={this.showHelpPage}>Help</div>
        </div>
        {
          isVisualMode
            ?
            <TextEditor
              applyChanges={this.saveHtmlContent}
              htmlContent={htmlContent}
            />
            :
            <textarea value={htmlContent}
                      styleName="text-editor-html-content"
                      onChange={this.saveHtmlContent}
            />
        }
        <div styleName="message-container">
          Messages will be here
        </div>
      </>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));

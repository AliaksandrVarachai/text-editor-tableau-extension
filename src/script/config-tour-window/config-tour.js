import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

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
        //console.warn('Post message has undefined type.');
        return;
      }
      switch (data[POST_MSG_TYPE_NAME]) {
        case POST_MSG_TYPES.tourIdPassed:
          const { id } = data;
          if (ENVIRONMENT_MODES.authoring) {
            services.getOrCreateEmptyTour(id)
              .then(tour => {
                this.setState({htmlContent: tour.htmlContent || ''});
              })
              .catch(err => {
                if (process.env.NODE_ENV === 'development')
                  console.log(err);
                this.setState({htmlContent: "Sorry, there is an error during creating a new tour."})
              });
          } else {
            services.getTour(id)
              .then(tour => {
                this.setState({htmlContent: tour.htmlContent});
              })
              .catch(err => {
                if (process.env.NODE_ENV === 'development')
                  console.log(err);
                this.setState({htmlContent: "Sorry, tour is not found."})
              });
          }

          this.setState({tourId: id});
          break;
        default:
          console.warn(`Unhandled message with "${eventMsg.data[POST_MSG_TYPE_NAME]}" type.`);
      }
    });
  }


  saveHtmlContent = (event) => {
    if (event.target.classList.contains('disabled'))
      return;
    const { tourId, htmlContent } = this.state;
    if (!tourId) {
      console.log('Extension is not ready yet (Tour ID is being waited). Wait a bit please and save again.');
      return;
    }
    services.updateTour({id: tourId, htmlContent });
  };

  applyVisualContentChanges = (newHtmlContent) => {
    this.setState({htmlContent: newHtmlContent});
  };

  applyManualContentChanges = (event) => {
    this.setState({htmlContent: event.target.value});
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
          <div styleName={classnames('menu-item', isVisualMode || 'disabled' )} onClick={this.saveHtmlContent}>
            Save
          </div>
          <div styleName="menu-item" onClick={this.changeVisualMode}>
            {isVisualMode ? 'Text Editor' : 'Visual Editor'}
          </div>
          <div styleName="menu-item" onClick={this.showSettings}>
            Settings
          </div>
          <div styleName="menu-item" onClick={this.showHelpPage}>
            Help
          </div>
        </div>
        {
          isVisualMode
            ?
            <TextEditor
              applyChanges={this.applyVisualContentChanges}
              htmlContent={htmlContent}
            />
            :
            <textarea value={htmlContent}
                      styleName="text-editor-html-content"
                      onChange={this.applyManualContentChanges}
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

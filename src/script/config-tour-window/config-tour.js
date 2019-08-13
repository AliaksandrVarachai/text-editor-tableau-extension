import React from 'react';
import ReactDOM from 'react-dom';

import './config-tour.html';
import { POP_IS_CLOSED, EXTENSION_ORIGIN } from '../constants/constants';
import TextEditor from './components/TextEditor/TextEditor';
import * as mock from '../../mock';
import './config-tour.pcss';

window.onbeforeunload = function() {
  window.postMessage(POP_IS_CLOSED, EXTENSION_ORIGIN);
};

// TODO: add router here

class App extends React.PureComponent {
  state = {
    isVisualMode: true,
  };

  saveHtmlContent = (event) => {
    if (this.state.isVisualMode) {
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
    const { isVisualMode } = this.state;
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
              htmlContent={mock.htmlContent}
            />
            :
            <textarea value={mock.htmlContent}
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

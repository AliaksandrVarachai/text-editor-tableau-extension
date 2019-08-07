import './config-tour.html';
import React from 'react';
import ReactDOM from 'react-dom';

import TextEditor from './components/TextEditor/TextEditor';

// TODO: add router here

class App extends React.PureComponent {
  state = {
    isHtmlTextEditorMode: false,
  };

  applyTextEditorChanges = () => {
    console.log('changeTextEditorMode is not implemented yet.');
  };

  changeTextEditorMode = (event) => {
    this.setState({
      isHtmlTextEditorMode: event.target.checked
    });
  };

  render() {
    const { isHtmlTextEditorMode } = this.state;
    return (
      <>
        <div className="config-menu">
          <label>
            <input type="checkbox" checked={isHtmlTextEditorMode} onChange={this.changeTextEditorMode} />
            HTML Mode
          </label>
        </div>
        {
          isHtmlTextEditorMode
            ? <div> HTML mode </div>
            : <TextEditor
                applyChanges={this.applyTextEditorChanges}
                htmlContent=""
              />
        }
        <div className="config-footer">
          Settings will be here
        </div>
      </>
    )
  }
}

// TODO: wait until is DOM is loaded or render on backend

ReactDOM.render(<App/>, document.getElementById('root'));

import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { PropTypes } from 'prop-types';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'; // Editor styles

import { createEditorState, createEmptyEditorState, createHtmlContent } from '../../../helpers/text-editor-operations.js';
import './TextEditor.css';

const toolbar = {
  options: [
    'inline',
    'blockType',
    'fontSize',
    'fontFamily',
    'list',
    'textAlign',
    'colorPicker',
    'link',
    'embedded',
    'emoji',
    'image',
    'remove',
    'history'
  ],
  inline: {
    options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
  },
  blockType: {
    options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
  },
  fontSize: {
    options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36],
  },
  fontFamily: {
    options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
  },
  list: {
    options: ['unordered', 'ordered', 'indent', 'outdent'],
  },
  textAlign: {
    options: ['left', 'center', 'right', 'justify'],
  },
  colorPicker: {},
  link: {
    defaultTargetOption: '_blank',
    options: ['link', 'unlink'],
  },
  emoji: {},
  embedded: {
    defaultSize: {
      height: 'auto',
      width: 'auto',
    },
  },
  image: {
    defaultSize: {
      height: 'auto',
      width: 'auto',
    },
  },
  remove: {},
  history: {
    options: ['undo', 'redo'],
  },
};


export default class TextEditor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editorState: createEmptyEditorState(),
      prevHtmlContent: ''
    };
  }

  static propTypes = {
    applyChanges: PropTypes.func.isRequired,
    htmlContent: PropTypes.string.isRequired,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.htmlContent !== state.prevHtmlContent) {
      return {
        editorState: createEditorState(props.htmlContent),
        prevHtmlContent: props.htmlContent
      }
    }
    return null;
  }

  onEditorStateChange = (editorState) => {
    this.setState({ editorState })
  };

  onBlur = (event) => {
    this.props.applyChanges({
      htmlContent: createHtmlContent(this.state.editorState)
    });
  };

  setEditorRef = ref => {
    if (ref) {
      ref.focus();
    }
  };


  render () {
    return (
      <Editor
        toolbar={toolbar}
        editorState={this.state.editorState}
        onEditorStateChange={this.onEditorStateChange}
        onBlur={this.onBlur}
        editorRef={this.setEditorRef}
      />
    );
  }
}

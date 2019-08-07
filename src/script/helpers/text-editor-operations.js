import {ContentState, convertToRaw, EditorState} from "draft-js";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";

/**
 * Creates an editor state instance for draft-js text editor.
 * @param {string} htmlContent - html content need to be transformed to the editor state.
 * @returns {EditorState}
 */
export function createEditorState(htmlContent) {
  const contentBlock = htmlToDraft(htmlContent);
  const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
  return EditorState.createWithContent(contentState);
}

/**
 * Creates an empty content for draft-js text editor.
 * @returns {EditorState}
 */
export function createEmptyEditorState() {
  return EditorState.createEmpty();
}

/**
 * Creates an HTML text by based on the provided editor state.
 * @param {object} editorState
 * @returns {string}
 */
export function createHtmlContent(editorState) {
  return draftToHtml(convertToRaw(editorState.getCurrentContent()));
}

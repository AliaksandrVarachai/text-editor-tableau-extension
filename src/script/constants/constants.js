/**
 * Unique ID for guided tour extension.
 * @type {string}
 */
const extensionUuid = '69035efe-daca-4d4c-8ed5-217628600423';

/**
 * Types of messages passing between the extension and child windows.
 * @type {{popupIsClosed: string, popupIsOpened: string, tourIdPassed: string}}
 */
const POST_MSG_TYPES = {
  popupIsOpened: 'popupIsOpened',
  popupIsClosed: 'popupIsClosed',
  tourIdPassed: 'tourIdPassed',
};

/**
 * Data sent via postMessage in shape { [POST_MSG_TYPE_NAME]: POST_MSG_TYPES.popupIsOpened }.
 * Allows not confuse with native Tableau data that has similar shape.
 * @type {string}
 */
const POST_MSG_TYPE_NAME = `type_${extensionUuid}`;

/**
 * Extension origin (needed for security reason).
 * @type {string}
 */
const EXTENSION_ORIGIN = '*'; // TODO: replace with real extension origin

/**
 * Unique settings key name for the guided tour extension.
 * @type {string}
 */
const SETTINGS_KEY = `guidedTourSettingsKey_${extensionUuid}`;

/**
 *
 * @type {{authoring: string, viewing: string}}
 */
const ENVIRONMENT_MODES = {
  authoring: 'authoring',
  viewing: 'viewing',
};

/**
 * Target path of the config file in public repository
 * @type {string}
 */
const CONFIG_FILE_PATH = 'config.json';


module.exports = {
  POST_MSG_TYPES,
  POST_MSG_TYPE_NAME,
  EXTENSION_ORIGIN,
  SETTINGS_KEY,
  ENVIRONMENT_MODES,
  CONFIG_FILE_PATH,
};

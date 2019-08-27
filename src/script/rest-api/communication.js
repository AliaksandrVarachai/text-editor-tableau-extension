import { CONFIG_FILE_PATH } from '../constants/constants';
import getJsonFromResponse from './get-json-from-response';

const getApiHostAsync = fetch(CONFIG_FILE_PATH)
  .then(rawConfig => getJsonFromResponse(rawConfig))
  .then(config => {
    if (!config || !config.GUIDED_TOUR_API_HOST)
      throw Error("Config file does not contain GUIDED_TOUR_API_HOST value.");
    return config.GUIDED_TOUR_API_HOST;
  });

/**
 * Sends a get request to the server.
 * @param {string} apiPath - api url.
 * @returns {Promise<object|null>}
 * @throws {error} - status end description of an error.
 */
function get(apiPath) {
  const options = {
    headers: new Headers({'Accept': 'application/json'})
  };
  return getApiHostAsync
    .then(host => fetch(`${host}${apiPath}`, options))
    .then(response => getJsonFromResponse(response));
}

/**
 * Sends a post request to the server.
 * @param {string} apiPath - api url.
 * @param {object} data - object is to be sent in the body of a request.
 * @returns {Promise<object|null>} - a js object formed from response body.
 * @throws {error} - status and description of the error.
 */
function post(apiPath, data) {
  const options = {
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }),
    method: 'POST',
    body: JSON.stringify(data)
  };
  return getApiHostAsync
    .then(host => fetch(`${host}${apiPath}`, options))
    .then(response => getJsonFromResponse(response));
}

/**
 * Sends a put request to the server.
 * @param {string} apiPath - api url.
 * @param {object} data - object is to be sent in the body of a request.
 * @returns {Promise<object|null>} - a js object formed from response body.
 * @throws {error} - status and description of the error.
 */
function put(apiPath, data) {
  const options = {
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }),
    method: 'PUT',
    body: JSON.stringify(data)
  };
  return getApiHostAsync
    .then(host => fetch(`${host}${apiPath}`, options))
    .then(response => getJsonFromResponse(response));
}

/**
 * Sends a delete request to the server.
 * @param {string} apiPath - api url.
 * @returns {Promise<object|null>} - a js object formed from response body.
 * @throws {error} - status and description of the error.
 */
function delete1(apiPath) {
  const options = {
    headers: new Headers({'Accept': 'application/json'}),
    method: 'DELETE'
  };
  return getApiHostAsync
    .then(host => fetch(`${host}${apiPath}`, options))
    .then(response => getJsonFromResponse(response));
}

export default {
  get,
  post,
  put,
  'delete': delete1
}

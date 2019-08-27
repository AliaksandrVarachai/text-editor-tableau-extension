import { ENVIRONMENT_MODES } from '../constants/constants';
import communication from './communication';


/**
 * Gets a tour object which depends on the environment mode.
 * @param {string} id - tour's ID.
 * @param {string} modeEnvironment - environment node.
 * @returns {Promise<object>} - promise returning tour object.
 */
function getTour(id, modeEnvironment = ENVIRONMENT_MODES.viewing) {
  const modeSearchParam = modeEnvironment === ENVIRONMENT_MODES.viewing ? 'viewing' : 'authoring';
  return communication.get(`api/tours/getTour/${id}?mode=${modeSearchParam}`);
}


/**
 * Updates a tour.
 * @param {string} id - tour's ID.
 * @returns {Promise<object>} - promise returning tour object.
 */
function updateTour(id) {
  return communication.get(`api/tours/updateTour/${id}`);
}

/**
 * Creates a tour.
 * @param {string} id - tour's ID.
 * @returns {Promise<object>} - promise returning null.
 */
function createTour(id) {
  return communication.get(`api/tours/createTour/${id}`);
}

/**
 * Deletes a tour.
 * @param {string} id - tour's ID.
 * @returns {Promise<null>} - promise returning null.
 */
function deleteTour(id) {
  return communication.get(`api/tours/deleteTour/${id}`);
}


export default {
  getTour,
  updateTour,
  createTour,
  deleteTour,
};

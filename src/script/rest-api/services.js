import communication from './communication';


/**
 * Gets a tour for Viewing mode.
 * @param {string} id - tour's ID.
 * @returns {Promise<object>} - promise returning tour object.
 */
function getTour(id) {
  return communication.get(`api/tours/getTour?id=${id}`);
}

/**
 * Gets a tour (creates a new empty tour, if there is no tours with given ID) for Authoring mode.
 * @param {string} id - tour's ID.
 * @returns {Promise<object>} - promise returning tour object.
 */
function getOrCreateEmptyTour(id) {
  return getTour(id)
    .then(tour => tour ? [tour, null] : Promise.all([
      tour,
      createTour( {id, htmlContent: 'Add your content here, please.'} )
    ]))
    .then(([tour, _]) => tour || getTour(id));
}


/**
 * Updates a tour.
 * @param {string} id - tour's ID.
 * @param {string} htmlContent - new HTML content of the tour.
 * @returns {Promise<object>} - promise returning tour object.
 */
function updateTour({ id, htmlContent }) {
  return communication.put(`api/tours/updateTour?id=${id}`, { id, htmlContent });
}

/**
 * Creates a tour.
 * @param {string} id - tour's ID.
 * @param {string} htmlContent - HTML content of the new tour.
 * @returns {Promise<object>} - promise returning null.
 */
function createTour({ id, htmlContent }) {
  return communication.put(`api/tours/createTour?id=${id}`, { id, htmlContent });
}

/**
 * Deletes a tour.
 * @param {string} id - tour's ID.
 * @returns {Promise<null>} - promise returning null.
 */
function deleteTour(id) {
  return communication.get(`api/tours/deleteTour?id=${id}`);
}


export default {
  getTour,
  getOrCreateEmptyTour,
  updateTour,
  createTour,
  deleteTour,
};

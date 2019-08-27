/**
 * Processes a response and provides data from its body.
 * @param {object} response - a response object.
 * @returns {object|null} - a js object formed from response body.
 * @throws {error} - status and description of the error.
 */
export default function(response) {
  if (response.ok)
    return response.status !== 204 ? response.json() : null;

  throw new Error(`Error ${response.status}: ${response.statusText}`);
}
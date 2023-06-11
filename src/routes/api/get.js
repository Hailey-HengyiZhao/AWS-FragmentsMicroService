// src/routes/api/get.js
const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...
  logger.debug('User: ' + req.user);

  const fragment = await Fragment.byUser(req.user);
  logger.debug('With following fragments: ' + fragment);

  const data = { status: 'ok', fragments: fragment };
  logger.debug('Received the data' + data);

  res.status(200).json(createSuccessResponse(data));
};

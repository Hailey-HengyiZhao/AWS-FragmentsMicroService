// src/routes/api/get.js
const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {

  const { expand } = req.query;
  logger.debug("The expand is: " + expand);

  logger.debug('User: ' + req.user);

  const fragment = await Fragment.byUser(req.user,expand ==="1");
  logger.debug('With following fragment: ' + fragment);

  const data = { status: 'ok', fragments: fragment };
  logger.debug('Received the data' + data);

  res.status(200).json(createSuccessResponse(data));
};

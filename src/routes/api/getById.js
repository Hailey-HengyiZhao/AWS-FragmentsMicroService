// src/routes/api/getById.js
const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    logger.debug('Id is: ' + id);

    const fragment = await Fragment.byId(req.user, id);
    logger.debug('With Fragment: ' + fragment);
    
    const fragmentContent = await fragment.getData(fragment.ownerId, fragment.id);
    logger.debug('Received the data' + fragmentContent.toString());

    res.status(200).send(fragmentContent.toString());
  } catch (err) {
    logger.error('Fragment is not existed:', err);
    res.status(404).json({ error: 'Fragment is not existed' });
  }
};

// src/routes/api/getIdInfo.js
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragment detail by fragment id
 */
module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    logger.debug('Id is: ' + id);

    const fragment = await Fragment.byId(req.user, id);
    logger.debug('With Fragment: ' + fragment);

    if (!fragment) {
      return res.status(404).json({ error: 'Fragment not found' });
    }

    res.status(200).json({ status: 'ok', fragment });
  } catch (err) {
    logger.error('Fragment is not existed:', err);
    res.status(404).json({ error: 'Fragment is not existed' });
  }
};

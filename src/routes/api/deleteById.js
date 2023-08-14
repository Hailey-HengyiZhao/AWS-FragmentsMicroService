const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    let id = req.params.id;

    logger.debug('Attempting to delete fragment with ID: ' + id);

    // Check if the fragment with the given id exists.
    const fragment = await Fragment.byId(req.user, id);

    if (!fragment) {
      return res.status(400).json({ error: 'Fragment not found' });
    }

    logger.debug('Fragment found. Deleting...');

    // Delete the fragment.

    await Fragment.delete(req.user, id);
    
    logger.debug('Fragment deleted successfully.');

    res.status(200).json({ status: 'ok' });
    
  } catch (err) {
    logger.error('Error fetching fragment:', err);
    res.status(404).json({ error: 'Failed to delete the fragment' });
  }
};

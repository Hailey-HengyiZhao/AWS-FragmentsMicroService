// src/routes/api/putById.js
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Update the fragment when supporting with correct id
 */

module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    logger.debug('Id is: ' + id);

    const fragment = await Fragment.byId(req.user, id);
    logger.debug('With Fragment: ' + fragment);

    // Check if the fragment exists
    if (!fragment) {
      return res.status(404).json({ error: 'Fragment not found' });
    }

    // Check if the Content-Type matches the existing fragment's type
    if (req.get('Content-Type') !== fragment.type) {
      return res.status(400).json({ error: 'Content-Type does not match the fragment type' });
    }

    const updatedData = req.body;

    // Update the fragment's data
    await fragment.setData(updatedData);
    logger.debug('Fragment data updated');

    // Return the updated fragment metadata
    res
      .status(200)
      .json({ status: 'ok', fragment: { ...fragment, format: [req.get('Content-Type')] } });
  } catch (err) {
    logger.error('Error updating fragment:', err);
    res.status(500).json({ error: 'Failed to update fragment' });
  }
};

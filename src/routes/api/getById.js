// src/routes/api/getById.js
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const markdownIt = require('markdown-it');

/**
 * Get a list of fragment detail by fragment id
 */
module.exports = async (req, res) => {
  
  try {
    let id = req.params.id,
      ext = '';
    if (req.params.id.includes('.')) {
      id = req.params.id.split('.')[0];
      ext = req.params.id.split('.')[1];
    }

    logger.debug('Id is: ' + id);
    logger.debug('ext is: ' + ext);

    const fragment = await Fragment.byId(req.user, id);
    logger.debug('With Fragment: ' + fragment);

    if (!fragment) {
      return res.status(404).json({ error: 'Fragment not found' });
    }

    const fragmentContent = await fragment.getData(fragment.ownerId, fragment.id);
    logger.debug('Received the data: ' + fragmentContent.toString());

    if (ext === 'html' && fragment.type === 'text/markdown') {

      // If the extension is html and the original fragment type is markdown, do the conversion
      const htmlContent = markdownIt().render(fragmentContent.toString());
      res.set('Content-Type', 'text/html');
      res.status(200).send(htmlContent);
    } else {
      
      // If there's no conversion required, respond with the original fragment data
      res.set('Content-Type', fragment.type);
      res.status(200).send(fragmentContent);
    }
  } catch (err) {
    logger.error('Error fetching fragment:', err);
    res.status(404).json({ error: 'Failed to fetch the fragment' });
  }
};







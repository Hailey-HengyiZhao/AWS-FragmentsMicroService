// src/routes/api/getById.js
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const markdownIt = require('markdown-it');
const sharp = require('sharp');

/**
 * Get a list of fragment detail by fragment id
 */

function validConversion(contentType, extension) {
  const conversions = {
    'text/plain': ['.txt'],
    'text/markdown': ['.md', '.html', '.txt'],
    'text/html': ['.html', '.txt'],
    'application/json': ['.json', '.txt'],
    'image/png': ['.png', '.jpg', '.webp', '.gif'],
    'image/jpeg': ['.jpg', '.png', '.webp', '.gif'],
    'image/webp': ['.webp', '.jpg', '.png', '.gif'],
    'image/gif': ['.gif', '.jpg', '.webp', '.png'],
  };

  return conversions[contentType] ? conversions[contentType].includes(extension) : false;
}

module.exports = async (req, res) => {
  try {
    let id = req.params.id,
      ext = '';
    if (req.params.id.includes('.')) {
      id = req.params.id.split('.')[0];
      ext = `.${req.params.id.split('.')[1]}`;
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
    logger.debug("Fragment Type is:" + fragment.type);

    // If route includes .ext
    if (ext) {
      if (validConversion(fragment.type, ext)) {
        switch (ext) {
          case '.txt':
            res.set('Content-Type', 'text/plain');
            if (fragment.contentType === 'text/markdown') {
                const htmlContent = markdownIt().render(fragmentContent.toString());
                const plainContent = htmlContent.replace(/<[^>]+>/g, '');
                res.status(200).send(plainContent);
            } else {
                res.status(200).send(fragmentContent.toString());
            }
            break;

          case '.md':
            res.set('Content-Type', 'text/markdown');
            res.status(200).send(fragmentContent);
            break;

          case '.html':
            // eslint-disable-next-line no-case-declarations
            const htmlContent = markdownIt().render(fragmentContent.toString());
            res.set('Content-Type', 'text/html');
            res.status(200).send(htmlContent);
            break;

          case '.json':
            res.set('Content-Type', 'application/json');
            if (fragment.contentType === 'text/markdown') {
              const jsonData = { content: markdownIt().render(fragmentContent.toString()) };
              res.status(200).json(jsonData);
            } else {
              res.status(200).json(fragmentContent);
            }
            break;

          case '.png':
          case '.jpg':
          case '.webp':
          case '.gif':
            if (
              ['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(fragment.contentType)
            ) {
              sharp(fragmentContent)
                .toFormat(ext.replace('.', ''))
                .toBuffer()
                .then((data) => {
                  res.set('Content-Type', `image/${ext.replace('.', '')}`);
                  res.status(200).send(data);
                })
                .catch((err) => {
                  logger.error('Error converting image:', err);
                  res.status(500).json({ error: 'Image conversion failed' });
                });
            }
            break;

          default:
            res.status(415).json({ error: 'Unsupported conversion type' });
            break;
        }
      } else {
        return res
          .status(415)
          .json({
            error: 'Cannot convert the Fragment Type from ' + fragment.contentType + ' to ' + ext,
          });
      }
      // Route without .ext
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

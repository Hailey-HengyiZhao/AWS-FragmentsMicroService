// src/routes/api/getById.js

const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse } = require('../../response');
const markdownIt = require('markdown-it');
const sharp = require('sharp');

/**
 * Get a list of fragment detail by fragment id
 */

function validConversion(contentType, extension) {
  const conversions = {
    'text/markdown': ['.html'],
    'image/png': ['.png', '.jpg', '.webp', '.gif'],
    'image/jpeg': ['.jpg', '.png', '.webp', '.gif'],
    'image/webp': ['.webp', '.jpg', '.png', '.gif'],
    'image/gif': ['.gif', '.jpg', '.webp', '.png'],
  };

  return conversions[contentType] ? conversions[contentType].includes(extension) : false;
}

function validSameType(contentType, extension) {
  const basicType = {
    'text/plain': '.txt',
    'text/markdown': '.md',
    'text/html': '.html',
    'application/json': '.json',
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };

  return basicType[contentType] === extension;
}

function returnTypeFunction(extension) {
  const returnType = {
    '.txt': 'text/plain',
    '.md': 'text/markdown',
    '.html': 'text/html',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  };
  return returnType[extension];
}

async function convert(fragment, type) {
  const original = await fragment.getData();
  const transformer = sharp(original);
  switch (type) {
    case 'image/jpeg':
      transformer.jpeg();
      break;
    case 'image/png':
      transformer.png();
      break;
    case 'image/webp':
      transformer.webp();
      break;
    default:
      break;
  }

  return transformer.toBuffer();
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

    let fragmentList = await Fragment.byUser(req.user);

    // Check if the fragment exists
    if (!fragmentList.includes(id)) {
      logger.error('404 Error: Fragment not found');
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }

    const fragment = await Fragment.byId(req.user, id);
    logger.debug('With Fragment: ' + fragment);

    if (!fragment) {
      return res.status(404).json({ error: 'Fragment not found' });
    }
    const response = new Fragment(fragment);
    const fragmentContent = await response.getData();
    const type = fragment.mimeType;
    // logger.debug('Received the data: ' + fragmentContent.toString());
    logger.debug('Fragment Type is:' + type);

    // If route includes .ext
    if (ext) {
      if (validSameType(type, ext)) {
        logger.debug('No converting happened...');
        res.set('Content-Type', type);
        return res.status(200).send(fragmentContent);
      }

      if (validConversion(type, ext)) {
        logger.debug('Now Starts conversion from ' + type + ' to ' + ext + '...');
        switch (ext) {
          case '.html':
            logger.debug('Converting the' + type + ' to .html ...');
            if (type == 'text/markdown') {
              const htmlContent = markdownIt().render(fragmentContent.toString());
              res.set('Content-Type', 'text/html');
              res.status(200).send(htmlContent);
            }
            break;

          case '.png':
          case '.jpg':
          case '.webp':
          case '.gif':
            logger.debug('Converting the' + type + ' to ' + ext + ' ...');

            try {
              const returnType = returnTypeFunction(ext);
              const convertedImageBuffer = await convert(fragment, returnType);
              res.set('Content-Type', returnType);
              res.status(200).send(convertedImageBuffer);
            } catch (err) {
              logger.error('Error converting image:', err);
              res.status(500).json({ error: 'Image conversion failed' });
            }
            break;
        }
      } else {
        return res.status(415).json({
          error: 'Cannot convert the Fragment Type from ' + type + ' to ' + ext,
        });
      }
      // Route without .ext
    } else {
      // If there's no conversion required, respond with the original fragment data
      res.set('Content-Type', type);
      res.status(200).send(fragmentContent);
    }
  } catch (err) {
    logger.error('Something wrong', err);
    res.status(500).json({ error: 'Failed to fetch the fragment' });
  }
};

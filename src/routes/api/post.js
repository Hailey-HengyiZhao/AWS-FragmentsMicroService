const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const type = req.get('Content-Type');

  // Checking the Content-Type to be text
  if (!Fragment.isSupportedType(type)) {
    logger.error('415 Error: Not supported "Content-Type"');
    return res.status(415).json(createErrorResponse(415, 'Not supported "Content-Type"'));
  }

  const fragmentContent = req.body;
  const ownerId = req.user;

  const fragment = new Fragment({
    ownerId: ownerId,
    type: type,
  });
  logger.debug('Create Fragment having ownerId: ' + fragment.ownerId + ' Type: ' + fragment.type);
  
  try {
    await fragment.save();
    await fragment.setData(fragmentContent);
  } catch (err) {
    logger.error('Async Error:', err);
    res.status(404).json({ error: 'Can not save the fragment' });
  }

  logger.debug(
    'Set the fragment content:' + fragmentContent + ' into fragment.ownerId ' + fragment.ownerId
  );

  let fragmentUrl =
    `${process.env.API_URL}/v1/fragments/${fragment.id}` ||
    `${req.protocol}://${req.headers.host}/v1/fragments/${fragment.id}`;
  res.setHeader('Location', fragmentUrl);
  logger.debug('Create new Header.Location with URL address: ' + fragmentUrl);

  res.status(201).json(createSuccessResponse({ fragment: fragment }));
  logger.debug('Creating new response with { status: ok, fragment: [' + fragment + ']}');
};

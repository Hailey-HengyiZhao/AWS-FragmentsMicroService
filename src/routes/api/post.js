const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const fragmentContent = req.body;
  const ownerId = req.user;

  const fragment = new Fragment({
    ownerId: ownerId,
    type: req.get('Content-Type'),
  });

  logger.debug('Create Fragment having ownerId: ' + fragment.ownerId + ' Type: ' + fragment.type);

  await fragment.save();
  await fragment.setData(fragmentContent);

  logger.debug(
    'Set the fragment content:' +
      fragmentContent +
      ' into fragment with ownerId ' +
      fragment.ownerId
  );

  let fragmentUrl =
    `${process.env.API_URL}/v1/fragments/${fragment.id}` ||
    `${req.protocol}://${req.headers.host}/v1/fragments/${fragment.id}`;
  res.setHeader('Location', fragmentUrl);

  const fragmentsOwnedByUser = await Fragment.byUser(fragment.ownerId, true);

  res.status(200).json(createSuccessResponse({ fragments: fragmentsOwnedByUser}));
};

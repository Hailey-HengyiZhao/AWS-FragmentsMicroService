const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    let id = req.params.id;

    logger.debug('Id is: ' + id);

    let fragmentList = await Fragment.byUser(req.user);
    
    // Check if the fragment exists
    if (!fragmentList.includes(id)) {
      logger.error('404 Error: Fragment not found');
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }

    let fragment = await Fragment.byId(req.user, id);

    logger.debug('With Fragment: ' + fragment);

    const type = req.get('Content-Type');
    // Check if the Content-Type matches the existing fragment's type

    if (!Fragment.isSupportedType(type)) {
      logger.error('415 Error: Not supported "Content-Type"');
      return res.status(415).json(createErrorResponse(415, 'Not supported "Content-Type"'));
    }

    const updatedData = req.body;
    logger.debug('Wanted to update the data: ' + updatedData);

    // Update the fragment's data
    await fragment.setData(updatedData);
    fragment.type = type;

    logger.debug('Fragment data updated and its type is:' + fragment.type);

    let fragmentUrl =
      `${process.env.API_URL}/v1/fragments/${fragment.id}` ||
      `${req.protocol}://${req.headers.host}/v1/fragments/${fragment.id}`;
    res.setHeader('Location', fragmentUrl);

    logger.debug('Updated Header.Location with URL address: ' + fragmentUrl);

    res.status(200).json(createSuccessResponse({ fragment: fragment }));
    logger.debug('Updated response with { status: ok, fragment: [' + fragment + ']}');
  } catch (err) {
    logger.error('Error updating fragment:', err);
    res.status(500).json(createErrorResponse(500, 'Failed to update fragment'));
  }
};

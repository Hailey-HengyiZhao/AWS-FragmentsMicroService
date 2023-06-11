const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
const logger = require('../../logger');
const express = require('express');

const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      const { type } = contentType.parse(req.headers['content-type']);
      return Fragment.isSupportedType(type);
    },
  });

module.exports = [
  rawBody,
  async (req, res) => {
    try {
      const { type } = contentType.parse(req.headers['content-type']);
      logger.debug('Create type: ' + type);

      if (!Fragment.isSupportedType(type)) {
        const code = 415;
        const msg = `Unsupported content type: ${type}`;
        logger.error('error', msg);
        res.status(code).json(createSuccessResponse(code, msg));
        return;
      }

      const fragmentContent = req.body;
      const ownerId = req.user.id;

      const fragment = new Fragment({
        ownerId: ownerId,
        type: req.headers['content-type'],
        size: fragmentContent.length,
      });
      logger.debug('Create Fragment having ownerId: ' + fragment.ownerId + ' Type: ' + type + '');

      await fragment.save();
      await fragment.setData(fragmentContent);

      logger.debug(
        'Set the fragment content:' +
          fragmentContent +
          ' into fragment with ownerId ' +
          fragment.ownerId
      );

      let fragmentUrl =
        `${process.env.API_URL}/v1/fragments/` ||
        `${req.protocol}://${req.headers.host}/v1/fragments/`;
      res.setHeader('Location', fragmentUrl);

      res.status(200).json(createSuccessResponse(fragment.byUser(ownerId)));

    } catch (error) {
      const code = 500;
      const msg = 'Failed to create fragment';
      logger.error({ error }, `Error creating fragment`);
      res.status(code).json(createErrorResponse(code, msg));
    }
  },
];

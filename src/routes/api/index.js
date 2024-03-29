// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment');

// Create a router on which to mount our API endpoints
const router = express.Router();

const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });


//GET /v1/fragments/:id/info
router.get('/fragments/:id/info', require('./getIdInfo'));

// GET /v1/fragments/:id  and /v1/fragments/:id.ext
router.get('/fragments/:id', require('./getById'));

// PUT /v1/fragments/:id 
router.put('/fragments/:id', rawBody(), require('./putById'));

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));

// POST /V1/fragments
router.post('/fragments', rawBody(), require('./post'));

// Delete /v1/fragments
router.delete('/fragments/:id', require('./deleteById'));

// Other routes will go here later on...
module.exports = router;

const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const {
  getAllUsersHandler,
  getUserByIdHandler,
  addUserHandler,
  updateUserByIdHandler,
  deleteUserByIdHandler,
} = require('../handler/userHandler');

const userRoute = [
  {
    method: 'GET',
    path: '/users',
    handler: getAllUsersHandler,
  },
  {
    method: 'GET',
    path: '/users/{userId}',
    handler: getUserByIdHandler,
  },
  {
    method: 'POST',
    path: '/users',
    handler: addUserHandler,
  },
  {
    method: 'PUT',
    path: '/users/{userId}',
    options: {
      validate: {
        params: Joi.object({
          userId: Joi.objectId(),
        }),
      },
    },
    handler: updateUserByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/users/{userId}',
    options: {
      validate: {
        params: Joi.object({
          userId: Joi.objectId(),
        }),
      },
    },
    handler: deleteUserByIdHandler,
  },
];

module.exports = userRoute;

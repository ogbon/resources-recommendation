/* eslint-disable babel/new-cap */
import express from 'express'

import permissions from '../middlewares/permissions'
import recommendationController from '../controllers/recommendation'
import schemas from '../helpers/schemas'
import validators from '../middlewares/validators'

const recommendations = express.Router()

recommendations.route('/')
  .post(permissions.isAuthenticated, validators.requestSchema(schemas.recommendation.create, 'body'), recommendationController.create)
  .get(permissions.isAuthenticated, recommendationController.index)

recommendations.route('/:id')
  .patch(permissions.isAuthenticated, validators.requestSchema(schemas.recommendation.update, 'body'), recommendationController.update)
  .delete(permissions.isAdmin, recommendationController.remove)
  .get(permissions.isAuthenticated, recommendationController.show)

export default recommendations

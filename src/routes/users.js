/* eslint-disable babel/new-cap */
import express from 'express'

import permissions from '../middlewares/permissions'
import recommendationController from '../controllers/recommendation'

const users = express.Router()

users.route('/recommendations')
  .get(permissions.isAdmin, recommendationController.fetchRecommendations)

export default users

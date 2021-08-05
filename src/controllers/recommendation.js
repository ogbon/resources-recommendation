import * as Promise from 'bluebird'

import RecommendationService from '../services/RecommendationService'
import {CREATED, UNPROCESSABLE_ENTITY, OK, UNAUTHORIZED, ACCEPTED} from '../constants/statusCodes'
import {pagination, totalPage} from '../helpers/tools'

const recommendations = {
  create: (req, res) => {
    const recommendationService = new RecommendationService(req.decoded)

    Promise.try(() => recommendationService.add(req.body))
      .then(([newRecommendation]) => res.status(CREATED).send({data: newRecommendation, message: null, success: true}))
      .catch((err) => res.status(UNPROCESSABLE_ENTITY).send({
        data: null,
        message: 'Unable to complete your request at the moment, please confirm that you do not have missing required fields.',
        success: false
      }))
  },
  index: (req, res) => {
    const recommendationService = new RecommendationService(req.decoded)

    Promise.try(() => recommendationService.find())
      .then(recommendations => res.status(OK).send({data: recommendations, message: null, success: true}))
      .catch(() => res.status(UNPROCESSABLE_ENTITY).send({
        data: null,
        message: 'Unable to complete your request at the moment.',
        success: false
      }))
  },
  show: (req, res) => {
    const recommendationService = new RecommendationService(req.decoded)

    Promise.try(() => recommendationService.get(req.params.id))
      .then(recommendation => res.status(OK).send({data: recommendation, message: null, success: true}))
      .catch((err) => {
        if (err.message === 'Current User cannot view this recommendation.')
          res.status(UNAUTHORIZED).send({data: null, message: err.message, success: false})
        else
          res.status(UNPROCESSABLE_ENTITY).send({data: null, message: 'Unable to process your request.', success: false})
      })
  },
  update: (req, res) => {
    const recommendationService = new RecommendationService(req.decoded)

    Promise.try(() => recommendationService.update(req.params.id, req.body))
      .then(updatedRecommendation => res.status(OK).send({data: updatedRecommendation, message: null, success: true}))
      .catch(err => {
        if (err.message === 'Current User cannot view this recommendation.')
          res.status(UNAUTHORIZED).send({data: null, message: err.message, success: false})
        else
          res.status(UNPROCESSABLE_ENTITY).send({data: null, message: 'Unable to process your request.', success: false})
      })
  },

  remove: (req, res) => {
    const recommendationService = new RecommendationService()

    Promise.try(() => recommendationService.remove(req.params.id))
      .then(() => res.status(ACCEPTED).send({data: null, message: 'Recommendation removed', success: true}))
      .catch(err => {
          res.status(UNPROCESSABLE_ENTITY).send({data: null, message: 'Unable to process your request.', success: false})
      })
  },

  fetchRecommendations: (req, res) => {
    const recommendationService = new RecommendationService()
    const {page} = req.query

    Promise.try(() => recommendationService.fetchRecommendations({...pagination(page)}))
      .then(({count,rows}) => res.status(OK).send({
        count,
        data: rows,
        currentPage: parseInt(page && page.number, 10) || 1,
        totalPage: totalPage(count, (page && page.size)),
        message: null,
        success: true
      }))
      .catch(() => res.status(UNPROCESSABLE_ENTITY).send({
        data: null,
        message: 'Unable to complete your request at the moment.',
        success: false
      }))
  }
}

export default recommendations

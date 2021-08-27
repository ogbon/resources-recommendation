import db from '../../db/models'
import DataService from './DataService'

class RecommendationService extends DataService {
  constructor(currentUser = {}) {
    super(db.Recommendation)

    this.currentUser = currentUser
  }

  add(payload) {
    const recommendationPayload = {...payload, user_id: this.currentUser.id}
    return this.model.findOrCreate({where: {user_id: recommendationPayload.user_id}, defaults: recommendationPayload})
  }

  get(id) {
    return this.show({id, user_id: this.currentUser.id}).then(recommendation => {
      if (recommendation)
        return recommendation
      else
        throw new Error('Current User cannot view this recommendation.')
    })
  }

  update(id, payload) {
    return this.show({id, user_id: this.currentUser.id}).then(recommendation => {
      if (recommendation)
        return recommendation.update(payload)
      else
        throw new Error('Current User cannot view this recommendation.')
    })
  }

  remove(id) {
    return this.show({id}).then(recommendation => {
      if (recommendation)
        return recommendation.destroy()
      else
        throw new Error('Invalid recommendation id.')
    })
  }

  find() { return this.index({where: {user_id: this.currentUser.id}}) }

  fetchRecommendations({limit, offset}) {
    return this.paginatedIndex({
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })
  }
}

export default RecommendationService

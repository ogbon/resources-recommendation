import { expect } from 'chai'
import app from '../../src/app'
import request from 'supertest';
import db from '../../db/models'

const validAdminUser = {
  name: 'Torera',
  email: 'torera@gmail.com',
  password: 'torera'
}

const validUser = {
  name: 'Toreran',
  email: 'toreran@gmail.com',
  password: 'toreran'
}

let token
let adminToken
let adminUser
let user

describe('recommendations', () => {
  before( async () => {
    await db.sequelize.sync({ force: true })
  })
  before( async () => {
    const roles = await db.Role.bulkCreate([{name: 'admin'},{name: 'regular'}])
    adminUser = await db.User.create({...validAdminUser,role_id: roles[0].id})
    user = await db.User.create({...validUser,role_id: roles[1].id})
    const res = await request(app)
        .post('/auth/sign-in')
        .send({
          email: 'toreran@gmail.com',
          password: 'toreran'
        })
        token = res.body.data.token
      const adminRes = await request(app)
        .post('/auth/sign-in')
        .send({
          email: 'torera@gmail.com',
          password: 'torera'
        })
        adminToken = adminRes.body.data.token 

  })
  
  describe('/GET recommendations', () => {
    context('invoke index', () => {
      it('return empty array', async () => {
        const res = await request(app)
        .get('/recommendations')
        .set("Authorization", `Bearer ${token}`)
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.be.a('array')
        expect(res.body.data).to.be.empty
      })
    })
  })
  describe('/POST recommendations', () => {
    context('with valid data', () => {
      it('create a recommendation', async () => {
        const validRecommendation = {
          type: "book",
          title: "Design Patterns",
          rating: "5",
          howItHelpedYou: "It helped me to understand relationships between objects",
        }
        const res = await request(app)
          .post('/recommendations')
          .set("Authorization", `Bearer ${token}`)
          .send(validRecommendation)
        expect(res.status).to.equal(201)
        expect(res.body).to.have.property('data')
        expect(res.body.data.title).to.equal(validRecommendation.title)
        expect(res.body.data.type).to.equal(validRecommendation.type)
        expect(res.body.data.rating).to.equal(validRecommendation.rating)
        expect(res.body.data.howItHelpedYou).to.equal(validRecommendation.howItHelpedYou)
      })
    })
    context('without type', () => {
      it('return "type" is required', async () => {
        const res = await request(app)
          .post('/recommendations')
          .set("Authorization", `Bearer ${token}`)
          .send({
            title: "Design Patterns",
            rating: "5",
            howItHelpedYou: "It helped me to understand relationships between objects",
          })
        expect(res.status).to.equal(422)
        expect(res.body.error).to.equal('"type" is required')
      })
    })
    context('without title', () => {
      it('return "title" is required', async () => {
        const res = await request(app)
          .post('/recommendations')
          .set("Authorization", `Bearer ${token}`)
          .send({
            type: "book",
            rating: "5",
            howItHelpedYou: "It helped me to understand relationships between objects",
          })
        expect(res.status).to.equal(422)
        expect(res.body.error).to.equal('"title" is required')
      })
    })
    context('without rating', () => {
      it('return "rating" is required', async () => {
        const res = await request(app)
          .post('/recommendations')
          .set("Authorization", `Bearer ${token}`)
          .send({
            type: "book",
            title: "Design Patterns",
            howItHelpedYou: "It helped me to understand relationships between objects",
          })
        expect(res.status).to.equal(422)
        expect(res.body.error).to.equal('"rating" is required')
      })
    })
    context('without howItHelpedYou', () => {
      it('return "howItHelpedYou" is required', async () => {
        const res = await request(app)
          .post('/recommendations')
          .set("Authorization", `Bearer ${token}`)
          .send({
            type: "book",
            title: "Design Patterns",
            rating: "5"
          })
        expect(res.status).to.equal(422)
        expect(res.body.error).to.equal('"howItHelpedYou" is required')
      })
    })
    context('without authentication', () => {
      it('return Please login to your account.', async () => {
        const validRecommendation = {
          type: "book",
          title: "Design Patterns",
          rating: "5",
          howItHelpedYou: "It helped me to understand relationships between objects",
        }
        const res = await request(app)
          .post('/recommendations')
          .send(validRecommendation)
          expect(res.status).to.equal(401)
          expect(res.body.message).to.equal('Please login to your account.')
      })
    })
  })
  describe('/GET/:id recommendations', () => {
    context('with valid id', () => {
      it('get a recommendation', async () => {
        const validRecommendation = {
          type: "video",
          title: "NodeJS The Complete Guide",
          rating: "5",
          howItHelpedYou: "It helped me to understand the inner workings of NodeJs",
        }
        const recommendation = await db.Recommendation.create({...validRecommendation, user_id: user.id})
        const res = await request(app)
          .get(`/recommendations/${recommendation.id}`)
          .set("Authorization", `Bearer ${token}`)
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('data')
        expect(res.body.data.title).to.equal(validRecommendation.title)
      })
    })
    context('with invalid id', () => {
      it('return Unable to process your request', async () => {
        let id = "au12u"
        const res = await request(app)
          .get(`/recommendations/${id}`)
          .set("Authorization", `Bearer ${token}`)
        expect(res.status).to.equal(422)
        expect(res.body.message).to.equal('Unable to process your request.')
      })
    })
  })
  describe('Update recommendations', () => {
    context('with valid data', () => {
      it('update a recommendation', async () => {
        const validRecommendation = {
          type: "website",
          title: "NodeJS The Complete Guide",
          rating: "5",
          howItHelpedYou: "It helped me to understand the inner workings of NodeJs",
        }
        const recommendation = await db.Recommendation.create({...validRecommendation, user_id: user.id})
        const res = await request(app)
          .patch(`/recommendations/${recommendation.id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({rating: '4'})
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('data')
        expect(res.body.data.rating).to.equal('4')
      })
    })
    context('with invalid id', () => {
      it('return Current User cannot view this recommendation.', async () => {
        let id = 10000
        const res = await request(app)
          .patch(`/recommendations/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({rating: '3'})
        expect(res.status).to.equal(401)
        expect(res.body.message).to.equal('Current User cannot view this recommendation.')
      })
    })
    context('without Authorization', () => {
      it('return Please login to your account.', async () => {
        const validRecommendation = {
          type: "video",
          title: "NodeJS The Complete Guide",
          rating: "5",
          howItHelpedYou: "It helped me to understand the inner workings of NodeJs",
        }
        const recommendation = await db.Recommendation.create({...validRecommendation, user_id: user.id})
        const res = await request(app)
          .patch(`/recommendations/${recommendation.id}`)
          .send({rating: '2'})
        expect(res.status).to.equal(401)
        expect(res.body.message).to.equal('Please login to your account.')
      })
    })
  })
  describe('/DELETE/:id recommendations', () => {
    context('with valid id', () => {
      it('delete a recommendation', async () => {
        const validRecommendation = {
          type: "others",
          title: "NodeJS The Complete Guide",
          rating: "4",
          howItHelpedYou: "It helped me to understand the inner workings of NodeJs",
        }
        const recommendation = await db.Recommendation.create({...validRecommendation, user_id: adminUser.id})
        const res = await request(app)
          .delete(`/recommendations/${recommendation.id}`)
          .set("Authorization", `Bearer ${adminToken}`)
          expect(res.status).to.equal(202)
          expect(res.body).to.have.property('data')
          expect(res.body.message).to.equal('Recommendation removed')
      })
    })
    context('with invalid id', () => {
      it('return Unable to process your request', async () => {
        let id = 100000
        const res = await request(app)
        .delete(`/recommendations/${id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        expect(res.status).to.equal(422)
        expect(res.body.message).to.equal('Unable to process your request.')
      })
    })
  })
})

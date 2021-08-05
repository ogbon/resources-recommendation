const Joi = require('joi')

const schemas = {
  auth: {
    signIn: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }),
    signUp: Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      password: Joi.string().required()
    })
  },
  recommendation: {
    create: Joi.object().keys({
      type: Joi.string().valid('book', 'video', 'audio', 'website', 'others').required(),
      title: Joi.string().required(),
      rating: Joi.string().valid('5', '4', '3', '2', '1').required(),
      howItHelpedYou: Joi.string().required()
    }),

    update: Joi.object().keys({
      type: Joi.string().valid('book', 'video', 'audio', 'website', 'others'),
      title: Joi.string(),
      rating: Joi.string().valid('5', '4', '3', '2', '1'),
      howItHelpedYou: Joi.string()
    })
  }
}

export default schemas

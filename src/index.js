import app from './app'
require('dotenv').config()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log('-'.repeat(80))
  console.log(`Resources-Recommendation App is currently running on ${PORT}`)
  console.log('-'.repeat(80))
})

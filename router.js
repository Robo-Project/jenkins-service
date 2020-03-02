const router = require('express').Router()
const jenkins = require('jenkins')

const api = jenkins({
  baseUrl: 'http://localhost:8080',
  promisify: true,
  crumbIssuer: true
})

router.get('/jobs', async (req, res, next) => {
  const jobs = await api.job.list()
  res.json(jobs)
})

router.post('/build/:job/:branch', async (req, res, next) => {
  const body = req.body
  body.parameters = body.parameters ? body.parameters : {}
  try {
    const path = `${req.params.job}/${req.params.branch}`
    await api.job.build({ name: path, parameters: body.parameters })
    res.status(200).end()
  } catch (err) {
    console.log(err)
    res.status(400).json({ err })
    next()
  }
})

module.exports = router

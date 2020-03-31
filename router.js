const router = require('express').Router()
const jenkins = require('jenkins')
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));

let api;
const backToken = process.env.BACKTOKEN;

router.get('/jobs', async (req, res, next) => {
  await fs.readFileAsync('jenkins-api-token', 'utf8').then((data) => {
    const auth = data.slice(0,data.length - 1);
    api = jenkins({
      baseUrl: `http://${auth}@localhost:8080`,
      promisify: true,
      crumbIssuer: true
    })
  });
  const jobs = await api.job.list()
  res.json(jobs)
})

const checkToken = (reqToken) => {
  if (reqToken == null || reqToken !== backToken) {
    console.log('error: no backToken or it is invalid')
    console.log('got: ', reqToken, ' expected: ', backToken)
    return false
  }
  return true
}

router.post('/build/:job/:branch', async (req, res, next) => {
  console.log('body:', req.body)
  console.log('params:', req.params)
  if (checkToken(req.body.BACKTOKEN) == false) {
    return;
  }

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

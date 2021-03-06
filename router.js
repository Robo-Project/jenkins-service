const router = require('express').Router()
const jenkins = require('jenkins')
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));

let api;
const backToken = process.env.BACKTOKEN;

router.get('/jobs', async (req, res, next) => {
  if (req.headers.authorization !== backToken) {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }
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

router.post('/build/:job/:branch', async (req, res, next) => {
  if (req.body.token !== backToken) {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const body = req.body
  
  try {
    const path = `${req.params.job}/${req.params.branch}`
    
    // use this instead if running a parameterized build
    /* 
    body.parameters = body.parameters ? body.parameters : {}
    await api.job.build({ name: path, parameters: body.parameters })
    */
    await api.job.build({ name: path })
    
    res.status(200).end()
    
  } catch (err) {
    console.log(err)
    res.status(400).json({ err })
    next()
  }
})

module.exports = router

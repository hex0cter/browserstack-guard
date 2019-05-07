import axios from 'axios'
import sleep from './sleep'
import logger from './logger'

class Browserstack {
  constructor(userName, accessKey, verbose) {
    axios.defaults.baseURL = 'https://api.browserstack.com'
    axios.defaults.headers.common['Authorization'] = `Basic ${Buffer.from(`${userName}:${accessKey}`).toString('base64')}`
    logger.level = verbose ? 'debug' : 'info'
  }
  async getRunningWorkers() {
    const resp = await axios.get('/5/workers?status=running&limit=100')
    return resp.data
  }
  async getRunningBuilds() {
    const resp = await axios.get('/automate/builds.json?status=running&limit=100')
    return resp.data
  }
  async waitUntilBelowLimit(limit) {
    process.stdout.write('Checking available executors on Browserstack...')
    while(true) {
      const runningWorkers = await this.getRunningWorkers()
      logger.debug(`${runningWorkers.length} running workers:`, runningWorkers)

      const runningBuilds = await this.getRunningBuilds()
      logger.debug(`${runningBuilds.length} running builds:`, runningBuilds)

      if ( runningWorkers.length < limit && runningBuilds.length < limit) {
        console.log('done.')
        break
      }
      process.stdout.write('.')
      await sleep(30000)
    }
  }
}

module.exports = async (userName, accessKey, limit, verbose) => {
  const browserstackGuard = new Browserstack(userName, accessKey, verbose)
  await browserstackGuard.waitUntilBelowLimit(limit)
}

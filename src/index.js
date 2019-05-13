import axios from 'axios'
import logger from './logger'

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class Browserstack {
  constructor (userName, accessKey, verbose) {
    axios.defaults.baseURL = 'https://api.browserstack.com'
    axios.defaults.headers.common['Authorization'] = `Basic ${Buffer.from(`${userName}:${accessKey}`).toString('base64')}`
    this.limit = 0
    logger.level = verbose ? 'debug' : 'info'
  }
  async hasAvailableThreads () {
    const sessionsInfo = (await axios.get('automate/plan.json')).data
    this.limit = sessionsInfo.parallel_sessions_max_allowed
    logger.debug('Running threads:', sessionsInfo)
    return sessionsInfo.parallel_sessions_running < this.limit && sessionsInfo.queued_sessions === 0
  }
  async hasAvailableWorkers () {
    const runningWorkers = (await axios.get('/5/workers?status=running&limit=100')).data
    logger.debug(`${runningWorkers.length} running workers:`, runningWorkers)

    return runningWorkers.length < this.limit
  }
  async isReady () {
    const hasAvailableThreads = await this.hasAvailableThreads()
    if (!hasAvailableThreads) {
      return false
    }

    const hasAvailableWorkers = await this.hasAvailableWorkers()
    if (!hasAvailableWorkers) {
      return false
    }

    return true
  }
  async waitUntilReady () {
    logger.info('Checking available executors on Browserstack...')
    while (true) {
      let ready = false
      try {
        ready = await this.isReady()
      } catch (e) {
        logger.error(e)
      }

      if (ready) {
        logger.info('...done')
        break
      }
      process.stdout.write('.')
      await sleep(15000)
    }
  }
}

module.exports = async (userName, accessKey, verbose) => {
  const browserstackGuard = new Browserstack(userName, accessKey, verbose)
  await browserstackGuard.waitUntilReady().catch(err => console.log(err))
}

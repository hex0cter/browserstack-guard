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
    const sessionsInfo = (await axios.get('/automate/plan.json')).data
    logger.debug('Running threads:', sessionsInfo)

    this.limit = sessionsInfo.parallel_sessions_max_allowed
    return sessionsInfo.parallel_sessions_running < this.limit
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
    let readyCount = 0
    let unstableAPIFactor = 0

    while (true) {
      try {
        readyCount = (await this.isReady()) ? readyCount + 1 : 0
        unstableAPIFactor = 0
      } catch (e) {
        readyCount = 0
        unstableAPIFactor += 5
        logger.error(e)
      }
      logger.debug('readyCount:', readyCount)

      if (readyCount >= 3) {
        logger.info('...done')
        break
      }
      process.stdout.write('.')
      const seconds = Math.floor(Math.random() * 15 + 10) + unstableAPIFactor
      logger.debug(`sleep for ${seconds} seconds...`)
      await sleep(seconds * 1000)
    }
  }
}

module.exports = async (userName, accessKey, verbose) => {
  const browserstackGuard = new Browserstack(userName, accessKey, verbose)
  await browserstackGuard.waitUntilReady().catch(err => console.log(err))
}

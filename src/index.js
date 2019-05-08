import axios from 'axios'
import sleep from './sleep'
import logger from './logger'
import { flatMap } from 'rxjs/operators';

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
  async getRunningSessions(buildId) {
    const resp = await axios.get(`/automate/builds/${buildId}/sessions.json?status=running&limit=100`)
    return resp.data
  }
  async waitUntilBelowLimit(limit) {
    logger.info('Checking available executors on Browserstack...')
    while (true) {
      const runningWorkers = await this.getRunningWorkers()
      logger.debug(`${runningWorkers.length} running workers:`, runningWorkers)

      const runningBuildIds = (await this.getRunningBuilds()).map(build => build.automation_build.hashed_id)
      logger.debug(`${runningBuildIds.length} running builds:`, runningBuildIds)

      const sessions = await Promise.all(runningBuildIds.map(buildId => {
        return this.getRunningSessions(buildId)
      }))
      const runningSessionIds = [].concat(...sessions).map(session => session.automation_session)
      logger.debug(`${runningSessionIds.length} running sessions:`, runningSessionIds)

      if (runningWorkers.length < limit && runningSessionIds.length < limit) {
        logger.info('Done.')
        break
      }
      process.stdout.write('.')
      await sleep(30000)
    }
  }
}

module.exports = async (userName, accessKey, limit, verbose) => {
  const browserstackGuard = new Browserstack(userName, accessKey, verbose)
  await browserstackGuard.waitUntilBelowLimit(limit).catch(err => console.log(err));
}

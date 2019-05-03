import axios from 'axios'

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class Browserstack {
  constructor(userName, accessKey, limit) {
    axios.defaults.baseURL = 'https://api.browserstack.com'
    axios.defaults.headers.common['Authorization'] = `Basic ${Buffer.from(`${userName}:${accessKey}`).toString('base64')}`
  }
  async getWorkers() {
    const resp = await axios.get('/5/workers')
    return resp.data
  }
  async waitUntilBelowLimit(limit) {
    process.stdout.write('Checking available executors on Browserstack...')
    while(true) {
      const runningWorkers = await this.getWorkers()
      const numberOfRunningWorkers = runningWorkers.filter(worker => worker.status === 'running').length
      const numberOfQueuedWorkers = runningWorkers.filter(worker => worker.status === 'queue').length

      if ( numberOfRunningWorkers < limit && numberOfQueuedWorkers == 0) {
        console.log('done.')
        break
      }
      process.stdout.write('.')
      await sleep(1000)
    }
  }
}

module.exports = async (userName, accessKey, limit) => {
  const browserstackGuard = new Browserstack(userName, accessKey)
  await browserstackGuard.waitUntilBelowLimit(limit)
}

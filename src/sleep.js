const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)).catch((err) => {})

module.export = sleep

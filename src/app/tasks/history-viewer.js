const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')

const scheduler = new ToadScheduler()
const jobs = [];

function createJob() {
    const task = new Task('simple task', () => { console.log('A task is running') })
    const job = new SimpleIntervalJob({ seconds: 60 }, task)
    scheduler.addSimpleIntervalJob(job)

    jobs.push(job)
}

module.exports = { createJob };
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')
const { getUsers } = require('../users/user-manager')

const scheduler = new ToadScheduler()
const jobs = [];

const JOB_INTERVAL = 60;

function createJob() {
    const task = new Task('simple task', lastPlayedTrackTask)
    const job = new SimpleIntervalJob({ seconds: JOB_INTERVAL }, task)
    scheduler.addSimpleIntervalJob(job)

    jobs.push(job)
}

function lastPlayedTrackTask() {
    getUsers().forEach(user => {
        console.log(user.expiresToken)
    });
}

module.exports = { createJob };
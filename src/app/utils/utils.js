function getTimestamp() {
    return Math.trunc(new Date().getTime() / 1000);
}

module.exports = { getTimestamp }
function getTimestamp() {
    return Math.trunc(new Date().getTime() / 1000);
}

function isSameMonth(date1, date2) {
    return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
}

module.exports = { getTimestamp, isSameMonth }
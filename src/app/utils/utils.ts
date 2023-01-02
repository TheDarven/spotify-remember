export function getTimestamp(): number {
    return Math.trunc(new Date().getTime() / 1000)
}

export function isSameMonth(date1: Date, date2: Date): boolean {
    return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
}

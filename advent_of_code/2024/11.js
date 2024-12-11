const example = `125 17`,
    expectP1 = 55312,
    expectP2 = 65601038650482,
    resultP1 = 203228,
    resultP2 = 240884656550923

const known = {}
const rec = (n, turns) => {
    if (turns === 0) return 1

    const seen = known[n] && known[n][turns]
    if (seen) return seen

    if (n === 0) {
        return rec(1, turns - 1)
    } else {
        const len = intLen(n)
        if (len % 2 === 0) {
            const left = Math.floor(n / Math.pow(10, len / 2))
            const right = n % Math.pow(10, len / 2)
            const l = rec(left, turns - 1)
            const r = rec(right, turns - 1)
            known[n] ||= [0]
            known[n][turns] = l + r
            return l + r
        } else {
            return rec(n * 2024, turns - 1)
        }
    }
}

function part1(input) {
    return input.trim().split(' ').reduce((total, n) => total + rec(parseInt(n), 25), 0)
}
function part2(input) {
    return input.trim().split(' ').reduce((total, n) => total + rec(parseInt(n), 75), 0)
}

import {intLen, run} from '../util.js'
run("11", example, expectP1, expectP2, part1, resultP1, part2, resultP2)

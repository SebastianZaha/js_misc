import {splitStrToInts} from "../util.js";

const example = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
    expectP1 = 2,
    expectP2 = 4,
    resultP1 = 670,
    resultP2 = 700

function checkLine(l, skipIdx) {
    let curr, prev
    if (skipIdx === 0) {
        curr = 2
        prev = 1
    } else if (skipIdx === 1) {
        curr = 2
        prev = 0
    } else {
        curr = 1
        prev = 0
    }
    let increasing = l[prev] < l[curr]

    while (curr < l.length) {
        if (increasing && l[curr] < l[prev]) return 0
        if (!increasing && l[curr] > l[prev]) return 0
        const delta = Math.abs(l[curr] - l[prev])
        if (delta > 3 || delta < 1) return 0

        prev = curr
        curr = ((curr + 1) === skipIdx) ? curr + 2 : curr + 1
    }
    return 1
}

function checkLineWith1Error(l) {
    if (checkLine(l)) return 1
    for (let i = 0; i < l.length; i++) {
        if (checkLine(l, i)) return 1
    }
    return 0
}


function part1(input) {
    const lines = input.trim().split('\n').map(l => splitStrToInts(l))
    return lines.reduce((total, l) => total + checkLine(l), 0)
}

function part2(input) {
    const lines = input.trim().split('\n').map(l => splitStrToInts(l))
    return lines.reduce((total, l) => total + checkLineWith1Error(l), 0)
}

import {run} from '../util.js'
run("02", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
const example = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
    expectP1 = 36,
    expectP2 = 81,
    resultP1 = 667,
    resultP2 = 1344

function solve(input, onlyUnique) {
    let sum = 0,
        m = input.trim().split('\n').map(l => l.split('').map(c => parseInt(c))),
        seen = m.map(l => Array(l.length))

    const count = (i, j, val) => {
        if (val === 9) {
            if (onlyUnique) {
                if (seen[i][j]) return 0
                else seen[i][j] = true
            }
            return 1
        }
        let c = 0
        if (i > 0 && (m[i - 1][j] === val + 1)) c += count(i - 1, j, val + 1)
        if (j > 0 && (m[i][j - 1] === val + 1)) c += count(i, j - 1, val + 1)
        if (i < m.length - 1 && (m[i + 1][j] === val + 1)) c += count(i + 1, j, val + 1)
        if (j < m[i].length - 1 && (m[i][j + 1] === val + 1)) c += count(i, j + 1, val + 1)
        return c
    }

    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
            if (m[i][j] === 0) {
                if (onlyUnique) seen.forEach(l => l.fill(false))
                sum += count(i, j, 0)
            }
        }
    }
    return sum
}

import {run} from '../util.js'
run("10", example, expectP1, expectP2, i => solve(i, true), resultP1, i => solve(i, false), resultP2)
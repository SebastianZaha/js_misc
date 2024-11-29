const example = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`,
    expectP1 = 13,
    expectP2 = 30

function part1(input) {
    let result = 0

    input.trim().split('\n').forEach((line) => {
        let [win, have] = line.split(':')[1].trim().split('|').map(part => part.trim().split(/\s+/))
        let res = 0

        win.forEach(nr => {
            if (have.includes(nr)) {
                res = (res === 0) ? 1 : res * 2;
            }
        })
        result += res
    })

    return result
}

function part2(input) {
    let lines = input.trim().split('\n'),
        counts = Array(lines.length)

    counts.fill(1)

    lines.forEach((line, index) => {
        let [win, have] = line.split(':')[1].trim().split('|').map(part => part.trim().split(/\s+/))
        let count = win.reduce((total, nr) => total + (have.includes(nr) ? 1 : 0), 0)
        for (let i = index + 1; (i < lines.length) && (i <= index + count); i++) {
            counts[i] += counts[index]
        }
    })

    return counts.reduce((total, currentValue) => total + currentValue, 0)
}

import {run} from '../util.js'
run("04", example, expectP1, expectP2, part1, part2)
const example = `
#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`,
    expectP1 = 3,
    expectP2 = 0,
    resultP1 = 2815,
    resultP2 = 0

function part1(input) {
    let count = 0,
        keys = [],
        locks = []

    let lines = input.trim().split('\n')
    let current = null
    for (let i = 0; i < lines.length; i++) {
        current = (lines[i] === '#####') ? locks : keys
        let next = []
        current.push(next)
        for (let j = 0; j < 5; j++) {
            i++
            for (let k = 0; k < 5; k++) {
                next[k] = (next[k] ?? 0) + (lines[i][k] === '#' ? 1 : 0)
            }
        }
        i++ // don't count last line in segment
        i++ // empty line between segments
        console.assert((i === lines.length) || (lines[i].length === 0), `line ${i} should be empty but it is ${lines[i]}`)
    }

    for (const key of keys) {
        for (const lock of locks) {
            let matches = true
            for (let i = 0; i < 5; i++) {
                if (key[i] + lock[i] > 5) {
                    matches = false
                    break
                }
            }
            if (matches) count++
        }
    }

    return count
}

function part2(input) {
    return 0
}

import {run} from '../util.js'
await run("25", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
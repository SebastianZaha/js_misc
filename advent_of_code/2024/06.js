const example = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
    expectP1 = 41,
    expectP2 = 6,
    resultP1 = 5208,
    resultP2 = null,

    UP    = {i: -1, j:  0, symbol: '^'},
    DOWN  = {i:  1, j:  0, symbol: 'V'},
    LEFT  = {i:  0, j: -1, symbol: '<'},
    RIGHT = {i:  0, j:  1, symbol: '>'}


function findStart(m) {
    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
            switch (m[i][j]) {
                case RIGHT.symbol: return [RIGHT, i, j]
                case DOWN.symbol: return [DOWN, i, j]
                case LEFT.symbol: return [LEFT, i, j]
                case UP.symbol: return [UP, i, j]
            }
        }
    }
    throw `Cannot find matrix start`
}

function part1(input) {
    const m = input.trim().split('\n').map(line => line.trim().split(''))
    let [direction, i, j] = findStart(m)

    let count = 1
    while (i < m.length && j < m[0].length && i > -1 && j > -1) {
        switch (m[i][j]) {
            case '#':
                if (direction === LEFT) {
                    j++ // compensate for already 'having moved onto' the obstacle square
                    direction = UP
                } else if (direction === RIGHT) {
                    j--
                    direction = DOWN
                } else if (direction === UP) {
                    i++
                    direction = RIGHT
                } else {
                    i--
                    direction = LEFT
                }
                break
            case '.':
                m[i][j] = direction.symbol
                count += 1
                break
            case LEFT.symbol: break
            case RIGHT.symbol: break
            case UP.symbol: break
            case DOWN.symbol: break
            default:
                throw `unknown tile ${m[i][j]} at ${i}, ${j} in ${m}`
        }
        i += direction.i
        j += direction.j
    }
    return count
}

function part2(input) {
}

import {run} from '../util.js'
run("06", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
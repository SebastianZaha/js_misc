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
    resultP2 = 1972,

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

function turn(direction, i, j) {
    // coordinate changes compensate for already 'having moved onto' the obstacle square
    switch (direction) {
        case LEFT:  return [UP, i, j+1]
        case RIGHT: return [DOWN, i, j-1]
        case UP:    return [RIGHT, i+1, j]
        case DOWN:  return [LEFT, i-1, j]
        default: throw `unknown direction ${direction}`
    }
}

function walkMatrix(input, checkFunction) {
    const m = input.trim().split('\n').map(line => line.trim().split(''))
    let [direction, i, j] = findStart(m)
    m[i][j] = 'X'
    let count = 0
    while (i < m.length && j < m[0].length && i > -1 && j > -1) {
        switch (m[i][j]) {
            case '#':
                [direction, i, j] = turn(direction, i, j)
                break
            case '.':
                m[i][j] = 'X'
                if (checkFunction(m, direction, i, j)) count += 1
                break
            case 'X': break // already been here once and counted this square, ignore
            default:
                throw `unknown tile ${m[i][j]} at ${i}, ${j} in ${m}`
        }
        i += direction.i
        j += direction.j
    }
    return count
}

function part1(input) {
    // extra 1 for the start position
    return 1 + walkMatrix(input, () => true)
}

function checkLoop(m, direction, i, j) {
    m = m.map(line => line.slice()) // clone
    m[i][j] = '#'

    while (i < m.length && j < m[0].length && i > -1 && j > -1) {
        switch (m[i][j]) {
            case '#':
                [direction, i, j] = turn(direction, i, j)
                break
            case '.':
            case 'X':
                m[i][j] = direction.symbol
                break
            default:
                if (m[i][j] === direction.symbol) return true
        }
        i += direction.i
        j += direction.j
    }
    return false
}

/* extra credit - replace checkLoop call in part2 with this,
   ignore every check and just decide after doing 10k steps that we're in a loop. Still done in 300ms :D

function checkLoopBruteForce(m, direction, i, j) {

    m = m.map(line => line.slice()) // clone
    m[i][j] = '#'

    let loops = 0
    while (i < m.length && j < m[0].length && i > -1 && j > -1) {
        switch (m[i][j]) {
            case '#':
                [direction, i, j] = turn(direction, i, j)
                break
            case '.':
                m[i][j] = 'X'
                // fallthrough
            case 'X':
                break
            default:
                throw `unknown tile ${m[i][j]} at ${i}, ${j} in ${m}`
        }
        i += direction.i
        j += direction.j

        loops++
        if (loops > 10000) return true
    }
    return false
}
*/

function part2(input) {
    return walkMatrix(input, checkLoop)
}

import {run} from '../util.js'
run("06", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
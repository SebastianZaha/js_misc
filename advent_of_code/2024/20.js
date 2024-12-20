import {down, find, inBounds, left, right, up} from "../matrix.js";

const example = `
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`,
    expectP1 = 44,
    expectP2 = 285, // 32+31+29+39+25+23+20+19+12+14+12+22+4+3
    resultP1 = 1365,
    resultP2 = 986082

function part1(input, isPart2) {
    let m = input.trim().split('\n').map(l => l.split('')),
        [si, sj] = find(m, 'S')

    let i = si, j = sj, dist = 0, dir = []
    const tried = m.map(l => Array(l.length).fill(0))
    const fwd  = (d) => {
        dir.push(d)
        tried[i][j]++
        i += d[0]
        j += d[1]
        dist++
    }
    const back = ()  => {
        let d = dir.pop()
        i -= d[0]
        j -= d[1]
        dist--
    }
    m[si][sj] = 0
    while (true) {
        if (m[i][j] === 'E') {
            m[i][j] = dist
            break
        }
        if (m[i][j] === '#') {
            back()
            continue
        }

        if (m[i][j] === '.') m[i][j] = dist
        switch (tried[i][j]) {
            case 0:
                fwd(up)
                continue
            case 1:
                fwd(down)
                continue
            case 2:
                fwd(left)
                continue
            case 3:
                fwd(right)
                continue
            case 4:
                back()
                continue
            default:
                throw `illegal value ${tried[i][j]} for tried matrix`
        }
    }

    let count = 0

    const maybeCount = (i1, j1, i2, j2, delta) => {
        if (!inBounds(m, i2, j2)) return
        if (typeof m[i2][j2] !== 'number') return

        const diff = m[i2][j2] - m[i1][j1] - delta
        if (example === input) {
            const tresh = isPart2 ? 49 : 0
            if (diff > tresh) count++
        } else if (diff >= 100) {
            count++
        }
    }

    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
            if (typeof m[i][j] === 'number' && m[i][j] >= 0) {
                if (isPart2) {
                    for (let di = 0; di < 21; di++) {
                        for (let dj = 0; dj < 21 - di; dj++) {
                            if (di + dj < 2) continue
                            if (di === 0) {
                                maybeCount(i, j, i, j + dj, dj)
                                maybeCount(i, j, i, j - dj, dj)
                            } else if (dj === 0) {
                                maybeCount(i, j, i + di, j, di)
                                maybeCount(i, j, i - di, j, di)
                            } else {
                                maybeCount(i, j, i + di, j + dj, di + dj)
                                maybeCount(i, j, i + di, j - dj, di + dj)
                                maybeCount(i, j, i - di, j + dj, di + dj)
                                maybeCount(i, j, i - di, j - dj, di + dj)
                            }
                        }
                    }
                } else {
                    maybeCount(i, j, i, j-2, 2)
                    maybeCount(i, j, i, j+2, 2)
                    maybeCount(i, j, i-2, j, 2)
                    maybeCount(i, j, i+2, j, 2)
                }
            }
        }
    }
    return count
}

function part2(input) {
    return part1(input, true)
}

import {run} from '../util.js'
await run("20", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
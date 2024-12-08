const example = `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
    expectP1 = 14,
    expectP2 = 34,
    resultP1 = 291,
    resultP2 = 1015

function part1(input, repeatAntinodes) {
    let m = input.trim().split('\n').map(line => line.trim().split('')),
        out = m.map(l => Array(l.length).fill(undefined))

    for (let i1 = 0; i1 < m.length; i1++) {
        for (let j1 = 0; j1 < m[i1].length; j1++) {
            if (m[i1][j1] !== '.') {
                for (let i2 = i1; i2 < m.length; i2++) {
                    const startCol = i1 === i2 ? j1 + 1 : 0
                    for (let j2 = startCol; j2 < m[i2].length; j2++) {
                        if (m[i1][j1] === m[i2][j2]) {
                            let di = i2-i1, dj = j2-j1

                            let ai = repeatAntinodes ? i1 : i1-di,
                                aj = repeatAntinodes ? j1 : j1-dj
                            while (ai >= 0 && ai < m.length && aj >= 0 && aj < m[ai].length) {
                                if (!out[ai][aj]) out[ai][aj] = true
                                if (!repeatAntinodes) break // a single time in part 1
                                ai -= di; aj -= dj;
                            }

                            let bi = repeatAntinodes ? i2 : i2+di,
                                bj = repeatAntinodes ? j2 : j2+dj
                            while (bi >= 0 && bi < m.length && bj >= 0 && bj < m[bi].length) {
                                if (!out[bi][bj]) out[bi][bj] = true
                                if (!repeatAntinodes) break // a single time in part 1
                                bi += di; bj += dj;
                            }
                        }
                    }
                }
            }
        }
    }
    let count = 0
    for (let i1 = 0; i1 < m.length; i1++)
        for (let j1 = 0; j1 < m[i1].length; j1++)
            if (out[i1][j1]) count++
    return count
}

function part2(input) {
    return part1(input, true)
}

import {run} from '../util.js'
run("08", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
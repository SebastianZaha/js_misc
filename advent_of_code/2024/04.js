const example = `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
    expectP1 = 18,
    expectP2 = 9,
    resultP1 = 2618,
    resultP2 = 2011

function part1(input) {
    const m = input.trim().split('\n').map(line => line.trim().split(''))
    let count = 0
    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
            if (m[i][j] !== 'X') continue
            if (i > 2) {
                if (m[i-1][j] === 'M' && m[i-2][j] === 'A' && m[i-3][j] === 'S') count += 1
                if (j > 2) {
                    if (m[i-1][j-1] === 'M' && m[i-2][j-2] === 'A' && m[i-3][j-3] === 'S') count += 1
                }
                if (j < m[i].length - 3) {
                    if (m[i-1][j+1] === 'M' && m[i-2][j+2] === 'A' && m[i-3][j+3] === 'S') count += 1
                }
            }
            if (i < m.length - 3) {
                if (m[i+1][j] === 'M' && m[i+2][j] === 'A' && m[i+3][j] === 'S') count += 1
                if (j > 2) {
                    if (m[i+1][j-1] === 'M' && m[i+2][j-2] === 'A' && m[i+3][j-3] === 'S') count += 1
                }
                if (j < m[i].length - 3) {
                    if (m[i+1][j+1] === 'M' && m[i+2][j+2] === 'A' && m[i+3][j+3] === 'S') count += 1
                }
            }
            if (j > 2) {
                if (m[i][j-1] === 'M' && m[i][j-2] === 'A' && m[i][j-3] === 'S') count += 1
            }
            if (j < m[i].length - 3) {
                if (m[i][j+1] === 'M' && m[i][j+2] === 'A' && m[i][j+3] === 'S') count += 1
            }
        }
    }
    return count
}

function part2(input) {
    const m = input.trim().split('\n').map(line => line.trim().split(''))
    let count = 0
    for (let i = 1; i < m.length - 1; i++) {
        for (let j = 1; j < m[i].length - 1; j++) {
            if (m[i][j] !== 'A') continue
            if (
                (
                    (m[i-1][j-1] === 'M' && m[i+1][j+1] === 'S') ||
                    (m[i+1][j+1] === 'M' && m[i-1][j-1] === 'S')
                ) && (
                    (m[i-1][j+1] === 'M' && m[i+1][j-1] === 'S') ||
                    (m[i+1][j-1] === 'M' && m[i-1][j+1] === 'S')
                )
            ) count += 1
        }
    }
    return count
}

import {run} from '../util.js'
run("04", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
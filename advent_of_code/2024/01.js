const example = `
3   4
4   3
2   5
1   3
3   9
3   3`,
    expectP1 = 11,
    expectP2 = 31,
    resultP1 = 2756096,
    resultP2 = 23117829

function insertInPlace(nr, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (nr < arr[i]) {
            arr.splice(i, 0, nr)
            return
        }
    }
    arr.splice(arr.length, 0, nr)
}

function part1(input) {
    let col1 = [], col2 = []
    input.trim().split("\n").forEach(line => {
        const ints = splitStrToInts(line)
        insertInPlace(ints[0], col1)
        insertInPlace(ints[1], col2)
    })

    let sum  = 0
    for (let i = 0; i < col1.length; i++) {
        sum += Math.abs(col1[i] - col2[i])
    }
    return sum
}

function part2(input) {
    let res = 0, col1 = [], col2 = []
    input.trim().split("\n").forEach(line => {
        const ints = splitStrToInts(line)
        insertInPlace(ints[0], col1)
        insertInPlace(ints[1], col2)
    })

    for (let i = 0; i < col1.length; i++) {
        res += col1[i] * col2.reduce((total, current) => total + (col1[i] === current ? 1 : 0), 0)
    }
    return res
}

import {run, splitStrToInts} from '../util.js'
run("01", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
const example = `125 17`,
    expectP1 = 55312,
    expectP2 = 0,
    resultP1 = 203228,
    resultP2 = null

function solve(input, runs) {
    let stones = input.trim().split(' ').map(n => parseInt(n))


    for (let _i = 0; _i < runs; _i++) {
        //console.log(_i, stones.length, stones)
        for (let i = 0; i < stones.length; i++) {
            if (stones[i] === 0) {
                stones[i] = 1
            } else {
                const len = intLen(stones[i])
                if (len % 2 === 0) {
                    const right = stones[i] % Math.pow(10, len/2)
                    stones[i] = Math.floor(stones[i] / Math.pow(10, len/2))
                    stones.splice(i+1, 0, right)
                    i++
                } else {
                    stones[i] *= 2024
                }
            }
        }
    }

    return stones.length
}

function part1(input) {
    return solve(input, 25)
}

function part2(input) {
    return solve(input, 75)
}

import {intLen, run} from '../util.js'
run("11", example, expectP1, expectP2, part1, resultP1, part2, resultP2)


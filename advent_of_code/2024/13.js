const example = `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
    expectP1 = 480,
    expectP2 = 0,
    resultP1 = 37901,
    resultP2 = null


function solve(a, b, prize) {
    let maxA = Math.max(100, Math.min(Math.floor(prize.x / a.x), Math.floor(prize.y / a.y))),
        maxB = Math.max(100, Math.min(Math.floor(prize.x / b.x), Math.floor(prize.y / b.y))),
        minPrice = NaN

    console.log(`looping to ${maxA}, ${maxB}`)
    for (let i = 0; i < maxA; i++) {
        for (let j = 0; j < maxB; j++) {
            if (prize.x === (a.x * i) + (b.x * j) && prize.y === (a.y * i) + (b.y * j)) {
                // console.log(`checking ${i}, ${j}`)
                minPrice = isNaN(minPrice) ? 3*i + j : Math.min(minPrice, 3*i + j)
            }
        }
    }
    return minPrice
}

function part1(input, isPart2) {
    const lines = input.trim().split('\n')
    let m, sum = 0, factor = isPart2 ? 10000000000000 : 1

    const assert = (i) => console.assert(m && m.length > 1, `should parse button i ${i}, line |${lines[i]}|, m ${m}`)
    const parseN = (n) => factor * parseInt(n)

    for (let i = 0; i < lines.length; i++) {
        m = lines[i].match(/Button A: X\+(\d+), Y\+(\d+)/)
        assert(i)
        const a = {x: parseInt(m[1]), y: parseInt(m[2])}
        m = lines[i+1].match(/Button B: X\+(\d+), Y\+(\d+)/)
        assert(i)
        const b = {x: parseInt(m[1]), y: parseInt(m[2])}
        m = lines[i+2].match(/Prize: X=(\d+), Y=(\d+)/)
        assert(i)

        const min = solve(a, b, {x: parseN(m[1]), y: parseN(m[2])})
        sum += isNaN(min) ? 0 : min
        i+=3
    }
    return sum
}

function part2(input) {
    return part1(input, true)
}

import {run} from '../util.js'
await run("13", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
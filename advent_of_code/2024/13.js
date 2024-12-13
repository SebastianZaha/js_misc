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
    expectP2 = 875318608908,
    resultP1 = 37901,
    resultP2 = 77407675412647

function solve(a, b, prize) {
    /*
    * a.x * i + b.x * j = prize.x
    * i = (prize.x - b.x * j) / a.x
    *
    * a.y * i + b.y * j = prize.y
    *
    * a.y * prize.x / a.x - a.y * b.x * j / a.x + b.y * j = prize.y
    * a.y * prize.x - a.y * b.x * j + b.y * a.x * j = prize.y * a.x
    * j = (prize.y * a.x - a.y * prize.x) / (b.y * a.x - a.y * b.x)
    *
    */
    if ((prize.y * a.x - a.y * prize.x) % (b.y * a.x - a.y * b.x) !== 0) return NaN
    let j = (prize.y * a.x - a.y * prize.x) / (b.y * a.x - a.y * b.x)

    if ((prize.x - b.x * j) % a.x !== 0) return NaN
    let i = (prize.x - b.x * j) / a.x

    return 3 * i + j
}

function part1(input, isPart2) {
    const lines = input.trim().split('\n')
    let m, sum = 0, factor = isPart2 ? Math.pow(10, 13) : 0

    const assert = (i) => console.assert(m && m.length > 1, `should parse button i ${i}, line |${lines[i]}|, m ${m}`)
    const parseN = (n) => factor + parseInt(n)

    for (let i = 0; i < lines.length; i++) {
        m = lines[i].match(/Button A: X\+(\d+), Y\+(\d+)/)
        assert(i)
        const a = {x: parseInt(m[1]), y: parseInt(m[2])}
        m = lines[i+1].match(/Button B: X\+(\d+), Y\+(\d+)/)
        assert(i)
        const b = {x: parseInt(m[1]), y: parseInt(m[2])}
        m = lines[i+2].match(/Prize: X=(\d+), Y=(\d+)/)
        assert(i)
        const p = {x: parseN(m[1]), y: parseN(m[2])}

        const min = solve(a, b, p)
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
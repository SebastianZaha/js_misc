const example = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
    expectP1 = 3749,
    expectP2 = 11387,
    resultP1 = 3119088655389,
    resultP2 = 264184041398847

function solve(input, funcs) {
    let sum = 0
    for (const line of input.trim().split('\n')) {
        const parts = line.split(':'),
            result = parseInt(parts[0]),
            operands = splitStrToInts(parts[1])

        const rec = (i, total) => {
            if (total > result) return false
            if (i === operands.length) return (result === total)

            let partial = false
            for (const func of funcs) {
                partial ||= rec(i + 1, func(total, operands[i]))
            }
            return partial
        }
        if (rec(1, operands[0])) sum += result
    }
    return sum
}

function part1(input) {
    return solve(input, [
        (a, b) => a + b,
        (a, b) => a * b,
    ])
}

function part2(input) {
    return solve(input, [
        (a, b) => a + b,
        (a, b) => a * b,
        (a, b) => a * (Math.pow(10, b.toString().length)) + b
    ])}

import {run, splitStrToInts} from '../util.js'
run("07", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
import * as assert from "node:assert";

const example = `
1
10
100
2024`,
    expectP1 = 37327623n,
    expectP2 = 23n,
    resultP1 = 17612566393n,
    resultP2 = 1968n,
    exampleP2 = `
1
2
3
2024`;


`15887950
16495136
527345
704524
1553684
12683156
11100544
12249484
7753432
5908254`.split('\n').reduce((prev, curr) => {
    const c = BigInt(curr)
    assert.equal(next(prev), c)
    return c
}, 123n)

function next(n) {
    let n1 = ((n << 6n) ^ n) & 16777215n,
        n2 = ((n1 >> 5n) ^ n1)& 16777215n
    return ((n2 << 11n) ^ n2) & 16777215n
}

function part1(input) {
    return input.trim().split('\n').reduce((sum, s) => {
        let n = BigInt(s)
        for (let i = 0; i < 2000; i++) n = next(n)
        return sum + n
    }, 0n)
}

function part2(input) {
    if (input === example) input = exampleP2

    const lines = input.trim().split('\n'),
          perLine = []

    lines.forEach((s, i) => {
        perLine[i] = new Map()
        const digits = []
        let n = BigInt(s)
        digits.push(n % 10n)
        for (let j = 0; j < 2000; j++) {
            n = next(n)
            digits.push(n % 10n)
        }
        for (let j = 4; j < digits.length; j++) {
            const seq = `${digits[j-3]-digits[j-4]},${digits[j-2]-digits[j-3]},${digits[j-1]-digits[j-2]},${digits[j]-digits[j-1]}`
            if (!perLine[i].has(seq)) perLine[i].set(seq, digits[j])
        }
    })

    const allSeqs = new Set()
    perLine.forEach(m => m.forEach((v, k) => allSeqs.add(k)))

    let max = 0
    allSeqs.forEach(seq => {
        let sum = 0n
        perLine.forEach(m => sum += m.get(seq) ?? 0n)
        if (sum > max) max = sum
    })

    return max
}

import {run} from '../util.js'
await run("22", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
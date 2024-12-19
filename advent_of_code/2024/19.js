const example = `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`,
    expectP1 = 6,
    expectP2 = 16,
    resultP1 = 374,
    resultP2 = 1100663950563322

function part1(input) {
    let count = 0,
        lines = input.trim().split('\n'),
        parts = lines[0].split(',').map(it => it.trim())

    const solve = (pattern) => {
        for (let i = 0; i < parts.length; i++) {
            if (pattern.startsWith(parts[i])) {
                if (pattern.length === parts[i].length) return true
                if (solve(pattern.substring(parts[i].length))) return true
            }
        }
        return false
    }

    for (let i = 2; i < lines.length; i++) {
        if (solve(lines[i])) count++
    }
    return count
}

function part2(input) {
    let count = 0,
        lines = input.trim().split('\n'),
        parts = lines[0].split(',').map(it => it.trim()),
        cache = new Map()

    const solve = (pattern) => {
        let countForP = 0
        for (let i = 0; i < parts.length; i++) {
            if (pattern.startsWith(parts[i])) {
                if (pattern.length === parts[i].length) {
                    countForP += 1
                } else {
                    let rest = pattern.substring(parts[i].length), c
                    if (cache.has(rest)) {
                        c = cache.get(rest)
                    } else {
                        c = solve(rest)
                        cache.set(rest, c)
                    }
                    countForP += c
                }
            }
        }
        return countForP
    }

    for (let i = 2; i < lines.length; i++) {
        count += solve(lines[i])
    }
    return count
}

import {run} from '../util.js'
await run("19", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
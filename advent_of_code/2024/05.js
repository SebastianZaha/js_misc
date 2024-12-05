const example = `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
    expectP1 = 143,
    expectP2 = 123,
    resultP1 = 5452,
    resultP2 = 4598

function getPairsAndRows(input) {
    let pairs = {},
        donePairs = false,
        correct = [],
        incorrect = []

    for (let line of input.trim().split('\n')) {
        line = line.trim()
        if (line.length === 0) {
            donePairs = true
            continue
        }
        if (!donePairs) {
            let pair = line.split('|')
            if (!pairs[parseInt(pair[0])]) pairs[parseInt(pair[0])] = []
            pairs[parseInt(pair[0])].push(parseInt(pair[1]))
            continue
        }

        let ints = line.split(',').map(i => parseInt(i)),
            ok = true

        for (let i = 0; i < ints.length - 1; i++) {
            for (let j = i + 1; j < ints.length; j++) {
                if (!pairs[ints[i]]?.includes(ints[j])) {
                    ok = false
                    break
                }
            }
            if (!ok) break
        }

        (ok ? correct : incorrect).push(ints)
    }
    return [pairs, correct, incorrect]
}

function part1(input) {
    let [_pairs, correct, _incorrect] = getPairsAndRows(input)
    return correct.reduce((sum, row) => sum + row[Math.floor(row.length/2)], 0)
}

function part2(input) {
    let [pairs, _correct, incorrect] = getPairsAndRows(input),
        sum = 0
    for (let row of incorrect) {
        row.sort((a, b) => pairs[a]?.includes(b) ? -1 : 1)
        sum += row[Math.floor(row.length/2)]
    }
    return sum
}

import {run} from '../util.js'
run("05", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
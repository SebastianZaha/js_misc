const example = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`,
    example2 = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
    expectP1 = 161,
    expectP2 = 48,
    resultP1 = 188116424,
    resultP2 = 104245808

function part1(input) {
    return input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g).reduce((total, match) => {
        return total + parseInt(match[1]) * parseInt(match[2])
    }, 0)
}

function part2(input) {
    const matches = input.matchAll(/(?<not>don't\(\))|(?<do>do\(\))|(mul\((\d{1,3}),(\d{1,3})\))/g)
    let total = 0, on = true

    for (let m of matches) {
        if (m.groups.do) {
            on = true
        } else if (m.groups.not) {
            on = false
        } else if (on) {
            total += parseInt(m[4]) * parseInt(m[5])
        }
    }
    return total
}

import {run} from '../util.js'
run("03", example, expectP1, expectP2, part1, resultP1, part2, resultP2, example2)
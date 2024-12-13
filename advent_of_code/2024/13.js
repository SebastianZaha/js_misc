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

const highestCommonDenominator = (x, y) => {
    const [min, max] = x < y ? [x, y] : [y, x]

    for (let i = min; i > 1 ; i--) {
        if ((x % i === 0) && (y % i === 0)) return i
    }
    return 1
}

const factorize = (n) => {
    let f = [], curr = n

    for (let i = 2; i <= Math.sqrt(curr) ; i++) {
        if (curr % i === 0) {
            f.push(i)
            curr = curr / i
            i--
        }
    }
    if (curr !== 1) f.push(curr)
    return f
}

/*

# 2nd ex

26x + 67y = 12748
66x + 21y = 12176


# 1st ex

94x + 22y = 8400
34x + 67y = 5400

128x + 89y = 13800
60x - 45y = 3000
    x = (3000+45y)/60 = 50 + 3/4y

94*50 + 94*3/4y + 22y = 8400
y (47*3/2 + 22) = 3700
=> y has to be multiple of 2

1: 47x + 11y = 4200
2: 17x + 67*y/2 = 2700

 */


function solve1(a, b, prize) {
    let maxA = Math.min(Math.floor(prize.x / a.x), Math.floor(prize.y / a.y)),
        maxB = Math.min(Math.floor(prize.x / b.x), Math.floor(prize.y / b.y)),
        minPrice = NaN


    console.log(`looping to ${maxA}, ${maxB}`)
    for (let i = 0; i <= maxA; i++) {
        let rest = {x: prize.x - i * a.x, y: prize.y - i * a.y},
            remX = rest.x % b.x
        if (remX === 0) {
            const divX = rest.x / b.x
            if (divX * b.y === rest.y) {
                minPrice = isNaN(minPrice) ? 3*i + divX : Math.min(minPrice, 3*i + divX)
            }
        }
    }
    return minPrice
}


function solve(a, b, prize) {
    let prio1, prio2

    if (a.x / b.x > 3 && a.y / b.y > 3) {
        prio1 = a
        prio2 = b
    } else if (a.x / b.x < 3 && a.y / b.y < 3) {
        prio1 = b
        prio2 = a
    } else if (a.x / 3 / b.x > 3 * b.y / a.y) {
        prio1 = a
        prio2 = b
    } else {
        prio1 = a
        prio2 = b
    }

    let maxP1 = Math.min(Math.floor(prize.x / prio1.x), Math.floor(prize.y / prio1.y)),
        minPrice = NaN


    console.log(`looping to ${maxP1}`)
    for (let i = 0; i <= maxP1; i++) {
        let rest = {x: prize.x - i * prio1.x, y: prize.y - i * prio1.y},
            remX = rest.x % prio2.x
        if (remX === 0) {
            const divX = rest.x / prio2.x
            if (divX * prio2.y === rest.y) {
                if (prio1 === a) {
                    return 3 * i + divX
                } else {
                    return i + 3 * divX
                }
            }
        }
    }
    return NaN
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

        let eq1 = [a.x, b.x, p.x], eq2 = [a.y, b.y, p.y]

        console.log(eq1.map(n => [n, factorize(n)]))
        console.log(eq2.map(n => [n, factorize(n)]))
        console.log(eq1.map((x, i) => [x + eq2[i], factorize(x + eq2[i])]))
        console.log(eq1.map((x, i) => [x - eq2[i], factorize(Math.abs(x - eq2[i]))]))

        console.log('################')


        const min = solve(a, b, p)
        sum += isNaN(min) ? 0 : min
        i+=3
    }
    return sum
}

function part2(input) {
    //return 0
    return part1(input, true)
}

import {run} from '../util.js'
await run("13", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
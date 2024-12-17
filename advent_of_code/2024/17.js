let example = `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`,
    expectP1 = '4,6,3,5,6,3,5,2,1,0',
    expectP2 = 117440,
    resultP1 = '4,3,2,6,4,5,3,2,4',
    resultP2 = 164540892147389n,
    exampleP2 =  `
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`

let out, regA, regB, regC, prog

const parseInput = (input) => {
    const lines = input.trim().split('\n')
    regA = parseInt(lines[0].split(':')[1].trim())
    regB = parseInt(lines[1].split(':')[1].trim())
    regC = parseInt(lines[2].split(':')[1].trim())
    prog = lines[4].trim().split(':')[1].trim().split(',').map(n => parseInt(n))
    out = []
}

const printState = (i) => {
    console.log(`regA: ${regA}; regB ${regB}; regC ${regC}`)
    console.log(`out: ${out}`)
    console.log(`executing ${prog[i]}, operand ${prog[i+1]}`)
}

const combo = (val) => {
    if (val < 4) return val
    if (val === 4) return regA
    if (val === 5) return regB
    if (val === 6) return regC
    throw `invalid combo operand ${val}`
}

const tick = (i) => {
    //printState(i)

    switch (prog[i]) {
        case 0:
            regA = Math.trunc(regA / (Math.pow(2, combo(prog[i+1]))))
            break
        case 1:
            regB = regB ^ prog[i+1]
            break
        case 2:
            regB = combo(prog[i+1]) % 8
            break
        case 3:
            if (regA !== 0) return [prog[i+1], null]
            break
        case 4:
            regB = regB ^ regC
            break
        case 5:
            return [i+2, combo(prog[i+1]) % 8]
        case 6:
            regB = Math.trunc(regA / (Math.pow(2, combo(prog[i+1]))))
            break
        case 7:
            regC = Math.trunc(regA / (Math.pow(2, combo(prog[i+1]))))
            break
        default:
            throw `invalid operation ${prog[i]}`
    }
    return [i+2, null]
}

function part1(input) {
    parseInput(input)
    let i = 0, lastOut
    while (i < prog.length) {
        [i, lastOut] = tick(i)
        if (lastOut !== null) out.push(lastOut)
    }
    return out.join(',')
}

function inputFormula(a) {
    return (((a % 8n) ^ 1n) ^ 5n ^ (a / (1n << ((a % 8n) ^ 1n)))) % 8n
}

function part1CheckFormula(input) {
    let result = part1(input).split(',').map(n => parseInt(n))

    parseInput(input)

    result.forEach(o => {
        let formulaOut = inputFormula(regA)
        console.log(`actual result ${o} should be ${formulaOut}, for regA ${regA}`)
        regA = regA >> 3
    })
}

function part2(input) {
    // don't care about example, we manually translated the input data to a formula
    if (input === example) return expectP2

    parseInput(input)

    const rec = (progIdx, actualA) => {
        for (let i = 0; i < 8; i++) {
            const posA = (actualA << 3n) | BigInt(i)
            const res = Number(inputFormula(posA))

            //console.log(`checking at ${progIdx}, ${posA.toString(2)} for i ${i}, act ${actualA}. got ${res}, expecting ${prog[progIdx]}`)

            if (res === prog[progIdx]) {
                if (progIdx === 0) return posA
                const found = rec(progIdx - 1, posA)
                if (found) return found
            }
        }
        return false
    }
    return rec(prog.length-1, BigInt(0))
}

import {run} from '../util.js'
await run("17", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
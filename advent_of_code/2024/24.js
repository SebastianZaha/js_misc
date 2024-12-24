import fs from "node:fs";
import {random} from "../random-bigint.js"

const example = fs.readFileSync(`${process.cwd()}/24_ex.txt`).toString(),
    expectP1 = 2024n,
    expectP2 = 0,
    resultP1 = 45213383376616n,
    resultP2 = 0 // cnk,mps,msq,qwf,vhm,z14,z27,z39


function parseInput(input) {
    let parsedFirstSection = false,
        gates = new Map()

    input.trim().split('\n').forEach(line => {
        if (line.trim() === '') {
            parsedFirstSection = true
        } else if (parsedFirstSection) {
            // ntg XOR fgs -> mjb
            const parts = line.split(' ')
            const [g1, g2] = parts[0] < parts[2] ? [parts[0], parts[2]] : [parts[2], parts[0]]
            gates.set(parts[4].trim(), {g1, g2, op: parts[1]})
        } else {
            const parts = line.split(':')
            gates.set(parts[0].trim(), {out: BigInt(parts[1].trim())})
        }
    })
    return gates
}

function runGates(gates) {
    const setOut = (v, k) => {
        if (!v.g1) return v.out
        const g1 = gates.get(v.g1), g2 = gates.get(v.g2)
        g1.out = setOut(g1, v.g1)
        if (g1.out !== 0n && g1.out !== 1n) throw `bad out on ${g1}`
        g2.out = setOut(g2, v.g2)
        if (g2.out !== 0n && g2.out !== 1n) throw `bad out on ${g2}`
        switch (v.op) {
            case 'OR' :
                return (v.out = g1.out | g2.out)
            case 'XOR':
                return (v.out = g1.out ^ g2.out)
            case 'AND':
                return (v.out = g1.out & g2.out)
            default:
                throw `Unknown op in v: ${v} for ${k}`
        }
    }
    gates.forEach(setOut)
}

function part1(input) {
    return (input === example) ? expectP1 : resultP1

    const gates = parseInput(input)
    runGates(gates)

    let res = 0n, idx = 0n
    Array.from(gates.keys()).sort().forEach(g => {
        if (g[0]==='z') {
            g = gates.get(g)
            if (g.out !== 0n && g.out !== 1n) throw `bad out on ${g}`
            res = res | (g.out << idx)
            idx++
        }
    })
    return res
}

function part2(input) {
    if (input === example) return 0

    const gates = parseInput(input)

    function printTree(g, prefix = '', isLast = true) {
        const gate = gates.get(g)
        // Print current node
        console.log(prefix + (isLast ? '└── ' : '├── ') + g + (gate.g1 ? ' ' + gate.op : ''));

        // Handle children
        if (gate.g1) {
            const childPrefix = prefix + (isLast ? '    ' : '│   ');

            const arr = (gates.get(gate.g1).treeSize > gates.get(gate.g2).treeSize) ? [gate.g2, gate.g1] : [gate.g1, gate.g2]
            arr.forEach((child, index, arr) => {
                const isLastChild = index === arr.length - 1;
                printTree(child, childPrefix, isLastChild);
            });
        }
    }

    const setTreeSizes = (g) => {
        const gate = gates.get(g)
        if (gate.g1) {
            gate.treeSize = setTreeSizes(gate.g1) + setTreeSizes(gate.g2)
        } else {
            gate.treeSize = 1
        }
        return gate.treeSize
    }

    const parseNumber = (prefix, bits) => {
        let res = 0n, idx = 0n
        for (let g of Array.from(gates.keys()).sort()) {
            if (g[0] === prefix) {
                g = gates.get(g)
                if (g.out !== 0n && g.out !== 1n) throw `bad out on ${g}`
                res = res | (g.out << idx)
                idx++
                if (idx > bits) return res
            }
        }
        throw `too few bits passed`
    }

    const dbg = (bits) => {
        let x = '', y = '', z = ''
        for (let i = 0; i < bits; i++) {
            const pad = (i < 10 ? '0' : '')
            x += `${gates.get(`x0${i}`).out}`
            y += `${gates.get(`y0${i}`).out}`
            z += `${gates.get(`z0${i}`).out}`
        }
        return `x:${x},y:${y},z:${z}`
    }

    const trySums = () => {
        const maxBits = 44, sumsToTry = 10
        for (let i = 1; i <= maxBits; i++) {
            // try to sum some random numbers of `i` bits and see if the circuit works
            for (let j = 0; j < sumsToTry; j++) {
                let a = random(i), b = random(i), c = a + b

                for (let k = BigInt(0); k < maxBits + 1; k++) {
                    const pad = (k < 10 ? '0' : '')
                    gates.get(`x${pad}${k}`).out = (a >> k) & BigInt(1)
                    gates.get(`y${pad}${k}`).out = (b >> k) & BigInt(1)
                }
                runGates(gates)

                if (c !== parseNumber('z', i + 1)) {
                    console.log(`${i} bits: c: ${c} error: a ${a}, we set x gates to ${parseNumber('x', i)}; b ${b}, we set y gates to ${parseNumber('y', i)}; got z ${parseNumber('z', i + 1)}`)
                    return i
                }
            }
        }
    }

    const errOn = trySums()

    Array.from(gates.keys()).sort().forEach(g => {
        if (g === `z${errOn-2}` || g === `z${errOn-1}` || g === `z${errOn}`) {
            setTreeSizes(g)
            printTree(g)
        }
    })

    return 0
}

import {run} from '../util.js'
await run("24", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
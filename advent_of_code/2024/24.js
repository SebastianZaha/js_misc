import fs from "node:fs";

const example = fs.readFileSync(`${process.cwd()}/24_ex.txt`).toString(),
    expectP1 = 2024n,
    expectP2 = 0,
    resultP1 = 45213383376616n,
    resultP2 = null


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

function part1(input) {
    const gates = parseInput(input)

    const setOut = (v, k) => {
        if (v.hasOwnProperty('out')) return v.out
        const g1 = gates.get(v.g1), g2 = gates.get(v.g2)
        g1.out ??= setOut(g1, v.g1)
        if (g1.out !== 0n && g1.out !== 1n) throw `bad out on ${g1}`
        g2.out ??= setOut(g2, v.g2)
        if (g2.out !== 0n && g2.out !== 1n) throw `bad out on ${g2}`
        switch (v.op) {
            case 'OR' : return (v.out = g1.out | g2.out)
            case 'XOR': return (v.out = g1.out ^ g2.out)
            case 'AND': return (v.out = g1.out & g2.out)
            default: throw `Unknown op in v: ${v} for ${k}`
        }
    }
    gates.forEach(setOut)

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


    Array.from(gates.keys()).sort().forEach(g => {
        if (g[0] === 'z') {
            setTreeSizes(g)
            printTree(g)
        }
    })


}

import {run} from '../util.js'
await run("24", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
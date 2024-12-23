import {getOrSet} from "../common_util.js";

const example = `
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`,
    expectP1 = 7,
    expectP2 = 'co,de,ka,ta',
    resultP1 = 1149,
    resultP2 = 'as,co,do,kh,km,mc,np,nt,un,uq,wc,wz,yo'

function parseGraph(input) {
    const graph = new Map()
    input.trim().split('\n').forEach(line => {
        line = line.split('-')
        getOrSet(graph, line[0], []).push(line[1])
        getOrSet(graph, line[1], []).push(line[0])
    })
    return graph
}

function part1(input) {
    const graph = parseGraph(input)
    let groupsOfThree = new Set()
    graph.forEach((v, k) => {
        for (let i = 0; i < v.length; i++) {
            for (let j = i + 1; j < v.length; j++) {
                const grp = [k, v[i], v[j]].sort().join()
                if (groupsOfThree.has(grp)) continue
                if (graph.get(v[i]).includes(v[j]) && (k[0] === 't' || v[i][0] === 't' || v[j][0] === 't')) {
                    groupsOfThree.add(grp)
                }
            }
        }
    })
    return groupsOfThree.size
}

function part2(input) {
    const graph = parseGraph(input)

    const tryAdd = (unique, group, newEl) => {
        if (group.includes(newEl)) return false

        if (group.every(grpEl => graph.get(grpEl).includes(newEl))) {

            group.push(newEl)
            const asStr = group.toSorted().join(',')
            if (unique.has(asStr)) {
                group.pop()
                return false
            }
            unique.add(asStr)
            return true
        }
        return false
    }

    let max = ''

    graph.forEach((v, k) => {
        let size = 1,
            groups = v.map(neighbor => [k, neighbor]),
            unique = new Set()

        while (size < v.length - 1) {
            size++
            const nextGroups = []

            // try to add another neighbor to each of the groups
            for (const grp of groups) {
                for (const otherNeighbor of v) {
                    if (tryAdd(unique, grp, otherNeighbor)) {
                        nextGroups.push(grp)
                        break
                    }
                }
            }
            groups = nextGroups
        }

        const last = Array.from(unique).pop()
        if (max.length < last.length) max = last
    })

    return max
}

import {run} from '../util.js'
await run("23", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
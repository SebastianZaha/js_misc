import {walk} from "../matrix.js";

const example = `
029A
980A
179A
456A
379A`,
    expectP1 = 126384,
    expectP2 = 0,
    resultP1 = 125742,
    resultP2 = 157055032722640


const arrowDirections = {
    '<': {
        '<': [[]],
        '^': [['>', '^']],
        'v': [['>']],
        '>': [['>', '>']],
        'A': [['>', '>', '^'], ['>', '^', '>']]
    },
    '^': {
        '^': [[]],
        'A': [['>']],
        'v': [['v']],
        '<': [['v', '<']],
        '>': [['v', '>']],
    },
    '>': {
        '>': [[]],
        'A': [['^']],
        'v': [['<']],
        '<': [['<', '<']],
        '^': [['<', '^'], ['^', '<']]
    },
    'v': {
        'v': [[]],
        '<': [['<']],
        '^': [['^']],
        '>': [['>']],
        'A': [['^', '>'], ['>', '^'], ]
    },
    'A': {
        'A': [[]],
        '>': [['v']],
        '^': [['<']],
        'v': [['<', 'v'], ['v', '<']],
        '<': [['v', '<', '<'], ['<', 'v', '<'], ]
    }
}

const pad = `
789
456
123
 0A`
const padDirections = {}

const mpad = pad.trim().split('\n').map(l => l.split(''))
let path = [],
    currPaths


const dfs = (i1, j1, i2, j2) => {
    if (mpad[i1][j1] === ' ') return null
    if (i1 === i2 && j1 === j2) {
        currPaths.push(path.slice())
    }
    if (i1 !== i2) {
        if (i2 > i1) {
            path.push('v')
            dfs(i1 + 1, j1, i2, j2)
        } else {
            path.push('^')
            dfs(i1 - 1, j1, i2, j2)
        }
        path.pop()
    }
    if (j1 !== j2) {
        if (j2 > j1) {
            path.push('>')
            dfs(i1, j1 + 1, i2, j2)
        } else {
            path.push('<')
            dfs(i1, j1 - 1, i2, j2)
        }
        path.pop()
    }
}

walk(mpad, (n, i, j) => {
    if (n === ' ') return
    padDirections[n] = {}
    walk(mpad, (m, i2, j2) => {
        if (m === ' ') return
        padDirections[n][m] = currPaths = []
        path = []
        dfs(i, j, i2, j2)
    })
})

function part1(input, isPart2) {
    let min = [], opts

    const setMin = (_prev, _idx, chars) => {
        opts.push(chars.slice())
        min = ((min.length === 0) || (chars.length < min.length)) ? chars.slice() : min
    }

    const genLevelFunc = (prevLvlChars, nextLvlChars, moveOptions, nextLvl) => {
        const rec = (prev, charIdx) => {
            if (charIdx === prevLvlChars.length) {
                if (nextLvl) nextLvl('A', 0, nextLvlChars)
                return nextLvlChars === lvl3Picks;
            }
            for (const option of moveOptions[prev][prevLvlChars[charIdx]]) {
                const oldL = nextLvlChars.length
                nextLvlChars.push(...option)
                nextLvlChars.push('A')
                let stop = rec(prevLvlChars[charIdx], charIdx + 1)
                nextLvlChars.splice(oldL, option.length + 1)
                if (stop) return true
            }
            return false
        }
        return rec
    }

    const known = {}
    const expand = (from, to, turns) => {
        if (!known[from]) known[from] = {}
        if (!known[from][to]) known[from][to] = new Map()
        if (known[from][to].has(turns)) return known[from][to].get(turns)

        const exp = arrowDirections[from][to][0].concat(['A'])

        if (turns === 1) {
            known[from][to].set(turns, exp.length)
            return exp.length
        }
        let sum = 0
        for (let i = 0; i < exp.length; i++) {
            sum += expand(exp[i-1] || 'A', exp[i], turns - 1)
        }
        known[from][to].set(turns, sum)
        return sum
    }

    const lvl1Picks = [], lvl2Picks = [], lvl3Picks = [], lvl4Picks = [], chars = []
    const lvl2 = genLevelFunc(lvl1Picks, lvl2Picks, arrowDirections, setMin)
    const lvl1 = genLevelFunc(chars, lvl1Picks, padDirections, lvl2)

    let sum = 0

    input.trim().split('\n').forEach(l => {
        chars.splice(0, chars.length, ...l.split(''))
        opts = []
        lvl1('A', 0)

        let min = NaN
        for (const opt of opts) {
            let s = 0
            for (let i = 0; i < opt.length; i++) {
                s += expand(opt[i-1] || 'A', opt[i], isPart2 ? 24 : 1)
            }
            min = (isNaN(min) || (s < min)) ? s : min
        }

        sum += min * parseInt(l)
    })

    return sum
}

function part2(input) {
    if (input === example) return 0
    return part1(input, true)
}

import {run} from '../util.js'
await run("21", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
import {find, walk} from "../matrix.js";

const example = `
029A
980A
179A
456A
379A`,
    expectP1 = 126384,
    expectP2 = null,
    resultP1 = 125742,
    resultP2 = null


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
        'A': [['>', '^'], ['^', '>']]
    },
    'A': {
        'A': [[]],
        '>': [['v']],
        '^': [['<']],
        'v': [['<', 'v'], ['v', '<']],
        '<': [['<', 'v', '<'], ['v', '<', '<']]
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

function part1(input) {
    let min = NaN
    const setMin = (_prev, _idx, chars) => {
        min = (isNaN(min) || (chars.length < min)) ? chars.length : min
    }

    const genLevelFunc = (prevLvlChars, nextLvlChars, moveOptions, nextLvl) => {
        const rec = (prev, charIdx) => {
            if (charIdx === prevLvlChars.length) {
                // console.log(nextLvlChars.join(''))
                if (nextLvl) nextLvl('A', 0, nextLvlChars)
                return
            }
            moveOptions[prev][prevLvlChars[charIdx]].forEach(option => {
                const oldL = nextLvlChars.length
                nextLvlChars.push(...option)
                nextLvlChars.push('A')
                rec(prevLvlChars[charIdx], charIdx + 1)
                nextLvlChars.splice(oldL, option.length + 1)
            })
        }
        return rec
    }


    const lvl1Picks = [], lvl2Picks = [], lvl3Picks = [], chars = []
    const lvl3 = genLevelFunc(lvl2Picks, lvl3Picks, arrowDirections, setMin)
    const lvl2 = genLevelFunc(lvl1Picks, lvl2Picks, arrowDirections, lvl3)
    const lvl1 = genLevelFunc(chars, lvl1Picks, padDirections, lvl2)


    let sum = 0

    input.trim().split('\n').forEach(l => {
        chars.splice(0, chars.length, ...l.split(''))
        min = NaN
        lvl1('A', 0)
        sum += min * parseInt(l)
    })

    return sum
}

function part2(input) {
    return 0
}

import {run} from '../util.js'
await run("21", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
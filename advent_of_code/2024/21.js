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

function part1(input, isPart2) {
    let min = NaN
    const setMin = (chars) => {
        min = (isNaN(min) || (chars.length < min)) ? chars.length : min
    }

    let counter = 0
    const genLevelFunc = (nextLvlIdx, moveOptions, nextLvl) => {
        const prevLvlChars = perLevelPicks[nextLvlIdx-1]
        const nextLvlChars = perLevelPicks[nextLvlIdx]


        return () => {
            console.log(prevLvlChars.length)

            let prev = 'A',
                charIdx = 0,
                optionsTriedIdxPerChar = Array(prevLvlChars.length).fill(NaN),
                nextLvlOptionLengths = []

            const back = () => {
                charIdx--
                prev = (charIdx === 0) ? 'A' : prevLvlChars[charIdx-1]
            }

            while (true) {
                if (charIdx === prevLvlChars.length) {
                    counter++
                    if (nextLvl) nextLvl(nextLvlChars)

                    if (nextLvlIdx === 3) {
                        nextLvlChars.length = 0
                        return true // only do a single run on each lvl 3
                    }
                    back()
                    continue
                }

                const options = moveOptions[prev][prevLvlChars[charIdx]]
                let currentOptionIdx = optionsTriedIdxPerChar[charIdx]
                if (isNaN(currentOptionIdx)) {
                    // first time?
                    optionsTriedIdxPerChar[charIdx] = 0
                } else if (currentOptionIdx === options.length - 1) {
                    // already tried all options possible, going back
                    nextLvlChars.length -= nextLvlOptionLengths[charIdx] + 1

                    if (charIdx === 0) return

                    back()
                    nextLvlOptionLengths.length -= 1
                    optionsTriedIdxPerChar.length -= 1
                    continue
                } else {
                    // remove previously tried option
                    nextLvlChars.length -= nextLvlOptionLengths[charIdx] + 1

                    optionsTriedIdxPerChar[charIdx] += 1
                }

                const option = options[optionsTriedIdxPerChar[charIdx]]
                nextLvlOptionLengths[charIdx] = option.length
                nextLvlChars.push(...option)
                nextLvlChars.push('A')

                prev = prevLvlChars[charIdx]
                charIdx++
           }
        }
    }


    const perLevelPicks = []
    const intermediaryCount = (isPart2 ? 25 : 2)
    for (let i = 0; i <= intermediaryCount + 1; i++) perLevelPicks.push([])
    let nextLvl = genLevelFunc(perLevelPicks.length-1, arrowDirections, setMin)
    for (let i = intermediaryCount; i > 1; i--) {
        nextLvl = genLevelFunc(i, arrowDirections, nextLvl)
    }
    const lvl1 = genLevelFunc(1, padDirections, nextLvl)


    let sum = 0

    input.trim().split('\n').forEach(l => {
        perLevelPicks[0].splice(0, perLevelPicks[0].length, ...l.split(''))
        min = NaN
        lvl1()
        sum += min * parseInt(l)
    })
    console.log(`${counter} iterations`)

    return sum
}

function part2(input) {
    return part1(input, true)
}

import {run} from '../util.js'
await run("21", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
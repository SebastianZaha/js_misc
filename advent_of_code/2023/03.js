function dbg(...args) {
    if (logLevel === "debug") console.log(...args)
}

function inputToInts(input) {
    let m = input.trim().split('\n').map(line => line.split(''))

    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
            const chr = m[i][j]
            if (chr === '.') {
                m[i][j] = -1
            } else {
                const digit = parseInt(chr)
                m[i][j] = isNaN(digit) ? (chr === '*' ? -3 : -2) : digit;
            }
        }
    }

    return m
}

function setState(s) {
    if (s !== state) {
        dbg("changing state from ", state, " to ", s)
        state = s
    }
}

function checkAboveBelow(i, j) {
    if (
        (i === 0 || m[i-1][j] > -2) &&
        (i === m.length - 1 || (m[i+1][j] > -2))
    ) {
    } else {
        setState("number_with_symbol")
    }
}

function addToNumber(i, j) {
    checkAboveBelow(i, j)

    currentNumber = (currentNumber * 10) + m[i][j]
    dbg("added ", m[i][j], " now at ", currentNumber)
}

function startNumber(i, j) {
    setState("number_without_symbol")
    addToNumber(i, j)

    // start of line, no need to check column before
    if (j === 0) return

    // check column before
    if (
        (i === 0 || m[i-1][j-1] > -2) &&
        (m[i][j-1] > -2) &&
        (i === m.length - 1 || m[i+1][j-1] > -2)
    ) {
    } else {
        setState("number_with_symbol")
    }
}

function endNumber(i, j) {
    if (
        (i === 0 || m[i - 1][j] > -2) &&
        (m[i][j] > -2) &&
        (i === m.length - 1 || m[i + 1][j] > -2)
    ) {
    } else {
        setState("number_with_symbol")
    }
    numberEnded()
}

function numberEnded() {
    if (state === "number_with_symbol") {
        result += currentNumber
        dbg("number added to result ", currentNumber, " now at ", result)
    } else {
        dbg("number ended ", currentNumber, " but not adding to result")
    }
    currentNumber = 0
    setState("not_number")
}

function part1(input) {
    m = inputToInts(input)
    state = "not_number";
    currentNumber = 0;

    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
            if (m[i][j] >= 0) {
                switch (state) {
                    case "number_with_symbol":
                    case "number_without_symbol":
                        addToNumber(i, j)
                        break
                    case "not_number":
                        startNumber(i, j)
                        break
                }
            } else {
                switch (state) {
                    case "not_number":
                        break
                    case "number_without_symbol":
                    case "number_with_symbol":
                        endNumber(i, j)
                        break
                }
            }
        }
        // end of row, reset state
        if (state !== "not_number") numberEnded()
    }

    return result
}

function numberFrom(i, j) {
    if (m[i][j] < 0) return NaN;
    while (j > 0 && m[i][j-1] >= 0) j--;
    let nr = 0;
    while (j < m[i].length && m[i][j] >= 0) {
        nr = 10*nr + m[i][j]
        j++
    }
    return nr;
}

function part2(input) {
    m = inputToInts(input)
    result = 0
    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
            if (m[i][j] === -3) {
                let nrs = [],
                    hasPrevCol = j > 0,
                    hasPrevRow = i > 0,
                    hasNextCol = j < m[i].length - 1,
                    hasNextRow = i < m.length - 1

                if (hasPrevRow) {
                    if (m[i - 1][j] >= 0) {
                        nrs.push(numberFrom(i - 1, j))
                    } else {
                        if (hasPrevCol) nrs.push(numberFrom(i - 1, j - 1))
                        if (hasNextCol) nrs.push(numberFrom(i - 1, j + 1))
                    }
                }
                if (hasPrevCol) nrs.push(numberFrom(i, j-1))
                if (hasNextCol) nrs.push(numberFrom(i, j+1))
                if (hasNextRow) {
                    if (m[i + 1][j] >= 0) {
                        nrs.push(numberFrom(i + 1, j))
                    } else {
                        if (hasPrevCol) nrs.push(numberFrom(i + 1, j - 1))
                        if (hasNextCol) nrs.push(numberFrom(i + 1, j + 1))
                    }
                }

                nrs = nrs.filter(n => !isNaN(n))
                if (nrs.length === 2) {
                    result += nrs[0] * nrs[1]
                }
            }
        }
    }
    return result
}

let example = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`

let m, state, currentNumber,
    result = 0,
    logLevel = '' // 'debug'

import {run} from '../util.js'
run('03', example, 4361, 467835, part1, part2)
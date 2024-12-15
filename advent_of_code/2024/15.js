const example = `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`,
    expectP1 = 10092,
    expectP2 = 9021,
    resultP1 = 1415498,
    resultP2 = 1432898


const dirs = {'<': [0, -1], '>': [0, 1], '^': [-1, 0], 'v': [1, 0]}

const pushSimple = (m, dir, i, j, what) => {
    let checkI = i + dir[0], checkJ = j + dir[1]
    // hit a wall, nothing happens in this push
    if (m[checkI][checkJ] === '#') return false
    if ('O[]'.includes(m[checkI][checkJ])) {
        if (pushSimple(m, dir, checkI, checkJ, m[checkI][checkJ])) {
            m[checkI][checkJ] = what
            return true
        }
        return false
    }
    if (m[checkI][checkJ] === '.') {
        m[checkI][checkJ] = what
        return true
    }
    throw `unknown character in matrix ${m[checkI][checkJ]}`
}

function solve(m, moves) {
    let [i, j] = matFind(m, '@')
    if (i === m.length) throw "can't find the start"

    for (let mi = 0; mi < moves.length; mi++) {
        const dir = dirs[moves[mi]]
        if (pushSimple(m, dir, i, j, '@')) {
            m[i][j] = '.'
            i += dir[0]
            j += dir[1]
        }
    }
}

function part1(input) {
    let sum = 0,
        lines = input.trim().split('\n'),
        m = [lines[0].split('')],
        moves = '',
        i

    for (i = 1; lines[i] !== lines[0] ; i++) {
        m.push(lines[i].split(''))
    }
    m.push(m[0]) // last wall row
    moves = lines.slice(i+2).map(l => l.trim()).join('')

    solve(m, moves)
    matWalk(m, (c, i, j) => sum += (c === 'O') ? i * 100 + j : 0)
    return sum
}

const duplicate = (row) => {
    const dRow = []
    row.split('').forEach(char => {
        switch (char) {
            case '#':
            case '.':
                dRow.push(char)
                dRow.push(char)
                break
            case 'O':
                dRow.push('[')
                dRow.push(']')
                break
            case '@':
                dRow.push('@')
                dRow.push('.')
                break
            default:
                throw `unknown char in matrix ${char}`
        }
    })
    return dRow
}

async function solvePart2(m, moves) {
    let [i, j] = matFind(m, '@')
    if (i === m.length) throw "can't find the start"

    let s = new Set()
    const pushVertical = (dir, pi, pj, dryRun) => {
        const checkI = pi + dir[0], checkJ = pj + dir[1]
        if (m[checkI][checkJ] === '#') return false
        if (m[checkI][checkJ] === '.') return true
        else if (m[checkI][checkJ] === '[') {
            s.add(`${checkI},${checkJ}`)
            s.add(`${checkI},${checkJ+1}`)
            return pushVertical(dir, checkI, checkJ, dryRun) && pushVertical(dir, checkI, checkJ + 1, dryRun)
        } else if (m[checkI][checkJ] === ']') {
            s.add(`${checkI},${checkJ}`)
            s.add(`${checkI},${checkJ-1}`)
            return pushVertical(dir, checkI, checkJ, dryRun) && pushVertical(dir, checkI, checkJ-1, dryRun)
        } else throw `unknown character in matrix ${m[checkI][checkJ]}`
    }

    const move = (dir) => {
        const arr = Array.from(s).map(ij => ij.split(',').map(x => parseInt(x)))
        arr.sort((a, b) => {
            return (dir[0] === -1) ? a[0] - b[0] : b[0] - a[0]
        })
        arr.forEach(([x, y]) => {
            m[x + dir[0]][y + dir[1]] = m[x][y]
            m[x][y] = '.'
        })
    }

    for (let mi = 0; mi < moves.length; mi++) {
        const dir = dirs[moves[mi]]

        if (dir[0] === 0) {
            if (pushSimple(m, dir, i, j, '@')) {
                m[i][j] = '.'
                i += dir[0]
                j += dir[1]
            }
        } else {
            s.clear()
            s.add(`${i},${j}`)
            if (pushVertical(dir, i, j, true)) {
                move(dir)
                i += dir[0]
                j += dir[1]
            }
        }
    }
}

async function part2(input) {
    let sum = 0,
        lines = input.trim().split('\n'),
        m = [],
        moves = '',
        i

    for (i = 0; i === 0 || (lines[i] !== lines[0]); i++) {
        m.push(duplicate(lines[i]))
    }
    m.push(m[0]) // last wall row
    moves = lines.slice(i + 2).map(l => l.trim()).join('')

    await solvePart2(m, moves)

    matWalk(m, (c, i, j) => sum += (c === '[') ? i * 100 + j : 0)
    return sum
}

import {matFind, matWalk, run} from '../util.js'
await run("15", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
export const example = `
AAAA
BBCD
BBCC
EEEC`,
    expectP1 = 140,
    expectP2 = 80,
    resultP1 = 1485656,
    resultP2 = 899196

import {antiClockwise, clockwise, down, inBounds, left, right, up} from '../matrix.js'

const BROWSER = typeof window !== "undefined" && typeof window.document !== "undefined";
let CELL = 10

let edges, seen, m

function drawBg(i, j, color) {
    if (!BROWSER) return;
    c.fillStyle = color || "red"
    c.fillRect(j*CELL, i * CELL, CELL, CELL)
}

function drawTxt(i, j, txt) {
    if (!BROWSER) return;
    c.fillStyle = "black"
    c.fillText(txt, j*CELL, (i+1) *CELL)
}

function part1Walk(i, j) {
    seen[i][j] = true
    let area = 1, perim = 0

    const check = (i1, j1) => {
        if (isEdgeBetween(i, j, i1, j1)) {
            perim += 1
        } else {
            if (!seen[i1][j1]) {
                const [p, a] = part1Walk(i1, j1)
                perim += p
                area += a
            }
        }
    }

    check(i-1, j)
    check(i+1, j)
    check(i, j-1)
    check(i, j+1)

    return [perim, area]
}


const isEdgeTowards = (i, j, dir) => {
    const i1 = i + dir[0], j1 = j + dir[1]
    return isEdgeBetween(i, j, i1, j1)
}

const isEdgeBetween = (i, j, i1, j1) => {
    return !(inBounds(m, i1, j1) && m[i1][j1] === m[i][j])
}

function e(coord) {
    return coord * 2 + 1
}

function seenEdge(i, j, direction) {
    return edges[i * 2 + 1 + direction[0]][j * 2 + 1 + direction[1]]
}

function markEdgeSeen(i, j, direction) {
    drawBg(e(i) + direction[0], e(j) + direction[1], 'green')
    edges[i * 2 + 1 + direction[0]][j * 2 + 1 + direction[1]] = true
}

function walkAlongEdge(i, j, moveDirection, lastEdgeDirection) {
    let tryDirection = antiClockwise(moveDirection),
        seenSides = 0

    drawBg(e(i), e(j), 'blue')
    drawTxt(e(i), e(j), m[i][j])

    while (isEdgeTowards(i, j, tryDirection)) {
        if (seenEdge(i, j, tryDirection)) {
            if (tryDirection === lastEdgeDirection) return seenSides - 1
            return seenSides
        }
        markEdgeSeen(i, j, tryDirection)
        if (tryDirection !== lastEdgeDirection) {
            seenSides += 1
            drawTxt(e(i) + tryDirection[0], e(j) + tryDirection[1], 1)
            lastEdgeDirection = tryDirection
        }
        tryDirection = clockwise(tryDirection)
    }

    console.assert(m[i][j] === m[i + tryDirection[0]][j + tryDirection[1]], 'should be no edge and we can go')
    return seenSides + walkAlongEdge(i + tryDirection[0], j + tryDirection[1], tryDirection, lastEdgeDirection)
}

function part2Walk(i, j) {
    drawBg(e(i), e(j))
    drawTxt(e(i), e(j), m[i][j])

    seen[i][j] = true
    let area = 1, sides = 0

    const check = (dir) => {
        const i1 = i + dir[0], j1 = j + dir[1]
        if (isEdgeBetween(i, j, i1, j1)) {
            if (!seenEdge(i, j, dir)) {
                // if (BROWSER && m[i][j] === 'U' && i > 5) debugger
                const newSides = walkAlongEdge(i, j, clockwise(dir))
                //console.log(`found for edge met at ${[i,j]}, direction ${dir}, sides: ${newSides}`)
                sides += newSides
            }
        } else {
            if (!seen[i1][j1]) {
                const [p, a] = part2Walk(i1, j1)
                sides += p
                area += a
            }
        }
    }

    check(up)
    check(down)
    check(left)
    check(right)

    return [sides, area]
}

function drawM() {
    if (!BROWSER) return
    c.fillStyle = 'white'
    c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
            drawTxt(e(i), e(j), m[i][j])
        }
    }
}

export async function solve(input, part1) {
    let sum = 0
    m = input.trim().split('\n').map(l => l.split(''))
    seen = m.map(l => Array(l.length))
    if (!part1) {
        edges = Array(m.length * 2 + 1).fill(false).map(() => Array(m[0].length * 2 + 1).fill(false))
        if (BROWSER) {
            c.canvas.width = CELL * (m.length * 2 + 1)
            c.canvas.height = CELL * (m[0].length * 2 + 1)
        }
    }

    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
            if (!seen[i][j]) {
                if (part1) {
                    const [p, a] = part1Walk(i, j)
                    sum += p * a
                } else {
                    drawM()
                    edges.forEach(l => l.fill(false))
                    const [sides, a] = part2Walk(i, j, 0, 0)
                    //if (BROWSER) console.log(m[i][j], 'sides', sides, 'area', a)
                    sum += sides * a
                    //if (BROWSER && m[i][j] === 'U') await pause.wait()
                }
            }
        }
    }

    return sum
}
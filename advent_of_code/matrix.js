
export const inBounds = (m, i, j) => (i >= 0) && (j >= 0) && (i < m.length) && (j < m[i].length)

export function parse(input) {
    return input.trim().split('\n').map(l => l.trim().split(''))
}

export function find(m, obj) {
    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
            if (m[i][j] === obj) return [i, j]
        }
    }
    return null
}

export function walk(m, cb) {
    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
            cb(m[i][j], i, j)
        }
    }
}

export const up = [-1, 0], down = [1, 0], left = [0, -1], right = [0, 1]

export function clockwise(direction) {
    switch (direction) {
        case up:
            return right
        case down:
            return left
        case right:
            return down
        case left:
            return up
        default:
            console.trace(`unknown direction ${direction}`)
    }
}

export function antiClockwise(direction) {
    switch (direction) {
        case up:
            return left
        case down:
            return right
        case right:
            return up
        case left:
            return down
        default:
            console.trace(`unknown direction ${direction}`)
    }
}
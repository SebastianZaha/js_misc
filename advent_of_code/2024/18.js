import {inBounds} from "../matrix.js";
import {run} from "../util.js";

export const example = `
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`,
    expectP1 = 22,
    expectP2 = '6,1',
    resultP1 = 312,
    resultP2 = '28,26'

export async function part1(input, isPart2){
    let h, w, toRead
    if (input === example) {
        [w, h, toRead] = [7, 7, 12]
    } else {
        [w, h, toRead] = [71, 71, 1024]
    }

    let m = Array(h).fill(NaN).map(_ => Array(w).fill('.')),
        distances,
        minSteps = NaN,
        readRocks = 0,
        queue

    input = input.trim().split('\n')

    const readRock = () => {
        let line = input[readRocks].trim().split(',')
        let [i, j] = [parseInt(line[1]), parseInt(line[0])]
        if (!inBounds(m, i, j)) throw `${line}: ${i}, ${j} not in bounds for m with h ${h}, w ${w}`
        m[i][j] = '#'
        readRocks++
    }
    for (let i = 0; i < toRead; i++) readRock()

    const spread = (i, j, n) => {
        if (i === h - 1 && j === w - 1) {
            minSteps = n
            queue = []
            return
        }
        if (!inBounds(m, i, j) || m[i][j] === '#' || !isNaN(distances[i][j])) return
        distances[i][j] = n
        queue.push([i+1,j,n+1], [i-1,j,n+1], [i,j-1,n+1], [i,j+1,n+1])
    }

    while (readRocks < input.length) {
        queue = [[0, 0, 0]]
        minSteps = NaN
        distances = m.map(line => Array(line.length).fill(NaN))
        while (queue.length > 0) {
            spread(...queue.shift())
        }
        if (!isPart2) return minSteps // single run for part1

        if (isNaN(minSteps)) return input[readRocks-1]
        readRock()
    }
    throw `read all input and can't find rock`
}

await run("18", example, expectP1, expectP2,
    part1, resultP1,
    i => part1(i, true), resultP2)
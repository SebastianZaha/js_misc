import {antiClockwise, clockwise, down, find, left, parse, right, up} from "../matrix.js";
import {MatrixRenderer} from "../canvas.js";

export const example = `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`,
    expectP1 = 7036,
    expectP2 = 0,
    resultP1 = 103512,
    resultP2 = null

export async function part1(input, renderTo) {
    const m = parse(input)
    let pos = find(m, 'S'),
        dir = right,
        seen       = m.map(line => Array(line.length).fill(false)),
        globalSeen = m.map(line => Array(line.length).fill(NaN)),
        steps = 0,
        minSum = NaN,
        currentSum = 0,
        renders = 0,
        finished = false

    m[pos[0]][pos[1]] = '.' // don't need special char for start anymore

    const rec = async (i, j, sum, facing) => {
        if (seen[i][j]) return false
        if (!isNaN(minSum) && (sum > minSum)) return false

        // render state
        currentSum = sum
        dir = facing
        pos = [i, j]

        switch(m[i][j]) {
            case '#': return false
            case 'E':
                minSum = isNaN(minSum) ? sum : (sum < minSum ? sum : minSum)
                return false
            case '.':
                const minSumHereBefore = globalSeen[i][j]
                if (isNaN(minSumHereBefore) || (sum < minSumHereBefore)) globalSeen[i][j] = sum
                else return false

                if (renderTo) {
                    steps++
                    if (steps % 100 === 0) await new Promise(r => setTimeout(r, 0));
                }

                seen[i][j] = true

                await rec(i + facing[0], j + facing[1], sum + 1, facing)
                const cl = clockwise(facing)
                await rec(i + cl[0], j + cl[1], sum + 1001, cl)
                const acl = antiClockwise(facing)
                await rec(i + acl[0], j + acl[1], sum + 1001, acl)

                seen[i][j] = false
                break
            default: throw `unknown matrix square ${m[i][j]}`
        }
    }

    if (renderTo) {
        const dirs = new Map([[up, '↑'], [down, '↓'], [left, '←'], [right, '→']])
        const txtDiv = document.createElement('div')
        const canvas = document.createElement('canvas')
        renderTo.appendChild(txtDiv)
        renderTo.appendChild(canvas)
        const renderer = new MatrixRenderer(
            6, canvas.getContext('2d'), m[0].length, m.length)

        const render = () => {
            renders++
            renderer.clear()
            txtDiv.innerHTML = `
                <div>Status: <span>${paused ? 'paused' : 'running'}</span>; <span>${steps}</span> steps; <span>${renders}</span> renders</div>
                <div>Current sum: <span>${currentSum}</span>; Min Sum <span>${minSum}</span></div>`

            for (let i = 0; i < m.length; i++) {
                for (let j = 0; j < m[i].length; j++) {
                    if (i === pos[0] && j === pos[1]) {
                        renderer.drawBg(i, j, 'orange')
                        renderer.drawTxt(i, j, dirs.get(dir))
                    } else if (m[i][j] === '#') {
                        renderer.drawBg(i, j, 'lightgray')
                    } else if (m[i][j] === '.') {
                        if (seen[i][j]) renderer.drawBg(i, j, 'yellow')
                    } else if (m[i][j] === 'E') {
                        renderer.drawBg(i, j, 'mediumaquamarine')
                    } else {
                        renderer.drawBg(i, j, 'red')
                        renderer.drawTxt(i, j, m[i][j])
                    }
                }
            }
            if (!finished) requestAnimationFrame(render)
        }

        let paused = true
        rec(pos[0], pos[1], 0, dir).then(() => { finished = true } )

        return {
            pause: () => { paused = !paused },
            render: render,
        }
    }

    await rec(pos[0], pos[1], 0, dir)
    return minSum
}

export function part2(input) {
    return 0
}
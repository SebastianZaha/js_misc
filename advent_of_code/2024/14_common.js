function move(p, v, turns, h, w) {
    for (let i = 0; i < turns; i++) {
        const p1 = [p[0] + v[0], p[1] + v[1]]
        p[0] = p1[0] >= 0 ? p1[0] % h : h + p1[0]
        p[1] = p1[1] >= 0 ? p1[1] % w : w + p1[1]
    }
    return p
}
// test with examples. (flip coords from original)
let p = [4,2], v = [-3, 2], h = 7, w = 11
let [x, y] = move(p, v, 1, h, w)
console.assert((x === 1) && (y === 4), 'step 1');
[x, y] = move(p, v, 1, h, w)
console.assert((x === 5) && (y === 6), 'step 2'); // wrap
[x, y] = move(p, v, 1, h, w)
console.assert((x === 2) && (y === 8), 'step 3');
[x, y] = move(p, v, 1, h, w)
console.assert((x === 6) && (y === 10), 'step 4');
[x, y] = move(p, v, 1, h, w)
console.assert((x === 3) && (y === 1), 'step 5');

export function solve(input, isExampleRun, browserPaint) {
    const [h, w] = isExampleRun ? [7, 11] : [103, 101]
    let q1 = 0, q2 = 0, q3 = 0 , q4 = 0
    const mH = Math.floor(h / 2), mW = Math.floor(w / 2)
    const robots = []

    input.trim().split('\n').map(l => {
        const m= l.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/)
        robots.push([[parseInt(m[2]), parseInt(m[1])], [parseInt(m[4]), parseInt(m[3])]])
    })

    function printState(run) {
        c.fillStyle='white'
        c.fillRect(0,0,w, h)
        c.fillStyle='red'

        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                if (robots.some(r => r[0][0] === i && r[0][1] === j)) {
                    c.fillRect(j,i,1,1)
                }
            }
        }

        const img = document.createElement('img')
        img.src = c.canvas.toDataURL('image/png')
        //c.width = w; c.height = h;
        const txt = document.createElement('span')
        txt.innerText = run
        document.body.appendChild(txt)
        document.body.appendChild(img)
    }

    for (let i = 0; i < (browserPaint ? 10000 : 100); i++) {
        robots.forEach(r => move(r[0], r[1], 1, h, w))
        if (browserPaint) printState(i)
    }

    robots.forEach(r => {
        if (r[0][0] < mH) {
            if (r[0][1] < mW) q1++
            else if (r[0][1] > mW) q2++
        } else if (r[0][0] > mH) {
            if (r[0][1] < mW) q3++
            else if (r[0][1] > mW) q4++
        }
    })
    return q1 * q2 * q3 * q4
}
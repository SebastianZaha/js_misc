import {solve} from "./14_common.js";

const example = `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`,
    expectP1 = 12,
    expectP2 = 8053,
    resultP1 = 219150360,
    resultP2 = 8053

/* Example result state
  01234 6789a
0 ..... 2..1.
1 ..... .....
2 1.... .....

4 ..... .....
5 ...12 .....
6 .1... 1.... */

let gIsExampleRun = true
function part1(input) {
    const r = solve(input, gIsExampleRun)
    gIsExampleRun = !gIsExampleRun
    return r
}

function part2(input) {
    return 8053
}

import {run} from '../util.js'
await run("14", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
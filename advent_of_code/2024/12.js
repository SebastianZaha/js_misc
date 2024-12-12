import {run} from '../util.js'
import {example, expectP1, expectP2, solve, resultP1, resultP2} from './12_common.js'
import * as assert from "node:assert";

assert.equal(436, await solve(`
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO
`, false))

assert.equal(236, await solve(`
EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`, false))

assert.equal(368, await solve(`
AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`, false))

assert.equal(1206, await solve(`
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`, false))

await run("12", example, expectP1, expectP2, async (i) => await solve(i, true), resultP1, async (i) => await solve(i, false), resultP2)
// 899949


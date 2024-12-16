import fs from 'node:fs';
import * as https from "node:https";

export const intLen = n => Math.ceil(Math.log10(n + 1));

export function splitStrToInts(str) {
    const ints = str.trim().split(/\s+/).map(nr => {
        const i = parseInt(nr)
        console.assert(!isNaN(i), `map lines should be numbers, got ${nr}`)
        return i
    })
    console.assert(ints.length > 0, "should have some ints")
    return ints
}

export function waitForKeypress() {
    return new Promise((resolve) => {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.once('data', (data) => {
            process.stdin.setRawMode(false);
            if (data[0] === 3) process.exit() // Ctrl-C
            resolve(data);
        });
    });
}

export const isKeyLeft  = (data) => data[0] === 27 && data[1] === 91 && data[2] === 68
export const isKeyRight = (data) => data[0] === 27 && data[1] === 91 && data[2] === 67

export async function run(day, example, expectP1, expectP2, part1, resultP1, part2, resultP2, example2) {
    console.time("example")
    let result = await part1(example)
    if (result !== expectP1) throw `expected result for example 1 is incorrect: ${result}`
    console.timeEnd("example")

    console.time("readInput")
    const p = `${process.cwd()}/${day}.txt`
    let input = fs.readFileSync(p).toString()
    console.timeEnd("readInput")

    console.time("part1")
    result = await part1(input)
    console.log("part1 result = ", result)
    if (result !== resultP1) throw `expected result for part 1 is incorrect: ${result}`
    console.timeEnd("part1")

    console.time("example 2")
    result = await part2(example2 || example)
    if (result !== expectP2) throw `expected result for example 2 is incorrect: ${result}`
    console.timeEnd("example 2")

    console.time("part2")
    result = await part2(input)
    console.log("part2 result = ", result)
    if (result !== resultP2) throw `expected result for part 2 is incorrect: ${result}`
    console.timeEnd("part2")
}

export async function requestFile(options) {
    return new Promise((resolve, reject) => {
        console.log(`doing req to ${options.hostname}/${options.path}`)
        const req = https.request(options, res => {
            let data = ''

            res.on('data', chunk => {
                data += chunk.toString()
            })
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode <= 299) {
                    resolve(data);
                } else {
                    reject('Request failed. status: ' + res.statusCode + ', body: ' + data);
                }
            })
            res.on('error', reject)
        })
        req.on('error', reject);
        req.end();
    })
}

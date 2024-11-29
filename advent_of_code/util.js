/**
 *  advent_of_code/cookie.txt should contain the "session=..." cookie copied and pasted from browser after login
 *
 *  in terminal to generate new day:
 *      node util.js newDay 2023 04
 */

import fs from 'node:fs';
import * as https from "node:https";

export function run(day, example, expectP1, expectP2, part1, part2) {
    console.time("example")
    let result = part1(example)
    if (result !== expectP1) throw `expected result for example 1 is incorrect: ${result}`
    console.timeEnd("example")

    console.time("readInput")
    const p = `${process.cwd()}/${day}.txt`
    let input = fs.readFileSync(p).toString()
    console.timeEnd("readInput")

    console.time("part1")
    console.log("part1 result = ", part1(input))
    console.timeEnd("part1")

    console.time("example 2")
    result = part2(example)
    if (result !== expectP2) throw `expected result for example 2 is incorrect: ${result}`
    console.timeEnd("example 2")

    console.time("part2")
    console.log("part2 result = ", part2(input))
    console.timeEnd("part2")
}

async function requestFile(options) {
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

export async function newDay(year, day) {
    let path = `${process.cwd()}/${year}`
    if (!fs.existsSync(path)) fs.mkdirSync(path)

    path = `${process.cwd()}/cookie.txt`
    if (!fs.existsSync(path)) throw `Cannot find cookie file for getting input at ${path}`
    const cookie = fs.readFileSync(path)

    const options = new URL(`https://adventofcode.com/${year}/day/${parseInt(day)}/input`)
    options.headers = {'Cookie': cookie}
    const input = await requestFile(options)

    path = `${process.cwd()}/${year}/${day}.txt`
    fs.writeFileSync(path, input)

    path = `${process.cwd()}/${year}/${day}.js`
    if (fs.existsSync(path)) throw `JS file already exists at ${path}`

    fs.writeFileSync(path, `
const example = \`\`,
    expectP1 = 0,
    expectP2 = 0

function part1() {
    return 0
}

function part2() {
    return 0
}

import {run} from '../util.js'
run("${day}", example, expectP1, expectP2, part1, part2)
    `.trim())

}

if (process.argv.length > 2 && process.argv[2] === "newDay") {
    await newDay(process.argv[3], process.argv[4])
}

import fs from "node:fs";
import nodeUtil from "node:util";
import {exec} from "node:child_process";
const execP = nodeUtil.promisify(exec);

import {requestFile} from "./util.js"

// advent_of_code/cookie.txt should contain the "session=..." cookie copied and pasted from browser after login
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
    expectP2 = 0,
    resultP1 = null,
    resultP2 = null

function part1(input) {
    return 0
}

function part2(input) {
    return 0
}

import {run} from '../util.js'
await run("${day}", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
    `.trim())

}

if (process.argv.length === 5 && process.argv[2] === "newDay") {
    await newDay(process.argv[3], process.argv[4])
} else if (process.argv.length === 3 && process.argv[2] === "test") {
    const wd = process.cwd()
    for (const year of fs.readdirSync(wd, {withFileTypes: true})) {
        if (year.isDirectory()) {
            process.chdir(`${wd}/${year.name}`)
            for (const day of fs.readdirSync(`${wd}/${year.name}`)) {
                if (day.endsWith(".js")) {
                    console.log(`------- running ${year.name}/${day} -----------`)
                    const {stdout, stderr} = await execP(`node ${day}`)
                    console.log(stdout, stderr)
                }
            }
        }
    }
} else {
    console.log(`Usage:
\tnode run.js newDay 2023 04
or:
\tnode run.js test`)
}
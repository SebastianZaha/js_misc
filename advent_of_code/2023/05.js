const example = `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
    expectP1 = 35,
    expectP2 = 46

function parseInput(input) {
    let seeds, currentMap, maps = []

    input.trim().split('\n').forEach(line => {
        line = line.trim()
        if (line === '') return

        if (line.includes("seeds:")) {
            seeds = splitStrToInts(line.split(':')[1])
            return
        }
        if (line.includes("map:")) {
            if (currentMap) {
                console.assert(currentMap.length > 0, `maps should not be empty (happened on line ${line})`)
                maps.push(currentMap)
            }
            currentMap = []
            return
        }
        const mapEntry = splitStrToInts(line)
        console.assert(mapEntry.length === 3, `map entries should contain 3 numbers, got ${mapEntry}`)
        currentMap.push(mapEntry)
    })
    console.assert(currentMap.length > 0, `maps should not be empty (happened on last map)`)
    maps.push(currentMap)

    return [seeds, maps]
}

function findLocationForSeed(maps, seed) {
    return maps.reduce((val, map) => {
        for (let i = 0; i < map.length; i++) {
            if ((val >= map[i][1]) && (val < map[i][1] + map[i][2])) {
                return map[i][0] + val - map[i][1]
            }
        }
        return val
    }, seed)
}

function part1(input) {
    let [seeds, maps] = parseInput(input)

    let min = findLocationForSeed(maps, seeds[0])
    for (let i = 1; i < seeds.length; i++) {
        const l = findLocationForSeed(maps, seeds[i])
        if (l < min) min = l;
    }
    return min;
}


function part2(input) {
    let [seeds, maps] = parseInput(input)
    let min = findLocationForSeed(maps, seeds[0])

    for (let i = 0; i < seeds.length; i += 2) {
        console.log(`seed ${i}`)
        for (let j = 0; j < seeds[i+1]; j++) {
            const l = findLocationForSeed(maps, seeds[i] + j)
            if (l < min) min = l;
        }
    }

    return min
}

import {run, splitStrToInts} from '../util.js'
run("05", example, expectP1, expectP2, part1, 662197086, part2, 52510809)
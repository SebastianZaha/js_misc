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
        currentMap.push({dstStart: mapEntry[0], srcStart: mapEntry[1], length: mapEntry[2]})
    })
    console.assert(currentMap.length > 0, `maps should not be empty (happened on last map)`)
    maps.push(currentMap)

    return [seeds, maps]
}

function findLocationForSeed(maps, seed) {
    return maps.reduce((val, map) => {
        for (let i = 0; i < map.length; i++) {
            if ((val >= map[i].srcStart) && (val < map[i].srcStart + map[i].length)) {
                return map[i].dstStart + val - map[i].srcStart
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

// make sure map covers the entire range of ints
function normalizeMap(map) {
    map.sort((a, b) => a.srcStart - b.srcStart)

    if (map[0].srcStart > 0) map.splice(0, 0, {srcStart: 0, dstStart: 0, length: map[0].srcStart})
    for (let i = 1; i < map.length; i++) {
        const prevEnd = map[i-1].srcStart + map[i-1].length
        if (map[i].srcStart > prevEnd)
            map.splice(i, 0, {srcStart: prevEnd, dstStart: prevEnd, length: map[i].srcStart - prevEnd})
    }
}

function inRange(val, range) {
    return ((val >= range.srcStart) && (val < range.srcStart + range.length))
}

function composeMapFunc(start, end, map) {
    const ranges = []

    for (let i = 0; i < map.length; i++) {
        if (inRange(start, map[i])) {
            const startOffset = start - map[i].srcStart
            if (inRange(end, map[i])) {
                ranges.push({srcStart: start, length: end - start, dstStart: map[i].dstStart + startOffset})
                return ranges
            }
            const newRangeLength = map[i].length - startOffset
            ranges.push({srcStart: start, length: newRangeLength, dstStart: map[i].dstStart + startOffset})
            start = start + newRangeLength
        }
    }

    // end was outside of last range
    ranges.push({srcStart: start, dstStart: start, length: end - start})

    return ranges
}

function part2(input) {
    let [seeds, maps] = parseInput(input)
    maps.forEach(m => normalizeMap(m))

    let inputRanges = []
    for (let i = 0; i < seeds.length; i+=2) {
        inputRanges.push({start: seeds[i], end: seeds[i] + seeds[i+1]})
    }

    for (let i = 0; i < maps.length; i++) {
        let nextInputRanges = []
        for (let j = 0; j < inputRanges.length; j++) {
            composeMapFunc(inputRanges[j].start, inputRanges[j].end, maps[i]).forEach(range => {
                nextInputRanges.push({start: range.dstStart, end: range.dstStart + range.length})
            })
        }

        inputRanges = nextInputRanges
    }

    return inputRanges.reduce((min, current) => min < current.start ? min : current.start)
}

import {run, splitStrToInts} from '../util.js'
run("05", example, expectP1, expectP2, part1, 662197086, part2, 52510809)
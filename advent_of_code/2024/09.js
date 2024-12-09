import * as assert from "node:assert";

const example = `2333133121414131402`,
    expectP1 = 1928,
    expectP2 = 2858,
    resultP1 = 6241633730082,
    resultP2 = 6265268809555

// blockStart * fileId + (blockStart + 1) * fileId + ... + (blockStart + length - 1) * fileId
function checksum(fileId, blockStart, length) {
    return fileId * (length * blockStart + length * (length - 1) / 2)
}

assert.equal(0, checksum(0, 0, 2))
assert.equal(45, checksum(9, 2, 2))

function fileIdAt(diskMapIndex) {
    return Math.floor(diskMapIndex / 2)
}

function part1(input) {
    let diskMap = input.trim().split('').map(c => parseInt(c)),
        head = 0,
        tail = diskMap.length -1,
        chk = 0,
        diskIdx = 0

    while (head <= tail) {
        let fileBlocks = diskMap[head]

        chk += checksum(fileIdAt(head), diskIdx, fileBlocks)
        diskIdx+= fileBlocks

        // free space, fill from back
        head++
        let freeBlocks = diskMap[head]
        while (freeBlocks > 0 && tail > head) {
            fileBlocks = diskMap[tail]
            if (fileBlocks > freeBlocks) {
                diskMap[tail] = fileBlocks - freeBlocks
                chk += checksum(fileIdAt(tail), diskIdx, freeBlocks)
                diskIdx += freeBlocks
                break
            } else {
                // write however much we have, move the tail, and try to fill it again
                chk += checksum(fileIdAt(tail), diskIdx, fileBlocks)
                diskIdx += fileBlocks
                freeBlocks -= fileBlocks
                tail -= 2
                if (tail < head) return chk
            }
        }
        head++
    }
    return chk
}

function part2(input) {
    let diskMap = input.trim().split('').map(c => parseInt(c)),
        moved = Array(diskMap.length).fill(false),
        head = 0,
        tail = diskMap.length -1,
        chk = 0,
        diskIdx = 0

    // 2 3  3  3  13  3  12 14   14   13  14   2
    // 00...111...2...333.44.5555.6666.777.888899
    while (head <= tail) {
        let fileBlocks = diskMap[head]
        if (!moved[head]) chk += checksum(fileIdAt(head), diskIdx, fileBlocks)
        diskIdx+= fileBlocks

        // free space, fill from back but only with entire file
        head++
        let freeBlocks = diskMap[head]
        let scanTail = tail
        while (freeBlocks > 0 && scanTail > head) {
            fileBlocks = diskMap[scanTail]
            if ((fileBlocks > freeBlocks) || (moved[scanTail])) {
                scanTail -= 2
            } else {
                // write however much we have, move the tail, and try to fill it again
                chk += checksum(fileIdAt(scanTail), diskIdx, fileBlocks)
                diskIdx += fileBlocks
                freeBlocks -= fileBlocks
                moved[scanTail] = true
                if (scanTail === tail) tail -= 2
                if (tail < head) return chk
                scanTail -= 2
            }
        }
        diskIdx += freeBlocks // can't fill these, leave empty and move on
        head++
    }
    return chk
}

import {run} from '../util.js'
run("09", example, expectP1, expectP2, part1, resultP1, part2, resultP2)
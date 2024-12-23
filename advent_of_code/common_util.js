// Usage
// const pause = new Pause();
//
// async function myFunction() {
//     console.log('Started');
//     await pause.wait();
//     console.log('Resumed 1');
//     await pause.wait();
//     console.log('Resumed 2');
// }
//
// // Button handler
// function onButtonClick() {
//     pause.resume();
// }
export class Pause {
    constructor() {
        this.resolve = null;
    }

    async wait() {
        return new Promise(resolve => {
            this.resolve = resolve;
        });
    }

    resume() {
        if (this.resolve) {
            this.resolve();
            this.resolve = null;
        }
    }
}

export function getOrSet(map, key, val) {
    if (map.has(key)) {
        return map.get(key)
    } else {
        map.set(key, val)
        return val
    }
}

/*
const highestCommonDenominator = (x, y) => {
    const [min, max] = x < y ? [x, y] : [y, x]

    for (let i = min; i > 1 ; i--) {
        if ((x % i === 0) && (y % i === 0)) return i
    }
    return 1
}

const factorize = (n) => {
    let f = [], curr = n

    for (let i = 2; i <= Math.sqrt(curr) ; i++) {
        if (curr % i === 0) {
            f.push(i)
            curr = curr / i
            i--
        }
    }
    if (curr !== 1) f.push(curr)
    return f
}
 */
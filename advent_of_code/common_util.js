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

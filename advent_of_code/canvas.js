
export class MatrixRenderer {
    constructor(cell, ctx, w, h) {
        this.cell = cell
        this.ctx = ctx
        this.ctx.canvas.width = w * this.cell
        this.ctx.canvas.height = h * this.cell

    }

    drawBg(i, j, color) {
        this.ctx.fillStyle = color || "red"
        this.ctx.fillRect(j*this.cell, i * this.cell, this.cell, this.cell)
    }

    drawTxt(i, j, txt) {
        this.ctx.fillStyle = "black"
        this.ctx.fillText(txt, j*this.cell, (i+1) * this.cell)
    }

    clear() {
        this.ctx.fillStyle = 'white'
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

}

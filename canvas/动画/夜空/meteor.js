class Meteor {
    constructor(ctx, x, h) {
        this.ctx = ctx;
        this.x = x; // 流星初始点
        this.y = 0; // 流星初始点
        this.h = h; // 高度 canvas.height
        this.vx = -(4 + Math.random() * 4); // x 轴速度
        this.vy = -this.vx; // y 轴速度
        this.len = Math.random() * 300 + 40; // 流星长度
    }
    draw() {
        // 径向渐变，从流星头尾圆心，半径越大，透明度越高
        let gra = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.len);
        gra.addColorStop(0, 'rgba(255,255,255,1)');
        gra.addColorStop(1, 'rgba(0,0,0,0)');
        this.ctx.save();
        this.ctx.fillStyle = gra;
        this.ctx.beginPath();
        //流星头，二分之一圆
        this.ctx.arc(this.x, this.y, 1, Math.PI / 4, 5 * Math.PI / 4);
        //绘制流星尾，三角形
        this.ctx.lineTo(this.x + this.len, this.y - this.len);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }
    // 判定流星出界
    flow() {
        if (this.x < -this.len || this.y > this.h + this.len) {
            return false
        }
        this.x += this.vx
        this.y += this.vy
        return true
    }
}
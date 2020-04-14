class Star {
    constructor(ctx, width, height, total) {
        this.ctx = ctx;
        this.width = width; // canvas width
        this.height = height; // canvas height
        this.stars = this.setStar(total); // 数组 stars
    }
    // 生成星星数据
    setStar(total) {
        let stars = [];
        for (let i = 0; i < total; i++) {
            let star = {
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                r: Math.random() + 0.5,
            }
            stars.push(star)
        }
        return stars
    }
    // 绘制
    draw() {
        this.ctx.fillStyle = '#fff';
        this.ctx.save();
        this.stars.forEach((star) => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
            this.ctx.fill();
        });
        this.ctx.restore();
    }
    // 闪烁，变换r
    flash() {
        this.stars.forEach((star) => {
            let sign = Math.random() > 0.5 ? 1 : -1;
            star.r += sign * 0.2; // 半径变大变小
            if (star.r < 0) {
                star.r = -star.r;
            } else if (star.r > 1) {
                star.r -= 0.2;
            }
        })
    }
}
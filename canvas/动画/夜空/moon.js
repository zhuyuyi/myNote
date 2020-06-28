class Moon {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }
    draw(r = 40, R = 500) {
        // context.createRadialGradient(x0,y0,r0,x1,y1,r1);
        // x0	渐变的开始圆的 x 坐标
        // y0	渐变的开始圆的 y 坐标
        // r0	开始圆的半径
        // x1	渐变的结束圆的 x 坐标
        // y1	渐变的结束圆的 y 坐标
        // r1	结束圆的半径
        let gradient = this.ctx.createRadialGradient(200, 200, 40, 200, 200, 500);
        //径向渐变
        gradient.addColorStop(0, 'rgb(255,255,255)');
        gradient.addColorStop(0.01, 'rgb(70,70,80)');
        gradient.addColorStop(0.2, 'rgb(40,40,50)');
        gradient.addColorStop(0.4, 'rgb(20,20,30)');
        gradient.addColorStop(1, 'rgb(0,0,10)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
}
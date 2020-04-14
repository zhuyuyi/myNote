/**
 * @水印
 * @param {string} text 展示文字
 * @param {number} deg 角度
 * @param {number or string} fontSize 文字大小
 * @param {object} _config 其他配置项
 * @param {function} callback 回调
 */
export function drawWaterMask(text = '你好', deg = 30, fontSize = 24, _config, callback) {
    const config = {
        fontWeight: _config.fontWeight || 'bold', // 加粗
        fontFamily: _config.fontFamily || '黑体', // 字体
        fillStyle: _config.fillStyle || 'rgba(0,0,0,0.1)', // 背景色
        canvasWidth: _config.canvasWidth || 500, // canvas 宽
        canvasHeight: _config.canvasHeight || 500, // canvas 高
        textPostionX: _config.textPostionX || 80, // 文字位置 x轴
        textPostionY: _config.textPostionY || 20, // 文字位置 y轴
        zIndex: _config.zIndex || 999, // 层叠等级
        showDouble: _config.showDouble || false // 是否增加水印密度
    }

    const body = document.querySelector('body');

    const waterMarkDiv = document.createElement('div'); // 渲染水印的 div
    waterMarkDiv.style.width = `${window.innerWidth}px`;
    waterMarkDiv.style.height = `${window.innerHeight}px`;
    waterMarkDiv.style.position = 'absolute';
    waterMarkDiv.style.top = 0;
    waterMarkDiv.style.left = 0;
    waterMarkDiv.style.zIndex = 999;

    const canvas = document.createElement('canvas');
    canvas.width = config.canvasWidth;
    canvas.height = config.canvasHeight;
    canvas.style.display = 'none';

    body.append(canvas);

    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
    ctx.font = `${fontSize}px ${config.fontWeight} ${config.fontFamily}`; // '24px bold 黑体'
    ctx.fillStyle = config.fillStyle // 'rgba(0,0,0,0.1)'
    ctx.rotate((deg * Math.PI) / 180);
    ctx.fillText(text, config.textPostionX, config.textPostionY);
    if (config.showDouble) {
        ctx.fillText(text, config.textPostionX + config.canvasWidth / 2, config.textPostionY + 100);
    }
    // 回调
    if (callback) {
        callback()
    }
    waterMarkDiv.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`;
    body.append(waterMarkDiv);
}

// ---------------------------------------------示例------------------------------------------------- //
// https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toDataURL
// const config = {
//     fontSize: 30,
//     fontWeight: 'bold',
//     fontFamily: '黑体',
//     fillStyle: 'rgba(0,0,0,0.2)',
//     canvasWidth: 500,
//     canvasHeight: 500,
//     textPostionX: 80,
//     textPostionY: 20,
//     zIndex: 999
// }

// drawWaterMask('车300伽马风控', 40, '24', config)
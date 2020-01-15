// 水印
export function drawWaterMask(canvasId, waterMarkDiv, text = '车300伽马风控') {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 400, 400);
    ctx.font = 'bold 24px 黑体';
    ctx.fillStyle = 'rgba(0,0,0,0.1)';

    ctx.rotate((30 * Math.PI) / 180);
    ctx.fillText(text, 40, 20);
    ctx.fillText(text, 300, 150);

    ctx.font = 'bold 28px 黑体';

    let body = document.getElementById(waterMarkDiv);
    body.style.backgroundImage = 'url(' + cw.toDataURL('image/png') + ')';
}
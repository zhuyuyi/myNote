/**
 * @return Promise 压缩图片
 * @param {Object} file 文件对象
 * @param {String} type 图片类型 默认：image/jpeg、image/png...
 */
export function zipPic(file, type = 'image/jpeg') {
    return new Promise(resolve => {
        // 压缩图片需要的一些元素和对象
        let reader = new FileReader();
        let img = new Image();
        reader.readAsDataURL(file);
        // 文件base64化，以便获知图片原始尺寸
        reader.onload = function (e) {
            img.src = e.target.result;
        };
        // base64地址图片加载完毕后执行
        img.onload = function () {
            // 缩放图片需要的canvas
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            // 图片原始尺寸
            let originWidth = img.width;
            let originHeight = img.height;
            // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
            let maxWidth = 700,
                maxHeight = 700;
            // 目标尺寸
            let targetWidth = originWidth,
                targetHeight = originHeight;
            // 图片尺寸超过600x600的限制
            if (originWidth > maxWidth || originHeight > maxHeight) {
                if (originWidth / originHeight > maxWidth / maxHeight) {
                    // 更宽，按照宽度限定尺寸
                    targetWidth = maxWidth;
                    targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                } else {
                    // 更高，按照高度限定尺寸
                    targetHeight = maxHeight;
                    targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                }
            }
            // canvas对图片进行缩放
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            // 异步方法 Bolb对象
            canvas.toBlob(
                blob => {
                    // 重新转为 正常的 File 对象 让 antd Upload 接收
                    let newFile = new File([blob], file.name, { type: file.type });
                    newFile.uid = file.uid;
                    resolve(newFile);
                },
                type,
                0.98 // 图片质量
            );
        };
    });
}
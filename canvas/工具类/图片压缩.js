/**
 * @return Promise 压缩图片
 * @param {Object} file 文件对象
 * @param {String} type 图片类型 默认：image/jpeg、image/png...
 * @param {String} _maxWidth 图片最大宽  默认 700
 * @param {String} _maxHeight 图片最大高  默认 700
 * @param {String} quality 图片质量 0-1
 */
export function zipPic(file = [], type = 'image/jpeg', _maxWidth = 700, _maxHeight = 700, quality = 0.92) {
    return new Promise((resolve, reject) => {
        if (file.length === 0 || typeof type !== 'string' || typeof _maxWidth !== 'number' || typeof _maxHeight !== 'number' || typeof quality !== 'number') {
            return reject(true)
        }
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
            let maxWidth = _maxWidth,
                maxHeight = _maxHeight;
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
                quality // 图片质量
            );
        };
    });
}
// https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toBlob

// new File([blob], file.name, { type: file.type });

// （1）.array：必需，一个数组，用来存储File对象的内容，数组元素可以是二进制对象或者字符串。

// （2）.name：必需，规定文件的名字。

// （3）.options：可选，一个配置对象，用来设置File对象内容的相关特征，具有两个属性：

// type：字符串，规定File内容的MIME 类型。

// lastModified：一个时间戳，规定File文件上次修改的时间，默认值是Date.now() 。

// File 对象具有五个属性和一个方法，具体如下：

// （1）.name：字符串，表示文件名称。

// （2）.size：数字，表示文件的大小，规定的是文件字节的数目。

// （3）.type：字符串，表示文件的MIME类型，如果无法辨别类型，则为空字符串，只读属性。

// （4）.lastModified：数字，表示文件的上次被修改的时间，时间戳。

// （5）.lastModifiedDate：字符串，文件的上次修改时间。


// （6）.slice() ：可以在原有File对象基础上生成一个新的File对象，通过此方法可以实现文件分段上传。


// 特别说明：此对象继承自Blob对象，size、type和slice()是继承自Blob，剩余属性是自己扩展。

// 代码实例如下：代码分析如下：

// （1）.第一个数组规定file文件的内容，是一个字符串。

// （2）.文件的名称为ant.txt。

// （3）.文件内容是纯文本格式。



// Blob的英文全称是Binary Large Object，翻译成汉语是二进制大型对象。

// HTML5中，Blob是一种JavaScript数据类型，用于存储二进制数据。

// 此对象中存储的数据没有必要非得是JavaScript原生格式数据，也就是没必要是JavaScript内部对象。

// 比如可以是File对象，它继承Blob对象，并扩展了一些功能。

// let blob = new Blob(array, options);
// 参数解析：

// （1）.array：必需，数组，数组成员可以是二进制对象或者字符串。

// （2）.options：可选，对象，用于设置数组中数据的MIME类型。


// slice()方式：

// 此方法是Blob对象实例方法，通过它可以基于原始的Blob对象，创建一个新的Blob对象。

// blob.slice(start，end, contentType)
// 参数解析：

// （1）.start：可选，默认值为0，规定开始拷贝二进制数据的位置，以字节计数。

// （2）.end：可选，默认值为Blob对象的size属性值，但是此值不在拷贝范围之内，以字节计数。

// （3）.contentType：可选，默认值为空，规定新Blob对象的类型。

// 特别说明：

// （1）.start和end参数用于规定拷贝的范围。

// （2）.start和end参数值可以是负数，如果是负数，表示从数据的结尾开始计数，0表示数据的第一个字节，那么很自然 - 1就是数据的倒数第一个字节，两个参数负数的原理是一致的。
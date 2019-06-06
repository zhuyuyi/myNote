const fs = require('fs');

async function deleteFs(fsName) {
    let dir = await readDir(fsName);
    if (!dir) {
        return
    } else {
        for (let i = 0; i < dir.length; i++) {
            let stats = await stat(fsName + '/' + dir[i]);
            if (stats.isDirectory()) {
                await deleteFs(fsName + '/' + dir[i])
            } else {
                await delFile(fsName + '/' + dir[i])
            }
        }
    }
    await delDir(fsName)
}

function readDir(fsName) {
    return new Promise((resolve, inject) => {
        fs.readdir(fsName, (err, files) => {
            if (err) {
                console.log(err);
                return;
            } else {
                resolve(files)
            }
        })
    })
}

function stat(pathname) {
    return new Promise((resolve, inject) => {
        fs.stat(pathname, (err, files) => {
            if (err) {
                console.log(err);
                return;
            }
            resolve(files)
        })
    })
}

function delDir(fsName) {
    return new Promise((resolve, reject) => {
        fs.rmdir(fsName, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            resolve('删除文件')
        });
    })
}

function delFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('suc');
            resolve('删除空文件夹')
        });
    })
}

deleteFs('D:/学习文件夹/node/www')
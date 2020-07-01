import * as qiniu from 'qiniu-js';

export function uploadFileToQiNiu(file: File, key: string, token: string,) {
    const observable = qiniu.upload(file, key, token, {}, {
        useCdnDomain: true,
        region: qiniu.region.z1
    })
    observable.subscribe({
        next(res) {
            console.log(res)
        },
        error(err) {
            console.log(err)
        },
        complete(res) {
            console.log(res)
        }
    }) // 上传开始

}
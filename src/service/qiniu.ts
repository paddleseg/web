import * as qiniu from 'qiniu-js';
import axios from './request';
import * as httpvariable from '../utils/http'
import * as fs from 'fs'

export function downFile(url: string, name: string) {
    axios.get(url).then(e => {
        fs.createWriteStream(name)
    })
}

export function tellServerFileName(name: string, model: string) {
    return axios.post(httpvariable.CDNFILENAME + model, name)
}

export function getAuploadToken() {
    return axios.get(httpvariable.CDNTOKEN)
}

export function getPredictionFile(src: string) {
    return axios.post(httpvariable.CDNPREFILENAME, src)
}

export function uploadFileToQiNiu(file: File, key: string, token: string,) {
    qiniu.compressImage(file, {
        quality: 0.5,
        noCompressIfLarger: true,
        // maxWidth: 1024,
        // maxHeight: 800,
    }).then(data => {
        const observable = qiniu.upload(<File>data.dist, key, token, {}, {
            useCdnDomain: true,
            region: qiniu.region.z1,
            checkByMD5: true,
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
        })
    })
    // 上传开始

}
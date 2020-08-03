import * as qiniu from 'qiniu-js';
import axios from './request';
import * as httpvariable from '../utils/http'
import * as fs from 'fs'

export function downFile(url: string, name: string) {
    axios.get(url).then(e => {
        fs.createWriteStream(name)
    })
}

export function tellServerFileName(name: string, model: string, rotate: number) {
    let body = {
        'name': name,
        'rotate': rotate,
    }

    return axios.post(httpvariable.CDNFILENAME + model, body)
}

export function getAuploadToken() {
    return axios.get(httpvariable.CDNTOKEN)
}

export function getPredictionFile(src: string) {
    return axios.post(httpvariable.CDNPREFILENAME, src)
}

export function uploadFileToQiNiu(file: File, key: string, token: string,) {
    const observable = qiniu.upload(file, key, token, {}, {
        useCdnDomain: true,
        region: qiniu.region.z1,
        checkByMD5: true,
    })

    observable.subscribe({
        next(res) {
            // console.log(res.uploadInfo.)
            // const url = qiniu.imageMogr2({
            //     "auto-orient": true,      // 布尔值，是否根据原图EXIF信息自动旋正，便于后续处理，建议放在首位。
            //     strip: false,              // 布尔值，是否去除图片中的元信息
            // }, key, 'cdn.iimg.devexp.cn')
            // console.log(url)
        },
        error(err) {
            console.log(err)
        },
        complete(res) {
            // console.log(res)
        }
    })

}

export function getImageCountInCDN() {
    return axios.get(httpvariable.CDNIMAGECOUNT)
}
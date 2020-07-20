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
    const observable = qiniu.upload(file, key, token, {}, {
        useCdnDomain: true,
        region: qiniu.region.z1,
        checkByMD5: true,
    })

    observable.subscribe({
        next(res) {
            // console.log(res.uploadInfo?.url)
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
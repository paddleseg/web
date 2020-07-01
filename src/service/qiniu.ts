import * as qiniu from 'qiniu-js';
import axios from './request';
import { Http2ServerRequest } from 'http2';

export function getAuploadToken() {
    return axios.get('http://127.0.0.1/cdn/token')
    // axios.get('http://127.0.0.1/cdn/token').then(e => {
    //     if (e.status === 200) {
    //         console.log(e.data)
    //         return e.data
    //     }
    // }).catch(e => { return e })
}

export function uploadFileToQiNiu(file: File, key: string, token: string,) {
    const observable = qiniu.upload(file, key, token, {}, {
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
    }) // 上传开始

}
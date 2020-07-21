// export const DOMAIN = 'http://127.0.0.1:8000'
var _DOMAIN = 'http://127.0.0.1:8000'

if (process.env.NODE_ENV === 'production') {
    _DOMAIN = 'https://ai.devexp.cn/service'
}

export const DOMAIN = _DOMAIN
export const CDNTOKEN = DOMAIN + '/cdn/token'
export const CDNFILENAME = DOMAIN + '/cdn/upload/'
export const CDNPREFILENAME = DOMAIN + '/prediction/result'
export const CDNIMAGECOUNT = DOMAIN + '/prediction/count'


export const CLASSIC_MODEL = 'classic'
export const CUSTOM_MODEL = 'custom'
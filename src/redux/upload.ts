import { Dispatch } from "redux";
import { UPLOAD_FILE_TO_QINIU, STAGE_START, STAGE_END } from '../utils/actions';
import { uploadFileToQiNiu, getAuploadToken, tellServerFileName, getPredictionFile, downFile } from "../service/qiniu";

type Action = {
    type: string,
    hasError: boolean,
    error: string,
    payload: any,
    stage: string,
}

type State = Readonly<{
    uploading: boolean;
    predictionfile: string,
}>


const initalState: State = {
    uploading: false,
    predictionfile: "",
}

export function downfileFromCDN(url: string, file: string) {
    return async (dispath: Dispatch) => {
        try {
            downFile(url, file)
        } catch (e) {
            console.log(e)
        }
    }
}

export function uploadFile(file: File, key: string) {
    return async (dispath: Dispatch) => {
        // 标记上传开始
        dispath({
            type: UPLOAD_FILE_TO_QINIU,
            stage: STAGE_START,
        })

        try {
            // await 上传
            getAuploadToken().then(async e => {
                // console.log(e.data)
                await uploadFileToQiNiu(file, key, e.data)
                tellServerFileName(key).then(e => {
                    dispath({
                        type: UPLOAD_FILE_TO_QINIU,
                    })
                    let timer = setInterval(() => {
                        getPredictionFile(key).then(
                            e => {
                                if (e.status === 200) {
                                    dispath({
                                        type: UPLOAD_FILE_TO_QINIU,
                                        stage: STAGE_END,
                                        payload: e.data,
                                    })
                                    clearInterval(timer)
                                }
                            }
                        ).catch(e => {
                            clearInterval(timer)
                            dispath({
                                type: UPLOAD_FILE_TO_QINIU,
                                hasError: true,
                                error: e,
                            })
                        })
                    }, 2000)
                }).catch(e => {
                    dispath({
                        type: UPLOAD_FILE_TO_QINIU,
                        hasError: true,
                        error: e,
                    })
                })
            }).catch(e => {
                dispath({
                    type: UPLOAD_FILE_TO_QINIU,
                    hasError: true,
                    error: e,
                })
            })
        } catch (e) {
            dispath({
                type: UPLOAD_FILE_TO_QINIU,
                hasError: true,
                error: e,
            })
        }

    }
}

export default function (state = initalState, action: Action) {
    switch (action.type) {
        case UPLOAD_FILE_TO_QINIU:
            switch (action.stage) {
                case STAGE_START:
                    return {
                        ...state,
                        uploading: true,
                        error: action.error,
                    }
                case STAGE_END:
                    return {
                        ...state,
                        uploading: false,
                        predictionfile: action.payload,
                    }
                default:
                    if (action.hasError) {
                        return {
                            ...state,
                            uploading: false,
                            error: action.error,
                        }
                    }
                    return {
                        ...state,
                        uploading: true,
                    }
            }




        default:
            return state
    }
}
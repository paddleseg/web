import { Dispatch } from "redux";
import { UPLOAD_FILE_TO_QINIU } from '../utils/actions';
import { uploadFileToQiNiu, getAuploadToken } from "../service/qiniu";

type Action = {
    type: string;
    error: string,
    payload: any;
}

type State = Readonly<{
    uploading: boolean;
}>


const initalState: State = {
    uploading: false
}

export function uploadFile(file: File, key: string) {
    return async (dispath: Dispatch) => {
        // 标记上传开始

        try {
            // await 上传
            getAuploadToken().then(async e => {
                console.log(e.data)
                await uploadFileToQiNiu(file, key, e.data)
                dispath({
                    type: UPLOAD_FILE_TO_QINIU,
                })
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            dispath({
                type: UPLOAD_FILE_TO_QINIU,
                error: e,
            })
        }

    }
}

export default function (state = initalState, action: Action) {
    switch (action.type) {
        case UPLOAD_FILE_TO_QINIU:
            return {
                ...state,
                uploading: false,
                error: action.error,
            }
        default:
            return state
    }
}
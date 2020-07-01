import originAxios from 'axios';

const axios = originAxios.create(
    {
        timeout: 20000
    }
)

axios.interceptors.response.use(
    function (response) {
        return Promise.resolve(response);
    },
    function (error) {
        return Promise.reject(error);
    }
);

export function get(url: string, data: any) {
    return axios.get(url)
}

export function post(url: string) {
    return axios({
        method: 'post',
        url,
    })
}

export default axios
import axios from 'axios';

// axios.defaults.baseUrl = 'http://localhost:8081/api';
// axios.defaults.timeout = 5000;
//
// axios.interceptors.request.use(config => {
//
//         config.headers['Content-Type'] = 'application/json; charset=UTF-8'
//         return config;
//     },
//     err => {
//         return Promise.reject(err);
//     });
//
// axios.interceptors.response.use(res => {
//         return res.data
//     },
//     err => {
//         return Promise.reject(err);
//     });
//
// export default axios;

export function requestPromise(config) {
    // 相当于返回了一个Promise对象
    return new Promise((resolve, reject) => {
        let instance = axios.create({
            // baseURL: 'http://localhost:8081',
            timeout: 5000
        });
        // 这里相当于传统过程中只有ajax情况下处理success，和reject 分别
        // 对应了向下传值和报错
        instance(config)
            .then(res => {
                resolve(res);
            }).catch(err => {
            reject(err);
        })
    })
}

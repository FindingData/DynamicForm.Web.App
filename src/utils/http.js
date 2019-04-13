import axios from 'axios'
import router from '../router'
import {Message,MessageBox} from 'element-ui'

axios.defaults.timeout=5000
// axios.defaults.baseURL=''
// axios.defaults.withCredentials = true
/**
 * 网络请求错误分类
 */
const ErrType = { 请求错误: 0, 授权过期: 1, 地址出错: 2, 请求超时: 3, 服务器内部错误: 4, 接口返回错误: 5, 未知错误: 6 }
//======================请求和响应的拦截========================================
//请求拦截
axios.interceptors.request.use(
    config => {
        config.headers['X-Requested-With'] = 'XMLHttpRequest'
        return config
    },
    err => {
        console.log(err)
        requestErrHandle({ msg: '错误的请求', errType: ErrType.请求错误 })
    }
)
//响应拦截
axios.interceptors.response.use(
    response => {
        return response
    },
    err => {
        console.log(err.response)
        return {
            data: {
                Status: false,
                Message: requestErrHandle(errorResponseHandle(err.response)),
                Result: null
            }
        }
    }
)
/**
 *请求返回的错误处理
 * @param {object} response
 */
function errorResponseHandle(response) {
    let message = ''
    let errType = ErrType.请求错误
    switch (response.status) {
        case 400:
            message = '请求无效'
            errType = ErrType.请求错误
            break

        case 401:
            message = '您的授权已过期，请重新登录'
            errType = ErrType.授权过期
            break

        case 404:
            message = `请求地址出错: ${err.response.config.url}`
            errType = ErrType.地址出错
            break

        case 408:
            message = '请求超时，请尝试重新获取'
            errType = ErrType.请求超时
            break

        case 500:
            message = '服务器内部错误，请联系技术人员'
            errType = ErrType.服务器内部错误
            break

        default:
            message = '未知错误，请刷新页面后尝试重新获取'
            errType = ErrType.未知错误
    }
    return { msg: message, errType: errType }
}

/**
 * 错误消息处理
 * @param err
 * @returns {string}
 */
function requestErrHandle(err) {
    let errType = ''
    for (let pro in ErrType) {
        if (ErrType[pro] === err.errType) {
            errType = pro
        }
    }
    return errType + ':' + err.msg
}


/**
 * GET请求
 action:请求的接口地址
 params:请求带的参数
 aborted:请求失败或执行结果为false的回调函授
 * @param {string} action
 * @param {object} params
 * @param {function} aborted
 */
export function get(action, params, aborted) {
    return axios.get(action, { params: params }).then(res => {
        return resCheck(res.data, aborted)
    })
}
/**
 * POST请求
 action:请求的接口地址
 params:请求带的参数
 aborted:请求失败或执行结果为false的回调函授
 * @param {string} action
 * @param {object} params
 * @param {function} aborted
 */
export function post(action, params, aborted) {
    return axios.post(action, params).then(res => {
        return resCheck(res.data, aborted)
    })
}
/**
 *检查接口返回的数据是否成功
 data:接口返回的数据
 aborted:请求失败或执行结果为false的回调函授
 * @param {object} data
 * @param {function} aborted
 */
function resCheck(data, aborted) {
    return new Promise((resolve, reject) => {
        if (data.Status) {
            resolve(data.Result)
        } else {
            if (data.Message.split(':')[0] === '授权过期') {
                MessageBox.confirm(data.Message,'信息确认',{
                    confirmButtonText:'重新登录',
                    cancelButtonText:'取消',
                    type:'error'
                }).then(()=>{
                    router.replace({path:'/'})
                }).catch(()=>{
                    Message({
                        type:'warning',
                        message:'授权已过期，请重新登录'
                    })
                })
            } else {
                Message({
                        type:'error',
                        message:data.Message
                })
            }
            if (typeof (aborted) === 'function') {
                aborted()
            }
            // reject(data.Message)
        }
    })
}

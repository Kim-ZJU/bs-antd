/**
 * 接口请求模块
 */
import ajax from './ajax'
const BASE_URL = '/api'
//注册接口
export const reqRegister = (user) => ajax(BASE_URL + '/register', user, 'POST')
//登录接口
export const reqLogin = ({ username, password}) => ajax(
    BASE_URL + '/login', { username, password }, 'POST')
//验证是否登录
export const reqIsLogin = () => ajax(BASE_URL + '/isLogin')
//退出登录
export const reqLoginOut = () => ajax(BASE_URL + '/loginout')
//创建设备
export const reqCreateDevice = (device) => ajax(BASE_URL + 'createDevice', device, 'POST')
//修改设备信息
export const reqModifyDevice = ({deviceId, deviceAttr, attrValue}) => ajax(
    BASE_URL + '/modifyDevice', {deviceId, deviceAttr, attrValue}, 'POST')
//获取设备列表
export const reqDeviceList = () => ajax(BASE_URL  + '/deviceList')
//获取单个设备上报信息
export const reqDeviceMsg = ({deviceId}) => ajax(BASE_URL + '/getDeviceMsg', {deviceId}, 'POST')
//获取所有上报数据数量
export const reqMsgNumber = () => ajax(BASE_URL + '/getMessageNumber')
//获取所有上报的数据
export const reqMessages = () => ajax(BASE_URL + '/getMessages')


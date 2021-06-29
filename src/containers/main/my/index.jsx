/**
 * 设备配置页面
 */
import React, { Component } from 'react'
import {
  NavBar,
  InputItem,
  WingBlank,
  List,
  Button,
  Toast,
  Modal,
  Picker
} from 'antd-mobile'
import {reqIsLogin, reqLoginOut, reqCreateDevice, reqModifyDevice} from '../../../api'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
const alert = Modal.alert
const deviceAttrs = [
  {label: '设备ID', value: 'deviceId'},
  {label: '设备名称', value: 'deviceName'},
  {label: '设备数据', value: 'value'}
]
@inject('store')
@observer
class My extends Component {
  @observable loginInfo = {}
  @observable loginOutInfo = {}
  @observable proxyUrl = ''
  @observable DeviceInfo = {}
  @observable newDeviceInfo = {}
  @observable modifyDeviceInfo = {}
  @observable deviceIdErrorMsg = ''
  @observable deviceNameErrorMsg = ''
  @observable deviceAttrErrMsg = ''
  @observable attrValueErrMsg = ''
  constructor(props) {
    super(props)
    this.proxyUrl = props.store.proxy
    this.reqIsLogin()
    this.initData()
  }

  // 初始化设备信息
  initData = () => {
    this.DeviceInfo = {
      deviceId: '',
      deviceName: '',
    }
    this.modifyDeviceInfo = {
      deviceId: '',
      deviceAttr: '',
      attrValue: ''
    }
  }

  // 更新登录信息
  reqIsLogin = async () => {
    const res = await reqIsLogin()
    this.loginInfo = res.data
  }

  // 去登录
  toLogin = () => {
    this.props.history.replace(`/login?url=${this.props.match.url}`)
  }

  //  操作成功提示
  successToast = info => {
    Toast.success(info.msg, 1, () => {
      this.reqIsLogin()
    })
  }

  // 退出提醒
  reqLoginOut = () => {
    alert('退出', '您确定要退出么?', [
      { text: 'Cancel', onPress: () => console.log('cancel') },
      {
        text: 'Ok',
        onPress: async () => {
          const res = await reqLoginOut()
          this.loginOutInfo = res.data
          this.successToast(this.loginOutInfo)
        }
      }
    ])
  }

  // 创建设备
  createDevice = async DeviceInfo => {
    const { deviceId, deviceName } = DeviceInfo
    if (!deviceId) {
      this.deviceIdErrorMsg = "设备ID不能为空！"
    } else if (!deviceName) {
      this.deviceNameErrorMsg = "设备名称不能为空！"
    } else {
      reqCreateDevice({deviceId, deviceName}).then(res => {
        this.newDeviceInfo = res.data
        if (res.data.code === 0) {
          Toast.success(this.newDeviceInfo.msg, 1)
        } else {
          this.deviceNameErrorMsg = this.newDeviceInfo.msg
        }
      })
    }
  }

  // 修改设备信息
  modifyDevice = async ModifyDeviceInfo => {
    const { deviceId, deviceAttr, attrValue } = ModifyDeviceInfo
    if (!deviceId) {
      this.deviceIdErrorMsg = "设备ID不能为空！"
    } else if (!deviceAttr) {
      this.deviceAttrErrMsg = "请选择设备属性！"
    } else if (!attrValue) {
      this.attrValueErrMsg = "设备属性不能为空！"
    } else {
      reqModifyDevice({deviceId, deviceAttr, attrValue}).then(res => {
        this.modifyDeviceInfo = res.data
        if (res.data.code === 0) {
          Toast.success(this.modifyDeviceInfo.msg, 1)
        } else {
          this.attrValueErrMsg = this.modifyDeviceInfo.msg
        }
      })
    }
  }

  // 处理输入数据的改变: 更新对应的状态
  handleChange = (name, val) => {
    // 更新状态
    this.deviceIdErrorMsg = ''
    this.deviceNameErrorMsg = ''
    this.deviceAttrErrMsg = ''
    this.DeviceInfo[name] = val
    this.modifyDeviceInfo[name] = val
  }

  // 处理选中属性
  onChangeAttr = (name, attr) => {
    this.modifyDeviceInfo[name] = attr[0]
    this.setState({ pickerValue: attr })
  }

  // 设备选中状态
  state = {
    picked: false,
  }

  render() {
    const style = {
      marginTop: '10px',
      marginLeft: '105px',
      fontSize: '17px',
      color: 'red'
    }
    return (
      <div>
        <NavBar mode="dark">我的</NavBar>
        {this.loginInfo.code === 1 ? (
          <div className="loginState">
            {this.loginInfo.msg}
            <WingBlank>
              <Button type="primary" onClick={this.toLogin}>
                登录
              </Button>
            </WingBlank>
          </div>
        ) : (
          <div align="middle">
            <br/>
            <NavBar className="modify_device">
              创建设备
            </NavBar>
            <br/>
            <List>
              <InputItem
                  clear
                  placeholder="填写设备ID"
                  onChange={val => {
                    this.handleChange('deviceId', val)
                  }}
              >ID</InputItem>
              {this.deviceIdErrorMsg ? (
                  <div style={style}>{this.deviceIdErrorMsg}</div>
              ) : (
                  ''
              )}
              <InputItem
                  clear
                  placeholder="填写设备名称"
                  onChange={val => {
                    this.handleChange('deviceName', val)
                  }}
                  ref={el => this.inputRef = el}
              >名称</InputItem>
              {this.deviceNameErrorMsg ? (
                  <div style={style}>{this.deviceNameErrorMsg}</div>
              ) : (
                  ''
              )}
              <WingBlank>
                <Button onClick={() => this.createDevice(this.DeviceInfo)}>
                  提交
                </Button>
              </WingBlank>
            </List>
            <br/>
            <NavBar className="modify_device">
              修改设备信息
            </NavBar>
            <br/>
            <List>
              <InputItem
                  clear
                  placeholder="请填写要修改的设备ID"
                  onChange={val => {
                    this.handleChange('deviceId', val)
                  }}
                  ref={el => this.inputRef = el}
              >设备ID</InputItem>
              {this.deviceIdErrorMsg ? (
                  <div style={style}>{this.deviceIdErrorMsg}</div>
              ) : (
                  ''
              )}
              <Picker
                  data={deviceAttrs}
                  cols={1}
                  value={this.state.pickerValue}
                  onChange={attr => {this.onChangeAttr('deviceAttr', attr)}}
              >
                <List.Item arrow="horizontal">请选择设备属性</List.Item>
              </Picker>
              {this.deviceAttrErrMsg ? (
                  <div style={style}>{this.deviceAttrErrMsg}</div>
              ) : (
                  ''
              )}
              <InputItem
                  clear
                  placeholder="请填写要修改后的设备属性值"
                  onChange={val => {
                    this.handleChange('attrValue', val)
                  }}
                  ref={el => this.inputRef = el}
              >设备属性</InputItem>
              {this.attrValueErrMsg ? (
                  <div style={style}>{this.attrValueErrMsg}</div>
              ) : (
                  ''
              )}
              <WingBlank>
                <Button onClick={() => this.modifyDevice(this.modifyDeviceInfo)}>
                  提交
                </Button>
              </WingBlank>
            </List>
            <WingBlank>
              <Button type="warning" onClick={this.reqLoginOut}>
                退出登录
              </Button>
            </WingBlank>
          </div>
        )}
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </div>
    )
  }
}

export default My

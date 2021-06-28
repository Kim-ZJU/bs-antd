/*
注册的路由组件
 */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import {
  List,
  InputItem,
  WhiteSpace,
  Button,
  Toast,
  NavBar,
  Icon
} from 'antd-mobile'
import { reqRegister } from '../../api'

@inject('store')
@observer
class Register extends Component {
  @observable userInfo = {}
  @observable usernameErrorMsg = ''
  @observable passwordErrorMsg = ''
  @observable emailErrorMsg = ''
  constructor(props) {
    super(props)
    this.initData()
  }
  initData = () => {
    this.userInfo = {
      username: '', // 用户名
      password: '', // 密码
      email: ''
    }
  }
  successToast = () => {
    Toast.success('注册成功,正在进入!!!', 1, () => {
      this.props.history.push(this.props.location.search.split('=')[1]) //返回上一页
    })
  }
  // 点击注册调用
  register = async userInfo => {
    const { username, password, email } = userInfo
    if (!username) {
      this.usernameErrorMsg = '用户名不能为空！'
    } else if (!password) {
      this.passwordErrorMsg = '密码不能为空！'
    } else if (!email) {
      this.emailErrorMsg = '邮箱不能为空！'
    } else {
      reqRegister({ username, password, email }).then(res => {
        if (res.data.code === 0) {
          this.successToast()
        } else {
          this.emailErrorMsg = res.data.msg
        }
      })
    }
  }

  // 处理输入数据的改变: 更新对应的状态
  handleChange = (name, val) => {
    // 更新状态
    this.usernameErrorMsg = ''
    this.passwordErrorMsg = ''
    this.emailErrorMsg = ''
    this.userInfo[name] = val // 属性名不是name, 而是name变量的值
  }

  toLogin = () => {
    this.props.history.replace(`/login${this.props.location.search}`)
  }
  toBack = () => {
    this.props.history.replace(`/login${this.props.location.search}`)
  }
  render() {
    // 如果redirectTo有值, 就需要重定向到指定的路由
    const style = {
      marginTop: '10px',
      marginLeft: '105px',
      //marginRight: '100px',
      fontSize: '17px',
      color: 'red'
    }
    return (
      <div>
        <NavBar
          mode="dark"
          leftContent={<Icon type="left" onClick={this.toBack} />}
        >
          注册
        </NavBar>
        <List>
          <WhiteSpace />
          <InputItem
            placeholder="请输入用户名"
            onChange={val => {
              this.handleChange('username', val)
            }}
          >
            用户名:
          </InputItem>
          {this.usernameErrorMsg ? (
            <div style={style}>{this.usernameErrorMsg}</div>
          ) : (
            ''
          )}
          <WhiteSpace />
          <InputItem
            placeholder="请输入密码"
            type="password"
            onChange={val => {
              this.handleChange('password', val)
            }}
          >
            密&nbsp;&nbsp;&nbsp;码:
          </InputItem>
          {this.passwordErrorMsg ? (
            <div style={style}>{this.passwordErrorMsg}</div>
          ) : (
            ''
          )}
          <WhiteSpace />
          <InputItem
            placeholder="请输入邮箱"
            type="email"
            onChange={val => {
              this.handleChange('email', val)
            }}
          >
            邮&nbsp;&nbsp;&nbsp;箱:
          </InputItem>
          <div style={style}>{this.emailErrorMsg}</div>
          <WhiteSpace />
          <Button type="primary" onClick={() => this.register(this.userInfo)}>
            注&nbsp;&nbsp;&nbsp;册
          </Button>
          <WhiteSpace />
          <Button onClick={this.toLogin}>已有账户,去登录</Button>
        </List>
      </div>
    )
  }
}

export default Register

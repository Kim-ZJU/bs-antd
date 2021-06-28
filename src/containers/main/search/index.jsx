import React, { Component } from 'react'
import { NavBar, Button } from "antd-mobile";
import {  Select, message, Card } from 'antd'
import 'antd/dist/antd.css';
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { reqIsLogin, reqDeviceList, reqDeviceMsg  } from '../../../api'

const { Option } = Select;

@inject('store')
@observer
class Search extends Component {
  @observable loginInfo = {}
  @observable proxyUrl = ''
  @observable messageNumber = 0
  constructor(props) {
    super(props)
    this.proxyUrl = props.store.proxy
    this.reqIsLogin()
    this.getDeviceList()
  }
  reqIsLogin = async () => {
    const res = await reqIsLogin()
    this.loginInfo = res.data
  }
  timestampToTime = timestamp => {
    return new Date(parseFloat(timestamp)).toLocaleString()
  }
  toLogin = () => {
    this.props.history.replace(`/login?url=${this.props.match.url}`)
  }

  // 获取设备列表
  getDeviceList = async () => {
    const res = await reqDeviceList()
    const result = res.data.content
    let deviceList = []
    if (res.data.code === 0) {
      if (!result) {
        message.info("返回错误！", 1)
      } else {
        result.forEach((r) => {
          deviceList.push({
            value: r.deviceId,
            text: r.deviceId
          })
        })
        this.setState({devices: deviceList})
      }
    } else {
      message.info(res.data.msg, 1)
    }
  }

  // 获取选中设备上报的所有数据
  getDeviceMessages = async ({deviceId}) => {
    const res = await reqDeviceMsg({deviceId})
    const result = res.data.content
    let messages = []
    let iter = 0
    if (res.data.code === 0) {
      if (!result) {
        message.info("返回错误！", 1)
      } else {
        this.messageNumber = result.length
        result.forEach((r) => {
          messages.push({
            index: iter++,
            alert: "告警："+r.alert.toString(),
            lng: "经度："+r.lng.toString(),
            lat: "纬度："+r.lat.toString(),
            timestamp: "时间戳："+this.timestampToTime(r.timestamp),
            value: "数据："+r.value.toString(),
            data: "信息："+r.info,
          })
        })
        //console.log(messages)
        this.setState({deviceMessages: messages})
      }
    } else {
      message.info(res.data.msg, 1)
    }
  }

  // get selection as selected option
  state = {
    devices: [],
    deviceMessages: [],
    value: undefined
  }

  // handle select change
  handleChange = value => {
    this.setState({ value });
    this.getDeviceMessages({deviceId: value})
  };

    render() {

    const options = this.state.devices.map(d => <Option key={d.value}>{d.text}</Option>);
    const cardGrids = this.state.deviceMessages.map(
        c => <Card.Grid className="gridStyle" key={c.index}>
          <p>{c.alert}</p>
          <p>{c.lng}</p>
          <p>{c.lat}</p>
          <p>{c.timestamp}</p>
          <p>{c.value}</p>
          <p>{c.data}</p>
        </Card.Grid>)
    const messageNum = "共"+this.messageNumber.toString()+"条上报数据"

    return (
      <div>
        <NavBar>查询统计</NavBar>
        {this.loginInfo.code === 1 ? (
          <div className="loginState">
            {this.loginInfo.msg}
              <Button type="primary" onClick={this.toLogin}>
                登录
              </Button>
          </div>
        ) : (
            <div>
              <br/>
              <Select
                  defaultValue={'请选择您要查询的设备'}
                  className="select-style"
                  showArrow={true}
                  value={this.state.value}
                  onChange={this.handleChange}
              >
                {options}
              </Select>
              <Card className="messageNum-style" bordered={false}>
                {messageNum}
              </Card>
              <Card title="上报数据总览" className="card-style">
                {cardGrids}
              </Card>
              <br/>
              <br/>
              <br/>
            </div>
        )}
      </div>
    )
  }
}

export default Search

/**
 * 图表展示页面
 */
import React, { Component } from 'react'
import { Button, NavBar } from 'antd-mobile'
import ReactEcharts  from 'echarts-for-react';
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import { reqIsLogin, reqDeviceList, reqMsgNumber} from '../../../api'
import {Card, Row, Col, message} from "antd";
@inject('store')
@observer
class HomePage extends Component {
  @observable proxyUrl = ''
  @observable loginInfo = {}
  constructor(props) {
    super(props)
    this.proxyUrl = props.store.proxy
    this.reqIsLogin()
    this.getSummaryData()
  }

  reqIsLogin = async () => {
    const res = await reqIsLogin()
    this.loginInfo = res.data
  }

  toLogin = () => {
    this.props.history.replace(`/login?url=${this.props.match.url}`)
  }

  //获取统计信息
  getSummaryData = async () => {
    const res = await reqDeviceList()
    const result = res.data.content
    let deviceNumber = 0, alertDevices = 0, onlineDevices = 0
    if (res.data.code === 0) {
      if (!result) {
        message.info("返回错误！", 1)
      } else {
        deviceNumber = res.data.content.length
        result.forEach(r => {
          if (r.alert === true) {
            alertDevices++
          }
          if (r.online === true) {
            onlineDevices++
          }
        })
      }
    } else {
      message.info(res.data.msg, 1)
    }
    const res1 = await reqMsgNumber()
    let msgNumber = res1.data.content
    this.setState({deviceNum: deviceNumber, onlineDevice: onlineDevices, alertDevice: alertDevices, msgNum: msgNumber })
    let option = {
      xAxis: {
        type: 'category',
        data: ['设备总量', '在线总量', '接受数据量']
      },
      yAxis: {
        type: 'value'
      },
      grid: {
        left: '1%',
        right: '4%',
        bottom: '2%',
        top:'2%',
        containLabel: true
      },
      series: [{
        data: [this.state.deviceNum, this.state.onlineDevice, this.state.msgNum],
        type: 'line'
      }]
    }
    let option1 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '1%',
        right: '3%',
        bottom: '2%',
        top:'2%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['告警设备量', '正常运行量'],
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 0, //强制显示文字
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
        }
      ],

      series: [
        {
          name: '设备量',
          type: 'bar',
          barWidth: '30%',
          data: [this.state.alertDevice, this.state.deviceNum-this.state.alertDevice],
          itemStyle: {
            normal: {
              color: (params) => {
                let colorList = ['#c23531', '#749f83'];
                return colorList[params.dataIndex]
              }
            }
          }
        },

      ],
      triggerEvent: false // 设置为true后，可触发事件。实现x轴文字过长，显示省略号，hover上去显示全部的功能
    }
    this.setState({
      option: option,
      option1: option1
    })
  }

  state = {
    deviceNum: 0,
    onlineDevice: 0,
    msgNum: 0,
    alertDevice: 0,
    option: {},
    option1: {}
  }

  render() {
    return (
      <div>
        <NavBar>miniIoT Platform</NavBar>
        {this.loginInfo.code === 1 ? (
            <div className="loginState">
              {this.loginInfo.msg}
              <Button type="primary" onClick={this.toLogin}>
                登录
              </Button>
            </div>
        ) : (
            <div>
              <Card title="信息统计" className="card-style">
                <Card.Grid className="grid-style">
                  <ReactEcharts option={this.state.option} />
                </Card.Grid>
                <Card.Grid className="grid-style">
                  <ReactEcharts option={this.state.option1} />
                </Card.Grid>
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

export default HomePage

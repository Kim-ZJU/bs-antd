/**
 * 地图展示页面
 */
import React, { Component } from "react";
import {Button, NavBar} from "antd-mobile";
import { Map, Marker, Polyline } from 'react-amap';
import { message } from 'antd';
import {
  reqIsLogin,
  reqDeviceList,
  reqMessages,
} from "../../../api";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";

const mapKey = '3afe5ae5c0e716bf7949d2e2ab8371d0' // 从高德官网获取的地图钥匙

@inject("store")
@observer
class GaoDeMap extends Component {
  @observable loginInfo = {};
  @observable proxyUrl = "";
  constructor(props) {
    super(props);
    this.proxyUrl = props.store.proxy;
    this.reqIsLogin();
    this.showDevices();
  }

  reqIsLogin = async () => {
    const res = await reqIsLogin();
    this.loginInfo = res.data
  };

  toLogin = () => {
    this.props.history.replace(`/login?url=${this.props.match.url}`)
  }

  //获取设备信息
  showDevices = async () => {
    const res = await reqDeviceList()
    const res1 = await reqMessages()
    const result = res.data.content
    const result1 = res1.data.content
    let normalDeviceList = [], alertDeviceList = []
    if (res.data.code === 0) {
      if (!result) {
        message.info("暂时没有设备！", 1)
      } else {
        result.forEach((r) => {
          if (r.alert) {
            alertDeviceList.push({
              value: r.deviceId,
              lng: r.lng,
              lat: r.lat
            })
          } else {
            normalDeviceList.push({
              value: r.deviceId,
              lng: r.lng,
              lat: r.lat
            })
          }
          let path = []
          if (!result1) {
            message.info("暂时没有接受到数据！", 1)
          } else {
            result1.forEach(m => {
              if (m.clientId === r.deviceId) {
                path.push({
                  longitude: m.lng,
                  latitude: m.lat
                })
              }
            })
          }
          if(path.length) {
            this.state.devicePaths.push(path)
          }
        })
        this.setState({normalDevices: normalDeviceList, alertDevices: alertDeviceList})
        console.log(this.state.devicePaths)
      }
    } else {
      message.info(res.data.msg, 1)
    }
  }

  state = {
    normalDevices: [],
    alertDevices: [],
    devicePaths: []
  }

  //颜色对象
  Color() {
    let red = Math.floor(Math.random()*255);
    let green = Math.floor(Math.random()*255);
    let blue = Math.floor(Math.random()*255);
    let color = 'rgba('+ red +','+ green +','+ blue +',0.8)';
    return color;
  }

  render() {

    const alertStyle = {
      background: `url('http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png')`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      width: '30px',
      height: '40px',
      color: '#000',
      textAlign: 'center',
      lineHeight: '40px'
    }

    const markersNormal = this.state.normalDevices.map(d =>
        <Marker key={d.value} position={{longitude: d.lng, latitude: d.lat}}/>)

    const markersAlert = this.state.alertDevices.map(d =>
            <Marker key={d.index} position={{longitude: d.lng, latitude: d.lat}}>
              <div style={alertStyle}></div>
            </Marker>)
    const paths = this.state.devicePaths.map(d =>
        <Polyline key={d.value} path={d} showDir="true" style={{strokeColor: this.Color()}}/>)

    return (
      <div>
        <NavBar mode="dark">地图展示</NavBar>
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
              <h5 align="middle">红色为告警设备，蓝色为正常设备</h5>
              <br/>
              <div style={{ width: '100%', height: '400px', position: 'relative' }}>
                <Map amapkey={mapKey}>
                  {markersNormal}
                  {markersAlert}
                  {paths}
                </Map>
              </div>
              <br/>
              <br/>
              <br/>
            </div>
        )}
      </div>
    );
  }
}

export default GaoDeMap;

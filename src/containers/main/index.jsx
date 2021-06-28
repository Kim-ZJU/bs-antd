import React, { Component } from 'react'
import { Switch, Route, Redirect, NavLink } from 'react-router-dom'
import HomePage from './homePage'
import Search from './search'
import My from './my'
import GaoDeMap from "./gaodemap";
import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});

class Main extends Component {
    render() {

        return (
            <div>
                <div className="footer">
                    <NavLink to="/main/homepage" className="footer-icon">
                        <i className="iconfont icon-home"></i>
                        <p>首页</p>
                    </NavLink>
                    <NavLink to="/main/gaodemap" className="footer-icon">
                        <i className="iconfont icon-map"></i>
                        <p>地图</p>
                    </NavLink>
                    <NavLink to="/main/search" className="footer-icon">
                        <i className="iconfont icon-chayan"></i>
                        <p>查询</p>
                    </NavLink>
                    <NavLink to="/main/my" className="footer-icon">
                        <i className="iconfont icon-user"></i>
                        <p>我的</p>
                    </NavLink>
                </div>
                <Switch>
                    <Route path="/main/homepage" component={HomePage}></Route>
                    <Route path="/main/gaodemap" component={GaoDeMap}></Route>
                    <Route path="/main/search" component={Search}></Route>
                    <Route path="/main/my" component={My}></Route>
                    <Redirect exact from="/main" to="/main/homepage" />
                </Switch>
            </div>
        );
    }
}
export default Main
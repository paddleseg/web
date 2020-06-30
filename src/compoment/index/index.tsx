import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { withRouter, } from 'react-router-dom';
import { History, LocationState } from 'history'
import { RouteConfig } from 'react-router-config'
import TopBar from './topbar';

interface IndexPros {
    history: History<LocationState>
    route?: RouteConfig
}

class Index extends Component<IndexPros, {}>{

    componentWillMount() {
        // 可以判定当前用户是否需要登录
    }
    render() {
        const { route } = this.props

        return (
            <TopBar route={route} />
        )
    }
}

const mapStateToProps = (state: any) => ({

})
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
    {},
    dispatch
)

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(Index))
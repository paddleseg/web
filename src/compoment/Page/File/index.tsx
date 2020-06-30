import React, { Component } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Grid, Card, Button } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

// 首页文件上传
class IndexPage extends Component<{}, {}> {
    render() {
        return (
            <div style={{ marginTop: 100 }}>
                <Grid container justify="center">
                    <Card variant="outlined">
                        <div style={{ padding: '4rem 2rem', backgroundColor: 'rgba(180, 120, 118, 0.2)' }}>
                            <h1 className="display-4">Hello, world!</h1>
                            <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                            {/* <hr className="my-4"> */}
                            <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
                            <Grid container justify="center">
                                <Button variant="contained" color="primary" startIcon={<CloudUploadIcon />} >
                                    UPLOAD
                            </Button>
                            </Grid>
                        </div>
                    </Card>
                </Grid>
                <div style={{ margin: 50 }}>
                    <Grid container spacing={6} >
                        <Grid item xs={6} >
                            <Grid container justify="center">
                                <img style={{ width: '100%' }} src='https://material-ui.com/static/images/grid-list/breakfast.jpg' alt='breakfast' />
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container justify="center">
                                <img style={{ width: '100%' }} src='1.jpg' alt='breakfast' />
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: any) => ({

})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
    {},
    dispatch
)

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(IndexPage)
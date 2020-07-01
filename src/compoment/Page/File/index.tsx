import React, { Component } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom';
import { Grid, Card, Button, Typography, Input } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import 'fontsource-roboto'

import { uploadFile } from '../../../redux/upload';

interface uploadProps {
    onUpload: (file: File, key: string) => void
}

interface uploadState {
    uploading: boolean
    showImg: boolean
    srcImgFile: string
}

// 首页文件上传
class IndexPage extends Component<uploadProps, uploadState> {

    state = {
        showImg: false,
        uploading: false,
        srcImgFile: ''
    }

    _openFileDialog = () => {

        var fileUploadDom = ReactDOM.findDOMNode(this.refs.fileUpload);
        if (fileUploadDom) {
            (fileUploadDom as HTMLElement).click()
        }

    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.files);
        console.log(typeof (event.target.files))
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]); // read file as data url

            reader.onload = (event: any) => { // called once readAsDataURL is completed
                // this.state.srcImgFile = event.target.result;
                this.setState({
                    showImg: true,
                    srcImgFile: event.target.result,
                })
            }


        }

    };

    render() {
        console.log(this.state)
        let imgDiv;
        if (this.state.showImg) {
            imgDiv = (
                <Grid container spacing={6} >
                    <Grid item xs={6} >
                        <Grid container justify="center">
                            {/* <Typography variant="h4" component="h4" style={{ margin: 5 }}>
                                    原图
                                </Typography> */}
                            <img style={{ width: '100%' }} src={this.state.srcImgFile} alt='breakfast' />
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container justify="center">
                            {/* <Typography variant="h4" component="h4" style={{ margin: 5 }}>
                                    效果图
                                </Typography> */}
                            {/* <img style={{ width: '100%' }} src='https://material-ui.com/static/images/grid-list/breakfast.jpg
                                ' alt='breakfast' /> */}
                        </Grid>
                    </Grid>
                </Grid>
            )
        }
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
                                <Button variant="contained" color="primary" startIcon={<CloudUploadIcon />} onClick={this._openFileDialog} >
                                    UPLOAD
                                </Button>
                                <input id="myInput" onChange={this.handleChange} type="file" ref="fileUpload" style={{ display: 'none' }} />
                            </Grid>
                        </div>
                    </Card>
                </Grid>


                <div style={{ margin: 50 }}>
                    {imgDiv}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: any) => ({
    uploading: state.uploadActions.uploading,
    showImg: false,
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
    {
        onUpload: uploadFile
    },
    dispatch
)

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(IndexPage)
import React, { Component } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom';
import { Grid, Card, Button, LinearProgress } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import 'fontsource-roboto'

import { uploadFile } from '../../../redux/upload';

interface uploadProps {
    onUpload: (file: File, key: string) => void
    uploading: boolean,
    prediction: string
}

interface uploadState {
    showImg: boolean
    srcImgFile: string
    progress: number
    buffer: number

}


var interval: NodeJS.Timeout;
// 首页文件上传
class IndexPage extends Component<uploadProps, uploadState> {



    state = {
        showImg: false,
        srcImgFile: '',
        progress: 0,
        buffer: 0,
        // interval: setInterval(() => this.tick(), 1000)
    }

    componentDidMount = () => {
        // interval = setInterval(() => this.tick(), 1000);
    }

    _openFileDialog = () => {

        var fileUploadDom = ReactDOM.findDOMNode(this.refs.fileUpload);
        if (fileUploadDom) {
            (fileUploadDom as HTMLElement).click()
        }

    }


    tick() {
        if (this.state.progress > 100) {
            this.setState({
                progress: 0,
                buffer: 0,
            })

        } else {
            const diff = Math.random() * 10;
            const diff2 = Math.random() * 10;
            this.setState({
                progress: this.state.progress + diff,
                buffer: this.state.progress + diff + diff2,
            })
        }
    }


    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]); // read file as data url

            let f = event.target.files[0]
            let names = f.name.split('.')
            // let name = names[0] + '_' + (new Date().getTime()) + '.' + names[1]
            let d = new Date()
            let name = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${names[0]}-${d.getTime()}.${names[1]}`

            // console.log(name)
            reader.onload = (event: any) => { // called once readAsDataURL is completed
                this.setState({
                    showImg: true,
                    srcImgFile: event.target.result,
                })
            }

            this.props.onUpload(event.target.files[0], name)
            interval = setInterval(() => this.tick(), 1000);
        }

    };

    render() {
        // console.log(this.state, this.props)

        let imgDiv;
        let upload;

        if (this.props.uploading) {
            upload = (
                <div style={{ marginTop: '30%' }}>
                    <LinearProgress variant="buffer" value={this.state.progress} valueBuffer={this.state.buffer} />
                </div>
            )
        } else {
            if (this.props.prediction) {
                // this.setState({
                //     progress: 0,
                //     buffer: 0,
                // })
                this.state.progress = 0
                this.state.buffer = 0
                clearInterval(interval)
            }
            upload = (
                <Grid container justify="center">
                    <img style={{ width: '100%' }} src={this.props.prediction} alt='breakfast' />
                </Grid>
            )
        }
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
                        {upload}
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
    prediction: state.uploadActions.predictionfile,
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
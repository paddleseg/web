import React, { Component } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom';
import { Grid, Card, Button, LinearProgress, Typography, Paper, CardMedia, CardContent, CardActionArea, CardActions, CardHeader, IconButton } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import GetAppIcon from '@material-ui/icons/GetApp';

import 'fontsource-roboto'

import { uploadFile, downfileFromCDN } from '../../../redux/upload';

interface uploadProps {
    onUpload: (file: File, key: string) => void
    onDownload: (url: string, file: string) => void
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


    download = () => {
        var index = this.props.prediction.lastIndexOf("/") + 1;
        var filename = this.props.prediction.substr(index);
        fetch(this.props.prediction).then(res => res.blob().then(blob => {
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(blob);
            // var filename = filename;
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        }))
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
                this.state.progress = 0
                this.state.buffer = 0
                clearInterval(interval)
            }
            upload = (
                <Grid container justify="flex-start">
                    <Card>

                        <CardHeader
                            action={
                                <IconButton aria-label="download">
                                    {/* <GetAppIcon onClick={this.download} /> */}
                                    <GetAppIcon onClick={this.download} />
                                </IconButton>
                            }

                        />
                        <CardMedia
                            component="img"
                            alt="预测图"
                            image={this.props.prediction}
                            title="预测图"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h3" component="h2">
                                预测图
                                </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                图片背景已设置为透明背景,可点击右侧按钮完成下载
                                </Typography>
                        </CardContent>
                    </Card>
                    {/* <Paper elevation={3}>
                        <img style={{ width: '100%' }} src={this.props.prediction} alt='预测图片' />
                    </Paper> */}
                </Grid>
            )
        }
        if (this.state.showImg) {
            imgDiv = (
                <Grid container
                    direction="row"
                    justify="center"
                    alignItems="baseline" spacing={1} >
                    <Grid item xs={3} >
                        <Grid container justify="flex-end">
                            <Card>
                                <CardHeader
                                    action={
                                        <IconButton aria-label="settings">
                                            <FavoriteBorderIcon />
                                        </IconButton>
                                    }
                                />
                                <CardMedia
                                    component="img"
                                    alt="原图"
                                    image={this.state.srcImgFile}
                                    title="原图"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h3" component="h2">
                                        原图
                                        </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        为了提高深度学习质量，您的图片将会被作为学习数据集的一部分
                                        </Typography>
                                </CardContent>

                            </Card>
                            {/* <Paper elevation={3}>
                                <img style={{ width: '100%' }} src={this.state.srcImgFile} alt='原图' />
                            </Paper> */}
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        {upload}
                    </Grid>
                </Grid >
            )
        }
        return (
            <div style={{ marginTop: 100 }}>

                <Grid container justify="center">
                    <Card variant="outlined">
                        <div style={{ padding: '4rem 2rem', backgroundColor: 'rgba(180, 120, 118, 0.2)' }}>
                            <Grid container justify="center">
                                <div style={{ maxWidth: 500 }}>
                                    <Typography variant="h1" component="h2" gutterBottom>
                                        自动抠图
                                </Typography>
                                </div>
                            </Grid>

                            <Typography variant="subtitle1" gutterBottom>
                                点击上传图片选择想要处理的图片(.jpeg/.png格式). 目前仅支持处理带有人像的图片
                            </Typography>


                            <Grid container justify="center" style={{ marginTop: 30 }}>
                                <Button variant="contained" color="primary" startIcon={<CloudUploadIcon />} onClick={this._openFileDialog} >
                                    上传图片
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
        onUpload: uploadFile,
        onDownload: downfileFromCDN,
    },
    dispatch
)

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(IndexPage)
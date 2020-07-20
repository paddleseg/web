import React, { Component } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom';
import { Grid, Card, Button, LinearProgress, Typography, CardMedia, CardContent, CardHeader, IconButton, Snackbar, Paper, Zoom, Tooltip, Fab, CardActionArea } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import GetAppIcon from '@material-ui/icons/GetApp';
import Image from 'material-ui-image';
import 'fontsource-roboto'
import './index.css'
import CountUp from 'react-countup';

import { uploadFile, downfileFromCDN } from '../../../redux/upload';
import { CLASSIC_MODEL, CUSTOM_MODEL } from '../../../utils/http';

interface uploadProps {
    onUpload: (file: File, key: string, model: string) => void
    onDownload: (url: string, file: string) => void
    uploading: boolean,
    prediction: string
}

interface uploadState {
    showImg: boolean
    srcImgFile: string
    progress: number
    buffer: number
    disabled: boolean
    showAlert: boolean
    fileSizeTooLarge: boolean
    names: string[],
}

var interval: NodeJS.Timeout;
var f: File;
// 首页文件上传
class IndexPage extends Component<uploadProps, uploadState> {

    state = {
        showImg: false,
        srcImgFile: '',
        progress: 0,
        buffer: 0,
        disabled: true,
        showAlert: false,
        fileSizeTooLarge: false,
        names: [],
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

    handleClose = () => {
        this.setState({
            showAlert: false
        })
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]); // read file as data url

            f = event.target.files[0]
            if ((f.size / 1000 / 1000) > 10) {
                this.setState({
                    fileSizeTooLarge: true
                })
            } else {
                let names = f.name.split('.')
                // let d = new Date()
                // let name = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${names[0]}-${d.getTime()}.${names[1]}`

                // console.log(name)
                reader.onload = (event: any) => { // called once readAsDataURL is completed
                    this.setState({
                        showImg: true,
                        srcImgFile: event.target.result,
                    })
                }

                this.setState({
                    disabled: false,
                    showAlert: true,
                    names: names,
                    fileSizeTooLarge: false,
                })
            }



        }

    };

    classicModel = () => {
        let d = new Date()
        let names = this.state.names
        let name = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${names[0]}-${d.getTime()}.${names[1]}`
        this.props.onUpload(f, name, CLASSIC_MODEL)
        interval = setInterval(() => this.tick(), 1000);
    }

    customModel = () => {
        let d = new Date()
        let names = this.state.names
        let name = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${names[0]}-${d.getTime()}.${names[1]}`
        this.props.onUpload(f, name, CUSTOM_MODEL)
        interval = setInterval(() => this.tick(), 1000);
    }

    render() {
        let imgDiv;
        let upload;
        let cloudFileAlert;

        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            cloudFileAlert = (
                <div style={{ textAlign: 'center' }}>
                    <Typography variant="subtitle1" gutterBottom color='inherit'>
                        不支持读取云盘文件(例如icloud),请使用本地相册文件
                    </Typography>
                </div>
            )
        } else {
            cloudFileAlert = (<div></div>)
        }
        if (this.props.uploading) {
            upload = (
                <div style={{ marginTop: '30%' }}>
                    <LinearProgress variant="buffer" value={this.state.progress} valueBuffer={this.state.buffer} />
                </div>
            )
        } else {

            if (this.props.prediction.length > 0) {
                this.state.progress = 0
                this.state.buffer = 0
                clearInterval(interval)

                upload = (
                    <Zoom in={true} style={{ transitionDelay: '50ms' }}>
                        <Grid container justify="flex-start">
                            <Card style={{ margin: 'auto', borderRadius: 30, padding: 12 }}>

                                <CardHeader
                                    action={
                                        <IconButton aria-label="download">
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
                    </Zoom>
                )
            }
        }
        if (this.state.showImg) {
            imgDiv = (
                <div>
                    <Zoom in={true} style={{ transitionDelay: '500ms' }}>
                        <Grid container
                            direction="row"
                            justify="center"
                            alignItems="baseline" spacing={1} >
                            <Grid item xs={12} sm={6} >
                                <Grid container justify="flex-end">
                                    <Card raised style={{ margin: 'auto', borderRadius: 30, padding: 12 }}>
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
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {upload}
                            </Grid>
                        </Grid >
                    </Zoom>
                    {/* <div className='w' >
                        <div className='winBody'>
                            <img src='wx.png' style={{ 'width': '100px', 'height': '100px' }} />
                        </div>
                        <div className='t'>
                            <Typography component="p" variant="body2" gutterBottom align='left'>
                                遇到问题可扫描添加好友反馈
                        </Typography>
                        </div>
                    </div> */}
                </div>
            )
        }
        return (
            <div style={{ marginTop: 100 }}>
                <Snackbar open={this.state.showAlert} autoHideDuration={6000} onClose={this.handleClose}>
                    <MuiAlert elevation={6} variant="filled" severity="info" >
                        请选择抠图类型
                    </MuiAlert>
                </Snackbar>
                <Snackbar open={this.state.fileSizeTooLarge} autoHideDuration={6000} onClose={this.handleClose}>
                    <MuiAlert elevation={6} variant="filled" severity="error" >
                        暂不支持超过10M的图片!
                    </MuiAlert>
                </Snackbar>

                <Paper className='headblock' elevation={3}>
                    <Grid container justify="center" >
                        <div className='headGridBlock'>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={3} style={{ justifyContent: 'center', alignItems: 'center', display: '-webkit-flex' }}>
                                    <img src='ai-icon.svg'></img>
                                </Grid>

                                <Grid item xs={12} sm={9} >
                                    <div style={{ textAlign: 'left' }}>
                                        <Typography variant="h1" component="h1" gutterBottom color='inherit' style={{ marginTop: '10%', fontSize: 90, width: '100%', letterSpacing: '0.5rem' }}>
                                            AI抠图
                                            </Typography>
                                        <div style={{ marginTop: '10%', textAlign: 'left' }}>
                                            <Typography variant="subtitle1" gutterBottom color='inherit'>
                                                点击上传图片选择想要处理的图片(.jpeg/.png格式) 目前仅支持处理带有人像的图片
                                            </Typography>
                                            {/* <Typography variant="subtitle1" gutterBottom color='inherit'>
                                                目前仅支持处理带有人像的图片
                                            </Typography> */}
                                        </div>
                                        {cloudFileAlert}
                                    </div>
                                </Grid>
                            </Grid>

                            <div className='w' >
                                <div className='winBody'>
                                    <img src='wx.png' style={{ 'width': '100px', 'height': '100px' }} />
                                </div>
                                <div className='t'>
                                    <Typography component="p" variant="body2" gutterBottom align='left'>
                                        遇到问题可扫描添加好友反馈
                                    </Typography>
                                </div>
                            </div>
                            <Grid container justify="center" style={{ marginTop: 30 }}>
                                <Button variant="contained" color="primary" startIcon={<CloudUploadIcon />} onClick={this._openFileDialog} >
                                    上传图片
                                </Button>
                                <input id="myInput" onChange={this.handleChange} type="file" ref="fileUpload" style={{ display: 'none' }} accept=".jpg,.jpeg,.png" />
                            </Grid>

                        </div>
                    </Grid>
                </Paper>

                <Grid container spacing={1} direction="row" justify="flex-start" alignItems="center">
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3}>
                            <div className='countblock' >
                                <Grid item xs={12} sm={12}>
                                    {/* <Typography component="h1" variant="h1" gutterBottom align='center' > */}
                                    <div className='count'>
                                        处理
                                        <CountUp
                                            start={0}
                                            end={124}
                                            duration={1.75}
                                            // prefix=""
                                            // suffix=" "
                                            className='countNum'
                                        />
                                        张 预测
                                        <CountUp
                                            start={0}
                                            end={500}
                                            duration={2.75}
                                            // prefix=""
                                            // suffix=""
                                            className='countNum'
                                        />
                                         次图片
                                    </div>
                                    {/* </Typography> */}
                                </Grid>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3}>
                            <div className='menublock'>
                                <Grid container spacing={1} >
                                    <Grid item xs={6} sm={6} style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                                        <Tooltip title="从图片中找到属于人体的部分,并去除其它元素">
                                            <Button variant="outlined" color="primary" disabled={this.state.disabled} onClick={this.classicModel}>
                                                抠人像
                                </Button>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={6} sm={6} style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                                        <Tooltip title="从图片中找到属于人体范围内的元素,并去除背景元素">
                                            <Button variant="outlined" color="primary" disabled={this.state.disabled} onClick={this.customModel}>
                                                去背景
                                </Button>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>



                <div style={{ margin: 50 }}>
                    {imgDiv}
                </div>
            </div >
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
import React, { Component } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom';
import { Grid, Card, Button, LinearProgress, Typography, CardMedia, CardContent, CardHeader, IconButton, Snackbar, Paper, Zoom, Tooltip, } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import GetAppIcon from '@material-ui/icons/GetApp';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';

import 'fontsource-roboto'
import './index.css'
import CountUp from 'react-countup';
import FileSaver from 'file-saver';


import { uploadFile, downfileFromCDN, getImageCount } from '../../../redux/upload';
import { CLASSIC_MODEL, CUSTOM_MODEL } from '../../../utils/http';

interface uploadProps {
    onUpload: (file: File, key: string, model: string, rotate: number) => void
    onDownload: (url: string, file: string) => void
    onGetImageCount: () => void
    uploading: boolean,
    prediction: string,
    srcImageNum: number,
    preImageNum: number,
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
    rotate: number,
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
        rotate: 0,
    }

    componentWillMount = () => {
        this.props.onGetImageCount()
    }

    queryImageCount = () => {
        this.props.onGetImageCount()
    }
    // componentDidMount = () => {
    //     // interval = setInterval(() => this.tick(), 1000);

    // }

    _openFileDialog = () => {

        var fileUploadDom = ReactDOM.findDOMNode(this.refs.fileUpload);
        if (fileUploadDom) {
            (fileUploadDom as HTMLElement).click()
        }
    }


    download = () => {
        // var index = this.props.prediction.lastIndexOf("/") + 1;
        // var filename = this.props.prediction.substr(index);
        // fetch(this.props.prediction).then(res => res.blob().then(blob => {
        //     var a = document.createElement('a');
        //     var url = window.URL.createObjectURL(blob);
        //     // var filename = filename;
        //     a.href = url;
        //     a.download = filename;
        //     a.click();
        //     window.URL.revokeObjectURL(url);
        // }))
        var index = this.props.prediction.lastIndexOf("/") + 1;
        var filename = this.props.prediction.substr(index);
        FileSaver.saveAs(this.props.prediction, filename);
    }

    getOrientation = (file: Blob, callback: any) => {
        var reader = new FileReader();
        reader.onload = function (e) {
            if (e !== null) {

                var view = new DataView(e.target?.result as ArrayBufferLike);
                if (view.getUint16(0, false) !== 0xFFD8) {
                    return callback(-2);
                }
                var length = view.byteLength, offset = 2;
                while (offset < length) {
                    if (view.getUint16(offset + 2, false) <= 8) return callback(-1);
                    var marker = view.getUint16(offset, false);
                    offset += 2;
                    if (marker === 0xFFE1) {
                        if (view.getUint32(offset += 2, false) !== 0x45786966) {
                            return callback(-1);
                        }

                        var little = view.getUint16(offset += 6, false) === 0x4949;
                        offset += view.getUint32(offset + 4, little);
                        var tags = view.getUint16(offset, little);
                        offset += 2;
                        for (var i = 0; i < tags; i++) {
                            if (view.getUint16(offset + (i * 12), little) === 0x0112) {
                                return callback(view.getUint16(offset + (i * 12) + 8, little));
                            }
                        }
                    }
                    else if ((marker & 0xFF00) !== 0xFF00) {
                        break;
                    }
                    else {
                        offset += view.getUint16(offset, false);
                    }
                }

                return callback(-1);
            }
        };
        reader.readAsArrayBuffer(file);
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
            this.getOrientation(event.target.files[0], (e: number) => {
                let rotate = 0
                switch (e) {
                    case 1:
                        rotate = 0
                        break
                    case 8:
                        rotate = -90
                        break
                    case 3:
                        rotate = 180
                        break
                    case 6:
                        rotate = 90
                        break
                }
                this.setState({ rotate: rotate })
            })
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
        this.props.onUpload(f, name, CLASSIC_MODEL, this.state.rotate)
        interval = setInterval(() => this.tick(), 1000);
    }

    customModel = () => {
        let d = new Date()
        let names = this.state.names
        let name = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${names[0]}-${d.getTime()}.${names[1]}`
        this.props.onUpload(f, name, CUSTOM_MODEL, this.state.rotate)
        interval = setInterval(() => this.tick(), 1000);
    }

    render() {
        let imgDiv;
        let upload;
        let cloudFileAlert;

        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            cloudFileAlert = (
                <div style={{ marginTop: '2%', textAlign: 'left' }}>
                    <Typography variant="subtitle1" gutterBottom color='inherit'>
                        不支持读取云盘文件(例如icloud),请使用本地相册文件
                    </Typography>
                </div>
            )
        } else {
            cloudFileAlert = (<div style={{ marginTop: '10%', textAlign: 'left' }}></div>)
        }

        if (this.props.uploading) {

            upload = (
                // <div style={{ marginTop: '30%' }}>
                //     <LinearProgress variant="buffer" value={this.state.progress} valueBuffer={this.state.buffer} />
                // </div>
                <div>
                    <Grid container justify="flex-start">
                        <Card raised style={{ margin: 'auto', borderRadius: 30, padding: 12, width: 512, height: 512 }}>

                            <CardHeader
                                action={
                                    <IconButton aria-label="download">
                                        <HourglassEmptyIcon />
                                    </IconButton>
                                }

                            />
                            <CardContent style={{ flexGrow: 1 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <div style={{ padding: 2, textAlign: 'center', marginTop: '25%' }}>
                                            <CountUp
                                                start={0}
                                                end={130}
                                                duration={130}
                                                useEasing={false}
                                                className="countdown"
                                            />
                                        </div>

                                    </Grid>
                                </Grid>

                            </CardContent>
                        </Card>
                    </Grid>
                </div>
            )
        } else {
            if (this.props.prediction.length > 0) {
                this.state.progress = 0
                this.state.buffer = 0
                clearInterval(interval)
                this.queryImageCount()

                upload = (
                    // <Zoom in={true} style={{ transitionDelay: '50ms' }}>
                    <Grid container justify="flex-start">
                        <Card raised style={{ margin: 'auto', borderRadius: 30, padding: 12, maxWidth: 512 }}>

                            <CardHeader
                                action={
                                    <IconButton aria-label="download">
                                        {/* <GetAppIcon >
                                            <a href={this.props.prediction} download={this.props.prediction} />
                                        </GetAppIcon> */}
                                        <GetAppIcon onClick={this.download} />
                                    </IconButton>
                                }

                            />
                            <CardMedia
                                component="img"
                                alt="预测图"
                                image={this.props.prediction + '-ai'}
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
                    // </Zoom>
                )
            }
        }
        if (this.state.showImg) {
            imgDiv = (
                <div>

                    <Grid container
                        direction="row"
                        justify="center"
                        alignItems="baseline" spacing={1} >
                        <Zoom in={true} style={{ transitionDelay: '500ms' }}>
                            <Grid item xs={12} sm={6} >
                                <Grid container justify="flex-end">
                                    <Card raised style={{ margin: 'auto', borderRadius: 30, padding: 12, maxWidth: 512 }}>
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
                        </Zoom>
                        <Grid item xs={12} sm={6}>
                            {upload}
                        </Grid>
                    </Grid >

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
                                            {cloudFileAlert}
                                        </div>

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
                                    <Typography component="h3" variant="h3" style={{ color: '#ffffff' }}>
                                        上传图片
                                    </Typography>
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
                                            end={this.props.srcImageNum}
                                            duration={1.75}
                                            // prefix=""
                                            // suffix=" "
                                            className='countNum'
                                        />
                                        张 预测
                                        <CountUp
                                            start={0}
                                            end={this.props.preImageNum}
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
                                                <div className='buttonFont'>
                                                    抠人像
                                                </div>
                                            </Button>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={6} sm={6} style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                                        <Tooltip title="从图片中找到属于人体范围内的元素,并去除背景元素">
                                            <Button variant="outlined" color="primary" disabled={this.state.disabled} onClick={this.customModel}>
                                                <div className='buttonFont'>
                                                    去背景
                                                </div>
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
    srcImageNum: state.uploadActions.SrcImage,
    preImageNum: state.uploadActions.PreImage,
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
    {
        onUpload: uploadFile,
        onDownload: downfileFromCDN,
        onGetImageCount: getImageCount,
    },
    dispatch
)

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(IndexPage)
import React, { PureComponent } from 'react'
import { Upload, message, Button, Icon, Row, Col, List, Divider } from 'antd'
import { connect } from 'react-redux';
import { Player } from '../components'
import * as action from '../redux/action';

class HomePage extends PureComponent {
    constructor(props) {
        super(props)
        this.state = { isTest: false }
    }

    componentDidMount() {
        this.props.list()
    }

    onChange = (info) => {
        const { status, percent } = info.file
        if (percent === 100 && status === 'uploading') {
            message.info('Transcoding')
        } else if (status === 'done') {
            this.props.list()
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    onClickPlayBtn = (title, type) => {
        this.props.getStream(title, type)
    }


    onTest = () => {
        this.setState(prevState => { return { isTest: !prevState.isTest } })
    }

    render() {
        const { storage } = this.props
        const { list = {}, stream } = storage
        if (stream && stream.type == 'mv') {
        }
        return (
            <React.Fragment>
                <Button onClick={this.onTest}>Test</Button>
                <Upload
                    name='file'
                    accept="audio/*, video/*"
                    action="/upload"
                    onChange={this.onChange}
                >
                    <Button>
                        <Icon type="upload" /> Upload
                    </Button>
                </Upload>
                <Divider />
                <Row gutter={16}>
                    <Col span={4}>
                        <List
                            size="small"
                            header={<div>Video</div>}
                            bordered
                            rowKey="title"
                            dataSource={list.videos}
                            renderItem={video => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Button shape="circle" icon="play-circle" onClick={() => this.onClickPlayBtn(video.title, 'mv')} />}
                                        title={video.title}
                                        description={video.description}
                                    />
                                </List.Item>
                            )}
                        />

                        <Divider />
                        <List
                            size="small"
                            header={<div>Audio</div>}
                            bordered
                            rowKey="title"
                            dataSource={list.audios}
                            renderItem={audio => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Button shape="circle" icon="play-circle" onClick={() => this.onClickPlayBtn(audio.title, 'audio')} />}
                                        title={audio.title}
                                        description={audio.description}
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>
                    <Col span={20} style={{ alignContent: 'center' }}>
                        {
                            stream && stream.type == 'audio' ?
                                <video controls autoPlay name="media"><source src={stream.info.url} /></video>
                                : null
                        }

                        {/* {
                            stream && stream.type == 'mv' ?
                                <Player
                                    debug={true}
                                />
                                : null
                        } */}
                        {
                            this.state.isTest ?
                                <Player
                                    // src="https://s3.amazonaws.com/demos.transloadit.com/hlsdemo/my_playlist.m3u8"
                                    src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
                                />
                                : null
                        }
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

const mapState = state => {
    const { storage } = state;
    return { storage };
}

const actionCreators = {
    list: action.list,
    getStream: action.getStream
}

export default connect(mapState, actionCreators)(HomePage)
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Advertisement, Button, Divider, Form, Grid, Header, Icon, Message, Modal, Radio, Responsive, Segment } from 'semantic-ui-react/dist/commonjs';
import { actionCreators as fileActionCreators, possibleFormats } from '../store/File';
import { actionCreators as recordingActionCreators } from '../store/Recording';
import { actionCreators as resolutionActionCreators } from '../store/Resolution';
import { VideoStorage } from '../store/VideoStorage';
import config from '../config';

const cursorOptions = [
    { id: 'always', label: 'Always' },
    { id: 'motion', label: 'Motion' },
    { id: 'never', label: 'Never' }
]

class Record extends Component {
    state = { cursorOption: cursorOptions[0].id }
    handleSetCursorOption = (event, { value }) => this.setState({ cursorOption: value });
    handleSetFileFormat = (event, { value }) => this.props.fileActions.setFileFormat(value);

    checkBrowserSupport() {
        return window.MediaRecorder && (navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia);
    }

    setSupportedFeatures() {
        return navigator.mediaDevices.getSupportedConstraints();
    }

    componentDidMount() {
        // This method is called when the component is first added to the document
        this.props.recordingActions.setBrowserSupport(this.checkBrowserSupport());
    }

    componentDidUpdate() {
        // This method is called when the route parameters change
        //this.ensureDataFetched();
    }

    async _startScreenCapture() {
        const videoParams = true;

        if (navigator.getDisplayMedia) {
            return navigator.getDisplayMedia({ video: videoParams });
        } else if (navigator.mediaDevices.getDisplayMedia) {
            return navigator.mediaDevices.getDisplayMedia({ video: videoParams });
        }
    }

    _startCapturing = async () => {
        if (this.recording) {
            window.URL.revokeObjectURL(this.recording);
        }

        this.chunks = [];
        this.recording = null;

        this.props.recordingActions.consentDim(true);

        try {
            this.stream = await this._startScreenCapture();
        } catch (ex) {
            this.props.recordingActions.showError(ex.message);
            console.error(ex);
            return;
        } finally {
            this.props.recordingActions.consentDim(false);
        }

        this.props.recordingActions.startRecording();

        console.log('Start recording.');

        this.stream.addEventListener('inactive', e => {
            console.log('Stream recording inactive - stop recording!');
            this._stopCapturing(e);
        });
        this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: this.props.format });
        this.mediaRecorder.addEventListener('dataavailable', event => {
            //if (!this.recording) return;
            if (event.data && event.data.size > 0) {
                this.chunks.push(event.data);
            }
        });
        this.mediaRecorder.start(10);
    }

    _stopCapturing = async (e) => {
        if (!this.mediaRecorder) return;

        console.log('Stop recording.');
        this.props.recordingActions.stopRecording();

        const track = this.stream.getTracks()[0];
        const { width, height } = track.getSettings();
        this.props.resolutionActions.setWidth(width);
        this.props.resolutionActions.setHeight(height);

        this.mediaRecorder.stop();
        this.mediaRecorder = null;
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;

        const blob = new Blob(this.chunks, { type: this.props.format });
        VideoStorage.objectUrl = window.URL.createObjectURL(blob);
        VideoStorage.size = blob.size;
        VideoStorage.type = blob.type;

        this.props.fileActions.setFileAvailable(true);
        this.props.history.push('/replay');
    }

    render() {
        return (
            <div>
                <Grid centered>
                    <div>
                        <Grid.Column></Grid.Column>
                        <Header as='h1'>Record computer screen video online</Header>
                        <p>Free, fast &amp; easy video capture - no additional software required<br />
                            Works on PC with Windows, Mac, Linux, Chromebook OS and web browser</p>
                    </div>
                    <Grid.Row>
                        {this.props.showBrowserUnsupported &&
                            <Message negative>
                                <Message.Header>Browser not supported</Message.Header>
                                <p>
                                    Use Chrome or Firefox desktop browsers.<br />
                                    Mobile browsers currently not supported.
                                </p>
                            </Message>}

                        {this.props.errormessage &&
                            <Message negative>
                                <Message.Header>Error</Message.Header>
                                <p>{this.props.errorMessage}</p>
                            </Message>}
                    </Grid.Row>
                    {!this.props.showBrowserUnsupported &&
                        <Segment>
                            {config.showCursorOptions &&
                                <Grid.Row>
                                    <Form>
                                        <p>Show cursor</p>
                                        <Grid columns={3}>
                                            {cursorOptions.map(opt =>
                                                <Grid.Column key={opt.id}>
                                                    <Radio
                                                        label={opt.label}
                                                        name='cursorOptionId'
                                                        value={opt.id}
                                                        checked={opt.id === this.state.cursorOption}
                                                        onChange={this.handleSetCursorOption}
                                                    />
                                                </Grid.Column>)}
                                        </Grid>
                                    </Form>
                                </Grid.Row>}
                            {config.showVideoFormat &&
                                <Grid.Row>
                                    <Form>
                                        <Form.Select
                                            label='File format and video codec'
                                            placeholder='Select video format and codec'
                                            options={possibleFormats}
                                            onChange={this.handleSetFileFormat}
                                            value={this.props.format}
                                        />
                                    </Form>
                                </Grid.Row>}
                            <Divider />
                            <Grid.Row>
                                {this.props.enableStartCapture &&
                                    <Button
                                        icon
                                        fluid
                                        color='red'
                                        size='big'
                                        labelPosition='right'
                                        onClick={this._startCapturing}>
                                        <Icon name='record' />
                                        Start
                            </Button>}
                                {this.props.enableStopCapture &&
                                    <Button
                                        icon
                                        fluid
                                        color='orange'
                                        size='big'
                                        labelPosition='right'
                                        onClick={this._stopCapturing}>
                                        <Icon name='stop' />
                                        Stop
                            </Button>}
                            </Grid.Row>
                        </Segment>}
                    {config.showAds &&
                        <Grid.Row>
                            <Responsive {...Responsive.onlyComputer}>
                                <Advertisement unit='billboard' test='Computer Billboard' />
                            </Responsive>
                            <Responsive {...Responsive.onlyTablet}>
                                <Advertisement unit='netboard' test='Tablet Netboard' />
                            </Responsive>
                            <Responsive {...Responsive.onlyMobile}>
                                <Advertisement unit='small rectangle' test='Mobile Small Rectangle' />
                            </Responsive>
                        </Grid.Row>}
                </Grid>

                <Modal open={this.props.recordingConsentDim} basic size='tiny' centered={true}>
                    <Header as='h2' icon='info' content='Recording area and consent' />
                    <Modal.Content>
                        Please pick the area you want to record and allow the app to see it
                    </Modal.Content>
                </Modal>

            </div>
        );
    }
}
export default connect(
    state => ({ ...state.recording, ...state.resolution, ...state.file }),
    dispatch => ({
        fileActions: bindActionCreators(fileActionCreators, dispatch),
        recordingActions: bindActionCreators(recordingActionCreators, dispatch),
        resolutionActions: bindActionCreators(resolutionActionCreators, dispatch)
    })
)(Record);


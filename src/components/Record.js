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
    state = { cursorOption: cursorOptions[0].id, recordUserAudio: false }
    handleSetCursorOption = (event, { value }) => this.setState({ cursorOption: value });
    handleSetFileFormat = (event, { value }) => this.props.fileActions.setFileFormat(value);
    handleSetRecordUserAudio = (event, { checked }) => this.props.fileActions.setRecordMicrophoneAudio(checked);

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

    async _startDisplayCapture() {
        const videoParams = true;

        if (navigator.getDisplayMedia) {
            return navigator.getDisplayMedia({ video: videoParams });
        } else if (navigator.mediaDevices.getDisplayMedia) {
            return navigator.mediaDevices.getDisplayMedia({ video: videoParams });
        }
    }

    async _startUserMediaCapture() {
        const constraints = { audio: true, video: false };

        if (navigator.getUserMedia) {
            return new Promise((resolve, reject) => navigator.getUserMedia(constraints, resolve, reject));
        } else if (navigator.mediaDevices.getUserMedia) {
            return navigator.mediaDevices.getUserMedia(constraints);
        }
    }

    _startCapturing = async () => {
        if (this.recording) {
            window.URL.revokeObjectURL(this.recording);
        }

        this.chunks = [];
        this.recording = null;

        this.props.recordingActions.consentDim(true);

        if (this.props.recordMicrophoneAudio) {
            try {
                this.userStream = await this._startUserMediaCapture();
            } catch (ex) {
                this.props.recordingActions.showError(ex.message);
                console.error(ex);
                this.props.recordingActions.consentDim(false);
                return;
            }
        }

        try {
            this.displayStream = await this._startDisplayCapture();
        } catch (ex) {
            this.props.recordingActions.showError(ex.message);
            console.error(ex);
            return;
        } finally {
            this.props.recordingActions.consentDim(false);
        }

        console.log('Start recording.');
        this.props.recordingActions.startRecording();

        this.displayStream.addEventListener('inactive', e => {
            console.log('displayStream recording inactive - stop recording!');
            this._stopCapturing(e);
        });

        this.combinedStream = [this.displayStream.getTracks()[0]];
        if (this.userStream) {
            this.combinedStream.push(this.userStream.getTracks()[0]);
        }

        this.mediaStream = new MediaStream(this.combinedStream);
        this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType: this.props.format });

        this.mediaRecorder.addEventListener('dataavailable', event => {
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

        const track = this.displayStream.getTracks()[0];
        const { width, height } = track.getSettings();
        this.props.resolutionActions.setWidth(width);
        this.props.resolutionActions.setHeight(height);

        this.mediaRecorder.stop();
        this.mediaRecorder = null;
        this.displayStream.getTracks().forEach(track => track.stop());
        if (this.userStream) {
            this.userStream.getTracks().forEach(track => track.stop());
        }
        this.displayStream = null;
        this.userStream = null;

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
                    <Grid.Row>
                        <div>
                            <Header as='h1'>Record computer screen video online</Header>
                            <p>
                                Free, fast &amp; easy screen capture - no additional software download required<br />
                                Works on PC with Windows, Mac, Linux, Chromebook OS in web browser<br />
                                Privacy in mind - videos do not get uploaded and the app works offline
                        </p>
                        </div>
                    </Grid.Row>
                    <Grid.Row>
                        {this.props.showBrowserUnsupported &&
                            <Message negative>
                                <Message.Header>Browser not supported</Message.Header>
                                <p>
                                    Try Chrome, Firefox or Opera desktop browser.<br />
                                    Mobile browsers are currently not supported.
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
                            <Form>
                                {config.showCursorOptions &&
                                    <Grid columns={3}>
                                        <Grid.Row>Show cursor</Grid.Row>
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
                                    </Grid>}
                                {config.showVideoFormat &&
                                    <Form.Select
                                        label='File format and video codec'
                                        placeholder='Select video format and codec'
                                        options={possibleFormats}
                                        onChange={this.handleSetFileFormat}
                                        value={this.props.format}
                                    />}
                                {config.showMicrophoneAudio &&
                                    <Form.Checkbox
                                        label='Record microphone audio'
                                        disabled={this.props.enableStopCapture}
                                        onChange={this.handleSetRecordUserAudio}
                                        checked={this.props.recordMicrophoneAudio}
                                    />}
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
                            </Form>
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


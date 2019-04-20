import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Advertisement, Button, Form, Grid, Header, Icon, Message, Modal, Radio, Select } from 'semantic-ui-react/dist/commonjs';
import { actionCreators as fileActionCreators, possibleFormats } from '../store/File';
import { actionCreators as recordingActionCreators } from '../store/Recording';
import { actionCreators as resolutionActionCreators } from '../store/Resolution';
import { VideoStorage } from '../store/VideoStorage';

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
        return navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia || navigator.mediaDevices.getUserMedia;
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
        } else {
            return navigator.mediaDevices.getUserMedia({ video: { mediaSource: 'screen' } });
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

        const track = this.stream.getTracks()[0];
        const { width, height } = track.getSettings();
        this.props.resolutionActions.setWidth(width);
        this.props.resolutionActions.setHeight(height);

        this.props.recordingActions.startRecording();

        console.log('Start capturing.');

        this.stream.addEventListener('inactive', e => {
            console.log('Capture stream inactive - stop recording!');
            this._stopCapturing(e);
        });
        this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: this.props.format });
        this.mediaRecorder.addEventListener('dataavailable', event => {
            if (event.data && event.data.size > 0) {
                this.chunks.push(event.data);
            }
        });
        this.mediaRecorder.start(10);
    }

    _stopCapturing = async (e) => {
        this.props.recordingActions.stopRecording();
        if (this.mediaRecorder) {
            this.mediaRecorder.stop();
            this.mediaRecorder = null;
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        console.log('Stop capturing.');
        VideoStorage.objectUrl = window.URL.createObjectURL(new Blob(this.chunks, { type: this.props.format }));
        this.props.history.push('/replay');
    }

    render() {
        return (
            <div>
                <Grid centered>
                    {false && <Grid.Row>
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
                    {true && <Form>
                        <p>Video format</p>
                        <Form.Select 
                            placeholder='Select video format and codec' 
                            options={possibleFormats}
                            onChange={this.handleSetFileFormat}
                            value={this.props.format}
                        />
                    </Form>}
                    <Grid.Row>
                        {this.props.enableStartCapture &&
                            <Button circular icon color='red' size='massive' labelPosition='right' onClick={this._startCapturing}>
                                <Icon name='record' />
                                Start recording
                            </Button>}
                        {this.props.enableStopCapture &&
                            <Button circular icon color='orange' size='massive' labelPosition='right' onClick={this._stopCapturing}>
                                <Icon name='stop' />
                                Stop recording
                            </Button>}

                        {this.props.showBrowserUnsupported &&
                            <Message negative>
                                <Message.Header>Browser not supported</Message.Header>
                                <p>Please download a decent browser </p>
                            </Message>}

                        {this.props.errormessage &&
                            <Message negative>
                                <Message.Header>Error</Message.Header>
                                <p>{this.props.errorMessage}</p>
                            </Message>}

                    </Grid.Row>
                    <Grid.Row>
                        <Advertisement unit='netboard' test='Netboard' />
                    </Grid.Row>
                </Grid>

                <Modal open={this.props.recordingConsentDim} basic size='small'>
                    <Header icon='info' content='Recording area and consent' />
                    <Modal.Content>
                        <Grid centered>
                            Please select the area you want to record and allow screen recording
                        </Grid>
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


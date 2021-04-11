import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Advertisement, Button, Divider, Form, Grid, Header, Icon, Message, Modal, Radio, Responsive, Segment } from 'semantic-ui-react/dist/commonjs';
import { actionCreators as fileActionCreators, possibleFormats } from '../store/File';
import { actionCreators as recordingActionCreators } from '../store/Recording';
import { actionCreators as resolutionActionCreators } from '../store/Resolution';
import config from '../config';
import VideoRecorder from '../services/VideoRecorder';

const cursorOptions = [
    { id: 'always', label: 'Always' },
    { id: 'motion', label: 'Motion' },
    { id: 'never', label: 'Never' }
]

const Record = props => {
    const handleSetCursorOption = (event, { value }) => this.setState({ cursorOption: value });
    const handleSetFileFormat = (event, { value }) => props.fileActions.setFileFormat(value);
    const handleSetRecordUserAudio = (event, { checked }) => props.fileActions.setRecordMicrophoneAudio(checked);
    const handleErrorClose = (event) => props.recordingActions.closeError();

    const supported = window.MediaRecorder &&
        (navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia);
    props.recordingActions.setBrowserSupport(supported);

    function handleStartRecording() {
        props.recordingActions.consentDim(true);
        props.recordingActions.closeError();
        VideoRecorder.start({
            format: props.format,
            recordMicrophoneAudio: props.recordMicrophoneAudio,
            stopCallback: handleStopRecording
        }).then(() => {
            props.recordingActions.startRecording();
            props.recordingActions.consentDim(false);
        }).catch(ex => {
            props.recordingActions.showError(ex.message);
            console.error(ex);
        }).finally(() => props.recordingActions.consentDim(false))
    }

    function handleStopRecording() {
        VideoRecorder.stop().then(data => {
            props.recordingActions.stopRecording();

            if (data) {
                props.resolutionActions.setWidth(data.dimensions.width);
                props.resolutionActions.setHeight(data.dimensions.height);
                props.fileActions.setFileAvailable(true);
                props.history.push('/replay');
            }
        });
    }

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
                    {props.showBrowserUnsupported &&
                        <Message negative>
                            <Message.Header>Browser not supported</Message.Header>
                            <p>
                                Try Chrome, Firefox or Opera desktop browser.<br />
                                    Mobile browsers are currently not supported.
                                </p>
                        </Message>}
                    {props.errorMessage &&
                        <Message negative onDismiss={handleErrorClose}>
                            <Message.Header>Error</Message.Header>
                            <p>{props.errorMessage}</p>
                        </Message>}
                </Grid.Row>
                {!props.showBrowserUnsupported &&
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
                                                checked={opt.id === props.cursorOption}
                                                onChange={handleSetCursorOption}
                                            />
                                        </Grid.Column>)}
                                </Grid>}
                            {config.showVideoFormat &&
                                <Form.Select
                                    label='File format and video codec'
                                    placeholder='Select video format and codec'
                                    options={possibleFormats}
                                    onChange={handleSetFileFormat}
                                    value={props.format}
                                />}
                            {config.showMicrophoneAudio &&
                                <Form.Checkbox
                                    label='Record microphone audio'
                                    disabled={props.enableStopCapture}
                                    onChange={handleSetRecordUserAudio}
                                    checked={props.recordMicrophoneAudio}
                                />}
                            <Divider />
                            <Grid.Row>
                                {props.enableStartCapture &&
                                    <Button
                                        icon
                                        fluid
                                        color='red'
                                        size='big'
                                        labelPosition='right'
                                        onClick={handleStartRecording}>
                                        <Icon name='record' />
                                            Start
                                        </Button>}
                                {props.enableStopCapture &&
                                    <Button
                                        icon
                                        fluid
                                        color='orange'
                                        size='big'
                                        labelPosition='right'
                                        onClick={handleStopRecording}>
                                        <Icon name='stop' />
                                            Stop
                                        </Button>}
                            </Grid.Row>
                        </Form>
                    </Segment>}
                {config.showAds &&
                    <Grid.Row>
                        <Responsive {...Responsive.onlyComputer}>
                            <Advertisement unit='billboard' test='Computer Billboard #1' />
                        </Responsive>
                        <Responsive {...Responsive.onlyTablet}>
                            <Advertisement centered unit='large rectangle' test='Large Tablet Rectangle #1' />
                        </Responsive>
                        <Responsive {...Responsive.onlyMobile}>
                            <Advertisement unit='small rectangle' test='Mobile Small Rectangle #1' />
                        </Responsive>
                    </Grid.Row>}
            </Grid>

            <Modal open={props.recordingConsentDim} basic dimmer='blurring' size='tiny'>
                <Header as='h2'>
                    <Icon name='info' />
                    Recording content and audio
                </Header>
                <Modal.Content>
                    Please share the screen content and audio you want to record
                </Modal.Content>
            </Modal>

        </div>
    );
}
export default connect(
    state => ({ ...state.recording, ...state.resolution, ...state.file }),
    dispatch => ({
        fileActions: bindActionCreators(fileActionCreators, dispatch),
        recordingActions: bindActionCreators(recordingActionCreators, dispatch),
        resolutionActions: bindActionCreators(resolutionActionCreators, dispatch)
    })
)(Record);


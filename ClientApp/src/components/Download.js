import React, { Component } from 'react';
import { Advertisement, Button, Container, Divider, Form, Grid, Header, Icon, Input, Label, Radio, Segment } from 'semantic-ui-react/dist/commonjs';
import { VideoStorage } from '../store/VideoStorage';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators as resolutionActionCreators, resolutions } from '../store/Resolution';
import { actionCreators as fileActionCreators } from '../store/File';

export class Download extends Component {
  handleSetResolution = (evt, { value }) => this.props.resolutionActions.setResolution(parseInt(value));
  handleSetWidth = (evt, { value }) => this.props.resolutionActions.setWidth(parseInt(value));
  handleSetHeight = (evt, { value }) => this.props.resolutionActions.setHeight(parseInt(value));
  handleSetFileName = (evt, { value }) => this.props.fileActions.setFileName(value);
  downloadRecording = () => {
    console.log('Download recording.');

    const downloadLink = document.createElement('a');
    downloadLink.addEventListener('progress', e => console.log(e));
    downloadLink.href = VideoStorage.objectUrl;
    downloadLink.style = 'display: none';
    downloadLink.setAttribute('download', `${this.props.file.name}.${this.props.file.extension}`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  render() {
    return (
      <Grid stackable relaxed='very'>
        <Grid.Column width={10} verticalAlign='middle' textAlign='center'>
          <Advertisement unit='netboard' test='Netboard #2' />
        </Grid.Column>
        <Grid.Column width={6}>
          <Segment>
            <Header>Resolution</Header>
            <Form>
              <Form.Group>
                <Input
                  value={this.props.resolution.width}
                  onChange={this.handleSetWidth}
                  type='number'
                  size='mini'
                  icon='arrows alternate horizontal'
                  iconPosition='left'
                  placeholder='1920'
                />
                <Input
                  value={this.props.resolution.height}
                  onChange={this.handleSetHeight}
                  type='number'
                  size='mini'
                  icon='arrows alternate vertical'
                  iconPosition='left'
                  placeholder='1080'
                />
              </Form.Group>
            </Form>
            <Divider horizontal>Standard formats</Divider>
            <Form>
              {resolutions.map(res =>
                <Form.Field key={res.id}>
                  <Radio
                    label={res.label}
                    name='resolutionId'
                    value={res.id}
                    checked={res.id === this.props.resolution.id}
                    onChange={this.handleSetResolution}
                  />
                </Form.Field>)}
            </Form>
          </Segment>
          <Segment>
            <Header>File name</Header>
            <Input
              value={this.props.file.name}
              onChange={this.handleSetFileName}
              fluid
              type='text'
              label={{ basic: true, content: `.${this.props.file.extension}` }}
              labelPosition='right'
            />
          </Segment>

          {true &&
            <Button fluid icon labelPosition='right' color='green' size='massive' onClick={this.downloadRecording}>
              <Icon name='download' />
              Download
              </Button>}
        </Grid.Column>
      </Grid>
    );
  }
}

export default connect(
  state => ({ resolution: state.resolution, file: state.file }),
  dispatch => ({ resolutionActions: bindActionCreators(resolutionActionCreators, dispatch), fileActions: bindActionCreators(fileActionCreators, dispatch) })
)(Download);

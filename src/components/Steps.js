import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Icon, Step } from 'semantic-ui-react/dist/commonjs'
import { actionCreators } from '../store/File';
import config from '../config';

class Steps extends Component {
    componentDidMount() {
        // This method is called when the component is first added to the document
        //this.ensureDataFetched();
    }

    componentDidUpdate() {
        // This method is called when the route parameters change
        //this.ensureDataFetched();
    }

    ensureDataFetched() {
        //const startDateIndex = parseInt(this.props.match.params.startDateIndex, 10) || 0;
        //this.props.requestWeatherForecasts(startDateIndex);
    }

    render() {
        return (
            <div>
                <Step.Group widths={3}>
                    <Step as={NavLink} to="/record">
                        <Icon name='record' />
                        <Step.Content>
                            <Step.Title>Record</Step.Title>
                            <Step.Description>Video format &amp; recording area</Step.Description>
                        </Step.Content>
                    </Step>
                    <Step as={NavLink} to="/replay" disabled={!this.props.fileAvailable}>
                        <Icon name='video play' />
                        <Step.Content>
                            <Step.Title>Replay</Step.Title>
                            <Step.Description>Preview recording</Step.Description>
                        </Step.Content>
                    </Step>
                    <Step as={NavLink} to="/download" disabled={!this.props.fileAvailable}>
                        <Icon name='download' />
                        <Step.Content>
                            <Step.Title>Download</Step.Title>
                            <Step.Description>File name &amp; download</Step.Description>
                        </Step.Content>
                    </Step>
                    {config.showShareStep &&
                        <Step as={NavLink} to="/share" disabled={!this.props.fileAvailable}>
                            <Icon name='share alternate' />
                            <Step.Content>
                                <Step.Title>Share</Step.Title>
                                <Step.Description>Let others know</Step.Description>
                            </Step.Content>
                        </Step>}
                </Step.Group>
            </div>
        );
    }
}
export default withRouter(connect(
    state => state.file,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(withRouter(Steps)));


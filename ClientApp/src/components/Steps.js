import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Icon, Step } from 'semantic-ui-react/dist/commonjs'
import { actionCreators } from '../store/WeatherForecasts';

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
                <Step.Group widths={4}>
                    <Step as={NavLink} to ="/record">
                        <Icon name='record' />
                        <Step.Content>
                            <Step.Title>Record</Step.Title>
                            <Step.Description>Choose recording area and start</Step.Description>
                        </Step.Content>
                    </Step>
                    <Step as={NavLink} to="/replay">
                        <Icon name='video play' />
                        <Step.Content>
                            <Step.Title>Replay</Step.Title>
                            <Step.Description>Preview the recording</Step.Description>
                        </Step.Content>
                    </Step>
                    <Step as={NavLink} to="/download">
                        <Icon name='download' />
                        <Step.Content>
                            <Step.Title>Download</Step.Title>
                            <Step.Description>Choose resolution and file name</Step.Description>
                        </Step.Content>
                    </Step>
                    <Step disabled>
                        <Icon name='share alternate' />
                        <Step.Content>
                            <Step.Title>Share</Step.Title>
                            <Step.Description>Let others know</Step.Description>
                        </Step.Content>
                    </Step>
                </Step.Group>
            </div>
        );
    }
}
export default connect(
    state => state.steps,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Steps);


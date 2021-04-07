import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Icon, Responsive, Step } from 'semantic-ui-react/dist/commonjs'
import { actionCreators } from '../store/File';
import config from '../config';

const Steps = props => (
    <div>
        <Step.Group unstackable widths={3}>
            <Step as={NavLink} to="/record">
                <Icon name='record' />
                <Step.Content>
                    <Step.Title>Record</Step.Title>
                    <Responsive {...Responsive.onlyComputer}>
                        <Step.Description>Video format &amp; recording area</Step.Description>
                    </Responsive>
                </Step.Content>
            </Step>
            <Step as={NavLink} to="/replay" disabled={!props.fileAvailable}>
                <Icon name='video play' />
                <Step.Content>
                    <Step.Title>Replay</Step.Title>
                    <Responsive {...Responsive.onlyComputer}>
                        <Step.Description>Preview recording</Step.Description>
                    </Responsive>
                </Step.Content>
            </Step>
            <Step as={NavLink} to="/save" disabled={!props.fileAvailable}>
                <Icon name='download' />
                <Step.Content>
                    <Step.Title>Save</Step.Title>
                    <Responsive {...Responsive.onlyComputer}>
                        <Step.Description>File name &amp; save</Step.Description>
                    </Responsive>
                </Step.Content>
            </Step>
            {config.showShareStep &&
                <Step as={NavLink} to="/share" disabled={!props.fileAvailable}>
                    <Icon name='share alternate' />
                    <Step.Content>
                        <Step.Title>Share</Step.Title>
                        <Step.Description>Let others know</Step.Description>
                    </Step.Content>
                </Step>}
        </Step.Group>
    </div>
);

export default withRouter(connect(
    state => state.file,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(withRouter(Steps)));


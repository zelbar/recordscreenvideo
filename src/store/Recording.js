const browserSupported = 'BROWSER_SUPPORTED';
const browserUnsupported = 'BROWSER_UNSUPPORTED';
const recordingStarted = 'RECORDING_STARTED';
const recordingStopped = 'RECORDING_STOPPED';
const recordingConsentBusy = 'RECORDING_CONSENT_BUSY';
const recordingConsentDone = 'RECORDING_CONSENT_DONE';
const errorOccurred = 'ERROR_OCCURRED';
const closeError = 'CLOSE_ERROR';

const initialState = { 
    inProgress: false,
    enableStartCapture: true,
    enableStopCapture: false,
    recordingConsentDim: false
 };

export const actionCreators = {
    setBrowserSupport: value => ({ type: value ? browserSupported : browserUnsupported }),
    startRecording: () => ({ type: recordingStarted }),
    stopRecording: () => ({ type: recordingStopped }),
    consentDim: value => ({ type: (value ? recordingConsentBusy : recordingConsentDone) }),
    showError: message => ({ type: errorOccurred, errorMessage: message }),
    closeError: () => ({ type: closeError })
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === browserSupported) {
        return { ...state, showStartCapture: true };
    }

    if (action.type === browserUnsupported) {
        return { ...state, showStartCapture: false, showBrowserUnsupported: true };
    }

    if (action.type === recordingStarted) {
        return { ...state, inProgress: true, enableStartCapture: false, enableStopCapture: true };
    }

    if (action.type === recordingStopped) {
        return { ...state, inProgress: false, enableStartCapture: true, enableStopCapture: false };
    }

    if (action.type === recordingConsentBusy) {
        return { ...state, recordingConsentDim: true };
    }

    if (action.type === recordingConsentDone) {
        return { ...state, recordingConsentDim: false };
    }

    if (action.type === errorOccurred) {
        return { ...state, recordingConsentDim: false, errorMessage: action.errorMessage };
    }

    if (action.type === closeError) {
        return { ...state, errorMessage : null };
    }

    return state;
};

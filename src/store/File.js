const setFileName = 'SET_FILE_NAME';
const setFileFormat = 'SET_FILE_FORMAT';
const setFileAvailable = 'SET_FILE_AVAILABLE';
const setRecordMicrophoneAudio = 'SET_RECORD_MICROPHONE_AUDIO';

export const possibleFormats = [
    {
        key: 1,
        text: 'WebM (default codec)',
        value: 'video/webm',
        extension: 'webm'
    }, {
        key: 2,
        text: 'WebM (VP8 codec)',
        value: 'video/webm;codecs=vp8',
        extension: 'webm'
    }, {
        key: 3,
        text: 'WebM (VP9 codec)',
        value: 'video/webm;codecs=vp9',
        extension: 'webm'
    }, {
        key: 4,
        text: 'WebM (H264 codec)',
        value: 'video/webm;codecs=h264',
        extension: 'webm'
    }, {
        key: 5,
        text: 'WebM (AVC1 codec)',
        value: 'video/webm;codecs=avc1',
        extension: 'webm'
    }, {
        key: 6,
        text: 'Matroska (AVC1 codec)',
        value: 'video/x-matroska;codecs=avc1',
        extension: 'mkv'
    }
].map(f => ({ ...f, disabled: window.MediaRecorder && !window.MediaRecorder.isTypeSupported(f.value) }));

const initialState = { 
    name: 'screen-recording-' + (new Date().toISOString()).split('T')[0], 
    format: possibleFormats.find(f => !f.disabled).value,
    extension: 'webm',
    recordMicrophoneAudio: false,
    fileAvailable: false
};

export const actionCreators = {
    setFileName: fileName => ({ type: setFileName, fileName }),
    setFileFormat: fileFormat => ({ type: setFileFormat, fileFormat }),
    setFileAvailable: value => ({ type: setFileAvailable, value }),
    setRecordMicrophoneAudio: value => ({ type: setRecordMicrophoneAudio, value })
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === setFileName) {
        return { ...state, name: action.fileName };
    }

    if (action.type === setFileFormat) {
        return { ...state, format: action.fileFormat, extension: possibleFormats.find(f => f.value === action.fileFormat).extension };
    }

    if (action.type === setFileAvailable) {
        return { ...state, fileAvailable: action.value };
    }

    if (action.type === setRecordMicrophoneAudio) {
        return { ...state, recordMicrophoneAudio: action.value };
    }

    return state;
};
const setFileName = 'SET_FILE_NAME';
const setFileFormat = 'SET_FILE_FORMAT';

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
].map(f => ({ ...f, disabled: !MediaRecorder.isTypeSupported(f.value) }));

const initialState = { 
    name: 'screen-recording', 
    format: possibleFormats.find(f => !f.disabled).value,
    extension: 'webm' 
};

export const actionCreators = {
    setFileName: fileName => ({ type: setFileName, fileName }),
    setFileFormat: fileFormat => ({ type: setFileFormat, fileFormat })
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === setFileName) {
        return { ...state, name: action.fileName };
    }

    if (action.type === setFileFormat) {
        return { ...state, format: action.fileFormat, extension: possibleFormats.find(f => f.value === action.fileFormat).extension };
    }

    return state;
};
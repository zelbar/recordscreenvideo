const setResolution = 'SET_RESOLUTION';
const setWidth = 'SET_WIDTH';
const setHeight = 'SET_HEIGHT';

export const resolutions = [
    { id: 4320, label: '8K Ultra HD', width: 7680 , height: 4320 },
    { id: 2160, label: '4K Ultra HD', width: 3840, height: 2160 },
    { id: 1440, label: 'Quad HD', width: 2560, height: 1440 },
    { id: 1080, label: 'Full HD', width: 1920, height: 1080 },
    { id: 900, label: 'HD Plus', width: 1600, height: 900 },
    { id: 720, label: 'HD', width: 1280, height: 720 }
];

const initialState = resolutions[0];

export const actionCreators = {
    setResolution: id => ({ type: setResolution, id }),
    setWidth: width => ({ type: setWidth, width }),
    setHeight: height => ({ type: setHeight, height })
};

const getResolutionById = resId => resolutions.find(r => r.id === resId);
const findResolution = (width, height) => resolutions.find(r => r.width === width && r.height === height);

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === setResolution) {
        const resolution = getResolutionById(action.id);
        return { ...state, id: action.id, width: resolution.width, height: resolution.height };
    }

    if (action.type === setWidth) {
        const resolution = findResolution(action.width, state.height);
        console.log('res w', resolution, action.width, state.height);
        return { ...state, width: action.width, id: resolution ? resolution.id : null }
    }

    if (action.type === setHeight) {
        const resolution = findResolution(state.width, action.height);
        return { ...state, height: action.height, id: resolution ? resolution.id : null };
    }

    return state;
};

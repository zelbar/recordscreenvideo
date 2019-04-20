const navigate = 'NAVIGATE';
const record = 'RECORD';
const replay = 'REPLAY';
const download = 'DOWNLOAD';
const share = 'SHARE';
const initialState = record;

export const actionCreators = {
  navigate: () => ({ type: record }),
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === navigate) {
    return action.location;
  }

  return state;
};

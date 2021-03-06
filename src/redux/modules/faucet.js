import { Cmd, loop } from 'redux-loop';

import apiRequest from '../../utils/Fetch';

const ACTIONS = {
  GET_TOKENS: 'FAUCET/GET_TOKENS',
  GET_TOKENS_SUCCESS: 'FAQ/GET_TOKENS_SUCCESS',
  GET_TOKENS_FAILURE: 'FAQ/GET_TOKENS_FAILURE',
};

function getTokensAction(address) {
  return {
    type: ACTIONS.GET_TOKENS,
    address,
  };
}

function getTokensRequest(address) {
  return apiRequest('/api/faucet/send-tokens', {
    method: 'post',
    body: { address },
  });
}

function getTokensSuccess(response) {
  return {
    type: ACTIONS.GET_TOKENS_SUCCESS,
    success: true,
  };
}

function getTokensFailure(error) {
  return {
    type: ACTIONS.GET_TOKENS_FAILURE,
    error,
  };
}

const initialState = {
  loading: false,
  success: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.GET_TOKENS:
      return loop(
        { ...state, loading: true },
        Cmd.run(getTokensRequest, {
          successActionCreator: getTokensSuccess,
          failActionCreator: getTokensFailure,
          args: [action.address],
        })
      );

    case ACTIONS.GET_TOKENS_SUCCESS:
      return { ...state, loading: false, success: true };

    case ACTIONS.GET_TOKENS_FAILURE:
      return {
        ...state,
        loading: false,
        error:
          action.error || 'Ooops! Something went wrong... Please try again.',
      };

    default:
      return state;
  }
}

export { getTokensAction };

import axios from 'axios';

const KEY = 'H6C7X1L)t3iqm8jsjbx5hQ((';
const SITE = 'stackoverflow';
const BASE_URL = 'https://api.stackexchange.com/2.2';

export const fetchQuestions = (params) => { 
  return _createRequest('/questions', {
    
  });
};

const _queryStringFromObj = params => {
  return Object.keys(params).map( k => `${k}=${params[k]}` ).join('&');
};

const _mergeParamDefaults = params => {
  return Object.assign(params, {
    key: KEY,
    site: SITE,
    pagesize: 100,
  });
};

const _createRequest = (endpoint, queryParams) => {
  const queryString = _queryStringFromObj(_mergeParamDefaults(queryParams));
  return axios({
    method: 'GET',
    url: `${BASE_URL}${endpoint}?${queryString}`
  });
};

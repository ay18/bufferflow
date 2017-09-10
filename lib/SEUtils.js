// Stack Exchange API Utils

import axios from 'axios';

const KEY = 'H6C7X1L)t3iqm8jsjbx5hQ((';
const SITE = 'stackoverflow';
const BASE_URL = 'https://api.stackexchange.com/2.2';

export const fetchQuestions = params => { 
  return _createRequest('/questions', {
    
  });
};

export const fetchQuestionDetailsFromItems = items => {
  const questionIds = items.map( item => item.question_id );
  return _createRequest(`/questions/${ questionIds.join(';') }`);
};

export const fetchAcceptedAnswersFromItems = items => {
  const acceptedIds = items.map( item => item.accepted_answer_id ).filter( id => id );
  return _createRequest(`/answers/${ acceptedIds.join(';') }`);
};

// link questions to answers, instead of in separate arrays
export const packageData = data => {
  const packagedData = {
    questions: {},
    questionDetails: {},
    acceptedAnswers: {},
  };
  data.questions.map ( q => {
    packagedData.questions[q.question_id] = q;
  });
  data.questionDetails.map ( qd => {
    packagedData.questionDetails[qd.question_id] = qd;
  });
  data.acceptedAnswers.map ( a => {
    packagedData.acceptedAnswers[a.answer_id] = a;
  });
  return packagedData;
};

const _queryStringFromObj = params => {
  return Object.keys(params).map( k => `${k}=${params[k]}` ).join('&');
};

const _mergeParamDefaults = params => {
  params = params || {};
  return Object.assign(params, {
    key: KEY,
    site: SITE,
    pagesize: 100,
    filter: 'withbody',
  });
};

const _createRequest = (endpoint, queryParams) => {
  const queryString = _queryStringFromObj(_mergeParamDefaults(queryParams));
  return axios({
    method: 'GET',
    url: `${BASE_URL}${endpoint}?${queryString}`
  });
};

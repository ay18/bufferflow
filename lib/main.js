import axios from 'axios';
import _ from 'lodash';
import $ from 'sprint-js';

import '../styles/visualization.scss';
import * as SEUtils from './SEUtils';
import Visualization from './Visualization';

// DEBUG
window.axios = axios;
window.$ = $;
window._ = _;

const fetchData = () => {
  const resData = {};
  SEUtils.fetchQuestions()
  .then( res => { // questions
    resData.questions = res.data.items;
    return SEUtils.fetchQuestionDetailsFromItems(res.data.items);
  })
  .then( res => { // question details
    resData.questionDetails = res.data.items;
    return SEUtils.fetchAcceptedAnswersFromItems(res.data.items);
  })
  .then( res => { // accepted answers
    resData.acceptedAnswers = res.data.items;
    const seData = SEUtils.packageData(resData);
    vz.load(seData);
    window.quotaRemaining = res.data.quota_remaining;
  });
};

const callbacks = {
  fetchData,
};

const vz = new Visualization(callbacks);

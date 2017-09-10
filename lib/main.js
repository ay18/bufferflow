import axios from 'axios';
import '../styles/visualization.scss';

import * as SEUtils from './SEUtils';
import Visualization from './Visualization';

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
  });
};

const callbacks = {
  fetchData,
};

const vz = new Visualization(callbacks);

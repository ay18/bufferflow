import axios from 'axios';
import '../styles/visualization.scss';

import * as SEUtils from './SEUtils';
import Visualization from './Visualization';

const vz = new Visualization();

const sedata = {};

SEUtils.fetchQuestions()
  .then( res => { // questions
    sedata.questions = res.data.items;
    return SEUtils.fetchQuestionDetailsFromItems(res.data.items);
  })
  .then( res => { // question details
    sedata.questionDetails = res.data.items;
    return SEUtils.fetchAcceptedAnswersFromItems(res.data.items);
  })
  .then( res => { // accepted answers
    sedata.selectedAnswers = res.data.items;
    const pdata = SEUtils.packageData(sedata);
    vz.load(pdata);
  });

import axios from 'axios';

import * as StackExchangeUtil from './StackExchangeUtil';
import ThreeController from './ThreeController';

const tc = new ThreeController();
window.tc = tc;


// wrap fetch questions in set interval to load data into tc.
StackExchangeUtil.fetchQuestions().then(
  res => {
    window.res = res;
    tc.load(res.data.items);
  }
);

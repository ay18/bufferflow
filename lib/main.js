import axios from 'axios';
import '../styles/visualization.scss';

import * as StackExchangeUtil from './StackExchangeUtil';
import Visualization from './Visualization';

const vz = new Visualization();
window.vz = vz;


// wrap fetch questions in set interval to load data into tc.
StackExchangeUtil.fetchQuestions().then(
  res => {
    window.res = res;
    vz.load(res.data.items);
  }
);

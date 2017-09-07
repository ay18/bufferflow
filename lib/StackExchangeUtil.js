import axios from 'axios';

const KEY = 'H6C7X1L)t3iqm8jsjbx5hQ((';
const BASE_URL = 'https://api.stackexchange.com/2.2';


export const test = () => {
  return axios({
    method: 'GET',
    url: `${BASE_URL}/questions?order=desc&sort=activity&site=stackoverflow&pagesize=100&key=${KEY}`,
  }).then(
    res => {
      window.res = res;
      console.log(res);
      window.items = res.data.items;
    }
  );
};


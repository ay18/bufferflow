// These are not secrets and can be safely embedded
const SE_CLIENT_ID = '10718';
const SE_KEY= 'H6C7X1L)t3iqm8jsjbx5hQ((';

export const auth = () => {
  window.SE.init({
    clientId: SE_CLIENT_ID,
    key: SE_KEY,
    channelUrl: 'http://localhost:9000/dist/blank.html',
    complete: data => {
      console.log(data);
    }
  });
};

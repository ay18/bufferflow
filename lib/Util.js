// Utility methods for calculations

const CODES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

const randArr = arr => {
  return arr[Math.floor(Math.random()*arr.length)];
};

export const randomColor = () => {
  const codes = [];
  for (let i = 0; i < 6; i++) {
    codes.push(randArr(CODES));
  }
  return parseInt(`0x${codes.join('')}`, 16);
};

export const randRotation = () => {
  const max = 2.5;
  const min = -2.5;
  return Math.PI / 2 * Math.random() * (max - min) + min;
};

export const randRange = (min, max) => {
  return Math.random() * (max - min) + min;
};
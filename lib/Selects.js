import _ from 'lodash';

export function byTag(tag) {
  const currentObjs = _.filter( this.renderedSEObjs, st => {
    return st.SEData.question.tags[tag];
  });
  const stashedObjs = _.filter( this.stashedSEObjs, st => {
    return st.SEData.question.tags[tag];
  });
  return currentObjs.concat(stashedObjs);
}

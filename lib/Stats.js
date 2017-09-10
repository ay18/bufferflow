// 'I like to keep track of stuff' - Stats

import $ from 'sprint-js';
import _ from 'lodash';
window._ = _;


class Stats {
  
  constructor(viz) {
    this.viz = viz;
    
    this.fetchedCount = 0;
    this.renderedCount = 0;
    this.tags = {};
  }
  
  rendered(SEObj) {
    const { SEData: { question: { tags } } } = SEObj;
    this.upRenderedCount();
    addTags.call(this, tags);
    $('.tags-list').empty();
    sortedTags.call(this).forEach( ([tag, count]) => {
      $('.tags-list').append(
        `<div class='tags-group'>
          <span class='tag-subject'>${ tag }</span>
          <span class='tag-count'>${ count }</span>
        </div>`
      );
    });
  }
  
  upFetchedCount(n) {
    this.fetchedCount += n;
    $('.fetched .val').html(`${this.fetchedCount}`);
  }
  
  upRenderedCount() {
    this.renderedCount += 1;
    $('.rendered .val').html(`${this.renderedCount}`);
  }
  
}

export default Stats;

function addTags(tags) {
  tags.forEach( t => {
    if (this.tags[t] === undefined) {
      this.tags[t] = 1;
    } else {
      this.tags[t] += 1;
    }
  });
}

function sortedTags(limit) {
  limit = limit || 60;
  return _.sortBy(_.toPairs(this.tags), p => p[1]).reverse().slice(0, limit);
}
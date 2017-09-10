// I keep track of stuff and the DOM

import $ from 'sprint-js';
import _ from 'lodash';

class Stats {
  
  constructor(viz) {
    this.viz = viz;
    this.fetchedCount = 0;
    this.renderedCount = 0;
    this.tags = {};
  }
  
  rendered(SEObj) {
    const { id, SEData: { question: { tags } } } = SEObj;
    upRenderedCount.call(this);
    addTags.call(this, tags);
    updateTags.call(this, tags);
  }
  
  displayInfo(SEObj) {
    const { id, displayInfo } = SEObj;
    const domEl = $(`#info-${ id }`);
    if (displayInfo) {
      if (domEl.length === 0) {
        const div = createInfoDiv.call(this, SEObj);
        $('body').append(div);
      }
    } else {
      domEl.remove();
    }
  }
  
}

export default Stats;
  
function upRenderedCount() {
  this.renderedCount += 1;
  $('.rendered .val').html(`${this.renderedCount}`);
}

function addTags(tags) {
  tags.forEach( t => {
    if (this.tags[t] === undefined) {
      this.tags[t] = 1;
    } else {
      this.tags[t] += 1;
    }
  });
}

function updateTags(tags) {
  $('.tags-list').empty();
  sortedTags.call(this).forEach( ([tag, count]) => {
    const tagGroup = createTagGroup.call(this, tag, count);
    $('.tags-list').append(tagGroup);
  });  
}

function sortedTags(limit) {
  limit = limit || 60;
  return _.sortBy(_.toPairs(this.tags), p => p[1]).reverse().slice(0, limit);
}

function createTagGroup(tag, count) {
  const domStr =
    `<div class='tag-group'>`+
      `<span class='tag-subject'>${ tag }</span>`+
      `<span class='tag-count'>${ count }</span>`+
    `</div>`;
  return $(domStr);
}

function createInfoDiv(SEObj) {
  const { id, SEData: { question: { body } } } = SEObj;
  const domStr =
    `<div id='info-${ id }'>`+
      `<div class="question">${ body }</div>`+
      `<div class="answers"></div>`+
    `</div>`;
  return $(domStr);
}
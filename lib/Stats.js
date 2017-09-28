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
    addTags.call(this, Object.keys(tags));
    updateTags.call(this, tags);
  }
  
  displayInfo(SEObj) {
    const { id, displayInfo } = SEObj;
    let info = $(`#info-${ id }`);
    if (displayInfo) {
      const { x, y } = SEObj.windowPosition();
      if (info.length === 0) {
        info = createInfoDiv.call(this, SEObj);
        $('body').append(info);
        highlightCode();
      } 
      info.css({ 'top': `${ y }px`, 'left': `${ x }px` });
    } else {
      info.remove();
    }
  }
  
  closeInfo(id) {
    const info = $(`#info-${ id }`);
    info.addClass('closing');
    setTimeout( () => {
      info.remove();
    }, 2000);
  }

  hide() {
    $('#tags').addClass('hidden');
  }

  show() {
    $('#tags').removeClass('hidden');
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
  $('#tags-list').empty();
  sortedTags.call(this).forEach( ([tag, count]) => {
    if (tag !== 'constructor') {
      const tagGroup = createTagGroup.call(this, tag, count);
      $('#tags-list').append(tagGroup);
    }
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
  const { id, SEData: { question: { body }, questionDetail: qd } } = SEObj;
  const domStr =
    `<div class='info' id='info-${ id }'>`              +
      `<div class='close-wrapper'>`                     +
        `<div class='close' id='close-${ id }'></div>`  +
      `</div>`                                          +
      `<div class='tags'>${ qd.tags.join(', ') }</div>` +
      `<span class='score'>`                            +
        `<i class="fa fa-star" aria-hidden="true"></i> ${ qd.score }`+
      `</span>`                                         +
      `<span class='answers'>`                          +
        `<i class="fa fa-commenting-o" aria-hidden="true"></i> ${ qd.answer_count }`+
      `</span>`                                         +
      _acceptedAnswer(qd.accepted_answer_id)               +
      `<div class="question">${ body }</div>`           +
      `<div class="answers"></div>`                     +
    `</div>`;
  return $(domStr);
}

function _acceptedAnswer(acceptedId) {
  if (acceptedId) {
    return (
      `<span class='accepted'>`                          +
        `<i class="fa fa-check" aria-hidden="true"></i> accepted`+
      `</span>`
    );
  } else {
    return '';
  }
}

function highlightCode() {
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
}
// 'I like to keep track of stuff' - Stats

import $ from 'sprint-js';



class Stats {
  
  constructor(viz) {
    this.viz = viz;
    
    this.fetchedCount = 0;
    this.renderedCount = 0;
    this.languages = {};
  }
  
  rendered(SEObj) {
    this.upRenderedCount();
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

// const 
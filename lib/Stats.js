// 'I like to keep track of stuff' - Stats

import $ from 'sprint-js';



class Stats {
  
  constructor(viz) {
    this.viz = viz;
    
    this.fetchedCount = 0;
    this.languages = {};
  }
  
  rendered(SEObj) {
    
  }
  
  upFetchedCount(n) {
    this.fetchedCount += n;
    $('.fetched .val').html(`${this.fetchedCount}`);
  }
  
}

export default Stats;

// const 
## Bufferflow - a visualization project for Stackoverflow data

### Background

Data is the new commodity, and a ton of it exists on Stackoverflow. Making sense of this data may shed insight on current interest on technologies and the community's overall mastery of a technology based on metrics like numbers of questions answered. Bufferflow will try to present this data in a visual and interactive way by taking advantage of three.js, a webGL framework.

### Functionality & MVP  

- [ ] See stack overflow questions as a stream of cubes that are color coded by language.
- [ ] Render new question (cubes) as set intervals -- this requires a queue.
- [ ] Inspect blocks by hovering over them with a cursor. This should show question details.
- [ ] Filter languages by typing.

In addition, this project will include:

- [ ] A production README

### Commands
dev
```
npm run dev
```

prod
```
npm run build
```

### Wireframes

![buf](https://raw.githubusercontent.com/sksea/i/master/bufferflow/bufferflow.png)

### Architecture and Technologies

This project will be implemented with the following technologies:

- `JavaScript` for general application logic.
- `three.js` for 3D rendering.
- `webpack` to bundle js files.

In addition to the entry file, there will be three scripts involved in this project (tentative):

- cube.js - representing a question in three js.
- bufferflow.js - main application logic
- SEUtils.js - http methods for fetching data from stackexchange API.
- canvasController.js - for interacting with three JS canvas.

### Implementation Timeline

**Day 1:**
- Set up index.html with canvas for Three.js and webpack to bundle code.  
- Set up application to fetch data from [Stackexchange endpoints](https://api.stackexchange.com/docs).
  - base path: https://api.stackexchange.com/2.2  
  - [/questions](https://api.stackexchange.com/docs/questions)  
  - [/questions/{ids}](https://api.stackexchange.com/docs/questions-by-ids)  
  - [/questions/{ids}/answers](https://api.stackexchange.com/docs/answers-on-questions)  
  - [/answers/{ids}](https://api.stackexchange.com/docs/answers-by-ids)
- Fetching should happen at regular intervals, and responses should be queued into an array before they are rendered onto the screen. This will create the sense of a 'stream' visually.
- Learn enough threejs to render cubes on the screen. Stackoverflow questions will be represented by these cubes.

**Day 2:**
- Authenticate application.
- Continue with threejs, cubes should now be rendered and color coded by language.
- Add movement to cubes.
- Add raycasting for mouse hover interaction with threejs elements. The intention is to hover over a cube (question) and some basic detail about the question should appear.
- Add stats on the side of application that keeps track of question and answers per language.

**Day 3:**
- Add typing interaction used to filter cubes.
- Add controls to filter cubes by time.

**Bonus:**
- Allow typing to filter 
- Cache data in a simple Rails server to reduce HTTP requests. Will require hosting the server somewhere.

/// <reference types="webpack/module" />
import "./public-path"

import * as _ from 'lodash';
import './style.css';
import './test.txt';

function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  const img = new Image();
  img.src = "./assets/global.png";
  element.appendChild(img)

  return element;
}

document.body.appendChild(component());

const worker = new Worker(new URL('./deep-thought.ts', import.meta.url));
worker.postMessage({
  question:
    'The Answer to the Ultimate Question of Life, The Universe, and Everything.',
});
worker.onmessage = ({ data: { answer } }) => {
  console.log(answer);
};
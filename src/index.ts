/// <reference types="webpack/module" />
import './style.css';

import * as _ from 'lodash';

// 运行时设置 publicPath
__webpack_public_path__ = process.env.ASSET_PATH;
console.log(__webpack_public_path__);

function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
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
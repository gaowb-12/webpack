// import './assets/font-awesome-4.7.0/css/font-awesome.min.css';
import './style.css';
// import svg from "./assets/商业智能.svg"

import _ from 'lodash';
import printMe from './print.js';

function component() {
    const element = document.createElement('div');

    // lodash 在当前 script 中使用 import 引入
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

    var btn = document.createElement('button');
    btn.innerHTML = '点击这里，然后查看 console！';
    btn.onclick = printMe;

    element.appendChild(btn);

    return element;
}

 document.body.appendChild(component());
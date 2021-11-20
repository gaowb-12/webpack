// import './assets/font-awesome-4.7.0/css/font-awesome.min.css';
import './style.css';
// import svg from "./assets/商业智能.svg"

async function getComponent() {
    const element = document.createElement('div');
    const { default: _ } = await import('lodash');
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    element.onclick = function(){
        import(/* webpackPreload: true */ /* webpackChunkName: "print" */ './print.js')
        .then(({default: res}) =>{
            console.log(res)
            res()
        })
    }

    return element;
}
getComponent().then((component) => {
    document.body.appendChild(component);
});

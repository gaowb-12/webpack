const { SyncHook, SyncBailHook, SyncLoopHook, SyncWaterfallHook } = require("tapable");

const hook = new SyncHook(["name"]);
hook.tap("hello",function(name){
    console.log(`hello ${name}`);
})
hook.tap("hello again",function(name){
    console.log(`hello ${name}, again`);
})
hook.call("hello");

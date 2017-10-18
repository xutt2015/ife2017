var Vue=function (options) {
    this.$options=options;
    this.$data=options.data;
    this.$el=document.querySelector(options.el);
}


const app = new Vue({
    el: '#app',
    data: {
        name: 'youngwind',
        age: 24,
        address: {
            info: {
                city: 'beijing'
            }
        },
        message: ['a', 'b', {
            name: 'liangshaofeng',
            age: 24
        }]
    }
});
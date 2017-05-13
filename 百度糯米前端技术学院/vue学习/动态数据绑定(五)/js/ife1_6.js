
const ARRAY = 0;
const OBJECT = 1;

let uid = 0;

/**
 * 观察者构造函数
 * @param value {Object} 数据对象
 * @param type {Int} 数据对象的类型(分为对象和数组)
 * @constructor
 */
 function Observer(value, type) {
    this.value = value;
    this.id = ++uid;

    // TODO 这里enumerable一定要为false,否则会触发死循环, 原因未明
    // 将当前对象存储到当前对象的$observer属性中
    // 观察者构造函数，实例化时，给value对象添加$observer属性。$observer值为实例化的observer对象。
    Object.defineProperty(value, '$observer', {
        value: this,
        enumerable: false,
        writable: true,
        configurable: true
    });

    if (type === ARRAY) {
        //value.__proto__ = arrayAugmentations; // eslint-disable-line
        this.link(value);
    } else if (type === OBJECT) {
       // value.__proto__ = objectAugmentations;
        // eslint-disable-line
        this.walk(value);
    }
}

/**
 * 遍历数据对象
 * @param obj {Object} 待遍历的数据对象
 */
 Observer.prototype.walk = function(obj) {
    let val;
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) return;

        val = obj[key];

        // 递归
        this.observe(key, val);

        this.convert(key, val);
    }
};

/**
 * 定义对象属性
 * @param key {string} 属性键名
 * @param val {Any} 属性值
 */
 Observer.prototype.convert = function(key, val) {
    let ob = this;
    Object.defineProperty(this.value, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            return val;
        },
        set: function(newVal) {
            if (newVal === val) return;
            val = newVal;
            //新添加数据也创建
            if (Array.isArray(newVal)) {
                return new Observer(newVal, ARRAY);
            } else if (typeof newVal === 'object') {
                return new Observer(newVal, OBJECT);
            }
            ob.notify('set', key, newVal);
            ob.notify(`set:${key}`, key, newVal);
        }
    });
};

/**
 * 调用创建observer函数
 * 并且判断是否有父节点,如果有,则存储父节点到自身,
 * 目的是为了方便后面事件传播使用
 * @param key {string} 键值
 * @param val {Any} 属性值
 */
 Observer.prototype.observe = function(key, val) {
    let ob = Observer.create(val);
    if (!ob) return;
    ob.parent = {
        key,
        ob: this
    };
};
/**
 * 根据不同的数据类型,调用observer构造函数
 * @param value {Any} 数据
 * @returns {Observer}
 */
 Observer.create = function(value) {
    if (Array.isArray(value)) {
        return new Observer(value, ARRAY);
    } else if (typeof value === 'object') {
        return new Observer(value, OBJECT);
    }
};
/**
 * 这个方法是用来处理如下情况: var ary = [1,{name:liangshaofeng}]
 * 也就是说,当数组的某些项是一个对象的时候,
 * 那么需要给这个对象创建observer监听它
 * @param items {Array} 待处理数组
 */
 Observer.prototype.link = function(items) {
    items.forEach((value, index) => {
        this.observe(index, value);
    });
};

/**
 * 订阅事件
 * @param event {string} 事件类型
 * @param fn {Function} 对调函数
 * @returns {Observer} 观察者对象
 */
 Observer.prototype.on = function(event, fn) {
    this._cbs = this._cbs || {};
    if (!this._cbs[event]) {
        this._cbs[event] = [];
    }
    this._cbs[event].push(fn);

    // 这里return this是为了实现.on(...).on(...)这样的级联调用
    return this;
};

/**
 * 取消订阅事件
 * @param event {string} 事件类型
 * @param fn {Function} 回调函数
 * @returns {Observer} 观察者对象
 */
 Observer.prototype.off = function(event, fn) {
    this._cbs = this._cbs || {};

    // 取消所有订阅事件
    if (!arguments.length) {
        this._cbs = {};
        return this;
    }

    let callbacks = this._cbs[event];
    if (!callbacks) return this;

    // 取消特定事件
    if (arguments.length === 1) {
        delete this._cbs[event];
        return this;
    }

    // 取消特定事件的特定回调函数
    for (let i = 0, cb; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn) {
            callbacks.splice(i, 1);
            break;
        }
    }
    return this;
};

/**
 * 触发消息, 并且将消息逐层往上传播
 *
 */
 Observer.prototype.notify = function(event, path, val) {
    this.emit(event, path, val);
    let parent = this.parent;
    if (!parent) return;
    let ob = parent.ob;
    if (event.indexOf('set:')!=-1) {
        ob.notify(event.replace(path,parent.key), parent.key, this.value);//$watch向父级冒泡
    }else{
        ob.notify(event, path, val);//set双向绑定事件
    }
    
};

/**
 * 触发执行回调函数
 * @param event {string} 事件类型
 * @param event {path} 事件触发路径
 *
 */
 Observer.prototype.emit = function(event, path, val) {
    this._cbs = this._cbs || {};
    let callbacks = this._cbs[event];
    if (!callbacks) return;
    callbacks = callbacks.slice(0);
    callbacks.forEach((cb, i) => {
        callbacks[i].apply(this, arguments);
    });
};

/**
 * 指令构造函数
 * @param name {string} 值为"text", 代表是文本节点
 * @param el {Element} 对应的DOM元素
 * @param vm {Bue} bue实例
 * @param expression {String} 指令表达式，例如 "name"
 *  @param attr {String} 值为'nodeValue', 代表数据值对应的书节点的值
 * @constructor
 */
 function Directive(name, el, vm, expression) {
    this.name = name;
    this.el = el;
    this.vm = vm;
    this.expression = expression;
    this.attr = 'nodeValue';

    this.update();
}

Directive.prototype.update = function() {
    var a = this.vm.$data[this.expression];

    var propertyNames = this.expression.split(".");
    var val=this.vm.$data;
    var h = 0;
    for (; h < propertyNames.length; h++) {
        val = val[propertyNames[h]];
    }
    this.el[this.attr] = val;
    console.log(`更新了DOM-${this.expression}`);
};

function Bue(options) {
    this._init(options);
}
// 导入指令构造函数函数结束
Bue.prototype = {
    constructor: Bue,
    $mount: function() {
        console.log('我要开始重新渲染啦');
        this._compile();
    },
    $watch: function(key, fn) {
        let _fn = function() {
            fn(arguments[2]);
        };

        let pathAry = key.split('.');
        if (pathAry.length === 1) {
            this.$data.$observer.on(`set:${key}`, _fn.bind(this));
        } else {
            let _temp = this.$data;
            let lastProperty = pathAry.pop();

            pathAry.forEach((property) => {
                _temp = _temp[property];
            });
            _temp.$observer.on(`set:${lastProperty}`, _fn.bind(this));
        }
    },
    _updateBindingAt: function() {
        var a=arguments;
        let path = arguments[1];
        this._directives.forEach((directive) => {
            var exps=directive.expression.split('.');

            if (exps[exps.length-1] !== path) return;
            directive.update();
        });
    },
    observer: Observer
};
var p = Bue.prototype;
p._init = function(options) {
    this.$options = options;
    this.$data = options.data;
    this.$el = document.querySelector(options.el);
   // this.$template = this.$el.cloneNode(true);
   this._directives = [];

    // 创建观察对象
    this.observer = this.observer.create(this.$data);
    //bind，绑定this值。
    this.observer.on('set', this._updateBindingAt.bind(this));//全局set

    // 渲染挂载
    this.$mount();
};
p._compile = function() {
    this._compileNode(this.$el);
};

p._compileElement = function(node) {
    if (node.hasChildNodes()) {
        Array.from(node.childNodes).forEach(this._compileNode, this);
    }
};

p._compileText = function(node) {
    let tokens = this.parse(node.nodeValue);
    if (!tokens) return;
    tokens.forEach((token) => {
        if (token.tag) {
            // 指令节点
            let value = token.value;
            let el = document.createTextNode('');
            node.parentNode.insertBefore(el, node);
            this._bindDirective('text', value, el);
        } else {
            // 普通文本节点
            let el = document.createTextNode(token.value);
            node.parentNode.insertBefore(el, node);
        }
    });
    node.parentNode.removeChild(node);
};
  /**
 * 将文本节点如"{{user.name}}1111",解析成["user.name","1111"]两个节点
 * @param text {String} 例如 "{{user.name}}1111"
 */
 p.parse = function (text) {
    const tagRE = /\{\{(.+?)\}\}/g;
    if (text.trim() === '' || !tagRE.test(text)) return null;
    let tokens = [],
    match, index, value, lastIndex = 0;
    tagRE.lastIndex = 0;
    while (match = tagRE.exec(text)) {
        index = match.index;
        if (index > lastIndex) {
            tokens.push({
                value: text.slice(lastIndex, index)
            });
        }
        index = match.index;
        value = match[1];
        tokens.push({
            tag: true,
            value: value.trim()
        });
        lastIndex = index + match[0].length;
    }
    if (lastIndex < text.length - 1) {
        tokens.push({
            value: text.slice(lastIndex)
        });
    }
    return tokens;
};
p._compileNode = function(node) {
    switch (node.nodeType) {
        // text
        case 1:
        this._compileElement(node);
        break;
        // node
        case 3:
        this._compileText(node);
        break;
        default:
        break;
    }
};

p._bindDirective = function(name, expression, node) {
    let dirs = this._directives;
    dirs.push(
        new Directive(name, node, this, expression)
        );
};

const app = new Bue({
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

app.$watch('name',function(newVal){
    console.log('更改name'+newVal);
})
app.$watch('address.info.city',function(newVal){
    console.log('更改city'+newVal);
})
app.$watch('address',function(newVal){
    console.log('更改address'+newVal);
})

window.app = app;

const class2type: any = {},
    toString = class2type.toString;

"Boolean Number String Function Array Date RegExp Object Error"
    .split(" ")
    .forEach(name => {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

function isWindow(obj: any) {
    return obj != null && obj == obj.window;
}

function type(obj: any) {
    return obj == null
        ? String(obj)
        : class2type[toString.call(obj)] || "object";
}

function isObject(obj: any) {
    return type(obj) == "object";
}

function isPlainObject(obj: any) {
    return (
        isObject(obj) &&
        !isWindow(obj) &&
        Object.getPrototypeOf(obj) == Object.prototype
    );
}

function clone(target: any, source: any, deep: boolean) {
    for (const key in source)
        if (
            deep &&
            (isPlainObject(source[key]) || Array.isArray(source[key]))
        ) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                target[key] = {};
            if (Array.isArray(source[key]) && !Array.isArray(target[key]))
                target[key] = [];
            clone(target[key], source[key], deep);
        } else if (source[key] !== undefined) target[key] = source[key];
}

// 继承实现 参考：https://github.com/madrobby/zepto/blob/master/src/zepto.js
export default function extend(target: any, ...args: any[]) {
    let deep: boolean;
    if (typeof target == "boolean") {
        deep = target;
        target = args.shift();
    }
    args.forEach(function(arg) {
        clone(target, arg, deep);
    });
    return target;
}

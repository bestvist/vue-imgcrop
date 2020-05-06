import extend from "./extend";
// 非负数实现
export function nonnegative(val: number) {
    return val < 0 ? 0 : val;
}

export { extend };

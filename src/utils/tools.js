/**
 * 深度克隆对象
 * @param {any} Obj
 */
export function clone(Obj) {
    let buf
    if (Obj instanceof Array) {
        buf = []  // 创建一个空的数组
        let i = Obj.length
        while (i--) {
            buf[i] = clone(Obj[i])
        }
        return buf
    } else if (Obj instanceof Object) {
        buf = {}  // 创建一个空对象
        for (let k in Obj) {  // 为这个对象添加新的属性
            buf[k] = clone(Obj[k])
        }
        return buf
    } else {
        return Obj
    }
}
/**
 * 根据值获取属性名称
 * @param {any} obj
 * @param {any} val
 */
export function getPropByValue(obj, val) {
    let result = ''
    for (let pro in obj) {
        if (obj[pro] === val) {
            result = pro
        }
    }
    return result
}
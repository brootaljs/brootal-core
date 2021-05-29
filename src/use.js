export default (classForExtend, plugin) => {
    if (plugin.staticMethods) {
        Object.assign(classForExtend, plugin.staticMethods);
    }

    if (plugin.protoMethods) {
        Object.assign(classForExtend.prototype, plugin.protoMethods);
    }
}
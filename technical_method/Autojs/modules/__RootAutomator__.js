module.exports = function (runtime, scope) {
    var RA = com.stardust.autojs.core.inputevent.RootAutomator;
    function RootAutomator(options) {
        options = options || {};
        let inputDevice = options.inputDevice == undefined ? null : options.inputDevice;
        if(!options.adb) {
            options.root = true;
        }
        this.__ra__ = Object.create(new RA(scope.context, inputDevice, $shell._getShellOptions(options)));
        var methods = ["sendEvent", "touch", "setScreenMetrics", "touchX", "touchY", "sendSync", "sendMtSync", "tap",
            "swipe", "press", "longPress", "touchDown", "touchUp", "touchMove", "getDefaultId", "setDefaultId", "exit"];
        for (var i = 0; i < methods.length; i++) {
            var method = methods[i];
            this[method] = this.__ra__[method].bind(this.__ra__);
        }
        return this;
    }
    return RootAutomator;
}
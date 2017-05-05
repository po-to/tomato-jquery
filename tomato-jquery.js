(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@po-to/tomato"));
	else if(typeof define === 'function' && define.amd)
		define(["@po-to/tomato"], factory);
	else if(typeof exports === 'object')
		exports["tomato-jquery"] = factory(require("@po-to/tomato"));
	else
		root["tomato-jquery"] = factory(root["@po-to/tomato"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(2), __webpack_require__(6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, tomato, css, tpl_Dialog) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    //tomato.include(css, tpl_Dialog);
	    var emptyFun = function (data) { };
	    emptyFun(css);
	    var autoID = 0;
	    function assignObject(target) {
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
	            var item = args_1[_a];
	            for (var key in item) {
	                if (item.hasOwnProperty(key)) {
	                    target[key] = item[key];
	                }
	            }
	        }
	        return target;
	    }
	    var jdomMethods = {
	        groupBy: function (attr) {
	            var dlist = {};
	            var key, i, k, o;
	            attr = attr || "data-dom";
	            for (i = 0, k = this.length; i < k; i++) {
	                o = this[i];
	                key = o.getAttribute(attr);
	                if (key) {
	                    if (dlist[key]) {
	                        dlist[key].push(o);
	                    }
	                    else {
	                        dlist[key] = [o];
	                    }
	                }
	            }
	            return dlist;
	        },
	        removeChild: function (child) {
	            child.detach();
	        },
	        appendChild: $.fn.append,
	        setZIndex: function (index) {
	            this.css('z-index', index + dialogZIndexStart);
	        },
	        getVID: function () {
	            var str = this.attr("data-vid");
	            if (!str) {
	                str = "v" + (autoID++);
	                this.setVID(str);
	            }
	            return str;
	        },
	        setVID: function (id) {
	            this.attr("data-vid", id);
	        },
	        getVCON: function () {
	            return this.attr("data-vcon") || "";
	        },
	        getSUBS: function () {
	            var container = this[0];
	            return this.find("[data-vid]").get().filter(function (div) {
	                while (div.parentNode != container) {
	                    div = div.parentNode;
	                    if (div.getAttribute("data-vid")) {
	                        return false;
	                    }
	                }
	                return true;
	            }).map(function (div) {
	                return $(div);
	            });
	        }
	    };
	    for (var p in jdomMethods) {
	        if ($.fn.hasOwnProperty(p)) {
	            console.log(p + " is override!");
	        }
	        else {
	            $.fn[p] = jdomMethods[p];
	        }
	    }
	    var dialogZIndexStart = 1000;
	    exports.TurnEffect = {
	        slide: "tdom-slide",
	        cover: "tdom-cover",
	    };
	    assignObject(tomato.DialogEffect, {
	        swipeUp: "swipeUp",
	        swipeDown: "swipeDown",
	        swipeLeft: "swipeLeft",
	        swipeRight: "swipeRight",
	        slideUp: "slideUp",
	        slideDown: "slideDown",
	        slideLeft: "slideLeft",
	        slideRight: "slideRight",
	    });
	    var tmps = (function () {
	        var style = document.documentElement.style;
	        var animationEnd, transform;
	        if ('animation' in style) {
	            animationEnd = 'animationend'; //transitionend
	        }
	        else if ('WebkitAnimation' in style) {
	            animationEnd = 'webkitAnimationEnd'; //webkitTransitionEnd
	        }
	        else {
	            animationEnd = "";
	        }
	        if ('transform' in style) {
	            transform = 'transform';
	        }
	        else if ('WebkitTransform' in style) {
	            transform = '-webkit-transform';
	        }
	        else if ('msTransform' in style) {
	            transform = '-ms-transform';
	        }
	        else {
	            transform = '';
	        }
	        return { animationEnd: animationEnd, transform: transform };
	    })();
	    var AnimationEnd = tmps.animationEnd;
	    var Transform = tmps.transform;
	    function getWindowSize() {
	        return { width: window.innerWidth || $(window).width(), height: window.innerHeight || $(window).height() };
	        //var zoomLevel:number = document.documentElement.clientWidth / window.innerWidth;
	        //return {width:document.documentElement.clientWidth,height:zoomLevel?Math.round(window.innerHeight * zoomLevel):document.documentElement.clientHeight};
	    }
	    exports.getWindowSize = getWindowSize;
	    var View = (function (_super) {
	        __extends(View, _super);
	        function View(viewComponent, parent, vid) {
	            var _this = _super.call(this, viewComponent, parent, vid) || this;
	            _this._els = {};
	            return _this;
	        }
	        View.prototype.find = function (str) {
	            return this.viewComponent.find(str);
	        };
	        // setInstallEffect(isBack:boolean){
	        //     this.view.attr('data-back', isBack?"true":'');
	        //     if(this.isWholeView()){
	        //         let mod:tomato.WholeView = this;
	        //         let jdom:JQuery|null = mod.getHeader() as JQuery;
	        //         jdom && jdom.attr('data-back', isBack?"true":'');
	        //         jdom = mod.getFooter() as JQuery;
	        //         jdom && jdom.attr('data-back', isBack?"true":'');
	        //         jdom = mod.getAside() as JQuery;
	        //         jdom && jdom.attr('data-back', isBack?"true":'');
	        //     }
	        // }
	        View.prototype.getInstallEffect = function () {
	            return !!this.viewComponent.attr('data-back');
	        };
	        View.prototype._evt_open = function (data) {
	            var options;
	            if (typeof data == "string") {
	                options = { url: data };
	            }
	            else {
	                options = data;
	            }
	            var target = options.target || exports.DialogTarget.Blank;
	            if (options.target == exports.DialogTarget.Self) {
	                target = this.getDialog();
	            }
	            tomato.asyncGetView(options.url).then(function (vp) {
	                open(vp, target);
	            });
	            return false;
	        };
	        View.prototype._getElements = function () {
	            return this.find("[dom]").groupBy("dom");
	        };
	        View.prototype._watchEvent = function (funs, jdom) {
	            var _this = this;
	            var actions = funs || this;
	            var viewComponent = jdom || this.viewComponent;
	            var callAction = function (action, type, target, hit) {
	                //console.log(type,target,hit);
	                var arr = action.split("@");
	                action = arr[0];
	                var data = arr[1];
	                var fun = actions["_evt_" + action];
	                if (fun) {
	                    if (data) {
	                        var s = data.substr(0, 1);
	                        var e = data.substr(data.length - 1, 1);
	                        if ((s == "{" && e == "}") || (s == "[" && e == "]")) {
	                            data = JSON.parse(data);
	                        }
	                    }
	                    //project.addActive(target);
	                    return fun.call(_this, data, target, hit);
	                }
	                else {
	                    return true;
	                }
	            };
	            viewComponent.on("click", function (e) {
	                var type = e.type;
	                var hit = e.target;
	                var target = e.target;
	                var nodeName = target.nodeName;
	                var propagation = true;
	                var root = this;
	                if (type == "focusin" && nodeName != "INPUT" && nodeName != "TEXTARE") {
	                    return true;
	                }
	                if (type == "click" && (nodeName == "FORM" || nodeName == "SELECT" || nodeName == "OPTION" || nodeName == "TEXTARE" || nodeName == "INPUT" || (nodeName == "LABEL" && target.htmlFor))) {
	                    return true;
	                }
	                if (type == "change" && (nodeName == "FORM" || nodeName == "TEXTARE" || nodeName == "INPUT")) {
	                    return true;
	                }
	                while (target && target != root) {
	                    var actions_1 = target.getAttribute("evt");
	                    if (actions_1 && (!target.hasAttribute("disabled") || target.getAttribute("disabled") == 'false')) {
	                        actions_1.split("|").forEach(function (action) {
	                            propagation = (callAction(action, type, target, hit) ? true : false) && propagation;
	                        });
	                        return propagation;
	                    }
	                    if (target.nodeName == "FORM") {
	                        return true;
	                    }
	                    target = target.parentNode;
	                }
	                return true;
	            });
	        };
	        return View;
	    }(tomato.View));
	    exports.View = View;
	    var Application = (function (_super) {
	        __extends(Application, _super);
	        function Application(rootUri, els, config) {
	            var _this = _super.call(this, rootUri, els) || this;
	            _this.viewComponent.addClass("tdom-application");
	            return _this;
	        }
	        return Application;
	    }(tomato.Application));
	    exports.Application = Application;
	    var Dialog = (function (_super) {
	        __extends(Dialog, _super);
	        function Dialog(config, els) {
	            var _this = this;
	            if (!els) {
	                var viewComponent = $(tpl_Dialog);
	                var comps = viewComponent.find("[data-dom]").groupBy();
	                els = { viewComponent: viewComponent, dialog: $(comps['dialog']), mask: $(comps['mask']), body: $(comps['body']) };
	            }
	            _this = _super.call(this, els, config) || this;
	            _this.viewComponent.addClass("tdom-dialog");
	            var that = _this;
	            _this.mask && _this.mask.on("click", function () {
	                that.close();
	            });
	            AnimationEnd && _this.dialog.on(AnimationEnd, function (e) {
	                if (e.originalEvent['animationName'] == this.getAttribute("data-animation")) {
	                    this.setAttribute("data-animation", "");
	                    if (that.viewComponent.hasClass("tdom-animation-show")) {
	                        that.viewComponent.removeClass("tdom-animation-show");
	                    }
	                    else {
	                        that.viewComponent.removeClass("tdom-animation-hide");
	                        that._setState(tomato.DialogState.Closed, true);
	                    }
	                    setTimeout(function () {
	                        that._onEffectCompleted();
	                    }, 0);
	                    return false;
	                }
	            });
	            return _this;
	        }
	        Dialog.prototype._onEffectCompleted = function () {
	            this.viewComponent.trigger("completed");
	            if (this._removeAfterClosed) {
	                this._removeAfterClosed = false;
	                this.parent && this.parent.removeChild(this);
	            }
	        };
	        Dialog.prototype._setState = function (state, disableEffect) {
	            var that = this;
	            var ostate = this.state;
	            if (!AnimationEnd) {
	                _super.prototype._setState.call(this, state);
	                setTimeout(function () {
	                    that._onEffectCompleted();
	                }, 0);
	            }
	            else if (disableEffect) {
	                _super.prototype._setState.call(this, state);
	            }
	            else {
	                if (this.state == tomato.DialogState.Closed) {
	                    _super.prototype._setState.call(this, state);
	                    this.viewComponent.addClass("tdom-animation-show");
	                    this.dialog.attr("data-animation", "tdom-dialog-show-pt-" + this.config.effect);
	                }
	                else if (state == tomato.DialogState.Closed) {
	                    this.viewComponent.addClass("tdom-animation-hide");
	                    this.dialog.attr("data-animation", "tdom-dialog-hide-pt-" + this.config.effect);
	                }
	                else {
	                    _super.prototype._setState.call(this, state);
	                    setTimeout(function () {
	                        that._onEffectCompleted();
	                    }, 0);
	                }
	            }
	            if (ostate == tomato.DialogState.Closed) {
	                this._fixNotSupportTransform();
	            }
	        };
	        Dialog.prototype.close = function (removeAfterClosed) {
	            if (removeAfterClosed === void 0) { removeAfterClosed = true; }
	            if (_super.prototype.close.call(this)) {
	                this._removeAfterClosed = removeAfterClosed;
	                return true;
	            }
	            else {
	                return false;
	            }
	        };
	        Dialog.prototype._afterConfigChange = function (oldConfig) {
	            _super.prototype._afterConfigChange.call(this, oldConfig);
	            this.dialog.removeClass([(oldConfig.width == "auto" || oldConfig.width == "") ? "tdom-wrapWidth" : "", (oldConfig.height == "auto" || oldConfig.height == "") ? "tdom-wrapHeight" : ""].join(" "));
	            var config = this.config;
	            this.dialog.addClass([(config.width == "auto" || config.width == "") ? "tdom-wrapWidth" : "", (config.height == "auto" || config.height == "") ? "tdom-wrapHeight" : ""].join(" "));
	            var xPos = this.config.x;
	            var yPos = this.config.y;
	            var xOffset = this.config.offsetX;
	            var yOffset = this.config.offsetY;
	            var dialogCss = { width: this.config.width, height: this.config.height, marginLeft: xOffset || 0, marginTop: yOffset || 0 };
	            var dialogPosition = tomato.DialogPosition;
	            switch (xPos) {
	                case dialogPosition.left:
	                    dialogCss.left = 0;
	                    break;
	                case dialogPosition.right:
	                    dialogCss.right = 0;
	                    break;
	                case dialogPosition.center:
	                    dialogCss.left = "50%";
	                    break;
	                default:
	                    dialogCss.left = xPos;
	            }
	            switch (yPos) {
	                case dialogPosition.top:
	                    dialogCss.top = 0;
	                    break;
	                case dialogPosition.bottom:
	                    dialogCss.bottom = 0;
	                    break;
	                case dialogPosition.middle:
	                    dialogCss.top = "50%";
	                    break;
	                default:
	                    dialogCss.top = yPos;
	            }
	            if (xPos == dialogPosition.center && yPos == dialogPosition.middle) {
	                dialogCss[Transform] = "translate(-50%,-50%)";
	            }
	            else if (xPos == dialogPosition.center) {
	                dialogCss[Transform] = "translateX(-50%)";
	            }
	            else if (yPos == dialogPosition.middle) {
	                dialogCss[Transform] = "translateY(-50%)";
	            }
	            else {
	                dialogCss[Transform] = "none";
	            }
	            this.dialog.css(dialogCss);
	        };
	        Dialog.prototype._fixNotSupportTransform = function () {
	            if (!Transform) {
	                var xPos = this.config.x;
	                var yPos = this.config.y;
	                var width = -Math.round(this.dialog.width() / 2);
	                var height = -Math.round(this.dialog.height() / 2);
	                var dialogCss = void 0;
	                var dialogPosition = tomato.DialogPosition;
	                if (xPos == dialogPosition.center && yPos == dialogPosition.middle) {
	                    dialogCss = { marginLeft: width + "px", marginTop: height + "px" };
	                }
	                else if (xPos == dialogPosition.center) {
	                    dialogCss = { marginLeft: width + "px" };
	                }
	                else if (yPos == dialogPosition.middle) {
	                    dialogCss = { marginTop: height + "px" };
	                }
	                if (dialogCss) {
	                    $(this.dialog[0].children[0]).css(dialogCss);
	                }
	            }
	        };
	        Dialog.prototype.onWindowResize = function () {
	            var options = {};
	            if (this.config.expWidth) {
	                var value = this._parseExpr(this.config.expWidth, "width");
	                if (!isNaN(value)) {
	                    options.width = value + "px";
	                }
	            }
	            if (this.config.expHeight) {
	                var value = this._parseExpr(this.config.expHeight, "height");
	                if (!isNaN(value)) {
	                    options.height = value + "px";
	                }
	            }
	            if (this.config.expOffsetX) {
	                var value = this._parseExpr(this.config.expOffsetX, "width");
	                if (!isNaN(value)) {
	                    options.offsetX = value + "px";
	                }
	            }
	            if (this.config.expOffsetY) {
	                var value = this._parseExpr(this.config.expOffsetY, "height");
	                if (!isNaN(value)) {
	                    options.offsetY = value + "px";
	                }
	            }
	            if (this.config.expX) {
	                var value = this._parseExpr(this.config.expX, "left");
	                if (!isNaN(value)) {
	                    options.x = value + "px";
	                }
	            }
	            if (this.config.expY) {
	                var value = this._parseExpr(this.config.expY, "top");
	                if (!isNaN(value)) {
	                    options.y = value + "px";
	                }
	            }
	            this.setConfig(options);
	            this._fixNotSupportTransform();
	        };
	        Dialog.prototype._parseExpr = function (value, worh) {
	            var target = undefined, expr = '';
	            var els, multiple, multipleNum, increment, incrementNum;
	            if (typeof value == "function") {
	                return value(this);
	            }
	            else if (Array.isArray(value)) {
	                target = value[0], expr = value[1];
	                expr = 'target' + expr;
	            }
	            else if (typeof value == "object") {
	                target = value;
	            }
	            else if (typeof value == "string") {
	                expr = value;
	            }
	            if (expr) {
	                var arr = expr.match(/^([^*/+-]+)(([*/])([\+\-\d.]+?))?(([+-])(\d+))?$/);
	                if (arr) {
	                    els = arr[1], multiple = arr[3], multipleNum = arr[4], increment = arr[6], incrementNum = arr[7];
	                    if (!target) {
	                        target = $(els);
	                    }
	                }
	            }
	            if (target && target.length) {
	                var methon = { "width": "outerWidth", "height": "outerHeight" };
	                var outerWorH = methon[worh];
	                var value_1 = (worh == "width" || worh == "height") ? target[outerWorH]() : target.offset()[worh];
	                if (multiple) {
	                    multipleNum = parseFloat(multipleNum);
	                    if (multiple == '*') {
	                        value_1 *= multipleNum;
	                    }
	                    else {
	                        value_1 /= multipleNum;
	                    }
	                }
	                if (increment) {
	                    incrementNum = parseInt(incrementNum);
	                    if (increment == '+') {
	                        value_1 += incrementNum;
	                    }
	                    else {
	                        value_1 -= incrementNum;
	                    }
	                }
	                return value_1;
	            }
	            else {
	                return NaN;
	            }
	        };
	        return Dialog;
	    }(tomato.Dialog));
	    exports.Dialog = Dialog;
	    function turnContainer(container, effect) {
	        if (effect === void 0) { effect = exports.TurnEffect.slide; }
	        container.addClass("tdom-turnContainer " + effect);
	        AnimationEnd && container.on(AnimationEnd, function (e) {
	            if (e.originalEvent['animationName'] == this.getAttribute("data-animation")) {
	                $(this).attr("data-animation", "").removeClass("tdom-animation").trigger("completed");
	                return false;
	            }
	        });
	        container.removeChild = function (view) {
	        };
	        container.appendChild = function (view) {
	            var _this = this;
	            var div = this[0];
	            var children = div.children;
	            var content = null;
	            var oview = null;
	            if (children.length == 0) {
	                content = document.createElement("div");
	                div.appendChild(content);
	            }
	            else if (children.length == 1) {
	                content = children[0];
	            }
	            else if (children.length == 2) {
	                oview = children[0];
	                content = children[1];
	            }
	            else {
	                this.empty();
	                content = document.createElement("div");
	                div.appendChild(content);
	            }
	            if (content) {
	                if (content == view[0]) {
	                    return;
	                }
	                //$(content).removeClass("tdom-current")
	                //.addClass("tdom-previous")
	                $(content).attr("data-pos", div.scrollLeft + "," + div.scrollTop);
	            }
	            oview && $(oview).detach();
	            //view.removeClass("tdom-previous").addClass("tdom-current tdom-page");
	            div.appendChild(view[0]);
	            var pos = (view.attr("data-pos") || "0,0").split(",");
	            div.scrollLeft = parseInt(pos[0]);
	            div.scrollTop = parseInt(pos[1]);
	            var direction = this.attr("data-back") ? "tdom-back" : "";
	            this.removeClass("tdom-back").addClass(direction + " tdom-animation");
	            this.attr("data-animation", "tdom-turnContainer-" + effect + "-" + direction);
	            if (!AnimationEnd) {
	                setTimeout(function () {
	                    _this.removeClass("tdom-animation");
	                    _this.trigger("completed");
	                }, 0);
	            }
	        };
	        return container;
	    }
	    exports.turnContainer = turnContainer;
	    /*.tdom-turnContainer{
	                overflow: hidden;
	            }
	            .tdom-turnContainer > .tdom-panel > .tdom-previous{
	               
	                position: absolute;
	                width: 100%;
	                height: 100%;
	                left: -100%;
	                top: 0;
	            }
	            .tdom-turnContainer > .tdom-panel.tdom-transform > .tdom-previous{
	                
	            }
	            .tdom-turnContainer > .tdom-panel.tdom-transform{
	                transition:none;
	                transform: translateX(100%)
	            }
	            .tdom-turnContainer > .tdom-panel{
	                transition : transform 10000ms ease-out;
	            }*/
	    // export function turnContainer(container: JQuery, effect:string=TurnEffect.cover): JQuery {
	    //     let comps = container.html(tpl_TurnContainer).addClass("tdom-turnContainer "+effect).find("[data-dom]").groupBy();
	    //     let content: JQuery | null;
	    //     container.removeChild = function (view: JQuery): void {
	    //     };
	    //     container.appendChild = function (view: JQuery): void {
	    //         var pos: string[], page: JQuery, panel: JQuery, scroller: HTMLElement;
	    //         if (content) {
	    //             if (content[0] == view[0]) {
	    //                 return;
	    //             }
	    //             page = content.parent();
	    //             scroller = page[0];
	    //             content.attr("data-pos", scroller.scrollLeft + "," + scroller.scrollTop);
	    //         } else {
	    //             page = $(comps['page'][0]);
	    //         }
	    //         page.removeClass("tdom-current").addClass("tdom-previous");
	    //         pos = (view.attr("data-pos") || "0,0").split(",");
	    //         page = comps['page'][0] == page[0] ? $(comps['page'][1]) : $(comps['page'][0]);
	    //         panel = $(comps['panel']);
	    //         let oview = page[0].firstChild;
	    //         if(oview){
	    //             $(oview).detach();
	    //         }
	    //         page.append(view);
	    //         content = view;
	    //         page.removeClass("tdom-previous").addClass("tdom-current");
	    //         panel.removeClass("tdom-back").addClass("tdom-transform");
	    //         panel[0].offsetWidth;
	    //         panel.removeClass("tdom-transform");
	    //         scroller = page[0];
	    //         scroller.scrollLeft = parseInt(pos[0]);
	    //         scroller.scrollTop = parseInt(pos[1]);
	    //     }
	    //     return container;
	    // }
	    var hideDiv = $("<div style='position:absolute;width:100%;height:100%;left:-100%;top:-100%;overflow: hidden;'></div>").appendTo(document.body);
	    tomato.setConfig({
	        createViewComponent: function (data) {
	            if (typeof data == "string") {
	                return $(data).appendTo(hideDiv);
	            }
	            else if (typeof data.view == "string") {
	                return $(data.view).appendTo(hideDiv);
	            }
	            else {
	                return data;
	            }
	        }
	    });
	    function setConfig(data) {
	        if (data.dialogZIndexStart) {
	            dialogZIndexStart = data.dialogZIndexStart;
	        }
	    }
	    exports.setConfig = setConfig;
	    exports.DialogTarget = {
	        "Blank": "_blank",
	        "Self": "_self",
	        "Root": "_root",
	        "Top": "_top"
	    };
	    function open(content, target, dialogOptions) {
	        var dialog = tomato.application;
	        if (!target) {
	            target = exports.DialogTarget.Blank;
	        }
	        if (target == exports.DialogTarget.Self || target == exports.DialogTarget.Top) {
	            dialog = tomato.getTopDialog();
	            dialogOptions && dialog.setConfig(dialogOptions);
	        }
	        else if (target == exports.DialogTarget.Blank) {
	            dialog = new Dialog(dialogOptions || { masked: true, effect: tomato.DialogEffect.scale });
	            tomato.application.appendChild(dialog);
	        }
	        else {
	            dialog = target;
	            dialogOptions && dialog.setConfig(dialogOptions);
	        }
	        dialog.appendChild(content);
	        dialog.focus();
	        return dialog;
	    }
	    exports.open = open;
	    ;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/.0.26.4@css-loader/index.js!../node_modules/.6.0.3@sass-loader/lib/loader.js!./css.scss", function() {
				var newContent = require("!!../node_modules/.0.26.4@css-loader/index.js!../node_modules/.6.0.3@sass-loader/lib/loader.js!./css.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "@keyframes tdom-turnContainer-tdom-slide- {\n  from {\n    transform: translateX(100%); }\n  to {\n    transform: none; } }\n\n@keyframes tdom-turnContainer-tdom-slide-tdom-back {\n  from {\n    transform: translateX(-100%); }\n  to {\n    transform: none; } }\n\n@keyframes tdom-turnContainer-tdom-cover- {\n  from {\n    transform: translateX(100%); }\n  to {\n    transform: none; } }\n\n@keyframes tdom-turnContainer-tdom-cover-tdom-back {\n  from {\n    transform: translateX(-100%); }\n  to {\n    transform: none; } }\n\n.tdom-turnContainer {\n  position: relative;\n  overflow-x: hidden;\n  overflow-y: auto; }\n  .tdom-turnContainer > *:first-child {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    top: 0;\n    display: none; }\n  .tdom-turnContainer.tdom-animation > *:first-child {\n    display: block; }\n  .tdom-turnContainer.tdom-slide > *:first-child {\n    left: -100%; }\n  .tdom-turnContainer.tdom-slide.tdom-animation > * {\n    animation: tdom-turnContainer-tdom-slide- 1000ms ease-out forwards; }\n  .tdom-turnContainer.tdom-slide.tdom-back > *:first-child {\n    left: 100%; }\n  .tdom-turnContainer.tdom-slide.tdom-back.tdom-animation > * {\n    animation: tdom-turnContainer-tdom-slide-tdom-back 1000ms ease-out forwards; }\n  .tdom-turnContainer.tdom-cover > *:first-child {\n    left: 0; }\n  .tdom-turnContainer.tdom-cover.tdom-animation > *:last-child {\n    animation: tdom-turnContainer-tdom-cover- 1000ms ease-out forwards; }\n  .tdom-turnContainer.tdom-cover.tdom-back.tdom-animation > *:last-child {\n    animation: tdom-turnContainer-tdom-cover-tdom-back 1000ms ease-out forwards; }\n\n@keyframes tdom-dialog-show-mask {\n  from {\n    opacity: 0; }\n  to {\n    opacity: 1; } }\n\n@keyframes tdom-dialog-hide-mask {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0; } }\n\n@keyframes tdom-dialog-show-pt-scale {\n  from {\n    opacity: 0;\n    transform: scale(0.5, 0.5); }\n  to {\n    opacity: 1;\n    transform: none; } }\n\n@keyframes tdom-dialog-hide-pt-scale {\n  from {\n    opacity: 1;\n    transform: none; }\n  to {\n    opacity: 0;\n    transform: scale(0.5, 0.5); } }\n\n@keyframes tdom-dialog-show-pt-slideLeft {\n  from {\n    transform: translateX(100%); }\n  to {\n    transform: none; } }\n\n@keyframes tdom-dialog-hide-pt-slideLeft {\n  from {\n    transform: none; }\n  to {\n    transform: translateX(100%); } }\n\n.pt-mask {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  left: 0;\n  top: 0;\n  background: rgba(0, 0, 0, 0.5);\n  text-align: center;\n  display: none; }\n\n.pt-mask {\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#7f000000,endColorstr=#7f000000); }\n\n.pt-mask:before {\n  font-size: 0;\n  content: \".\";\n  display: block;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0;\n  top: 0; }\n\n:root .pt-mask {\n  filter: none; }\n\n:root .pt-mask:before {\n  content: none; }\n\n.pt-application > .pt-mask.pt-busy {\n  display: block; }\n\n.tdom-dialog {\n  position: relative; }\n  .tdom-dialog > .pt-dialog {\n    position: fixed;\n    background: transparent;\n    box-shadow: 5px 5px 5px #000; }\n    .tdom-dialog > .pt-dialog > *:first-child {\n      height: 100%;\n      width: 100%; }\n    .tdom-dialog > .pt-dialog.tdom-wrapWidth > *:first-child {\n      width: auto; }\n    .tdom-dialog > .pt-dialog.tdom-wrapHeight > *:first-child {\n      height: auto; }\n  .tdom-dialog.pt-masked > .pt-mask {\n    display: block; }\n  .tdom-dialog.pt-Closed {\n    display: none; }\n  .tdom-dialog .pt-body {\n    overflow-x: hidden;\n    overflow-y: auto; }\n\n.tdom-dialog.tdom-animation-show > .pt-dialog {\n  box-shadow: none;\n  overflow: hidden; }\n\n.tdom-dialog.tdom-animation-show > .pt-mask {\n  animation: tdom-dialog-show-mask 1000ms ease-out forwards; }\n\n.tdom-dialog.tdom-animation-hide > .pt-dialog {\n  box-shadow: none;\n  overflow: hidden; }\n\n.tdom-dialog.tdom-animation-hide > .pt-mask {\n  animation: tdom-dialog-hide-mask 1000ms ease-out forwards; }\n\n.tdom-dialog.pt-scale.tdom-animation-show > .pt-dialog > *:first-child {\n  animation: tdom-dialog-show-pt-scale 1000ms ease-out forwards; }\n\n.tdom-dialog.pt-scale.tdom-animation-hide > .pt-dialog > *:first-child {\n  animation: tdom-dialog-hide-pt-scale 1000ms ease-out forwards; }\n\n.tdom-dialog.pt-slideLeft.tdom-animation-show > .pt-dialog > *:first-child {\n  animation: tdom-dialog-show-pt-slideLeft 1000ms ease-out forwards; }\n\n.tdom-dialog.pt-slideLeft.tdom-animation-hide > .pt-dialog > *:first-child {\n  animation: tdom-dialog-hide-pt-slideLeft 1000ms ease-out forwards; }\n", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n\t<div data-dom=\"mask\"></div>\r\n\t<div data-dom=\"dialog\">\r\n\t\t<div data-dom=\"body\"></div>\r\n\t</div>\r\n</div>";

/***/ }
/******/ ])
});
;
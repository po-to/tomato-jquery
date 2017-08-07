import * as tomato from "@po-to@tomato";
import css = require("./css");
import tpl_Dialog = require('./tpl.Dialog');

//tomato.include(css, tpl_Dialog);

let emptyFun = function(data:any){}

emptyFun(css);

let autoID:number = 0;

function assignObject<T>(target:T,...args):T{
    for(let item of args){
        for(let key in item){
            if(item.hasOwnProperty(key)){
                target[key] = item[key];
            }
        }
    }
    return target;
}

declare global{
    interface JQuery{
        groupBy(attr?: string): { [x: string]: HTMLElement[] };
        removeChild(view: JQuery): void;
        appendChild(view: JQuery): void;
        setZIndex(index: number): void;
        getVID():string;
        setVID(id:string):void;
        getVCON():string;
        getSUBS():JQuery[];
    }
}
let jdomMethods = {
    groupBy: function (attr?: string) {
        let dlist: {} = {};
        let key, i, k, o;
        attr = attr || "data-dom";
        for (i = 0, k = this.length; i < k; i++) {
            o = this[i];
            key = o.getAttribute(attr);
            if (key) {
                if (dlist[key]) {
                    dlist[key].push(o);
                } else {
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
    setZIndex: function (index: number) {
        this.css('z-index', index + dialogZIndexStart);
    },
    getVID: function():string{
        let str = this.attr("data-vid");
        if(!str){
            str = "v"+(autoID++);
            this.setVID(str);
        }
        return str;
    },
    setVID: function(id:string):void{
        this.attr("data-vid",id);
    },
    getVCON: function():string{
        return this.attr("data-vcon") || "";
    },
    getSUBS: function(){
        let container:HTMLElement = this[0];
        return (this.find("[data-vid]").get() as Array<Node>).filter((div)=>{
            while(div.parentNode!=container){
                div = div.parentNode as Node;
                if((div as HTMLElement).getAttribute("data-vid")){
                    return false;
                }
            }
            return true;
        }).map(function(div){
            return $(div);
        });
    }
};
for (let p in jdomMethods) {
    if ($.fn.hasOwnProperty(p)) {
        console.log(p + " is override!")
    } else {
        $.fn[p] = jdomMethods[p];
    }
}
let dialogZIndexStart: number = 1000;


export const TurnEffect = {
    slide: "tdom-slide",
    cover: "tdom-cover",
}

declare module "@po-to@tomato"{
    interface IDialogEffect{
        swipeUp: string;
        swipeDown: string;
        swipeLeft: string;
        swipeRight: string;
        slideUp: string;
        slideDown: string;
        slideLeft: string;
        slideRight: string;
    }
    interface IDialogConfig{
        expWidth:string;
        expHeight:string;
        expX:string;
        expY:string;
        expOffsetX:string;
        expOffsetY:string;
    }
    interface IDialogConfigOptions{
        expWidth?:string;
        expHeight?:string;
        expX?:string;
        expY?:string;
        expOffsetX?:string;
        expOffsetY?:string;
    }
}

assignObject(tomato.DialogEffect,{
    swipeUp : "swipeUp",
    swipeDown: "swipeDown",
    swipeLeft: "swipeLeft",
    swipeRight: "swipeRight",
    slideUp: "slideUp",
    slideDown: "slideDown",
    slideLeft: "slideLeft",
    slideRight: "slideRight",
});

        


let tmps =  (function () {
    let style = document.documentElement.style;
    let animationEnd:string, transform:string;
    if ('animation' in style) {
        animationEnd = 'animationend';//transitionend
    }else if ('WebkitAnimation' in style) {
        animationEnd = 'webkitAnimationEnd';//webkitTransitionEnd
    }else{
        animationEnd = "";
    }
    if ('transform' in style) {
        transform = 'transform';
    }else if('WebkitTransform' in style){
        transform = '-webkit-transform';
    }else if('msTransform' in style){
        transform = '-ms-transform';
    }else{
        transform = '';
    }
    return {animationEnd,transform};
})();


const AnimationEnd: string = tmps.animationEnd;
const Transform: string = tmps.transform;


export function getWindowSize(): { width: number, height: number } {
    return { width: window.innerWidth || $(window).width(), height: window.innerHeight || $(window).height() }
    //var zoomLevel:number = document.documentElement.clientWidth / window.innerWidth;
    //return {width:document.documentElement.clientWidth,height:zoomLevel?Math.round(window.innerHeight * zoomLevel):document.documentElement.clientHeight};
}

function _watchEvent(view:tomato.View, jdom?: JQuery){
    jdom || (view.viewComponent as JQuery).on("click",  function(e) {
        let type = e.type;
        let hit = e.target;
        let target = e.target;
        let nodeName = target.nodeName;
        let propagation = true;
        let root: Element = this;
        if (type == "focusin" && nodeName != "INPUT" && nodeName != "TEXTARE") {
            return true;
        }
        if (type == "click" && (nodeName == "FORM" || nodeName == "SELECT" || nodeName == "OPTION" || nodeName == "TEXTARE" || nodeName == "INPUT" || (nodeName == "LABEL" && (target as any).htmlFor))) {
            return true;
        }
        if (type == "change" && (nodeName == "FORM" || nodeName == "TEXTARE" || nodeName == "INPUT")) {
            return true;
        }
        while (target && target != root) {
            let events = target.getAttribute("evt");
            if (events && (!target.hasAttribute("disabled") || target.getAttribute("disabled") == 'false')) {
                events.split("|").forEach(function (evt) {
                    let arr = evt.split("@");
                    let evtName = arr[0];
                    let data = arr[1];
                    if (data) {
                        let s = data.substr(0, 1);
                        let e = data.substr(data.length - 1, 1);
                        if ((s == "{" && e == "}") || (s == "[" && e == "]")) {
                            data = JSON.parse(data);
                        }
                    }
                    propagation = view['_triggerEvent'](evtName, data, {target:target, hit:hit, type:type}) && propagation;
                });
                return propagation;
            }
            if (target.nodeName == "FORM") {
                return true;
            }
            target = target.parentNode as Element;
        }
        return true;
    });
}
export class View extends tomato.View {
    readonly viewComponent: JQuery;
    readonly config:any;
    
    constructor(viewComponent: tomato.IViewComponent, parent?: tomato.View, vid?:string) {
        super(viewComponent, parent, vid);
        let json = this.viewComponent.children("script[type='text/config']").text();
        this.config = json?JSON.parse(json):null;
    }
    find(str: string): JQuery {
        return this.viewComponent.find(str)
    }
    open(data:{url:string,target?:string}|string, link:{hit:Element,target:Element,type:string}){
        let options:{url:string,target?:string};
        if(!data){
            data = {url:link.target.getAttribute("href")||"",target:link.target.getAttribute("target")||""}
        }
        if(typeof data=="string"){
            options = {url:data}
        }else{
            options = data;
        }
        let target:string|tomato.Dialog = options.target||DialogTarget.Blank;
        if(options.target == DialogTarget.Self){
            target = this.getDialog();
        }
        tomato.asyncGetView<tomato.View>(options.url).then(function(vp){
            open(vp,target)
        });
        return false;
    }
    protected _getElements(sub:string=''): { [x: string]: HTMLElement[] } {
        return this.find(sub?sub+" [dom]":"[dom]").groupBy("dom");
    }
    protected _watchEvent(jdom?: JQuery) {
        _watchEvent(this,jdom);
    }
}


export class Application extends tomato.Application {
    readonly viewComponent: JQuery;
    constructor(rootUri: tomato.Cmd | null, els: { viewComponent: JQuery, dialog: JQuery, mask: JQuery, body: JQuery }, config?: tomato.IDialogConfigOptions) {
        super(rootUri,els);
        this.viewComponent.addClass("tdom-application");
    }
    protected _getElements(sub:string=''): { [x: string]: HTMLElement[] } {
        return this.find(sub?sub+" [dom]":"[dom]").groupBy("dom");
    }
    find(str: string): JQuery {
        return this.viewComponent.find(str)
    }
    protected _watchEvent(jdom?: JQuery) {
        _watchEvent(this,jdom);
    }
}
export class Dialog extends tomato.Dialog {

    public readonly viewComponent: JQuery;
    public readonly dialog: JQuery;
    public readonly mask: JQuery;
    public readonly body: JQuery;

    private _removeAfterClosed: boolean;

    constructor(config?: tomato.IDialogConfigOptions, els?: { viewComponent: JQuery, dialog: JQuery, mask: JQuery, body: JQuery }) {
        if (!els) {
            let viewComponent = $(tpl_Dialog);
            let comps = viewComponent.find("[data-dom]").groupBy();
            els = { viewComponent: viewComponent, dialog: $(comps['dialog']), mask: $(comps['mask']), body: $(comps['body']) };
        }
        super(els, config);
        this.viewComponent.addClass("tdom-dialog");
        let that = this;
        this.mask && this.mask.on("click", function(){
            that.close();
        });
        AnimationEnd && this.dialog.on(AnimationEnd, function(e){
            if(e.originalEvent['animationName'] == this.getAttribute("data-animation")){
                this.setAttribute("data-animation","");
                if(that.viewComponent.hasClass("tdom-animation-show")){
                    that.viewComponent.removeClass("tdom-animation-show")
                }else{
                    that.viewComponent.removeClass("tdom-animation-hide")
                    that._setState(tomato.DialogState.Closed,true);
                }
                setTimeout(function(){
                    that._onEffectCompleted();
                },0);
                return false;
            }
        });
    }
    protected _onEffectCompleted(){
        this.viewComponent.trigger("completed");
        if(this._removeAfterClosed){
            this._removeAfterClosed = false;
            this.parent && this.parent.removeChild(this);
        }
    }
    protected _setState(state: tomato.DialogState, disableEffect?:boolean): void {
        let that = this;
        let ostate = this.state;
        if(!AnimationEnd){
            super._setState(state);
            setTimeout(function(){
                that._onEffectCompleted();
            },0);
        }else if(disableEffect){
            super._setState(state);
        }else{
            if (this.state == tomato.DialogState.Closed) {
                super._setState(state);
                this.viewComponent.addClass("tdom-animation-show");
                this.dialog.attr("data-animation","tdom-dialog-show-pt-"+this.config.effect);
            } else if(state == tomato.DialogState.Closed){
                this.viewComponent.addClass("tdom-animation-hide");
                this.dialog.attr("data-animation","tdom-dialog-hide-pt-"+this.config.effect);
            }else{
                super._setState(state);
                setTimeout(function(){
                    that._onEffectCompleted();
                },0);
            }
        }
        if(ostate == tomato.DialogState.Closed){
            this._fixNotSupportTransform();
        }
    }
    close(removeAfterClosed: boolean = true): boolean {
        if (super.close()) {
            this._removeAfterClosed = removeAfterClosed;
            return true;
        } else {
            return false;
        }
    }
    protected _afterConfigChange(oldConfig: tomato.IDialogConfig) {
        super._afterConfigChange(oldConfig);
        
        this.dialog.removeClass([(oldConfig.width=="auto"||oldConfig.width=="")?"tdom-wrapWidth":"", (oldConfig.height=="auto"||oldConfig.height=="")?"tdom-wrapHeight":""].join(" "));
        let config = this.config;
        this.dialog.addClass([(config.width=="auto"||config.width=="")?"tdom-wrapWidth":"", (config.height=="auto"||config.height=="")?"tdom-wrapHeight":""].join(" "));

        
        let xPos = this.config.x;
        let yPos = this.config.y;
        let xOffset = this.config.offsetX;
        let yOffset = this.config.offsetY;


        let dialogCss:any = { width: this.config.width, height: this.config.height, marginLeft:xOffset||0, marginTop:yOffset||0};
        
        let dialogPosition = tomato.DialogPosition;
        
        switch (xPos){
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
        switch (yPos){
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
        if(xPos==dialogPosition.center && yPos==dialogPosition.middle){
            dialogCss[Transform] = "translate(-50%,-50%)";
        }else if(xPos==dialogPosition.center){
            dialogCss[Transform] = "translateX(-50%)";
        }else if(yPos==dialogPosition.middle){
            dialogCss[Transform] = "translateY(-50%)";
        }else{
            dialogCss[Transform] = "none";
        }

        this.dialog.css(dialogCss);
    }
    private _fixNotSupportTransform(){
        if(!Transform){
            let xPos = this.config.x;
            let yPos = this.config.y;
            let width = -Math.round(this.dialog.width()/2);
            let height = -Math.round(this.dialog.height()/2);
            let dialogCss:any;
            let dialogPosition = tomato.DialogPosition;
            if(xPos==dialogPosition.center && yPos==dialogPosition.middle){
                dialogCss = {marginLeft:width+"px",marginTop:height+"px"};
            }else if(xPos==dialogPosition.center){
                dialogCss = {marginLeft:width+"px"};
            }else if(yPos==dialogPosition.middle){
                dialogCss = {marginTop:height+"px"};
            }
            if(dialogCss){
                $(this.dialog[0].children[0]).css(dialogCss);
            }
        }
    }
    onWindowResize(){
        let options:tomato.IDialogConfigOptions = {};
        if(this.config.expWidth){
            let value = this._parseExpr(this.config.expWidth,"width");
            if(!isNaN(value)){
                options.width = value+"px";
            }
        }
        if(this.config.expHeight){
            let value = this._parseExpr(this.config.expHeight,"height");
            if(!isNaN(value)){
                options.height = value+"px";
            }
        }
        if(this.config.expOffsetX){
            let value = this._parseExpr(this.config.expOffsetX,"width");
            if(!isNaN(value)){
                options.offsetX = value+"px";
            }
        }
        if(this.config.expOffsetY){
            let value = this._parseExpr(this.config.expOffsetY,"height");
            if(!isNaN(value)){
                options.offsetY = value+"px";
            }
        }
        if(this.config.expX){
            let value = this._parseExpr(this.config.expX,"left");
            if(!isNaN(value)){
                options.x = value+"px";
            }
        }
        if(this.config.expY){
            let value = this._parseExpr(this.config.expY,"top");
            if(!isNaN(value)){
                options.y = value+"px";
            }
        }
        this.setConfig(options);
        this._fixNotSupportTransform();
    }

    private _parseExpr(value: any, worh: string): number {
        let target: JQuery | undefined = undefined, expr: string = '';
        let els, multiple, multipleNum, increment, incrementNum;
        if (typeof value == "function") {
            return value(this);
        }else if (Array.isArray(value)) {
            [target, expr] = value;
            expr = 'target' + expr;
        } else if (typeof value == "object") {
            target = value;
        } else if (typeof value == "string") {
            expr = value;
        }
        if (expr) {
            let arr = expr.match(/^([^*/+-]+)(([*/])([\+\-\d.]+?))?(([+-])(\d+))?$/);
            if (arr) {
                [, els, , multiple, multipleNum, , increment, incrementNum] = arr;
                if (!target) {
                    target = $(els);
                }
            }
        }
        if (target && target.length) {
            let methon = { "width": "outerWidth", "height": "outerHeight" };
            let outerWorH: string = methon[worh];
            let value: number = (worh == "width" || worh == "height") ? target[outerWorH]() : target.offset()[worh];
            if (multiple) {
                multipleNum = parseFloat(multipleNum);
                if (multiple == '*') {
                    value *= multipleNum;
                } else {
                    value /= multipleNum;
                }
            }
            if (increment) {
                incrementNum = parseInt(incrementNum);
                if (increment == '+') {
                    value += incrementNum;
                } else {
                    value -= incrementNum;
                }
            }
            return value;
        } else {
            return NaN;
        }
    }
    
    
    // refreshPosition(): void {
    //     if (this.state == tomato.DialogState.Closed) { return; }
        
        
        // let obj = getWindowSize();
        // let dialogSize: { x: number, y: number } = { x: this.dialog.outerWidth(), y: this.dialog.outerHeight() };
        // let windowSize: { x: number, y: number } = { x: obj.width, y: obj.height };
        // let offset = this.config.offset;
        // let dialogPos: { x: number, y: number } = { x: 0, y: 0 };
        // let offsetPos: { x: number, y: number } = { x: 0, y: 0 };
        // let minPos: { x: number, y: number } = { x: 0, y: 0 };
        // let maxPos: { x: number, y: number } = { x: windowSize.x - dialogSize.x, y: windowSize.y - dialogSize.y };
        // let dialogOffset: JQueryCoordinates;
        // let dialogPosition: JQueryCoordinates;
        // let parentOffset: { x: number, y: number };
        // let pageScroll: { x: number, y: number } = { x: $(window).scrollLeft(), y: $(window).scrollTop() };;

        // if (!this.config.fixed) {
        //     dialogOffset = this.dialog.offset();
        //     dialogPosition = this.dialog.position();
        //     parentOffset = { x: dialogOffset.left - dialogPosition.left, y: dialogOffset.top - dialogPosition.top };
        //     minPos = { x: -parentOffset.x, y: -parentOffset.y };
        //     maxPos = { x: NaN, y: NaN };
        // }

        // ['x', 'y'].forEach((xory: string) => {
        //     let lort: string = xory == "x" ? "left" : "top";

        //     let positionValue: tomato.DialogPosition | tomato.DialogRefer = this.config.position[xory];
        //     let element: JQuery | null = null;
        //     if (typeof positionValue == "number") {
        //         if (this.config.fixed) {
        //             if(xory=="x"){
        //                 switch (positionValue) {
        //                     case tomato.DialogPosition.Left:
        //                         dialogPos.x = 0;
        //                         return;
        //                     case tomato.DialogPosition.Right:
        //                         dialogPos.x = windowSize.x - dialogSize.x;
        //                         return;
        //                     case tomato.DialogPosition.Center:
        //                         dialogPos.x = (windowSize.x - dialogSize.x) / 2;
        //                         return;
        //                 }
        //             }else{
        //                 switch (positionValue) {
        //                     case tomato.DialogPosition.Top:
        //                         dialogPos.y = 0;
        //                         return;
        //                     case tomato.DialogPosition.Bottom:
        //                         dialogPos.y = windowSize.y - dialogSize.y;
        //                         return;
        //                     case tomato.DialogPosition.Middle:
        //                         dialogPos.y = (windowSize.y - dialogSize.y) / 2;
        //                         return;
        //                 }
        //             }                        
        //         } else {
        //             if(xory=="x"){
        //                 switch (positionValue) {
        //                     case tomato.DialogPosition.Left:
        //                         dialogPos.x = pageScroll.x - parentOffset.x;
        //                         return;
        //                     case tomato.DialogPosition.Right:
        //                         dialogPos.x = pageScroll.x - parentOffset.x + windowSize.x - dialogSize.x;
        //                         return;
        //                     case tomato.DialogPosition.Center:
        //                         dialogPos.x = pageScroll.x - parentOffset.x + (windowSize.x - dialogSize.x) / 2;
        //                         return;
        //                 }
        //             }else{
        //                 switch (positionValue) {
        //                     case tomato.DialogPosition.Top:
        //                         dialogPos.y = pageScroll.y - parentOffset.y;
        //                         return;
        //                     case tomato.DialogPosition.Bottom:
        //                         dialogPos.y = pageScroll.y - parentOffset.y + windowSize.y - dialogSize.y;
        //                         return;
        //                     case tomato.DialogPosition.Middle:
        //                         dialogPos.y = pageScroll.y - parentOffset.y + (windowSize.y - dialogSize.y) / 2;
        //                         return;
        //                 }
        //             }
        //         }
        //     } else if (typeof positionValue == "string" && /^-?\d{1,3}%$/.test(positionValue)) {
        //         if (this.config.fixed) {
        //             dialogPos[xory] = parseInt(positionValue) / 100 * windowSize[xory];
        //         } else {
        //             dialogPos[xory] = parseInt(positionValue) / 100 * windowSize[xory] + pageScroll[xory] - parentOffset[xory];
        //         }
        //         return;
        //     }
        //     let value: number = this._parseExpr(positionValue, lort);
        //     if (this.config.fixed) {
        //         dialogPos[xory] = value - pageScroll[xory];
        //     } else {
        //         dialogPos[xory] = value - parentOffset[xory];
        //     }
        // });
        // ['x', 'y'].forEach((xory: string) => {
        //     let offsetValue: tomato.DialogRefer = this.config.offset[xory];
        //     let worh: string = xory == "x" ? "width" : "height";
        //     if (typeof offsetValue == "string" && /^-?\d{1,3}%$/.test(offsetValue)) {
        //         offsetPos[xory] = dialogSize[xory] * parseInt(offsetValue) / 100;
        //         return;
        //     }
        //     offsetPos[xory] = this._parseExpr(offsetValue, worh);
        // });
        // ['x', 'y'].forEach((xory: string) => {
        //     dialogPos[xory] += offsetPos[xory];
        //     if (!isNaN(minPos[xory]) && dialogPos[xory] < minPos[xory]) {
        //         dialogPos[xory] = minPos[xory];
        //     }
        //     if (!isNaN(maxPos[xory]) && (dialogPos[xory] > maxPos[xory])) {
        //         dialogPos[xory] = maxPos[xory];
        //     }
        // });
        // this._setPosition(dialogPos.x, dialogPos.y);
    //}
    
    
    
}


export function turnContainer(container: JQuery, effect:string=TurnEffect.slide): JQuery {
    container.addClass("tdom-turnContainer "+effect);
    AnimationEnd && container.on(AnimationEnd, function (e) {
        if(e.originalEvent['animationName'] == this.getAttribute("data-animation")){
            $(this).attr("data-animation","").removeClass("tdom-animation").trigger("completed");
            return false;
        }
    });
    container.removeChild = function (view: JQuery): void {
    };
    container.appendChild = function (view: JQuery): void {
        let div = this[0] as HTMLElement;
        let children = div.children;
        let content:Element|null = null;
        let oview:Element|null = null;
        if(children.length == 0){
            content = document.createElement("div");
            div.appendChild(content);
        }else if(children.length == 1){
            content = children[0];
        }else if(children.length == 2){
            oview = children[0];
            content = children[1];
        }else{
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
        let pos = (view.attr("data-pos") || "0,0").split(",");
        div.scrollLeft = parseInt(pos[0]);
        div.scrollTop = parseInt(pos[1]);
        let direction = view.attr("data-back") ? "tdom-back" : "";
	    this.removeClass("tdom-back").addClass(direction + " tdom-animation");
        this.attr("data-animation","tdom-turnContainer-"+effect+"-"+direction);
        if(!AnimationEnd){
            setTimeout(()=>{
                this.removeClass("tdom-animation");
                this.trigger("completed");
            },0)
        }
    }
    return container;
}
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
let hideDiv = $("<div style='position:absolute;width:100%;height:100%;left:-100%;top:-100%;overflow: hidden;'></div>").appendTo(document.body);
tomato.setConfig({
    createViewComponent: function (data:any) {
        if(typeof data == "string"){
            return $(data).appendTo(hideDiv);
        }else{
            return data;
        }
    }
});

export function setConfig(data: {
    dialogZIndexStart?: number,
}) {
    if (data.dialogZIndexStart) {
        dialogZIndexStart = data.dialogZIndexStart;
    }
}
export const DialogTarget = {
    "Blank" : "_blank",
    "Self" : "_self",
    "Root" : "_root",
    "Top" : "_top"
}
export function open (content:tomato.View, target?:string|tomato.Dialog, dialogOptions?:tomato.IDialogConfigOptions):tomato.Dialog {
    let dialog:tomato.Dialog = tomato.application;
    if(!target){target=DialogTarget.Blank}
    if(target == DialogTarget.Self || target == DialogTarget.Top){
        dialog = tomato.getTopDialog();
        dialogOptions && dialog.setConfig(dialogOptions);
    }else if(target == DialogTarget.Blank){
        dialog = new Dialog(dialogOptions||{masked:true,effect:tomato.DialogEffect.scale});
        tomato.application.appendChild(dialog);
    }else{
        dialog = target as any;
        dialogOptions && dialog.setConfig(dialogOptions);
    }
    dialog.appendChild(content);
    dialog.focus();
    return dialog;
};
import * as tomato from "@po-to/tomato";
declare global  {
    interface JQuery {
        groupBy(attr?: string): {
            [x: string]: HTMLElement[];
        };
        removeChild(view: JQuery): void;
        appendChild(view: JQuery): void;
        setZIndex(index: number): void;
        getVID(): string;
        setVID(id: string): void;
        getVCON(): string;
        getSUBS(): JQuery[];
    }
}
export declare const TurnEffect: {
    slide: string;
    cover: string;
};
declare module "@po-to/tomato" {
    interface IDialogEffect {
        swipeUp: string;
        swipeDown: string;
        swipeLeft: string;
        swipeRight: string;
        slideUp: string;
        slideDown: string;
        slideLeft: string;
        slideRight: string;
    }
    interface IDialogConfig {
        expWidth: string;
        expHeight: string;
        expX: string;
        expY: string;
        expOffsetX: string;
        expOffsetY: string;
    }
    interface IDialogConfigOptions {
        expWidth?: string;
        expHeight?: string;
        expX?: string;
        expY?: string;
        expOffsetX?: string;
        expOffsetY?: string;
    }
}
export declare function getWindowSize(): {
    width: number;
    height: number;
};
export declare class View extends tomato.View {
    protected _$dom: JQuery;
    protected _els: {
        [key: string]: Element[];
    };
    readonly viewComponent: JQuery;
    constructor(viewComponent: tomato.ViewComponent, parent?: tomato.View, vid?: string);
    find(str: string): JQuery;
    getInstallEffect(): boolean;
    _evt_open(data: {
        url: string;
        target?: string;
    } | string): boolean;
    protected _getElements(): {
        [x: string]: HTMLElement[];
    };
    protected _watchEvent(funs?: {
        [key: string]: Function;
    }, jdom?: JQuery): void;
}
export declare class Application extends tomato.Application {
    constructor(rootUri: tomato.Cmd | null, els: {
        viewComponent: JQuery;
        dialog: JQuery;
        mask: JQuery;
        body: JQuery;
    }, config?: tomato.IDialogConfigOptions);
}
export declare class Dialog extends tomato.Dialog {
    readonly viewComponent: JQuery;
    readonly dialog: JQuery;
    readonly mask: JQuery;
    readonly body: JQuery;
    private _removeAfterClosed;
    constructor(config?: tomato.IDialogConfigOptions, els?: {
        viewComponent: JQuery;
        dialog: JQuery;
        mask: JQuery;
        body: JQuery;
    });
    protected _onEffectCompleted(): void;
    protected _setState(state: tomato.DialogState, disableEffect?: boolean): void;
    close(removeAfterClosed?: boolean): boolean;
    protected _afterConfigChange(oldConfig: tomato.IDialogConfig): void;
    private _fixNotSupportTransform();
    onWindowResize(): void;
    private _parseExpr(value, worh);
}
export declare function turnContainer(container: JQuery, effect?: string): JQuery;
export declare function setConfig(data: {
    dialogZIndexStart?: number;
}): void;
export declare const DialogTarget: {
    "Blank": string;
    "Self": string;
    "Root": string;
    "Top": string;
};
export declare function open(content: tomato.View, target?: string | tomato.Dialog, dialogOptions?: tomato.IDialogConfigOptions): tomato.Dialog;

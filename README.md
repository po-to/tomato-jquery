# tomato-jquery
tomato-jquery是基于tomato的实现与扩展，它采用jquery来实现tomato.IComponent接口，并且根据实际项目经验，在tomato的基础上具体化了某些功能，丰富了某些类库，固化了某些模式。它是优化实践、落地tomato思路的一套战术解决方案。

# 项目主页
[www.po-to.org](http://www.po-to.org/page/articles/tomato_jquery/s01)

# 仓库
[Github](https://github.com/po-to/tomato-jquery)

# 兼容
tomato-jquery采用“优雅降级”的理念兼容IE8及以上浏览器，在主流现代浏览器中均有很好的用户体验。

# 依赖
- tomato：tomato-jquery主要作用是实现和扩展tomato
- jquery：jquery对象用来封装Dom

# 安装
- 使用NPM安装：npm install @po-to/tomato-jquery
- 手动下载安装：[Github](https://github.com/po-to/tomato-jquery)

# 引入
使用AMD标准模块化，推荐使用requireJS引入

# 文档
[API](http://www.po-to.org/static/api/tomato_jquery)

# 设置
tomato-jquery中的设置主要通过其对外函数setConfig()来实现：
```
export declare function setConfig(data: {
    dialogZIndexStart?: number;
}): void;
```
从上面代码可以看出，tomato可以设置的选项主要有一项：
- dialogZIndexStart?: number  
Dialog弹窗的起始z-index值，默认为1000。
!function(e,r,n,o,t){var i="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},u="function"==typeof i.parcelRequireec03&&i.parcelRequireec03,c=u.cache||{},f="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function l(r,n){if(!c[r]){if(!e[r]){var o="function"==typeof i.parcelRequireec03&&i.parcelRequireec03;if(!n&&o)return o(r,!0);if(u)return u(r,!0);if(f&&"string"==typeof r)return f(r);var t=new Error("Cannot find module '"+r+"'");throw t.code="MODULE_NOT_FOUND",t}s.resolve=function(n){var o=e[r][1][n];return null!=o?o:n},s.cache={};var a=c[r]=new l.Module(r);e[r][0].call(a.exports,s,a,a.exports,this)}return c[r].exports;function s(e){var r=s.resolve(e);return!1===r?{}:l(r)}}l.isParcelRequire=!0,l.Module=function(e){this.id=e,this.bundle=l,this.exports={}},l.modules=e,l.cache=c,l.parent=u,l.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]},Object.defineProperty(l,"root",{get:function(){return i.parcelRequireec03}}),i.parcelRequireec03=l;for(var a=0;a<r.length;a++)l(r[a]);var s=l(n);"object"==typeof exports&&"undefined"!=typeof module?module.exports=s:"function"==typeof define&&define.amd&&define((function(){return s}))}({"5ZiyP":[function(e,r,n){var o=e("../src/carousel"),t=e("../src/features/buttons"),i=e("../src/features/pagination"),u=document.querySelector(".caroucssel"),c=Array.from(document.querySelectorAll(".item"));if(!u)throw new Error("Missing element for carousel.");new o.Carousel(u,{features:[new t.Buttons,new i.Pagination],onScroll:function(e){c.forEach((function(r,n){r.classList[e.index.includes(n)?"add":"remove"]("is-active")}))}})},{"../src/carousel":"2E9Dl","../src/features/buttons":"eanwb","../src/features/pagination":"hUskH"}]},["5ZiyP"],"5ZiyP");
//# sourceMappingURL=index.a3c3ce66.js.map

import{a as j,c as u,d as V,e as f,h as D}from"./chunk-SLFJA2SL.js";import{$a as h,Da as M,Ib as T,P as x,Rb as H,Sb as g,U as S,Ua as v,Ub as L,Va as z,Za as r,_ as d,_a as o,aa as c,eb as s,f as w,h as b,ib as l,nb as p,qb as E,rb as _,ta as y,ya as C}from"./chunk-KOQ355HY.js";import"./chunk-35PI25VP.js";var G=(()=>{let e=class e{constructor(){this._platformId=d(y),this._renderer=d(C).createRenderer(null,null),this._document=d(T),this._lightingTheme$=new b(1),this.lightingTheme$=this._lightingTheme$.asObservable(),this._colorTheme$=new b(1),this.colorTheme$=this._colorTheme$.asObservable(),this._destroyed$=new w,this.syncThemeFromLocalStorage(),this.toggleClassOnThemeChanges(),this.changeColorOnThemeChanges()}syncThemeFromLocalStorage(){L(this._platformId)&&this._lightingTheme$.next(localStorage.getItem("theme")==="dark"?"dark":"light")}toggleClassOnThemeChanges(){this.lightingTheme$.pipe(x(this._destroyed$)).subscribe(i=>{i==="dark"?this._renderer.addClass(this._document.documentElement,"dark"):this._document.documentElement.className.includes("dark")&&this._renderer.removeClass(this._document.documentElement,"dark")})}changeColorOnThemeChanges(){this.colorTheme$.pipe(x(this._destroyed$)).subscribe(i=>{let t=this._document.body;t.className.split(" ").forEach(m=>{m&&this._renderer.removeClass(t,m)}),this._renderer.addClass(t,`theme-${i}`)})}setColorTheme(i){this._colorTheme$.next(i)}toggleDarkMode(){let i=localStorage.getItem("theme")==="dark"?"light":"dark";localStorage.setItem("theme",i),this._lightingTheme$.next(i)}ngOnDestroy(){this._destroyed$.next(),this._destroyed$.complete()}};e.\u0275fac=function(t){return new(t||e)},e.\u0275prov=S({token:e,factory:e.\u0275fac,providedIn:"root"});let n=e;return n})();function F(n,e){n&1&&l(0," Light ")}function A(n,e){n&1&&l(0," Dark ")}var N=(()=>{let e=class e{constructor(){this.themingService=d(G)}toggleDarkMode(){this.themingService.toggleDarkMode()}setColorTheme(i){this.themingService.setColorTheme(i)}};e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=c({type:e,selectors:[["layout-header"]],standalone:!0,features:[p],decls:18,vars:3,consts:[[1,"bg-muted-foreground","w-svw","flex","max-w-screen","flex-row","justify-between","p-2"],["hlmBtn","","target","_blank","variant","link","href","https://github.com/rorofino10/puzzle-repo",1,"text-background"],[1,"flex","flex-row","justify-between"],["hlmBtn","","size","sm","variant","outline",3,"click"],["hlmBtn","","variant","outline",1,"text-background",3,"click"]],template:function(t,a){t&1&&(r(0,"main",0)(1,"a",1),l(2," Source Code "),o(),r(3,"div",2)(4,"button",3),s("click",function(){return a.setColorTheme("blue")}),l(5," Blue "),o(),r(6,"button",3),s("click",function(){return a.setColorTheme("red")}),l(7," Red "),o(),r(8,"button",3),s("click",function(){return a.setColorTheme("violet")}),l(9," Red "),o(),r(10,"button",3),s("click",function(){return a.setColorTheme("gray")}),l(11," Gray "),o(),r(12,"button",3),s("click",function(){return a.setColorTheme("orange")}),l(13," Orange "),o()(),r(14,"button",4),s("click",function(){return a.toggleDarkMode()}),v(15,F,1,0),E(16,"async"),v(17,A,1,0),o()()),t&2&&(M(15),z(15,_(16,1,a.themingService.lightingTheme$)==="dark"?15:17))},dependencies:[g,H,D],styles:["main[_ngcontent-%COMP%]{width:100vw}"]});let n=e;return n})();var I=(()=>{let e=class e{};e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=c({type:e,selectors:[["puzzle-repo-default-layout"]],standalone:!0,features:[p],decls:5,vars:0,consts:[[1,"h-screen","min-h-screen","w-fit","flex","flex-col"],[1,"flex","w-fit","flex-row"],[1,"h-full","overflow-y-auto","flex","flex-col"]],template:function(t,a){t&1&&(r(0,"main",0)(1,"section",1),h(2,"layout-header"),o(),r(3,"section",2),h(4,"router-outlet"),o()())},dependencies:[g,f,u,N],styles:["[_ngcontent-%COMP%]:root{height:100%}"]});let n=e;return n})();var R=[{path:"",component:I,children:[{path:"",redirectTo:"home",pathMatch:"full"},{path:"home",loadComponent:()=>import("./chunk-SLGLH4IE.js").then(n=>n.HomeComponent)},{path:"play",loadChildren:()=>import("./chunk-O6JOY3YC.js").then(n=>n.PlayRoutes)},{path:"**",redirectTo:"home"}]}];var $={providers:[V(R)]};var B=(()=>{let e=class e{};e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=c({type:e,selectors:[["puzzle-repo-root"]],standalone:!0,features:[p],decls:1,vars:0,template:function(t,a){t&1&&h(0,"router-outlet")},dependencies:[f,u]});let n=e;return n})();j(B,$).catch(n=>console.error(n));

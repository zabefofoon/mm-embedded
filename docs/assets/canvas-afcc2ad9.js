import{d as C,N as K,u as B,a as v,c,w as M,o as l,b as y,e as g,f as $,g as T,v as A,h as k,i as x,F as N,r as _,j as E,n as P,k as H,_ as I,l as D,m as O,s as b,p as V,q as W,t as R,x as z,y as j,z as G,A as q,B as S}from"./index-226178c2.js";const F={key:0,class:"marker | absolute top-0 right-0 | w-3 h-3 | bg-orange-500"},U={class:"w-80 h-60 | absolute z-10 | bg-white border shadow-md"},Z=["innerHTML"],X={key:0,class:"w-full text-center text-slate-500"},J=C({__name:"Node",props:{node:{type:K,required:!0}},setup(i){const t=i,m=B(),a=v(),p=c(()=>m.isShowSpacing?"p-2":""),w=c(()=>m.isShowOutline?"border-2":"border-0"),s=c(()=>a.selectedNodeIds.includes(t.node.id)?"border-orange-500":"border-slate-500"),r=c(()=>Object.keys(t.node.layout).reduce((n,o)=>{let e="";return t.node.layout[o].type&&(e=e+`${o}:type-${t.node.layout[o].type} `),t.node.layout[o].direction&&(e=e+`${o}:direction-${t.node.layout[o].direction} `),t.node.layout[o].columns&&(e=e+`${o}:columns-${t.node.layout[o].columns} `),t.node.layout[o].gap&&(e=e+`${o}:gap-${t.node.layout[o].gap} `),t.node.layout[o].width&&(e=e+`${o}:width-${t.node.layout[o].width} `),t.node.layout[o].height&&(e=e+`${o}:height-${t.node.layout[o].height} `),t.node.layout[o].maxWidth&&(e=e+`${o}:maxWidth-${t.node.layout[o].maxWidth} `),t.node.layout[o].mainAxis!==void 0?e=e+`${o}:mainAxis-${t.node.layout[o].mainAxis} `:e=e+`${o}:mainAxis-start `,t.node.layout[o].crossAxis!==void 0?e=e+`${o}:crossAxis-${t.node.layout[o].crossAxis} `:e=e+`${o}:crossAxis-start `,t.node.layout[o].position!==void 0?e=e+`${o}:position-${t.node.layout[o].position} `:e=e+`${o}:position-relative `,t.node.layout[o].hidden!==void 0&&(e=e+`${o}:hidden-${t.node.layout[o].hidden||!1} `),t.node.layout[o].paddingLeft!==void 0&&(e=e+`${o}:padding-left-${t.node.layout[o].paddingLeft} `),t.node.layout[o].paddingTop!==void 0&&(e=e+`${o}:padding-top-${t.node.layout[o].paddingTop} `),t.node.layout[o].paddingRight!==void 0&&(e=e+`${o}:padding-right-${t.node.layout[o].paddingRight} `),t.node.layout[o].paddingBottom!==void 0&&(e=e+`${o}:padding-bottom-${t.node.layout[o].paddingBottom} `),t.node.layout[o].left!==void 0&&(e=e+`${o}:left-${t.node.layout[o].left} `),t.node.layout[o].top!==void 0&&(e=e+`${o}:top-${t.node.layout[o].top} `),t.node.layout[o].right!==void 0&&(e=e+`${o}:right-${t.node.layout[o].right} `),t.node.layout[o].bottom!==void 0&&(e=e+`${o}:bottom-${t.node.layout[o].bottom} `),t.node.layout[o].transparent&&(e=e+`${o}:transparent `),n+e},"")),u=()=>setTimeout(()=>{[...document.body.getElementsByClassName("marker")].forEach(n=>{n.getBoundingClientRect().left>document.body.clientWidth/2?n.getElementsByTagName("article")[0].classList.add("right-1"):n.getElementsByTagName("article")[0].classList.add("left-1"),n.getBoundingClientRect().top>document.body.clientHeight/2?n.getElementsByTagName("article")[0].classList.add("bottom-1"):n.getElementsByTagName("article")[0].classList.add("top-1")})});return M(()=>a.currentPage.nodes,()=>u(),{immediate:!0,deep:!0}),(n,o)=>{const e=H("Node",!0);return l(),y("div",{class:P(["node | w-full min-h-8 | border border-dashed",[g(s),g(r),g(p),g(w)]]),onClick:o[2]||(o[2]=k(d=>d.ctrlKey||d.metaKey?g(a).selectNodeMany(i.node.id):g(a).selectNodeOne(i.node.id),["stop"]))},[g(m).isShowMarker&&i.node.marker?(l(),y("div",F,[$("article",U,[T($("textarea",{"onUpdate:modelValue":o[0]||(o[0]=d=>i.node.marker.text=d),class:"w-full h-full | p-2 | resize-none text-slate-500 text-sm",placeholder:"text",onKeydown:o[1]||(o[1]=k(()=>{},["stop"]))},null,544),[[A,i.node.marker.text]])])])):x("",!0),i.node.widget?(l(),y("div",{key:1,innerHTML:i.node.widget.html,class:"w-full"},null,8,Z)):(l(),y(N,{key:2},[i.node.nodes.length===0?(l(),y("p",X,"space")):x("",!0),(l(!0),y(N,null,_(i.node.nodes,d=>(l(),E(e,{key:d.id,node:d},null,8,["node"]))),128))],64))],2)}}});const Q=I(J,[["__scopeId","data-v-5bbff191"]]),ee=C({__name:"canvas",setup(i){D(()=>{window.addEventListener("message",m),window.addEventListener("keydown",t)}),O(()=>{window.removeEventListener("message",m),window.removeEventListener("keydown",t)});const t=e=>{const d=e.ctrlKey||e.metaKey;e.code==="Delete"||e.code==="Backspace"?a("removeNode"):e.code==="Enter"&&d?a("addChildNode"):e.code==="Enter"?a("addSiblingNodeDown"):e.code==="KeyC"?a("copyNode"):e.code==="KeyX"?a("cutNode"):e.code==="KeyV"?a("pasteNode"):e.code==="KeyZ"&&d&&e.shiftKey?a("redo"):e.code==="KeyZ"&&d&&a("undo")},m=e=>{if(e.data.type==="pagesMutation"){const d=e.data.data;s.loadPages(d.pages),s.selectPage(d.currentPageId),s.selectedNodeIds=d.selectedNodeIds}else if(e.data.type==="widgetGroupsMutation"){const d=e.data.data;u.setWidgetGroups(d)}else if(e.data.type==="screenMutation"){const{isShowSpacing:d,isShowOutline:h,isShowHidden:f,isShowMarker:L}=e.data.data;p.toggleShowSpacing(d),p.toggleShowOutline(h),p.toggleShowHidden(f),p.toggleMarker(L)}},a=e=>{var d;return(d=window.parent)==null?void 0:d.postMessage({type:"command",data:e})},p=B(),{isShowHidden:w}=b(p),s=v(),r=e=>{var d;s.circuitBreaker.status==="off"&&((d=window.parent)==null||d.postMessage({type:"pageMutation",data:{pageData:S(e),selectedNodeIds:S(s.selectedNodeIds)}}))};M(()=>s.currentPage,e=>{s.circuitBreaker.watch(e.key),r(e)},{deep:!0});const u=V(),{widgetGroups:n}=b(u),o=c(()=>{var e;return q((e=s.currentPage)==null?void 0:e.nodes,n.value,w.value)});return(e,d)=>{var h;return l(),y("div",{class:"bg-white shadow-md | min-h-screen",onClick:d[0]||(d[0]=f=>g(s).selectNodeOne())},[W(z,null,{default:R(()=>[j(G(g(o)),1)]),_:1}),(l(!0),y(N,null,_((h=g(s).currentPage)==null?void 0:h.nodes,f=>(l(),E(Q,{key:f.id,node:f},null,8,["node"]))),128))])}}});export{ee as default};

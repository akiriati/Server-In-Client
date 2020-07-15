(this["webpackJsonpreact-sw-serverless"]=this["webpackJsonpreact-sw-serverless"]||[]).push([[0],{38:function(e,t,a){e.exports=a(50)},43:function(e,t,a){},49:function(e,t,a){},50:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(13),i=a.n(o),c=(a(43),a(30)),l=a(26),s=a(27),h=a(29),m=a(31),d=a(72),u=a(73),f=a(81),p=a(75),v=a(74),w=a(79),g=a(28),k=a.n(g),E=Object(d.a)((function(e){return{root:{display:"flex",flexWrap:"wrap",justifyContent:"space-around",overflow:"hidden",backgroundColor:e.palette.background.paper},gridList:{width:500,height:600},icon:{color:"rgba(255, 255, 255, 0.54)"}}}));function b(e){var t=E(),a=function(e){return"/files"+e};return r.a.createElement("div",{className:t.root},r.a.createElement(u.a,{cellHeight:150,className:t.gridList},r.a.createElement(f.a,{key:"Subheader",cols:2,style:{height:"auto"}},r.a.createElement(v.a,{component:"div"},e.picsIds.length," Files")),e.picsIds.map((function(n){return r.a.createElement(f.a,{key:n},r.a.createElement("img",{src:a(n),alt:n}),r.a.createElement(p.a,{title:n.replace(e.path,""),actionIcon:r.a.createElement(w.a,{onClick:function(t){return e.handleDeleteFile("/files"+n)}},r.a.createElement(k.a,{className:t.title}))}))}))))}var W=a(82),y=a(76),S=a(78);function D(e){if(e.tasksToDo==e.tasksDone||0==e.tasksToDo)return r.a.createElement("div",null);var t=100*e.tasksDone/(e.tasksToDo+e.tasksDone);return r.a.createElement(S.a,{display:"flex",alignItems:"center"},r.a.createElement(S.a,{width:"100%",mr:5},r.a.createElement(W.a,Object.assign({variant:"determinate"},e,{value:t}))),r.a.createElement(S.a,{minWidth:35},r.a.createElement(y.a,{variant:"body2",color:"textSecondary"},"".concat(Math.round(t),"%"))))}a(49);var j=a(77),F=function(e){Object(m.a)(a,e);var t=Object(h.a)(a);function a(e){var n;Object(l.a)(this,a),(n=t.call(this,e)).handleWatermarkChanged=function(e){fetch("/files/watermark.png",{method:"POST",body:e.target.files[0],headers:{"content-type":"image/png"}}).then(n.setState({watermark:[window.URL.createObjectURL(e.target.files[0])]}))},n.handleUploadNonWatermarkedPictures=function(e){for(var t=0,a=Array.from(e.target.files);t<a.length;t++){var n=a[t];fetch("/files/withoutWatermark/"+n.name,{method:"POST",body:n,headers:{"content-type":"image/png"}})}},n.componentDidMount=function(){n.activateFetchFromServer()},n.activateFetchFromServer=function(){return n.timer=setTimeout((function(){n.fetchImageListFromServer(),n.activateFetchFromServer()}),1e3)},n.convertDataToStateAndSetState=function(e){var t,a=[],r=[],o=[],i=Object(c.a)(e.files);try{for(i.s();!(t=i.n()).done;){var l=t.value;l.startsWith("/watermark")?a.push(l):l.startsWith("/withoutWatermark")?r.push(l):l.startsWith("/withWatermark")?o.push(l):console.error("unkown filepath "+l)}}catch(s){i.e(s)}finally{i.f()}return n.setState({watermark:a,withWatermark:o,withoutWatermark:r})},n.fetchImageListFromServer=function(){fetch("/list",{method:"POST",body:JSON.stringify({path:"/"}),headers:{"Content-Type":"application/json"}}).then((function(e){return e.json()})).then(n.convertDataToStateAndSetState)},n.handleDeleteFile=function(e){fetch(e,{method:"DELETE"}).then(n.fetchImageListFromServer())},n.state={watermark:[],withoutWatermark:[],withWatermark:[]};return n}return Object(s.a)(a,[{key:"render",value:function(){return r.a.createElement("div",{style:{padding:30}},r.a.createElement(j.a,{container:!0,spacing:2},r.a.createElement(j.a,{container:!0,item:!0,xs:3,direction:"column"},r.a.createElement("h2",null,"Watermark"),r.a.createElement(b,Object.assign({},this.state,{path:"/watermark/",picsIds:this.state.watermark,handleDeleteFile:this.handleDeleteFile})),r.a.createElement("div",{className:"upload-btn-wrapper"},r.a.createElement("button",{className:"btn"},"Upload Watermark"),r.a.createElement("input",{type:"file",onChange:this.handleWatermarkChanged}))),r.a.createElement(j.a,{container:!0,item:!0,xs:4,direction:"column"},r.a.createElement("h2",null,"Photos"),r.a.createElement(b,Object.assign({},this.state,{path:"/withoutWatermark/",picsIds:this.state.withoutWatermark,handleDeleteFile:this.handleDeleteFile})),r.a.createElement("div",{className:"upload-btn-wrapper"},r.a.createElement("button",{className:"btn"},"Upload Photos"),r.a.createElement("input",{id:"file-upload",type:"file",multiple:!0,onChange:this.handleUploadNonWatermarkedPictures}))),r.a.createElement(j.a,{container:!0,item:!0,xs:4,direction:"column"},r.a.createElement("h2",null,"Ready to Download"),r.a.createElement(b,Object.assign({},this.state,{path:"/withWatermark/",picsIds:this.state.withWatermark,handleDeleteFile:this.handleDeleteFile})),r.a.createElement("form",{action:"download_all",method:"POST"},r.a.createElement("div",{className:"upload-btn-wrapper"},r.a.createElement("input",{class:"btn",type:"submit",id:"download",value:"Download all files"}))))),r.a.createElement(D,Object.assign({},this.state,{tasksDone:this.state.withWatermark.length,tasksToDo:this.state.withoutWatermark.length})))}}]),a}(r.a.Component),O=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function T(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var a=e.installing;null!=a&&(a.onstatechange=function(){"installed"===a.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(F,null)),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/Server-In-Client",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("/Server-In-Client","/server.js");O?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(a){var n=a.headers.get("content-type");404===a.status||null!=n&&-1===n.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):T(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")}))):T(t,e)}))}}();for(var C=0;C<5;C++)new Worker("worker.js")}},[[38,1,2]]]);
//# sourceMappingURL=main.bdd59d01.chunk.js.map
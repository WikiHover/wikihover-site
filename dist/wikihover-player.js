!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).nlp=t()}(this,(function(){"use strict";const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");var t=function(t){let r=(t=t||"_")+"-";for(let t=0;t<7;t++)r+=e[Math.floor(Math.random()*e.length)];return r};let r={"!":"¡","?":"¿Ɂ",'"':'“”"❝❞',"'":"‘‛❛❜","-":"—–",a:"ªÀÁÂÃÄÅàáâãäåĀāĂăĄąǍǎǞǟǠǡǺǻȀȁȂȃȦȧȺΆΑΔΛάαλАадѦѧӐӑӒӓƛɅæ",b:"ßþƀƁƂƃƄƅɃΒβϐϦБВЪЬвъьѢѣҌҍ",c:"¢©ÇçĆćĈĉĊċČčƆƇƈȻȼͻͼͽϲϹϽϾСсєҀҁҪҫ",d:"ÐĎďĐđƉƊȡƋƌǷ",e:"ÈÉÊËèéêëĒēĔĕĖėĘęĚěƎƏƐǝȄȅȆȇȨȩɆɇΈΕΞΣέεξϱϵ϶ЀЁЕЭеѐёҼҽҾҿӖӗӘәӚӛӬӭ",f:"ƑƒϜϝӺӻҒғſ",g:"ĜĝĞğĠġĢģƓǤǥǦǧǴǵ",h:"ĤĥĦħƕǶȞȟΉΗЂЊЋНнђћҢңҤҥҺһӉӊ",I:"ÌÍÎÏ",i:"ìíîïĨĩĪīĬĭĮįİıƖƗȈȉȊȋΊΐΪίιϊІЇії",j:"ĴĵǰȷɈɉϳЈј",k:"ĶķĸƘƙǨǩΚκЌЖКжкќҚқҜҝҞҟҠҡ",l:"ĹĺĻļĽľĿŀŁłƚƪǀǏǐȴȽΙӀӏ",m:"ΜϺϻМмӍӎ",n:"ÑñŃńŅņŇňŉŊŋƝƞǸǹȠȵΝΠήηϞЍИЙЛПийлпѝҊҋӅӆӢӣӤӥπ",o:"ÒÓÔÕÖØðòóôõöøŌōŎŏŐőƟƠơǑǒǪǫǬǭǾǿȌȍȎȏȪȫȬȭȮȯȰȱΌΘΟθοσόϕϘϙϬϭϴОФоѲѳӦӧӨөӪӫ",p:"ƤƿΡρϷϸϼРрҎҏÞ",q:"Ɋɋ",r:"ŔŕŖŗŘřƦȐȑȒȓɌɍЃГЯгяѓҐґ",s:"ŚśŜŝŞşŠšƧƨȘșȿЅѕ",t:"ŢţŤťŦŧƫƬƭƮȚțȶȾΓΤτϮТт",u:"µÙÚÛÜùúûüŨũŪūŬŭŮůŰűŲųƯưƱƲǓǔǕǖǗǘǙǚǛǜȔȕȖȗɄΰμυϋύ",v:"νѴѵѶѷ",w:"ŴŵƜωώϖϢϣШЩшщѡѿ",x:"×ΧχϗϰХхҲҳӼӽӾӿ",y:"ÝýÿŶŷŸƳƴȲȳɎɏΎΥΫγψϒϓϔЎУучўѰѱҮүҰұӮӯӰӱӲӳ",z:"ŹźŻżŽžƩƵƶȤȥɀΖζ"},a={};Object.keys(r).forEach((function(e){r[e].split("").forEach((function(t){a[t]=e}))}));var n=e=>{let t=e.split("");return t.forEach((e,r)=>{a[e]&&(t[r]=a[e])}),t.join("")};const i=/([A-Z]\.)+[A-Z]?,?$/,o=/^[A-Z]\.,?$/,s=/[A-Z]{2,}('s|,)?$/,l=/([a-z]\.)+[a-z]\.?$/;var u=function(e){return!0===i.test(e)||(!0===l.test(e)||(!0===o.test(e)||!0===s.test(e)))};const c=n,h=u,d=/[a-z\u00C0-\u00FF] ?\/ ?[a-z\u00C0-\u00FF]/;const g=function(e){let t=e=(e=(e=e||"").toLowerCase()).trim();return e=c(e),!0===d.test(e)&&(e=e.replace(/\/.*/,"")),e=(e=(e=(e=(e=(e=(e=e.replace(/^[#@]/,"")).replace(/[,;.!?]+$/,"")).replace(/[\u0027\u0060\u00B4\u2018\u2019\u201A\u201B\u2032\u2035\u2039\u203A]+/g,"'")).replace(/[\u0022\u00AB\u00BB\u201C\u201D\u201E\u201F\u2033\u2034\u2036\u2037\u2E42\u301D\u301E\u301F\uFF02]+/g,'"')).replace(/\u2026/g,"...")).replace(/\u2013/g,"-")).replace(/([aeiou][ktrp])in$/,"$1ing"),!0===/^(re|un)-?[^aeiou]./.test(e)&&(e=e.replace("-","")),h(e)&&(e=e.replace(/\./g,"")),!1===/^[:;]/.test(e)&&(e=(e=(e=e.replace(/\.{3,}$/g,"")).replace(/[",\.!:;\?\)]+$/g,"")).replace(/^['"\(]+/g,"")),""===(e=(e=e.replace(/[\u200B-\u200D\uFEFF]/g,"")).trim())&&(e=t),e=e.replace(/([0-9]),([0-9])/g,"$1$2")},p=function(e){return e=(e=e.replace(/['’]s$/,"")).replace(/s['’]$/,"s")},m=/^[ \n\t\.\[\](){}⟨⟩:,،、‒–—―…!‹›«»‐\-?‘’;\/⁄·&*•^†‡°¡¿※№÷×ºª%‰+−=‱¶′″‴§~\|‖¦©℗®℠™¤₳฿\u0022\uFF02\u0027\u201C\u201F\u201B\u201E\u2E42\u201A\u2035\u2036\u2037\u301D\u0060\u301F]+/,f=/[ \n\t\.'\[\](){}⟨⟩:,،、‒–—―…!‹›«»‐\-?‘’;\/⁄·&*@•^†‡°¡¿※#№÷×ºª‰+−=‱¶′″‴§~\|‖¦©℗®℠™¤₳฿\u0022\uFF02\u201D\u00B4\u301E]+$/,b=/\//,y=/['’]/,v=/^[a-z]\.([a-z]\.)+/i,w=/^[-+\.][0-9]/,k=/^'[0-9]{2}/;var A=e=>{let t=e,r="",a="";""===(e=(e=e.replace(m,t=>(r=t,"-"!==r&&"+"!==r&&"."!==r||!w.test(e)?"'"===r&&k.test(e)?(r="",t):"":(r="",t)))).replace(f,n=>(a=n,y.test(n)&&/[sn]['’]$/.test(t)&&!1===y.test(r)?(a=a.replace(y,""),"'"):!0===v.test(e)?(a=a.replace(/\./,""),"."):"")))&&(t=t.replace(/ *$/,e=>(a=e||"","")),e=t,r="",a=a);let n=g(e);const i={text:e,clean:n,reduced:p(n),pre:r,post:a};return b.test(e)&&e.split(b).forEach(e=>{i.alias=i.alias||{},i.alias[e.trim()]=!0}),i},D={};!function(e){const t=/^[A-Z][a-z'\u00C0-\u00FF]/,r=/^[A-Z]+s?$/;e.toUpperCase=function(){return this.text=this.text.toUpperCase(),this},e.toLowerCase=function(){return this.text=this.text.toLowerCase(),this},e.toTitleCase=function(){return this.text=this.text.replace(/^ *[a-z\u00C0-\u00FF]/,e=>e.toUpperCase()),this},e.isUpperCase=function(){return r.test(this.text)},e.isTitleCase=function(){return t.test(this.text)},e.titleCase=e.isTitleCase}(D);var $={};!function(e){const t=/(\u0022|\uFF02|\u0027|\u201C|\u2018|\u201F|\u201B|\u201E|\u2E42|\u201A|\u00AB|\u2039|\u2035|\u2036|\u2037|\u301D|\u0060|\u301F)/,r=/(\u0022|\uFF02|\u0027|\u201D|\u2019|\u201D|\u2019|\u201D|\u201D|\u2019|\u00BB|\u203A|\u2032|\u2033|\u2034|\u301E|\u00B4|\u301E)/;e.hasPost=function(e){return-1!==this.post.indexOf(e)},e.hasPre=function(e){return-1!==this.pre.indexOf(e)},e.hasQuote=function(){return t.test(this.pre)||r.test(this.post)},e.hasQuotation=e.hasQuote,e.hasComma=function(){return this.hasPost(",")},e.hasPeriod=function(){return!0===this.hasPost(".")&&!1===this.hasPost("...")},e.hasExclamation=function(){return this.hasPost("!")},e.hasQuestionMark=function(){return this.hasPost("?")||this.hasPost("¿")},e.hasEllipses=function(){return this.hasPost("..")||this.hasPost("…")||this.hasPre("..")||this.hasPre("…")},e.hasSemicolon=function(){return this.hasPost(";")},e.hasSlash=function(){return/\//.test(this.text)},e.hasHyphen=function(){const e=/^(-|–|—)$/;return e.test(this.post)||e.test(this.pre)},e.hasDash=function(){const e=/ (-|–|—) /;return e.test(this.post)||e.test(this.pre)},e.hasContraction=function(){return Boolean(this.implicit)},e.addPunctuation=function(e){return","!==e&&";"!==e||(this.post=this.post.replace(e,"")),this.post=e+this.post,this}}($);var P={};const E=function(e,t,r=3){if(e===t)return 1;if(e.length<r||t.length<r)return 0;const a=function(e,t){let r=e.length,a=t.length;if(0===r)return a;if(0===a)return r;let n=(a>r?a:r)+1;if(Math.abs(r-a)>(n||100))return n||100;let i,o,s,l,u,c,h=[];for(let e=0;e<n;e++)h[e]=[e],h[e].length=n;for(let e=0;e<n;e++)h[0][e]=e;for(let n=1;n<=r;++n)for(o=e[n-1],i=1;i<=a;++i){if(n===i&&h[n][i]>4)return r;s=t[i-1],l=o===s?0:1,u=h[n-1][i]+1,(c=h[n][i-1]+1)<u&&(u=c),(c=h[n-1][i-1]+l)<u&&(u=c);let a=n>1&&i>1&&o===t[i-2]&&e[n-2]===s&&(c=h[n-2][i-2]+l)<u;h[n][i]=a?c:u}return h[r][a]}(e,t);let n=Math.max(e.length,t.length);return 1-(0===n?0:a/n)};let H=function(){};H=function(e,t,r,a){let n=function(e,t,r,a){if(t.id===e.id)return!0;if(!0===t.anything)return!0;if(!0===t.start&&0!==r)return!1;if(!0===t.end&&r!==a-1)return!1;if(void 0!==t.word){if(null!==e.implicit&&e.implicit===t.word)return!0;if(void 0!==e.alias&&e.alias.hasOwnProperty(t.word))return!0;if(!0===t.soft&&t.word===e.root)return!0;if(void 0!==t.fuzzy){let r=E(t.word,e.reduced);if(r>t.fuzzy)return!0;if(!0===t.soft&&(r=E(t.word,e.root),r>t.fuzzy))return!0}return t.word===e.clean||t.word===e.text||t.word===e.reduced}return void 0!==t.tag?!0===e.tags[t.tag]:void 0!==t.method?"function"==typeof e[t.method]&&!0===e[t.method]():void 0!==t.regex?t.regex.test(e.clean):void 0!==t.fastOr?!(!e.implicit||!0!==t.fastOr.hasOwnProperty(e.implicit))||t.fastOr.hasOwnProperty(e.reduced)||t.fastOr.hasOwnProperty(e.text):void 0!==t.choices&&("and"===t.operator?t.choices.every(t=>H(e,t,r,a)):t.choices.some(t=>H(e,t,r,a)))}(e,t,r,a);return!0===t.negative?!n:n};const j=H,N=u,x={};P.doesMatch=function(e,t,r){return j(this,e,t,r)},P.isAcronym=function(){return N(this.text)},P.isImplicit=function(){return""===this.text&&Boolean(this.implicit)},P.isKnown=function(){return Object.keys(this.tags).some(e=>!0!==x[e])},P.setRoot=function(e){let t=e.transforms,r=this.implicit||this.clean;if(this.tags.Plural&&(r=t.toSingular(r,e)),this.tags.Verb&&!this.tags.Negative&&!this.tags.Infinitive){let a=null;this.tags.PastTense?a="PastTense":this.tags.Gerund?a="Gerund":this.tags.PresentTense?a="PresentTense":this.tags.Participle?a="Participle":this.tags.Actor&&(a="Actor"),r=t.toInfinitive(r,e,a)}this.root=r};var F={};const C=n,B=/[\s-]/,G=/^[A-Z-]+$/;F.textOut=function(e,t,r){e=e||{};let a=this.text,n=this.pre,i=this.post;return!0===e.reduced&&(a=this.reduced||""),!0===e.root&&(a=this.root||""),!0===e.implicit&&this.implicit&&(a=this.implicit||""),!0===e.normal&&(a=this.clean||this.text||""),!0===e.root&&(a=this.root||this.reduced||""),!0===e.unicode&&(a=C(a)),!0===e.titlecase&&(this.tags.ProperNoun&&!this.titleCase()||(this.tags.Acronym?a=a.toUpperCase():G.test(a)&&!this.tags.Acronym&&(a=a.toLowerCase()))),!0===e.lowercase&&(a=a.toLowerCase()),!0===e.acronyms&&this.tags.Acronym&&(a=a.replace(/\./g,"")),!0!==e.whitespace&&!0!==e.root||(n="",i=" ",!1!==B.test(this.post)&&!e.last||this.implicit||(i="")),!0!==e.punctuation||e.root||(!0===this.hasPost(".")?i="."+i:!0===this.hasPost("?")?i="?"+i:!0===this.hasPost("!")?i="!"+i:!0===this.hasPost(",")?i=","+i:!0===this.hasEllipses()&&(i="..."+i)),!0!==t&&(n=""),!0!==r&&(i=""),!0===e.abbreviations&&this.tags.Abbreviation&&(i=i.replace(/^\./,"")),n+a+i};var z={};const I={Auxiliary:1,Possessive:1};const O=function(e,t){let r=Object.keys(e.tags);const a=t.tags;return r=r.sort((e,t)=>I[t]||!a[t]?-1:a[t]?a[e]?a[e].lineage.length>a[t].lineage.length?1:a[e].isA.length>a[t].isA.length?-1:0:0:1),r},T={text:!0,tags:!0,implicit:!0,whitespace:!0,clean:!1,id:!1,index:!1,offset:!1,bestTag:!1};z.json=function(e,t){e=e||{};let r={};return(e=Object.assign({},T,e)).text&&(r.text=this.text),e.normal&&(r.normal=this.clean),e.tags&&(r.tags=Object.keys(this.tags)),e.clean&&(r.clean=this.clean),(e.id||e.offset)&&(r.id=this.id),e.implicit&&null!==this.implicit&&(r.implicit=this.implicit),e.whitespace&&(r.pre=this.pre,r.post=this.post),e.bestTag&&(r.bestTag=O(this,t)[0]),r};var V=Object.assign({},D,$,P,F,z),M={},J={};function L(){return"undefined"!=typeof window&&window.document}const S=function(e,t){for(e=e.toString();e.length<t;)e+=" ";return e};J.logTag=function(e,t,r){if(L())return void console.log("%c"+S(e.clean,3)+"  + "+t+" ","color: #6accb2;");let a="[33m"+S(e.clean,15)+"[0m + [32m"+t+"[0m ";r&&(a=S(a,35)+" "+r),console.log(a)},J.logUntag=function(e,t,r){if(L())return void console.log("%c"+S(e.clean,3)+"  - "+t+" ","color: #AB5850;");let a="[33m"+S(e.clean,3)+" [31m - #"+t+"[0m ";r&&(a=S(a,35)+" "+r),console.log(a)},J.isArray=function(e){return"[object Array]"===Object.prototype.toString.call(e)},J.titleCase=e=>e.charAt(0).toUpperCase()+e.substr(1);const _=J,K=function(e,t,r,a){let n=a.tags;if(""===t||"."===t||"-"===t)return;if("#"===t[0]&&(t=t.replace(/^#/,"")),t=_.titleCase(t),!0===e.tags[t])return;const i=a.isVerbose();!0===i&&_.logTag(e,t,r),e.tags[t]=!0,!0===n.hasOwnProperty(t)&&(n[t].isA.forEach(t=>{e.tags[t]=!0,!0===i&&_.logTag(e,"→ "+t)}),e.unTag(n[t].notA,"←",a))};const q=J,W=/^[a-z]/,R=function(e,t,r,a){const n=a.isVerbose();if("*"===t)return e.tags={},e;var i;t=t.replace(/^#/,""),!0===W.test(t)&&(t=(i=t).charAt(0).toUpperCase()+i.substr(1)),!0===e.tags[t]&&(delete e.tags[t],!0===n&&q.logUntag(e,t,r));const o=a.tags;if(o[t]){let r=o[t].lineage;for(let t=0;t<r.length;t++)!0===e.tags[r[t]]&&(delete e.tags[r[t]],!0===n&&q.logUntag(e," - "+r[t]))}return e};const U=function(e,t,r){const a=r.tags;if("#"===t[0]&&(t=t.replace(/^#/,"")),void 0===a[t])return!0;let n=a[t].notA||[];for(let t=0;t<n.length;t++)if(!0===e.tags[n[t]])return!1;return void 0===a[t].isA||U(e,a[t].isA,r)};const Q=function(e,t,r,a){if("string"!=typeof t)for(let n=0;n<t.length;n++)K(e,t[n],r,a);else K(e,t,r,a)},Z=function(e,t,r,a){if("string"!=typeof t&&t)for(let n=0;n<t.length;n++)R(e,t[n],r,a);else R(e,t,r,a)},X=U;M.tag=function(e,t,r){return Q(this,e,t,r),this},M.tagSafe=function(e,t,r){return X(this,e,r)&&Q(this,e,t,r),this},M.unTag=function(e,t,r){return Z(this,e,t,r),this},M.canBe=function(e,t){return X(this,e,t)};const Y=t,ee=A,te=V,re=M;class ae{constructor(e=""){e=String(e);let t=ee(e);this.text=t.text||"",this.clean=t.clean,this.reduced=t.reduced,this.root=null,this.implicit=null,this.pre=t.pre||"",this.post=t.post||"",this.tags={},this.prev=null,this.next=null,this.id=Y(t.clean),this.isA="Term",t.alias&&(this.alias=t.alias)}set(e){let t=ee(e);return this.text=t.text,this.clean=t.clean,this.reduced=t.reduced,this.root=null,this.implicit=null,this}}ae.prototype.clone=function(){let e=new ae(this.text);return e.pre=this.pre,e.post=this.post,e.clean=this.clean,e.reduced=this.reduced,e.root=this.root,e.implicit=this.implicit,e.tags=Object.assign({},this.tags),e},Object.assign(ae.prototype,te),Object.assign(ae.prototype,re);var ne=ae,ie={terms:function(e){if(0===this.length)return[];if(this.cache.terms)return void 0!==e?this.cache.terms[e]:this.cache.terms;let t=[this.pool.get(this.start)];for(let r=0;r<this.length-1;r+=1){let a=t[t.length-1].next;if(null===a){console.error("Compromise error: Linked list broken in phrase '"+this.start+"'");break}let n=this.pool.get(a);if(t.push(n),void 0!==e&&e===r)return t[e]}return void 0===e&&(this.cache.terms=t),void 0!==e?t[e]:t},clone:function(e){if(e){let e=this.buildFrom(this.start,this.length);return e.cache=this.cache,e}let t=this.terms().map(e=>e.clone());return t.forEach((e,r)=>{this.pool.add(e),t[r+1]&&(e.next=t[r+1].id),t[r-1]&&(e.prev=t[r-1].id)}),this.buildFrom(t[0].id,t.length)},lastTerm:function(){let e=this.terms();return e[e.length-1]},hasId:function(e){if(0===this.length||!e)return!1;if(this.start===e)return!0;if(this.cache.terms){let t=this.cache.terms;for(let r=0;r<t.length;r++)if(t[r].id===e)return!0;return!1}let t=this.start;for(let r=0;r<this.length-1;r+=1){let r=this.pool.get(t);if(void 0===r)return console.error(`Compromise error: Linked list broken. Missing term '${t}' in phrase '${this.start}'\n`),!1;if(r.next===e)return!0;t=r.next}return!1},wordCount:function(){return this.terms().filter(e=>""!==e.text).length},fullSentence:function(){let e=this.terms(0);for(;e.prev;)e=this.pool.get(e.prev);let t=e.id,r=1;for(;e.next;)e=this.pool.get(e.next),r+=1;return this.buildFrom(t,r)}},oe={};oe.text=function(e={},t,r){"string"==typeof e&&(e="normal"===e?{whitespace:!0,unicode:!0,lowercase:!0,punctuation:!0,acronyms:!0,abbreviations:!0,implicit:!0,normal:!0}:"clean"===e?{titlecase:!1,lowercase:!0,punctuation:!0,whitespace:!0,unicode:!0,implicit:!0,normal:!0}:"reduced"===e?{punctuation:!1,titlecase:!1,lowercase:!0,whitespace:!0,unicode:!0,implicit:!0,reduced:!0}:"implicit"===e?{punctuation:!0,implicit:!0,whitespace:!0,trim:!0}:"root"===e?{titlecase:!1,lowercase:!0,punctuation:!0,whitespace:!0,unicode:!0,implicit:!0,root:!0}:{});let a=this.terms(),n=!1;a[0]&&null===a[0].prev&&null===a[a.length-1].next&&(n=!0);let i=a.reduce((i,o,s)=>{if(0===s&&""===o.text&&null!==o.implicit&&!e.implicit)return i;e.last=r&&s===a.length-1;let l=!0,u=!0;return!1===n&&(0===s&&t&&(l=!1),s===a.length-1&&r&&(u=!1)),i+o.textOut(e,l,u)},"");return!0===n&&r&&(i=i.replace(/ +$/,"")),!0===e.trim&&(i=i.trim()),i};var se={trim:function(){let e=this.terms();if(e.length>0){e[0].pre=e[0].pre.replace(/^\s+/,"");let t=e[e.length-1];t.post=t.post.replace(/\s+$/,"")}return this}},le={};const ue=/[.?!]\s*$/,ce=function(e,t){t[0].pre=e[0].pre;let r=e[e.length-1],a=t[t.length-1];a.post=function(e,t){if(ue.test(t))return t+e.match(/\s*$/);return e}(r.post,a.post),r.post="",""===r.post&&(r.post+=" ")};const he=/ /;const de=function(e,t,r){let a=e.terms(),n=t.terms();ce(a,n),function(e,t,r){let a=e[e.length-1],n=t[t.length-1],i=a.next;a.next=t[0].id,n.next=i,i&&(r.get(i).prev=n.id);let o=e[0].id;o&&(t[0].prev=o)}(a,n,e.pool);let i=[e],o=e.start,s=[r];return s=s.concat(r.parents()),s.forEach(e=>{let t=e.list.filter(e=>e.hasId(o));i=i.concat(t)}),i=function(e){return e.filter((t,r)=>e.indexOf(t)===r)}(i),i.forEach(e=>{e.length+=t.length}),e.cache={},e},ge=function(e,t,r){const a=e.start;let n=t.terms();!function(e){let t=e[e.length-1];!1===he.test(t.post)&&(t.post+=" ")}(n),function(e,t,r){let a=r[r.length-1];a.next=e.start;let n=e.pool,i=n.get(e.start);i.prev&&(n.get(i.prev).next=t.start);r[0].prev=e.terms(0).prev,e.terms(0).prev=a.id}(e,t,n);let i=[e],o=[r];return o=o.concat(r.parents()),o.forEach(e=>{let r=e.list.filter(e=>e.hasId(a)||e.hasId(t.start));i=i.concat(r)}),i=function(e){return e.filter((t,r)=>e.indexOf(t)===r)}(i),i.forEach(e=>{e.length+=t.length,e.start===a&&(e.start=t.start),e.cache={}}),e},pe=function(e,t){let r=t.pool(),a=e.terms(),n=r.get(a[0].prev)||{},i=r.get(a[a.length-1].next)||{};a[0].implicit&&n.implicit&&(n.set(n.implicit),n.post+=" "),function(e,t,r,a){let n=e.parents();n.push(e),n.forEach(e=>{let n=e.list.find(e=>e.hasId(t));n&&(n.length-=r,n.start===t&&(n.start=a.id),n.cache={})}),e.list=e.list.filter(e=>!(!e.start||!e.length))}(t,e.start,e.length,i),n&&(n.next=i.id),i&&(i.prev=n.id)};le.append=function(e,t){return de(this,e,t),this},le.prepend=function(e,t){return ge(this,e,t),this},le.delete=function(e){return pe(this,e),this},le.replace=function(e,t){let r=this.length;de(this,e,t);let a=this.buildFrom(this.start,this.length);a.length=r,pe(a,t)},le.splitOn=function(e){let t=this.terms(),r={before:null,match:null,after:null},a=t.findIndex(t=>t.id===e.start);if(-1===a)return r;let n=t.slice(0,a);n.length>0&&(r.before=this.buildFrom(n[0].id,n.length));let i=t.slice(a,a+e.length);i.length>0&&(r.match=this.buildFrom(i[0].id,i.length));let o=t.slice(a+e.length,t.length);return o.length>0&&(r.after=this.buildFrom(o[0].id,o.length,this.pool)),r};var me={json:function(e={},t){let r={};return e.text&&(r.text=this.text()),e.normal&&(r.normal=this.text("normal")),e.clean&&(r.clean=this.text("clean")),e.reduced&&(r.reduced=this.text("reduced")),e.implicit&&(r.implicit=this.text("implicit")),e.root&&(r.root=this.text("root")),e.trim&&(r.text&&(r.text=r.text.trim()),r.normal&&(r.normal=r.normal.trim()),r.reduced&&(r.reduced=r.reduced.trim())),e.terms&&(!0===e.terms&&(e.terms={}),r.terms=this.terms().map(r=>r.json(e.terms,t))),r}},fe={lookAhead:function(e){e||(e=".*");let t=this.pool,r=[];const a=function(e){let n=t.get(e);n&&(r.push(n),n.prev&&a(n.next))};let n=this.terms(),i=n[n.length-1];return a(i.next),0===r.length?[]:this.buildFrom(r[0].id,r.length).match(e)},lookBehind:function(e){e||(e=".*");let t=this.pool,r=[];const a=function(e){let n=t.get(e);n&&(r.push(n),n.prev&&a(n.prev))};let n=t.get(this.start);return a(n.prev),0===r.length?[]:this.buildFrom(r[r.length-1].id,r.length).match(e)}},be=Object.assign({},ie,oe,se,le,me,fe),ye={};var ve=function(e,t){if(0===t.length)return!0;for(let e=0;e<t.length;e+=1){let r=t[e];if(!0!==r.optional&&!0!==r.negative&&!0===r.start&&e>0)return!0;if(!0===r.anything&&!0===r.negative)return!0}return!1},we={};!function(e){e.getGreedy=function(e,t){let r=Object.assign({},e.regs[e.r],{start:!1,end:!1}),a=e.t;for(;e.t<e.terms.length;e.t+=1){if(t&&e.terms[e.t].doesMatch(t,e.start_i+e.t,e.phrase_length))return e.t;let n=e.t-a+1;if(void 0!==r.max&&n===r.max)return e.t;if(!1===e.terms[e.t].doesMatch(r,e.start_i+e.t,e.phrase_length))return void 0!==r.min&&n<r.min?null:e.t}return e.t},e.greedyTo=function(e,t){let r=e.t;if(!t)return e.terms.length;for(;r<e.terms.length;r+=1)if(!0===e.terms[r].doesMatch(t,e.start_i+r,e.phrase_length))return r;return null},e.isEndGreedy=function(e,t){if(!0===e.end&&!0===e.greedy&&t.start_i+t.t<t.phrase_length-1){let r=Object.assign({},e,{end:!1});if(!0===t.terms[t.t].doesMatch(r,t.start_i+t.t,t.phrase_length))return!0}return!1},e.doOrBlock=function(t,r=0){let a=t.regs[t.r],n=!1;for(let e=0;e<a.choices.length;e+=1){let i=a.choices[e];if(n=i.every((e,a)=>{let n=0,i=t.t+a+r+n;if(void 0===t.terms[i])return!1;let o=t.terms[i].doesMatch(e,i+t.start_i,t.phrase_length);if(!0===o&&!0===e.greedy)for(let r=1;r<t.terms.length;r+=1){let a=t.terms[i+r];if(a){if(!0!==a.doesMatch(e,t.start_i+r,t.phrase_length))break;n+=1}}return r+=n,o}),n){r+=i.length;break}}return n&&!0===a.greedy?e.doOrBlock(t,r):r},e.doAndBlock=function(e){let t=0;return!0===e.regs[e.r].choices.every(r=>{let a=r.every((t,r)=>{let a=e.t+r;return void 0!==e.terms[a]&&e.terms[a].doesMatch(t,a,e.phrase_length)});return!0===a&&r.length>t&&(t=r.length),a})&&t},e.getGroup=function(e,t,r){if(e.groups[e.groupId])return e.groups[e.groupId];const a=e.terms[t].id;return e.groups[e.groupId]={group:String(r),start:a,length:0},e.groups[e.groupId]}}(we);const ke=t,Ae=we;var De=function(e,t,r,a){let n={t:0,terms:e,r:0,regs:t,groups:{},start_i:r,phrase_length:a,hasGroup:!1,groupId:null,previousGroup:null};for(;n.r<t.length;n.r+=1){let e=t[n.r];if(n.hasGroup="string"==typeof e.named||"number"==typeof e.named,!0===n.hasGroup){const r=t[n.r-1];r&&r.named===e.named&&n.previousGroup?n.groupId=n.previousGroup:(n.groupId=ke(e.named),n.previousGroup=n.groupId)}if(!n.terms[n.t]){if(!1===t.slice(n.r).some(e=>!e.optional))break;return null}if(!0===e.anything&&!0===e.greedy){let r=Ae.greedyTo(n,t[n.r+1]);if(null===r||0===r)return null;if(void 0!==e.min&&r-n.t<e.min)return null;if(void 0!==e.max&&r-n.t>e.max){n.t=n.t+e.max;continue}if(!0===n.hasGroup){Ae.getGroup(n,n.t,e.named).length=r-n.t}n.t=r;continue}if(void 0!==e.choices&&"or"===e.operator){let t=Ae.doOrBlock(n);if(t){if(!0===e.negative)return null;if(!0===n.hasGroup){Ae.getGroup(n,n.t,e.named).length+=t}n.t+=t;continue}if(!e.optional)return null}if(void 0!==e.choices&&"and"===e.operator){let t=Ae.doAndBlock(n);if(t){if(!0===e.negative)return null;if(!0===n.hasGroup){Ae.getGroup(n,n.t,e.named).length+=t}n.t+=t;continue}if(!e.optional)return null}let r=n.terms[n.t],i=r.doesMatch(e,n.start_i+n.t,n.phrase_length);if(!0===e.anything||!0===i||Ae.isEndGreedy(e,n)){let i=n.t;if(e.optional&&t[n.r+1]&&e.negative)continue;if(e.optional&&t[n.r+1]){let a=r.doesMatch(t[n.r+1],n.start_i+n.t,n.phrase_length);if(e.negative||a){let e=n.terms[n.t+1];e&&e.doesMatch(t[n.r+1],n.start_i+n.t,n.phrase_length)||(n.r+=1)}}if(n.t+=1,!0===e.end&&n.t!==n.terms.length&&!0!==e.greedy)return null;if(!0===e.greedy){if(n.t=Ae.getGreedy(n,t[n.r+1]),null===n.t)return null;if(e.min&&e.min>n.t)return null;if(!0===e.end&&n.start_i+n.t!==a)return null}if(!0===n.hasGroup){const t=Ae.getGroup(n,i,e.named);n.t>1&&e.greedy?t.length+=n.t-i:t.length++}}else{if(e.negative){let t=Object.assign({},e);if(t.negative=!1,!0===n.terms[n.t].doesMatch(t,n.start_i+n.t,n.phrase_length))return null}if(!0!==e.optional){if(n.terms[n.t].isImplicit()&&t[n.r-1]&&n.terms[n.t+1]){if(n.terms[n.t-1]&&n.terms[n.t-1].implicit===t[n.r-1].word)return null;if(n.terms[n.t+1].doesMatch(e,n.start_i+n.t,n.phrase_length)){n.t+=2;continue}}return null}}}return{match:n.terms.slice(0,n.t),groups:n.groups}};var $e=function(e,t,r){if(!r||0===r.length)return r;if(t.some(e=>e.end)){let t=e[e.length-1];r=r.filter(({match:e})=>-1!==e.indexOf(t))}return r};const Pe=/(?:^|\s)([\!\[\^]*(?:<[^<]*>)?\/.*?[^\\\/]\/[\?\]\+\*\$~]*)(?:\s|$)/,Ee=/([\!\[\^]*(?:<[^<]*>)?\([^\)]+[^\\\)]\)[\?\]\+\*\$~]*)(?:\s|$)/,He=/ /g,je=e=>/^[\!\[\^]*(<[^<]*>)?\//.test(e)&&/\/[\?\]\+\*\$~]*$/.test(e),Ne=function(e){return e=(e=e.map(e=>e.trim())).filter(e=>e)};var xe=function(e){let t=e.split(Pe),r=[];t.forEach(e=>{je(e)?r.push(e):r=r.concat(e.split(Ee))}),r=Ne(r);let a=[];return r.forEach(e=>{(e=>/^[\!\[\^]*(<[^<]*>)?\(/.test(e)&&/\)[\?\]\+\*\$~]*$/.test(e))(e)||je(e)?a.push(e):a=a.concat(e.split(He))}),a=Ne(a),a};const Fe=/\{([0-9]+,?[0-9]*)\}/,Ce=/&&/,Be=new RegExp(/^<\s*?(\S+)\s*?>/),Ge=function(e){return e[e.length-1]},ze=function(e){return e[0]},Ie=function(e){return e.substr(1)},Oe=function(e){return e.substr(0,e.length-1)},Te=function(e){return e=Ie(e),e=Oe(e)},Ve=function(e){let t={};for(let r=0;r<2;r+=1){if("$"===Ge(e)&&(t.end=!0,e=Oe(e)),"^"===ze(e)&&(t.start=!0,e=Ie(e)),("["===ze(e)||"]"===Ge(e))&&(t.named=!0,"["===ze(e)?t.groupType="]"===Ge(e)?"single":"start":t.groupType="end",e=(e=e.replace(/^\[/,"")).replace(/\]$/,""),"<"===ze(e))){const r=Be.exec(e);r.length>=2&&(t.named=r[1],e=e.replace(r[0],""))}if("+"===Ge(e)&&(t.greedy=!0,e=Oe(e)),"*"!==e&&"*"===Ge(e)&&"\\*"!==e&&(t.greedy=!0,e=Oe(e)),"?"===Ge(e)&&(t.optional=!0,e=Oe(e)),"!"===ze(e)&&(t.negative=!0,e=Ie(e)),"("===ze(e)&&")"===Ge(e)){Ce.test(e)?(t.choices=e.split(Ce),t.operator="and"):(t.choices=e.split("|"),t.operator="or"),t.choices[0]=Ie(t.choices[0]);let r=t.choices.length-1;t.choices[r]=Oe(t.choices[r]),t.choices=t.choices.map(e=>e.trim()),t.choices=t.choices.filter(e=>e),t.choices=t.choices.map(e=>e.split(/ /g).map(Ve)),e=""}if("/"===ze(e)&&"/"===Ge(e))return e=Te(e),t.regex=new RegExp(e),t;if("~"===ze(e)&&"~"===Ge(e))return e=Te(e),t.soft=!0,t.word=e,t}return!0===Fe.test(e)&&(e=e.replace(Fe,(e,r)=>{let a=r.split(/,/g);return 1===a.length?(t.min=Number(a[0]),t.max=Number(a[0])):(t.min=Number(a[0]),t.max=Number(a[1]||999)),t.greedy=!0,t.optional=!0,""})),"#"===ze(e)?(t.tag=Ie(e),t.tag=(r=t.tag).charAt(0).toUpperCase()+r.substr(1),t):"@"===ze(e)?(t.method=Ie(e),t):"."===e?(t.anything=!0,t):"*"===e?(t.anything=!0,t.greedy=!0,t.optional=!0,t):(e&&(e=(e=e.replace("\\*","*")).replace("\\.","."),t.word=e.toLowerCase()),t);var r};const Me=xe,Je=Ve,Le=function(e,t={}){return e.filter(e=>e.groupType).length>0&&(e=function(e){let t,r=!1,a=-1;for(let n=0;n<e.length;n++){const i=e[n];"single"!==i.groupType||!0!==i.named?("start"===i.groupType&&(r=!0,"string"==typeof i.named||"number"==typeof i.named?t=i.named:(a+=1,t=a)),r&&(i.named=t),"end"===i.groupType&&(r=!1)):(a+=1,i.named=a)}return e}(e)),t.fuzzy||(e=function(e){return e.map(e=>{if(void 0!==e.choices&&!0===e.choices.every(e=>{if(1!==e.length)return!1;let t=e[0];return void 0!==t.word&&!0!==t.negative&&!0!==t.optional&&!0!==t.method})){let t={};e.choices.forEach(e=>{t[e[0].word]=!0}),e.fastOr=t,delete e.choices}return e})}(e)),e};var Se=function(e,t={}){if(null==e||""===e)return[];if("object"==typeof e){if(function(e){return"[object Array]"===Object.prototype.toString.call(e)}(e)){if(0===e.length||!e[0])return[];if("object"==typeof e[0])return e;if("string"==typeof e[0])return function(e){return[{choices:e.map(e=>[{word:e}]),operator:"or"}]}(e)}return e&&"Doc"===e.isA?function(e){if(!e||!e.list||!e.list[0])return[];let t=[];return e.list.forEach(e=>{let r=[];e.terms().forEach(e=>{r.push(e.id)}),t.push(r)}),[{idBlocks:t}]}(e):[]}"number"==typeof e&&(e=String(e));let r=Me(e);return r=r.map(e=>Je(e)),r=Le(r,t),r=function(e,t){return!0===t.fuzzy&&(t.fuzzy=.85),"number"==typeof t.fuzzy&&(e=e.map(e=>(t.fuzzy>0&&e.word&&(e.fuzzy=t.fuzzy),e.choices&&e.choices.forEach(e=>{e.forEach(e=>{e.fuzzy=t.fuzzy})}),e))),e}(r,t),r};const _e=ve,Ke=De,qe=$e,We=Se,Re=function(e,t){let r=[],a=t[0].idBlocks;for(let t=0;t<e.length;t+=1)a.forEach(a=>{if(0===a.length)return;a.every((r,a)=>e[t+a].id===r)&&(r.push({match:e.slice(t,t+a.length)}),t+=a.length-1)});return r};var Ue=function(e,t,r=!1){if("string"==typeof t&&(t=We(t)),!0===_e(e,t))return[];const a=t.filter(e=>!0!==e.optional&&!0!==e.negative).length;let n=e.terms(),i=[];if(t[0].idBlocks){let e=Re(n,t);if(e&&e.length>0)return qe(n,t,e)}if(!0===t[0].start){let e=Ke(n,t,0,n.length);return e&&e.match&&e.match.length>0&&(e.match=e.match.filter(e=>e),i.push(e)),qe(n,t,i)}for(let e=0;e<n.length&&!(e+a>n.length);e+=1){let a=Ke(n.slice(e),t,e,n.length);if(a&&a.match&&a.match.length>0&&(e+=a.match.length-1,a.match=a.match.filter(e=>e),i.push(a),!0===r))return qe(n,t,i)}return qe(n,t,i)};const Qe=Ue;const Ze=Ue,Xe=function(e,t){let r={};Qe(e,t).forEach(({match:e})=>{e.forEach(e=>{r[e.id]=!0})});let a=e.terms(),n=[],i=[];return a.forEach(e=>{!0!==r[e.id]?i.push(e):i.length>0&&(n.push(i),i=[])}),i.length>0&&n.push(i),n};ye.match=function(e,t=!1){let r=Ze(this,e,t);return r=r.map(({match:e,groups:t})=>{let r=this.buildFrom(e[0].id,e.length,t);return r.cache.terms=e,r}),r},ye.has=function(e){return Ze(this,e,!0).length>0},ye.not=function(e){let t=Xe(this,e);return t=t.map(e=>this.buildFrom(e[0].id,e.length)),t},ye.canBe=function(e,t){let r=[],a=this.terms(),n=!1;for(let i=0;i<a.length;i+=1){let o=a[i].canBe(e,t);!0===o&&(!0===n?r[r.length-1].push(a[i]):r.push([a[i]]),n=o)}return r=r.filter(e=>e.length>0).map(e=>this.buildFrom(e[0].id,e.length)),r};const Ye=be,et=ye;class tt{constructor(e,t,r){this.start=e,this.length=t,this.isA="Phrase",Object.defineProperty(this,"pool",{enumerable:!1,writable:!0,value:r}),Object.defineProperty(this,"cache",{enumerable:!1,writable:!0,value:{}}),Object.defineProperty(this,"groups",{enumerable:!1,writable:!0,value:{}})}}tt.prototype.buildFrom=function(e,t,r){let a=new tt(e,t,this.pool);return r&&Object.keys(r).length>0?a.groups=r:a.groups=this.groups,a},Object.assign(tt.prototype,et),Object.assign(tt.prototype,Ye);const rt={term:"terms"};Object.keys(rt).forEach(e=>tt.prototype[e]=tt.prototype[rt[e]]);var at=tt;class nt{constructor(e={}){Object.defineProperty(this,"words",{enumerable:!1,value:e})}add(e){return this.words[e.id]=e,this}get(e){return this.words[e]}remove(e){delete this.words[e]}merge(e){return Object.assign(this.words,e.words),this}stats(){return{words:Object.keys(this.words).length}}}nt.prototype.clone=function(){let e=Object.keys(this.words).reduce((e,t)=>{let r=this.words[t].clone();return e[r.id]=r,e},{});return new nt(e)};var it=nt;var ot=e=>{e.forEach((t,r)=>{r>0&&(t.prev=e[r-1].id),e[r+1]&&(t.next=e[r+1].id)})};const st=/(\S.+?[.!?\u203D\u2E18\u203C\u2047-\u2049])(?=\s+|$)/g,lt=/\S/,ut=/[ .][A-Z]\.? *$/i,ct=/(?:\u2026|\.{2,}) *$/,ht=/((?:\r?\n|\r)+)/,dt=/[a-z0-9\u00C0-\u00FF\u00a9\u00ae\u2000-\u3300\ud000-\udfff]/i,gt=/^\s+/,pt=function(e,t,r,a){if(a.hasLetter=function(e,t){return t||dt.test(e)}(t,a.hasLetter),!a.hasLetter)return!1;if(function(e,t){return-1!==t.indexOf(".")&&ut.test(e)}(e,t))return!1;if(function(e,t){return-1!==t.indexOf(".")&&ct.test(e)}(e,t))return!1;let n=e.replace(/[.!?\u203D\u2E18\u203C\u2047-\u2049] *$/,"").split(" "),i=n[n.length-1].toLowerCase();return!r.hasOwnProperty(i)};var mt=function(e,t){let r=t.cache.abbreviations;e=e||"";let a=[],n=[];if(!(e=String(e))||"string"!=typeof e||!1===lt.test(e))return a;let i=function(e){let t=[],r=e.split(ht);for(let e=0;e<r.length;e++){let a=r[e].split(st);for(let e=0;e<a.length;e++)t.push(a[e])}return t}(e=e.replace(" "," "));for(let e=0;e<i.length;e++){let t=i[e];if(void 0!==t&&""!==t){if(!1===lt.test(t)){if(n[n.length-1]){n[n.length-1]+=t;continue}if(i[e+1]){i[e+1]=t+i[e+1];continue}}n.push(t)}}let o=n[0]||"";const s={hasLetter:!1};for(let e=0;e<n.length;e++){let t=n[e];n[e+1]&&!1===pt(t,o,r,s)?(o=n[e+1]||"",n[e+1]=t+o):t&&t.length>0&&(a.push(t),o=n[e+1]||"",s.hasLetter=!1),n[e]=""}if(0===a.length)return[e];for(let e=1;e<a.length;e+=1){let t=a[e].match(gt);null!==t&&(a[e-1]+=t[0],a[e]=a[e].replace(gt,""))}return a};const ft=/\S/,bt=/^[!?.]+$/,yt=/(\S+)/,vt=/[a-z] ?\/ ?[a-z]*$/;let wt=[".","?","!",":",";","-","–","—","--","...","(",")","[","]",'"',"'","`"];wt=wt.reduce((e,t)=>(e[t]=!0,e),{});const kt=function(e){if(!0===/^(re|un|micro|macro|trans|bi|mono|over)-?[^aeiou]./.test(e))return!1;if(!0===/^([a-z\u00C0-\u00FF/]+)(-|–|—)(like|ish|less|able)/i.test(e))return!1;if(!0===/^([a-z\u00C0-\u00FF`"'/]+)(-|–|—)([a-z0-9\u00C0-\u00FF].*)/i.test(e))return!0;return!0===/^([0-9]{1,4})(-|–|—)([a-z\u00C0-\u00FF`"'/-]+$)/i.test(e)},At=function(e){let t=[];const r=e.split(/[-–—]/);let a="-",n=e.match(/[-–—]/);n&&n[0]&&(a=n);for(let e=0;e<r.length;e++)e===r.length-1?t.push(r[e]):t.push(r[e]+a);return t};const Dt=ne,$t=at,Pt=it,Et=ot,Ht=mt,jt=function(e){let t=[],r=[];if("number"==typeof(e=e||"")&&(e=String(e)),function(e){return"[object Array]"===Object.prototype.toString.call(e)}(e))return e;const a=e.split(yt);for(let e=0;e<a.length;e++)!0!==kt(a[e])?r.push(a[e]):r=r.concat(At(a[e]));let n="";for(let e=0;e<r.length;e++){let a=r[e];!0===ft.test(a)&&!1===wt.hasOwnProperty(a)&&!1===bt.test(a)?(t.length>0?(t[t.length-1]+=n,t.push(a)):t.push(n+a),n=""):n+=a}return n&&(0===t.length&&(t[0]=""),t[t.length-1]+=n),t=function(e){for(let t=1;t<e.length-1;t++)vt.test(e[t])&&(e[t-1]+=e[t]+e[t+1],e[t]=null,e[t+1]=null);return e}(t),t=function(e){const t=/^[0-9]{1,4}(:[0-9][0-9])?([a-z]{1,2})? ?(-|–|—) ?$/,r=/^[0-9]{1,4}([a-z]{1,2})? ?$/;for(let a=0;a<e.length-1;a+=1)e[a+1]&&t.test(e[a])&&r.test(e[a+1])&&(e[a]=e[a]+e[a+1],e[a+1]=null);return e}(t),t=t.filter(e=>e),t};var Nt=function(e="",t,r){let a=null;return"string"!=typeof e&&("number"==typeof e?e=String(e):function(e){return"[object Array]"===Object.prototype.toString.call(e)}(e)&&(a=e)),a=a||Ht(e,t),a=a.map(e=>jt(e)),r=r||new Pt,a.map(e=>{e=e.map(e=>{let t=new Dt(e);return r.add(t),t}),Et(e);let t=new $t(e[0].id,e.length,r);return t.cache.terms=e,t})};const xt=ne,Ft=at,Ct=it,Bt=ot;var Gt=function(e,t){let r=new Ct;return e.map((e,a)=>{let n=e.terms.map((n,i)=>{let o=new xt(n.text);return o.pre=void 0!==n.pre?n.pre:"",void 0===n.post&&(n.post=" ",i>=e.terms.length-1&&(n.post=". ",a>=e.terms.length-1&&(n.post="."))),o.post=void 0!==n.post?n.post:" ",n.tags&&n.tags.forEach(e=>o.tag(e,"",t)),r.add(o),o});return Bt(n),new Ft(n[0].id,n.length,r)})};const zt=["Person","Place","Organization"];const It=["Noun","Verb","Adjective","Adverb","Value","QuestionWord"];const Ot={Noun:"blue",Verb:"green",Negative:"green",Date:"red",Value:"red",Adjective:"magenta",Preposition:"cyan",Conjunction:"cyan",Determiner:"cyan",Adverb:"cyan"};const Tt=function(e){return Object.keys(e).forEach(t=>{e[t].color?e[t].color=e[t].color:Ot[t]?e[t].color=Ot[t]:e[t].isA.some(r=>!!Ot[r]&&(e[t].color=Ot[r],!0))}),e},Vt=function(e){return Object.keys(e).forEach(t=>{let r=e[t],a=r.isA.length;for(let t=0;t<a;t++){let a=r.isA[t];e[a]&&(r.isA=r.isA.concat(e[a].isA))}r.isA=function(e){return e.filter((e,t,r)=>r.indexOf(e)===t)}(r.isA)}),e},Mt=function(e){let t=Object.keys(e);return t.forEach(r=>{let a=e[r];a.notA=a.notA||[],a.isA.forEach(t=>{if(e[t]&&e[t].notA){let r="string"==typeof e[t].notA?[e[t].isA]:e[t].notA||[];a.notA=a.notA.concat(r)}});for(let n=0;n<t.length;n++){const i=t[n];-1!==e[i].notA.indexOf(r)&&a.notA.push(i)}a.notA=function(e){return e.filter((e,t,r)=>r.indexOf(e)===t)}(a.notA)}),e},Jt=function(e){let t=Object.keys(e);return t.forEach(r=>{let a=e[r];a.lineage=[];for(let n=0;n<t.length;n++)-1!==e[t[n]].isA.indexOf(r)&&a.lineage.push(t[n])}),e};var Lt=function(e){return e=function(e){return Object.keys(e).forEach(t=>{let r=e[t];r.isA=r.isA||[],"string"==typeof r.isA&&(r.isA=[r.isA]),r.notA=r.notA||[],"string"==typeof r.notA&&(r.notA=[r.notA])}),e}(e),e=Vt(e),e=Mt(e),e=Tt(e),e=Jt(e)};const St={Noun:{notA:["Verb","Adjective","Adverb"]},Singular:{isA:"Noun",notA:"Plural"},ProperNoun:{isA:"Noun"},Person:{isA:["ProperNoun","Singular"],notA:["Place","Organization","Date"]},FirstName:{isA:"Person"},MaleName:{isA:"FirstName",notA:["FemaleName","LastName"]},FemaleName:{isA:"FirstName",notA:["MaleName","LastName"]},LastName:{isA:"Person",notA:["FirstName"]},NickName:{isA:"Person",notA:["FirstName","LastName"]},Honorific:{isA:"Noun",notA:["FirstName","LastName","Value"]},Place:{isA:"Singular",notA:["Person","Organization"]},Country:{isA:["Place","ProperNoun"],notA:["City"]},City:{isA:["Place","ProperNoun"],notA:["Country"]},Region:{isA:["Place","ProperNoun"]},Address:{isA:"Place"},Organization:{isA:["Singular","ProperNoun"],notA:["Person","Place"]},SportsTeam:{isA:"Organization"},School:{isA:"Organization"},Company:{isA:"Organization"},Plural:{isA:"Noun",notA:["Singular"]},Uncountable:{isA:"Noun"},Pronoun:{isA:"Noun",notA:zt},Actor:{isA:"Noun",notA:zt},Activity:{isA:"Noun",notA:["Person","Place"]},Unit:{isA:"Noun",notA:zt},Demonym:{isA:["Noun","ProperNoun"],notA:zt},Possessive:{isA:"Noun"}},_t={Verb:{notA:["Noun","Adjective","Adverb","Value","Expression"]},PresentTense:{isA:"Verb",notA:["PastTense","FutureTense"]},Infinitive:{isA:"PresentTense",notA:["PastTense","Gerund"]},Imperative:{isA:"Infinitive"},Gerund:{isA:"PresentTense",notA:["PastTense","Copula","FutureTense"]},PastTense:{isA:"Verb",notA:["FutureTense"]},FutureTense:{isA:"Verb"},Copula:{isA:"Verb"},Modal:{isA:"Verb",notA:["Infinitive"]},PerfectTense:{isA:"Verb",notA:"Gerund"},Pluperfect:{isA:"Verb"},Participle:{isA:"PastTense"},PhrasalVerb:{isA:"Verb"},Particle:{isA:"PhrasalVerb"},Auxiliary:{notA:["Noun","Adjective","Value"]}},Kt={Value:{notA:["Verb","Adjective","Adverb"]},Ordinal:{isA:"Value",notA:["Cardinal"]},Cardinal:{isA:"Value",notA:["Ordinal"]},Fraction:{isA:"Value",notA:["Noun"]},RomanNumeral:{isA:"Cardinal",notA:["Ordinal","TextValue"]},TextValue:{isA:"Value",notA:["NumericValue"]},NumericValue:{isA:"Value",notA:["TextValue"]},Money:{isA:"Cardinal"},Percent:{isA:"Value"}},qt={Adjective:{notA:["Noun","Verb","Adverb","Value"]},Comparable:{isA:["Adjective"]},Comparative:{isA:["Adjective"]},Superlative:{isA:["Adjective"],notA:["Comparative"]},NumberRange:{},Adverb:{notA:["Noun","Verb","Adjective","Value"]},Date:{notA:["Verb","Adverb","Preposition","Adjective"]},Month:{isA:["Date","Singular"],notA:["Year","WeekDay","Time"]},WeekDay:{isA:["Date","Noun"]},Timezone:{isA:["Date","Noun"],notA:["Adjective","ProperNoun"]},Time:{isA:["Date"],notA:["AtMention"]},Determiner:{notA:It},Conjunction:{notA:It},Preposition:{notA:It},QuestionWord:{notA:["Determiner"]},Currency:{isA:["Noun"]},Expression:{notA:["Noun","Adjective","Verb","Adverb"]},Abbreviation:{},Url:{notA:["HashTag","PhoneNumber","Verb","Adjective","Value","AtMention","Email"]},PhoneNumber:{notA:["HashTag","Verb","Adjective","Value","AtMention","Email"]},HashTag:{},AtMention:{isA:["Noun"],notA:["HashTag","Verb","Adjective","Value","Email"]},Emoji:{notA:["HashTag","Verb","Adjective","Value","AtMention"]},Emoticon:{notA:["HashTag","Verb","Adjective","Value","AtMention"]},Email:{notA:["HashTag","Verb","Adjective","Value","AtMention"]},Acronym:{notA:["Plural","RomanNumeral"]},Negative:{notA:["Noun","Adjective","Value"]},Condition:{notA:["Verb","Adjective","Noun","Value"]}},Wt=Lt,Rt=function(e,t){Object.keys(e).forEach(r=>{t[r]=e[r]})};var Ut=(()=>{let e={};return Rt(St,e),Rt(_t,e),Rt(Kt,e),Rt(qt,e),e=Wt(e),e})();const Qt="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",Zt=Qt.split("").reduce((function(e,t,r){return e[t]=r,e}),{});var Xt=function(e){if(void 0!==Zt[e])return Zt[e];let t=0,r=1,a=36,n=1;for(;r<e.length;t+=a,r++,a*=36);for(let r=e.length-1;r>=0;r--,n*=36){let a=e.charCodeAt(r)-48;a>10&&(a-=7),t+=a*n}return t};const Yt=function(e,t,r){const a=Xt(t);return a<e.symCount?e.syms[a]:r+a+1-e.symCount};var er=function(e){const t={nodes:e.split(";"),syms:[],symCount:0};return e.match(":")&&function(e){const t=new RegExp("([0-9A-Z]+):([0-9A-Z]+)");for(let r=0;r<e.nodes.length;r++){const a=t.exec(e.nodes[r]);if(!a){e.symCount=r;break}e.syms[Xt(a[1])]=Xt(a[2])}e.nodes=e.nodes.slice(e.symCount,e.nodes.length)}(t),function(e){const t=[],r=(a,n)=>{let i=e.nodes[a];"!"===i[0]&&(t.push(n),i=i.slice(1));const o=i.split(/([A-Z0-9,]+)/g);for(let i=0;i<o.length;i+=2){const s=o[i],l=o[i+1];if(!s)continue;const u=n+s;if(","===l||void 0===l){t.push(u);continue}const c=Yt(e,l,a);r(c,u)}};return r(0,""),t}(t)};const tr={Comparative:"true¦better",Superlative:"true¦earlier",PresentTense:"true¦is,sounds",Value:"true¦a few",Noun:"true¦a5b4c2f1here,ie,lit,m0no doubt,pd,tce;a,d;t,y;a,ca,o0;l,rp;a,l;d,l,rc",Copula:"true¦a1is,w0;as,ere;m,re",PastTense:"true¦be3came,d2had,lied,meant,sa2taken,w0;as,e0;nt,re;id;en,gan",Condition:"true¦if,lest,unless",Preposition:"true¦'o,-,aLbIcHdGexcept,fFiDmidQnotwithstandiRoBpSqua,sAt6u3vi2w0;/o,hereNith0;!in,oR;a,s-a-vis;n1p0;!on;like,til;h0ill,owards;an,r0;ough0u;!oJ;ans,ince,o that;',f0n2ut;!f;f,n0;!to;or,rom;espite,own,u3;hez,irca;ar1e0oAy;sides,tween;ri6;',bo7cross,ft6lo5m3propos,round,s1t0;!op;! long 0;as;id0ong0;!st;ng;er;ut",Gerund:"true¦accord0be0develop0go0result0stain0;ing",Negative:"true¦n0;ever,o0;!n,t",QuestionWord:"true¦how3wh0;at,e1ich,o0y;!m,se;n,re; come,'s",Plural:"true¦records",Conjunction:"true¦&,aFbBcuz,how9in caEno8o7p5supposing,t2v1wh0yet;eth9ile;ers4s;h0o;eref9o0;!uC;l0rovided that;us;r,therwi6; matt1r;!ev0;er;e0ut;cau1f0;ore;se;lthou1nd,s 0;far as,if;gh",Abbreviation:"true¦a0Jb0Gc0Ad08e05f02g01h00iYjWkanVlTmNnKoJpFque,rDs8t6u5v2w0;is0r,y0B;!c;a,b,e1i0ol,s,t;tro,vo;r,t;niv,safa,t;ce,e0;l,mp,nn,x;ask,e2fc,gt,i1q,r,s,t,u0;pt,rg;r,tu;c,nJp0;!t;b,d,e0;pGs,v;a,d,ennNhd,l,p,r1s0vt;!eud;ef,o0;b,f,n;ct,kla,nt;e0ov;b0e;!r;a4d,essrs,i1lle,me,r7s0t;!tr;n1s0;c,ter;!n;!j,r,sc;at,it,lb,ng,t0;!d;!s;an,d,r,u0;l,n;a,da,e,n0;c,f;on,wy;a,en,ov;e1ig,l0m,r,t,y;!a;b,m;a,g,ng,s1tc,x0;!p;p,q,t;ak,e0ist,r;c,f,pt,t;a3ca,l,m2o0pl,res,yn;!l0m1nn,rp;!o;dr;!l0pt;!if;a,c,l1r0;ig,os;!dg,vd;d4l3p2r1ss0tty,ug,ve;n,t;c,iz;prox,r,t;!ta;!j,m,v",Pronoun:"true¦'em,elle,h4i3me,ourselves,she5th1us,we,you0;!rself;e0ou;m,y;!l,t;e0im;!'s",Singular:"true¦0:16;1:13;2:19;a16b0Tc0Kd0De0Af05g00hWiVjel0kitty,lTmPnOoNpHquestionGrEs9t6u4w3;ay,om03;nc10s 3;doll0Lst0N; rex,a4h3ic,ragedy,v show;ere,i2;l0x return;i6ky,omeoNt3uper bowl,yst15;ep4ri2u3;de0Yff;faTmoT;st1ze;al0i2o3;om,se;! mark;a7i1la6r4u3;dQrpoI;e3ie0Hobl0V;roga00ss releaG;te,y1;rt,te0N;bjWceJthers,verview;othi2umb1;a5ee08o3;del,m3nopo0rni2th1;!my;n,yf0;i3unch;ne;ci2nsect;ead start,o3uman right;l0me4u3;se;! run;adf0entlem6irl02laci1od,rand4u3;l0y; slam,fa3mo3;th1;an;a6ella,ly,ol0r4un3;di2;ee market,iWo3;nti1sP;mi0th1;conomy,gg,ner7ven4x3;ampTecu9;i2t;ad8e5inn1o3ragonf0ude;cumentGg3i0l0or;gy;ath,t3;ec3;tive;!dy;a9eili2h7i5o3redit card;ttage,u3;ri1sin;ty,vil w3;ar;andeli1ocol3;ate;n3rF;ary;aCel0lesJo8r5u3;n3tterf0;ti2;eakfa4o3;!th1;st;dy,tt5y3;!fri3;end;le;nki2r3;ri1;er;d5l0noma0u3;nt;ly; homin5verti3;si2;ng;em",FemaleName:"true¦0:J3;1:J7;2:IG;3:IF;4:IX;5:IK;6:JO;7:H0;8:JG;9:JK;A:HN;B:HY;C:IT;D:IP;E:JD;F:HC;G:I0;aGRbFLcDPdCYeBOfB4gADh9Ti9Gj8Gk7Gl60m49n3No3Jp37qu36r2Ds16t0Eu0Cv02wVxiTyOzH;aLeIineb,oHsof2;e3Uf2la,ra;h3iKlIna,ynH;ab,ep;da,ma;da,h3iHra;nab;aKeJi0Fol5BuIvH;etAonDO;i0na;le0sen2;el,gm3Jn,rGJs8W;aoHme0nyi;m62yAE;aMendDYhiDFiH;dele8lJnH;if48niHo0;e,f47;a,helmi0lHma;a,ow;ka0nB;aNeKiHusa5;cIktoriBMlAole7viH;anC3enJ0;kF9tor2;da,lA9nus,rHs0;a,nHoniH4;a,iFQ;leHnesH4;nIHrH;i1y;g8rHxH5;su5te;aYeUhRiNoLrIuHy3;i,la;acIZiHu0L;c2na,sH;hBPta;nHr0H;iBNya;aJffaEOnHs6;a,gtiH;ng;!nFQra;aIeHomasi0;a,l9Po8Ares1;l2ndolwethu;g9Go88rIssH;!a,ie;eHi,ri9;sa,za;bPlNmLnJrIs6tHwa0;ia0um;a63yn;iHya;a,ka,s6;arB6e3iHmEDra;!ka;a,iH;a,t6;at6it6;a0Fcarlet3We0BhXiTkye,neza0oRtNuIyH;bIBlvi1;e,ha,mayIEni7sIzH;an3MetAie,y;anHi9;!a,e,nH;aDe;aJeH;fHl5GphH;an4;cHZr5;b2fiA8m0OnHphi1;d3ia,ja,ya;er3lJmon1nIobh8PtH;a,i;dy;lEPv2;aMeIirHo0risF7y5;a,lDK;ba,e0i5lJrH;iHrDOyl;!d8Hfa;ia,lDX;hd,iMki3nJrIu0w0yH;la,ma,na;i,le8on,ron;aIda,ia,nHon;a,on;!ya;k6mH;!aa;lJrItaye81vH;da,inj;e0ife;en1i0ma;anA5bNd3Nh1RiBkMlLmJndIrHs6vannaD;aDi0;ra,y;aHi3;nt6ra;lDKma,ome;ee0in8Ru3;in1ri0;a05e00hYiVoIuH;by,thDH;bScRghQl2KnPsJwIxH;anAXie,y;an,e0;aIeHie,lE; merBLann9ll1marDBt7;!lHnn1;iHyn;e,nH;a,d9K;da,i,na;ayy8D;hel62io;bDKer7yn;a,cIkHmas,n9Fta,ya;ki,o;helGki;ea,iannGDoH;da,n1K;an0bJem9Agi0iInHta,y0;a88ee;han83na;a,eH;cEAkaD;bi0chIe,i0mo0nHquEKvCy0;di,ia;aEIelHiB;!e,le;een4ia0;aNeMhKipaluk,oJrHute66;iHudenCQ;scil3LyamvaB;lly,rt2;ilome0oebe,ylH;is,lis;arl,ggy,nelope,r5t3;ige,m0TnKo5rvaDGtIulH;a,etAin1;ricHsy,tBY;a,e,ia;do3i06;ctav2dIfCZis6lHphCZumC3yunbileg;a,ga,iv2;eHvAC;l2tA;aWeUiMoIurHy5;!ay,ul;a,eJor,rIuH;f,r;aDeCma;ll1mi;aNcLhariBOkKlaJna,sHta,vi;anHha;ur;!y;a,iDTki;hoGk9VolH;a,eDJ;!mh;hir,lHna,risFsreC;!a,lBT;asuLdKh2i6CnJomi9rgEPtHzanin zah3;aHhal4;li1s6;cy,etA;a,e8iEV;nngu30;a09ckenz4e01iMoJrignayani,uriDDyH;a,rH;a,lNna,tG;bi0i3llBInH;a,iH;ca,ka,qD3;a,cTkaSlNmi,nLrItzi,yH;ar;aIiam,lH;anEO;!l,nB;dy,eHh,n4;nhGrva;aKdJiCPlH;iHy;cent,e;red;!gros;!e5;ae5hH;ae5el3Z;ag5EgNi,lKrH;edi79iIjem,on,yH;em,l;em,sF;an4iHliF;nHsCE;a,da;!an,han;b0DcASd0Be,g09ha,i08ja,l06n04rLsoum60tKuIv82x9IyHz4;a,bell,ra,soB9;de,rH;a,eC;h8Fild1t4;a,cYgUiKjor4l7Sn4s6tJwa,yH;!aHbe6Wja8lAE;m,nBH;a,ha,in1;!aJbCBeIja,lEna,sHt64;!a,ol,sa;!l1H;! Jh,mInH;!a,e,n1;!awit,i;aliAHcJeduarBfernIjHlui5Y;o6Ful2;anB;ecil2la3;arJeIie,oHr44ueriA;!t;!ry;et42i37;el4Ui76y;dHon,ue5;akran7y;ak,en,iHk,lo3O;a,ka,nB;a,re,s4te;daHg4;!l3A;alEd4elHge,isDBon0;ei8in1yn;el,le;a0Ne0CiYoQuLyH;d2la,nH;!a,dIeBGnHsCL;!a,eBF;a,sCJ;aCWcJel0PiFlIna,pHz;e,i7;a,u,wa;iHy;a0Se,ja,l2JnB;is,l1SrJttIuHvel4;el5is1;e,ie;aKeIi9na,rH;a86i9;lHn1t7;ei;!in1;aSbb9CdRepa,lMnJsIv2zH;!a,be5LetAz4;a,etA;!a,dH;a,sHy;ay,ey,i,y;a,iJja,lHy;iHy;aA0e;!aH;!n5F;ia,ya;!nH;!a,ne;aPda,e0iNjYla,nMoKsJtHx4y5;iHt4;c2t2;e2LlCG;la,nHra;a,ie,o3;a,or1;a,gh,laH;!ni;!h,nH;a,d3e,n5P;cOdon97iNkes6mi9Ana,rMtJurIvHxmi,y5;ern1in2;a,e54ie,yn;as6iIoH;nya,ya;fa,s6;a,isF;a,la;ey,ie,y;a04eZhXiOlAKoNrJyH;lHra;a,ee,ie;istHy6D;a,en,iIyH;!na;!e,n59;nul,ri,urtnB0;aOerNlAZmJrHzzy;a,stH;en,in;!berlImernH;aq;eHi,y;e,y;a,stC;!na,ra;aHei3ongordzol;dij1w5;el7QiKjsi,lJnIrH;a,i,ri;d3na,za;ey,i,lBDs4y;ra,s6;bi7cAJdiat7IeB2iRlQmPnyakuma19rNss6KtKvi7yH;!e,lH;a,eH;e,i8L;a6DeIhHi4NlEri0y;ar6Ber6Bie,leCrB2y;!lyn8Gri0;a,en,iHl5Soli0yn;!ma,n3VsF;a5il1;ei8Ei,l4;a,tl6L;a07eYiVoNuH;anLdKliHst63;a8HeHsF;!n8tH;!a,te;e5Ji3Jy;a,i7;!anNcelEd6RelGhan7RlLni,sIva0yH;a,ce;eHie;fHlEph5U;a,in1;eHie;en,n1;!a,e,n41;lHng;!i1ClH;!i1B;anMle0nJrIsH;i8Csi8C;i,ri;!a,elGif2CnH;a,etAiHy;!e,f2A;a,e8EiInH;a,e8DiH;e,n1;cMd1mi,nIque4Xsmin3Ovie3y8zH;min9;a9eIiH;ce,e,n1s;!lHsFt0F;e,le;inIk4lEquelH;in1yn;da,ta;lRmPnOo0rNsIvaHzaro;!a0lu,na;aJiIlaHob84;!n9N;do3;!belHdo3;!a,e,l39;a77en1i0ma;a,di3es,gr6Yji;a8elBogH;en1;a,e8iHo0se;a0na;aSeOiJoHusFyacin2B;da,ll4rten23snH;a,i9Q;lImaH;ri;aIdHlaI;a,egard;ry;ath1CiJlInriet7rmi8sH;sa,t1B;en2Sga,mi;di;bi2Dil8IlNnMrJsItHwa,yl8Iz7H;i5St4;n5Yti;iHmo51ri52;etH;!te;aDnaD;a,ey,l4;a03eXiSlQoOrKunJwH;enHyne1Q;!dolE;ay,el;acIetHiselB;a,chC;e,ieH;!la;ld1AogooH;sh;adys,enHor2yn2H;a,da,na;aKgi,lIna,ov89selHta;a,e,le;da,liH;an;!n0;mLnJorgIrH;ald3Pi,m3Ctru8B;etAi4W;a,eHna;s26vieve;ma;bIil,le,mHrnet,yG;al5Ni5;i5FrielH;a,l1;aVeSiRloOoz2rH;anJeIiH;da,eB;da,ja;!cH;esIiHoi0O;n1s61;!ca;!rH;a,encH;e,ia;en,o0;lIn0rnH;!anB;ec2ic2;jr,n7rKtHy9;emIiHma,ouma7;ha,ma,n;eh;ah,iBrah,za0;cr4Nd0Ne0Mi0Lk7l04mWn4YrTsNtMuLvH;aJelIiH;!e,ta;in0Gyn;!ngel2S;geni1la,ni45;h5Sta;mLperanKtH;eIhHrel5;er;l30r9;za;a,eralB;iHma,nest2Jyn;cHka,n;a,ka;a,eMiJmH;aHie,y;!li8;lHn1;ee,iHy;a,e,ja;lHrald;da,y;aWeUiNlMma,no3oKsJvH;a,iH;na,ra;a,ie;iHuiH;se;a,en,ie,y;a0c2da,f,nMsJzaH;!betHve7;e,h;aHe,ka;!beH;th;!a,or;anor,nH;!a;!in1na;leCs6;vi;eIiHna,wi0;e,th;l,n;aYeMh2iLjeneKoHul30;lor5Tminiq4In3FrHtt4;a,eCis,la,othHthy;ea,y;ba;an0AnaDon8x4ya;anQbPde,eOiMja,lJmetr2nHsir5K;a,iH;ce,se;a,iIla,orHphi8;es,is;a,l6D;dHrdH;re;!d5Cna;!b2HoraDra;a,d3nH;!a,e;hl2i0l0HmNnLphn1rIvi1XyH;le,na;a,by,cIia,lH;a,en1;ey,ie;a,etAiH;!ca,el1Cka,z;arHia;is;a0Se0Oh05i03lVoKrIynH;di,th2;istHy05;al,i0;lPnMrIurH;tn1E;aJd2NiHn2Nri8;!nH;a,e,n1;!l1X;cepci59n4sH;tanHuelo;ce,za;eHleC;en,tA;aJeoIotH;il51;!pat3;ir9rJudH;etAiH;a,ne;a,e,iH;ce,sZ;a3er3ndH;i,y;aReNloe,rH;isJyH;stH;al;sy,tH;a1Ren,iHy;!an1e,n1;deJlseIrH;!i9yl;a,y;li8;nMrH;isKlImH;ai8;a,eHotA;n1tA;!sa;d3elGtH;al,elG;cIlH;esAi44;el2ilH;e,ia,y;itlZlYmilXndWrOsMtHy5;aKeJhHri0;erHleCrEy;in1;ri0;li0ri0;a33sH;a32ie;a,iNlLmeJolIrH;ie,ol;!e,in1yn;lHn;!a,la;a,eHie,o7y;ne,y;na,sF;a0Hi0H;a,e,l1;is7l4;in,yn;a0Ie02iZlXoUrH;andSeQiJoIyH;an0nn;nwEok9;an3DdgLg0XtH;n2XtH;!aInH;ey,i,y;ny;etH;!t9;an0e,nH;da,na;i9y;bbi9glarIlo05nH;i7n4;ka;ancHossom,ythe;a,he;an17lja0nHsm3I;i7tH;ou;aUcky,linTni7rPssOtJulaDvH;!erlH;ey,y;hJsy,tH;e,iHy9;e,na;!anH;ie,y;!ie;nHt6yl;adIiH;ce;etAi8;ay,da;!triH;ce,z;rbJyaH;rmH;aa;a3ie,o3ra;a2Sb2Md23g1Zi1Qj5l16m0Xn09oi,r04sUtTuPvOwa,yIzH;ra,u0;aKes6gJlIseH;!l;in;un;!nH;a,na;a,i2Ir2J;drJgus1RrIsteH;ja;el2;a,ey,i,y;aahua,he0;hIi2Gja,mi7s2DtrH;id;aMlIraqHt21;at;eIi9yH;!n;e,iHy;gh;!nH;ti;iJleIo6pi7;ta;en,n1tA;aHelG;!n1J;a00dje5eYgUiSjQnJohito,toHya;inetAnH;el5ia;!aKeIiHmJ;e,ka;!mHtA;ar4;!belIliFmU;sa;!le;a,eliH;ca;ka,sHta;a,sa;elHie;a,iH;a,ca,n1qH;ue;!tA;te;! JbImHstasiNya;ar2;el;cla3jul2pau5;aLberKeliJiHy;e,l2naH;!ta;a,ja;!ly;hGiIl2nB;da;a,ra;le;aWba,ePiMlKma,thJyH;a,c2sH;a,on,sa;ea;iHys0N;e,s0M;a,cIn1sHza;a,e,ha,on,sa;e,ia,ja;c2is6jaKksaKna,sJxH;aHia;!nd3;ia,saH;nd3;ra;ia;i0nIyH;ah,na;a,is,naDoud;la;c6da,leCmNnLsH;haDlH;inHyY;g,n;!h;a,o,slH;ey;ee;en;at6g4nIusH;ti0;es;ie;aWdiTelMrH;eJiH;anMenH;a,e,ne;an0;na;!aLeKiIyH;nn;a,n1;a,e;!ne;!iH;de;e,lEsH;on;yn;!lH;i8yn;ne;aKbIiHrL;!gaK;ey,i9y;!e;gaH;il;dKliyJradhIs6;ha;ya;ah;a,ya",Actor:"true¦aJbGcFdCengineIfAgardenIh9instructPjournalLlawyIm8nurse,opeOp5r3s1t0;echnCherapK;ailNcientJecretary,oldiGu0;pervKrgeon;e0oofE;ceptionGsearC;hotographClumbColi1r0sychologF;actitionBogrammB;cem6t5;echanic,inist9us4;airdress8ousekeep8;arm7ire0;fight6m2;eputy,iet0;ici0;an;arpent2lerk;ricklay1ut0;ch0;er;ccoun6d2ge7r0ssis6ttenda7;chitect,t0;ist;minist1v0;is1;rat0;or;ta0;nt",Honorific:"true¦a01bYcQdPeOfiJgIhon,jr,king,lHmCoffic00p7queen,r3s0taoiseach,vice6;e1fc,gt,ir,r,u0;ltRpt,rg;cond liInBrgeaJ;abbi,e0;ar1p9s,v0;!erend; admirX;astOhd,r0vt;esideDi1of0;!essM;me mini4nce0;!ss;a3essrs,i2lle,me,r1s0;!tr;!s;stK;gistrate,j,r6yF;i3lb,t;en,ov;eld mar3rst l0;ady,i0;eutena0;nt;shG;sq,xcellency;et,oct6r,utchess;apt6hance4mdr,o0pl;lonel,m2ngress0unci3;m0wom0;an;dr,mand5;ll0;or;!ain;ldg,rig0;!adi0;er;d0sst,tty,yatullah;j,m0v;!ir0;al",SportsTeam:"true¦0:1A;1:1H;2:1G;a1Eb16c0Td0Kfc dallas,g0Ihouston 0Hindiana0Gjacksonville jagua0k0El0Bm01newToQpJqueens parkIreal salt lake,sAt5utah jazz,vancouver whitecaps,w3yW;ashington 3est ham0Rh10;natio1Oredski2wizar0W;ampa bay 6e5o3;ronto 3ttenham hotspur;blue ja0Mrapto0;nnessee tita2xasC;buccanee0ra0K;a7eattle 5heffield0Kporting kansas0Wt3;. louis 3oke0V;c1Frams;marine0s3;eah15ounG;cramento Rn 3;antonio spu0diego 3francisco gJjose earthquak1;char08paA; ran07;a8h5ittsburgh 4ortland t3;imbe0rail blaze0;pirat1steele0;il3oenix su2;adelphia 3li1;eagl1philNunE;dr1;akland 3klahoma city thunder,rlando magic;athle0Mrai3;de0; 3castle01;england 7orleans 6york 3;city fc,g4je0FknXme0Fred bul0Yy3;anke1;ian0D;pelica2sain0C;patrio0Brevolut3;ion;anchester Be9i3ontreal impact;ami 7lwaukee b6nnesota 3;t4u0Fvi3;kings;imberwolv1wi2;rewe0uc0K;dolphi2heat,marli2;mphis grizz3ts;li1;cXu08;a4eicesterVos angeles 3;clippe0dodDla9; galaxy,ke0;ansas city 3nE;chiefs,roya0E; pace0polis colU;astr06dynamo,rockeTtexa2;olden state warrio0reen bay pac3;ke0;.c.Aallas 7e3i05od5;nver 5troit 3;lio2pisto2ti3;ge0;broncZnuggeM;cowbo4maver3;ic00;ys; uQ;arCelKh8incinnati 6leveland 5ol3;orado r3umbus crew sc;api5ocki1;brow2cavalie0india2;bengaWre3;ds;arlotte horAicago 3;b4cubs,fire,wh3;iteB;ea0ulR;diff3olina panthe0; c3;ity;altimore 9lackburn rove0oston 5rooklyn 3uffalo bilN;ne3;ts;cel4red3; sox;tics;rs;oriol1rave2;rizona Ast8tlanta 3;brav1falco2h4u3;nited;aw9;ns;es;on villa,r3;os;c5di3;amondbac3;ks;ardi3;na3;ls",Uncountable:"true¦0:1J;a1Qb1Ic19d16e0Zf0Tg0Mh0Hi0Dj0Cknowled1Pl07mXnWoVpRrMsBt6vi5w1;a3ea0Ai2oo1;d,l;ldlife,ne;rmth,t0;neg16ol0Btae;e4h3oothpaste,r1una;affSou1;ble,sers,t;ermod1Lund0;a,nnis;a9cene09eri0Wh8il7kittl0Wnow,o6p4t2u1;g0Znshi0P;ati1Ke1;am,el;ace1De1;ci0Red;ap,cc0;k,v0;eep,ingl0O;d0Cfe17l1nd,tish;m10t;a4e2ic1;e,ke0L;c1laxa0Hsearch;ogni0Grea0G;bi0Hin;aOe3hys17last8o1ress03;l1rk,w0;it15y9;a11trY;bstetr13il,xygen;ational securi0Vews;a8e6ilk,o3u1;mps,s1;ic;n1o0G;ey,o1;gamy;a1chan0V;sl03t;chine1il,themat0T; learn09ry;aught0e3i2ogi0Qu1;ck,g0G;ce,ghtn06ngui0OteratL;a1isK;th0;ewel8usti0J;ce,mp1nformaStself;a1ortan0H;ti1;en0F;a4isto3o1;ck1mework,n1spitali09;ey;ry;ir,libut,ppiB;ene4o2r1um,ymna0B;aAound;l1ssip;d,f; 1t08;editOpo1;ol;i5lour,o2urnit1;ure;od,rgive1uri0wl;ne1;ss;c7sh;conomZduca6lectr5n3quip4thZvery1;body,o1thF;ne;joy1tertain1;ment;iciNonU;tiG;ar2iabet1raugh2;es;ts;a8elcius,h4ivPl3o1urrency;al,ld w1nfusiBttB;ar;assMoth3;aos,e1;e2w1;ing;se;r5sh;a5eef,i2lood,owls,read,utt0;er;lliar2s1;on;ds;g1ss;ga1;ge;c6dvi5ero3ir2mnes1rt,thlet8;ty;craft;b5d1naut5;ynam4;ce;id,ou1;st1;ics",Infinitive:"true¦0:6S;1:76;2:5C;3:74;4:73;5:67;6:6F;7:6Y;8:6Q;9:72;A:70;B:5X;C:6X;D:6L;E:77;F:5B;a6Kb66c57d4De3Xf3Jg3Dh37i2Uj2Sk2Ql2Hm26n23o1Yp1Jr0Rs06tYuTvOwHyG;awn,e31ield;aJe1Zhist6iIoGre6D;nd0rG;k,ry;pe,sh,th0;lk,nHrGsh,tDve;n,raE;d0t;aJiHoG;te,w;eGsC;!w;l6Jry;nHpGr4se;gra4Pli41;dGi9lo5Zpub3Q;erGo;mi5Cw1I;aMeLhKig5SoJrHuGwi7;ne,rn;aGe0Mi5Uu7y;de,in,nsf0p,v5J;r2ZuD;ank,reatB;nd,st;ke pa53lk,rg1Qs9;aZcWeVhTi4Dkip,lSmRnee3Lo52pQtJuGwitD;bmCck,ff0gge7ppHrGspe5;ge,pri1rou4Zvi3;ly,o36;aLeKoJrHuG;dy,mb6;aFeGi3;ngthBss,tD;p,re;m,p;in,ke,r0Qy;la58oil,rink6;e1Zi6o3J;am,ip;a2iv0oG;ck,rtBut;arDem,le5n1r3tt6;aHo2rG;atDew;le,re;il,ve;a05eIisk,oHuG;in,le,sh;am,ll;a01cZdu8fYgXje5lUmTnt,pQquPsKtJvGwa5V;eGiew,o36;al,l,rG;se,t;aFi2u44;eJi7oItG;!o2rG;i5uc20;l3rt;mb6nt,r3;e7i2;air,eHlGo43r0K;a8y;at;aFemb0i3Zo3;aHeGi3y;a1nt;te,x;a5Dr0J;act1Yer,le5u1;a13ei3k5PoGyc6;gni2Cnci6rd;ch,li2Bs5N;i1nG;ge,k;aTerSiRlOoMrIuG;b21ll,mp,rGsh;cha1s4Q;ai1eIiEoG;cGdu8greAhibCmi1te7vi2W;eAlaim;di5pa2ss,veE;iEp,rtr46sGur;e,t;aHead,uG;g,n4;n,y;ck,le;fo34mCsi7;ck,iErt4Mss,u1;bJccur,ff0pera9utweIverGwe;co47lap,ta22u1wG;helm;igh;ser3taF;eHotG;e,i8;ed,gle5;aMeLiIoHuG;ltip3Grd0;nit13ve;nHrr12sreprG;eseE;d,g6us;asu2lt,n0Nr4;intaFna4rHtG;ch,t0;ch,kGry;et;aMeLiJoGu1C;aHck,oGve;k,sB;d,n;ft,g35ke,mCnk,st2YveG;!n;a2Fc0Et;b0Nck,uG;gh,nD;iGno34;ck,ll,ss;am,oFuG;d4mp;gno2mQnGss3H;cOdica9flu0MhNsKtIvG;eGol3;nt,st;erGrodu8;a5fe2;i7tG;aGru5;ll;abCibC;lu1Fr1D;agi24pG;lemeEo22ro3;aKeIi2oHuG;nt,rry;n02pe,st;aGlp;d,t;nd6ppBrm,te;aKloAove1PrIuG;arGeAi15;ant39d;aGip,ow,umb6;b,sp;in,th0ze;aReaQiOlMoJrHuncG;ti3J;acGeshB;tu2;cus,lHrG;ce,eca7m,s30;d,l24;a1ZoG;at,od,w;gu2lGni1Xt,x;e,l;r,tu2;il,stBvG;or;a15cho,le5mSnPstNvalua9xG;a0AcLerKi7pGte19;a18eHi2laFoGreA;rt,se;ct,riG;en8;ci1t;el,han4;abGima9;li1J;ab6couXdHfor8ga4han8j03riDsu2t0vG;isi2Vy;!u2;body,er4pG;hasiGow0;ze;a07eUiLoKrHuG;mp;aHeAiG;ft;g,in;d4ubt;ff0p,re5sHvG;iZor8;aKcHliGmiApl1Btingui14;ke;oGuA;uGv0;ra4;gr1YppG;ear,ro3;cOeNfLliv0ma0Fny,pKsHterG;mi0G;cribe,er3iHtrG;oy;gn,re;a0Be0Ai5osC;eGi0By;at,ct;m,pB;iIlHrG;ea1;a2i06;de;ma4n8rGte;e,kB;a0Ae09h06i9l04oJrG;aHeGoAu0Hy;a9dC;ck,ve;llZmSnHok,py,uGv0;gh,nt;cePdu5fMsKtIvG;eGin8;rt,y;aFin0VrG;a7ibu9ol;iGtitu9;d0st;iHoGroE;rm;gu2rm;rn;biLfoKmaJpG;a2laF;in;re;nd;rt;ne;ap1e5;aGip,o1;im,w;aHeG;at,ck,w;llen4n4r4se;a1nt0;ll,ncIrGt0u1;eGry;!en;el;aSePloOoMrIuG;lGry;ly;igHuG;sh;htB;en;a7mb,o7rrGth0un8;ow;ck;ar,lHnefCtrG;ay;ie3ong;ng,se;band0Jc0Bd06ffo05gr04id,l01mu1nYppTrQsKttGvoid,waC;acIeHra5;ct;m0Fnd;h,k;k,sG;eIiHocia9uG;me;gn,st;mb6rt;le;chHgGri3;ue;!i3;eaJlIroG;aDve;ch;aud,y;l,r;noun8sw0tG;icipa9;ce;lHt0;er;e4ow;ee;rd;aRdIju7mCoR;it;st;!reA;ss;cJhie3knowled4tiva9;te;ge;ve;eIouEu1;se;nt;pt;on",Unit:"true¦0:19;a14b12c0Od0Ne0Lf0Gg0Ch09in0Hjoule0k02l00mNnMoLpIqHsqCt7volts,w6y4z3°2µ1;g,s;c,f,n;b,e2;a0Nb,d0Dears old,o1;tt0H;att0b;able4b3d,e2on1sp;!ne0;a2r0D;!l,sp;spo04; ft,uare 1;c0Id0Hf3i0Fkilo0Jm1ya0E;e0Mil1;e0li0H;eet0o0D;t,uart0;ascals,e2i1ou0Pt;c0Mnt0;rcent,t02;hms,uYz;an0JewtT;/s,b,e9g,i3l,m2p1²,³;h,s;!²;!/h,cro5l1;e1li08;! pFs1²;! 1;anEpD;g06s0B;gQter1;! 2s1;! 1;per second;b,i00m,u1x;men0x0;b,elvin0g,ilo2m1nR;!/h,ph,²;byZgXmeter1;! p2s1;! p1;er1; hour;e1g,r0z;ct1rtz0;aXogQ;al2b,igAra1;in0m0;!l1;on0;a4emtPl2t1;²,³; oz,uid ou1;nce0;hrenheit0rad0;b,x1;abyH;eciCg,l,mA;arat0eAg,m9oulomb0u1;bic 1p0;c5d4fo3i2meAya1;rd0;nch0;ot0;eci2;enti1;me4;!²,³;lsius0nti1;g2li1me1;ter0;ram0;bl,y1;te0;c4tt1;os1;eco1;nd0;re0;!s",Organization:"true¦0:46;a3Ab2Qc2Ad21e1Xf1Tg1Lh1Gi1Dj19k17l13m0Sn0Go0Dp07qu06rZsStFuBv8w3y1;amaha,m0Xou1w0X;gov,tu2S;a3e1orld trade organizati41;lls fargo,st1;fie22inghou16;l1rner br3D;-m11gree31l street journ25m11;an halNeriz3Wisa,o1;dafo2Gl1;kswagLvo;bs,kip,n2ps,s1;a tod2Rps;es35i1;lev2Xted natio2Uv; mobi2Kaco bePd bMeAgi frida9h3im horto2Tmz,o1witt2W;shiba,y1;ota,s r Y;e 1in lizzy;b3carpen33daily ma2Xguess w2holli0rolling st1Ms1w2;mashing pumpki2Ouprem0;ho;ea1lack eyed pe3Fyrds;ch bo1tl0;ys;l2s1;co,la m12;efoni07us;a6e4ieme2Gnp,o2pice gir5ta1ubaru;rbucks,to2N;ny,undgard1;en;a2Rx pisto1;ls;few25insbu26msu1X;.e.m.,adiohead,b6e3oyal 1yan2X;b1dutch she4;ank;/max,aders dige1Ed 1vl32;bu1c1Uhot chili peppe2Klobst28;ll;c,s;ant2Vizno2F;an5bs,e3fiz24hilip morrBi2r1;emier27octer & gamb1Rudenti14;nk floyd,zza hut;psi28tro1uge08;br2Qchina,n2Q; 2ason1Xda2G;ld navy,pec,range juli2xf1;am;us;a9b8e5fl,h4i3o1sa,wa;kia,tre dame,vart1;is;ke,ntendo,ss0K;l,s;c,st1Etflix,w1; 1sweek;kids on the block,york08;a,c;nd1Us2t1;ional aca2Fo,we0Q;a,cYd0O;aAcdonald9e5i3lb,o1tv,yspace;b1Nnsanto,ody blu0t1;ley crue,or0O;crosoft,t1;as,subisO;dica3rcedes2talli1;ca;!-benz;id,re;'s,s;c's milk,tt13z1Y;'ore09a3e1g,ittle caesa1Ktd;novo,x1;is,mark; pres5-z-boy,bour party;atv,fc,kk,m1od1K;art;iffy lu0Lo3pmorgan1sa;! cha1;se;hnson & johns1Sy d1R;bm,hop,n1tv;c,g,te1;l,rpol; & m,asbro,ewlett-packaTi3o1sbc,yundai;me dep1n1J;ot;tac1zbollah;hi;eneral 6hq,l5mb,o2reen d0Iu1;cci,ns n ros0;ldman sachs,o1;dye1g0B;ar;axo smith kliZencore;electr0Im1;oto0V;a3bi,da,edex,i1leetwood mac,oGrito-l0A;at,nancial1restoV; tim0;cebook,nnie mae;b06sa,u3xxon1; m1m1;ob0H;!rosceptics;aiml0Ae5isney,o3u1;nkin donuts,po0Wran dur1;an;j,w j1;on0;a,f leppa3ll,p2r spiegZstiny's chi1;ld;eche mode,t;rd;aEbc,hBi9nn,o3r1;aigsli5eedence clearwater reviv1ossra05;al;!ca c5l4m1o0Ast05;ca2p1;aq;st;dplMgate;ola;a,sco1tigroup;! systems;ev2i1;ck fil-a,na daily;r0Hy;dbury,pital o1rl's jr;ne;aGbc,eCfAl6mw,ni,o2p,r1;exiteeWos;ei3mbardiJston 1;glo1pizza;be;ng;ack & deckFo2ue c1;roX;ckbuster video,omingda1;le; g1g1;oodriN;cht3e ge0n & jer2rkshire hathaw1;ay;ryH;el;nana republ3s1xt5y5;f,kin robbi1;ns;ic;bXcSdidRerosmith,ig,lLmFnheuser-busEol,ppleAr7s3t&t,v2y1;er;is,on;hland2s1;n,ociated F; o1;il;by4g2m1;co;os; compu2bee1;'s;te1;rs;ch;c,d,erican3t1;!r1;ak; ex1;pre1;ss; 4catel2t1;air;!-luce1;nt;jazeera,qae1;da;as;/dc,a3er,t1;ivisi1;on;demy of scienc0;es;ba,c",Demonym:"true¦0:16;1:13;a0Wb0Nc0Cd0Ae09f07g04h02iYjVkTlPmLnIomHpDqatari,rBs7t5u4v3wel0Rz2;am0Fimbabwe0;enezuel0ietnam0H;g9krai1;aiwThai,rinida0Iu2;ni0Qrkmen;a4cot0Ke3ingapoOlovak,oma0Tpa05udRw2y0X;edi0Kiss;negal0Br08;mo0uU;o6us0Lw2;and0;a3eru0Hhilipp0Po2;li0Ertugu06;kist3lesti1na2raguay0;ma1;ani;amiZi2orweP;caragu0geri2;an,en;a3ex0Mo2;ngo0Erocc0;cedo1la2;gasy,y08;a4eb9i2;b2thua1;e0Dy0;o,t02;azakh,eny0o2uwaiti;re0;a2orda1;ma0Bp2;anN;celandic,nd4r2sraeli,ta02vo06;a2iT;ni0qi;i0oneV;aiDin2ondur0unN;di;amDe2hanai0reek,uatemal0;or2rm0;gi0;i2ren7;lipino,n4;cuadoVgyp6ngliJsto1thiopi0urope0;a2ominXut4;niH;a9h6o4roa3ub0ze2;ch;ti0;lom2ngol5;bi0;a6i2;le0n2;ese;lifor1m2na3;bo2eroo1;di0;angladeshi,el8o6r3ul2;gaG;aziBi2;ti2;sh;li2s1;vi0;aru2gi0;si0;fAl7merBngol0r5si0us2;sie,tr2;a2i0;li0;gent2me1;ine;ba1ge2;ri0;ni0;gh0r2;ic0;an",Possessive:"true¦anyAh5its,m3noCo1sometBthe0yo1;ir1mselves;ur0;!s;i8y0;!se4;er1i0;mse2s;!s0;!e0;lf;o1t0;hing;ne",Currency:"true¦$,aud,bScQdLeurKfJgbp,hkd,iIjpy,kGlEp8r7s3usd,x2y1z0¢,£,¥,ден,лв,руб,฿,₡,₨,€,₭,﷼;lotySł;en,uanR;af,of;h0t5;e0il5;k0q0;elM;iel,oubleLp,upeeL;e2ound st0;er0;lingI;n0soH;ceGn0;ies,y;e0i8;i,mpi7;n,r0wanzaCyatC;!onaBw;ls,nr;ori7ranc9;!o8;en3i2kk,o0;b0ll2;ra5;me4n0rham4;ar3;ad,e0ny;nt1;aht,itcoin0;!s",City:"true¦0:73;1:61;2:6G;3:5U;4:5R;a68b54c4Id4Ae46f3Yg3Jh38i2Zj2Uk2Dl22m1Kn19o16p0Uq0Sr0Ls01tPuOvLwDxiBy9z5;a7h5i4Muri4O;a5e5ongsh0;ng3J;greb,nzib5G;ang2e5okoha3Uunfu;katerin3Jrev0;a5n0O;m5Hn;arsBeAi6roclBu5;h0xi,zh5P;c7n5;d5nipeg,terth4;hoek,s1K;hi5Zkl3C;l63xford;aw;a6ern2i5ladivost5Molgogr6K;en3lni6R;lenc6Dncouv2Yr3ughn;lan bat1Drumqi,trecht;aDbilisi,eCheBi9o8r7u5;l21n63r5;in,ku;ipoli,ondh62;kyo,m34ron1QulouS;an5jua3l2Zmisoa6Era3;j4Xshui; hag65ssaloni2L;gucigal28hr0l av1W;briz,i6llinn,mpe5Ang5rtu,shk2X;i2Msh0;an,chu1n0p2Iyu0;aEeDh8kopje,owe1It7u5ydney;ra5zh51;ba0Jt;aten is59ockholm,rasbou6Auttga31;an8e6i5;jiazhua1llo1m60y0;f54n5;ya1zh4L;gh3Ot4U;att4Ao1Yv49;cramen18int DlBn5o paulo,ppo3Wrajevo; 7aa,t5;a 5ia3Io domin3I;a3fe,m1O;antonCdie3Gfrancisco,j5ped3Ssalv8;o5u0;se;em,v5z2B;ad0I;lou59peters29;aAe9i7o5;me,sar5t5A;io;ga,o5yadh;! de janei3I;cife,ykjavik;b4Uip4lei2Mnc2Swalpindi;ingdao,u5;ez2i0Q;aEeDhCiBo8r7u6yong5;ya1;eb5Aya1;ag54etor53;rt5zn0; 5la4Fo;au prin0Nelizabe29sa05;ls3Srae5Ctts2B;iladelph4Ynom pe1Doenix;r26tah tik3I;ler00naji,r4Pt5;na,r36;ak47des0Lm1Rr6s5ttawa;a3Ylo;an,d07;a8ew6i5ovosibir1Oyc;ng2Hs; 5cast39;del27orlea46taip16york;g8iro4Xn5pl2Zshv36v0;ch6ji1t5;es,o1;a1o1;a6o5p4;ya;no,sa0Y;aFeCi9o6u5;mb2Cni28sc40;gadishu,nt6s5;c17ul;evideo,re31;ami,l6n18s5;kolc,sissauga;an,waukee;cca,d5lbour2Pmph41;an,ell5i3;in,ín;cau,drAkass2Tl9n8r5shh4A;aca6ib5rakesh,se2N;or;i1Ty;a4EchEdal12i47;mo;id;aCeiAi8o6u5vRy2;anLckn0Rdhia3;n5s angel28;d2g bea1O;brev2De3Kma5nz,sb2verpo2A;!ss29;c5pzig;est0C; p6g5ho2Yn0Gusan27;os;az,la35;aHharFiClaipeBo9rak0Hu7y5;iv,o5;to;ala lump4n5;mi1sh0;be,hi0Llka2Zpavog4si5wlo2;ce;da;ev,n5rkuk;gSsha5;sa;k5toum;iv;bIdu3llakuric0Tmpa3Gn6ohsiu1ra5un1Lwaguc0T;c0Sj;d5o,p4;ah1Vy;a7e6i5ohannesZ;l1Xn0;dd37rusalem;ip4k5;ar2J;bad0mph1QnBrkutYs8ta01z5̇zm7;m6tapala5;pa;ir;fah0l6tanb5;ul;am2Zi2I;che2d5;ianap2Lo21;aBe8o5yder2W; chi mi6ms,nolulu,u5;st2;nh;f6lsin5rakli2;ki;ei;ifa,lifax,m7n5rb1Dva3;gAnov5oi;er;bu2Wilt2;aFdanEenDhCiPlasgBo9raz,u5;a5jr21;dal6ng5yaquil;zh1H;aja2Lupe;ld coa18then5;bu2P;ow;ent;e0Toa;sk;lw7n5za;dhi5gt1C;nag0S;ay;aisal26es,o8r6ukuya5;ma;ankfu5esno;rt;rt5sh0; wor6ale5;za;th;d5indhov0Nl paso;in5mont2;bur5;gh;aAe8ha0Visp4o7resd0Ju5;b5esseldorf,rb0shanbe;ai,l0G;ha,nggu0rtmu11;hradRl5troit;hi;donghHe5k08li0masc1Xr es sala1HugavpiY;gu,je2;aKebu,hAo5raio03uriti1P;lo7n6penhag0Ar5;do1Nk;akLst0V;gVm5;bo;aBen8i6ongqi1ristchur5;ch;ang m7ca5ttago1;go;g6n5;ai;du,zho1;n5ttogr12;digarh,g5;ch8sha,zh06;i9lga8mayenJn6pe town,r5;acCdiff;ber18c5;un;ry;ro;aUeMhJirmingh0ToIr9u5;chareRdapeRenos air7r5s0tu0;g5sa;as;es;a9is6usse5;ls;ba6t5;ol;ne;sil0Mtisla7zzav5;il5;le;va;goZst2;op6ubaneshw5;ar;al;iBl9ng8r5;g6l5n;in;en;aluru,hazi;fa5grade,o horizonte;st;ji1rut;ghd0BkGnAot9r7s6yan n4;ur;el,r07;celo3ranquil09;na;ou;du1g6ja lu5;ka;alo6k5;ok;re;ng;ers5u;field;a04b01cc00ddis abaZgartaYhmedWizawl,lQmNnHqaZrEsBt7uck5;la5;nd;he7l5;an5;ta;ns;h5unci2;dod,gab5;at;li5;ngt2;on;a6chora5kaNtwerp;ge;h7p5;ol5;is;eim;aravati,m0s5;terd5;am; 8buquerq7e5giers,maty;ppo,xandr5;ia;ue;basrah al qadim5mawsil al jadid5;ah;ab5;ad;la;ba;ra;idj0u dha5;bi;an;lbo6rh5;us;rg",Country:"true¦0:39;1:2M;a2Xb2Ec22d1Ye1Sf1Mg1Ch1Ai14j12k0Zl0Um0Gn05om3DpZqat1KrXsKtCu6v4wal3yemTz2;a25imbabwe;es,lis and futu2Y;a2enezue32ietnam;nuatu,tican city;.5gTkraiZnited 3ruXs2zbeE;a,sr;arab emirat0Kkingdom,states2;! of am2Y;k.,s.2; 28a.;a7haBimor-les0Bo6rinidad4u2;nis0rk2valu;ey,me2Ys and caic1U; and 2-2;toba1K;go,kel0Znga;iw2Wji2nz2S;ki2U;aCcotl1eBi8lov7o5pa2Cri lanka,u4w2yr0;az2ed9itzerl1;il1;d2Rriname;lomon1Wmal0uth 2;afr2JkLsud2P;ak0en0;erra leoEn2;gapo1Xt maart2;en;negKrb0ychellY;int 2moa,n marino,udi arab0;hele25luc0mart20;epublic of ir0Dom2Duss0w2;an26;a3eHhilippinTitcairn1Lo2uerto riM;l1rtugE;ki2Cl3nama,pua new0Ura2;gu6;au,esti2;ne;aAe8i6or2;folk1Hth3w2;ay; k2ern mariana1C;or0N;caragua,ger2ue;!ia;p2ther19w zeal1;al;mib0u2;ru;a6exi5icro0Ao2yanm05;ldova,n2roc4zamb9;a3gol0t2;enegro,serrat;co;c9dagasc00l6r4urit3yot2;te;an0i15;shall0Wtin2;ique;a3div2i,ta;es;wi,ys0;ao,ed01;a5e4i2uxembourg;b2echtenste11thu1F;er0ya;ban0Hsotho;os,tv0;azakh1Ee3iriba03o2uwait,yrgyz1E;rWsovo;eling0Jnya;a2erF;ma15p1B;c6nd5r3s2taly,vory coast;le of m19rael;a2el1;n,q;ia,oI;el1;aiSon2ungary;dur0Mg kong;aAermany,ha0Pibralt9re7u2;a5ern4inea2ya0O;!-biss2;au;sey;deloupe,m,tema0P;e2na0M;ce,nl1;ar;bTmb0;a6i5r2;ance,ench 2;guia0Dpoly2;nes0;ji,nl1;lklandTroeT;ast tim6cu5gypt,l salv5ngl1quatorial3ritr4st2thiop0;on0; guin2;ea;ad2;or;enmark,jibou4ominica3r con2;go;!n B;ti;aAentral african 9h7o4roat0u3yprQzech2; 8ia;ba,racao;c3lo2morPngo-brazzaville,okFsta r03te d'ivoiK;mb0;osD;i2ristmasF;le,na;republic;m2naTpe verde,yman9;bod0ero2;on;aFeChut00o8r4u2;lgar0r2;kina faso,ma,undi;azil,itish 2unei;virgin2; is2;lands;liv0nai4snia and herzegoviGtswaGuvet2; isl1;and;re;l2n7rmuF;ar2gium,ize;us;h3ngladesh,rbad2;os;am3ra2;in;as;fghaFlCmAn5r3ustr2zerbaijH;al0ia;genti2men0uba;na;dorra,g4t2;arct6igua and barbu2;da;o2uil2;la;er2;ica;b2ger0;an0;ia;ni2;st2;an",Region:"true¦0:2M;1:2S;2:2J;a2Pb2Cc1Yd1Tes1Sf1Qg1Kh1Gi1Bj17k12l0Zm0On07o05pZqWrTsKtFuCv9w5y3zacatec2T;akut0o0Du3;cat2k07;a4est 3isconsin,yomi1L;bengal,vi6;rwick2Ashington3;! dc;er4i3;rgin0;acruz,mont;dmurt0t3;ah,tar3; 2Ka0W;a5e4laxca1Qripu1Wu3;scaDva;langa1nnessee,x2E;bas0Um3smNtar24;aulip2Cil nadu;a8i6o4taf10u3ylh1E;ffYrr03s19;me1Bno1Puth 3;cVdU;ber0c3kkim,naloa;hu2ily;n4skatchew2xo3;ny; luis potosi,ta catari1;a3hode9;j3ngp06;asth2shahi;ingh24u3;e3intana roo;bec,en5reta0Q;ara7e5rince edward3unjab; i3;sl0A;i,nnsylv3rnambu0A;an0;!na;axa0Xdisha,h3klaho1Zntar3reg6ss0Ax0F;io;aIeDo5u3;evo le3nav0V;on;r3tt16va scot0;f8mandy,th3; 3ampton15;c5d4yo3;rk13;ako1M;aroli1;olk;bras1Lva0Bw3; 4foundland3;! and labrador;brunswick,hamp0Wjers3mexiRyork state;ey;galOyarit;a9eghala0Mi5o3;nta1r3;dov0elos;ch5dlanCn4ss3zor11;issippi,ouri;as geraOneso18;ig2oac2;dhy12harasht0Gine,ni4r3ssachusetts;anhao,i el,ylF;p3toba;ur;anca0Ie3incoln0IouisH;e3iR;ds;a5e4h3omi;aka06ul1;ntucky,ra01;bardino,lmyk0ns0Qr3;achay,el0nata0X;alis5har3iangxi;kh3;and;co;daho,llino6n3owa;d4gush3;et0;ia1;is;a5ert4i3un2;dalFm0D;fordZ;mpYrya1waii;ansu,eorg0lou7oa,u3;an4erre3izhou,jarat;ro;ajuato,gdo3;ng;cesterS;lori3uji2;da;sex;ageTe6o4uran3;go;rs3;et;lawaLrbyK;aEeaDh8o3rimea ,umbr0;ahui6l5nnectic4rsi3ventry;ca;ut;i02orado;la;e4hattisgarh,i3uvash0;apQhuahua;chn4rke3;ss0;ya;ra;lFm3;bridge6peche;a8ihar,r7u3;ck3ryat0;ingham3;shi3;re;emen,itish columb0;h0ja cal7lk6s3v6;hkorto3que;st2;an;ar0;iforn0;ia;dygea,guascalientes,lAndhr8r4ss3;am;izo1kans4un3;achal 6;as;na;a 3;pradesh;a5ber4t3;ai;ta;ba4s3;ka;ma",Place:"true¦a0Eb0Bc04d03e02f00gVhUiRjfk,kOlMmJneGoFpBque,rd,s9t6u5v4w1y0;akutOyz;ake isFis1y0;!o;!c;a,ostok,t;laanbaatar,p02safa,t;ahiti,e1he 0;bronx,hamptons;nn,x;a0fo,oho,t,under7yd;khalNsk;a2e1h0itcairn;l,x;k,nnN;!cif04;kla,nt,rd;b1w eng0;land;!r;a1co,i0t,uc;dNnn;gadZlibu,nhattZ;a0gw,hr;s,x;an1osrae,rasnoyar0ul;sk;!s;a1cn,da,nd0st;ianRochina;!x;arlem,kg,nd,oHwy;a3re0;at 0enwich;brita0lakH;in;!y village;co,l0ra;!a;urope,vergladC;ak,en,fw,ist,own4xb;al5dg,gk,h2l1o0rA;lo,nn;!t;a1ina0uuk;town;morro,tham;!if;cn,e1kk,l0rooklyn;vd;l air,verly hills;frica,lta,m7n3r2sia,tl1ve,zor0;es;!ant2;ct1iz;adyr,tarct0;ic0; oce0;an;ericas,s",MaleName:"true¦0:E4;1:D5;2:DN;3:AX;4:D1;5:CF;6:B5;7:CV;8:C7;9:DJ;A:DK;B:A5;C:C1;aCNbBKcAId9Ge8Mf84g7Hh6Ti6Dj5Dk51l4Cm34n2So2Mp2Equ2Cr1Ls11t0Eu0Dv07wTxSyIzD;aDor0;cDh9Skaria,n5V;hEkD;!aCL;ar5VeCK;aLoFuD;sDu2JvBX;if,uf;nFsEusD;ouf,sD;ef;aDg;s,tD;an,h0;hli,nBLssX;avi3ho4;aMeKiFoDyaC1;jcie8Blfgang,odrow,utD;!er;lDnst1;bFey,frD0lD;aBCiD;am,e,s;e9Eur;i,nde6sD;!l8t1;de,lErrAyD;l1ne;lDt3;aA9y;aGiDladimir,ojte7Y;cEha0kt68nceDrgAIva0;!nt;e3Ut66;lentDnA4;in4X;ghBUlyss5Bnax,sm0;aXeShOiMoHrFuEyD;!l3ro7s1;n9r5B;avAVeDist0oy,um0;ntANv5Yy;bGdFmDny;!as,mDoharu;aCSie,y;!d;iBy;mDt5;!my,othy;adFeoEia8FomD;!as;!do8O;!de5;dGrD;en9KrD;an9JeDy;ll,n9I;!dy;dgh,ha,iDnn3req,tsu4S;cB4ka;aTcotRePhLiJoHpenc3tDur1Uylve9Jzym1;anFeDua8C;f0phBSvDwa8B;e61ie;!islaw,l8;lom1nBEuD;leyma7ta;dDlBm1yabonga;!dhart7An8;aFeD;lDrm0;d1t1;h7Tne,qu0Zun,wn,y7;aDbasti0k29l4Qrg4Nth,ymoAT;m5n;!tD;!ie,y;lEmDnti2Dq5Aul;!ke5LmCu4;ik,vato7W;aXeTheA9iPoHuEyD;an,ou;b7MdEf5pe7RssD;!elBY;ol3Ey;an,bJc66dIel,geHh0landBPmGnFry,sEyD;!ce;coe,s;!aAGnC;an,eo;l46r;e5Ng3n8olfo,ri79;bCeB7;cDl8;ar6Pc6OhEkDo;!ey,ie,y;a99ie;gEid,ubAx,yDza;an1InY;gA8iD;naA4s;ch70fa4lHmGndFpha4sEul,wi2HyD;an,mo82;h7Vm5;alBDol2Uy;iATon;f,ph;ent2inD;cy,t1;aIeGhilFier72ol,rD;aka16eD;m,st1;!ip,lip;dALrcy,tD;ar,e3Gr1X;b4Kdra7Ft4ZulD;!o17;ctav3Fi3liv3mAFndrej,rHsEtDum9wA;is,to;aEc9k9m0vD;al5Z;ma;i,l53vL;aLeJiFoDu3A;aDel,j5l0ma0r3K;h,m;cEg4i49kD;!au,h7Uola;holBkDolB;!olB;al,d,il,ls1vD;il8Y;hom,thD;anDy;!a4i4;aZeWiMoHuEyD;l2Jr1;hamEr6XstaD;fa,p5C;ed,mH;di0We,hamFis2FntEsDussa;es,he;e,y;ad,ed,mD;ad,ed;cIgu4hai,kGlFnEtchD;!e6;a8Aik;house,o0Bt1;ae5YeA4olD;aj;ah,hDk8;aEeD;al,l;el,l;hElv2rD;le,ri6v2;di,met;ay0ck,hTjd,ks2DlRmadWnQrKs1tFuricExD;!imilian9Nwe6;e,io;eGhEiBtDus,yB;!eo,hew,ia;eDis;us,w;j,o;cHio,kGlFqu7Dsha6tDv2;iDy;!m,n;in,on;!el,oPus;!el9IoOus;iGu4;achDcolm,ik;ai,y;amEdi,eDmoud;sh;adDm5T;ou;aXeQiOlo3EoKuEyD;le,nd1;cGiFkDth3uk;aDe;!s;gi,s,z;as,iaD;no;g0nn7SrenFuDv8Jwe6;!iD;e,s;!zo;am,oD;n4r;a8Cevi,la5JnIoGst3thaFvD;eDi;nte;bo;!nD;!a6Sel;!ny;mFnErDur5Hwr5H;ry,s;ce,d1;ar,o5A;aLeGhaled,iDrist5Iu4Vy6X;er0p,rD;by,k,ollD;os;en0iGnDrmit,v44;!dEnDt5Z;e1Ay;a6ri59;r,th;cp3j5m66na73rEsp9them,uD;ri;im,l;a02eUiSoGuD;an,lDst2;en,iD;an,en,o,us;aNeLhnKkubBnIrGsD;eEhDi8Bue;!ua;!ph;dDge;an,i,on;!aDny;h,s,th5I;!ath5Hie,nC;!l,sDy;ph;o,qu2;an,mD;!mC;d,ffIrFsD;sDus;!e;a6BemEmai7oDry;me,ni0Y;i7Ty;!e60rD;ey,y;cKdAkImHrFsEvi3yD;!dAs1;on,p3;ed,od,rDv56;e5Nod;al,es4Xis1;a,e,oDub;b,v;k,ob,quD;es;aWbQchiPgNkeMlija,nuLonut,rJsFtDv0;ai,suD;ki;aEha0i7DmaDsac;el,il;ac,iaD;h,s;a,vinDw2;!g;k,nngu5S;!r;nacDor;io;ka;ai,rahD;im;aPeJoIuDyd9;be2KgGmber4WsD;eyEsD;a2e2;in,n;h,o;m3ra3Gsse2wa4B;aHctGitGnrErD;be2Dm0;iDy;!q11;or;th;bMlLmza,nKo,rFsEyD;a4JdA;an,s0;lGo50rFuDv8;hi4Gki,tD;a,o;is1y;an,ey;k,s;!im;ib;aVeRiPlenOoLrHuD;ilEsD;!tavo;herme,lerD;mo;aFegDov3;!g,orD;io,y;dy,h5Wnt;nzaErD;an,d1;lo;!n;lbe5Ano,oD;rg3Hvan5A;ne,oFrD;aDry;ld,rd5H;ffr8rge;brElArDv2;la28r3Sth,y;e3EielD;!i5;aTePiNlLorr0NrD;anFedDitz;!dCeDri2B;ri2A;cFkD;!ie,lD;in,yn;esLisD;!co,z36;etch3oD;yd;d4lDnn,onn;ip;deriFliEng,rnD;an06;pe,x;co;bi0di,hd;ar04dZfrYit0lSmKnHo2rFsteb0th0uge7vDymAzra;an,eD;ns,re36;gi,i0DnDrol,v2w2;est4Pie;oEriqDzo;ue;ch;aJerIiEmD;aIe2Z;lErD;!h0;!iD;o,s;s1y;nu4;be0Cd1iGliFmEt1viDwood;n,s;er,o;ot1Ys;!as,j4NsD;ha;a2en;!dCg9mGoEuEwD;a2Din;arD;do;o0Wu0W;l,nD;est;a01eRiOoHrGuFwEylD;an,l0;ay7ight;a7dl8nc0st2;ag0ew;minGnEri0ugDvydBy2D;!lB;!a2MnDov0;e6ie,y;go,iDykB;cDk;!k;armuEeDll1on,rk;go;id;anKj0lbeJmetri5nHon,rGsFvEwDxt3;ay7ey;en,in;hawn,mo0B;ek,ri0I;is,nDv3;is,y;rt;!dD;re;an,lNmLnKrGvD;e,iD;! lucDd;as,ca;en,iFne6rDyl;eDin,yl;l3Bn;n,o,us;!e,i4ny;iDon;an,en,on;e,lB;as;a09e07hYiar0lNoIrGuEyrD;il,us;rtD;!is;aDistob0U;ig;dy,lGnErD;ey,neli5y;or,rD;ad;by,e,in,l2t1;aIeFiDyK;fDnt;fo0Ft1;meEt5velaD;nd;nt;rFuEyD;!t1;de;enD;ce;aIeGrisEuD;ck;!tD;i0oph3;st3;er;d,rDs;b4leD;s,y;cDdric,s9;il;lGmer1rD;ey,lEro6y;ll;!os,t1;eb,v2;a07eZiVlaUoRrEuDyr1;ddy,rtK;aLeGiFuEyD;an,ce,on;ce,no;an,ce;nEtD;!t;dEtD;!on;an,on;dEndD;en,on;!foDl8y;rd;bErDyd;is;!by;i7ke;bFlEshD;al;al,lC;ek;nHrDshoi;at,nEtD;!r1C;aDie;rd14;!edict,iEjam2nC;ie,y;to;kaMlazs,nHrD;n8rDt;eDy;tt;ey;dDeE;ar,iD;le;ar17b0Vd0Rf0Pgust2hm0Mi0Jja0Il04m00nSputsiRrIsaHuFveEyDziz;a0kh0;ry;gust5st2;us;hi;aKchJiIjun,maHnFon,tDy0;hDu09;ur;av,oD;ld;an,nd0H;!el,ki;ie;ta;aq;as,dIgel0CtD;hoGoD;i7nD;!i09y;ne;ny;er,reDy;!as,i,s,w;iFmaDos;nu4r;el;ne,r,t;an,bePdAeJfHi,lGonFphXt1vD;aNin;on;so,zo;an,en;onTrD;edU;c,jaGksandFssaGxD;!andD;er,ru;ar,er;ndD;ro;rtN;ni;dAm9;ar;en;ad,eD;d,t;in;onD;so;aEi,olfDri0vik;!o;mDn;!a;dHeGraEuD;!bakr,lfazl;hDm;am;!l;allIelFoulaye,ulD;!lDrF;ah,o;! rD;ahm0;an;ah;av,on",LastName:"true¦0:9F;1:9V;2:9H;3:9X;4:9N;5:8J;6:9K;7:A0;8:9E;9:88;A:6E;B:77;C:6J;a9Ub8Lc7Kd6Xe6Rf6Dg5Vh58i54j4Pk45l3Nm2Rn2Eo26p1Nquispe,r17s0Ft05vVwOxNyGzD;aytsADhD;aDou,u;ng,o;aGeun7ZiDoshiA9un;!lD;diDmaz;rim,z;maDng;da,guc97mo6UsDzaB;aBhiA7;iao,u;aHeGiEoDright,u;jc8Sng;lDmm0nkl0sniewsB;liA1s3;b0iss,lt0;a5Rgn0lDng,tanabe;k0sh;aHeGiEoDukA;lk5roby5;dAllalDnogr2Zr0Zss0val37;ba,obos;lasEsel7N;lGn dFrg8EsEzD;qu7;ily9Oqu7silj9O;en b35ijk,yk;enzue95verde;aLeix1JhHi4j6ka3IoGrFsui,uD;om4ZrD;c4n0un1;an,embl8TynisB;dor95lst31m2rr9th;at5Mi7LoD;mErD;are6Ylaci64;ps3s0Y;hirAkah8Dnaka;a00chWeThPiNmKoItFuEvDzabo;en8Aobod34;ar7bot2lliv4zuB;aEein0oD;i67j3Lyan8V;l6rm0;kol5lovy5re6Psa,to,uD;ng,sa;iDy5Z;rn5tD;!h;l5YmDngh,rbu;mo6Do6J;aFeDimizu;hu,vchD;en7Cuk;la,r17;gu8mDoh,pulve8Trra4R;jDyD;on5;evi6Filtz,miDneid0roed0ulz,warz;dEtD;!z;!t;ar42h6ito,lFnDr2saBto,v2;ch7d0AtDz;a4Pe,os;as,ihAm3Zo0Q;aOeNiKoGuEyD;a66oo,u;bio,iz,sD;so,u;bEc7Bdrigue57g03j73mDosevelt,ssi,ta7Nux,w3Z;a4Be0O;ertsDins3;!on;bei0LcEes,vDzzo;as,e8;ci,hards3;ag4es,it0ut0y9;dFmEnDsmu7Zv5F;tan1;ir7os;ic,u;aSeLhJiGoErDut6;asad,if5Zochazk1W;lishc24pDrti62u55we66;e2Tov48;cEe09nD;as,to;as60hl0;aDillips;k,m,n5K;de3AetIna,rGtD;ersErovDtersC;!a,ic;en,on;eDic,ry,ss3;i8ra,tz,z;ers;h71k,rk0tEvD;ic,l3T;el,t2O;bJconnor,g2ClGnei5PrEzD;demir,turk;ella3MtDwe5N;ega,iz;iDof6GsC;vDyn1F;ei8;aPri1;aLeJguy1iFoDune44ym4;rodahl,vDwak;ak3Uik5otn56;eEkolDlsCx3;ic,ov6X;ls1miD;!n1;ils3mD;co42ec;gy,kaEray4varD;ro;jiDmu8shiD;ma;aXcVeQiPoIuD;lGnFrDssoli5T;atDpUr68;i,ov2;oz,te4B;d0l0;h4lIo0HrEsDza0Z;er,s;aFeEiDoz5r3Ete4B;!n6F;au,i8no,t4M;!l9;i2Rl0;crac5Ohhail5kke3Qll0;hmeGij0j2ElFndErci0ssiDyer19;!er;e3Bo2Z;n0Io;dAti;cartDlaughl6;hy;dMe6Dgnu5Ei0jer34kLmJnci59rFtEyD;er,r;ei,ic,su1N;iEkAqu9roqu6tinD;ez,s;a54c,nD;!o;a52mD;ad5;e5Oin1;rig4Ns1;aSeMiIoGuEyD;!nch;k2nDo;d,gu;mbarDpe2Rvr2;di;!nDu,yana1R;coln,dD;bDholm;erg;bed5TfeGhtFitn0kaEn6rDw2G;oy;!j;in1on1;bvDvD;re;iDmmy,rsCu,voie;ne,t11;aTennedy,h4iSlQnez46oJrGuEvar4woD;k,n;cerDmar58znets5;a,o2G;aDem0i2Zyeziu;sni3PvD;ch3U;bay4Frh0Jsk0TvaFwalDzl5;czDsB;yk;cFlD;!cDen3Q;huk;!ev2ic,s;e6uiveD;rt;eff0l2mu8nnun1;hn,lloe,minsBrEstra31to,ur,yDzl5;a,s0;j0GlsC;aMenLha2Pim0QoEuD;ng,r2;e2JhFnErge2Ju2NvD;anA;es,ss3;anEnsD;en,on,t3;nesDsC;en,s1;ki26s1;cGkob3RnsDrv06;en,sD;enDon;!s;ks3obs1;brahimAglesi3Ake4Ll0CnoZoneFshikEto,vanoD;u,v4A;awa;scu;aPeIitchcock,jaltal6oFrist46uD;!aDb0gh9ynh;m4ng;a23dz2fEjga2Sk,rDx3B;ak0Yvat;er,fm3B;iGmingw3NnErD;nand7re8;dDriks1;ers3;kkiEnD;on1;la,n1;dz2g1lvoLmJnsCqIrr0SsFuEyD;as36es;g1ng;anEhiD;mo0Q;i,ov08;ue;alaD;in1;rs1;aMeorgLheorghe,iJjonIoGrEuDw3;o,staf2Utierr7zm4;ayDg2iffitUub0;li1G;lub3Rme0JnD;calv9zale0I;aj,i;l,mDordaL;en7;iev3B;gnJlGmaFnd2No,rDs2Nuthi0;cDza;ia;ge;eaElD;agh0i,o;no;e,on;ab0erMiIjeldsted,lor9oGrFuD;cDent9ji3F;hs;an1Wiedm4;ntaDrt6st0urni0;na;lipEsD;ch0;ovD;!ic;hatAnandeVrD;arDei8;a,i;ov2;dHinste6riksCsDva0D;cob2ZpDtra2X;inoDosiM;za;en,s3;er,is3wards;aUeMiKjurhuJoHrisco0YuEvorakD;!oQ;arte,boEmitru,rDt2U;and,ic;is;g4he0Hmingu7n2Ord19tD;to;us;aDmitr29ssanayake;s,z; GbnaFlEmirDrvis1Lvi,w4;!ov2;gado,ic;th;bo0groot,jo03lEsilDvri9;va;a cruz,e3uD;ca;hl,mcevsBnErw6t2EviD;d5es,s;ieDku1S;ls1;ki;a05e00hNiobMlarkLoFrD;ivDuz;elli;h1lGntFop0rDs26x;byn,reD;a,ia;i,rer0O;em4liD;ns;!e;anu;aLeIiu,oGriDuJwe;stD;eDiaD;ns1;i,ng,uFwDy;!dhury;!n,onEuD;ng;!g;kEnDtterjee,v7;!d,g;ma,raboD;rty;bGl09ng2rD;eghetEnD;a,y;ti;an,ota0M;cer9lder3mpbeIrFstDvadi08;iDro;llo;doEt0uDvalho;so;so,zo;ll;es;a09eXhUiSlNoGrFyD;rne,tyD;qi;ank5iem,ooks,yant;gdan5nFruya,su,uchEyHziD;c,n5;ard;darDik;enD;ko;ov;aEondD;al;nEzD;ev2;co;ancRshwD;as;a01oDuiy4;umDwmD;ik;ckNethov1gu,ktLnJrD;gGisFnD;ascoDds1;ni;ha;er,mD;ann;gtDit7nett;ss3;asD;hi;er,ham;b2ch,ez,hMiley,kk0nHrDu0;bEnDua;es,i0;ieDosa;ri;dDik;a8yopadhyD;ay;ra;er;k,ng;ic;cosZdYguilXkhtXlSnJrGsl4yD;aEd6;in;la;aEsl4;an;ujo,ya;dFgelD;ovD;!a;ersGov,reD;aDjL;ss1;en;en,on,s3;on;eksejGiyGmeiFvD;ar7es;ez;da;ev;ar;ams;ta",WeekDay:"true¦fri2mon2s1t0wednesd3;hurs1ues1;aturd1und1;!d0;ay0;!s",Month:"true¦aBdec9feb7j2mar,nov9oct1sep0;!t8;!o8;an3u0;l1n0;!e;!y;!u1;!ru0;ary;!em0;ber;pr1ug0;!ust;!il",Date:"true¦ago,t2week0yesterd4; e0e0;nd;mr2o0;d0morrow;ay;!w",FirstName:"true¦aKblair,cGdevFgabrieEhinaDjBk8l7m3nelly,quinn,re2sh0;ay,e0iloh;a,lby;g6ne;a1el0ina,org5;!okuh9;naia,r0;ion,lo;ashawn,uca;asCe1ir0rE;an;lsAnyat2rry;am0ess6ie,ude;ie,m5;ta;le;an,on;as2h0;arl0eyenne;ie;ey,sidy;lex2ndr1ubr0;ey;a,ea;is",Person:"true¦ashton kutchTbScNdLeJgastOhHinez,jFkEleDmCnettKoBp9r4s3t2v0;a0irgin maH;lentino rossi,n go3;aylor,heresa may,iger woods,yra banks;addam hussain,carlett johanssKlobodan milosevic,uC;ay romano,e3o1ush limbau0;gh;d stewart,nald0;inho,o;ese witherspoFilly;a0ipJ;lmIris hiltD;prah winfrFra;essiaen,itt romnEubarek;bron james,e;anye west,iefer sutherland,obe bryant;aime,effers8k rowli0;ng;alle ber0itlBulk hogan;ry;ff0meril lagasse,zekiel;ie;a0enzel washingt2ick wolf;lt1nte;ar1lint0;on;dinal wols1son0;! palm2;ey;arack obama,rock;er",Verb:"true¦awak9born,cannot,fr8g7h5k3le2m1s0wors9;e8h3;ake sure,sg;ngth6ss6;eep tabs,n0;own;as0e2;!t2;iv1onna;ight0;en",PhrasalVerb:"true¦0:7L;1:79;2:7X;3:7N;4:72;5:80;6:7P;7:6V;8:78;9:7J;A:6W;B:5Z;C:7S;D:7K;a81b6Lc5Rd5Me5Lf4Kg41h3Kiron0j3Gk3Bl2Vm2Jn2Ho2Fp1Wquiet7Ar1Js0CtSuQvacuum 1wHyammer9zE;eroBip FonE;e0k0;by,up;aLeHhGiForErit5G;d 1k33;mp0n2Vpe0r7s7;eel Dip 85;aFiEn2J;gh 09rd0;n Dr E;d2in,o5J;it 61k7lk6rm 6Csh 7Nt6Qv51;rge9sE;e AherB;aTeRhPiLoJrGuEype 69;ckBrn E;d2in,o3Sup;aFiEot0y 2I;ckle6Rp 7T;ck6Qde Y;ne6Pp Es4O;d2o73up;ck GdFe Egh6Bme0p o0Gre0;aw3ba4d2in,up;e 61y 1;by,o7D;ink Erow 6D;ba4ov8up;aEe 5Zll53;m 1r X;ck9ke Flk E;ov8u54;aEba4d2in,o3Cup;ba4ft8p59w3;a0Jc0Ie0Ch08i05l01m00nZoYpTquare StKuIwE;earGiE;ngFtch E;aw3ba4o77; by;ck Eit 1m 1ss0;in,up;aJe0WiIoGrEuc3G;aigh1WiE;ke 6Gn3A;p Erm1Z;by,in,o6T;n3Br 1tc3T;c3Amp0nd Er6Zve6y 1;ba4d2up;d2o6Pup;ar37eHiGlFrEur9;ing9uc7;a3Fit 5B;l13n 1;e5Sll0;be2Wrt0;ap 4Sow D;ash 5Foke0;eep FiEow A;c3Wp 1;in,oE;ff,v8;gn 4XngFt Ez7;d2o5up; al54le0;aGoEu4T;ot Eut0w 6D;aw3ba4f3Go67;c2PdeBk58ve6;e Ill1And HtE; Etl4H;d2in,o5upE;!on;aw3ba4d2in,o27up;o5Mto;al51out0rap51;il6v7;aPeMiLoHuE;b 4Ule0n Estl7;aEba4d2in5Jo3Ut39u3S;c26w3;ll Got FuE;g2Tnd6;a27f30o5;arCin,o5;ng 53p6;aEel6inBnt0;c5Dd E;o31u0I;c24t0;aSeRiPlNoLrIsyc2HuE;ll Gt E;aEba4d2in,o1Ot3Gup;p3Lw3;ap3Kd2in,o5t3Eup;attle9ess FiHoE;p 1;ah1Oon;iEp 5Hr3Yur4Jwer 5H;nt0;ay4DuE;gBmp A;ck Eg0le9n Ap4A;o2Yup;el 4KncilB;c42ir 3Un0ss GtFy E;ba4o54; d2c24;aw3ba4o18;pEw3X;e3Wt D;arrow46erd0oE;d6te45;aMeJiIoGuE;ddl7lE;l 3I;c1Dp 1uth6ve E;al3Nd2in,o5up;ss0x 1;asur7lFss E;a1Gup;t A;ke Fn ArEs1Px0;k Ary6;do,o48up;aRePiKoEuck0;aIc3Hg HoEse0;k Ese3F;aft8ba4d2forw2Jin46ov8uE;nd8p;in,o0M;d A;e HghtGnFsEv1V;ten 4M;e 1k 1; 1e37;arCd2;av1Jt 37velE; o3U;c7p 1sh Etch9ugh6y20;in3Uo5;eFick6nock E;d2o3Q;eEyB;l 2Pp E;aw3ba4d2fTin,o07to,up;aGoFuE;ic7mpB;ke31t35;c3Azz 1;aQeLiIoFuE;nker32rry 1s0W;lEneBrse2X;d Ee 1;ba4d2fast,o01up;de Ft E;ba4on,up;aw3o5;aElp0;d Gl 2Ar Et 1;fEof;rom;in,oTu1H;c02m 1nFve Ez25;it,to;d Eg 2FkerG;d2in,o5;aTeMive Kloss 22oGrFunE; f0N;in3How 2B; Eof 21;aFb1Dit,oErCt0Pu18;ff,n,v8;bo5ft8hKw3;aw3ba4d2in,oEup,w3;ff,n,ut;aJek0t E;aFb17d2oErCup;ff,n,ut,v8;cFhEl1XrCt,w3;ead;ross;r 1;d aFnE;g 1;bo5;a08e01iSlOoKrGuE;cEel 1;k 1;eFighten Eown9y 1;aw3o2S;eEshe1N; 1z7;lGol E;aEwi1G;bo5rC;d Alow 1;aFeEip0;sh0;g Ake0mErE;e 2R;gLlJnHrFsEzzle0;h 2P;e Em 1;aw3ba4up;d0isE;h 1;e El 19;aw3fJ;ht ba4ure0;eJnFsE;s 1;cGd E;fEo25;or;e D;dVl 1;cIll Erm0t0W;ap04bGd2in,oFtE;hrough;ff,ut,v8;a4ehi20;e 0L;at0dge0nd 0Ky7;oHrE;aFess Aop E;aw3bUin,o1E;g9w9; 0Dubl7;aXhUlean AoHrEut 10;ack9eep Eoss D;by,d2oEup;n,ut;me HoFuntE; o1Q;k 1l E;d2o1I;aKbJforHin,oGtFuE;nd8;ogeth8;ut,v8;th,wE;ard;a4y;pErCw3;art;eEipB;ck Der E;on,up;lKncel0rHsGtch FveB; in;o19up;h Dt6;ry FvE;e Y;aw3o15;l Em05;aEba4d2o13up;rCw3;a0Ke0Bl04oVrJuE;bblGcklWil02lk AndlWrn 08st FtEy 13zz6;t D;in,o5up;e E;ov8;anOeaMiFush E;o0Oup;ghIng E;aFba4d2forEin,o5up;th;bo5lErCw3;ong;teE;n 1;k E;d2in,o5up;ch0;arLgKil An7oHssGttlFunce Ex D;aw3ba4;e A; arC;k Dt 1;e 1;d2up; d2;d 1;aJeed0oEurt0;cGw E;aw3ba4d2o5up;ck;k E;in,oL;ck0nk0st6; oKaHef 1nd E;d2ov8up;er;up;r0t E;d2in,oEup;ff,ut;ff,nE;to;ck Kil0nGrgFsE;h D;ain9e D;g Dk9; on;in,o5; o5;aw3d2o5up;ay;cNdJsk Guction6; oE;ff;arCo5;ouE;nd;d E;d2oEup;ff,n;own;t E;o5up;ut",Modal:"true¦c5lets,m4ought3sh1w0;ill,o5;a0o4;ll,nt;! to,a;ay,ight,ust;an,o0;uld",Adjective:"true¦0:7P;1:84;2:83;3:8A;4:7W;5:5S;6:4N;7:4O;8:58;9:6I;A:81;a6Wb6Gc63d5Je54f4Hg49h3Wi39j37k36l2Vm2Ln2Bo1Wp1Dquack,r12s0Ft07uMvJwByear5;arp0eFholeEiDoB;man5oBu6P;d6Rzy;despr7Ls5S;!sa7;eClBste2A;co1Nl o4W;!k5;aCiBola4M;b89ce versa,ol5H;ca3gabo6Gnilla;ltUnHpCrb5Msu4tterB;!mo7G; Eb1SpDsBti1M;ca7etBide dKtairs;!ti2;er,i3U;f36to da1;aLbeco75convin29deIeHfair,ivers4knGprecedVrEsCwB;iel3Nritt6A;i1XuB;pervis0spec3Y;eBu5;cognHgul6Tl6T;own;ndi2v64xpect0;cid0rB;!grou5ZsB;iz0tood;b7pp0Dssu6UuthorB;iz0;i26ra;aGeEhDi6AoCrB;i1oubl0us3M;geth8p,rp6Vuc67;ough4Wril33;en60l32mpBrr2X;o6Ati2;boo,lBn;ent0;aWcVeThSiQmug,nobbi3LoOpNqueami3LtFuBymb6H;bDi gener5DpBrpri6D;erBre0N;! dup8b,i2C;du0seq52;anda77eGiFrBunni2y3F;aightCiB;ki2p0; fBfB;or5K;ll,r5S;aBreotyp0;dfa6Cmi2;a55ec2Gir1Hlend6Cot on; call0le,mb8phist1XrBu0Vvi48;d6Ary;gnifica3nB;ce51g7;am2Re8ocki2ut;cBda1em5lfi32ni1Wpa6Jre6;o1Er42;at5Gient28reec5G;cr0me;aJeEiCoB;bu60tt51uQy4;ghtBv4;!-2Bf9;ar,bel,condi1du6Dfres5AlEpublic42sCtard0vB;ea26;is4CoB;lu1na3;aQe1Cuc4A;b5TciBllyi2;al,st;aOeLicayu6lac5Ropuli5QrCuB;bl5Jmp0n51;eGiDoB;!b07fu5RmiBp8;ne3si2;mCor,sBva1;ti6;a53e;ci5MmB;a0EiB;er,um;ac20rBti1;feAma2XpleBv38;xi2;rBst;allelDtB;-tiBi4;me;!ed;bLffJkIld fashion0nHpGrg1Eth8utFvB;al,erB;!all,niCt,wB;eiBrouB;ght;do0Ter,g2Qsi4B;en,posi1; boa5Og2Oli6;!ay; gua5MbBli6;eat;eDsB;cBer0Eole1;e6u3O;d2Xse;aJeIiHoBua4X;nFrCtB;ab7;thB;!eB;rn;chala3descri58stop;ght5;arby,cessa44ighbor5xt;k0usia1A;aIeGiDoBultip7;bi7derBl0Vnth5ot,st;a1n;nBx0;dblo0RiaBor;tu37;ande3Qdi4NnaBre;ci2;cBgenta,in,j01keshift,le,mmoth,ny,sculi6;ab33ho;aKeFiCoBu15;uti14vi2;mCteraB;l,te;it0;ftEgBth4;al,eCitiB;ma1;nda3K;!-0C;ngu3Zst,tt8;ap1Xind5no0A;agg0uB;niMstifi0veni7;de4gno4Klleg4mQnEpso 20rB;a1rB;eleBita0J;va3; KaJbr0corIdGfluenQiQnFsEtCviB;go0Fti2;aAen3SoxB;ic3B;a6i2Vul0D;a1er,oce3;iCoB;or;reA;deq3Qppr33;fBsitu,vitro;ro3;mFpB;arDerfeAoBrop8;li1rtB;a3ed;ti4;eBi0S;d2Vn3C;aIeFiDoBumdr3I;ne36ok0rrBs08ur5;if2Z;ghfalut1QspB;an2X;aClB;liYpf9;li2;lEnDrB;d04roB;wi2;dy;f,low0;ainf9ener2Oiga24lHoGraDuB;ilBng ho;ty;cCtB;ef9is;ef9;ne,od;ea2Iob4;aTeNinMlKoFrB;a1VeDoz1MustB;raB;ti2;e2Gq10tf9;oDrB; keeps,eBm8tuna1;g03ign;liB;sh;aBue3;g31tte1P;al,i1;dFmCrB;ti7;a7ini6;ne;le; up;bl0i3l27r Cux,voB;ri1uri1;oBreac1E;ff;aLfficie3lKmHnFreAthere4veExB;aAcess,pe1QtraCuB;be2Nl0E;!va1E;n,ryday; BcouraEti0O;rou1sui1;erCiB;ne3;gi2;abo23dMe17i1;g8sB;t,ygB;oi2;er;aReJiDoBrea14ue;mina3ne,ubB;le,tf9;dact1Bfficu1OsCvB;er1K;creDeas0gruntl0hone1FordCtB;a3ressM;er5;et; HadpGfFgene1PliDrang0spe1PtCvoB;ut;ail0ermin0;be1Mca1ghB;tf9;ia3;an;facto;i5magBngeroUs0G;ed,i2;ly;ertaMhief,ivil,oDrB;aBowd0u0G;mp0vZz0;loImGnCrrBve0P;eAu1I;cre1fu0LgrDsCtB;empo0Dra0E;ta3;ue3;mer08pleB;te,x;ni4ss4;in;aNeIizarHlFoCrB;and new,isk,okN;gCna fiUttom,urgeoB;is;us;ank,indB;!i2;re;autif9hiDloCnBst,yoD;eUt;v0w;nd;ul;ckCnkru0WrrB;en;!wards; priori,b0Mc0Jd09fra08g04h03lYmWntiquVppSrMsIttracti06utheHvEwB;aCkB;wa0T;ke,re;ant garCerB;age;de;ntU;leep,piDsuDtonB;isB;hi2;ri2;ab,bitEroDtiB;fiB;ci4;ga3;raB;ry;are3etiNrB;oprB;ia1;at0;aJuB;si2;arEcohCeBiIl,oof;rt;olB;ic;mi2;ead;ainDgressiConiB;zi2;ve;st;id; IeGuFvB;aCerB;se;nc0;ed;lt;pt,qB;ua1;hoc,infinitB;um;cuCtu4u1;al;ra1;erLlKoIruHsCuB;nda3;e3oCtraA;ct;lu1rbi2;ng;te;pt;aBve;rd;aze,e;ra3;nt",Comparable:"true¦0:41;1:4I;2:45;3:2Y;4:4B;5:3X;a4Ob44c3Od3De35f2Rg2Fh24i1Vj1Uk1Rl1Jm1Dn17o15p0Vqu0Tr0KsTtMuIvFw7y6za13;ell27ou4;aBe9hi1Yi7r6;o4y;ck0Ode,l6n1ry,se;d,y;a6i4Mt;k,ry;n1Tr6sK;m,y;a7e6ulgar;nge5rda2xi4;g9in,st;g0n6pco3Mse5;like0t6;i1r6;ue;aAen9hi8i7ough,r6;anqu2Oen1ue;dy,g3Sme0ny,r09;ck,n,rs2P;d40se;ll,me,rt,s6wd45;te5;aVcarUeThRiQkin0FlMmKoHpGqua1FtAu7w6;eet,ift;b7dd13per0Gr6;e,re2H;sta2Ft3;aAe9iff,r7u6;pXr1;a6ict,o4;ig3Fn0U;a1ep,rn;le,rk;e22i3Fright0;ci28ft,l7o6re,ur;n,thi4;emn,id;a6el0ooth;ll,rt;e8i6ow,y;ck,g35m6;!y;ek,nd3D;ck,l0mp3;a6iTort,rill,y;dy,ll0Xrp;cu0Rve0Rxy;ce,ed,y;d,fe,int0l1Vv14;aBe9i8o6ude;mantic,o1Isy,u6;gh,nd;ch,pe,tzy;a6d,mo0H;dy,l;gg7ndom,p6re,w;id;ed;ai2i6;ck,et;aEhoDi1QlCoBr8u6;ny,r6;e,p3;egna2ic7o6;fouYud;ey,k0;li04or,te1B;ain,easa2;ny;in5le;dd,f6i0ld,ranQ;fi10;aAe8i7o6;b3isy,rm15sy;ce,mb3;a6w;r,t;ive,rr01;aAe8ild,o7u6;nda19te;ist,o1;a6ek,llX;n,s0ty;d,tuQ;aBeAi9o6ucky;f0Un7o1Du6ve0w17y0T;d,sy;e0g;g1Tke0tt3ve0;an,wd;me,r6te;ge;e7i6;nd;en;ol0ui1P;cy,ll,n6;sBt6;e6ima8;llege2r6;es7media6;te;ti4;ecu6ta2;re;aEeBiAo8u6;ge,m6ng1R;b3id;ll6me0t;ow;gh,l0;a6f04sita2;dy,v6;en0y;nd1Hppy,r6te5;d,sh;aGenFhDiClBoofy,r6;a9e8is0o6ue1E;o6ss;vy;at,en,y;nd,y;ad,ib,ooI;a2d1;a6o6;st0;t3uiY;u1y;aIeeb3iDlat,oAr8u6;ll,n6r14;!ny;aHe6iend0;e,sh;a7r6ul;get5mG;my;erce8n6rm;an6e;ciC;! ;le;ir,ke,n0Fr,st,t,ulA;aAerie,mp9sse7v6xtre0Q;il;nti6;al;ty;r7s6;tern,y;ly,th0;aFeCi9r7u6;ll,mb;u6y;nk;r7vi6;ne;e,ty;a6ep,nD;d6f,r;!ly;mp,pp03rk;aHhDlAo8r7u6;dd0r0te;isp,uel;ar6ld,mmon,ol,st0ward0zy;se;e6ou1;a6vW;n,r;ar8e6il0;ap,e6;sy;mi4;gey,lm8r6;e5i4;ful;!i4;aNiLlIoEr8u6;r0sy;ly;aAi7o6;ad,wn;ef,g7llia2;nt;ht;sh,ve;ld,r7un6;cy;ed,i4;ng;a7o6ue;nd,o1;ck,nd;g,tt6;er;d,ld,w1;dy;bsu9ng8we6;so6;me;ry;rd",TextOrdinal:"true¦bGeDf9hundredHmGnin7qu6s4t0zeroH;enGh1rFwe0;lfFn9;ir0ousandE;d,t4;e0ixt9;cond,ptAvent8xtA;adr9int9;et0th;e6ie8;i2o0;r0urt3;tie5;ft1rst;ight0lev1;e0h,ie2;en1;illion0;th",Cardinal:"true¦bHeEf8hundred,mHnineAone,qu6s4t0zero;en,h2rGw0;e0o;lve,n8;irt9ousandEree;e0ix5;pt1ven4xt1;adr0int0;illion;i3o0;r1ur0;!t2;ty;ft0ve;e2y;ight0lev1;!e0y;en;illion0;!s",Expression:"true¦a02b01dXeVfuck,gShLlImHnGoDpBshAtsk,u7voi04w3y0;a1eLu0;ck,p;!a,hoo,y;h1ow,t0;af,f;e0oa;e,w;gh,h0;! 0h,m;huh,oh;eesh,hh,it;ff,hew,l0sst;ease,z;h1o0w,y;h,o,ps;!h;ah,ope;eh,mm;m1ol0;!s;ao,fao;a4e2i,mm,oly1urr0;ah;! mo6;e,ll0y;!o;ha0i;!ha;ah,ee,o0rr;l0odbye;ly;e0h,t cetera,ww;k,p;'oh,a0uh;m0ng;mit,n0;!it;ah,oo,ye; 1h0rgh;!em;la",Adverb:"true¦a08by 06d02eYfShQinPjustOkinda,mMnJoEpCquite,r9s5t2up1very,well,ye0;p,s; to,wards5;h1iny bit,o0wiO;o,t6ward;en,us;eldom,o0uch;!me1rt0; of;hYtimes,w09;a1e0;alT;ndomSthN;ar excellDer0oint blank; Nhaps;f3n0;ce0ly;! 0;ag02moW; courIten;ewKo0; longEt 0;onIwithstanding;aybe,eanwhiAore0;!ovB;! aboU;deed,steV;en0;ce;or2u0;lArther0;!moJ; 0ev3;examp0good,suH;le;n1v0;er; mas0ough;se;e0irect1; 1finite0;ly;ju8trop;far,n0;ow; DbroCd nauseam,gBl6ny3part,s2t 0w4;be6l0mo6wor6;arge,ea5; soon,ide;mo1w0;ay;re;l 1mo0one,ready,so,ways;st;b1t0;hat;ut;ain;ad;lot,posteriori",Determiner:"true¦aBboth,d9e6few,l4mu8neiDown,plenty,s3th2various,wh0;at0ich0;evC;at,e4is,ose;everal,ome;a,e0;!ast,s;a1i6l0very;!se;ch;e0u;!s;!n0;!o0y;th0;er"},rr=function(e){const t=e.split("|").reduce((e,t)=>{const r=t.split("¦");return e[r[0]]=r[1],e},{}),r={};return Object.keys(t).forEach((function(e){const a=er(t[e]);"true"===e&&(e=!0);for(let t=0;t<a.length;t++){const n=a[t];!0===r.hasOwnProperty(n)?!1===Array.isArray(r[n])?r[n]=[r[n],e]:r[n].push(e):r[n]=e}})),r};let ar={"20th century fox":"Organization","7 eleven":"Organization","motel 6":"Organization",g8:"Organization",vh1:"Organization",q1:"Date",q2:"Date",q3:"Date",q4:"Date",her:["Possessive","Pronoun"],his:["Possessive","Pronoun"],their:["Possessive","Pronoun"],themselves:["Possessive","Pronoun"],your:["Possessive","Pronoun"],our:["Possessive","Pronoun"],my:["Possessive","Pronoun"],its:["Possessive","Pronoun"]};const nr={Unit:(e,t)=>{e[t]=["Abbreviation","Unit"]},Cardinal:(e,t)=>{e[t]=["TextValue","Cardinal"]},TextOrdinal:(e,t)=>{e[t]=["Ordinal","TextValue"],e[t+"s"]=["TextValue","Fraction"]},Singular:(e,t,r)=>{e[t]="Singular";let a=r.transforms.toPlural(t,r);e[a]=e[a]||"Plural"},Infinitive:(e,t,r)=>{e[t]="Infinitive";let a=r.transforms.conjugate(t,r),n=Object.keys(a);for(let t=0;t<n.length;t++){let r=a[n[t]];e[r]=e[r]||n[t]}},Comparable:(e,t,r)=>{e[t]="Comparable";let a=r.transforms.adjectives(t),n=Object.keys(a);for(let t=0;t<n.length;t++){let r=a[n[t]];e[r]=e[r]||n[t]}},PhrasalVerb:(e,t,r)=>{e[t]=["PhrasalVerb","Infinitive"];let a=t.split(" "),n=r.transforms.conjugate(a[0],r),i=Object.keys(n);for(let t=0;t<i.length;t++){let o=n[i[t]]+" "+a[1];e[o]=e[o]||["PhrasalVerb",i[t]],r.hasCompound[n[i[t]]]=!0}},Demonym:(e,t,r)=>{e[t]="Demonym";let a=r.transforms.toPlural(t,r);e[a]=e[a]||["Demonym","Plural"]}},ir=function(e,t,r){Object.keys(e).forEach(a=>{let n=e[a];"Abbreviation"!==n&&"Unit"!==n||(r.cache.abbreviations[a]=!0);let i=a.split(" ");i.length>1&&(r.hasCompound[i[0]]=!0),void 0===nr[n]?void 0!==t[a]?("string"==typeof t[a]&&(t[a]=[t[a]]),"string"==typeof n?t[a].push(n):t[a]=t[a].concat(n)):t[a]=n:nr[n](t,a,r)})};var or={buildOut:function(e){let t=Object.assign({},ar);return Object.keys(tr).forEach(r=>{let a=rr(tr[r]);Object.keys(a).forEach(e=>{a[e]=r}),ir(a,t,e)}),t},addWords:ir};var sr=function(e){let t=e.irregulars.nouns,r=Object.keys(t);for(let a=0;a<r.length;a++){const n=r[a];e.words[n]="Singular",e.words[t[n]]="Plural"}let a=e.irregulars.verbs,n=Object.keys(a);for(let t=0;t<n.length;t++){const r=n[t];e.words[r]=e.words[r]||"Infinitive";let i=e.transforms.conjugate(r,e);i=Object.assign(i,a[r]),Object.keys(i).forEach(t=>{e.words[i[t]]=e.words[i[t]]||t,"Participle"===e.words[i[t]]&&(e.words[i[t]]=t)})}};const lr={g:"Gerund",prt:"Participle",perf:"PerfectTense",pst:"PastTense",fut:"FuturePerfect",pres:"PresentTense",pluperf:"Pluperfect",a:"Actor"};let ur={act:{a:"_or"},ache:{pst:"ached",g:"aching"},age:{g:"ageing",pst:"aged",pres:"ages"},aim:{a:"_er",g:"_ing",pst:"_ed"},arise:{prt:"_n",pst:"arose"},babysit:{a:"_ter",pst:"babysat"},ban:{a:"",g:"_ning",pst:"_ned"},be:{a:"",g:"am",prt:"been",pst:"was",pres:"is"},beat:{a:"_er",g:"_ing",prt:"_en"},become:{prt:"_"},begin:{g:"_ning",prt:"begun",pst:"began"},being:{g:"are",pst:"were",pres:"are"},bend:{prt:"bent"},bet:{a:"_ter",prt:"_"},bind:{pst:"bound"},bite:{g:"biting",prt:"bitten",pst:"bit"},bleed:{pst:"bled",prt:"bled"},blow:{prt:"_n",pst:"blew"},boil:{a:"_er"},brake:{prt:"broken"},break:{pst:"broke"},breed:{pst:"bred"},bring:{pst:"brought",prt:"brought"},broadcast:{pst:"_"},budget:{pst:"_ed"},build:{pst:"built",prt:"built"},burn:{prt:"_ed"},burst:{prt:"_"},buy:{pst:"bought",prt:"bought"},can:{a:"",fut:"_",g:"",pst:"could",perf:"could",pluperf:"could",pres:"_"},catch:{pst:"caught"},choose:{g:"choosing",prt:"chosen",pst:"chose"},cling:{prt:"clung"},come:{prt:"_",pst:"came",g:"coming"},compete:{a:"competitor",g:"competing",pst:"_d"},cost:{pst:"_"},creep:{prt:"crept"},cut:{prt:"_"},deal:{pst:"_t",prt:"_t"},develop:{a:"_er",g:"_ing",pst:"_ed"},die:{g:"dying",pst:"_d"},dig:{g:"_ging",pst:"dug",prt:"dug"},dive:{prt:"_d"},do:{pst:"did",pres:"_es"},draw:{prt:"_n",pst:"drew"},dream:{prt:"_t"},drink:{prt:"drunk",pst:"drank"},drive:{g:"driving",prt:"_n",pst:"drove"},drop:{g:"_ping",pst:"_ped"},eat:{a:"_er",g:"_ing",prt:"_en",pst:"ate"},edit:{pst:"_ed",g:"_ing"},egg:{pst:"_ed"},fall:{prt:"_en",pst:"fell"},feed:{prt:"fed",pst:"fed"},feel:{a:"_er",pst:"felt"},fight:{pst:"fought",prt:"fought"},find:{pst:"found"},flee:{g:"_ing",prt:"fled"},fling:{prt:"flung"},fly:{prt:"flown",pst:"flew"},forbid:{pst:"forbade"},forget:{g:"_ing",prt:"forgotten",pst:"forgot"},forgive:{g:"forgiving",prt:"_n",pst:"forgave"},free:{a:"",g:"_ing"},freeze:{g:"freezing",prt:"frozen",pst:"froze"},get:{pst:"got",prt:"gotten"},give:{g:"giving",prt:"_n",pst:"gave"},go:{prt:"_ne",pst:"went",pres:"goes"},grow:{prt:"_n"},guide:{pst:"_d"},hang:{pst:"hung",prt:"hung"},have:{g:"having",pst:"had",prt:"had",pres:"has"},hear:{pst:"_d",prt:"_d"},hide:{prt:"hidden",pst:"hid"},hit:{prt:"_"},hold:{pst:"held",prt:"held"},hurt:{pst:"_",prt:"_"},ice:{g:"icing",pst:"_d"},imply:{pst:"implied",pres:"implies"},is:{a:"",g:"being",pst:"was",pres:"_"},keep:{prt:"kept"},kneel:{prt:"knelt"},know:{prt:"_n"},lay:{pst:"laid",prt:"laid"},lead:{pst:"led",prt:"led"},leap:{prt:"_t"},leave:{pst:"left",prt:"left"},lend:{prt:"lent"},lie:{g:"lying",pst:"lay"},light:{pst:"lit",prt:"lit"},log:{g:"_ging",pst:"_ged"},loose:{prt:"lost"},lose:{g:"losing",pst:"lost"},make:{pst:"made",prt:"made"},mean:{pst:"_t",prt:"_t"},meet:{a:"_er",g:"_ing",pst:"met",prt:"met"},miss:{pres:"_"},name:{g:"naming"},patrol:{g:"_ling",pst:"_led"},pay:{pst:"paid",prt:"paid"},prove:{prt:"_n"},puke:{g:"puking"},put:{prt:"_"},quit:{prt:"_"},read:{pst:"_",prt:"_"},ride:{prt:"ridden"},reside:{pst:"_d"},ring:{pst:"rang",prt:"rung"},rise:{fut:"will have _n",g:"rising",prt:"_n",pst:"rose",pluperf:"had _n"},rub:{g:"_bing",pst:"_bed"},run:{g:"_ning",prt:"_",pst:"ran"},say:{pst:"said",prt:"said",pres:"_s"},seat:{pst:"sat",prt:"sat"},see:{g:"_ing",prt:"_n",pst:"saw"},seek:{prt:"sought"},sell:{pst:"sold",prt:"sold"},send:{prt:"sent"},set:{prt:"_"},sew:{prt:"_n"},shake:{prt:"_n"},shave:{prt:"_d"},shed:{g:"_ding",pst:"_",pres:"_s"},shine:{pst:"shone",prt:"shone"},shoot:{pst:"shot",prt:"shot"},show:{pst:"_ed"},shut:{prt:"_"},sing:{prt:"sung",pst:"sang"},sink:{pst:"sank",pluperf:"had sunk"},sit:{pst:"sat"},ski:{pst:"_ied"},slay:{prt:"slain"},sleep:{prt:"slept"},slide:{pst:"slid",prt:"slid"},smash:{pres:"_es"},sneak:{prt:"snuck"},speak:{fut:"will have spoken",prt:"spoken",pst:"spoke",perf:"have spoken",pluperf:"had spoken"},speed:{prt:"sped"},spend:{prt:"spent"},spill:{prt:"_ed",pst:"spilt"},spin:{g:"_ning",pst:"spun",prt:"spun"},spit:{prt:"spat"},split:{prt:"_"},spread:{pst:"_"},spring:{prt:"sprung"},stand:{pst:"stood"},steal:{a:"_er",pst:"stole"},stick:{pst:"stuck"},sting:{pst:"stung"},stink:{pst:"stunk",prt:"stunk"},stream:{a:"_er"},strew:{prt:"_n"},strike:{g:"striking",pst:"struck"},suit:{a:"_er",g:"_ing",pst:"_ed"},sware:{prt:"sworn"},swear:{pst:"swore"},sweep:{prt:"swept"},swim:{g:"_ming",pst:"swam"},swing:{pst:"swung"},take:{fut:"will have _n",pst:"took",perf:"have _n",pluperf:"had _n"},teach:{pst:"taught",pres:"_es"},tear:{pst:"tore"},tell:{pst:"told"},think:{pst:"thought"},thrive:{prt:"_d"},tie:{g:"tying",pst:"_d"},undergo:{prt:"_ne"},understand:{pst:"understood"},upset:{prt:"_"},wait:{a:"_er",g:"_ing",pst:"_ed"},wake:{pst:"woke"},wear:{pst:"wore"},weave:{prt:"woven"},wed:{pst:"wed"},weep:{prt:"wept"},win:{g:"_ning",pst:"won"},wind:{prt:"wound"},withdraw:{pst:"withdrew"},wring:{prt:"wrung"},write:{g:"writing",prt:"written",pst:"wrote"}},cr=Object.keys(ur);for(let e=0;e<cr.length;e++){const t=cr[e];let r={};Object.keys(ur[t]).forEach(e=>{let a=ur[t][e];a=a.replace("_",t),r[lr[e]]=a}),ur[t]=r}var hr=ur;const dr={b:[{reg:/([^aeiou][aeiou])b$/i,repl:{pr:"$1bs",pa:"$1bbed",gr:"$1bbing"}}],d:[{reg:/(end)$/i,repl:{pr:"$1s",pa:"ent",gr:"$1ing",ar:"$1er"}},{reg:/(eed)$/i,repl:{pr:"$1s",pa:"$1ed",gr:"$1ing",ar:"$1er"}},{reg:/(ed)$/i,repl:{pr:"$1s",pa:"$1ded",ar:"$1der",gr:"$1ding"}},{reg:/([^aeiou][ou])d$/i,repl:{pr:"$1ds",pa:"$1dded",gr:"$1dding"}}],e:[{reg:/(eave)$/i,repl:{pr:"$1s",pa:"$1d",gr:"eaving",ar:"$1r"}},{reg:/(ide)$/i,repl:{pr:"$1s",pa:"ode",gr:"iding",ar:"ider"}},{reg:/(t|sh?)(ake)$/i,repl:{pr:"$1$2s",pa:"$1ook",gr:"$1aking",ar:"$1$2r"}},{reg:/w(ake)$/i,repl:{pr:"w$1s",pa:"woke",gr:"waking",ar:"w$1r"}},{reg:/m(ake)$/i,repl:{pr:"m$1s",pa:"made",gr:"making",ar:"m$1r"}},{reg:/(a[tg]|i[zn]|ur|nc|gl|is)e$/i,repl:{pr:"$1es",pa:"$1ed",gr:"$1ing"}},{reg:/([bd]l)e$/i,repl:{pr:"$1es",pa:"$1ed",gr:"$1ing"}},{reg:/(om)e$/i,repl:{pr:"$1es",pa:"ame",gr:"$1ing"}}],g:[{reg:/([^aeiou][aou])g$/i,repl:{pr:"$1gs",pa:"$1gged",gr:"$1gging"}}],h:[{reg:/(..)([cs]h)$/i,repl:{pr:"$1$2es",pa:"$1$2ed",gr:"$1$2ing"}}],k:[{reg:/(ink)$/i,repl:{pr:"$1s",pa:"unk",gr:"$1ing",ar:"$1er"}}],m:[{reg:/([^aeiou][aeiou])m$/i,repl:{pr:"$1ms",pa:"$1mmed",gr:"$1mming"}}],n:[{reg:/(en)$/i,repl:{pr:"$1s",pa:"$1ed",gr:"$1ing"}}],p:[{reg:/(e)(ep)$/i,repl:{pr:"$1$2s",pa:"$1pt",gr:"$1$2ing",ar:"$1$2er"}},{reg:/([^aeiou][aeiou])p$/i,repl:{pr:"$1ps",pa:"$1pped",gr:"$1pping"}},{reg:/([aeiu])p$/i,repl:{pr:"$1ps",pa:"$1p",gr:"$1pping"}}],r:[{reg:/([td]er)$/i,repl:{pr:"$1s",pa:"$1ed",gr:"$1ing"}},{reg:/(er)$/i,repl:{pr:"$1s",pa:"$1ed",gr:"$1ing"}}],s:[{reg:/(ish|tch|ess)$/i,repl:{pr:"$1es",pa:"$1ed",gr:"$1ing"}}],t:[{reg:/(ion|end|e[nc]t)$/i,repl:{pr:"$1s",pa:"$1ed",gr:"$1ing"}},{reg:/(.eat)$/i,repl:{pr:"$1s",pa:"$1ed",gr:"$1ing"}},{reg:/([aeiu])t$/i,repl:{pr:"$1ts",pa:"$1t",gr:"$1tting"}},{reg:/([^aeiou][aeiou])t$/i,repl:{pr:"$1ts",pa:"$1tted",gr:"$1tting"}}],w:[{reg:/(.llow)$/i,repl:{pr:"$1s",pa:"$1ed"}},{reg:/(..)(ow)$/i,repl:{pr:"$1$2s",pa:"$1ew",gr:"$1$2ing",prt:"$1$2n"}}],y:[{reg:/(i|f|rr)y$/i,repl:{pr:"$1ies",pa:"$1ied",gr:"$1ying"}}],z:[{reg:/([aeiou]zz)$/i,repl:{pr:"$1es",pa:"$1ed",gr:"$1ing"}}]},gr={pr:"PresentTense",pa:"PastTense",gr:"Gerund",prt:"Participle",ar:"Actor"},pr=function(e,t){let r={},a=Object.keys(t.repl);for(let n=0;n<a.length;n+=1){let i=a[n];r[gr[i]]=e.replace(t.reg,t.repl[i])}return r};const mr=/[bcdfghjklmnpqrstvwxz]y$/;const fr=function(e=""){let t=e[e.length-1];if(!0===dr.hasOwnProperty(t))for(let r=0;r<dr[t].length;r+=1){if(!0===dr[t][r].reg.test(e))return pr(e,dr[t][r])}return{}},br={Gerund:e=>"e"===e.charAt(e.length-1)?e.replace(/e$/,"ing"):e+"ing",PresentTense:e=>"s"===e.charAt(e.length-1)?e+"es":!0===mr.test(e)?e.slice(0,-1)+"ies":e+"s",PastTense:e=>"e"===e.charAt(e.length-1)?e+"d":"ed"===e.substr(-2)?e:!0===mr.test(e)?e.slice(0,-1)+"ied":e+"ed"};var yr=function(e="",t){let r={};return t&&t.irregulars&&!0===t.irregulars.verbs.hasOwnProperty(e)&&(r=Object.assign({},t.irregulars.verbs[e])),r=Object.assign({},fr(e),r),void 0===r.Gerund&&(r.Gerund=br.Gerund(e)),void 0===r.PastTense&&(r.PastTense=br.PastTense(e)),void 0===r.PresentTense&&(r.PresentTense=br.PresentTense(e)),r};const vr=[/ght$/,/nge$/,/ough$/,/ain$/,/uel$/,/[au]ll$/,/ow$/,/oud$/,/...p$/],wr=[/ary$/],kr={nice:"nicest",late:"latest",hard:"hardest",inner:"innermost",outer:"outermost",far:"furthest",worse:"worst",bad:"worst",good:"best",big:"biggest",large:"largest"},Ar=[{reg:/y$/i,repl:"iest"},{reg:/([aeiou])t$/i,repl:"$1ttest"},{reg:/([aeou])de$/i,repl:"$1dest"},{reg:/nge$/i,repl:"ngest"},{reg:/([aeiou])te$/i,repl:"$1test"}];const Dr=[/ght$/,/nge$/,/ough$/,/ain$/,/uel$/,/[au]ll$/,/ow$/,/old$/,/oud$/,/e[ae]p$/],$r=[/ary$/,/ous$/],Pr={grey:"greyer",gray:"grayer",green:"greener",yellow:"yellower",red:"redder",good:"better",well:"better",bad:"worse",sad:"sadder",big:"bigger"},Er=[{reg:/y$/i,repl:"ier"},{reg:/([aeiou])t$/i,repl:"$1tter"},{reg:/([aeou])de$/i,repl:"$1der"},{reg:/nge$/i,repl:"nger"}];const Hr={toSuperlative:function(e){if(kr.hasOwnProperty(e))return kr[e];for(let t=0;t<Ar.length;t++)if(Ar[t].reg.test(e))return e.replace(Ar[t].reg,Ar[t].repl);for(let t=0;t<wr.length;t++)if(!0===wr[t].test(e))return null;for(let t=0;t<vr.length;t++)if(!0===vr[t].test(e))return"e"===e.charAt(e.length-1)?e+"st":e+"est";return e+"est"},toComparative:function(e){if(Pr.hasOwnProperty(e))return Pr[e];for(let t=0;t<Er.length;t++)if(!0===Er[t].reg.test(e))return e.replace(Er[t].reg,Er[t].repl);for(let t=0;t<$r.length;t++)if(!0===$r[t].test(e))return null;for(let t=0;t<Dr.length;t++)if(!0===Dr[t].test(e))return e+"er";return!0===/e$/.test(e)?e+"r":e+"er"}};var jr=function(e){let t={},r=Hr.toSuperlative(e);r&&(t.Superlative=r);let a=Hr.toComparative(e);return a&&(t.Comparative=a),t};const Nr={a:[[/(antenn|formul|nebul|vertebr|vit)a$/i,"$1ae"],[/([ti])a$/i,"$1a"]],e:[[/(kn|l|w)ife$/i,"$1ives"],[/(hive)$/i,"$1s"],[/([m|l])ouse$/i,"$1ice"],[/([m|l])ice$/i,"$1ice"]],f:[[/^(dwar|handkerchie|hoo|scar|whar)f$/i,"$1ves"],[/^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)f$/i,"$1ves"]],i:[[/(octop|vir)i$/i,"$1i"]],m:[[/([ti])um$/i,"$1a"]],n:[[/^(oxen)$/i,"$1"]],o:[[/(al|ad|at|er|et|ed|ad)o$/i,"$1oes"]],s:[[/(ax|test)is$/i,"$1es"],[/(alias|status)$/i,"$1es"],[/sis$/i,"ses"],[/(bu)s$/i,"$1ses"],[/(sis)$/i,"ses"],[/^(?!talis|.*hu)(.*)man$/i,"$1men"],[/(octop|vir|radi|nucle|fung|cact|stimul)us$/i,"$1i"]],x:[[/(matr|vert|ind|cort)(ix|ex)$/i,"$1ices"],[/^(ox)$/i,"$1en"]],y:[[/([^aeiouy]|qu)y$/i,"$1ies"]],z:[[/(quiz)$/i,"$1zes"]]},xr=/(x|ch|sh|s|z)$/;var Fr=function(e="",t){let r=t.irregulars.nouns;if(r.hasOwnProperty(e))return r[e];let a=function(e){let t=e[e.length-1];if(!0===Nr.hasOwnProperty(t))for(let r=0;r<Nr[t].length;r+=1){let a=Nr[t][r][0];if(!0===a.test(e))return e.replace(a,Nr[t][r][1])}return null}(e);return null!==a?a:xr.test(e)?e+"es":e+"s"};const Cr=[[/([^v])ies$/i,"$1y"],[/ises$/i,"isis"],[/(kn|[^o]l|w)ives$/i,"$1ife"],[/^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)ves$/i,"$1f"],[/^(dwar|handkerchie|hoo|scar|whar)ves$/i,"$1f"],[/(antenn|formul|nebul|vertebr|vit)ae$/i,"$1a"],[/(octop|vir|radi|nucle|fung|cact|stimul)(i)$/i,"$1us"],[/(buffal|tomat|tornad)(oes)$/i,"$1o"],[/(eas)es$/i,"$1e"],[/(..[aeiou]s)es$/i,"$1"],[/(vert|ind|cort)(ices)$/i,"$1ex"],[/(matr|append)(ices)$/i,"$1ix"],[/(x|ch|ss|sh|z|o)es$/i,"$1"],[/men$/i,"man"],[/(n)ews$/i,"$1ews"],[/([ti])a$/i,"$1um"],[/([^aeiouy]|qu)ies$/i,"$1y"],[/(s)eries$/i,"$1eries"],[/(m)ovies$/i,"$1ovie"],[/([m|l])ice$/i,"$1ouse"],[/(cris|ax|test)es$/i,"$1is"],[/(alias|status)es$/i,"$1"],[/(ss)$/i,"$1"],[/(ics)$/i,"$1"],[/s$/i,""]];var Br=function(e,t){let r=t.irregulars.nouns,a=(n=r,Object.keys(n).reduce((e,t)=>(e[n[t]]=t,e),{}));var n;if(a.hasOwnProperty(e))return a[e];for(let t=0;t<Cr.length;t++)if(!0===Cr[t][0].test(e))return e=e.replace(Cr[t][0],Cr[t][1]);return e};var Gr={Participle:[{reg:/own$/i,to:"ow"},{reg:/(.)un([g|k])$/i,to:"$1in$2"}],Actor:[{reg:/(er)er$/i,to:"$1"}],PresentTense:[{reg:/(..)(ies)$/i,to:"$1y"},{reg:/(tch|sh)es$/i,to:"$1"},{reg:/(ss|zz)es$/i,to:"$1"},{reg:/([tzlshicgrvdnkmu])es$/i,to:"$1e"},{reg:/(n[dtk]|c[kt]|[eo]n|i[nl]|er|a[ytrl])s$/i,to:"$1"},{reg:/(ow)s$/i,to:"$1"},{reg:/(op)s$/i,to:"$1"},{reg:/([eirs])ts$/i,to:"$1t"},{reg:/(ll)s$/i,to:"$1"},{reg:/(el)s$/i,to:"$1"},{reg:/(ip)es$/i,to:"$1e"},{reg:/ss$/i,to:"ss"},{reg:/s$/i,to:""}],Gerund:[{reg:/(..)(p|d|t|g){2}ing$/i,to:"$1$2"},{reg:/(ll|ss|zz)ing$/i,to:"$1"},{reg:/([^aeiou])ying$/i,to:"$1y"},{reg:/([^ae]i.)ing$/i,to:"$1e"},{reg:/(ea[dklnrtv])ing$/i,to:"$1"},{reg:/(ch|sh)ing$/i,to:"$1"},{reg:/(z)ing$/i,to:"$1e"},{reg:/(a[gdkvtc])ing$/i,to:"$1e"},{reg:/(u[rtcbn])ing$/i,to:"$1e"},{reg:/([^o]o[bdknprv])ing$/i,to:"$1e"},{reg:/([tbckg]l)ing$/i,to:"$1e"},{reg:/(c|s)ing$/i,to:"$1e"},{reg:/(..)ing$/i,to:"$1"}],PastTense:[{reg:/(ued)$/i,to:"ue"},{reg:/ea(rn|l|m)ed$/i,to:"ea$1"},{reg:/a([^aeiouy])ed$/i,to:"a$1e"},{reg:/([aeiou]zz)ed$/i,to:"$1"},{reg:/(e|i)lled$/i,to:"$1ll"},{reg:/(.)(sh|ch)ed$/i,to:"$1$2"},{reg:/(tl|gl)ed$/i,to:"$1e"},{reg:/(um?pt?)ed$/i,to:"$1"},{reg:/(ss)ed$/i,to:"$1"},{reg:/pped$/i,to:"p"},{reg:/tted$/i,to:"t"},{reg:/(..)gged$/i,to:"$1g"},{reg:/(..)lked$/i,to:"$1lk"},{reg:/([^aeiouy][aeiou])ked$/i,to:"$1ke"},{reg:/(.[aeiou])led$/i,to:"$1l"},{reg:/(..)(h|ion|n[dt]|ai.|[cs]t|pp|all|ss|tt|int|ail|ld|en|oo.|er|k|pp|w|ou.|rt|ght|rm)ed$/i,to:"$1$2"},{reg:/(.ut)ed$/i,to:"$1e"},{reg:/(.pt)ed$/i,to:"$1"},{reg:/(us)ed$/i,to:"$1e"},{reg:/(dd)ed$/i,to:"$1"},{reg:/(..[^aeiouy])ed$/i,to:"$1e"},{reg:/(..)ied$/i,to:"$1y"},{reg:/(.o)ed$/i,to:"$1o"},{reg:/(..i)ed$/i,to:"$1"},{reg:/(.a[^aeiou])ed$/i,to:"$1"},{reg:/([aeiou][^aeiou])ed$/i,to:"$1e"},{reg:/([rl])ew$/i,to:"$1ow"},{reg:/([pl])t$/i,to:"$1t"}]};let zr={Gerund:["ing"],Actor:["erer"],Infinitive:["ate","ize","tion","rify","then","ress","ify","age","nce","ect","ise","ine","ish","ace","ash","ure","tch","end","ack","and","ute","ade","ock","ite","ase","ose","use","ive","int","nge","lay","est","ain","ant","ent","eed","er","le","own","unk","ung","en"],PastTense:["ed","lt","nt","pt","ew","ld"],PresentTense:["rks","cks","nks","ngs","mps","tes","zes","ers","les","acks","ends","ands","ocks","lays","eads","lls","els","ils","ows","nds","ays","ams","ars","ops","ffs","als","urs","lds","ews","ips","es","ts","ns"]};zr=Object.keys(zr).reduce((e,t)=>(zr[t].forEach(r=>e[r]=t),e),{});const Ir=Gr,Or=zr;const Tr=Ut,Vr=or,Mr=sr,Jr=Lt,Lr={nouns:{addendum:"addenda",alga:"algae",alumna:"alumnae",alumnus:"alumni",analysis:"analyses",antenna:"antennae",appendix:"appendices",avocado:"avocados",axis:"axes",bacillus:"bacilli",barracks:"barracks",beau:"beaux",bus:"buses",cactus:"cacti",chateau:"chateaux",child:"children",circus:"circuses",clothes:"clothes",corpus:"corpora",criterion:"criteria",curriculum:"curricula",database:"databases",deer:"deer",diagnosis:"diagnoses",echo:"echoes",embargo:"embargoes",epoch:"epochs",foot:"feet",formula:"formulae",fungus:"fungi",genus:"genera",goose:"geese",halo:"halos",hippopotamus:"hippopotami",index:"indices",larva:"larvae",leaf:"leaves",libretto:"libretti",loaf:"loaves",man:"men",matrix:"matrices",memorandum:"memoranda",modulus:"moduli",mosquito:"mosquitoes",mouse:"mice",nebula:"nebulae",nucleus:"nuclei",octopus:"octopi",opus:"opera",ovum:"ova",ox:"oxen",parenthesis:"parentheses",person:"people",phenomenon:"phenomena",prognosis:"prognoses",quiz:"quizzes",radius:"radii",referendum:"referenda",rodeo:"rodeos",sex:"sexes",shoe:"shoes",sombrero:"sombreros",stimulus:"stimuli",stomach:"stomachs",syllabus:"syllabi",synopsis:"synopses",tableau:"tableaux",thesis:"theses",thief:"thieves",tooth:"teeth",tornado:"tornados",tuxedo:"tuxedos",vertebra:"vertebrae"},verbs:hr},Sr={conjugate:yr,adjectives:jr,toPlural:Fr,toSingular:Br,toInfinitive:function(e,t,r){if(!e)return"";if(!0===t.words.hasOwnProperty(e)){let r=t.irregulars.verbs,a=Object.keys(r);for(let t=0;t<a.length;t++){let n=Object.keys(r[a[t]]);for(let i=0;i<n.length;i++)if(e===r[a[t]][n[i]])return a[t]}}if((r=r||function(e){let t=e.substr(e.length-3);if(!0===Or.hasOwnProperty(t))return Or[t];let r=e.substr(e.length-2);return!0===Or.hasOwnProperty(r)?Or[r]:"s"===e.substr(e.length-1)?"PresentTense":null}(e))&&Ir[r])for(let t=0;t<Ir[r].length;t++){const a=Ir[r][t];if(!0===a.reg.test(e))return e.replace(a.reg,a.to)}return e}};let _r=!1;class Kr{constructor(){Object.defineProperty(this,"words",{enumerable:!1,value:{},writable:!0}),Object.defineProperty(this,"hasCompound",{enumerable:!1,value:{},writable:!0}),Object.defineProperty(this,"irregulars",{enumerable:!1,value:Lr,writable:!0}),Object.defineProperty(this,"tags",{enumerable:!1,value:Object.assign({},Tr),writable:!0}),Object.defineProperty(this,"transforms",{enumerable:!1,value:Sr,writable:!0}),Object.defineProperty(this,"taggers",{enumerable:!1,value:[],writable:!0}),Object.defineProperty(this,"cache",{enumerable:!1,value:{abbreviations:{}}}),this.words=Vr.buildOut(this),Mr(this)}verbose(e){return _r=e,this}isVerbose(){return _r}addWords(e){let t={};Object.keys(e).forEach(r=>{let a=e[r];r=r.toLowerCase().trim(),t[r]=a}),Vr.addWords(t,this.words,this)}addConjugations(e){return Object.assign(this.irregulars.verbs,e),this}addPlurals(e){return Object.assign(this.irregulars.nouns,e),this}addTags(e){return e=Object.assign({},e),this.tags=Object.assign(this.tags,e),this.tags=Jr(this.tags),this}postProcess(e){return this.taggers.push(e),this}stats(){return{words:Object.keys(this.words).length,plurals:Object.keys(this.irregulars.nouns).length,conjugations:Object.keys(this.irregulars.verbs).length,compounds:Object.keys(this.hasCompound).length,postProcessors:this.taggers.length}}}const qr=function(e){return JSON.parse(JSON.stringify(e))};Kr.prototype.clone=function(){let e=new Kr;return e.words=Object.assign({},this.words),e.hasCompound=Object.assign({},this.hasCompound),e.irregulars=qr(this.irregulars),e.tags=qr(this.tags),e.transforms=this.transforms,e.taggers=this.taggers,e};var Wr=Kr,Rr={};!function(e){e.all=function(){return this.parents()[0]||this},e.parent=function(){return this.from?this.from:this},e.parents=function(e){let t=[];const r=function(e){e.from&&(t.push(e.from),r(e.from))};return r(this),t=t.reverse(),"number"==typeof e?t[e]:t},e.clone=function(e){let t=this.list.map(t=>t.clone(e));return this.buildFrom(t)},e.wordCount=function(){return this.list.reduce((e,t)=>e+=t.wordCount(),0)},e.wordcount=e.wordCount}(Rr);var Ur={};!function(e){e.first=function(e){return void 0===e?this.get(0):this.slice(0,e)},e.last=function(e){if(void 0===e)return this.get(this.list.length-1);let t=this.list.length;return this.slice(t-e,t)},e.slice=function(e,t){let r=this.list.slice(e,t);return this.buildFrom(r)},e.eq=function(e){let t=this.list[e];return void 0===t?this.buildFrom([]):this.buildFrom([t])},e.get=e.eq,e.firstTerms=function(){return this.match("^.")},e.firstTerm=e.firstTerms,e.lastTerms=function(){return this.match(".$")},e.lastTerm=e.lastTerms,e.termList=function(e){let t=[];for(let r=0;r<this.list.length;r++){let a=this.list[r].terms();for(let r=0;r<a.length;r++)if(t.push(a[r]),void 0!==e&&void 0!==t[e])return t[e]}return t};e.groups=function(e){return void 0===e?function(e){let t={};const r={};for(let t=0;t<e.list.length;t++){const a=e.list[t],n=Object.keys(a.groups).map(e=>a.groups[e]);for(let e=0;e<n.length;e++){const{group:t,start:i,length:o}=n[e];r[t]||(r[t]=[]),r[t].push(a.buildFrom(i,o))}}const a=Object.keys(r);for(let n=0;n<a.length;n++){const i=a[n];t[i]=e.buildFrom(r[i])}return t}(this):("number"==typeof e&&(e=String(e)),function(e,t){const r=[];for(let a=0;a<e.list.length;a++){const n=e.list[a];let i=Object.keys(n.groups);i=i.filter(e=>n.groups[e].group===t),i.forEach(e=>{r.push(n.buildFrom(n.groups[e].start,n.groups[e].length))})}return e.buildFrom(r)}(this,e)||this.buildFrom([]))},e.group=e.groups,e.sentences=function(e){let t=[];return this.list.forEach(e=>{t.push(e.fullSentence())}),"number"==typeof e?this.buildFrom([t[e]]):this.buildFrom(t)},e.sentence=e.sentences}(Ur);var Qr={};var Zr=function(e,t){if(e._cache&&!0===e._cache.set){let{words:r,tags:a}=function(e){let t=[],r=[];return e.forEach(e=>{!0!==e.optional&&!0!==e.negative&&(void 0!==e.tag&&t.push(e.tag),void 0!==e.word&&r.push(e.word))}),{tags:t,words:r}}(t);for(let t=0;t<r.length;t++)if(void 0===e._cache.words[r[t]])return!1;for(let t=0;t<a.length;t++)if(void 0===e._cache.tags[a[t]])return!1}return!0};!function(e){const t=Se,r=Zr;e.match=function(e,a={}){"string"!=typeof a&&"number"!=typeof a&&null!==a||(a={group:a});let n=t(e,a);if(0===n.length)return this.buildFrom([]);if(!1===r(this,n))return this.buildFrom([]);let i=this.list.reduce((e,t)=>e.concat(t.match(n)),[]);return void 0!==a.group&&null!==a.group&&""!==a.group?this.buildFrom(i).groups(a.group):this.buildFrom(i)},e.not=function(e,a={}){let n=t(e,a);if(0===n.length||!1===r(this,n))return this;let i=this.list.reduce((e,t)=>e.concat(t.not(n)),[]);return this.buildFrom(i)},e.matchOne=function(e,a={}){let n=t(e,a);if(!1===r(this,n))return this.buildFrom([]);for(let e=0;e<this.list.length;e++){let t=this.list[e].match(n,!0);return this.buildFrom(t)}return this.buildFrom([])},e.if=function(e,a={}){let n=t(e,a);if(!1===r(this,n))return this.buildFrom([]);let i=this.list.filter(e=>!0===e.has(n));return this.buildFrom(i)},e.ifNo=function(e,r={}){let a=t(e,r),n=this.list.filter(e=>!1===e.has(a));return this.buildFrom(n)},e.has=function(e,a={}){let n=t(e,a);return!1!==r(this,n)&&this.list.some(e=>!0===e.has(n))},e.lookAhead=function(e,r={}){e||(e=".*");let a=t(e,r),n=[];return this.list.forEach(e=>{n=n.concat(e.lookAhead(a))}),n=n.filter(e=>e),this.buildFrom(n)},e.lookAfter=e.lookAhead,e.lookBehind=function(e,r={}){e||(e=".*");let a=t(e,r),n=[];return this.list.forEach(e=>{n=n.concat(e.lookBehind(a))}),n=n.filter(e=>e),this.buildFrom(n)},e.lookBefore=e.lookBehind,e.before=function(e,r={}){let a=t(e,r),n=this.if(a).list.map(e=>{let t=e.terms().map(e=>e.id),r=e.match(a)[0],n=t.indexOf(r.start);return 0===n||-1===n?null:e.buildFrom(e.start,n)});return n=n.filter(e=>null!==e),this.buildFrom(n)},e.after=function(e,r={}){let a=t(e,r),n=this.if(a).list.map(e=>{let t=e.terms(),r=t.map(e=>e.id),n=e.match(a)[0],i=r.indexOf(n.start);if(-1===i||!t[i+n.length])return null;let o=t[i+n.length].id,s=e.length-i-n.length;return e.buildFrom(o,s)});return n=n.filter(e=>null!==e),this.buildFrom(n)},e.hasAfter=function(e,t={}){return this.filter(r=>r.lookAfter(e,t).found)},e.hasBefore=function(e,t={}){return this.filter(r=>r.lookBefore(e,t).found)}}(Qr);var Xr={};const Yr=function(e,t,r,a){let n=[];"string"==typeof e&&(n=e.split(" ")),t.list.forEach(i=>{let o=i.terms();!0===r&&(o=o.filter(r=>r.canBe(e,t.world))),o.forEach((r,i)=>{n.length>1?n[i]&&"."!==n[i]&&r.tag(n[i],a,t.world):r.tag(e,a,t.world)})})};Xr.tag=function(e,t){return e?(Yr(e,this,!1,t),this):this},Xr.tagSafe=function(e,t){return e?(Yr(e,this,!0,t),this):this},Xr.unTag=function(e,t){return this.list.forEach(r=>{r.terms().forEach(r=>r.unTag(e,t,this.world))}),this},Xr.canBe=function(e){if(!e)return this;let t=this.world,r=this.list.reduce((r,a)=>r.concat(a.canBe(e,t)),[]);return this.buildFrom(r)};var ea={map:function(e){if(!e)return this;let t=this.list.map((t,r)=>{let a=this.buildFrom([t]);a.from=null;let n=e(a,r);return n&&n.list&&n.list[0]?n.list[0]:n});return t=t.filter(e=>e),0===t.length?this.buildFrom(t):"object"!=typeof t[0]||"Phrase"!==t[0].isA?t:this.buildFrom(t)},forEach:function(e,t){return e?(this.list.forEach((r,a)=>{let n=this.buildFrom([r]);!0===t&&(n.from=null),e(n,a)}),this):this},filter:function(e){if(!e)return this;let t=this.list.filter((t,r)=>{let a=this.buildFrom([t]);return a.from=null,e(a,r)});return this.buildFrom(t)},find:function(e){if(!e)return this;let t=this.list.find((t,r)=>{let a=this.buildFrom([t]);return a.from=null,e(a,r)});return t?this.buildFrom([t]):void 0},some:function(e){return e?this.list.some((t,r)=>{let a=this.buildFrom([t]);return a.from=null,e(a,r)}):this},random:function(e){if(!this.found)return this;let t=Math.floor(Math.random()*this.list.length);if(void 0===e){let e=[this.list[t]];return this.buildFrom(e)}return t+e>this.length&&(t=this.length-e,t=t<0?0:t),this.slice(t,t+e)}},ta={};var ra=function(e,t,r){let a=function(e,t=[]){let r={};return e.forEach((e,a)=>{let n=!0;void 0!==t[a]&&(n=t[a]);let i=function(e){return e.split(/[ -]/g)}(e=(e=(e||"").toLowerCase()).replace(/[,;.!?]+$/,"")).map(e=>e.trim());r[i[0]]=r[i[0]]||{},1===i.length?r[i[0]].value=n:(r[i[0]].more=r[i[0]].more||[],r[i[0]].more.push({rest:i.slice(1),value:n}))}),r}(e,t),n=[];for(let e=0;e<r.list.length;e++){const t=r.list[e];let i=t.terms().map(e=>e.reduced);for(let e=0;e<i.length;e++)void 0!==a[i[e]]&&(void 0!==a[i[e]].more&&a[i[e]].more.forEach(r=>{if(void 0===i[e+r.rest.length])return;!0===r.rest.every((t,r)=>t===i[e+r+1])&&n.push({id:t.terms()[e].id,value:r.value,length:r.rest.length+1})}),void 0!==a[i[e]].value&&n.push({id:t.terms()[e].id,value:a[i[e]].value,length:1}))}return n};!function(e){const t=ra;e.lookup=function(e){let r=[],a=(n=e)&&"[object Object]"===Object.prototype.toString.call(n);var n;!0===a&&(e=Object.keys(e).map(t=>(r.push(e[t]),t))),"string"==typeof e&&(e=[e]),!0!==this._cache.set&&this.cache();let i=t(e,r,this),o=this.list[0];if(!0===a){let e={};return i.forEach(t=>{e[t.value]=e[t.value]||[],e[t.value].push(o.buildFrom(t.id,t.length))}),Object.keys(e).forEach(t=>{e[t]=this.buildFrom(e[t])}),e}return i=i.map(e=>o.buildFrom(e.id,e.length)),this.buildFrom(i)},e.lookUp=e.lookup}(ta);var aa={cache:function(e){e=e||{};let t={},r={};return this._cache.words=t,this._cache.tags=r,this._cache.set=!0,this.list.forEach((a,n)=>{a.cache=a.cache||{},a.terms().forEach(a=>{t[a.reduced]&&!t.hasOwnProperty(a.reduced)||(t[a.reduced]=t[a.reduced]||[],t[a.reduced].push(n),Object.keys(a.tags).forEach(e=>{r[e]=r[e]||[],r[e].push(n)}),e.root&&(a.setRoot(this.world),t[a.root]=[n]))})}),this},uncache:function(){return this._cache={},this.list.forEach(e=>{e.cache={}}),this.parents().forEach(e=>{e._cache={},e.list.forEach(e=>{e.cache={}})}),this}},na={};const ia=Nt;na.replaceWith=function(e,t={}){return e?(!0===t&&(t={keepTags:!0}),!1===t&&(t={keepTags:!1}),t=t||{},this.uncache(),this.list.forEach(r=>{let a,n=e;if("function"==typeof e&&(n=e(r)),n&&"object"==typeof n&&"Doc"===n.isA)a=n.list,this.pool().merge(n.pool());else{if("string"!=typeof n)return;{!1!==t.keepCase&&r.terms(0).isTitleCase()&&(n=(i=n).charAt(0).toUpperCase()+i.substr(1)),a=ia(n,this.world,this.pool());let e=this.buildFrom(a);e.tagger(),a=e.list}}var i;if(!0===t.keepTags){let e=r.json({terms:{tags:!0}}).terms;a[0].terms().forEach((t,r)=>{e[r]&&t.tagSafe(e[r].tags,"keptTag",this.world)})}r.replace(a[0],this)}),this):this.delete()},na.replace=function(e,t,r){return void 0===t?this.replaceWith(e,r):(this.match(e).replaceWith(t,r),this)};var oa={};!function(e){const t=Nt,r=function(e){return e&&"[object Object]"===Object.prototype.toString.call(e)},a=function(e,r){let a=t(e,r.world)[0],n=r.buildFrom([a]);return n.tagger(),r.list=n.list,r};e.append=function(e=""){return e?this.found?(this.uncache(),this.list.forEach(a=>{let n;r(e)&&"Doc"===e.isA?n=e.list[0].clone():"string"==typeof e&&(n=t(e,this.world,this.pool())[0]),this.buildFrom([n]).tagger(),a.append(n,this)}),this):a(e,this):this},e.insertAfter=e.append,e.insertAt=e.append,e.prepend=function(e){return e?this.found?(this.uncache(),this.list.forEach(a=>{let n;r(e)&&"Doc"===e.isA?n=e.list[0].clone():"string"==typeof e&&(n=t(e,this.world,this.pool())[0]),this.buildFrom([n]).tagger(),a.prepend(n,this)}),this):a(e,this):this},e.insertBefore=e.prepend,e.concat=function(){this.uncache();let e=this.list.slice(0);for(let r=0;r<arguments.length;r++){let a=arguments[r];if("string"==typeof a){let r=t(a,this.world);e=e.concat(r)}else"Doc"===a.isA?e=e.concat(a.list):"Phrase"===a.isA&&e.push(a)}return this.buildFrom(e)},e.delete=function(e){this.uncache();let t=this;return e&&(t=this.match(e)),t.list.forEach(e=>e.delete(this)),this},e.remove=e.delete}(oa);var sa={};const la={clean:!0,reduced:!0,root:!0};sa.text=function(e){e=e||{};let t=!1;0===this.parents().length&&(t=!0),("root"===e||"object"==typeof e&&e.root)&&this.list.forEach(e=>{e.terms().forEach(e=>{null===e.root&&e.setRoot(this.world)})});let r=this.list.reduce((r,a,n)=>{const i=!t&&0===n,o=!t&&n===this.list.length-1;return r+a.text(e,i,o)},"");return!0!==la[e]&&!0!==e.reduced&&!0!==e.clean&&!0!==e.root||(r=r.trim()),r};var ua={};var ca=function(e,t,r){let a=function(e){let t=0,r=0,a={};return e.termList().forEach(e=>{a[e.id]={index:r,start:t+e.pre.length,length:e.text.length},t+=e.pre.length+e.text.length+e.post.length,r+=1}),a}(e.all());(r.terms.index||r.index)&&t.forEach(e=>{e.terms.forEach(e=>{e.index=a[e.id].index}),e.index=e.terms[0].index}),(r.terms.offset||r.offset)&&t.forEach(e=>{e.terms.forEach(e=>{e.offset=a[e.id]||{}}),e.offset={index:e.terms[0].offset.index,start:e.terms[0].offset.start-e.text.indexOf(e.terms[0].text),length:e.text.length}})};!function(e){const t=ca,r={text:!0,terms:!0,trim:!0};e.json=function(e={}){if("number"==typeof e&&this.list[e])return this.list[e].json(r);!0===(e=function(e){return(e=Object.assign({},r,e)).unique&&(e.reduced=!0),e.offset&&(e.text=!0,e.terms&&!0!==e.terms||(e.terms={}),e.terms.offset=!0),(e.index||e.terms.index)&&(e.terms=!0===e.terms?{}:e.terms,e.terms.id=!0),e}(e)).root&&this.list.forEach(e=>{e.terms().forEach(e=>{null===e.root&&e.setRoot(this.world)})});let a=this.list.map(t=>t.json(e,this.world));if((e.terms.offset||e.offset||e.terms.index||e.index)&&t(this,a,e),e.frequency||e.freq||e.count){let e={};this.list.forEach(t=>{let r=t.text("reduced");e[r]=e[r]||0,e[r]+=1}),this.list.forEach((t,r)=>{a[r].count=e[t.text("reduced")]})}if(e.unique){let e={};a=a.filter(t=>!0!==e[t.reduced]&&(e[t.reduced]=!0,!0))}return a},e.data=e.json}(ua);var ha={},da={exports:{}};!function(e){const t="[0m",r=function(e,t){for(e=e.toString();e.length<t;)e+=" ";return e};const a={green:"#7f9c6c",red:"#914045",blue:"#6699cc",magenta:"#6D5685",cyan:"#2D85A8",yellow:"#e6d7b3",black:"#303b50"},n={green:function(e){return"[32m"+e+t},red:function(e){return"[31m"+e+t},blue:function(e){return"[34m"+e+t},magenta:function(e){return"[35m"+e+t},cyan:function(e){return"[36m"+e+t},yellow:function(e){return"[33m"+e+t},black:function(e){return"[30m"+e+t}};e.exports=function(e){return"undefined"!=typeof window&&window.document?(function(e){let t=e.world.tags;e.list.forEach(e=>{console.log('\n%c"'+e.text()+'"',"color: #e6d7b3;"),e.terms().forEach(e=>{let n=Object.keys(e.tags),i=e.text||"-";e.implicit&&(i="["+e.implicit+"]");let o="'"+i+"'";o=r(o,8);let s=n.find(e=>t[e]&&t[e].color),l="steelblue";t[s]&&(l=t[s].color,l=a[l]),console.log(`   ${o}  -  %c${n.join(", ")}`,`color: ${l||"steelblue"};`)})})}(e),e):(console.log(n.blue("=====")),e.list.forEach(t=>{console.log(n.blue("  -----")),t.terms().forEach(t=>{let a=Object.keys(t.tags),i=t.text||"-";t.implicit&&(i="["+t.implicit+"]"),i=n.yellow(i);let o="'"+i+"'";o=r(o,18);let s=n.blue("  ｜ ")+o+"  - "+function(e,t){return(e=e.map(e=>{if(!t.tags.hasOwnProperty(e))return e;const r=t.tags[e].color||"blue";return n[r](e)})).join(", ")}(a,e.world);console.log(s)})}),console.log(""),e)}}(da);const ga=da.exports,pa=function(e){let t=e.json({text:!1,terms:!1,reduced:!0}),r={};t.forEach(e=>{r[e.reduced]||(e.count=0,r[e.reduced]=e),r[e.reduced].count+=1});let a=Object.keys(r).map(e=>r[e]);return a.sort((e,t)=>e.count>t.count?-1:e.count<t.count?1:0),a};ha.debug=function(){return ga(this),this},ha.out=function(e){if("text"===e)return this.text();if("normal"===e)return this.text("normal");if("json"===e)return this.json();if("offset"===e||"offsets"===e)return this.json({offset:!0});if("array"===e)return this.json({terms:!1}).map(e=>e.text).filter(e=>e);if("freq"===e||"frequency"===e)return pa(this);if("terms"===e){let e=[];return this.json({text:!1,terms:{text:!0}}).forEach(t=>{let r=t.terms.map(e=>e.text);r=r.filter(e=>e),e=e.concat(r)}),e}return"tags"===e?this.list.map(e=>e.terms().reduce((e,t)=>(e[t.clean||t.implicit]=Object.keys(t.tags),e),{})):"debug"===e?(ga(this),this):this.text()};var ma={};const fa={alpha:(e,t)=>{let r=e.text("clean"),a=t.text("clean");return r<a?-1:r>a?1:0},length:(e,t)=>{let r=e.text().trim().length,a=t.text().trim().length;return r<a?1:r>a?-1:0},wordCount:(e,t)=>{let r=e.wordCount(),a=t.wordCount();return r<a?1:r>a?-1:0}};fa.alphabetical=fa.alpha,fa.wordcount=fa.wordCount;const ba={index:!0,sequence:!0,seq:!0,sequential:!0,chron:!0,chronological:!0};ma.sort=function(e){return"freq"===(e=e||"alpha")||"frequency"===e||"topk"===e?function(e){let t={};const r={case:!0,punctuation:!1,whitespace:!0,unicode:!0};return e.list.forEach(e=>{let a=e.text(r);t[a]=t[a]||0,t[a]+=1}),e.list.sort((e,a)=>{let n=t[e.text(r)],i=t[a.text(r)];return n<i?1:n>i?-1:0}),e}(this):ba.hasOwnProperty(e)?function(e){let t={};return e.json({terms:{offset:!0}}).forEach(e=>{t[e.terms[0].id]=e.terms[0].offset.start}),e.list=e.list.sort((e,r)=>t[e.start]>t[r.start]?1:t[e.start]<t[r.start]?-1:0),e}(this):"function"==typeof(e=fa[e]||e)?(this.list=this.list.sort(e),this):this},ma.reverse=function(){let e=[].concat(this.list);return e=e.reverse(),this.buildFrom(e)},ma.unique=function(){let e=[].concat(this.list),t={};return e=e.filter(e=>{let r=e.text("reduced").trim()||e.text("implicit").trim();return!0!==t.hasOwnProperty(r)&&(t[r]=!0,!0)}),this.buildFrom(e)};var ya={};const va=n,wa=/[\[\]{}⟨⟩:,،、‒–—―…‹›«»‐\-;\/⁄·*\•^†‡°¡¿※№÷×ºª%‰=‱¶§~|‖¦©℗®℠™¤₳฿]/g,ka=/['‘’“”"′″‴]+/g;const Aa={whitespace:function(e){let t=e.list.map(e=>e.terms());t.forEach((e,r)=>{e.forEach((a,n)=>{!0!==a.hasDash()?(a.pre=a.pre.replace(/\s/g,""),a.post=a.post.replace(/\s/g,""),(e.length-1!==n||t[r+1])&&(a.implicit&&!0===Boolean(a.text)||!0!==a.hasHyphen()&&(a.post+=" "))):a.post=" - "})})},punctuation:function(e){e.forEach(e=>{!0===e.hasHyphen()&&(e.post=" "),e.pre=e.pre.replace(wa,""),e.post=e.post.replace(wa,""),e.post=e.post.replace(/\.\.\./,""),!0===/!/.test(e.post)&&(e.post=e.post.replace(/!/g,""),e.post="!"+e.post),!0===/\?/.test(e.post)&&(e.post=e.post.replace(/[\?!]*/,""),e.post="?"+e.post)})},unicode:function(e){e.forEach(e=>{!0!==e.isImplicit()&&(e.text=va(e.text))})},quotations:function(e){e.forEach(e=>{e.post=e.post.replace(ka,""),e.pre=e.pre.replace(ka,"")})},adverbs:function(e){e.match("#Adverb").not("(not|nary|seldom|never|barely|almost|basically|so)").remove()},abbreviations:function(e){e.list.forEach(e=>{let t=e.terms();t.forEach((e,r)=>{!0===e.tags.Abbreviation&&t[r+1]&&(e.post=e.post.replace(/^\./,""))})})}},Da={whitespace:!0,unicode:!0,punctuation:!0,emoji:!0,acronyms:!0,abbreviations:!0,case:!1,contractions:!1,parentheses:!1,quotations:!1,adverbs:!1,possessives:!1,verbs:!1,nouns:!1,honorifics:!1},$a={light:{},medium:{case:!0,contractions:!0,parentheses:!0,quotations:!0,adverbs:!0}};$a.heavy=Object.assign({},$a.medium,{possessives:!0,verbs:!0,nouns:!0,honorifics:!0}),ya.normalize=function(e){"string"==typeof(e=e||{})&&(e=$a[e]||{}),e=Object.assign({},Da,e),this.uncache();let t=this.termList();return e.case&&this.toLowerCase(),e.whitespace&&Aa.whitespace(this),e.unicode&&Aa.unicode(t),e.punctuation&&Aa.punctuation(t),e.emoji&&this.remove("(#Emoji|#Emoticon)"),e.acronyms&&this.acronyms().strip(),e.abbreviations&&Aa.abbreviations(this),(e.contraction||e.contractions)&&this.contractions().expand(),e.parentheses&&this.parentheses().unwrap(),(e.quotations||e.quotes)&&Aa.quotations(t),e.adverbs&&Aa.adverbs(this),(e.possessive||e.possessives)&&this.possessives().strip(),e.verbs&&this.verbs().toInfinitive(),(e.nouns||e.plurals)&&this.nouns().toSingular(),e.honorifics&&this.remove("#Honorific"),this};var Pa={};!function(e){const t=Se;e.splitOn=function(e){if(!e){return this.parent().splitOn(this)}let r=t(e),a=[];return this.list.forEach(e=>{let t=e.match(r);if(0===t.length)return void a.push(e);let n=e;t.forEach(e=>{let t=n.splitOn(e);t.before&&a.push(t.before),t.match&&a.push(t.match),n=t.after}),n&&a.push(n)}),this.buildFrom(a)},e.splitAfter=function(e){if(!e){return this.parent().splitAfter(this)}let r=t(e),a=[];return this.list.forEach(e=>{let t=e.match(r);if(0===t.length)return void a.push(e);let n=e;t.forEach(e=>{let t=n.splitOn(e);t.before&&t.match?(t.before.length+=t.match.length,a.push(t.before)):t.match&&a.push(t.match),n=t.after}),n&&a.push(n)}),this.buildFrom(a)},e.split=e.splitAfter,e.splitBefore=function(e){if(!e){return this.parent().splitBefore(this)}let r=t(e),a=[];return this.list.forEach(e=>{let t=e.match(r);if(0===t.length)return void a.push(e);let n=e;t.forEach(e=>{let t=n.splitOn(e);t.before&&a.push(t.before),t.match&&t.after&&(t.match.length+=t.after.length),n=t.match}),n&&a.push(n)}),this.buildFrom(a)},e.segment=function(e,t){e=e||{},t=t||{text:!0};let r=this,a=Object.keys(e);return a.forEach(e=>{r=r.splitOn(e)}),r.list.forEach(t=>{for(let r=0;r<a.length;r+=1)if(t.has(a[r]))return void(t.segment=e[a[r]])}),r.list.map(e=>{let r=e.json(t);return r.segment=e.segment||null,r})}}(Pa);var Ea={};const Ha=function(e,t){let r=e.world;return e.list.forEach(e=>{e.terms().forEach(e=>e[t](r))}),e};Ea.toLowerCase=function(){return Ha(this,"toLowerCase")},Ea.toUpperCase=function(){return Ha(this,"toUpperCase")},Ea.toTitleCase=function(){return Ha(this,"toTitleCase")},Ea.toCamelCase=function(){return this.list.forEach(e=>{let t=e.terms();t.forEach((e,r)=>{0!==r&&e.toTitleCase(),r!==t.length-1&&(e.post="")})}),this};var ja={};!function(e){e.pre=function(e,t){return void 0===e?this.list[0].terms(0).pre:(this.list.forEach(r=>{let a=r.terms(0);!0===t?a.pre+=e:a.pre=e}),this)},e.post=function(e,t){return void 0===e?this.list.map(e=>{let t=e.terms();return t[t.length-1].post}):(this.list.forEach(r=>{let a=r.terms(),n=a[a.length-1];!0===t?n.post+=e:n.post=e}),this)},e.trim=function(){return this.list=this.list.map(e=>e.trim()),this},e.hyphenate=function(){return this.list.forEach(e=>{let t=e.terms();t.forEach((e,r)=>{0!==r&&(e.pre=""),t[r+1]&&(e.post="-")})}),this},e.dehyphenate=function(){const e=/(-|–|—)/;return this.list.forEach(t=>{t.terms().forEach(t=>{e.test(t.post)&&(t.post=" ")})}),this},e.deHyphenate=e.dehyphenate,e.toQuotations=function(e,t){return e=e||'"',t=t||'"',this.list.forEach(r=>{let a=r.terms();a[0].pre=e+a[0].pre;let n=a[a.length-1];n.post=t+n.post}),this},e.toQuotation=e.toQuotations,e.toParentheses=function(e,t){return e=e||"(",t=t||")",this.list.forEach(r=>{let a=r.terms();a[0].pre=e+a[0].pre;let n=a[a.length-1];n.post=t+n.post}),this}}(ja);var Na={join:function(e){this.uncache();let t=this.list[0],r=t.length,a={};for(let r=1;r<this.list.length;r++){const n=this.list[r];a[n.start]=!0;let i=t.lastTerm();e&&(i.post+=e),i.next=n.start,n.terms(0).prev=i.id,t.length+=n.length,t.cache={}}let n=t.length-r;return this.parents().forEach(e=>{e.list.forEach(e=>{let r=e.terms();for(let a=0;a<r.length;a++)if(r[a].id===t.start){e.length+=n;break}e.cache={}}),e.list=e.list.filter(e=>!0!==a[e.start])}),this.buildFrom([t])}},xa={};const Fa=/[,\)"';:\-–—\.…]/,Ca=function(e,t){if(!e.found)return;let r=e.termList();for(let e=0;e<r.length-1;e++){const t=r[e];if(Fa.test(t.post))return}r.forEach(e=>{e.implicit=e.clean}),r[0].text+=t,r.slice(1).forEach(e=>{e.text=""});for(let e=0;e<r.length-1;e++){const t=r[e];t.post=t.post.replace(/ /,"")}};xa.contract=function(){let e=this.not("@hasContraction"),t=e.match("(we|they|you) are");return Ca(t,"'re"),t=e.match("(he|she|they|it|we|you) will"),Ca(t,"'ll"),t=e.match("(he|she|they|it|we) is"),Ca(t,"'s"),t=e.match("#Person is"),Ca(t,"'s"),t=e.match("#Person would"),Ca(t,"'d"),t=e.match("(is|was|had|would|should|could|do|does|have|has|can) not"),Ca(t,"n't"),t=e.match("(i|we|they) have"),Ca(t,"'ve"),t=e.match("(would|should|could) have"),Ca(t,"'ve"),t=e.match("i am"),Ca(t,"'m"),t=e.match("going to"),this};var Ba=Object.assign({},Rr,Ur,Qr,Xr,ea,ta,aa,na,oa,sa,ua,ha,ma,ya,Pa,Ea,ja,Na,xa);let Ga={};[["terms","."],["hyphenated","@hasHyphen ."],["adjectives","#Adjective"],["hashTags","#HashTag"],["emails","#Email"],["emoji","#Emoji"],["emoticons","#Emoticon"],["atMentions","#AtMention"],["urls","#Url"],["adverbs","#Adverb"],["pronouns","#Pronoun"],["conjunctions","#Conjunction"],["prepositions","#Preposition"]].forEach(e=>{Ga[e[0]]=function(t){let r=this.match(e[1]);return"number"==typeof t&&(r=r.get(t)),r}}),Ga.emojis=Ga.emoji,Ga.atmentions=Ga.atMentions,Ga.words=Ga.terms,Ga.phoneNumbers=function(e){let t=this.splitAfter("@hasComma");return t=t.match("#PhoneNumber+"),"number"==typeof e&&(t=t.get(e)),t},Ga.money=function(e){let t=this.match("#Money #Currency?");return"number"==typeof e&&(t=t.get(e)),t},Ga.places=function(e){let t=this.match("(#City && @hasComma) (#Region|#Country)"),r=this.not(t).splitAfter("@hasComma");return r=r.concat(t),r.sort("index"),r=r.match("#Place+"),"number"==typeof e&&(r=r.get(e)),r},Ga.organizations=function(e){let t=this.clauses();return t=t.match("#Organization+"),"number"==typeof e&&(t=t.get(e)),t},Ga.entities=function(e){let t=this.clauses(),r=t.people();r=r.concat(t.places()),r=r.concat(t.organizations());return r=r.not(["someone","man","woman","mother","brother","sister","father"]),r.sort("sequence"),"number"==typeof e&&(r=r.get(e)),r},Ga.things=Ga.entities,Ga.topics=Ga.entities;var za=Ga;const Ia=/^(under|over)-?.{3}/,Oa=function(e,t,r){let a=r.words,n=e[t].reduced+" "+e[t+1].reduced;return void 0!==a[n]&&!0===a.hasOwnProperty(n)?(e[t].tag(a[n],"lexicon-two",r),e[t+1].tag(a[n],"lexicon-two",r),1):t+2<e.length&&(n+=" "+e[t+2].reduced,void 0!==a[n]&&!0===a.hasOwnProperty(n))?(e[t].tag(a[n],"lexicon-three",r),e[t+1].tag(a[n],"lexicon-three",r),e[t+2].tag(a[n],"lexicon-three",r),2):t+3<e.length&&(n+=" "+e[t+3].reduced,void 0!==a[n]&&!0===a.hasOwnProperty(n))?(e[t].tag(a[n],"lexicon-four",r),e[t+1].tag(a[n],"lexicon-four",r),e[t+2].tag(a[n],"lexicon-four",r),e[t+3].tag(a[n],"lexicon-four",r),3):0};var Ta=function(e,t){let r=t.words,a=t.hasCompound;for(let n=0;n<e.length;n+=1){let i=e[n].clean;if(!0===a[i]&&n+1<e.length){let r=Oa(e,n,t);if(r>0){n+=r;continue}}if(void 0===r[i]||!0!==r.hasOwnProperty(i))if(i===e[n].reduced||!0!==r.hasOwnProperty(e[n].reduced)){if(!0===Ia.test(i)){let a=i.replace(/^(under|over)-?/,"");!0===r.hasOwnProperty(a)&&e[n].tag(r[a],"noprefix-lexicon",t)}}else e[n].tag(r[e[n].reduced],"lexicon",t);else e[n].tag(r[i],"lexicon",t)}return e};const Va=/[\'‘’‛‵′`´]$/,Ma=/^(m|k|cm|km|m)\/(s|h|hr)$/;const Ja=[[/^[\w\.]+@[\w\.]+\.[a-z]{2,3}$/,"Email"],[/^#[a-z0-9_\u00C0-\u00FF]{2,}$/,"HashTag"],[/^@1?[0-9](am|pm)$/i,"Time"],[/^@1?[0-9]:[0-9]{2}(am|pm)?$/i,"Time"],[/^@\w{2,}$/,"AtMention"],[/^(https?:\/\/|www\.)+\w+\.[a-z]{2,3}/,"Url"],[/^[a-z0-9./].+\.(com|net|gov|org|ly|edu|info|biz|dev|ru|jp|de|in|uk|br|io|ai)/,"Url"],[/^'[0-9]{2}$/,"Year"],[/^[012]?[0-9](:[0-5][0-9])(:[0-5][0-9])$/,"Time"],[/^[012]?[0-9](:[0-5][0-9])?(:[0-5][0-9])? ?(am|pm)$/i,"Time"],[/^[012]?[0-9](:[0-5][0-9])(:[0-5][0-9])? ?(am|pm)?$/i,"Time"],[/^[PMCE]ST$/,"Time"],[/^utc ?[+-]?[0-9]+?$/,"Time"],[/^[a-z0-9]*? o\'?clock$/,"Time"],[/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/i,"Date"],[/^[0-9]{1,4}-[0-9]{1,2}-[0-9]{1,4}$/,"Date"],[/^[0-9]{1,4}\/[0-9]{1,2}\/[0-9]{1,4}$/,"Date"],[/^[0-9]{1,4}-[a-z]{2,9}-[0-9]{1,4}$/i,"Date"],[/^gmt[+-][0-9][0-9]?$/i,"Timezone"],[/^utc[+-][0-9][0-9]?$/i,"Timezone"],[/^ma?c\'.*/,"LastName"],[/^o\'[drlkn].*/,"LastName"],[/^ma?cd[aeiou]/,"LastName"],[/^(lol)+[sz]$/,"Expression"],[/^woo+a*?h?$/,"Expression"],[/^(un|de|re)\\-[a-z\u00C0-\u00FF]{2}/,"Verb"],[/^[0-9]{1,4}\.[0-9]{1,2}\.[0-9]{1,4}$/,"Date"],[/^[0-9]{3}-[0-9]{4}$/,"PhoneNumber"],[/^(\+?[0-9][ -])?[0-9]{3}[ -]?[0-9]{3}-[0-9]{4}$/,"PhoneNumber"],[/^[-+]?[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6][-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?(k|m|b|bn)?\+?$/,["Money","Value"]],[/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]\+?$/,["Money","Value"]],[/^[-+]?[\$£]?[0-9]([0-9,.])+?(usd|eur|jpy|gbp|cad|aud|chf|cny|hkd|nzd|kr|rub)$/i,["Money","Value"]],[/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?\+?$/,["Cardinal","NumericValue"]],[/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?(st|nd|rd|r?th)$/,["Ordinal","NumericValue"]],[/^\.[0-9]+\+?$/,["Cardinal","NumericValue"]],[/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?%\+?$/,["Percent","Cardinal","NumericValue"]],[/^\.[0-9]+%$/,["Percent","Cardinal","NumericValue"]],[/^[0-9]{1,4}\/[0-9]{1,4}(st|nd|rd|th)?s?$/,["Fraction","NumericValue"]],[/^[0-9.]{1,3}[a-z]{0,2}[-–—][0-9]{1,3}[a-z]{0,2}$/,["Value","NumberRange"]],[/^[0-9][0-9]?(:[0-9][0-9])?(am|pm)? ?[-–—] ?[0-9][0-9]?(:[0-9][0-9])?(am|pm)?$/,["Time","NumberRange"]],[/^[0-9.]+([a-z]{1,4})$/,"Value"]],La=/^[IVXLCDM]{2,}$/,Sa=/^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;const _a="Adjective",Ka="Infinitive",qa="PresentTense",Wa="Singular",Ra="PastTense",Ua="Adverb",Qa="Expression",Za="Actor",Xa="Verb",Ya="Noun",en="LastName";const tn="Adjective",rn="Infinitive",an="PresentTense",nn="Singular",on="PastTense",sn="Adverb",ln="Plural",un="Actor",cn="Verb",hn="Noun",dn="LastName",gn="Modal";const pn={a:[[/.[aeiou]na$/,Ya],[/.[oau][wvl]ska$/,en],[/.[^aeiou]ica$/,Wa],[/^([hyj]a)+$/,Qa]],c:[[/.[^aeiou]ic$/,_a]],d:[[/[aeiou](pp|ll|ss|ff|gg|tt|rr|bb|nn|mm)ed$/,Ra],[/.[aeo]{2}[bdgmnprvz]ed$/,Ra],[/.[aeiou][sg]hed$/,Ra],[/.[aeiou]red$/,Ra],[/.[aeiou]r?ried$/,Ra],[/.[bcdgtr]led$/,Ra],[/.[aoui]f?led$/,Ra],[/.[iao]sed$/,Ra],[/[aeiou]n?[cs]ed$/,Ra],[/[aeiou][rl]?[mnf]ed$/,Ra],[/[aeiou][ns]?c?ked$/,Ra],[/[aeiou][nl]?ged$/,Ra],[/.[tdbwxz]ed$/,Ra],[/[^aeiou][aeiou][tvx]ed$/,Ra],[/.[cdlmnprstv]ied$/,Ra],[/[^aeiou]ard$/,Wa],[/[aeiou][^aeiou]id$/,_a],[/.[vrl]id$/,_a]],e:[[/.[lnr]ize$/,Ka],[/.[^aeiou]ise$/,Ka],[/.[aeiou]te$/,Ka],[/.[^aeiou][ai]ble$/,_a],[/.[^aeiou]eable$/,_a],[/.[ts]ive$/,_a],[/[a-z]-like$/,_a]],h:[[/.[^aeiouf]ish$/,_a],[/.v[iy]ch$/,en],[/^ug?h+$/,Qa],[/^uh[ -]?oh$/,Qa],[/[a-z]-ish$/,_a]],i:[[/.[oau][wvl]ski$/,en]],k:[[/^(k){2}$/,Qa]],l:[[/.[gl]ial$/,_a],[/.[^aeiou]ful$/,_a],[/.[nrtumcd]al$/,_a],[/.[^aeiou][ei]al$/,_a]],m:[[/.[^aeiou]ium$/,Wa],[/[^aeiou]ism$/,Wa],[/^h*u*m+$/,Qa],[/^\d+ ?[ap]m$/,"Date"]],n:[[/.[lsrnpb]ian$/,_a],[/[^aeiou]ician$/,Za],[/[aeiou][ktrp]in$/,"Gerund"]],o:[[/^no+$/,Qa],[/^(yo)+$/,Qa],[/^woo+[pt]?$/,Qa]],r:[[/.[bdfklmst]ler$/,"Noun"],[/[aeiou][pns]er$/,Wa],[/[^i]fer$/,Ka],[/.[^aeiou][ao]pher$/,Za],[/.[lk]er$/,"Noun"],[/.ier$/,"Comparative"]],t:[[/.[di]est$/,"Superlative"],[/.[icldtgrv]ent$/,_a],[/[aeiou].*ist$/,_a],[/^[a-z]et$/,Xa]],s:[[/.[^aeiou]ises$/,qa],[/.[rln]ates$/,qa],[/.[^z]ens$/,Xa],[/.[lstrn]us$/,Wa],[/.[aeiou]sks$/,qa],[/.[aeiou]kes$/,qa],[/[aeiou][^aeiou]is$/,Wa],[/[a-z]\'s$/,Ya],[/^yes+$/,Qa]],v:[[/.[^aeiou][ai][kln]ov$/,en]],y:[[/.[cts]hy$/,_a],[/.[st]ty$/,_a],[/.[gk]y$/,_a],[/.[tnl]ary$/,_a],[/.[oe]ry$/,Wa],[/[rdntkbhs]ly$/,Ua],[/...lly$/,Ua],[/[bszmp]{2}y$/,_a],[/.(gg|bb|zz)ly$/,_a],[/.[ai]my$/,_a],[/[ea]{2}zy$/,_a],[/.[^aeiou]ity$/,Wa]]},mn=[null,null,{ea:nn,ia:hn,ic:tn,ly:sn,"'n":cn,"'t":cn},{oed:on,ued:on,xed:on," so":sn,"'ll":gn,"'re":"Copula",azy:tn,eer:hn,end:cn,ped:on,ffy:tn,ify:rn,ing:"Gerund",ize:rn,lar:tn,mum:tn,nes:an,nny:tn,oid:tn,ous:tn,que:tn,rol:nn,sis:nn,zes:an},{amed:on,aped:on,ched:on,lked:on,nded:on,cted:on,dged:on,akis:dn,cede:rn,chuk:dn,czyk:dn,ects:an,ends:cn,enko:dn,ette:nn,fies:an,fore:sn,gate:rn,gone:tn,ices:ln,ints:ln,ines:ln,ions:ln,less:sn,llen:tn,made:tn,nsen:dn,oses:an,ould:gn,some:tn,sson:dn,tage:rn,teen:"Value",tion:nn,tive:tn,tors:hn,vice:nn},{tized:on,urned:on,eased:on,ances:ln,bound:tn,ettes:ln,fully:sn,ishes:an,ities:ln,marek:dn,nssen:dn,ology:hn,ports:ln,rough:tn,tches:an,tieth:"Ordinal",tures:ln,wards:sn,where:sn},{auskas:dn,keeper:un,logist:un,teenth:"Value"},{opoulos:dn,borough:"Place",sdottir:dn}];const fn=/^(\u00a9|\u00ae|[\u2319-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/,bn={":(":!0,":)":!0,":P":!0,":p":!0,":O":!0,":3":!0,":|":!0,":/":!0,":\\":!0,":$":!0,":*":!0,":@":!0,":-(":!0,":-)":!0,":-P":!0,":-p":!0,":-O":!0,":-3":!0,":-|":!0,":-/":!0,":-\\":!0,":-$":!0,":-*":!0,":-@":!0,":^(":!0,":^)":!0,":^P":!0,":^p":!0,":^O":!0,":^3":!0,":^|":!0,":^/":!0,":^\\":!0,":^$":!0,":^*":!0,":^@":!0,"):":!0,"(:":!0,"$:":!0,"*:":!0,")-:":!0,"(-:":!0,"$-:":!0,"*-:":!0,")^:":!0,"(^:":!0,"$^:":!0,"*^:":!0,"<3":!0,"</3":!0,"<\\3":!0};const yn={lexicon:Ta,punctuation:function(e,t,r){let a=e[t];if(Va.test(a.text)&&!Va.test(a.pre)&&!Va.test(a.post)&&a.clean.length>2){let e=a.clean[a.clean.length-2];if("s"===e)return void a.tag(["Possessive","Noun"],"end-tick",r);"n"===e&&a.tag(["Gerund"],"chillin",r)}Ma.test(a.text)&&a.tag("Unit","per-sec",r)},regex:function(e,t){let r=e.text;for(let a=0;a<Ja.length;a+=1)if(!0===Ja[a][0].test(r)){e.tagSafe(Ja[a][1],"prefix #"+a,t);break}e.text.length>=2&&La.test(r)&&Sa.test(r)&&e.tag("RomanNumeral","xvii",t)},suffix:function(e,t){!function(e,t){const r=e.clean.length;let a=7;r<=a&&(a=r-1);for(let n=a;n>1;n-=1){let a=e.clean.substr(r-n,r);if(!0===mn[a.length].hasOwnProperty(a)){let r=mn[a.length][a];e.tagSafe(r,"suffix -"+a,t);break}}}(e,t),function(e,t){let r=e.clean,a=r[r.length-1];if(!0===pn.hasOwnProperty(a)){let n=pn[a];for(let i=0;i<n.length;i+=1)if(!0===n[i][0].test(r)){e.tagSafe(n[i][1],`endReg ${a} #${i}`,t);break}}}(e,t)},emoji:(e,t)=>{let r=e.pre+e.text+e.post;var a;r=r.trim(),r=r.replace(/[.!?,]$/,""),!0===(e=>!(":"!==e.charAt(0)||null===e.match(/:.?$/)||e.match(" ")||e.length>35))(r)&&(e.tag("Emoji","comma-emoji",t),e.text=r,e.pre=e.pre.replace(":",""),e.post=e.post.replace(":","")),e.text.match(fn)&&(e.tag("Emoji","unicode-emoji",t),e.text=r),!0===(a=(a=r).replace(/^[:;]/,":"),bn.hasOwnProperty(a))&&(e.tag("Emoticon","emoticon-emoji",t),e.text=r)}};var vn=function(e,t){let r=e.world;yn.lexicon(t,r);for(let e=0;e<t.length;e+=1){let a=t[e];yn.punctuation(t,e,r),yn.regex(a,r),yn.suffix(a,r),yn.emoji(a,r)}return e};const wn={beforeThisWord:{there:"Verb",me:"Verb",man:"Adjective",only:"Verb",him:"Verb",were:"Noun",took:"Noun",himself:"Verb",went:"Noun",who:"Noun",jr:"Person"},afterThisWord:{i:"Verb",first:"Noun",it:"Verb",there:"Verb",not:"Verb",because:"Noun",if:"Noun",but:"Noun",who:"Verb",this:"Noun",his:"Noun",when:"Noun",you:"Verb",very:"Adjective",old:"Noun",never:"Verb",before:"Noun"},beforeThisPos:{Copula:"Noun",PastTense:"Noun",Conjunction:"Noun",Modal:"Noun",Pluperfect:"Noun",PerfectTense:"Verb"},afterThisPos:{Adjective:"Noun",Possessive:"Noun",Determiner:"Noun",Adverb:"Verb",Pronoun:"Verb",Value:"Noun",Ordinal:"Noun",Modal:"Verb",Superlative:"Noun",Demonym:"Noun",Honorific:"Person"}},kn=Object.keys(wn.afterThisPos),An=Object.keys(wn.beforeThisPos);var Dn=function(e,t){for(let r=0;r<e.length;r+=1){let a=e[r];if(!0===a.isKnown())continue;let n=e[r-1];if(n){if(!0===wn.afterThisWord.hasOwnProperty(n.clean)){let e=wn.afterThisWord[n.clean];a.tag(e,"after-"+n.clean,t);continue}let e=kn.find(e=>n.tags[e]);if(void 0!==e){let r=wn.afterThisPos[e];a.tag(r,"after-"+e,t);continue}}let i=e[r+1];if(i){if(!0===wn.beforeThisWord.hasOwnProperty(i.clean)){let e=wn.beforeThisWord[i.clean];a.tag(e,"before-"+i.clean,t);continue}let e=An.find(e=>i.tags[e]);if(void 0!==e){let r=wn.beforeThisPos[e];a.tag(r,"before-"+e,t);continue}}}};const $n=/^[A-Z][a-z'\u00C0-\u00FF]/,Pn=/[0-9]/;var En=function(e){let t=e.world;e.list.forEach(e=>{let r=e.terms();for(let e=1;e<r.length;e++){const a=r[e];!0===$n.test(a.text)&&!1===Pn.test(a.text)&&void 0===a.tags.Date&&a.tag("ProperNoun","titlecase-noun",t)}})};const Hn=/^(re|un)-?[a-z\u00C0-\u00FF]/,jn=/^(re|un)-?/;var Nn=function(e,t){let r=t.words;e.forEach(e=>{if(!0!==e.isKnown()&&!0===Hn.test(e.clean)){let a=e.clean.replace(jn,"");a&&a.length>3&&void 0!==r[a]&&!0===r.hasOwnProperty(a)&&e.tag(r[a],"stem-"+a,t)}})};const xn=["Uncountable","Pronoun","Place","Value","Person","Month","WeekDay","Holiday"],Fn={isSingular:[/(ax|test)is$/i,/(octop|vir|radi|nucle|fung|cact|stimul)us$/i,/(octop|vir)i$/i,/(rl)f$/i,/(alias|status)$/i,/(bu)s$/i,/(al|ad|at|er|et|ed|ad)o$/i,/(ti)um$/i,/(ti)a$/i,/sis$/i,/(?:(^f)fe|(lr)f)$/i,/hive$/i,/s[aeiou]+ns$/i,/(^aeiouy|qu)y$/i,/(x|ch|ss|sh|z)$/i,/(matr|vert|ind|cort)(ix|ex)$/i,/(m|l)ouse$/i,/(m|l)ice$/i,/(antenn|formul|nebul|vertebr|vit)a$/i,/.sis$/i,/^(?!talis|.*hu)(.*)man$/i],isPlural:[/(^v)ies$/i,/ises$/i,/ives$/i,/(antenn|formul|nebul|vertebr|vit)ae$/i,/(octop|vir|radi|nucle|fung|cact|stimul)i$/i,/(buffal|tomat|tornad)oes$/i,/(analy|ba|diagno|parenthe|progno|synop|the)ses$/i,/(vert|ind|cort)ices$/i,/(matr|append)ices$/i,/(x|ch|ss|sh|s|z|o)es$/i,/is$/i,/men$/i,/news$/i,/.tia$/i,/(^f)ves$/i,/(lr)ves$/i,/(^aeiouy|qu)ies$/i,/(m|l)ice$/i,/(cris|ax|test)es$/i,/(alias|status)es$/i,/ics$/i]},Cn=[/ss$/,/sis$/,/[^aeiou][uo]s$/,/'s$/],Bn=[/i$/,/ae$/];var Gn=function(e,t){if(e.tags.Noun&&!e.tags.Acronym){let r=e.clean;if(e.tags.Singular||e.tags.Plural)return;if(r.length<=3)return void e.tag("Singular","short-singular",t);if(xn.find(t=>e.tags[t]))return;if(Fn.isPlural.find(e=>e.test(r)))return void e.tag("Plural","plural-rules",t);if(Fn.isSingular.find(e=>e.test(r)))return void e.tag("Singular","singular-rules",t);if(!0===/s$/.test(r)){if(Cn.find(e=>e.test(r)))return;return void e.tag("Plural","plural-fallback",t)}if(Bn.find(e=>e.test(r)))return;e.tag("Singular","singular-fallback",t)}};let zn=["academy","administration","agence","agences","agencies","agency","airlines","airways","army","assoc","associates","association","assurance","authority","autorite","aviation","bank","banque","board","boys","brands","brewery","brotherhood","brothers","building society","bureau","cafe","caisse","capital","care","cathedral","center","central bank","centre","chemicals","choir","chronicle","church","circus","clinic","clinique","club","co","coalition","coffee","collective","college","commission","committee","communications","community","company","comprehensive","computers","confederation","conference","conseil","consulting","containers","corporation","corps","corp","council","crew","daily news","data","departement","department","department store","departments","design","development","directorate","division","drilling","education","eglise","electric","electricity","energy","ensemble","enterprise","enterprises","entertainment","estate","etat","evening news","faculty","federation","financial","fm","foundation","fund","gas","gazette","girls","government","group","guild","health authority","herald","holdings","hospital","hotel","hotels","inc","industries","institut","institute","institute of technology","institutes","insurance","international","interstate","investment","investments","investors","journal","laboratory","labs","liberation army","limited","local authority","local health authority","machines","magazine","management","marine","marketing","markets","media","memorial","mercantile exchange","ministere","ministry","military","mobile","motor","motors","musee","museum","news","news service","observatory","office","oil","optical","orchestra","organization","partners","partnership","people's party","petrol","petroleum","pharmacare","pharmaceutical","pharmaceuticals","pizza","plc","police","polytechnic","post","power","press","productions","quartet","radio","regional authority","regional health authority","reserve","resources","restaurant","restaurants","savings","school","securities","service","services","social club","societe","society","sons","standard","state police","state university","stock exchange","subcommittee","syndicat","systems","telecommunications","telegraph","television","times","tribunal","tv","union","university","utilities","workers"].reduce((function(e,t){return e[t]="Noun",e}),{});const In=function(e){return!!e.tags.Noun&&(!(e.tags.Pronoun||e.tags.Comma||e.tags.Possessive)&&!!(e.tags.Organization||e.tags.Acronym||e.tags.Place||e.titleCase()))};const On=/^[A-Z]('s|,)?$/,Tn=/([A-Z]\.){2}[A-Z]?/i,Vn={I:!0,A:!0};const Mn={neighbours:Dn,case:En,stem:Nn,plural:Gn,organizations:function(e,t){for(let r=0;r<e.length;r+=1){let a=e[r];if(void 0!==zn[a.clean]&&!0===zn.hasOwnProperty(a.clean)){let n=e[r-1];if(void 0!==n&&!0===In(n)){n.tagSafe("Organization","org-word-1",t),a.tagSafe("Organization","org-word-2",t);continue}let i=e[r+1];if(void 0!==i&&"of"===i.clean&&e[r+2]&&In(e[r+2])){a.tagSafe("Organization","org-of-word-1",t),i.tagSafe("Organization","org-of-word-2",t),e[r+2].tagSafe("Organization","org-of-word-3",t);continue}}}},acronyms:function(e,t){e.forEach(e=>{!0!==e.tags.RomanNumeral&&(!0===Tn.test(e.text)&&e.tag("Acronym","period-acronym",t),e.isUpperCase()&&function(e,t){let r=e.reduced;return!!e.tags.Acronym||!t.words[r]&&!(r.length>5)&&e.isAcronym()}(e,t)?(e.tag("Acronym","acronym-step",t),e.tag("Noun","acronym-infer",t)):!Vn.hasOwnProperty(e.text)&&On.test(e.text)&&(e.tag("Acronym","one-letter-acronym",t),e.tag("Noun","one-letter-infer",t)),e.tags.Organization&&e.text.length<=3&&e.tag("Acronym","acronym-org",t),e.tags.Organization&&e.isUpperCase()&&e.text.length<=6&&e.tag("Acronym","acronym-org-case",t))})}};var Jn=function(e,t){let r=e.world;return Mn.neighbours(t,r),Mn.case(e),Mn.stem(t,r),t.forEach(t=>{!1===t.isKnown()&&t.tag("Noun","noun-fallback",e.world)}),Mn.organizations(t,r),Mn.acronyms(t,r),t.forEach(t=>{Mn.plural(t,e.world)}),e};const Ln=/n't$/,Sn={"won't":["will","not"],wont:["will","not"],"can't":["can","not"],cant:["can","not"],cannot:["can","not"],"shan't":["should","not"],dont:["do","not"],dun:["do","not"]};const _n=/([a-z\u00C0-\u00FF]+)[\u0027\u0060\u00B4\u2018\u2019\u201A\u201B\u2032\u2035\u2039\u203A]([a-z]{1,2})$/i,Kn={ll:"will",ve:"have",re:"are",m:"am","n't":"not"};const qn={wanna:["want","to"],gonna:["going","to"],im:["i","am"],alot:["a","lot"],ive:["i","have"],imma:["I","will"],"where'd":["where","did"],whered:["where","did"],"when'd":["when","did"],whend:["when","did"],howd:["how","did"],whatd:["what","did"],dunno:["do","not","know"],brb:["be","right","back"],gtg:["got","to","go"],irl:["in","real","life"],tbh:["to","be","honest"],imo:["in","my","opinion"],til:["today","i","learned"],rn:["right","now"],twas:["it","was"],"@":["at"]};const Wn=/([a-z\u00C0-\u00FF]+)[\u0027\u0060\u00B4\u2018\u2019\u201A\u201B\u2032\u2035\u2039\u203A]s$/i,Rn={that:!0,there:!0},Un={here:!0,there:!0,everywhere:!0};const Qn=/[a-z\u00C0-\u00FF]'d$/,Zn={how:!0,what:!0};const Xn=/^([0-9.]{1,3}[a-z]{0,2}) ?[-–—] ?([0-9]{1,3}[a-z]{0,2})$/i,Yn=/^([0-9][0-9]?(:[0-9][0-9])?(am|pm)?) ?[-–—] ?([0-9][0-9]?(:[0-9][0-9])?(am|pm)?)$/i;const ei=/^(l|c|d|j|m|n|qu|s|t)[\u0027\u0060\u00B4\u2018\u2019\u201A\u201B\u2032\u2035\u2039\u203A]([a-z\u00C0-\u00FF]+)$/i,ti={l:"le",c:"ce",d:"de",j:"je",m:"me",n:"ne",qu:"que",s:"se",t:"tu"};const ri=Ta,ai=Nt,ni=function(e,t){if(!0===Sn.hasOwnProperty(e.clean))return Sn[e.clean];if("ain't"===e.clean||"aint"===e.clean)return function(e,t){let r=t.terms(),a=r.indexOf(e),n=r.slice(0,a).find(e=>e.tags.Noun);return n&&n.tags.Plural?["are","not"]:["is","not"]}(e,t);if(!0===Ln.test(e.clean)){return[e.clean.replace(Ln,""),"not"]}return null},ii=function(e){let t=e.text.match(_n);return null===t?null:Kn.hasOwnProperty(t[2])?[t[1],Kn[t[2]]]:null},oi=function(e){return qn.hasOwnProperty(e.clean)?qn[e.clean]:null},si=function(e,t,r){let a=e.text.match(Wn);if(null!==a){if(!0===((e,t)=>{if(e.tags.Possessive)return!0;if(e.tags.Pronoun||e.tags.QuestionWord)return!1;if(Rn.hasOwnProperty(e.reduced))return!1;let r=t.get(e.next);if(!r)return!0;if(r.tags.Verb)return!!r.tags.Infinitive||!!r.tags.PresentTense;if(r.tags.Noun)return!0!==Un.hasOwnProperty(r.reduced);let a=t.get(r.next);return!(!a||!a.tags.Noun||a.tags.Pronoun)||(r.tags.Adjective||r.tags.Adverb||r.tags.Verb,!1)})(e,t.pool))return e.tag("#Possessive","isPossessive",r),null;if(null!==a)return((e,t)=>{let r=t.terms(),a=r.indexOf(e);return r.slice(a+1,a+3).find(e=>e.tags.PastTense)})(e,t)?[a[1],"has"]:[a[1],"is"]}return null},li=function(e,t){if(Qn.test(e.clean)){let r=e.clean.replace(/'d$/,""),a=t.terms(),n=a.indexOf(e),i=a.slice(n+1,n+4);for(let e=0;e<i.length;e++){let t=i[e];if(t.tags.Verb)return t.tags.PastTense?[r,"had"]:!0===Zn[r]?[r,"did"]:[r,"would"]}return[r,"would"]}return null},ui=function(e){if(!0===e.tags.PhoneNumber)return null;let t=e.text.match(Xn);return null!==t?[t[1],"to",t[2]]:(t=e.text.match(Yn),null!==t?[t[1],"to",t[4]]:null)},ci=function(e){let t=e.text.match(ei);if(null===t||!1===ti.hasOwnProperty(t[1]))return null;let r=[ti[t[1]],t[2]];return r[0]&&r[1]?r:null},hi=/^[0-9]+$/,di=/^[0-9]+(st|nd|rd|th)$/,gi=/^[0-9:]+(am|pm)?$/,pi=function(e,t){let r=ai(e.join(" "),t.world,t.pool())[0],a=r.terms();ri(a,t.world);let n=a[0];return di.test(n.text)?(a[0].tag("Ordinal","ord-range",t.world),a[2].tag("Ordinal","ord-range",t.world)):hi.test(n.text)?(a[0].tag("Cardinal","num-range",t.world),a[2].tag("Cardinal","num-range",t.world)):gi.test(n.text)&&(a[0].tag("Time","time-range",t.world),a[1].tag("Date","time-range",t.world),a[2].tag("Time","time-range",t.world)),a.forEach(e=>{e.implicit=e.text,e.text="",e.clean="",e.pre="",e.post="",0===Object.keys(e.tags).length&&(e.tags.Noun=!0)}),r};var mi=function(e){let t=e.world;return e.list.forEach(r=>{let a=r.terms();for(let n=0;n<a.length;n+=1){let i=a[n],o=ni(i,r);if(o=o||ii(i),o=o||oi(i),o=o||si(i,r,t),o=o||li(i,r),o=o||ui(i),o=o||ci(i),null!==o){let t=pi(o,e);!0===r.has("#NumberRange")&&e.buildFrom([t]).tag("NumberRange"),t.terms(0).text=i.text,r.buildFrom(i.id,1,e.pool()).replace(t,e,!0)}}}),e};const fi=function(e,t){let r=e._cache.tags[t]||[];return r=r.map(t=>e.list[t]),e.buildFrom(r)};var bi=function(e){let t=fi(e,"Infinitive");return t.found&&(t=t.ifNo("@hasQuestionMark"),t=t.ifNo("(i|we|they)"),t.not("will be").match("[#Infinitive] (#Determiner|#Possessive) #Noun").notIf("(our|their)").match("#Infinitive").tag("Imperative","shut-the"),t.match("^[#Infinitive] #Adverb?$",0).tag("Imperative","go-fast"),t.match("[(do && #Infinitive)] not? #Verb",0).tag("Imperative","do-not"),t.match("[#Infinitive] (it|some) (#Comparative|#Preposition|please|now|again)",0).tag("Imperative","do-it")),t=function(e,t){let r=e._cache.words[t]||[];return r=r.map(t=>e.list[t]),e.buildFrom(r)}(e,"like"),t.match("#Adverb like").notIf("(really|generally|typically|usually|sometimes|often|just) [like]").tag("Adverb","adverb-like"),t=fi(e,"Adjective"),t.match("#Determiner #Adjective$").notIf("(#Comparative|#Superlative)").terms(1).tag("Noun","the-adj-1"),t=fi(e,"FirstName"),t.match("#FirstName (#Noun|@titleCase)").ifNo("^#Possessive").ifNo("(#Pronoun|#Plural)").ifNo("@hasComma .").lastTerm().tag("#LastName","firstname-noun"),t=fi(e,"Value"),t=t.match("#Value #PresentTense").ifNo("#Copula"),t.found&&(!0===t.has("(one|1)")?t.terms(1).tag("Singular","one-presentTense"):t.terms(1).tag("Plural","value-presentTense")),e.match("^(well|so|okay)").tag("Expression","well-"),e.match("#Value [of a second]",0).unTag("Value","of-a-second"),e.match("#Value [seconds]",0).unTag("Value","30-seconds").tag(["Unit","Plural"]),t=fi(e,"Gerund"),t.match("(be|been) (#Adverb|not)+? #Gerund").not("#Verb$").tag("Auxiliary","be-walking"),e.match("(try|use|attempt|build|make) #Verb").ifNo("(@hasComma|#Negative|#PhrasalVerb|#Copula|will|be)").lastTerm().tag("#Noun","do-verb"),t=fi(e,"Possessive"),t=t.match("#Possessive [#Infinitive]",0),t.lookBehind("(let|made|make|force|ask)").found||t.tag("Noun","her-match"),e};var yi=function(e){let t={};for(let r=0;r<e.length;r++)t[e[r]]=!0;return Object.keys(t)};var vi=[{match:"too much",tag:"Adverb Adjective",reason:"bit-4"},{match:"u r",tag:"Pronoun Copula",reason:"u r"},{match:"#Copula (pretty|dead|full|well|sure) (#Adjective|#Noun)",tag:"#Copula #Adverb #Adjective",reason:"sometimes-adverb"},{match:"(#Pronoun|#Person) (had|#Adverb)? [better] #PresentTense",group:0,tag:"Modal",reason:"i-better"},{match:"[#Gerund] #Adverb? not? #Copula",group:0,tag:"Activity",reason:"gerund-copula"},{match:"[#Gerund] #Modal",group:0,tag:"Activity",reason:"gerund-modal"},{match:"holy (shit|fuck|hell)",tag:"Expression",reason:"swears-expression"},{match:"#Noun #Actor",tag:"Actor",reason:"thing-doer"},{match:"#Conjunction [u]",group:0,tag:"Pronoun",reason:"u-pronoun-2"},{match:"[u] #Verb",group:0,tag:"Pronoun",reason:"u-pronoun-1"},{match:"#Noun [(who|whom)]",group:0,tag:"Determiner",reason:"captain-who"},{match:"a bit much",tag:"Determiner Adverb Adjective",reason:"bit-3"},{match:"#Verb #Adverb? #Noun [(that|which)]",group:0,tag:"Preposition",reason:"that-prep"},{match:"@hasComma [which] (#Pronoun|#Verb)",group:0,tag:"Preposition",reason:"which-copula"},{match:"#Copula just [like]",group:0,tag:"Preposition",reason:"like-preposition"},{match:"#Noun [like] #Noun",group:0,tag:"Preposition",reason:"noun-like"},{match:"[had] #Noun+ #PastTense",group:0,tag:"Condition",reason:"had-he"},{match:"[were] #Noun+ to #Infinitive",group:0,tag:"Condition",reason:"were-he"},{match:"^how",tag:"QuestionWord",reason:"how-question"},{match:"[how] (#Determiner|#Copula|#Modal|#PastTense)",group:0,tag:"QuestionWord",reason:"how-is"},{match:"^which",tag:"QuestionWord",reason:"which-question"},{match:"[so] #Noun",group:0,tag:"Conjunction",reason:"so-conj"},{match:"[(who|what|where|why|how|when)] #Noun #Copula #Adverb? (#Verb|#Adjective)",group:0,tag:"Conjunction",reason:"how-he-is-x"}],wi={adverbAdjective:["dark","bright","flat","light","soft","pale","dead","dim","faux","little","wee","sheer","most","near","good","extra","all"],personDate:["april","june","may","jan","august","eve"],personMonth:["january","april","may","june","jan","sep"],personAdjective:["misty","rusty","dusty","rich","randy","young"],personVerb:["pat","wade","ollie","will","rob","buck","bob","mark","jack"],personPlace:["darwin","hamilton","paris","alexandria","houston","kobe","santiago","salvador","sydney","victoria"],personNoun:["art","baker","berg","bill","brown","charity","chin","christian","cliff","daisy","dawn","dick","dolly","faith","franco","gene","green","hall","hill","holly","hope","jean","jewel","joy","kelvin","king","kitty","lane","lily","melody","mercedes","miles","olive","penny","ray","reed","robin","rod","rose","sky","summer","trinity","van","viola","violet","wang","white"]};const ki=`(${wi.personDate.join("|")})`;var Ai=[{match:"#Holiday (day|eve)",tag:"Holiday",reason:"holiday-day"},{match:"[sun] the #Ordinal",tag:"WeekDay",reason:"sun-the-5th"},{match:"[sun] #Date",group:0,tag:"WeekDay",reason:"sun-feb"},{match:"#Date (on|this|next|last|during)? [sun]",group:0,tag:"WeekDay",reason:"1pm-sun"},{match:"(in|by|before|during|on|until|after|of|within|all) [sat]",group:0,tag:"WeekDay",reason:"sat"},{match:"(in|by|before|during|on|until|after|of|within|all) [wed]",group:0,tag:"WeekDay",reason:"wed"},{match:"(in|by|before|during|on|until|after|of|within|all) [march]",group:0,tag:"Month",reason:"march"},{match:"[sat] #Date",group:0,tag:"WeekDay",reason:"sat-feb"},{match:"#Preposition [(march|may)]",group:0,tag:"Month",reason:"in-month"},{match:"this [(march|may)]",group:0,tag:"Month",reason:"this-month"},{match:"next [(march|may)]",group:0,tag:"Month",reason:"this-month"},{match:"last [(march|may)]",group:0,tag:"Month",reason:"this-month"},{match:"[(march|may)] the? #Value",group:0,tag:"Month",reason:"march-5th"},{match:"#Value of? [(march|may)]",group:0,tag:"Month",reason:"5th-of-march"},{match:"[(march|may)] .? #Date",group:0,tag:"Month",reason:"march-and-feb"},{match:"#Date .? [(march|may)]",group:0,tag:"Month",reason:"feb-and-march"},{match:"#Adverb [(march|may)]",group:0,tag:"Verb",reason:"quickly-march"},{match:"[(march|may)] #Adverb",group:0,tag:"Verb",reason:"march-quickly"},{match:"#Value of #Month",tag:"Date",reason:"value-of-month"},{match:"#Cardinal #Month",tag:"Date",reason:"cardinal-month"},{match:"#Month #Value to #Value",tag:"Date",reason:"value-to-value"},{match:"#Month the #Value",tag:"Date",reason:"month-the-value"},{match:"(#WeekDay|#Month) #Value",tag:"Date",reason:"date-value"},{match:"#Value (#WeekDay|#Month)",tag:"Date",reason:"value-date"},{match:"(#TextValue && #Date) #TextValue",tag:"Date",reason:"textvalue-date"},{match:`in [${ki}]`,group:0,tag:"Date",reason:"in-june"},{match:`during [${ki}]`,group:0,tag:"Date",reason:"in-june"},{match:`on [${ki}]`,group:0,tag:"Date",reason:"in-june"},{match:`by [${ki}]`,group:0,tag:"Date",reason:"by-june"},{match:`after [${ki}]`,group:0,tag:"Date",reason:"after-june"},{match:`#Date [${ki}]`,group:0,tag:"Date",reason:"in-june"},{match:ki+" #Value",tag:"Date",reason:"june-5th"},{match:ki+" #Date",tag:"Date",reason:"june-5th"},{match:ki+" #ProperNoun",tag:"Person",reason:"june-smith",safe:!0},{match:ki+" #Acronym? (#ProperNoun && !#Month)",tag:"Person",reason:"june-smith-jr"},{match:"#Cardinal [second]",tag:"Unit",reason:"one-second"},{match:"#Month #NumberRange",tag:"Date",reason:"aug 20-21"},{match:"(#Place|#Demonmym|#Time) (standard|daylight|central|mountain)? time",tag:"Timezone",reason:"std-time"},{match:"(eastern|mountain|pacific|central|atlantic) (standard|daylight|summer)? time",tag:"Timezone",reason:"eastern-time"},{match:"#Time [(eastern|mountain|pacific|central|est|pst|gmt)]",group:0,tag:"Timezone",reason:"5pm-central"},{match:"(central|western|eastern) european time",tag:"Timezone",reason:"cet"}];const Di=`(${wi.personAdjective.join("|")})`;var $i=[{match:"[all] #Determiner? #Noun",group:0,tag:"Adjective",reason:"all-noun"},{match:`#Adverb [${Di}]`,group:0,tag:"Adjective",reason:"really-rich"},{match:Di+" #Person",tag:"Person",reason:"randy-smith"},{match:Di+" #Acronym? #ProperNoun",tag:"Person",reason:"rusty-smith"},{match:"#Copula [(just|alone)]$",group:0,tag:"Adjective",reason:"not-adverb"},{match:"#Singular is #Adverb? [#PastTense$]",group:0,tag:"Adjective",reason:"is-filled"},{match:"[#PastTense] #Singular is",group:0,tag:"Adjective",reason:"smoked-poutine"},{match:"[#PastTense] #Plural are",group:0,tag:"Adjective",reason:"baked-onions"},{match:"well [#PastTense]",group:0,tag:"Adjective",reason:"well-made"},{match:"#Copula [fucked up?]",tag:"Adjective",reason:"swears-adjective"},{match:"#Singular (seems|appears) #Adverb? [#PastTense$]",group:0,tag:"Adjective",reason:"seems-filled"},{match:"(a|an) [#Gerund]",group:0,tag:"Adjective",reason:"a|an"},{match:"as [#Gerund] as",group:0,tag:"Adjective",reason:"as-gerund-as"},{match:"more [#Gerund] than",group:0,tag:"Adjective",reason:"more-gerund-than"},{match:"(so|very|extremely) [#Gerund]",group:0,tag:"Adjective",reason:"so-gerund"},{match:"(it|he|she|everything|something) #Adverb? was #Adverb? [#Gerund]",group:0,tag:"Adjective",reason:"it-was-gerund"},{match:"(found|found) it #Adverb? [#Gerund]",group:0,tag:"Adjective",reason:"found-it-gerund"},{match:"a (little|bit|wee) bit? [#Gerund]",group:0,tag:"Adjective",reason:"a-bit-gerund"},{match:"#Copula #Adjective? [(out|in|through)]$",group:0,tag:"Adjective",reason:"still-out"},{match:"^[#Adjective] (the|your) #Noun",group:0,tag:"Infinitive",reason:"shut-the"},{match:"the [said] #Noun",group:0,tag:"Adjective",reason:"the-said-card"},{match:"#Noun (that|which|whose) [#PastTense && !#Copula] #Noun",group:0,tag:"Adjective",reason:"that-past-noun"}],Pi=[{match:"there (are|were) #Adjective? [#PresentTense]",group:0,tag:"Plural",reason:"there-are"},{match:"#Determiner [sun]",group:0,tag:"Singular",reason:"the-sun"},{match:"#Verb (a|an) [#Value]",group:0,tag:"Singular",reason:"did-a-value"},{match:"the [(can|will|may)]",group:0,tag:"Singular",reason:"the can"},{match:"#FirstName #Acronym? (#Possessive && #LastName)",tag:"Possessive",reason:"name-poss"},{match:"#Organization+ #Possessive",tag:"Possessive",reason:"org-possessive"},{match:"#Place+ #Possessive",tag:"Possessive",reason:"place-possessive"},{match:"(#Verb && !#Modal) (all|every|each|most|some|no) [#PresentTense]",group:0,tag:"Noun",reason:"all-presentTense"},{match:"#Determiner [#Adjective] #Copula",group:0,tag:"Noun",reason:"the-adj-is"},{match:"#Adjective [#Adjective] #Copula",group:0,tag:"Noun",reason:"adj-adj-is"},{match:"(had|have|#PastTense) #Adjective [#PresentTense]",group:0,tag:"Noun",reason:"adj-presentTense"},{match:"^#Adjective [#PresentTense]",group:0,tag:"Noun",reason:"start adj-presentTense"},{match:"#Value #Adjective [#PresentTense]",group:0,tag:"Noun",reason:"one-big-reason"},{match:"#PastTense #Adjective+ [#PresentTense]",group:0,tag:"Noun",reason:"won-wide-support"},{match:"(many|few|several|couple) [#PresentTense]",group:0,tag:"Noun",reason:"many-poses"},{match:"#Adverb #Adjective [#PresentTense]",group:0,tag:"Noun",reason:"very-big-dream"},{match:"#Adjective [#Infinitive] #Noun",group:0,tag:"Noun",reason:"good-wait-staff"},{match:"#Adjective #Adjective [#PresentTense]",group:0,tag:"Noun",reason:"adorable-little-store"},{match:"#Preposition #Adjective [#PresentTense]",group:0,tag:"Noun",reason:"of-basic-training"},{match:"#Adjective [#Gerund]",group:0,tag:"Noun",reason:"early-warning"},{match:"#Gerund #Adverb? #Comparative [#PresentTense]",group:0,tag:"Noun",reason:"higher-costs"},{match:"#Infinitive (this|that|the) [#Infinitive]",group:0,tag:"Noun",reason:"do-this-dance"},{match:"(his|her|its) [#Adjective]",group:0,tag:"Noun",reason:"his-fine"},{match:"some [#Verb] #Plural",group:0,tag:"Noun",reason:"determiner6"},{match:"more #Noun",tag:"Noun",reason:"more-noun"},{match:"(#Noun && @hasComma) #Noun (and|or) [#PresentTense]",group:0,tag:"Noun",reason:"noun-list"},{match:"(right|rights) of .",tag:"Noun",reason:"right-of"},{match:"a [bit]",group:0,tag:"Noun",reason:"bit-2"},{match:"#Possessive #Ordinal [#PastTense]",group:0,tag:"Noun",reason:"first-thought"},{match:"#Gerund #Determiner [#Infinitive]",group:0,tag:"Noun",reason:"running-a-show"},{match:"#Determiner #Adverb [#Infinitive]",group:0,tag:"Noun",reason:"the-reason"},{match:"(the|this|those|these) #Adjective [#Verb]",group:0,tag:"Noun",reason:"the-adj-verb"},{match:"(the|this|those|these) #Adverb #Adjective [#Verb]",group:0,tag:"Noun",reason:"determiner4"},{match:"#Determiner [#Adjective] (#Copula|#PastTense|#Auxiliary)",group:0,tag:"Noun",reason:"the-adj-2"},{match:"(the|this|a|an) [#Infinitive] #Adverb? #Verb",group:0,tag:"Noun",reason:"determiner5"},{match:"#Determiner [#Infinitive] #Noun",group:0,tag:"Noun",reason:"determiner7"},{match:"#Determiner #Adjective #Adjective? [#Infinitive]",group:0,tag:"Noun",reason:"a-nice-inf"},{match:"the [#Verb] #Preposition .",group:0,tag:"Noun",reason:"determiner1"},{match:"#Determiner [#Verb] of",group:0,tag:"Noun",reason:"the-verb-of"},{match:"#Adjective #Noun+ [#Infinitive] #Copula",group:0,tag:"Noun",reason:"career-move"},{match:"#Determiner #Noun of [#Verb]",group:0,tag:"Noun",reason:"noun-of-noun"},{match:"#Determiner [(western|eastern|northern|southern|central)] #Noun",group:0,tag:"Noun",reason:"western-line"},{match:"#Possessive [#Gerund]",group:0,tag:"Noun",reason:"her-polling"},{match:"(his|her|its) [#PresentTense]",group:0,tag:"Noun",reason:"its-polling"},{match:"(#Determiner|#Value) [(linear|binary|mobile|lexical|technical|computer|scientific|formal)] #Noun",group:0,tag:"Noun",reason:"technical-noun"},{match:"(the|those|these|a|an) [#Participle] #Noun",group:0,tag:"Adjective",reason:"blown-motor"},{match:"(the|those|these|a|an) #Adjective? [#Infinitive]",group:0,tag:"Noun",reason:"det-inf"},{match:"(the|those|these|a|an) #Adjective? [#PresentTense]",group:0,tag:"Noun",reason:"det-pres"},{match:"(the|those|these|a|an) #Adjective? [#PastTense]",group:0,tag:"Noun",reason:"det-past"},{match:"(this|that) [#Gerund]",group:0,tag:"Noun",reason:"this-gerund"},{match:"at some [#Infinitive]",group:0,tag:"Noun",reason:"at-some-inf"},{match:"(#Noun && @hasHyphen) #Verb",tag:"Noun",reason:"hyphen-verb"},{match:"is no [#Verb]",group:0,tag:"Noun",reason:"is-no-verb"},{match:"[#Verb] than",group:0,tag:"Noun",reason:"correction"},{match:"(go|goes|went) to [#Infinitive]",group:0,tag:"Noun",reason:"goes-to-verb"},{match:"(a|an) #Noun [#Infinitive] (#Preposition|#Noun)",group:0,tag:"Noun",reason:"a-noun-inf"},{match:"(a|an) #Noun [#Infinitive]$",group:0,tag:"Noun",reason:"a-noun-inf2"},{match:"do [so]",group:0,tag:"Noun",reason:"so-noun"},{match:"#Copula [#Infinitive] #Noun",group:0,tag:"Noun",reason:"is-pres-noun"},{match:"#Determiner #Adverb? [close]",group:0,tag:"Adjective",reason:"a-close"},{match:"#Determiner [(shit|damn|hell)]",group:0,tag:"Noun",reason:"swears-noun"},{match:"(the|these) [#Singular] (were|are)",group:0,tag:"Plural",reason:"singular-were"},{match:"#Gerund #Adjective? for [#Infinitive]",group:0,tag:"Noun",reason:"running-for"},{match:"#Gerund #Adjective to [#Infinitive]",group:0,tag:"Noun",reason:"running-to"},{match:"(many|any|some|several) [#PresentTense] for",group:0,tag:"Noun",reason:"any-verbs-for"},{match:"(have|had) [#Adjective] #Preposition .",group:0,tag:"Noun",reason:"have-fun"},{match:"co #Noun",tag:"Actor",reason:"co-noun"},{match:"to #PresentTense #Noun [#PresentTense] #Preposition",group:0,tag:"Noun",reason:"gas-exchange"},{match:"a #Noun+ or #Adverb+? [#Verb]",group:0,tag:"Noun",reason:"noun-or-noun"},{match:"[#Gerund] system",group:0,tag:"Noun",reason:"operating-system"},{match:"#PastTense (until|as|through|without) [#PresentTense]",group:0,tag:"Noun",reason:"waited-until-release"},{match:"#Gerund like #Adjective? [#PresentTense]",group:0,tag:"Plural",reason:"like-hot-cakes"},{match:"some #Adjective [#PresentTense]",group:0,tag:"Noun",reason:"some-reason"},{match:"for some [#PresentTense]",group:0,tag:"Noun",reason:"for-some-reason"},{match:"(same|some|the|that|a) kind of [#PresentTense]",group:0,tag:"Noun",reason:"some-kind-of"},{match:"(same|some|the|that|a) type of [#PresentTense]",group:0,tag:"Noun",reason:"some-type-of"},{match:"#Gerund #Adjective #Preposition [#PresentTense]",group:0,tag:"Noun",reason:"doing-better-for-x"},{match:"(get|got|have|had) #Comparative [#PresentTense]",group:0,tag:"Noun",reason:"got-better-aim"},{match:"#Pronoun #Infinitive [#Gerund] #PresentTense",group:0,tag:"Noun",reason:"tipping-sucks"}];var Ei=[{match:"[still] #Adjective",group:0,tag:"Adverb",reason:"still-advb"},{match:"[still] #Verb",group:0,tag:"Adverb",reason:"still-verb"},{match:"[so] #Adjective",group:0,tag:"Adverb",reason:"so-adv"},{match:"[way] #Comparative",group:0,tag:"Adverb",reason:"way-adj"},{match:"[way] #Adverb #Adjective",group:0,tag:"Adverb",reason:"way-too-adj"},{match:"[all] #Verb",group:0,tag:"Adverb",reason:"all-verb"},{match:"(#Verb && !#Modal) [like]",group:0,tag:"Adverb",reason:"verb-like"},{match:"(barely|hardly) even",tag:"Adverb",reason:"barely-even"},{match:"[even] #Verb",group:0,tag:"Adverb",reason:"even-walk"},{match:"even left",tag:"#Adverb #Verb",reason:"even-left"},{match:"(#PresentTense && !#Copula) [(hard|quick|long|bright|slow|fast|backwards|forwards)]",group:0,tag:"Adverb",reason:"lazy-ly"},{match:"[much] #Adjective",group:0,tag:"Adverb",reason:"bit-1"},{match:"#Copula [#Adverb]$",group:0,tag:"Adjective",reason:"is-well"},{match:"a [(little|bit|wee) bit?] #Adjective",group:0,tag:"Adverb",reason:"a-bit-cold"},{match:`[${`(${wi.adverbAdjective.join("|")})`}] #Adjective`,group:0,tag:"Adverb",reason:"dark-green"},{match:"#Adverb [#Adverb]$",group:0,tag:"Adjective",reason:"kinda-sparkly"},{match:"#Adverb [#Adverb] (and|or|then)",group:0,tag:"Adjective",reason:"kinda-sparkly-and"},{match:"[super] #Adjective #Noun",group:0,tag:"Adverb",reason:"super-strong"}],Hi=[{match:"1 #Value #PhoneNumber",tag:"PhoneNumber",reason:"1-800-Value"},{match:"#NumericValue #PhoneNumber",tag:"PhoneNumber",reason:"(800) PhoneNumber"},{match:"#Demonym #Currency",tag:"Currency",reason:"demonym-currency"},{match:"[second] #Noun",group:0,tag:"Ordinal",reason:"second-noun"},{match:"#Value+ [#Currency]",group:0,tag:"Unit",reason:"5-yan"},{match:"#Value [(foot|feet)]",group:0,tag:"Unit",reason:"foot-unit"},{match:"(minus|negative) #Value",tag:"Value",reason:"minus-value"},{match:"#Value [#Abbreviation]",group:0,tag:"Unit",reason:"value-abbr"},{match:"#Value [k]",group:0,tag:"Unit",reason:"value-k"},{match:"#Unit an hour",tag:"Unit",reason:"unit-an-hour"},{match:"#Value (point|decimal) #Value",tag:"Value",reason:"value-point-value"},{match:"(#Value|a) [(buck|bucks|grand)]",group:0,tag:"Currency",reason:"value-bucks"},{match:"#Determiner [(half|quarter)] #Ordinal",group:0,tag:"Value",reason:"half-ordinal"},{match:"a #Value",tag:"Value",reason:"a-value"},{match:"[#Value+] #Currency",group:0,tag:"Money",reason:"15 usd"},{match:"(hundred|thousand|million|billion|trillion|quadrillion)+ and #Value",tag:"Value",reason:"magnitude-and-value"},{match:"!once [(a|an)] (#Duration|hundred|thousand|million|billion|trillion)",group:0,tag:"Value",reason:"a-is-one"}];const ji=`(${wi.personVerb.join("|")})`;var Ni=[{match:"[#Adjective] #Possessive #Noun",group:0,tag:"Verb",reason:"gerund-his-noun"},{match:"[#Adjective] (us|you)",group:0,tag:"Gerund",reason:"loving-you"},{match:"(slowly|quickly) [#Adjective]",group:0,tag:"Gerund",reason:"slowly-adj"},{match:"(#Modal|i|they|we|do) not? [like]",group:0,tag:"PresentTense",reason:"modal-like"},{match:"do (simply|just|really|not)+ [(#Adjective|like)]",group:0,tag:"Verb",reason:"do-simply-like"},{match:"does (#Adverb|not)? [#Adjective]",group:0,tag:"PresentTense",reason:"does-mean"},{match:"i (#Adverb|do)? not? [mean]",group:0,tag:"PresentTense",reason:"i-mean"},{match:"#Noun #Adverb? [left]",group:0,tag:"PastTense",reason:"left-verb"},{match:"(this|that) [#Plural]",group:0,tag:"PresentTense",reason:"this-verbs"},{match:"[#Copula (#Adverb|not)+?] (#Gerund|#PastTense)",group:0,tag:"Auxiliary",reason:"copula-walking"},{match:"[(has|had) (#Adverb|not)+?] #PastTense",group:0,tag:"Auxiliary",reason:"had-walked"},{match:"#Adverb+? [(#Modal|did)+ (#Adverb|not)+?] #Verb",group:0,tag:"Auxiliary",reason:"modal-verb"},{match:"[#Modal (#Adverb|not)+? have (#Adverb|not)+? had (#Adverb|not)+?] #Verb",group:0,tag:"Auxiliary",reason:"would-have"},{match:"[(has|had) (#Adverb|not)+?] #PastTense",group:0,tag:"Auxiliary",reason:"had-walked"},{match:"[(do|does|will|have|had)] (not|#Adverb)+? #Verb",group:0,tag:"Auxiliary",reason:"have-had"},{match:"[about to] #Adverb? #Verb",group:0,tag:["Auxiliary","Verb"],reason:"about-to"},{match:"#Modal (#Adverb|not)+? be (#Adverb|not)+? #Verb",group:0,tag:"Auxiliary",reason:"would-be"},{match:"(were|was) being [#PresentTense]",group:0,tag:"PastTense",reason:"was-being"},{match:"[#Modal (#Adverb|not)+? have (#Adverb|not)+? had (#Adverb|not)+?] #Verb",group:0,tag:"Auxiliary",reason:"would-have"},{match:"(#Modal|had|has) (#Adverb|not)+? been (#Adverb|not)+? #Verb",group:0,tag:"Auxiliary",reason:"had-been"},{match:"[(be|being|been)] #Participle",group:0,tag:"Auxiliary",reason:"being-foo"},{match:"(#Verb && @hasHyphen) up",tag:"PhrasalVerb",reason:"foo-up"},{match:"(#Verb && @hasHyphen) off",tag:"PhrasalVerb",reason:"foo-off"},{match:"(#Verb && @hasHyphen) over",tag:"PhrasalVerb",reason:"foo-over"},{match:"(#Verb && @hasHyphen) out",tag:"PhrasalVerb",reason:"foo-out"},{match:"#PhrasalVerb [#PhrasalVerb]",group:0,tag:"Particle",reason:"phrasal-particle"},{match:"(lived|went|crept|go) [on] for",group:0,tag:"PhrasalVerb",reason:"went-on"},{match:"#Verb (him|her|it|us|himself|herself|itself|everything|something) [(up|down)]",group:0,tag:"Adverb",reason:"phrasal-pronoun-advb"},{match:"[will #Adverb? not? #Adverb? be] #Gerund",group:0,tag:"Copula",reason:"will-be-copula"},{match:"will #Adverb? not? #Adverb? [be] #Adjective",group:0,tag:"Copula",reason:"be-copula"},{match:"[march] (up|down|back|to|toward)",group:0,tag:"Infinitive",reason:"march-to"},{match:"#Modal [march]",group:0,tag:"Infinitive",reason:"must-march"},{match:"(let|make|made) (him|her|it|#Person|#Place|#Organization)+ [#Singular] (a|an|the|it)",group:0,tag:"Infinitive",reason:"let-him-glue"},{match:"will [#Adjective]",group:0,tag:"Verb",reason:"will-adj"},{match:"#Pronoun [#Adjective] #Determiner #Adjective? #Noun",group:0,tag:"Verb",reason:"he-adj-the"},{match:"#Copula [#Adjective] to #Verb",group:0,tag:"Verb",reason:"adj-to"},{match:"[open] #Determiner",group:0,tag:"Infinitive",reason:"open-the"},{match:"[#PresentTense] (are|were|was) #Adjective",group:0,tag:"Plural",reason:"compromises-are-possible"},{match:`#Modal [${ji}]`,group:0,tag:"Verb",reason:"would-mark"},{match:`#Adverb [${ji}]`,group:0,tag:"Verb",reason:"really-mark"},{match:"(to|#Modal) [mark]",group:0,tag:"PresentTense",reason:"to-mark"},{match:"^[#Infinitive] (is|was)",group:0,tag:"Noun",reason:"checkmate-is"},{match:ji+" #Person",tag:"Person",reason:"rob-smith"},{match:ji+" #Acronym #ProperNoun",tag:"Person",reason:"rob-a-smith"},{match:"[shit] (#Determiner|#Possessive|them)",group:0,tag:"Verb",reason:"swear1-verb"},{match:"[damn] (#Determiner|#Possessive|them)",group:0,tag:"Verb",reason:"swear2-verb"},{match:"[fuck] (#Determiner|#Possessive|them)",group:0,tag:"Verb",reason:"swear3-verb"},{match:"(become|fall|grow) #Adverb? [#PastTense]",group:0,tag:"Adjective",reason:"overly-weakened"},{match:"(a|an) #Adverb [#Participle] #Noun",group:0,tag:"Adjective",reason:"completely-beaten"},{match:"whose [#PresentTense] #Copula",group:0,tag:"Noun",reason:"whos-name-was"},{match:"#PhrasalVerb #PhrasalVerb #Preposition [#PresentTense]",group:0,tag:"Noun",reason:"given-up-on-x"}];var xi=[{match:"(west|north|south|east|western|northern|southern|eastern)+ #Place",tag:"Region",reason:"west-norfolk"},{match:"#City [(al|ak|az|ar|ca|ct|dc|fl|ga|id|il|nv|nh|nj|ny|oh|pa|sc|tn|tx|ut|vt|pr)]",group:0,tag:"Region",reason:"us-state"},{match:"portland [or]",group:0,tag:"Region",reason:"portland-or"},{match:"#ProperNoun+ (district|region|province|county|prefecture|municipality|territory|burough|reservation)",tag:"Region",reason:"foo-district"},{match:"(district|region|province|municipality|territory|burough|state) of #ProperNoun",tag:"Region",reason:"district-of-Foo"},{match:"in [#ProperNoun] #Place",group:0,tag:"Place",reason:"propernoun-place"},{match:"#Value #Noun (st|street|rd|road|crescent|cr|way|tr|terrace|avenue|ave)",tag:"Address",reason:"address-st"}];const Fi=wi,Ci=`(${Fi.personNoun.join("|")})`,Bi=`(${Fi.personMonth.join("|")})`;var Gi=[{match:"[(1st|2nd|first|second)] #Honorific",group:0,tag:"Honorific",reason:"ordinal-honorific"},{match:"[(private|general|major|corporal|lord|lady|secretary|premier)] #Honorific? #Person",group:0,tag:"Honorific",reason:"ambg-honorifics"},{match:"#Copula [(#Noun|#PresentTense)] #LastName",group:0,tag:"FirstName",reason:"copula-noun-lastname"},{match:"(lady|queen|sister) #ProperNoun",tag:"FemaleName",reason:"lady-titlecase",safe:!0},{match:"(king|pope|father) #ProperNoun",tag:"MaleName",reason:"pope-titlecase",safe:!0},{match:"[(will|may|april|june|said|rob|wade|ray|rusty|drew|miles|jack|chuck|randy|jan|pat|cliff|bill)] #LastName",group:0,tag:"FirstName",reason:"maybe-lastname"},{match:"#FirstName [#Determiner #Noun] #LastName",group:0,tag:"NickName",reason:"first-noun-last"},{match:"#Possessive [#FirstName]",group:0,tag:"Person",reason:"possessive-name"},{match:"#ProperNoun (b|c|d|e|f|g|h|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z) #ProperNoun",tag:"Person",reason:"titlecase-acronym-titlecase",safe:!0},{match:"#Acronym #LastName",tag:"Person",reason:"acronym-latname",safe:!0},{match:"#Person (jr|sr|md)",tag:"Person",reason:"person-honorific"},{match:"#Person #Person the? #RomanNumeral",tag:"Person",reason:"roman-numeral"},{match:"#FirstName [/^[^aiurck]$/]",group:0,tag:["Acronym","Person"],reason:"john-e"},{match:"#Honorific #Person",tag:"Person",reason:"honorific-person"},{match:"#Honorific #Acronym",tag:"Person",reason:"Honorific-TitleCase"},{match:"#Noun van der? #Noun",tag:"Person",reason:"van der noun",safe:!0},{match:"(king|queen|prince|saint|lady) of #Noun",tag:"Person",reason:"king-of-noun",safe:!0},{match:"(prince|lady) #Place",tag:"Person",reason:"lady-place"},{match:"(king|queen|prince|saint) #ProperNoun",tag:"Person",reason:"saint-foo"},{match:"[#ProperNoun] #Person",group:0,tag:"Person",reason:"proper-person",safe:!0},{match:"al (#Person|#ProperNoun)",tag:"Person",reason:"al-borlen",safe:!0},{match:"#FirstName de #Noun",tag:"Person",reason:"bill-de-noun"},{match:"#FirstName (bin|al) #Noun",tag:"Person",reason:"bill-al-noun"},{match:"#FirstName #Acronym #ProperNoun",tag:"Person",reason:"bill-acronym-title"},{match:"#FirstName #FirstName #ProperNoun",tag:"Person",reason:"bill-firstname-title"},{match:"#Honorific #FirstName? #ProperNoun",tag:"Person",reason:"dr-john-Title"},{match:"#FirstName the #Adjective",tag:"Person",reason:"name-the-great"},{match:"#FirstName (green|white|brown|hall|young|king|hill|cook|gray|price)",tag:"Person",reason:"bill-green"},{match:Ci+" #Person",tag:"Person",reason:"ray-smith",safe:!0},{match:Ci+" #Acronym? #ProperNoun",tag:"Person",reason:"ray-a-smith",safe:!0},{match:`#Infinitive #Determiner? #Adjective? #Noun? (to|for) [${Bi}]`,group:0,tag:"Person",reason:"ambig-person"},{match:`#Infinitive [${Bi}]`,group:0,tag:"Person",reason:"infinitive-person"},{match:`[${Bi}] #Modal`,group:0,tag:"Person",reason:"ambig-modal"},{match:"[may] be",group:0,tag:"Verb",reason:"may-be"},{match:`#Modal [${Bi}]`,group:0,tag:"Person",reason:"modal-ambig"},{match:`#Copula [${Bi}]`,group:0,tag:"Person",reason:"is-may"},{match:`[${Bi}] #Copula`,group:0,tag:"Person",reason:"may-is"},{match:`that [${Bi}]`,group:0,tag:"Person",reason:"that-month"},{match:`with [${Bi}]`,group:0,tag:"Person",reason:"with-month"},{match:`for [${Bi}]`,group:0,tag:"Person",reason:"for-month"},{match:`this [${Bi}]`,group:0,tag:"Month",reason:"this-may"},{match:`next [${Bi}]`,group:0,tag:"Month",reason:"next-may"},{match:`last [${Bi}]`,group:0,tag:"Month",reason:"last-may"},{match:`#Date [${Bi}]`,group:0,tag:"Month",reason:"date-may"},{match:`[${Bi}] the? #Value`,group:0,tag:"Month",reason:"may-5th"},{match:`#Value of [${Bi}]`,group:0,tag:"Month",reason:"5th-of-may"},{match:"#ProperNoun (van|al|bin) #ProperNoun",tag:"Person",reason:"title-van-title",safe:!0},{match:"#ProperNoun (de|du) la? #ProperNoun",tag:"Person",reason:"title-de-title",safe:!0},{match:"#Singular #Acronym #LastName",tag:"#Person",reason:"title-acro-noun",safe:!0},{match:"#FirstName (#Noun && #ProperNoun) #ProperNoun?",tag:"Person",reason:"firstname-titlecase"},{match:"#FirstName #Acronym #Noun",tag:"Person",reason:"n-acro-noun",safe:!0},{match:"#FirstName [(de|di|du|van|von) #Person]",group:0,tag:"LastName",reason:"de-firstname"},{match:`[${`(${Fi.personPlace.join("|")})`}] (#ProperNoun && !#Place)`,group:0,tag:"FirstName",reason:"place-firstname"}];const zi=Se,Ii=yi;let Oi=[];Oi=Oi.concat(vi),Oi=Oi.concat(Ai),Oi=Oi.concat($i),Oi=Oi.concat(Pi),Oi=Oi.concat(Ei),Oi=Oi.concat(Hi),Oi=Oi.concat(Ni),Oi=Oi.concat(xi),Oi=Oi.concat([{match:"#Noun (&|n) #Noun",tag:"Organization",reason:"Noun-&-Noun"},{match:"#Organization of the? #ProperNoun",tag:"Organization",reason:"org-of-place",safe:!0},{match:"#Organization #Country",tag:"Organization",reason:"org-country"},{match:"#ProperNoun #Organization",tag:"Organization",reason:"titlecase-org"},{match:"#ProperNoun (ltd|co|inc|dept|assn|bros)",tag:"Organization",reason:"org-abbrv"},{match:"the [#Acronym]",group:0,tag:"Organization",reason:"the-acronym",safe:!0},{match:"(world|global|international|national|#Demonym) #Organization",tag:"Organization",reason:"global-org"},{match:"#Noun+ (public|private) school",tag:"School",reason:"noun-public-school"}]),Oi=Oi.concat(Gi);let Ti=[];Oi.forEach(e=>{e.reg=zi(e.match);let t=function(e){let t=[];if(1===e.reg.filter(e=>void 0!==e.fastOr).length){let r=e.reg.findIndex(e=>void 0!==e.fastOr);Object.keys(e.reg[r].fastOr).forEach(a=>{let n=Object.assign({},e);n.reg=n.reg.slice(0),n.reg[r]=Object.assign({},n.reg[r]),n.reg[r].word=a,delete n.reg[r].operator,delete n.reg[r].fastOr,t.push(n)})}return t}(e);t.length>0?Ti=Ti.concat(t):Ti.push(e)}),Ti.forEach(e=>(e.required=function(e){let t=[],r=[];return e.forEach(e=>{!0!==e.optional&&!0!==e.negative&&(void 0!==e.tag&&t.push(e.tag),void 0!==e.word&&r.push(e.word))}),{tags:Ii(t),words:Ii(r)}}(e.reg),e));const Vi=Ti,Mi=yi;const Ji=bi,Li=function(e){Vi.forEach(t=>{let r=[];t.required.words.forEach(t=>{r.push(e._cache.words[t]||[])}),t.required.tags.forEach(t=>{r.push(e._cache.tags[t]||[])});let a=function(e){if(0===e.length)return[];let t={};e.forEach(e=>{e=Mi(e);for(let r=0;r<e.length;r++)t[e[r]]=t[e[r]]||0,t[e[r]]+=1});let r=Object.keys(t);return r=r.filter(r=>t[r]===e.length),r=r.map(e=>Number(e)),r}(r);if(0===a.length)return;let n=a.map(t=>e.list[t]),i=e.buildFrom(n).match(t.reg,t.group);i.found&&(!0===t.safe?i.tagSafe(t.tag,t.reason):i.tag(t.tag,t.reason))})};const Si=vn,_i=Jn,Ki=mi,qi=function(e){return Li(e),Ji(e),e};var Wi=function(e){let t=e.termList();return e=Si(e,t),e=_i(e,t),(e=Ki(e)).cache(),(e=qi(e)).uncache(),e.world.taggers.forEach(t=>{t(e)}),e};var Ri=function(e){class t extends e{stripPeriods(){return this.termList().forEach(e=>{!0===e.tags.Abbreviation&&e.next&&(e.post=e.post.replace(/^\./,""));let t=e.text.replace(/\./,"");e.set(t)}),this}addPeriods(){return this.termList().forEach(e=>{e.post=e.post.replace(/^\./,""),e.post="."+e.post}),this}}return t.prototype.unwrap=t.prototype.stripPeriods,e.prototype.abbreviations=function(e){let r=this.match("#Abbreviation");return"number"==typeof e&&(r=r.get(e)),new t(r.list,this,this.world)},e};const Ui=/\./;var Qi=function(e){class t extends e{stripPeriods(){return this.termList().forEach(e=>{let t=e.text.replace(/\./g,"");e.set(t)}),this}addPeriods(){return this.termList().forEach(e=>{let t=e.text.replace(/\./g,"");t=t.split("").join("."),!1===Ui.test(e.post)&&(t+="."),e.set(t)}),this}}return t.prototype.unwrap=t.prototype.stripPeriods,t.prototype.strip=t.prototype.stripPeriods,e.prototype.acronyms=function(e){let r=this.match("#Acronym");return"number"==typeof e&&(r=r.get(e)),new t(r.list,this,this.world)},e};var Zi=function(e){return e.prototype.clauses=function(t){let r=this.if("@hasComma").notIf("@hasComma @hasComma").notIf("@hasComma . .? (and|or) .").notIf("(#City && @hasComma) #Country").notIf("(#WeekDay && @hasComma) #Date").notIf("(#Date && @hasComma) #Year").notIf("@hasComma (too|also)$").match("@hasComma"),a=this.splitAfter(r),n=a.quotations();a=a.splitOn(n);let i=a.parentheses();a=a.splitOn(i);let o=a.if("#Copula #Adjective #Conjunction (#Pronoun|#Determiner) #Verb").match("#Conjunction");a=a.splitBefore(o);let s=a.if("if .{2,9} then .").match("then");a=a.splitBefore(s),a=a.splitBefore("as well as ."),a=a.splitBefore("such as ."),a=a.splitBefore("in addition to ."),a=a.splitAfter("@hasSemicolon"),a=a.splitAfter("@hasDash");let l=a.filter(e=>e.wordCount()>5&&e.match("#Verb+").length>=2);if(l.found){let e=l.splitAfter("#Noun .* #Verb .* #Noun+");a=a.splitOn(e.eq(0))}return"number"==typeof t&&(a=a.get(t)),new e(a.list,this,this.world)},e};var Xi=function(e){class t extends e{constructor(e,t,r){super(e,t,r),this.contracted=null}expand(){return this.list.forEach(e=>{let t=e.terms(),r=t[0].isTitleCase();t.forEach((e,r)=>{e.set(e.implicit||e.text),e.implicit=void 0,r<t.length-1&&""===e.post&&(e.post+=" ")}),r&&t[0].toTitleCase()}),this}}return e.prototype.contractions=function(e){let r=this.match("@hasContraction+");return"number"==typeof e&&(r=r.get(e)),new t(r.list,this,this.world)},e.prototype.expanded=e.prototype.isExpanded,e.prototype.contracted=e.prototype.isContracted,e};var Yi=function(e){const t=function(e){let t=e.splitAfter("@hasComma").splitOn("(and|or) not?").not("(and|or) not?"),r=e.match("[.] (and|or)",0);return{things:t,conjunction:e.match("(and|or) not?"),beforeLast:r,hasOxford:r.has("@hasComma")}};class r extends e{conjunctions(){return this.match("(and|or)")}parts(){return this.splitAfter("@hasComma").splitOn("(and|or) not?")}items(){return t(this).things}add(e){return this.forEach(r=>{let a=t(r).beforeLast;a.append(e),a.termList(0).addPunctuation(",")}),this}remove(e){return this.items().if(e).remove()}hasOxfordComma(){return this.filter(e=>t(e).hasOxford)}addOxfordComma(){let e=this.items(),t=e.eq(e.length-2);return t.found&&!1===t.has("@hasComma")&&t.post(", "),this}removeOxfordComma(){let e=this.items(),t=e.eq(e.length-2);return t.found&&!0===t.has("@hasComma")&&t.post(" "),this}}return r.prototype.things=r.prototype.items,e.prototype.lists=function(e){let t=this.if("@hasComma+ .? (and|or) not? ."),a=t.match("(#Noun|#Adjective|#Determiner|#Article)+ #Conjunction not? (#Article|#Determiner)? #Adjective? #Noun+").if("#Noun"),n=t.match("(#Adjective|#Adverb)+ #Conjunction not? #Adverb? #Adjective+"),i=t.match("(#Verb|#Adverb)+ #Conjunction not? #Adverb? #Verb+"),o=a.concat(n);return o=o.concat(i),o=o.if("@hasComma"),"number"==typeof e&&(o=t.get(e)),new r(o.list,this,this.world)},e};const eo={hour:"an",heir:"an",heirloom:"an",honest:"an",honour:"an",honor:"an",uber:"an"},to={a:!0,e:!0,f:!0,h:!0,i:!0,l:!0,m:!0,n:!0,o:!0,r:!0,s:!0,x:!0},ro=[/^onc?e/i,/^u[bcfhjkqrstn][aeiou]/i,/^eul/i];const ao={isSingular:[/(ax|test)is$/i,/(octop|vir|radi|nucle|fung|cact|stimul)us$/i,/(octop|vir)i$/i,/(rl)f$/i,/(alias|status)$/i,/(bu)s$/i,/(al|ad|at|er|et|ed|ad)o$/i,/(ti)um$/i,/(ti)a$/i,/sis$/i,/(?:(^f)fe|(lr)f)$/i,/hive$/i,/(^aeiouy|qu)y$/i,/(x|ch|ss|sh|z)$/i,/(matr|vert|ind|cort)(ix|ex)$/i,/(m|l)ouse$/i,/(m|l)ice$/i,/(antenn|formul|nebul|vertebr|vit)a$/i,/.sis$/i,/^(?!talis|.*hu)(.*)man$/i],isPlural:[/(antenn|formul|nebul|vertebr|vit)ae$/i,/(octop|vir|radi|nucle|fung|cact|stimul)i$/i,/men$/i,/.tia$/i,/(m|l)ice$/i]},no=/s$/;const io={he:"his",she:"hers",they:"theirs",we:"ours",i:"mine",you:"yours",her:"hers",their:"theirs",our:"ours",my:"mine",your:"yours"};const oo=function(e){return!0===e.has("#Plural")||!0!==e.has("(#Pronoun|#Place|#Value|#Person|#Uncountable|#Month|#WeekDay|#Holiday|#Possessive)")},so=function(e){if(e.has("#Person")||e.has("#Place"))return"";if(e.has("#Plural"))return"the";let t=e.text("normal").trim();if(eo.hasOwnProperty(t))return eo[t];let r=t.substr(0,1);if(e.has("^@isAcronym")&&to.hasOwnProperty(r))return"an";for(let e=0;e<ro.length;e++)if(ro[e].test(t))return"a";return/^[aeiou]/i.test(t)?"an":"a"},lo=function(e){return!ao.isSingular.find(t=>t.test(e))&&(!0===no.test(e)||(!!ao.isPlural.find(t=>t.test(e))||null))},uo=function(e){let t=e.text("text").trim();return io.hasOwnProperty(t)?(e.replaceWith(io[t],!0),void e.tag("Possessive","toPossessive")):/s$/.test(t)?(t+="'",e.replaceWith(t,!0),void e.tag("Possessive","toPossessive")):(t+="'s",e.replaceWith(t,!0),void e.tag("Possessive","toPossessive"))},co=function(e){let t={main:e};if(e.has("#Noun (of|by|for) .")){let r=e.splitAfter("[#Noun+]",0);t.main=r.eq(0),t.post=r.eq(1)}return t};const ho={json:function(e){let t=null;"number"==typeof e&&(t=e,e=null),e=e||{text:!0,normal:!0,trim:!0,terms:!0};let r=[];return this.forEach(t=>{let a=t.json(e)[0];a.article=so(t),r.push(a)}),null!==t?r[t]:r},adjectives:function(){let e=this.lookAhead("^(that|who|which)? (was|is|will)? be? #Adverb? #Adjective+");return e=e.concat(this.lookBehind("#Adjective+ #Adverb?$")),e=e.match("#Adjective"),e.sort("index")},isPlural:function(){return this.if("#Plural")},hasPlural:function(){return this.filter(e=>oo(e))},toPlural:function(e){let t=this.world.transforms.toPlural;return this.forEach(r=>{if(r.has("#Plural")||!1===oo(r))return;let a=co(r).main,n=a.text("reduced");if((a.has("#Singular")||!0!==lo(n))&&(n=t(n,this.world),a.replace(n).tag("#Plural"),e)){let e=a.lookBefore("(an|a) #Adjective?$").not("#Adjective");!0===e.found&&e.remove()}}),this},toSingular:function(e){let t=this.world.transforms.toSingular;return this.forEach(r=>{if(r.has("^#Singular+$")||!1===oo(r))return;let a=co(r).main,n=a.text("reduced");if((a.has("#Plural")||!0===lo(n))&&(n=t(n,this.world),a.replace(n).tag("#Singular"),e)){let e=r,t=r.lookBefore("#Adjective");t.found&&(e=t);let a=so(e);e.insertBefore(a)}}),this},toPossessive:function(){return this.forEach(e=>{uo(e)}),this}};var go=function(e){class t extends e{}return Object.assign(t.prototype,ho),e.prototype.nouns=function(e,r={}){let a=this.match("(#City && @hasComma) (#Region|#Country)"),n=this.not(a).splitAfter("@hasComma");n=n.concat(a);let i=n.quotations();return i.found&&(n=n.splitOn(i.eq(0))),n=n.match("#Noun+ (of|by)? the? #Noun+?"),!0!==r.keep_anaphora&&(n=n.not("#Pronoun"),n=n.not("(there|these)"),n=n.not("(#Month|#WeekDay)"),n=n.not("(my|our|your|their|her|his)")),n=n.not("(of|for|by|the)$"),"number"==typeof e&&(n=n.get(e)),new t(n.list,this,this.world)},e};const po=/\(/,mo=/\)/;var fo=function(e){class t extends e{unwrap(){return this.list.forEach(e=>{let t=e.terms(0);t.pre=t.pre.replace(po,"");let r=e.lastTerm();r.post=r.post.replace(mo,"")}),this}}return e.prototype.parentheses=function(e){let r=[];return this.list.forEach(e=>{let t=e.terms();for(let a=0;a<t.length;a+=1){const n=t[a];if(po.test(n.pre))for(let i=a;i<t.length;i+=1)if(mo.test(t[i].post)){let t=i-a+1;r.push(e.buildFrom(n.id,t)),a=i;break}}}),"number"==typeof e?(r=r[e]?[r[e]]:[],new t(r,this,this.world)):new t(r,this,this.world)},e};var bo=function(e){class t extends e{constructor(e,t,r){super(e,t,r),this.contracted=null}strip(){return this.list.forEach(e=>{e.terms().forEach(e=>{let t=e.text.replace(/'s$/,"");e.set(t||e.text)})}),this}}return e.prototype.possessives=function(e){let r=this.match("#Noun+? #Possessive");return"number"==typeof e&&(r=r.get(e)),new t(r.list,this,this.world)},e};const yo={'"':'"',"＂":"＂","'":"'","“":"”","‘":"’","‟":"”","‛":"’","„":"”","⹂":"”","‚":"’","«":"»","‹":"›","‵":"′","‶":"″","‷":"‴","〝":"〞","`":"´","〟":"〞"},vo=RegExp("("+Object.keys(yo).join("|")+")");var wo=function(e){class t extends e{unwrap(){return this}}return e.prototype.quotations=function(e){let r=[];return this.list.forEach(e=>{let t=e.terms();for(let a=0;a<t.length;a+=1){const n=t[a];if(vo.test(n.pre)){let i=(n.pre.match(vo)||[])[0],o=yo[i];for(let i=a;i<t.length;i+=1)if(-1!==t[i].post.indexOf(o)){let t=i-a+1;r.push(e.buildFrom(n.id,t)),a=i;break}}}}),"number"==typeof e?(r=r[e]?[r[e]]:[],new t(r,this,this.world)):new t(r,this,this.world)},e.prototype.quotes=e.prototype.quotations,e};var ko=function(e,t){let r=e.verb,a=r.text("reduced");if(r.has("#Infinitive"))return a;let n=null;return r.has("#PastTense")?n="PastTense":r.has("#Gerund")?n="Gerund":r.has("#PresentTense")?n="PresentTense":r.has("#Participle")?n="Participle":r.has("#Actor")&&(n="Actor"),t.transforms.toInfinitive(a,t,n)};var Ao=function(e){let t=e.verb;if(t.has("(are|were|does)")||e.auxiliary.has("(are|were|does)"))return!0;let r=function(e){return e.lookBehind("#Noun+").last()}(t);return!r.has("(he|she|many|both)")&&(!!r.has("(we|they|you|i)")||!r.has("#Person")&&(!!r.has("#Plural")||!r.has("#Singular")&&(!t.has("(is|am|do|was)")&&(!(e.auxiliary.has("(is|am|do|was)")&&!e.negative.found)&&null))))};const Do=ko,$o=Ao;var Po=function(e){let t=e.lookBehind(),r=t.nouns(null,{keep_anaphora:!0}).last();return r.found||(r=t.match("(that|this|each)").last(),r=r.tag("#Noun").nouns()),r};const Eo=Po;const Ho=Ao;const jo=ko,No=e=>{let t=!1,r=Ho(e),a=e.negative.found;e.verb.lookBehind("i (#Adverb|#Verb)?$").found&&(t=!0);let n={PastTense:"was",PresentTense:"is",FutureTense:"will be",Infinitive:"is",Gerund:"being",Actor:"",PerfectTense:"been",Pluperfect:"been"};return r&&(n.PastTense="were",n.PresentTense="are",n.Infinitive="are"),!0===t&&(n.PastTense="was",n.PresentTense="am",n.Infinitive="am"),a&&(n.PastTense+=" not",n.PresentTense+=" not",n.FutureTense="will not be",n.Infinitive+=" not",n.PerfectTense="not "+n.PerfectTense,n.Pluperfect="not "+n.Pluperfect,n.Gerund="not "+n.Gerund),n},xo=function(e){let t=e.verb.text();return{PastTense:t+" have",PresentTense:t,FutureTense:t,Infinitive:t}},Fo=Ao;var Co=function(e,t){let r=e.verb;if(r.has("#Copula")||"be"===r.out("normal")&&e.auxiliary.has("will"))return No(e);if(e.auxiliary.has("are")&&r.has("#Gerund")){let r=e.original.clone(),a=r.clone().replace("are","were"),n=r.clone().replace("are","will be"),i=jo(e,t);return{PastTense:a.text(),PresentTense:r.text(),FutureTense:n.text(),Infinitive:i}}if(r.has("#Modal"))return xo(e);let a=jo(e,t);if(!a)return{};let n=t.transforms.conjugate(a,t);n.Infinitive=a;let i=Fo(e);!0===i&&(n.PresentTense=n.Infinitive);let o=e.verb.termList(0).hasHyphen();if(e.particle.found){let t=e.particle.text(),r=!0===o?"-":" ";Object.keys(n).forEach(e=>n[e]+=r+t)}const s=e.negative.found;return n.FutureTense=n.FutureTense||"will "+n.Infinitive,s&&(n.PastTense="did not "+n.Infinitive,n.FutureTense="will not "+n.Infinitive,i?(n.PresentTense="do not "+n.Infinitive,n.Infinitive="do not "+n.Infinitive):(n.PresentTense="does not "+n.Infinitive,n.Infinitive="does not "+n.Infinitive),n.Gerund="not "+n.Gerund),n};const Bo=Co;var Go={useParticiple:function(e){return!!e.auxiliary.has("(could|should|would|may|can|must)")||(!!e.auxiliary.has("am .+? being")||!!e.auxiliary.has("had .+? been"))},toParticiple:function(e,t){if(e.auxiliary.has("(have|had)")&&e.verb.has("#Participle"))return;let r=Bo(e,t),a=r.Participle||r.PastTense;a&&e.verb.replaceWith(a,!1),e.auxiliary.has("am .+? being")&&(e.auxiliary.remove("am"),e.auxiliary.replace("being","have been")),e.auxiliary.has("have")||e.auxiliary.append("have"),e.verb.tag("Participle","toParticiple"),e.auxiliary.replace("can","could"),e.auxiliary.replace("be have","have been"),e.auxiliary.replace("not have","have not"),e.auxiliary.tag("Auxiliary")}};const zo=function(e,t){let r=e.verb;if(!e.negative.found){if(e.auxiliary.found)return e.auxiliary.eq(0).append("not"),void(e.auxiliary.has("#Modal have not")&&e.auxiliary.replace("have not","not have"));if(r.has("(#Copula|will|has|had|do)"))r.append("not");else{if(r.has("#PastTense")){let a=Do(e,t);return r.replaceWith(a,!0),void r.prepend("did not")}if(r.has("#PresentTense")){let a=Do(e,t);return r.replaceWith(a,!0),void($o(e)?r.prepend("do not"):r.prepend("does not"))}if(r.has("#Gerund")){let a=Do(e,t);return r.replaceWith(a,!0),void r.prepend("not")}$o(e)?r.prepend("does not"):r.prepend("do not")}}},Io=function(e){let t={adverb:e.match("#Adverb+"),negative:e.match("#Negative"),auxiliary:e.match("#Auxiliary+").not("(#Negative|#Adverb)"),particle:e.match("#Particle"),verb:e.match("#Verb+").not("(#Adverb|#Negative|#Auxiliary|#Particle)"),original:e,subject:Eo(e)};if(t.verb.has("(#PresentTense|#PastTense|#Infinitive) #Gerund$")&&(t.verb=t.verb.not("#Gerund$")),!t.verb.found)return Object.keys(t).forEach(e=>{t[e]=t[e].not(".")}),t.verb=e,t;if(t.adverb&&t.adverb.found){let r=t.adverb.text("reduced")+"$";e.has(r)&&(t.adverbAfter=!0)}return t},Oo=Ao,To=Po,Vo=Co,{toParticiple:Mo,useParticiple:Jo}=Go,Lo=function(e){return e.auxiliary.remove("(will|are|am|being)"),e.auxiliary.remove("(did|does)"),e.auxiliary.remove("(had|has|have)"),e.particle.remove(),e.negative.remove(),e};const So={json:function(e){let t=null;"number"==typeof e&&(t=e,e=null),e=e||{text:!0,normal:!0,trim:!0,terms:!0};let r=[];return this.forEach(t=>{let a=t.json(e)[0],n=Io(t);a.parts={},Object.keys(n).forEach(e=>{n[e]&&"Doc"===n[e].isA?a.parts[e]=n[e].text("normal"):a.parts[e]=n[e]}),a.isNegative=t.has("#Negative"),a.conjugations=Vo(n,this.world),r.push(a)}),null!==t?r[t]:r},adverbs:function(){let e=[];this.forEach(t=>{let r=Io(t).adverb;r.found&&(e=e.concat(r.list))});let t=this.lookBehind("#Adverb+$");return t.found&&(e=t.list.concat(e)),t=this.lookAhead("^#Adverb+"),t.found&&(e=e.concat(t.list)),this.buildFrom(e)},isPlural:function(){let e=[];return this.forEach(t=>{let r=Io(t);!0===Oo(r,this.world)&&e.push(t.list[0])}),this.buildFrom(e)},isSingular:function(){let e=[];return this.forEach(t=>{let r=Io(t);!1===Oo(r,this.world)&&e.push(t.list[0])}),this.buildFrom(e)},conjugate:function(){let e=[];return this.forEach(t=>{let r=Io(t),a=Vo(r,this.world);e.push(a)}),e},toPastTense:function(){return this.forEach(e=>{let t=Io(e);if(Jo(t))return void Mo(t,this.world);if(e.has("#Imperative"))return;if(e.has("be")&&e.lookBehind("to$").found)return;if(t.verb.has("#Gerund")&&t.auxiliary.has("(is|will|was)"))return void e.replace("is","was");let r=Vo(t,this.world).PastTense;r&&(t=Lo(t),t.verb.replaceWith(r,!1),t.auxiliary.remove("(do|did|will)"))}),this},toPresentTense:function(){return this.forEach(e=>{if(e.has("#Imperative"))return;let t=Io(e),r=Vo(t,this.world),a=r.PresentTense;if(e.lookBehind("(i|we) (#Adverb|#Verb)?$").found&&(a=r.Infinitive),a){if(t.auxiliary.has("(have|had) been"))return t.auxiliary.replace("(have|had) been","am being"),void(r.Particle&&(a=r.Particle||r.PastTense));t.verb.replaceWith(a,!1),t.verb.tag("PresentTense"),t=Lo(t),t.auxiliary.remove("#Modal"),t.auxiliary.remove("(do|did|will)")}}),this},toFutureTense:function(){return this.forEach(e=>{let t=Io(e);if(Jo(t))return;if(e.has("#Imperative"))return;let r=Vo(t,this.world).FutureTense;r&&(t=Lo(t),t.auxiliary.remove("#Modal"),t.verb.replaceWith(r,!1),t.verb.tag("FutureTense"),t.auxiliary.remove("(do|did|will)"))}),this},toInfinitive:function(){return this.forEach(e=>{let t=Io(e),r=Vo(t,this.world).Infinitive;r&&(e.replaceWith(r,!1),e.tag("Infinitive"))}),this},toGerund:function(){return this.forEach(e=>{let t=Io(e),r=Vo(t,this.world).Gerund;r&&(e.replaceWith(r,!1),e.tag("Gerund"))}),this},toParticiple:function(){return this.forEach(e=>{let t=Io(e),r=!t.auxiliary.found;Mo(t,this.world),r&&(t.verb.prepend(t.auxiliary.text()),t.auxiliary.remove())}),this},isNegative:function(){return this.if("#Negative")},isPositive:function(){return this.ifNo("#Negative")},isImperative:function(){return this.if("#Imperative")},toNegative:function(){return this.list.forEach(e=>{let t=this.buildFrom([e]),r=Io(t);zo(r,t.world)}),this},toPositive:function(){let e=this.match("do not #Verb");return e.found&&e.remove("do not"),this.remove("#Negative")},subject:function(){let e=[];return this.forEach(t=>{let r=To(t);r.list[0]&&e.push(r.list[0])}),this.buildFrom(e)}};const _o=za,Ko=[Ri,Qi,Zi,Xi,Yi,go,fo,bo,wo,function(e){class t extends e{}return Object.assign(t.prototype,So),t.prototype.negate=t.prototype.toNegative,e.prototype.verbs=function(e){let r=this.match("(#Adverb|#Auxiliary|#Verb|#Negative|#Particle)+");r=r.not("^#Adverb+"),r=r.not("#Adverb+$");let a=r.match("(#Adverb && @hasComma) #Adverb"),n=r.not(a).splitAfter("@hasComma");return n=n.concat(a),n.sort("index"),n=n.if("#Verb"),n.has("(is|was)$")&&(n=n.splitBefore("(is|was)$")),n.has("#PresentTense #Adverb #PresentTense")&&(n=n.splitBefore("#Adverb #PresentTense")),"number"==typeof e&&(n=n.get(e)),new t(n.list,this,this.world)},e},function(e){class t extends e{}return e.prototype.people=function(e){let r=this.splitAfter("@hasComma");return r=r.match("#Person+"),"number"==typeof e&&(r=r.get(e)),new t(r.list,this,this.world)},e}];const qo={misc:Ba,selections:za},Wo=Wi,Ro=Nt,Uo=function(e){return Object.keys(_o).forEach(t=>e.prototype[t]=_o[t]),Ko.forEach(t=>t(e)),e};class Qo{constructor(e,t,r){this.list=e,Object.defineProperty(this,"from",{enumerable:!1,value:t,writable:!0}),void 0===r&&void 0!==t&&(r=t.world),Object.defineProperty(this,"world",{enumerable:!1,value:r,writable:!0}),Object.defineProperty(this,"_cache",{enumerable:!1,writable:!0,value:{}}),Object.defineProperty(this,"found",{get:()=>this.list.length>0}),Object.defineProperty(this,"length",{get:()=>this.list.length}),Object.defineProperty(this,"isA",{get:()=>"Doc"})}tagger(){return Wo(this)}pool(){return this.list.length>0?this.list[0].pool:this.all().list[0].pool}}Qo.prototype.buildFrom=function(e){return e=e.map(e=>e.clone(!0)),new Qo(e,this,this.world)},Qo.prototype.fromText=function(e){let t=Ro(e,this.world,this.pool());return this.buildFrom(t)},Object.assign(Qo.prototype,qo.misc),Object.assign(Qo.prototype,qo.selections),Uo(Qo);const Zo={untag:"unTag",and:"match",notIf:"ifNo",only:"if",onlyIf:"if"};Object.keys(Zo).forEach(e=>Qo.prototype[e]=Qo.prototype[Zo[e]]);const Xo=Ta;const Yo=Nt,es=Gt,ts=Qo,rs=at,as=ne,ns=it,is=function(e){let t=e.termList();return Xo(t,e.world),e.world.taggers.forEach(t=>{t(e)}),e},os=Se;return function e(t){let r=t;const a=function(e="",t){t&&r.addWords(t);let a=Yo(e,r),n=new ts(a,null,r);return n.tagger(),n};return a.tokenize=function(e="",t){let a=r;t&&(a=a.clone(),a.words={},a.addWords(t));let n=Yo(e,a),i=new ts(n,null,a);return(t||i.world.taggers.length>0)&&is(i),i},a.extend=function(e){return e(ts,r,this,rs,as,ns),this},a.fromJSON=function(e){let t=es(e,r);return new ts(t,null,r)},a.clone=function(){return e(r.clone())},a.verbose=function(e=!0){return r.verbose(e),this},a.world=function(){return r},a.parseMatch=function(e,t){return os(e,t)},a.version="13.11.3",a.import=a.load,a.plugin=a.extend,a}(new Wr)}));

;var WikiHoverPlayer = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // wikihover-embed-polyfill.js
  var require_wikihover_embed_polyfill = __commonJS({
    "wikihover-embed-polyfill.js"() {
      (function() {
        "use strict";
        window.__WIKIHOVER_EMBED__ = true;
        if (typeof window.chrome === "undefined") {
          window.chrome = {};
        }
        if (!window.chrome.runtime) {
          window.chrome.runtime = {};
        }
        if (!window.chrome.runtime.id) {
          window.chrome.runtime.id = "wikihover-embed-player";
        }
        window.chrome.runtime.getURL = function(path) {
          return window.location.origin + "/" + path.replace(/^\//, "");
        };
        window.chrome.runtime.sendMessage = function(_msg, callback) {
          if (typeof callback === "function") {
            setTimeout(function() {
              callback({ success: false });
            }, 0);
          }
          return void 0;
        };
        Object.defineProperty(window.chrome.runtime, "lastError", {
          get: function() {
            return null;
          },
          configurable: true
        });
        if (!window.chrome.storage) {
          window.chrome.storage = {};
        }
        if (!window.chrome.storage.local) {
          window.chrome.storage.local = {};
        }
        window.chrome.storage.local.get = function(_keys, callback) {
          if (typeof callback === "function") {
            setTimeout(function() {
              callback({});
            }, 0);
          }
          return Promise.resolve({});
        };
        window.chrome.storage.local.set = function(_data, callback) {
          if (typeof callback === "function") {
            setTimeout(function() {
              callback();
            }, 0);
          }
        };
      })();
    }
  });

  // agent/core/player-server-client.js
  var require_player_server_client = __commonJS({
    "agent/core/player-server-client.js"() {
      (function(global) {
        "use strict";
        class WikiHoverServerClient {
          /**
           * @param {Object} config
           * @param {string} config.token     JWT bearer token
           * @param {string} config.orgId     Publisher organization ID
           * @param {Object} config.feedsMap  Map of moduleKey → feedId, e.g. { "imdb": 4, "wikipedia": 3 }
           * @param {string} [config.server]  Base URL, defaults to production
           * @param {number} [config.version] Optional service version (feedType=8 only); omit for latest active
           */
          constructor(config) {
            this.token = config.token;
            this.orgId = config.orgId;
            var s = config.server;
            this.baseUrl = (typeof s === "string" && s.trim() !== "" ? s.trim() : "https://api.wikihover.com").replace(/\/$/, "");
            this.feedsMap = config.feedsMap || {};
            this.feedResponseMap = config.feedResponseMap || null;
            this.version = config.version != null ? config.version : null;
          }
          /**
           * Normalize the FeedAPI response into { moduleKey → SourceResult } shape.
           *
           * Resolution order:
           *  1. feedResponseMap (explicit, host-provided): outer key → module key
           *       e.g. { "IMDB - Lambda": "imdb" }
           *  2. Heuristic inner-feed unwrapping: items[0].feeds[key] (production nesting fallback)
           *  3. Direct module-key match: feeds["imdb"] = SourceResult
           *  4. Numeric feed-id match: feeds["5"] = SourceResult (via feedsMap inversion)
           */
          _normalizeFeedKeys(feeds, moduleKeys) {
            if (!feeds || typeof feeds !== "object") return {};
            var out = {};
            var self = this;
            if (self.feedResponseMap && typeof self.feedResponseMap === "object") {
              Object.keys(feeds).forEach(function(outerKey) {
                var moduleKey = self.feedResponseMap[outerKey];
                if (!moduleKey) return;
                var outerFeed = feeds[outerKey];
                var sourceResult = _extractSourceResult(outerFeed, moduleKey);
                if (sourceResult != null) out[moduleKey] = sourceResult;
              });
            }
            Object.values(feeds).forEach(function(outerFeed) {
              if (!outerFeed || !outerFeed.items || !outerFeed.items.length) return;
              var innerFeeds = outerFeed.items[0] && outerFeed.items[0].feeds;
              if (!innerFeeds || typeof innerFeeds !== "object") return;
              Object.keys(innerFeeds).forEach(function(k) {
                if (out[k] == null) out[k] = innerFeeds[k];
              });
            });
            for (var i = 0; i < moduleKeys.length; i++) {
              var key = moduleKeys[i];
              if (out[key] != null) continue;
              if (feeds[key] != null) {
                out[key] = feeds[key];
                continue;
              }
              var entry = self.feedsMap[key];
              var fid = entry && typeof entry === "object" ? entry.id : entry;
              if (fid == null) continue;
              var byNum = feeds[String(fid)] != null ? feeds[String(fid)] : feeds[fid];
              if (byNum != null) out[key] = byNum;
            }
            return out;
          }
          /**
           * Fetch feed data for an entity from FeedAPI.
           * @param {string}   entityName  e.g. "George Clooney"
           * @param {string[]} moduleKeys  Module keys to fetch, e.g. ['wikipedia', 'imdb']
           *                               Each key is translated via feedsMap to a numeric feedId
           *                               which is sent as the `sources` param to FeedAPI.
           * @returns {Promise<Object>}
           */
          async fetch(entityName, moduleKeys) {
            if (!entityName || !moduleKeys || !moduleKeys.length) return { entity_name: entityName, feeds: {} };
            const slug = entityName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
            const self = this;
            const results = await Promise.all(moduleKeys.map(async (key) => {
              const entry = self.feedsMap[key];
              if (!entry) return { key, data: null };
              const feedId = typeof entry === "object" ? entry.id : entry;
              const feedType = typeof entry === "object" && entry.type === "marketplace" ? "marketplace" : "managed";
              const basePath = feedType === "marketplace" ? "/api/v1/marketplace/feed/" : "/api/v1/feed";
              const versionParam = self.version != null ? `&version=${encodeURIComponent(self.version)}` : "";
              const url = `${self.baseUrl}${basePath}?entity=${encodeURIComponent(slug)}&sources=${encodeURIComponent(feedId)}&orgID=${encodeURIComponent(self.orgId)}${versionParam}`;
              try {
                const res = await window.fetch(url, {
                  headers: { "Authorization": `Bearer ${self.token}` }
                });
                if (!res.ok) {
                  console.warn(`[WikiHover] Feed ${key} (${feedType}) failed: ${res.status}`);
                  return { key, data: null };
                }
                return { key, data: await res.json() };
              } catch (err) {
                console.warn(`[WikiHover] Feed ${key} fetch error:`, err);
                return { key, data: null };
              }
            }));
            const mergedFeeds = {};
            for (const { key, data } of results) {
              if (!data || !data.feeds) continue;
              const feedKeys = Object.keys(data.feeds);
              if (feedKeys.length === 1) {
                var sourceResult = _extractSourceResult(data.feeds[feedKeys[0]], key);
                if (sourceResult != null) {
                  mergedFeeds[key] = sourceResult;
                  continue;
                }
              }
              const normalized = this._normalizeFeedKeys(data.feeds, [key]);
              if (normalized[key] != null) {
                mergedFeeds[key] = normalized[key];
              }
            }
            return { entity_name: entityName, feeds: mergedFeeds };
          }
        }
        function _extractSourceResult(outerFeed, moduleKey) {
          if (!outerFeed) return null;
          if (outerFeed.items && outerFeed.items.length) {
            var item0 = outerFeed.items[0];
            if (item0 && item0.statusCode != null && typeof item0.body === "string") {
              try {
                var parsed = JSON.parse(item0.body);
                if (parsed && parsed.feeds) {
                  if (parsed.feeds[moduleKey] != null) return parsed.feeds[moduleKey];
                  var pkeys = Object.keys(parsed.feeds);
                  if (pkeys.length === 1) return parsed.feeds[pkeys[0]];
                }
              } catch (e) {
              }
            }
            var inner = item0 && item0.feeds;
            if (inner) {
              if (inner[moduleKey] != null) return inner[moduleKey];
              var keys = Object.keys(inner);
              if (keys.length === 1) return inner[keys[0]];
            }
          }
          if (outerFeed.status) return outerFeed;
          return null;
        }
        global.WikiHoverServerClient = WikiHoverServerClient;
      })(window);
    }
  });

  // agent/core/feed-registry.js
  var require_feed_registry = __commonJS({
    "agent/core/feed-registry.js"() {
      (function(global) {
        "use strict";
        class WikiHoverFeedRegistry {
          constructor() {
            this._modules = /* @__PURE__ */ new Map();
          }
          /**
           * Register a FeedModule instance.
           * @param {WikiHoverFeedModule} module
           */
          register(module2) {
            this._modules.set(module2.key, module2);
          }
          /**
           * Look up a module by feed key. Returns null if not registered.
           * @param {string} key  e.g. 'wikipedia', 'imdb'
           * @returns {WikiHoverFeedModule|null}
           */
          get(key) {
            return this._modules.get(key) || null;
          }
          /** @returns {string[]} All registered feed keys */
          keys() {
            return [...this._modules.keys()];
          }
          /** @returns {boolean} */
          has(key) {
            return this._modules.has(key);
          }
        }
        global.WikiHoverFeedRegistry = WikiHoverFeedRegistry;
      })(window);
    }
  });

  // agent/core/feed-module.js
  var require_feed_module = __commonJS({
    "agent/core/feed-module.js"() {
      (function(global) {
        "use strict";
        class WikiHoverFeedModule {
          /** @returns {string} Matches the key in server FeedResponse.feeds map */
          get key() {
            throw new Error("WikiHoverFeedModule: key not implemented");
          }
          /** @returns {string} Display label for the tab */
          get label() {
            throw new Error("WikiHoverFeedModule: label not implemented");
          }
          /** @returns {string} SVG markup or emoji for the tab icon */
          get icon() {
            return "";
          }
          /**
           * Render feed data into the container element.
           * @param {Object} sourceResult  { status, cached, items, error }
           * @param {HTMLElement} container  The tab's content div to render into
           */
          render(sourceResult, container) {
            throw new Error("WikiHoverFeedModule: render not implemented");
          }
          /** Helper: render a "not available" placeholder */
          _renderUnavailable(container, message) {
            container.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                    height:120px;color:var(--wh-text-secondary,#888);font-size:13px;gap:8px;">
          <span style="font-size:28px;opacity:0.4;">\u2014</span>
          <span class="wikihover-unavailable-msg"></span>
        </div>`;
            container.querySelector(".wikihover-unavailable-msg").textContent = message || "Not available";
          }
          /** Helper: render a loading spinner */
          _renderLoading(container) {
            container.innerHTML = '<div class="wikihover-loader"></div>';
          }
        }
        global.WikiHoverFeedModule = WikiHoverFeedModule;
      })(window);
    }
  });

  // agent/core/agent.js
  var require_agent = __commonJS({
    "agent/core/agent.js"() {
      (function(global) {
        "use strict";
        const FEED_FACTORIES = {};
        const WikiHover = {
          _client: null,
          _registry: null,
          _config: null,
          _initialized: false,
          /**
           * Register a feed module factory.
           * Called by each agent/feeds/*.js file at load time.
           * @param {string} key          Feed key matching server FeedType.sourceName
           * @param {Function} factory    () => WikiHoverFeedModule instance
           */
          registerFeedFactory(key, factory) {
            FEED_FACTORIES[key] = factory;
          },
          /**
           * Initialize the agent. Must be called before any tooltips appear.
           * @param {Object} config
           * @param {string} config.token             JWT bearer token from server registration
           * @param {string} config.orgId             Publisher organization ID
           * @param {Object} config.feeds             Map of module key → FeedAPI feedId.
           *                                          e.g. { "wikipedia": 3, "imdb": 4, "tvmaze": 6 }
           * @param {string} [config.server]          API base URL; defaults to production
           * @param {Object} [config.feedResponseMap] Optional explicit mapping from FeedAPI response outer
           *                                          key → SDK module key. Provided by the hosting site so
           *                                          the SDK doesn't have to guess the server's naming.
           *                                          e.g. { "IMDB - Lambda": "imdb", "OMDB API": "omdbapi" }
           * @param {number} [config.defaultFeed]     Optional feed ID to show first when tooltip opens.
           *                                          e.g. 26 (Instagram). Resolved to module key via feeds map.
           */
          init(config) {
            if (this._initialized) {
              console.warn("WikiHover.init: already initialized, ignoring duplicate call");
              return;
            }
            if (!config || !config.token) throw new Error("WikiHover.init: token is required");
            if (!config.orgId) throw new Error("WikiHover.init: orgId is required");
            const rawFeeds = config.feeds && !Array.isArray(config.feeds) && typeof config.feeds === "object" ? config.feeds : {};
            const feedsMap = {};
            for (const [key, val] of Object.entries(rawFeeds)) {
              if (val && typeof val === "object" && val.id != null) {
                feedsMap[key] = val;
              } else if (typeof val === "number" || typeof val === "string" && !isNaN(Number(val))) {
                feedsMap[key] = { id: Number(val), name: key, type: "managed" };
              }
            }
            this._config = { ...config, feeds: feedsMap };
            this._client = new global.WikiHoverServerClient({
              token: config.token,
              orgId: config.orgId,
              server: config.server,
              feedsMap,
              feedResponseMap: config.feedResponseMap || null,
              version: config.version != null ? config.version : null
            });
            this._registry = new global.WikiHoverFeedRegistry();
            Object.keys(feedsMap).forEach((key) => {
              if (FEED_FACTORIES[key]) {
                this._registry.register(FEED_FACTORIES[key]());
              }
            });
            this._initialized = true;
          },
          /** @returns {WikiHoverServerClient|null} */
          getClient() {
            return this._client;
          },
          /** @returns {WikiHoverFeedRegistry|null} */
          getRegistry() {
            return this._registry;
          },
          /** @returns {Object|null} */
          getConfig() {
            return this._config;
          },
          /** @returns {boolean} True if init() has been called */
          isReady() {
            return !!this._initialized;
          },
          /**
           * Reset the agent to allow re-initialization with a different config.
           * Called by player-entry.js before re-launching with a new feed selection.
           *
           * Clears: _initialized, _client, _registry, _config, tooltip DOM nodes
           * Preserves: markedByDocument/markedNames (span elements stay; listeners use getClient()),
           *            MutationObserver, feed caches (wikiCache, tvmazeCache etc.)
           */
          reset() {
            this._initialized = false;
            this._client = null;
            this._registry = null;
            this._config = null;
            document.querySelectorAll("[data-wikihover-tooltip]").forEach(function(el) {
              el.remove();
            });
          }
        };
        global.WikiHover = WikiHover;
      })(window);
    }
  });

  // agent/feeds/wikipedia.js
  var require_wikipedia = __commonJS({
    "agent/feeds/wikipedia.js"() {
      (function(global) {
        "use strict";
        class WikipediaModule extends global.WikiHoverFeedModule {
          get key() {
            return "wikipedia";
          }
          get label() {
            return "Wikipedia";
          }
          get icon() {
            return "\u{1F4D6}";
          }
          _formatDate(dateStr) {
            if (!dateStr) return null;
            const parts = dateStr.split("-");
            if (parts.length !== 3) return null;
            const [y, m, d] = parts;
            const monthIdx = +m - 1;
            if (monthIdx < 0 || monthIdx > 11 || !+d) return null;
            const months = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December"
            ];
            return `${months[monthIdx]} ${+d}, ${y}`;
          }
          _formatOccupations(list) {
            if (!list || !list.length) return null;
            const unique = [...new Set(list)];
            const titled = unique.map((o) => o.replace(/\b\w/g, (c) => c.toUpperCase()));
            const joined = titled.join(", ");
            return joined.length > 60 ? joined.slice(0, 57) + "\u2026" : joined;
          }
          _calculateAge(birthDate, deathDate) {
            if (!birthDate) return null;
            const birth = new Date(birthDate);
            if (isNaN(birth.getTime())) return null;
            const end = deathDate ? new Date(deathDate) : /* @__PURE__ */ new Date();
            if (isNaN(end.getTime())) return null;
            let age = end.getFullYear() - birth.getFullYear();
            const monthDiff = end.getMonth() - birth.getMonth();
            if (monthDiff < 0 || monthDiff === 0 && end.getDate() < birth.getDate()) {
              age--;
            }
            return age >= 0 ? age : null;
          }
          /* ── Hero section ─────────────────────────────────────────────────── */
          _renderHero(imageItem, textItem) {
            var _a, _b;
            const hero = document.createElement("div");
            hero.style.cssText = "position:relative;width:100%;aspect-ratio:2/1;max-height:200px;overflow:hidden;background:#111";
            const title = ((_a = textItem == null ? void 0 : textItem.stats) == null ? void 0 : _a.title) || "";
            const desc = ((_b = textItem == null ? void 0 : textItem.stats) == null ? void 0 : _b.description) || "";
            let overlay = null;
            if (title || desc) {
              overlay = document.createElement("div");
              if (title) {
                const nameEl = document.createElement("div");
                nameEl.style.cssText = "font-size:20px;font-weight:700;margin:0";
                nameEl.textContent = title;
                overlay.appendChild(nameEl);
              }
              if (desc) {
                const descEl = document.createElement("div");
                descEl.style.cssText = "font-size:12px;opacity:0.9;margin-top:2px";
                descEl.textContent = desc;
                overlay.appendChild(descEl);
              }
            }
            const applyImageOverlay = () => {
              if (overlay) overlay.style.cssText = "position:absolute;bottom:0;left:0;right:0;padding:32px 14px 12px;z-index:2;background:linear-gradient(transparent,rgba(0,0,0,0.75));color:#fff";
              if (overlay && overlay.firstChild) {
                overlay.firstChild.style.textShadow = "0 1px 4px rgba(0,0,0,0.4)";
              }
            };
            const applyFallback = () => {
              hero.style.background = "var(--wh-card-bg,#f5f5f5)";
              if (overlay) overlay.style.cssText = "position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:14px;color:var(--wh-text,#333)";
              if (overlay && overlay.firstChild) {
                overlay.firstChild.style.textShadow = "none";
              }
            };
            if (imageItem) {
              const bgImg = document.createElement("img");
              bgImg.src = imageItem.asset_value;
              bgImg.alt = "";
              bgImg.style.cssText = "position:absolute;inset:-20px;width:calc(100% + 40px);height:calc(100% + 40px);object-fit:cover;filter:blur(20px) saturate(1.4) brightness(0.7);z-index:0";
              bgImg.onerror = () => {
                bgImg.remove();
              };
              hero.appendChild(bgImg);
              const img = document.createElement("img");
              img.src = imageItem.asset_value;
              img.alt = title;
              img.style.cssText = "position:relative;width:100%;height:100%;object-fit:contain;display:block;z-index:1";
              img.onerror = () => {
                img.remove();
                bgImg.remove();
                applyFallback();
              };
              hero.appendChild(img);
              applyImageOverlay();
            } else {
              applyFallback();
            }
            if (overlay) hero.appendChild(overlay);
            return hero;
          }
          /* ── Quick Facts section ──────────────────────────────────────────── */
          _renderFacts(stats) {
            if (!stats) return null;
            const rows = [];
            const birthStr = this._formatDate(stats.birthDate);
            const deathStr = this._formatDate(stats.deathDate);
            const age = this._calculateAge(stats.birthDate, stats.deathDate);
            if (birthStr || stats.birthPlace) {
              const parts = [];
              if (birthStr) parts.push(birthStr);
              if (age !== null) parts.push(stats.deathDate ? `died at ${age}` : `${age} years`);
              if (stats.birthPlace) parts.push(stats.birthPlace);
              rows.push({ icon: "\u{1F382}", text: parts.join(" \xB7 ") });
            }
            if (deathStr) {
              const parts = [deathStr];
              if (stats.deathPlace) parts.push(stats.deathPlace);
              rows.push({ icon: "\u271D\uFE0F", text: parts.join(" \xB7 ") });
            }
            if (stats.height) {
              rows.push({ icon: "\u{1F4CF}", text: stats.height });
            }
            const occ = this._formatOccupations(stats.occupations);
            if (occ) rows.push({ icon: "\u{1F4BC}", text: occ });
            if (stats.nationality && stats.nationality.length) {
              rows.push({ icon: "\u{1F30D}", text: stats.nationality.join(", ") });
            }
            if (stats.education && stats.education.length) {
              rows.push({ icon: "\u{1F393}", text: stats.education.slice(0, 3).join(" \xB7 ") });
            }
            if (stats.awards && stats.awards.length) {
              const n = stats.awards.length;
              rows.push({ icon: "\u{1F3C6}", text: `${n}\xD7 ${n === 1 ? "award" : "awards"} \xB7 ${stats.awards.slice(0, 2).join(" \xB7 ")}` });
            }
            const links = [];
            if (stats.website) links.push({ icon: "\u{1F310}", label: "Website", url: stats.website });
            if (stats.socialMedia) {
              if (stats.socialMedia.instagram) links.push({ icon: "\u{1F4F7}", label: "Instagram", url: stats.socialMedia.instagram });
              if (stats.socialMedia.twitter) links.push({ icon: "\u{1D54F}", label: "Twitter", url: stats.socialMedia.twitter });
              if (stats.socialMedia.facebook) links.push({ icon: "\u{1F4D8}", label: "Facebook", url: stats.socialMedia.facebook });
            }
            if (!rows.length && !links.length) return null;
            const container = document.createElement("div");
            container.style.cssText = "padding:10px 14px;display:flex;flex-direction:column;gap:5px";
            rows.forEach(({ icon, text }) => {
              const row = document.createElement("div");
              row.style.cssText = "display:flex;align-items:baseline;gap:8px;font-size:12px;color:var(--wh-text,#333);line-height:1.4";
              const iconEl = document.createElement("span");
              iconEl.style.cssText = "width:16px;text-align:center;flex-shrink:0";
              iconEl.textContent = icon;
              const textEl = document.createElement("span");
              textEl.textContent = text;
              row.appendChild(iconEl);
              row.appendChild(textEl);
              container.appendChild(row);
            });
            if (links.length) {
              const row = document.createElement("div");
              row.style.cssText = "display:flex;align-items:baseline;gap:8px;font-size:12px;color:var(--wh-text,#333);line-height:1.4";
              const iconEl = document.createElement("span");
              iconEl.style.cssText = "width:16px;text-align:center;flex-shrink:0";
              iconEl.textContent = "\u{1F517}";
              row.appendChild(iconEl);
              const wrap = document.createElement("div");
              wrap.style.cssText = "display:flex;gap:6px;align-items:center;flex-wrap:wrap";
              links.forEach(({ icon, label, url }) => {
                const a = document.createElement("a");
                a.href = url;
                a.target = "_blank";
                a.rel = "noopener";
                a.style.cssText = "display:inline-flex;align-items:center;gap:3px;font-size:11px;color:var(--wh-accent,#0366d6);text-decoration:none;padding:2px 7px;border-radius:4px;background:var(--wh-card-bg,#f0f6ff)";
                a.textContent = `${icon} ${label}`;
                wrap.appendChild(a);
              });
              row.appendChild(wrap);
              container.appendChild(row);
            }
            return container;
          }
          /* ── Divider ──────────────────────────────────────────────────────── */
          _createDivider() {
            const d = document.createElement("div");
            d.style.cssText = "height:1px;background:var(--wh-border,#e5e5e5);margin:0 14px";
            return d;
          }
          /* ── Family tree ──────────────────────────────────────────────────── */
          _renderFamilyTree(data, container, entityName) {
            const row1Members = [
              data.father ? { person: data.father, relation: "Father" } : null,
              data.mother ? { person: data.mother, relation: "Mother" } : null,
              ...(data.spouses || []).map((s) => ({ person: s, relation: "Spouse" }))
            ].filter(Boolean);
            const children = data.children || [];
            const siblings = data.siblings || [];
            if (!row1Members.length && !children.length && !siblings.length) return;
            const label = document.createElement("div");
            label.style.cssText = "padding:6px 14px 4px;font-size:10px;font-weight:600;color:var(--wh-text-secondary,#999);text-transform:uppercase;letter-spacing:0.6px";
            label.textContent = "Family";
            container.appendChild(label);
            const section = document.createElement("div");
            section.style.cssText = "padding:4px 14px 16px";
            const avatarStyles = {
              parent: { bg: "#dbeafe", border: "1.5px solid #93c5fd", color: "#2563eb" },
              spouse: { bg: "#fce7f3", border: "1.5px solid #f9a8d4", color: "#be185d" },
              subject: { bg: "var(--wh-accent,#0366d6)", border: "2px solid var(--wh-accent,#024ea0)", color: "#fff" },
              child: { bg: "#f0fdf4", border: "1.5px solid #86efac", color: "#16a34a" },
              sibling: { bg: "#fef3c7", border: "1.5px solid #fcd34d", color: "#b45309" }
            };
            const makeAvatar = (person, type, size) => {
              const s = avatarStyles[type] || avatarStyles.parent;
              const el = document.createElement("div");
              el.style.cssText = `width:${size}px;height:${size}px;border-radius:50%;overflow:hidden;background:${s.bg};border:${s.border};color:${s.color};display:flex;align-items:center;justify-content:center;font-size:${Math.floor(size * 0.38)}px;font-weight:600`;
              const initial = (person == null ? void 0 : person.name) ? person.name[0] : "?";
              if (person == null ? void 0 : person.image) {
                const img = document.createElement("img");
                img.src = person.image;
                img.style.cssText = "width:100%;height:100%;object-fit:cover";
                img.onerror = () => {
                  img.remove();
                  el.textContent = initial;
                };
                el.appendChild(img);
              } else {
                el.textContent = initial;
              }
              return el;
            };
            const makeCard = (person, relation, type, size, clickable) => {
              if (!person) return null;
              const card = document.createElement("div");
              card.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:2px";
              if (clickable && person.name) {
                card.style.cursor = "pointer";
                card.style.borderRadius = "6px";
                card.style.padding = "4px";
                card.style.transition = "background 0.15s";
                card.addEventListener("mouseenter", () => {
                  card.style.background = "var(--wh-card-bg,rgba(0,0,0,0.04))";
                });
                card.addEventListener("mouseleave", () => {
                  card.style.background = "";
                });
                card.addEventListener("click", () => {
                  card.dispatchEvent(new CustomEvent("wikihover:navigate", {
                    bubbles: true,
                    detail: { name: person.name }
                  }));
                });
              }
              card.appendChild(makeAvatar(person, type, size));
              const firstName = person.name ? person.name.split(" ")[0] : "";
              if (firstName) {
                const lbl = document.createElement("div");
                lbl.style.cssText = "font-size:9px;color:var(--wh-text,#333);text-align:center;line-height:1.2";
                if (type === "subject") lbl.style.cssText += ";font-weight:600;font-size:10px";
                lbl.textContent = firstName;
                card.appendChild(lbl);
              }
              if (relation) {
                const rel = document.createElement("div");
                rel.style.cssText = "font-size:8px;color:var(--wh-accent,#0366d6);text-align:center";
                rel.textContent = relation;
                card.appendChild(rel);
              }
              return card;
            };
            const hline = (avatarSize, padded) => {
              const el = document.createElement("div");
              const offset = Math.floor((avatarSize || 60) / 2) + (padded !== false ? 4 : 0);
              el.style.cssText = `width:16px;min-width:16px;height:1.5px;background:var(--wh-border,#cbd5e1);margin-top:${offset}px`;
              return el;
            };
            const makeColumn = (cards) => {
              const col = document.createElement("div");
              col.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:8px";
              cards.forEach((c) => {
                if (c) col.appendChild(c);
              });
              return col;
            };
            const strip = document.createElement("div");
            strip.style.cssText = "display:flex;align-items:flex-start;justify-content:center;gap:0";
            const parents = row1Members.filter((m) => m.relation !== "Spouse");
            const spouses = row1Members.filter((m) => m.relation === "Spouse");
            const leftCards = parents.map(
              ({ person }) => makeCard(person, "Parent", "parent", 60, true)
            ).filter(Boolean);
            const rightCards = [
              ...children.map((c) => makeCard(c, "Child", "child", 60, true)),
              ...siblings.map((s) => makeCard(s, "Sibling", "sibling", 60, true))
            ].filter(Boolean);
            if (leftCards.length) {
              strip.appendChild(makeColumn(leftCards));
              strip.appendChild(hline(60));
            }
            const subjectName = entityName || "";
            const spouseCards = spouses.map(
              ({ person }) => makeCard(person, "Spouse", "spouse", 60, true)
            ).filter(Boolean);
            const subjectCard = makeCard({ name: subjectName }, null, "subject", 72, false);
            if (spouseCards.length) {
              const centerGroup = document.createElement("div");
              centerGroup.style.cssText = "display:flex;align-items:flex-start;gap:0";
              spouseCards.forEach((c) => {
                centerGroup.appendChild(c);
                centerGroup.appendChild(hline(60));
              });
              centerGroup.appendChild(subjectCard);
              strip.appendChild(centerGroup);
            } else {
              strip.appendChild(subjectCard);
            }
            if (rightCards.length) {
              strip.appendChild(hline(72));
              strip.appendChild(makeColumn(rightCards));
            }
            section.appendChild(strip);
            container.appendChild(section);
          }
          /* ── Main render ──────────────────────────────────────────────────── */
          render(sourceResult, container) {
            var _a, _b;
            if (!sourceResult || sourceResult.status === "error") {
              this._renderUnavailable(container, ((_a = sourceResult == null ? void 0 : sourceResult.error) == null ? void 0 : _a.message) || "Wikipedia not available");
              return;
            }
            const items = sourceResult.items || [];
            const textItem = items.find((i) => i.asset_type === 3);
            const imageItem = items.find((i) => i.asset_type === 1);
            const familyTreeItem = items.find((i) => i.asset_type === 4 && i.asset_value === "family_tree");
            const bioInfoItem = items.find((i) => i.asset_type === 6 && i.asset_value === "bio_info");
            container.innerHTML = "";
            if (imageItem || textItem) {
              container.appendChild(this._renderHero(imageItem, textItem));
            }
            const facts = this._renderFacts(bioInfoItem == null ? void 0 : bioInfoItem.stats);
            if (facts) container.appendChild(facts);
            if (textItem == null ? void 0 : textItem.asset_value) {
              container.appendChild(this._createDivider());
              const bio = document.createElement("p");
              bio.style.cssText = "padding:10px 14px;font-size:13px;line-height:1.55;color:var(--wh-text,#333);margin:0";
              bio.textContent = textItem.asset_value;
              container.appendChild(bio);
            }
            if (familyTreeItem == null ? void 0 : familyTreeItem.stats) {
              container.appendChild(this._createDivider());
              this._renderFamilyTree(familyTreeItem.stats, container, ((_b = textItem == null ? void 0 : textItem.stats) == null ? void 0 : _b.title) || "");
            }
          }
        }
        if (global.WikiHover) {
          global.WikiHover.registerFeedFactory("wikipedia", () => new WikipediaModule());
        }
        global.WikiHoverWikipediaModule = WikipediaModule;
      })(window);
    }
  });

  // agent/feeds/tvmaze.js
  var require_tvmaze = __commonJS({
    "agent/feeds/tvmaze.js"() {
      (function(global) {
        "use strict";
        class TVMazeModule extends global.WikiHoverFeedModule {
          get key() {
            return "tvmaze";
          }
          get label() {
            return "TV";
          }
          get icon() {
            return "\u{1F4FA}";
          }
          render(sourceResult, container) {
            var _a, _b;
            if (!sourceResult || sourceResult.status === "error") {
              this._renderUnavailable(container, ((_a = sourceResult == null ? void 0 : sourceResult.error) == null ? void 0 : _a.message) || "TV data not available");
              return;
            }
            const items = sourceResult.items || [];
            if (!items.length) {
              this._renderUnavailable(container, "No TV results found");
              return;
            }
            container.innerHTML = "";
            const personPhoto = ((_b = items[0]) == null ? void 0 : _b.asset_type) === 1 ? items[0] : null;
            const personStats = (personPhoto == null ? void 0 : personPhoto.stats) || {};
            if (personPhoto) {
              const header = document.createElement("div");
              header.style.cssText = "display:flex;align-items:center;gap:12px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--wh-border,#eee)";
              const img = document.createElement("img");
              img.src = personPhoto.asset_value;
              img.alt = personStats.name || "";
              img.style.cssText = "width:56px;height:56px;border-radius:50%;object-fit:cover;flex-shrink:0;box-shadow:0 2px 6px rgba(0,0,0,.15)";
              img.onerror = () => img.remove();
              const info = document.createElement("div");
              const name = document.createElement("div");
              name.style.cssText = "font-size:15px;font-weight:600;color:var(--wh-text,#333)";
              name.textContent = personStats.name || "";
              const meta = document.createElement("div");
              meta.style.cssText = "font-size:12px;color:var(--wh-text-secondary,#888);margin-top:2px";
              const parts = [];
              if (personStats.birthday) parts.push(personStats.birthday);
              if (personStats.country) parts.push(personStats.country);
              meta.textContent = parts.join(" \xB7 ");
              info.appendChild(name);
              if (parts.length) info.appendChild(meta);
              header.appendChild(img);
              header.appendChild(info);
              container.appendChild(header);
            }
            const showMap = /* @__PURE__ */ new Map();
            const restItems = personPhoto ? items.slice(1) : items;
            restItems.forEach((item) => {
              var _a2;
              const showName = (_a2 = item.stats) == null ? void 0 : _a2.showName;
              if (!showName) return;
              if (!showMap.has(showName)) showMap.set(showName, {});
              const show = showMap.get(showName);
              if (item.asset_type === 3) show.description = item;
              if (item.asset_type === 1) show.poster = item;
            });
            const showsContainer = document.createElement("div");
            showsContainer.style.cssText = "display:flex;flex-direction:column;gap:10px";
            showMap.forEach((show, showName) => {
              var _a2;
              const desc = show.description;
              if (!desc) return;
              const s = desc.stats || {};
              const card = document.createElement("div");
              card.style.cssText = "display:flex;gap:10px;padding:8px;border-radius:8px;background:var(--wh-surface,#f9f9f9)";
              if (show.poster) {
                const img = document.createElement("img");
                img.src = show.poster.asset_value;
                img.alt = showName;
                img.style.cssText = "width:52px;height:72px;object-fit:cover;border-radius:4px;flex-shrink:0";
                img.onerror = () => img.remove();
                card.appendChild(img);
              }
              const info = document.createElement("div");
              info.style.flex = "1";
              const title = document.createElement("a");
              title.href = s.showUrl && /^https?:\/\//i.test(s.showUrl) ? s.showUrl : "#";
              title.target = "_blank";
              title.rel = "noopener noreferrer";
              title.style.cssText = "font-size:13px;font-weight:600;color:var(--wh-accent,#2563eb);text-decoration:none;display:block;margin-bottom:2px";
              title.textContent = showName;
              const meta = document.createElement("div");
              meta.style.cssText = "font-size:11px;color:var(--wh-text-secondary,#888);margin-bottom:4px";
              const metaParts = [];
              if (s.network || s.webChannel) metaParts.push(s.network || s.webChannel);
              if (s.premiered) metaParts.push(s.premiered.slice(0, 4));
              if (s.rating) metaParts.push(`\u2605 ${s.rating}`);
              if ((_a2 = s.characters) == null ? void 0 : _a2.length) metaParts.push(`as ${s.characters[0]}`);
              meta.textContent = metaParts.join(" \xB7 ");
              const descText = document.createElement("p");
              descText.style.cssText = "margin:0;font-size:12px;line-height:1.4;color:var(--wh-text,#555);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden";
              descText.textContent = desc.asset_value;
              info.appendChild(title);
              if (metaParts.length) info.appendChild(meta);
              info.appendChild(descText);
              card.appendChild(info);
              showsContainer.appendChild(card);
            });
            if (showsContainer.children.length > 0) {
              container.appendChild(showsContainer);
            }
          }
        }
        if (global.WikiHover) {
          global.WikiHover.registerFeedFactory("tvmaze", () => new TVMazeModule());
        }
        global.WikiHoverTVMazeModule = TVMazeModule;
      })(window);
    }
  });

  // agent/feeds/imdb.js
  var require_imdb = __commonJS({
    "agent/feeds/imdb.js"() {
      (function(global) {
        "use strict";
        function _getContentContainerHeight(tooltipEl, totalH) {
          let usedH = 0;
          const cc = tooltipEl.querySelector(".wikihover-content-container");
          const body = tooltipEl.querySelector(".wikihover-body");
          Array.from(tooltipEl.children).forEach((child) => {
            if (child !== cc && child !== body && child.classList && !child.classList.contains("wikihover-resize-handle")) {
              usedH += child.offsetHeight || 0;
            }
          });
          return Math.max(50, totalH - usedH - 4);
        }
        function _getExpandedPlayerHeight(contentContainer) {
          if (!contentContainer) return 350;
          const tooltipEl = contentContainer.closest(".wikihover-tooltip, .wikihover-pinned-tooltip");
          if (!tooltipEl) return 350;
          const tooltipH = tooltipEl.offsetHeight || tooltipEl.getBoundingClientRect().height;
          if (tooltipH < 100) return 350;
          const ccH = _getContentContainerHeight(tooltipEl, tooltipH);
          const style = getComputedStyle(contentContainer);
          const pad = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
          return Math.max(150, Math.floor(ccH - pad));
        }
        class ImdbModule extends global.WikiHoverFeedModule {
          constructor() {
            super();
            this._trailerCache = /* @__PURE__ */ new Map();
          }
          get key() {
            return "imdb";
          }
          get label() {
            return "IMDb";
          }
          get icon() {
            return "\u{1F3AC}";
          }
          render(sourceResult, container) {
            var _a;
            if (!sourceResult || sourceResult.status === "error") {
              this._renderUnavailable(container, ((_a = sourceResult == null ? void 0 : sourceResult.error) == null ? void 0 : _a.message) || "IMDb not available");
              return;
            }
            const items = sourceResult.items || [];
            if (!items.length) {
              this._renderUnavailable(container, "No IMDb results found");
              return;
            }
            const movies = items.map((item) => {
              const s = item.stats || {};
              const movie = {
                title: item.asset_value || "",
                id: s.imdbId || "",
                url: s.imdbUrl || (s.imdbId ? `https://www.imdb.com/title/${s.imdbId}/` : ""),
                year: s.year || "",
                rating: s.rating || "",
                plot: s.plot || "",
                genre: s.genre || "",
                poster: s.poster || "",
                actors: s.actors || ""
              };
              if (movie.id && s.trailer && s.trailer.success) {
                this._trailerCache.set(movie.id, s.trailer);
              }
              return movie;
            });
            const videoSoundEnabled = window._whVideoSoundEnabled !== void 0 ? window._whVideoSoundEnabled : true;
            this._buildUI(container, movies, videoSoundEnabled);
          }
          _buildUI(imdbContent, data, videoSoundEnabled) {
            imdbContent.innerHTML = "";
            const header = document.createElement("div");
            header.style.cssText = "display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding:0 0 10px 0;border-bottom:1px solid #eee;";
            const personName = document.createElement("h3");
            personName.style.cssText = "margin:0;font-size:16px;color:var(--wh-text);font-weight:600;";
            personName.textContent = "IMDb";
            header.appendChild(personName);
            imdbContent.appendChild(header);
            const allGenres = /* @__PURE__ */ new Set();
            data.forEach((m) => {
              if (m.genre) m.genre.split(",").forEach((g) => {
                const t = g.trim();
                if (t && t !== "N/A") allGenres.add(t);
              });
            });
            const genreList = Array.from(allGenres).sort();
            const controlsBar = document.createElement("div");
            controlsBar.style.cssText = "display:flex;gap:8px;margin-bottom:10px;align-items:center;";
            const ctrlStyle = (el) => {
              el.style.cssText = "font-size:11px;padding:3px 6px;border-radius:4px;border:1px solid var(--wh-border);background-color:var(--wh-bg);color:var(--wh-text);cursor:pointer;outline:none;height:24px;box-sizing:border-box;line-height:16px;margin:0;font-family:inherit;flex:1;min-width:0;";
            };
            const sortSelect = document.createElement("select");
            ctrlStyle(sortSelect);
            [["year-desc", "Year (Newest)"], ["year-asc", "Year (Oldest)"], ["rating-desc", "Rating (Highest)"], ["rating-asc", "Rating (Lowest)"]].forEach(([v, l]) => {
              const o = document.createElement("option");
              o.value = v;
              o.textContent = l;
              sortSelect.appendChild(o);
            });
            const genreSelect = document.createElement("select");
            ctrlStyle(genreSelect);
            const allOpt = document.createElement("option");
            allOpt.value = "";
            allOpt.textContent = "All Genres";
            genreSelect.appendChild(allOpt);
            genreList.forEach((g) => {
              const o = document.createElement("option");
              o.value = g;
              o.textContent = g;
              genreSelect.appendChild(o);
            });
            const searchInput = document.createElement("input");
            searchInput.type = "text";
            searchInput.placeholder = "Search movies...";
            ctrlStyle(searchInput);
            searchInput.style.cursor = "text";
            controlsBar.appendChild(sortSelect);
            if (genreList.length > 1) controlsBar.appendChild(genreSelect);
            controlsBar.appendChild(searchInput);
            imdbContent.appendChild(controlsBar);
            const moviesContainer = document.createElement("div");
            moviesContainer.style.cssText = "flex:1 1 0;min-height:0;overflow-y:auto;padding-right:5px;display:flex;flex-wrap:wrap;gap:10px;align-content:flex-start;";
            imdbContent.appendChild(moviesContainer);
            const expandedPlayer = document.createElement("div");
            expandedPlayer.className = "wikihover-imdb-expanded-player";
            expandedPlayer.style.cssText = "display:none;position:relative;background:#000;border-radius:6px;overflow:hidden;cursor:pointer;";
            const expandedVideo = document.createElement("video");
            const imdbCC = imdbContent.closest(".wikihover-content-container");
            const videoH = _getExpandedPlayerHeight(imdbCC);
            expandedVideo.style.cssText = `width:100%;height:${videoH}px;object-fit:contain;background:#000;display:block;cursor:pointer;`;
            expandedVideo.muted = !videoSoundEnabled;
            expandedVideo.playsInline = true;
            expandedVideo.preload = "auto";
            expandedPlayer.appendChild(expandedVideo);
            const closeBtn = document.createElement("div");
            closeBtn.style.cssText = "position:absolute;top:8px;right:8px;width:28px;height:28px;background:rgba(0,0,0,0.6);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;z-index:15;line-height:1;transition:background 0.2s;";
            closeBtn.textContent = "\xD7";
            closeBtn.addEventListener("mouseenter", () => {
              closeBtn.style.background = "rgba(0,0,0,0.85)";
            });
            closeBtn.addEventListener("mouseleave", () => {
              closeBtn.style.background = "rgba(0,0,0,0.6)";
            });
            expandedPlayer.appendChild(closeBtn);
            const COUNTDOWN_SECS = 5;
            const cdContainer = document.createElement("div");
            cdContainer.style.cssText = "position:absolute;top:10px;right:10px;width:36px;height:36px;z-index:12;display:none;";
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "36");
            svg.setAttribute("height", "36");
            svg.setAttribute("viewBox", "0 0 36 36");
            const bgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            bgCircle.setAttribute("cx", "18");
            bgCircle.setAttribute("cy", "18");
            bgCircle.setAttribute("r", "15");
            bgCircle.setAttribute("fill", "rgba(0,0,0,0.6)");
            bgCircle.setAttribute("stroke", "rgba(255,255,255,0.3)");
            bgCircle.setAttribute("stroke-width", "2");
            svg.appendChild(bgCircle);
            const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            progressCircle.setAttribute("cx", "18");
            progressCircle.setAttribute("cy", "18");
            progressCircle.setAttribute("r", "15");
            progressCircle.setAttribute("fill", "none");
            progressCircle.setAttribute("stroke", "#f5c518");
            progressCircle.setAttribute("stroke-width", "2.5");
            progressCircle.setAttribute("stroke-linecap", "round");
            const circumference = 2 * Math.PI * 15;
            progressCircle.setAttribute("stroke-dasharray", String(circumference));
            progressCircle.setAttribute("stroke-dashoffset", "0");
            progressCircle.style.transform = "rotate(-90deg)";
            progressCircle.style.transformOrigin = "50% 50%";
            progressCircle.style.transition = "stroke-dashoffset 0.25s linear";
            svg.appendChild(progressCircle);
            const cdText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            cdText.setAttribute("x", "18");
            cdText.setAttribute("y", "22");
            cdText.setAttribute("text-anchor", "middle");
            cdText.setAttribute("fill", "white");
            cdText.setAttribute("font-size", "13");
            cdText.setAttribute("font-weight", "600");
            cdText.textContent = "5";
            svg.appendChild(cdText);
            cdContainer.appendChild(svg);
            expandedPlayer.appendChild(cdContainer);
            const expandedTitle = document.createElement("div");
            expandedTitle.style.cssText = "position:absolute;top:0;left:0;right:0;background:linear-gradient(rgba(0,0,0,0.6),transparent);color:white;font-size:13px;font-weight:600;padding:8px 44px 16px 12px;z-index:12;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";
            expandedPlayer.appendChild(expandedTitle);
            const ctrlsBar = document.createElement("div");
            ctrlsBar.style.cssText = "position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.85));padding:6px 10px 8px;z-index:10;display:flex;flex-direction:column;gap:4px;";
            ctrlsBar.addEventListener("click", (e) => e.stopPropagation());
            const progressContainer = document.createElement("div");
            progressContainer.style.cssText = "width:100%;height:4px;background:rgba(255,255,255,0.3);border-radius:2px;cursor:pointer;position:relative;";
            const progressFill = document.createElement("div");
            progressFill.style.cssText = "height:100%;background:#f5c518;border-radius:2px;width:0%;transition:width 0.1s linear;pointer-events:none;";
            progressContainer.appendChild(progressFill);
            let seeking = false;
            function seekTo(e) {
              const rect = progressContainer.getBoundingClientRect();
              const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              if (expandedVideo.duration) {
                expandedVideo.currentTime = pct * expandedVideo.duration;
                progressFill.style.width = pct * 100 + "%";
              }
            }
            function onDocMouseMove(e) {
              if (seeking) seekTo(e);
            }
            function onDocMouseUp() {
              seeking = false;
            }
            progressContainer.addEventListener("mousedown", (e) => {
              seeking = true;
              seekTo(e);
            });
            document.addEventListener("mousemove", onDocMouseMove);
            document.addEventListener("mouseup", onDocMouseUp);
            ctrlsBar.appendChild(progressContainer);
            const ctrlsRow = document.createElement("div");
            ctrlsRow.style.cssText = "display:flex;align-items:center;gap:8px;";
            const ppBtn = document.createElement("button");
            ppBtn.style.cssText = "background:none;border:none;color:white;font-size:16px;cursor:pointer;padding:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;";
            ppBtn.textContent = "\u275A\u275A";
            ppBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              if (expandedVideo.paused) expandedVideo.play().catch(() => {
              });
              else expandedVideo.pause();
            });
            ctrlsRow.appendChild(ppBtn);
            const timeDisplay = document.createElement("span");
            timeDisplay.style.cssText = "color:rgba(255,255,255,0.9);font-size:11px;font-family:monospace;min-width:70px;flex:1;";
            timeDisplay.textContent = "0:00 / 0:00";
            ctrlsRow.appendChild(timeDisplay);
            const nextBtn = document.createElement("button");
            nextBtn.style.cssText = "background:rgba(255,255,255,0.15);border:none;color:white;font-size:22px;cursor:pointer;padding:4px 12px;font-weight:700;letter-spacing:-1px;display:none;border-radius:4px;line-height:1;";
            nextBtn.innerHTML = "&#9654;&#9654;";
            nextBtn.title = "Next trailer";
            ctrlsRow.appendChild(nextBtn);
            ctrlsBar.appendChild(ctrlsRow);
            expandedPlayer.appendChild(ctrlsBar);
            imdbContent.appendChild(expandedPlayer);
            let playlist = [];
            let playlistIndex = -1;
            let savedScrollTop = 0;
            let savedCCHeight = "";
            let savedCCMaxHeight = "";
            let isExpanded = false;
            const trailerCache = this._trailerCache;
            function fmtTime(s) {
              if (!s || !isFinite(s)) return "0:00";
              const m = Math.floor(s / 60);
              return m + ":" + String(Math.floor(s % 60)).padStart(2, "0");
            }
            expandedVideo.addEventListener("timeupdate", () => {
              if (seeking) return;
              const dur = expandedVideo.duration;
              const cur = expandedVideo.currentTime;
              progressFill.style.width = (dur ? cur / dur * 100 : 0) + "%";
              timeDisplay.textContent = fmtTime(cur) + " / " + fmtTime(dur);
              const remaining = dur - cur;
              const hasNext = playlist.length > 0 && playlistIndex + 1 < playlist.length;
              if (dur && remaining <= COUNTDOWN_SECS && remaining > 0 && hasNext) {
                cdContainer.style.display = "block";
                closeBtn.style.display = "none";
                cdText.textContent = String(Math.ceil(remaining));
                progressCircle.setAttribute("stroke-dashoffset", String(circumference * (1 - remaining / COUNTDOWN_SECS)));
              } else {
                cdContainer.style.display = "none";
                closeBtn.style.display = "flex";
                progressCircle.setAttribute("stroke-dashoffset", "0");
              }
            });
            expandedVideo.addEventListener("play", () => {
              ppBtn.textContent = "\u275A\u275A";
            });
            expandedVideo.addEventListener("pause", () => {
              ppBtn.textContent = "\u25B6";
            });
            expandedVideo.addEventListener("click", (e) => {
              e.stopPropagation();
              if (expandedVideo.paused) expandedVideo.play().catch(() => {
              });
              else expandedVideo.pause();
            });
            expandedVideo.addEventListener("ended", () => {
              if (!playlist.length) return;
              const next = playlistIndex + 1;
              if (next < playlist.length) playAtIndex(next);
              else collapsePlayer();
            });
            nextBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              if (playlist.length && playlistIndex + 1 < playlist.length) playAtIndex(playlistIndex + 1);
            });
            async function playAtIndex(index, startTime) {
              if (index < 0 || index >= playlist.length) {
                collapsePlayer();
                return;
              }
              const movie = playlist[index];
              playlistIndex = index;
              expandedTitle.textContent = movie.title || "";
              progressFill.style.width = "0%";
              timeDisplay.textContent = "0:00 / 0:00";
              cdContainer.style.display = "none";
              progressCircle.setAttribute("stroke-dashoffset", "0");
              nextBtn.style.display = index + 1 < playlist.length ? "block" : "none";
              const trailer = trailerCache.get(movie.id);
              if (!trailer || !trailer.success) {
                if (index + 1 < playlist.length) playAtIndex(index + 1);
                else collapsePlayer();
                return;
              }
              expandedVideo.src = trailer.videoUrl;
              expandedVideo.muted = true;
              if (startTime && startTime > 0) {
                expandedVideo.addEventListener("loadeddata", function onLoaded() {
                  expandedVideo.removeEventListener("loadeddata", onLoaded);
                  expandedVideo.currentTime = startTime;
                  expandedVideo.play().then(() => {
                    expandedVideo.muted = !videoSoundEnabled;
                  }).catch(() => {
                  });
                });
              } else {
                expandedVideo.play().then(() => {
                  expandedVideo.muted = !videoSoundEnabled;
                }).catch(() => {
                });
              }
            }
            function expandPlayer(movie, startTime) {
              const contentContainer = imdbContent.closest(".wikihover-content-container");
              playlist = data.filter((m) => m.id);
              playlistIndex = movie ? playlist.findIndex((m) => m.id === movie.id) : 0;
              if (playlistIndex < 0) playlistIndex = 0;
              if (!isExpanded) {
                if (contentContainer) {
                  savedScrollTop = contentContainer.scrollTop;
                  savedCCHeight = contentContainer.style.getPropertyValue("height");
                  savedCCMaxHeight = contentContainer.style.getPropertyValue("max-height");
                }
                Array.from(imdbContent.children).forEach((child) => {
                  if (child !== expandedPlayer) {
                    child.dataset.savedDisplay = child.style.display;
                    child.style.display = "none";
                  }
                });
                if (expandedPlayer.parentNode !== imdbContent) imdbContent.appendChild(expandedPlayer);
                expandedPlayer.style.display = "block";
                const tooltipEl = contentContainer && contentContainer.closest(".wikihover-tooltip, .wikihover-pinned-tooltip");
                if (tooltipEl && contentContainer) {
                  const ccH = _getContentContainerHeight(tooltipEl, tooltipEl.offsetHeight);
                  contentContainer.style.setProperty("height", ccH + "px", "important");
                  contentContainer.style.setProperty("max-height", ccH + "px", "important");
                }
                expandedVideo.style.height = _getExpandedPlayerHeight(contentContainer) + "px";
                if (contentContainer) contentContainer.scrollTop = 0;
                isExpanded = true;
              }
              playAtIndex(playlistIndex, startTime);
            }
            function collapsePlayer() {
              document.removeEventListener("mousemove", onDocMouseMove);
              document.removeEventListener("mouseup", onDocMouseUp);
              expandedVideo.pause();
              expandedVideo.removeAttribute("src");
              expandedPlayer.style.display = "none";
              isExpanded = false;
              playlist = [];
              playlistIndex = -1;
              cdContainer.style.display = "none";
              nextBtn.style.display = "none";
              Array.from(imdbContent.children).forEach((child) => {
                if (child !== expandedPlayer && child.dataset.savedDisplay !== void 0) {
                  child.style.display = child.dataset.savedDisplay;
                  delete child.dataset.savedDisplay;
                }
              });
              const contentContainer = imdbContent.closest(".wikihover-content-container");
              if (contentContainer) {
                if (savedCCHeight) contentContainer.style.setProperty("height", savedCCHeight, "important");
                else contentContainer.style.removeProperty("height");
                if (savedCCMaxHeight) contentContainer.style.setProperty("max-height", savedCCMaxHeight, "important");
                else contentContainer.style.removeProperty("max-height");
                contentContainer.scrollTop = savedScrollTop;
              }
            }
            closeBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              collapsePlayer();
            });
            function renderMovies() {
              moviesContainer.innerHTML = "";
              const sortVal = sortSelect.value;
              const genreVal = genreSelect.value;
              const searchTerm = searchInput.value.trim().toLowerCase();
              let filtered = data;
              if (genreVal) filtered = filtered.filter((m) => m.genre && m.genre.toLowerCase().includes(genreVal.toLowerCase()));
              if (searchTerm) filtered = filtered.filter(
                (m) => m.title && m.title.toLowerCase().includes(searchTerm) || m.genre && m.genre.toLowerCase().includes(searchTerm) || m.plot && m.plot.toLowerCase().includes(searchTerm) || m.year && String(m.year).includes(searchTerm)
              );
              const sorted = [...filtered].sort((a, b) => {
                if (sortVal === "year-desc") return (b.year || 0) - (a.year || 0);
                if (sortVal === "year-asc") return (a.year || 0) - (b.year || 0);
                if (sortVal === "rating-desc") return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
                if (sortVal === "rating-asc") return (parseFloat(a.rating) || 0) - (parseFloat(b.rating) || 0);
                return 0;
              });
              if (!sorted.length) {
                const noRes = document.createElement("div");
                noRes.style.cssText = "padding:15px;text-align:center;color:var(--wh-text-muted);font-size:13px;";
                noRes.textContent = searchTerm ? "No movies match your search." : "No movies match the selected genre.";
                moviesContainer.appendChild(noRes);
              } else {
                sorted.forEach((movie) => createMovieCard(movie, moviesContainer, expandPlayer, trailerCache, videoSoundEnabled));
              }
            }
            sortSelect.addEventListener("change", renderMovies);
            genreSelect.addEventListener("change", renderMovies);
            searchInput.addEventListener("input", renderMovies);
            renderMovies();
          }
        }
        function createMovieCard(movie, container, onExpand, trailerCache, videoSoundEnabled) {
          const CARD_W = 140, POSTER_H = 200, CARD_GAP = 10;
          const card = document.createElement("div");
          card.dataset.movieCard = "1";
          card.style.cssText = `width:${CARD_W}px;flex-shrink:0;border-radius:6px;overflow:hidden;background:var(--wh-card-bg);box-shadow:0 1px 3px rgba(0,0,0,0.1);position:relative;transition:transform 0.3s ease,opacity 0.3s ease;`;
          const posterContainer = document.createElement("div");
          posterContainer.style.cssText = `position:relative;width:100%;height:${POSTER_H}px;overflow:hidden;cursor:pointer;`;
          const posterLink = document.createElement("a");
          posterLink.href = movie.url;
          posterLink.target = "_blank";
          posterLink.style.cssText = "display:block;width:100%;height:100%;";
          const poster = document.createElement("img");
          if (movie.poster) poster.src = movie.poster;
          poster.style.cssText = `width:100%;height:100%;object-fit:cover;display:block;transition:opacity 0.2s;${movie.poster ? "" : "visibility:hidden;"}`;
          if (!movie.poster) {
            const ph = document.createElement("div");
            ph.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--wh-text-muted);background:var(--wh-border);";
            ph.textContent = "No poster";
            posterContainer.appendChild(ph);
          }
          const playIcon = document.createElement("div");
          playIcon.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:32px;height:32px;background:rgba(0,0,0,0.7);border-radius:50%;display:none;align-items:center;justify-content:center;pointer-events:none;z-index:2;";
          playIcon.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="8,5 20,12 8,19"/></svg>';
          const videoOverlay = document.createElement("div");
          videoOverlay.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;background:#000;border-radius:6px;z-index:10;display:none;overflow:hidden;cursor:pointer;transition:width 0.3s ease,height 0.3s ease,left 0.3s ease;";
          const progressBar = document.createElement("div");
          progressBar.style.cssText = "position:absolute;bottom:0;left:0;height:3px;width:0%;background:#f5c518;z-index:13;border-radius:0 0 4px 4px;transition:width 0.3s ease;";
          let progressVal = 0, progressTimer = null;
          const startProgress = () => {
            progressVal = 0;
            progressBar.style.width = "0%";
            progressBar.style.opacity = "1";
            progressTimer = setInterval(() => {
              if (progressVal < 90) {
                progressVal += (90 - progressVal) * 0.12;
                progressBar.style.width = progressVal + "%";
              }
            }, 200);
          };
          const finishProgress = () => {
            if (progressTimer) {
              clearInterval(progressTimer);
              progressTimer = null;
            }
            progressBar.style.width = "100%";
            setTimeout(() => {
              progressBar.style.opacity = "0";
            }, 400);
          };
          const cancelProgress = () => {
            if (progressTimer) {
              clearInterval(progressTimer);
              progressTimer = null;
            }
            progressVal = 0;
            progressBar.style.width = "0%";
            progressBar.style.opacity = "0";
          };
          videoOverlay.appendChild(progressBar);
          const info = document.createElement("div");
          info.style.cssText = "padding:6px 8px;";
          const titleEl = document.createElement("div");
          titleEl.style.cssText = "font-size:11px;font-weight:600;color:var(--wh-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";
          titleEl.textContent = movie.title;
          const yearEl = document.createElement("div");
          yearEl.style.cssText = "font-size:10px;color:var(--wh-text-secondary);";
          yearEl.textContent = movie.year ? String(movie.year) : "";
          if (movie.rating) {
            const r = document.createElement("span");
            r.style.cssText = "font-size:10px;color:#f5c518;margin-left:4px;";
            r.textContent = "\u2605 " + movie.rating;
            yearEl.appendChild(r);
          }
          info.appendChild(titleEl);
          info.appendChild(yearEl);
          let trailerVideo = null, hoverTimer = null, expanded = false;
          function preventClick(e) {
            e.preventDefault();
            e.stopPropagation();
          }
          function getRowSiblings() {
            const allCards = container.querySelectorAll("[data-movie-card]");
            const myTop = card.offsetTop;
            return Array.from(allCards).filter((c) => Math.abs(c.offsetTop - myTop) < 5);
          }
          function expandToRow() {
            if (expanded) return;
            expanded = true;
            const slideD = CARD_W + CARD_GAP;
            const rowCards = getRowSiblings();
            const myIdx = rowCards.indexOf(card);
            rowCards.forEach((c, i) => {
              if (c === card) return;
              c.style.transform = `translateX(${i < myIdx ? -slideD : slideD}px)`;
              c.style.opacity = "0";
              c.style.pointerEvents = "none";
            });
            card.style.overflow = "visible";
            card.style.zIndex = "10";
            posterContainer.style.overflow = "visible";
            const cardRect = card.getBoundingClientRect();
            const gridRect = container.getBoundingClientRect();
            videoOverlay.style.left = -(cardRect.left - gridRect.left) + "px";
            videoOverlay.style.width = container.clientWidth + "px";
            videoOverlay.style.height = card.offsetHeight + "px";
            poster.style.opacity = "0";
            posterLink.addEventListener("click", preventClick);
          }
          function collapseFromRow() {
            if (!expanded) return;
            expanded = false;
            getRowSiblings().forEach((c) => {
              if (c === card) return;
              c.style.transform = "";
              c.style.opacity = "";
              c.style.pointerEvents = "";
            });
            card.style.overflow = "hidden";
            card.style.zIndex = "";
            posterContainer.style.overflow = "hidden";
            videoOverlay.style.left = "0";
            videoOverlay.style.width = "100%";
            videoOverlay.style.height = "100%";
            poster.style.opacity = "1";
            posterLink.removeEventListener("click", preventClick);
          }
          card.addEventListener("mouseenter", () => {
            if (movie.poster) poster.style.opacity = "0.8";
            hoverTimer = setTimeout(() => {
              const trailer = trailerCache.get(movie.id);
              if (!trailer || !trailer.success) return;
              startProgress();
              videoOverlay.style.display = "block";
              expandToRow();
              if (!trailerVideo) {
                trailerVideo = document.createElement("video");
                trailerVideo.src = trailer.videoUrl;
                trailerVideo.autoplay = true;
                trailerVideo.muted = true;
                trailerVideo.loop = true;
                trailerVideo.playsInline = true;
                trailerVideo.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:11;cursor:pointer;";
                videoOverlay.appendChild(trailerVideo);
                trailerVideo.addEventListener("playing", () => {
                  finishProgress();
                  trailerVideo.muted = !videoSoundEnabled;
                }, { once: true });
                trailerVideo.addEventListener("click", (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onExpand) onExpand(movie, trailerVideo.currentTime);
                });
              } else {
                finishProgress();
                trailerVideo.muted = true;
                trailerVideo.style.display = "block";
                trailerVideo.play().then(() => {
                  trailerVideo.muted = !videoSoundEnabled;
                }).catch(() => {
                });
              }
              playIcon.style.display = "none";
            }, 300);
          });
          card.addEventListener("mouseleave", () => {
            poster.style.opacity = "1";
            if (hoverTimer) {
              clearTimeout(hoverTimer);
              hoverTimer = null;
            }
            cancelProgress();
            collapseFromRow();
            if (trailerVideo) {
              trailerVideo.pause();
              trailerVideo.style.display = "none";
            }
            videoOverlay.style.display = "none";
          });
          posterLink.appendChild(poster);
          posterContainer.appendChild(posterLink);
          posterContainer.appendChild(playIcon);
          posterContainer.appendChild(videoOverlay);
          card.appendChild(posterContainer);
          card.appendChild(info);
          container.appendChild(card);
        }
        if (global.WikiHover) {
          global.WikiHover.registerFeedFactory("imdb", () => new ImdbModule());
        }
        global.WikiHoverImdbModule = ImdbModule;
      })(window);
    }
  });

  // agent/feeds/instagram.js
  var require_instagram = __commonJS({
    "agent/feeds/instagram.js"() {
      (function(global) {
        "use strict";
        function _getContentContainerHeight(tooltipEl, totalH) {
          let usedH = 0;
          const cc = tooltipEl.querySelector(".wikihover-content-container");
          const body = tooltipEl.querySelector(".wikihover-body");
          Array.from(tooltipEl.children).forEach((child) => {
            if (child !== cc && child !== body && child.classList && !child.classList.contains("wikihover-resize-handle")) {
              usedH += child.offsetHeight || 0;
            }
          });
          return Math.max(50, totalH - usedH - 4);
        }
        function _getExpandedPlayerHeight(contentContainer) {
          if (!contentContainer) return 350;
          const tooltipEl = contentContainer.closest(".wikihover-tooltip, .wikihover-pinned-tooltip");
          if (!tooltipEl) return 350;
          const tooltipH = tooltipEl.offsetHeight || tooltipEl.getBoundingClientRect().height;
          if (tooltipH < 100) return 350;
          const ccH = _getContentContainerHeight(tooltipEl, tooltipH);
          const style = getComputedStyle(contentContainer);
          const pad = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
          return Math.max(150, Math.floor(ccH - pad));
        }
        function formatCount(count) {
          if (count == null) return null;
          if (typeof count === "string") return count;
          if (count >= 1e6) return (count / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
          if (count >= 1e4) return (count / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
          if (count >= 1e3) return count.toLocaleString();
          return String(count);
        }
        function formatTime(sec) {
          if (!sec || !isFinite(sec)) return "0:00";
          const m = Math.floor(sec / 60);
          const s = Math.floor(sec % 60);
          return m + ":" + (s < 10 ? "0" : "") + s;
        }
        function proxyUrl(url) {
          if (!url) return "";
          return "https://wsrv.nl/?url=" + encodeURIComponent(url);
        }
        function createVideo() {
          const v = document.createElement("video");
          v.setAttribute("referrerpolicy", "no-referrer");
          return v;
        }
        function normaliseItem(raw) {
          const postContent = raw.post_content || [];
          const videosArr = raw.videos || [];
          const photosArr = raw.photos || [];
          const videoFromContent = postContent.find((c) => c.type === "Video");
          const firstVideoUrl = raw.video_url || (videosArr.length > 0 ? videosArr[0] : null) || (videoFromContent ? videoFromContent.url : null);
          const ct = (raw.content_type || "").toLowerCase();
          const isClip = raw.product_type === "clips" || ct === "video" || ct === "reel" || !!firstVideoUrl;
          const isReel = raw.product_type === "clips" || ct === "reel" || (raw.upstream || "").toLowerCase() === "reels";
          const allPhotos = photosArr.length > 0 ? photosArr : postContent.filter((c) => c.type === "Photo").map((c) => c.url);
          return {
            shortcode: raw.shortcode || "",
            url: raw.url || "",
            thumbnailUrl: raw.thumbnail || "",
            displayUrl: (allPhotos.length > 0 ? allPhotos[0] : null) || raw.thumbnail || "",
            isVideo: isClip,
            isReel,
            videoUrl: firstVideoUrl,
            caption: raw.description || "",
            likes: raw.likes || 0,
            comments: raw.num_comments || 0,
            views: raw.views || raw.video_play_count || (raw.video_view_count ? parseInt(raw.video_view_count, 10) || 0 : 0),
            timestamp: raw.date_posted ? new Date(raw.date_posted).getTime() / 1e3 : 0,
            // Profile info (per-item in new format)
            userPosted: raw.user_posted || "",
            profileImageLink: raw.profile_image_link || "",
            followers: raw.followers || 0,
            postsCount: raw.posts_count || 0,
            isVerified: raw.is_verified || false,
            profileUrl: raw.user_profile_url || `https://www.instagram.com/${raw.user_posted || ""}`,
            // All photos (for carousel / image posts)
            photos: allPhotos,
            // Raw for anything else
            _raw: raw
          };
        }
        class InstagramModule extends global.WikiHoverFeedModule {
          get key() {
            return "instagram";
          }
          get label() {
            return "Instagram";
          }
          get icon() {
            return "\u{1F4F7}";
          }
          render(sourceResult, container) {
            var _a;
            if (!sourceResult || sourceResult.status === "error") {
              this._renderUnavailable(container, ((_a = sourceResult == null ? void 0 : sourceResult.error) == null ? void 0 : _a.message) || "Instagram not available");
              return;
            }
            const items = sourceResult.items || [];
            if (!items.length) {
              this._renderUnavailable(container, "No Instagram results found");
              return;
            }
            const normalised = items.map(normaliseItem);
            const videoSoundEnabled = window._whVideoSoundEnabled !== void 0 ? window._whVideoSoundEnabled : true;
            this._buildUI(container, normalised, videoSoundEnabled);
          }
          _buildUI(container, allItems, videoSoundEnabled) {
            container.innerHTML = "";
            const profileSource = allItems.find((i) => i.userPosted) || allItems[0];
            const profileUrl = profileSource.profileUrl || "";
            const headerContainer = document.createElement("div");
            headerContainer.style.cssText = "display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding:0 0 10px 0;border-bottom:1px solid var(--wh-border-light, #eee);";
            const personName = document.createElement("h3");
            personName.style.cssText = "margin:0;font-size:16px;color:var(--wh-text);font-weight:600;";
            personName.textContent = "Instagram";
            headerContainer.appendChild(personName);
            container.appendChild(headerContainer);
            const profileCard = document.createElement("div");
            profileCard.className = "wikihover-instagram-profile";
            if (profileSource.profileImageLink) {
              const img = document.createElement("img");
              img.src = proxyUrl(profileSource.profileImageLink);
              img.alt = profileSource.userPosted;
              img.className = "wikihover-instagram-avatar";
              profileCard.appendChild(img);
            } else {
              const avatarEl = document.createElement("div");
              avatarEl.className = "wikihover-instagram-avatar";
              avatarEl.style.cssText = "background:var(--wh-card-bg);display:flex;align-items:center;justify-content:center;font-size:24px;color:var(--wh-text-muted);";
              avatarEl.textContent = (profileSource.userPosted || "?")[0].toUpperCase();
              profileCard.appendChild(avatarEl);
            }
            const infoDiv = document.createElement("div");
            infoDiv.className = "wikihover-instagram-info";
            const displayNameEl = document.createElement("h4");
            displayNameEl.style.cssText = "margin:0;font-size:15px;color:var(--wh-content-text);";
            displayNameEl.textContent = profileSource.userPosted;
            if (profileSource.isVerified) {
              const badge = document.createElement("span");
              badge.textContent = " \u2713";
              badge.style.cssText = "color:#3897f0;font-weight:bold;";
              displayNameEl.appendChild(badge);
            }
            infoDiv.appendChild(displayNameEl);
            const usernameEl = document.createElement("span");
            usernameEl.textContent = `@${profileSource.userPosted}`;
            usernameEl.style.cssText = "color:var(--wh-text-muted);font-size:13px;";
            infoDiv.appendChild(usernameEl);
            profileCard.appendChild(infoDiv);
            container.appendChild(profileCard);
            if (profileSource.followers || profileSource.postsCount) {
              const statsRow = document.createElement("div");
              statsRow.className = "wikihover-instagram-stats";
              if (profileSource.postsCount) {
                const span = document.createElement("span");
                span.innerHTML = `<strong>${formatCount(profileSource.postsCount)}</strong> posts`;
                statsRow.appendChild(span);
              }
              if (profileSource.followers) {
                const span = document.createElement("span");
                span.innerHTML = `<strong>${formatCount(profileSource.followers)}</strong> followers`;
                statsRow.appendChild(span);
              }
              container.appendChild(statsRow);
            }
            const posts = allItems.filter((i) => !i.isReel);
            const reels = allItems.filter((i) => i.isReel);
            const expandedPlayer = document.createElement("div");
            expandedPlayer.className = "wikihover-reel-expanded-player";
            expandedPlayer.style.cssText = "display:none;position:relative;background:#000;border-radius:6px;overflow:hidden;cursor:pointer;";
            const igCC = container.closest(".wikihover-content-container");
            const videoH = _getExpandedPlayerHeight(igCC);
            const expandedVideo = createVideo();
            expandedVideo.style.cssText = `width:100%;height:${videoH}px;object-fit:contain;background:#000;display:block;`;
            expandedVideo.muted = !videoSoundEnabled;
            expandedVideo.loop = false;
            expandedVideo.playsInline = true;
            expandedVideo.preload = "auto";
            expandedPlayer.appendChild(expandedVideo);
            const expandedImage = document.createElement("img");
            expandedImage.style.cssText = `width:100%;height:${videoH}px;object-fit:contain;background:#000;display:none;position:absolute;top:0;left:0;`;
            expandedPlayer.appendChild(expandedImage);
            const imageInfoOverlay = document.createElement("div");
            imageInfoOverlay.style.cssText = "position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.85));color:white;padding:30px 14px 12px;z-index:10;display:none;";
            const imageCaption = document.createElement("div");
            imageCaption.style.cssText = "font-size:12px;line-height:1.4;margin-bottom:6px;max-height:60px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;";
            imageInfoOverlay.appendChild(imageCaption);
            const imageStatsRow = document.createElement("div");
            imageStatsRow.style.cssText = "display:flex;align-items:center;gap:12px;font-size:11px;color:rgba(255,255,255,0.9);margin-bottom:6px;";
            imageInfoOverlay.appendChild(imageStatsRow);
            const imageIGLink = document.createElement("a");
            imageIGLink.style.cssText = "color:#E1306C;font-size:11px;text-decoration:none;font-weight:600;";
            imageIGLink.textContent = "Open on Instagram \u2197";
            imageIGLink.target = "_blank";
            imageIGLink.rel = "noopener";
            imageIGLink.addEventListener("click", (e) => e.stopPropagation());
            imageInfoOverlay.appendChild(imageIGLink);
            expandedPlayer.appendChild(imageInfoOverlay);
            const createNavArrow = (direction) => {
              const arrow = document.createElement("div");
              arrow.style.cssText = `position:absolute;top:50%;${direction === "prev" ? "left:8px" : "right:8px"};transform:translateY(-50%);width:32px;height:32px;background:rgba(0,0,0,0.6);color:white;border-radius:50%;display:none;align-items:center;justify-content:center;font-size:16px;cursor:pointer;z-index:15;transition:background 0.2s;`;
              arrow.textContent = direction === "prev" ? "\u276E" : "\u276F";
              arrow.title = direction === "prev" ? "Previous" : "Next";
              arrow.addEventListener("mouseenter", () => {
                arrow.style.background = "rgba(0,0,0,0.85)";
              });
              arrow.addEventListener("mouseleave", () => {
                arrow.style.background = "rgba(0,0,0,0.6)";
              });
              return arrow;
            };
            const imgPrevArrow = createNavArrow("prev");
            const imgNextArrow = createNavArrow("next");
            expandedPlayer.appendChild(imgPrevArrow);
            expandedPlayer.appendChild(imgNextArrow);
            const closeBtn = document.createElement("div");
            closeBtn.style.cssText = "position:absolute;top:8px;right:8px;width:28px;height:28px;background:rgba(0,0,0,0.6);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;z-index:15;line-height:1;transition:background 0.2s;";
            closeBtn.textContent = "\xD7";
            closeBtn.title = "Close player";
            closeBtn.addEventListener("mouseenter", () => {
              closeBtn.style.background = "rgba(0,0,0,0.85)";
            });
            closeBtn.addEventListener("mouseleave", () => {
              closeBtn.style.background = "rgba(0,0,0,0.6)";
            });
            expandedPlayer.appendChild(closeBtn);
            const COUNTDOWN_SECS = 5;
            const cdContainer = document.createElement("div");
            cdContainer.style.cssText = "position:absolute;top:10px;right:10px;width:36px;height:36px;z-index:12;display:none;";
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "36");
            svg.setAttribute("height", "36");
            svg.setAttribute("viewBox", "0 0 36 36");
            const bgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            bgCircle.setAttribute("cx", "18");
            bgCircle.setAttribute("cy", "18");
            bgCircle.setAttribute("r", "15");
            bgCircle.setAttribute("fill", "rgba(0,0,0,0.6)");
            bgCircle.setAttribute("stroke", "rgba(255,255,255,0.3)");
            bgCircle.setAttribute("stroke-width", "2");
            svg.appendChild(bgCircle);
            const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            progressCircle.setAttribute("cx", "18");
            progressCircle.setAttribute("cy", "18");
            progressCircle.setAttribute("r", "15");
            progressCircle.setAttribute("fill", "none");
            progressCircle.setAttribute("stroke", "#E1306C");
            progressCircle.setAttribute("stroke-width", "2.5");
            progressCircle.setAttribute("stroke-linecap", "round");
            const circumference = 2 * Math.PI * 15;
            progressCircle.setAttribute("stroke-dasharray", String(circumference));
            progressCircle.setAttribute("stroke-dashoffset", "0");
            progressCircle.style.transform = "rotate(-90deg)";
            progressCircle.style.transformOrigin = "50% 50%";
            progressCircle.style.transition = "stroke-dashoffset 0.25s linear";
            svg.appendChild(progressCircle);
            const cdText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            cdText.setAttribute("x", "18");
            cdText.setAttribute("y", "22");
            cdText.setAttribute("text-anchor", "middle");
            cdText.setAttribute("fill", "white");
            cdText.setAttribute("font-size", "13");
            cdText.setAttribute("font-weight", "600");
            cdText.textContent = "5";
            svg.appendChild(cdText);
            cdContainer.appendChild(svg);
            expandedPlayer.appendChild(cdContainer);
            const controlsBar = document.createElement("div");
            controlsBar.style.cssText = "position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.85));padding:6px 10px 8px;z-index:10;display:flex;flex-direction:column;gap:4px;";
            controlsBar.addEventListener("click", (e) => e.stopPropagation());
            const progressContainer = document.createElement("div");
            progressContainer.style.cssText = "width:100%;height:4px;background:rgba(255,255,255,0.3);border-radius:2px;cursor:pointer;position:relative;";
            const progressFill = document.createElement("div");
            progressFill.style.cssText = "height:100%;background:#E1306C;border-radius:2px;width:0%;transition:width 0.1s linear;pointer-events:none;";
            progressContainer.appendChild(progressFill);
            let isSeeking = false;
            function seekTo(e) {
              const rect = progressContainer.getBoundingClientRect();
              const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              if (expandedVideo.duration) {
                expandedVideo.currentTime = pct * expandedVideo.duration;
                progressFill.style.width = pct * 100 + "%";
              }
            }
            function onDocMouseMove(e) {
              if (isSeeking) seekTo(e);
            }
            function onDocMouseUp() {
              isSeeking = false;
            }
            progressContainer.addEventListener("mousedown", (e) => {
              isSeeking = true;
              seekTo(e);
            });
            document.addEventListener("mousemove", onDocMouseMove);
            document.addEventListener("mouseup", onDocMouseUp);
            controlsBar.appendChild(progressContainer);
            const controlsRow = document.createElement("div");
            controlsRow.style.cssText = "display:flex;align-items:center;gap:8px;";
            const playPauseBtn = document.createElement("button");
            playPauseBtn.className = "wikihover-player-btn";
            playPauseBtn.style.cssText = "background:none;border:none;color:white;font-size:16px;cursor:pointer;padding:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;";
            playPauseBtn.textContent = "\u275A\u275A";
            playPauseBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              if (expandedVideo.paused) expandedVideo.play().catch(() => {
              });
              else expandedVideo.pause();
            });
            controlsRow.appendChild(playPauseBtn);
            const timeDisplay = document.createElement("span");
            timeDisplay.style.cssText = "color:rgba(255,255,255,0.9);font-size:11px;font-family:monospace;min-width:70px;flex:1;";
            timeDisplay.textContent = "0:00 / 0:00";
            controlsRow.appendChild(timeDisplay);
            const prevBtn = document.createElement("button");
            prevBtn.className = "wikihover-next-btn";
            prevBtn.style.cssText = "background:rgba(255,255,255,0.15);border:none;color:white;font-size:22px;cursor:pointer;padding:4px 12px;font-weight:700;letter-spacing:-1px;display:none;border-radius:4px;line-height:1;transform:scaleX(-1);";
            prevBtn.innerHTML = "&#9654;&#9654;";
            prevBtn.title = "Previous";
            controlsRow.appendChild(prevBtn);
            const nextBtn = document.createElement("button");
            nextBtn.className = "wikihover-next-btn";
            nextBtn.style.cssText = "background:rgba(255,255,255,0.15);border:none;color:white;font-size:22px;cursor:pointer;padding:4px 12px;font-weight:700;letter-spacing:-1px;display:none;border-radius:4px;line-height:1;";
            nextBtn.innerHTML = "&#9654;&#9654;";
            nextBtn.title = "Next";
            controlsRow.appendChild(nextBtn);
            controlsBar.appendChild(controlsRow);
            expandedPlayer.appendChild(controlsBar);
            const expandedStats = document.createElement("div");
            expandedStats.style.cssText = "position:absolute;top:0;left:0;right:0;background:linear-gradient(rgba(0,0,0,0.6),transparent);color:white;font-size:11px;padding:8px 12px;display:flex;gap:12px;";
            expandedPlayer.appendChild(expandedStats);
            container.appendChild(expandedPlayer);
            let currentExpandItem = null;
            let savedScrollTop = 0;
            let savedCCHeight = "";
            let savedCCMaxHeight = "";
            let expandedPlaylist = [];
            let expandedPlaylistIndex = -1;
            let expandedIsReel = false;
            function expandItem(item, isReel, playlist, index, startTime) {
              if (!currentExpandItem) {
                const cc = container.closest(".wikihover-content-container");
                if (cc) {
                  savedScrollTop = cc.scrollTop;
                  savedCCHeight = cc.style.getPropertyValue("height");
                  savedCCMaxHeight = cc.style.getPropertyValue("max-height");
                }
                Array.from(container.children).forEach((child) => {
                  if (child !== expandedPlayer) {
                    child.dataset.savedDisplay = child.style.display;
                    child.style.display = "none";
                  }
                });
                if (expandedPlayer.parentNode !== container) container.appendChild(expandedPlayer);
                expandedPlayer.style.display = "block";
                const tooltipEl = cc && cc.closest(".wikihover-tooltip, .wikihover-pinned-tooltip");
                if (tooltipEl && cc) {
                  const ccH = _getContentContainerHeight(tooltipEl, tooltipEl.offsetHeight);
                  cc.style.setProperty("height", ccH + "px", "important");
                  cc.style.setProperty("max-height", ccH + "px", "important");
                }
                const h = _getExpandedPlayerHeight(cc);
                expandedPlayer.style.height = h + "px";
                expandedPlayer.style.maxHeight = h + "px";
                expandedVideo.style.height = h + "px";
                expandedImage.style.height = h + "px";
                if (cc) cc.scrollTop = 0;
              }
              if (playlist) {
                expandedPlaylist = playlist;
                expandedPlaylistIndex = index != null ? index : -1;
                expandedIsReel = isReel;
              }
              const hasPrev = expandedPlaylistIndex > 0;
              const hasNext = expandedPlaylist.length > 0 && expandedPlaylistIndex + 1 < expandedPlaylist.length;
              currentExpandItem = { item, isReel };
              if (item.isVideo) {
                expandedImage.style.display = "none";
                imageInfoOverlay.style.display = "none";
                imgPrevArrow.style.display = "none";
                imgNextArrow.style.display = "none";
                expandedVideo.style.display = "block";
                controlsBar.style.display = "flex";
                expandedStats.innerHTML = "";
                if (item.views) {
                  const s = document.createElement("span");
                  s.textContent = "\u25B6 " + formatCount(item.views);
                  expandedStats.appendChild(s);
                }
                if (item.likes) {
                  const s = document.createElement("span");
                  s.textContent = "\u2764 " + formatCount(item.likes);
                  expandedStats.appendChild(s);
                }
                expandedStats.style.display = "flex";
                progressFill.style.width = "0%";
                timeDisplay.textContent = "0:00 / 0:00";
                cdContainer.style.display = "none";
                prevBtn.style.display = hasPrev ? "block" : "none";
                nextBtn.style.display = hasNext ? "block" : "none";
                const seekTime = startTime && startTime > 0 ? startTime : 0;
                if (item.videoUrl) {
                  const srcChanged = expandedVideo.src !== item.videoUrl;
                  if (srcChanged) expandedVideo.src = item.videoUrl;
                  if (srcChanged) {
                    expandedVideo.addEventListener("loadeddata", function onLoaded() {
                      expandedVideo.removeEventListener("loadeddata", onLoaded);
                      if (seekTime > 0) expandedVideo.currentTime = seekTime;
                      expandedVideo.play().then(() => {
                        expandedVideo.muted = !videoSoundEnabled;
                      }).catch(() => {
                      });
                    });
                  } else {
                    if (seekTime > 0) expandedVideo.currentTime = seekTime;
                    expandedVideo.play().then(() => {
                      expandedVideo.muted = !videoSoundEnabled;
                    }).catch(() => {
                    });
                  }
                }
              } else {
                expandedVideo.pause();
                expandedVideo.style.display = "none";
                controlsBar.style.display = "none";
                expandedStats.style.display = "none";
                cdContainer.style.display = "none";
                expandedImage.style.display = "block";
                imageInfoOverlay.style.display = "block";
                imgPrevArrow.style.display = hasPrev ? "flex" : "none";
                imgNextArrow.style.display = hasNext ? "flex" : "none";
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
                const cc = container.closest(".wikihover-content-container");
                expandedImage.style.height = _getExpandedPlayerHeight(cc) + "px";
                expandedImage.src = proxyUrl(item.displayUrl || item.thumbnailUrl || "");
                imageCaption.textContent = item.caption || "";
                imageCaption.style.display = item.caption ? "-webkit-box" : "none";
                imageStatsRow.innerHTML = "";
                if (item.likes) {
                  const s = document.createElement("span");
                  s.textContent = "\u2764 " + formatCount(item.likes);
                  imageStatsRow.appendChild(s);
                }
                if (item.comments) {
                  const s = document.createElement("span");
                  s.textContent = "\u{1F4AC} " + formatCount(item.comments);
                  imageStatsRow.appendChild(s);
                }
                imageIGLink.href = item.url || `https://www.instagram.com/p/${item.shortcode}/`;
              }
            }
            function collapseVideoPlayer() {
              document.removeEventListener("mousemove", onDocMouseMove);
              document.removeEventListener("mouseup", onDocMouseUp);
              expandedVideo.pause();
              expandedVideo.removeAttribute("src");
              expandedPlayer.style.display = "none";
              expandedPlayer.style.height = "";
              expandedPlayer.style.maxHeight = "";
              currentExpandItem = null;
              expandedPlaylist = [];
              expandedPlaylistIndex = -1;
              cdContainer.style.display = "none";
              prevBtn.style.display = "none";
              nextBtn.style.display = "none";
              expandedImage.style.display = "none";
              expandedImage.src = "";
              imageInfoOverlay.style.display = "none";
              imgPrevArrow.style.display = "none";
              imgNextArrow.style.display = "none";
              Array.from(container.children).forEach((child) => {
                if (child !== expandedPlayer && child.dataset.savedDisplay !== void 0) {
                  child.style.display = child.dataset.savedDisplay;
                  delete child.dataset.savedDisplay;
                }
              });
              const cc = container.closest(".wikihover-content-container");
              if (cc) {
                if (savedCCHeight) cc.style.setProperty("height", savedCCHeight, "important");
                else cc.style.removeProperty("height");
                if (savedCCMaxHeight) cc.style.setProperty("max-height", savedCCMaxHeight, "important");
                else cc.style.removeProperty("max-height");
                cc.scrollTop = savedScrollTop;
              }
            }
            closeBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              collapseVideoPlayer();
            });
            imgPrevArrow.addEventListener("click", (e) => {
              e.stopPropagation();
              if (expandedPlaylistIndex > 0) {
                expandedPlaylistIndex--;
                expandItem(expandedPlaylist[expandedPlaylistIndex], expandedIsReel, expandedPlaylist, expandedPlaylistIndex);
              }
            });
            imgNextArrow.addEventListener("click", (e) => {
              e.stopPropagation();
              if (expandedPlaylistIndex + 1 < expandedPlaylist.length) {
                expandedPlaylistIndex++;
                expandItem(expandedPlaylist[expandedPlaylistIndex], expandedIsReel, expandedPlaylist, expandedPlaylistIndex);
              }
            });
            prevBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              if (expandedPlaylistIndex > 0) {
                expandedPlaylistIndex--;
                expandItem(expandedPlaylist[expandedPlaylistIndex], expandedIsReel, expandedPlaylist, expandedPlaylistIndex);
              }
            });
            nextBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              if (expandedPlaylistIndex + 1 < expandedPlaylist.length) {
                expandedPlaylistIndex++;
                expandItem(expandedPlaylist[expandedPlaylistIndex], expandedIsReel, expandedPlaylist, expandedPlaylistIndex);
              }
            });
            expandedVideo.addEventListener("timeupdate", () => {
              if (isSeeking) return;
              const dur = expandedVideo.duration;
              const cur = expandedVideo.currentTime;
              progressFill.style.width = (dur ? cur / dur * 100 : 0) + "%";
              timeDisplay.textContent = formatTime(cur) + " / " + formatTime(dur);
              const remaining = dur - cur;
              const hasNext = expandedPlaylist.length > 0 && expandedPlaylistIndex + 1 < expandedPlaylist.length;
              if (dur && remaining <= COUNTDOWN_SECS && remaining > 0 && hasNext) {
                cdContainer.style.display = "block";
                closeBtn.style.display = "none";
                cdText.textContent = String(Math.ceil(remaining));
                progressCircle.setAttribute("stroke-dashoffset", String(circumference * (1 - remaining / COUNTDOWN_SECS)));
              } else {
                cdContainer.style.display = "none";
                closeBtn.style.display = "flex";
                progressCircle.setAttribute("stroke-dashoffset", "0");
              }
            });
            expandedVideo.addEventListener("play", () => {
              playPauseBtn.textContent = "\u275A\u275A";
            });
            expandedVideo.addEventListener("pause", () => {
              playPauseBtn.textContent = "\u25B6";
            });
            expandedVideo.addEventListener("click", (e) => {
              e.stopPropagation();
              if (expandedVideo.paused) expandedVideo.play().catch(() => {
              });
              else expandedVideo.pause();
            });
            expandedVideo.addEventListener("ended", () => {
              if (!currentExpandItem || expandedPlaylist.length === 0) return;
              const next = expandedPlaylistIndex + 1;
              if (next < expandedPlaylist.length) {
                expandedPlaylistIndex = next;
                expandItem(expandedPlaylist[next], expandedIsReel, expandedPlaylist, next);
              } else {
                collapseVideoPlayer();
              }
            });
            function setupVideoCell(cell, item, overlay, iconEl, isReel, playlist, cellGrid) {
              let videoOverlay = null;
              let videoEl = null;
              let hoverTimeout = null;
              let isHovering = false;
              let cellExpanded = false;
              function getIGRowSiblings() {
                if (!cellGrid) return [cell];
                const allCells = Array.from(cellGrid.querySelectorAll(".wikihover-instagram-media-item"));
                const myTop = cell.offsetTop;
                return allCells.filter((c) => Math.abs(c.offsetTop - myTop) < 5);
              }
              function expandIGToGrid() {
                if (cellExpanded || !cellGrid || !videoOverlay) return;
                cellExpanded = true;
                const allCells = Array.from(cellGrid.querySelectorAll(".wikihover-instagram-media-item"));
                allCells.forEach((c) => {
                  if (c === cell) return;
                  c.style.transition = "opacity 0.3s ease";
                  c.style.opacity = "0";
                  c.style.pointerEvents = "none";
                });
                cell.style.overflow = "visible";
                cell.style.zIndex = "10";
                cellGrid.style.overflow = "visible";
                const cellRect = cell.getBoundingClientRect();
                const gridRect = cellGrid.getBoundingClientRect();
                const cc = container.closest(".wikihover-content-container");
                let expandH = cellGrid.clientHeight;
                let topOffset = -(cellRect.top - gridRect.top);
                if (cc) {
                  const ccRect = cc.getBoundingClientRect();
                  expandH = Math.min(expandH, cc.clientHeight);
                  expandH = Math.max(expandH, cell.offsetHeight);
                  const overflowBottom = gridRect.top + topOffset + expandH - ccRect.bottom;
                  if (overflowBottom > 0) topOffset -= overflowBottom;
                  topOffset = Math.max(-(cellRect.top - ccRect.top), topOffset);
                }
                videoOverlay.style.left = -(cellRect.left - gridRect.left) + "px";
                videoOverlay.style.top = topOffset + "px";
                videoOverlay.style.width = cellGrid.clientWidth + "px";
                videoOverlay.style.height = expandH + "px";
              }
              function collapseIGFromGrid() {
                if (!cellExpanded) return;
                cellExpanded = false;
                const allCells = Array.from(cellGrid.querySelectorAll(".wikihover-instagram-media-item"));
                allCells.forEach((c) => {
                  if (c === cell) return;
                  c.style.opacity = "";
                  c.style.pointerEvents = "";
                });
                if (videoOverlay) {
                  videoOverlay.style.left = "0";
                  videoOverlay.style.top = "0";
                  videoOverlay.style.width = "100%";
                  videoOverlay.style.height = "100%";
                }
                setTimeout(() => {
                  if (!cellExpanded) {
                    cell.style.overflow = "hidden";
                    cell.style.zIndex = "";
                    if (cellGrid) cellGrid.style.overflow = "";
                    if (videoOverlay) videoOverlay.style.display = "none";
                  }
                }, 350);
              }
              cell.addEventListener("mouseenter", () => {
                isHovering = true;
                overlay.style.opacity = "1";
                hoverTimeout = setTimeout(() => {
                  if (!isHovering || !item.videoUrl) return;
                  if (!videoOverlay) {
                    videoOverlay = document.createElement("div");
                    videoOverlay.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;background:#000;border-radius:4px;z-index:4;overflow:hidden;cursor:pointer;transition:width 0.3s ease,height 0.3s ease,left 0.3s ease,top 0.3s ease;";
                    videoEl = createVideo();
                    videoEl.src = item.videoUrl;
                    videoEl.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;";
                    videoEl.muted = !videoSoundEnabled;
                    videoEl.loop = true;
                    videoEl.playsInline = true;
                    videoEl.preload = "auto";
                    videoOverlay.appendChild(videoEl);
                    cell.appendChild(videoOverlay);
                    void videoOverlay.offsetWidth;
                    expandIGToGrid();
                    videoEl.play().then(() => {
                      if (iconEl) iconEl.style.opacity = "0";
                    }).catch(() => {
                    });
                  } else {
                    videoOverlay.style.display = "block";
                    videoOverlay.style.left = "0";
                    videoOverlay.style.width = "100%";
                    videoOverlay.style.height = "100%";
                    void videoOverlay.offsetWidth;
                    expandIGToGrid();
                    videoEl.play().then(() => {
                      if (iconEl) iconEl.style.opacity = "0";
                    }).catch(() => {
                    });
                  }
                }, 300);
              });
              cell.addEventListener("mouseleave", () => {
                isHovering = false;
                overlay.style.opacity = "0";
                clearTimeout(hoverTimeout);
                if (videoEl) videoEl.pause();
                if (iconEl) iconEl.style.opacity = "1";
                collapseIGFromGrid();
              });
              cell.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                isHovering = false;
                const thumbTime = videoEl && videoEl.currentTime ? videoEl.currentTime : 0;
                if (videoEl) {
                  videoEl.pause();
                  videoEl.style.display = "none";
                }
                if (iconEl) iconEl.style.opacity = "1";
                const idx = playlist ? playlist.indexOf(item) : -1;
                expandItem(item, isReel, playlist || [], idx, thumbTime);
              });
            }
            function createPostCell(item, grid, postPlaylist) {
              const cell = document.createElement("div");
              cell.className = "wikihover-instagram-media-item";
              cell.title = item.caption ? item.caption.substring(0, 100) : "";
              cell.style.cssText = "cursor:pointer;position:relative;background:var(--wh-card-bg);";
              let videoIcon = null;
              if (item.isVideo) {
                videoIcon = document.createElement("div");
                videoIcon.style.cssText = "position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.6);color:white;border-radius:3px;padding:1px 4px;font-size:10px;z-index:2;pointer-events:none;transition:opacity 0.2s;";
                videoIcon.textContent = "\u25B6";
                cell.appendChild(videoIcon);
              }
              if (item.thumbnailUrl) {
                const img = document.createElement("img");
                img.src = proxyUrl(item.thumbnailUrl);
                img.alt = item.caption ? item.caption.substring(0, 50) : "Post";
                img.style.cssText = "width:100%;height:100%;object-fit:cover;";
                cell.insertBefore(img, cell.firstChild);
              }
              const overlay = document.createElement("div");
              overlay.style.cssText = "position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.6));color:white;font-size:10px;padding:3px 5px;opacity:0;transition:opacity 0.2s;z-index:3;";
              overlay.textContent = item.likes ? "\u2764 " + formatCount(item.likes) : "";
              cell.appendChild(overlay);
              if (item.isVideo) {
                setupVideoCell(cell, item, overlay, videoIcon, item.isReel, postPlaylist, grid);
              } else {
                cell.addEventListener("mouseenter", () => {
                  overlay.style.opacity = "1";
                });
                cell.addEventListener("mouseleave", () => {
                  overlay.style.opacity = "0";
                });
                cell.addEventListener("click", () => {
                  const idx = postPlaylist ? postPlaylist.indexOf(item) : -1;
                  expandItem(item, false, postPlaylist || [], idx);
                });
              }
              grid.appendChild(cell);
            }
            function createReelCell(item, grid, reelPlaylist) {
              const cell = document.createElement("div");
              cell.className = "wikihover-instagram-media-item";
              cell.title = item.caption ? item.caption.substring(0, 100) : "";
              cell.style.cssText = "cursor:pointer;position:relative;background:var(--wh-card-bg);";
              const playIcon = document.createElement("div");
              playIcon.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.5);color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;z-index:2;pointer-events:none;transition:opacity 0.2s;";
              playIcon.textContent = "\u25B6";
              cell.appendChild(playIcon);
              if (item.thumbnailUrl) {
                const img = document.createElement("img");
                img.src = proxyUrl(item.thumbnailUrl);
                img.alt = "Reel";
                img.style.cssText = "width:100%;height:100%;object-fit:cover;";
                cell.insertBefore(img, cell.firstChild);
              }
              const overlay = document.createElement("div");
              overlay.style.cssText = "position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.6));color:white;font-size:10px;padding:3px 5px;opacity:0;transition:opacity 0.2s;z-index:3;";
              overlay.textContent = item.views ? "\u25B6 " + formatCount(item.views) : "";
              cell.appendChild(overlay);
              setupVideoCell(cell, item, overlay, playIcon, true, reelPlaylist, grid);
              grid.appendChild(cell);
            }
            if (posts.length > 0) {
              const postsSection = document.createElement("div");
              postsSection.style.marginTop = "10px";
              const postsLabel = document.createElement("div");
              postsLabel.style.cssText = "font-size:12px;font-weight:600;color:var(--wh-text-secondary);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;";
              postsLabel.textContent = "Recent Posts";
              postsSection.appendChild(postsLabel);
              const grid = document.createElement("div");
              grid.className = "wikihover-instagram-grid";
              const postPlaylist = [...posts];
              posts.forEach((item) => createPostCell(item, grid, postPlaylist));
              postsSection.appendChild(grid);
              container.appendChild(postsSection);
            }
            if (reels.length > 0) {
              const reelsSection = document.createElement("div");
              reelsSection.style.marginTop = "10px";
              const reelsLabel = document.createElement("div");
              reelsLabel.style.cssText = "font-size:12px;font-weight:600;color:var(--wh-text-secondary);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;";
              reelsLabel.textContent = "Reels";
              reelsSection.appendChild(reelsLabel);
              const grid = document.createElement("div");
              grid.className = "wikihover-instagram-grid";
              const reelPlaylist = [...reels];
              reels.forEach((item) => createReelCell(item, grid, reelPlaylist));
              reelsSection.appendChild(grid);
              container.appendChild(reelsSection);
            }
            if (posts.length === 0 && reels.length === 0) {
              const noMediaBox = document.createElement("div");
              noMediaBox.style.cssText = "margin:10px 0;padding:12px;background:var(--wh-card-bg);border-radius:8px;text-align:center;";
              const msg = document.createElement("div");
              msg.style.cssText = "color:var(--wh-text-secondary);font-size:12px;margin-bottom:10px;";
              msg.textContent = "No posts or reels available.";
              noMediaBox.appendChild(msg);
              container.appendChild(noMediaBox);
            }
            if (profileUrl) {
              const viewLink = document.createElement("div");
              viewLink.style.cssText = "text-align:center;margin-top:12px;padding-top:10px;border-top:1px solid var(--wh-border-light, #eee);";
              const link = document.createElement("a");
              link.href = profileUrl;
              link.target = "_blank";
              link.rel = "noopener";
              link.textContent = "View on Instagram";
              link.style.cssText = "color:#E1306C;text-decoration:none;font-weight:500;font-size:13px;";
              viewLink.appendChild(link);
              const quickLinks = document.createElement("div");
              quickLinks.style.cssText = "display:flex;justify-content:center;gap:12px;margin-top:6px;";
              [["Posts", profileUrl], ["Reels", profileUrl + "reels/"], ["Tagged", profileUrl + "tagged/"]].forEach(([label, url]) => {
                const a = document.createElement("a");
                a.href = url;
                a.target = "_blank";
                a.rel = "noopener";
                a.textContent = label;
                a.style.cssText = "color:var(--wh-text-muted);text-decoration:none;font-size:11px;";
                a.addEventListener("mouseenter", () => {
                  a.style.color = "#E1306C";
                });
                a.addEventListener("mouseleave", () => {
                  a.style.color = "var(--wh-text-muted)";
                });
                quickLinks.appendChild(a);
              });
              viewLink.appendChild(quickLinks);
              container.appendChild(viewLink);
            }
          }
        }
        if (global.WikiHover) {
          global.WikiHover.registerFeedFactory("instagram", () => new InstagramModule());
        }
        global.WikiHoverInstagramModule = InstagramModule;
      })(window);
    }
  });

  // agent/feeds/tiktok.js
  var require_tiktok = __commonJS({
    "agent/feeds/tiktok.js"() {
      (function(global) {
        "use strict";
        function _getContentContainerHeight(tooltipEl, totalH) {
          let usedH = 0;
          const cc = tooltipEl.querySelector(".wikihover-content-container");
          const body = tooltipEl.querySelector(".wikihover-body");
          Array.from(tooltipEl.children).forEach((child) => {
            if (child !== cc && child !== body && child.classList && !child.classList.contains("wikihover-resize-handle")) {
              usedH += child.offsetHeight || 0;
            }
          });
          return Math.max(50, totalH - usedH - 4);
        }
        function _getExpandedPlayerHeight(contentContainer) {
          if (!contentContainer) return 350;
          const tooltipEl = contentContainer.closest(".wikihover-tooltip, .wikihover-pinned-tooltip");
          if (!tooltipEl) return 350;
          const tooltipH = tooltipEl.offsetHeight || tooltipEl.getBoundingClientRect().height;
          if (tooltipH < 100) return 350;
          const ccH = _getContentContainerHeight(tooltipEl, tooltipH);
          const style = getComputedStyle(contentContainer);
          const pad = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
          return Math.max(150, Math.floor(ccH - pad));
        }
        function formatCount(count) {
          if (count == null) return null;
          if (typeof count === "string") return count;
          if (count >= 1e6) return (count / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
          if (count >= 1e4) return (count / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
          if (count >= 1e3) return count.toLocaleString();
          return String(count);
        }
        function proxyUrl(url) {
          if (!url) return "";
          return "https://wsrv.nl/?url=" + encodeURIComponent(url);
        }
        class TikTokModule extends global.WikiHoverFeedModule {
          get key() {
            return "tiktok";
          }
          get label() {
            return "TikTok";
          }
          get icon() {
            return "\u{1F3B5}";
          }
          render(sourceResult, container) {
            var _a;
            if (!sourceResult || sourceResult.status === "error") {
              this._renderUnavailable(container, ((_a = sourceResult == null ? void 0 : sourceResult.error) == null ? void 0 : _a.message) || "TikTok not available");
              return;
            }
            const items = sourceResult.items || [];
            if (!items.length) {
              this._renderUnavailable(container, "No TikTok results found");
              return;
            }
            let profile = items[0];
            if (profile && typeof profile.body === "string" && profile.statusCode !== void 0) {
              try {
                const parsed = JSON.parse(profile.body);
                profile = (parsed.items || [])[0] || null;
              } catch (e) {
                profile = null;
              }
            }
            if (!profile) {
              this._renderUnavailable(container, "No TikTok results found");
              return;
            }
            this._buildUI(container, profile);
          }
          _buildUI(container, profile) {
            container.innerHTML = "";
            const topVideos = profile.top_videos || [];
            const topPosts = profile.top_posts_data || [];
            const postLookup = {};
            topPosts.forEach((p) => {
              postLookup[p.post_id] = p;
            });
            const headerContainer = document.createElement("div");
            headerContainer.style.cssText = "display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding:0 0 10px 0;border-bottom:1px solid var(--wh-border-light, #eee);";
            const personName = document.createElement("h3");
            personName.style.cssText = "margin:0;font-size:16px;color:var(--wh-text);font-weight:600;";
            personName.textContent = "TikTok";
            headerContainer.appendChild(personName);
            container.appendChild(headerContainer);
            const profileCard = document.createElement("div");
            profileCard.className = "wikihover-tiktok-profile";
            if (profile.profile_pic_url) {
              const img = document.createElement("img");
              img.src = proxyUrl(profile.profile_pic_url);
              img.alt = profile.nickname || profile.account_id || "";
              img.className = "wikihover-tiktok-avatar";
              profileCard.appendChild(img);
            } else {
              const avatarEl = document.createElement("div");
              avatarEl.className = "wikihover-tiktok-avatar";
              avatarEl.style.cssText = "background:var(--wh-card-bg);display:flex;align-items:center;justify-content:center;font-size:24px;color:var(--wh-text-muted);";
              avatarEl.textContent = (profile.nickname || profile.account_id || "?")[0].toUpperCase();
              profileCard.appendChild(avatarEl);
            }
            const infoDiv = document.createElement("div");
            infoDiv.className = "wikihover-tiktok-info";
            const displayNameEl = document.createElement("h4");
            displayNameEl.style.cssText = "margin:0;font-size:15px;color:var(--wh-content-text);";
            displayNameEl.textContent = profile.nickname || profile.account_id || "";
            if (profile.is_verified) {
              const badge = document.createElement("span");
              badge.textContent = " \u2713";
              badge.style.cssText = "color:#69C9D0;font-weight:bold;";
              displayNameEl.appendChild(badge);
            }
            infoDiv.appendChild(displayNameEl);
            const usernameEl = document.createElement("span");
            usernameEl.textContent = "@" + (profile.account_id || "");
            usernameEl.style.cssText = "color:var(--wh-text-muted);font-size:13px;";
            infoDiv.appendChild(usernameEl);
            profileCard.appendChild(infoDiv);
            container.appendChild(profileCard);
            const statsRow = document.createElement("div");
            statsRow.className = "wikihover-tiktok-stats";
            [
              { value: profile.followers, label: "followers" },
              { value: profile.following, label: "following" },
              { value: profile.likes || profile.like_count, label: "likes" },
              { value: profile.videos_count, label: "videos" }
            ].forEach((s) => {
              if (s.value != null) {
                const span = document.createElement("span");
                span.innerHTML = "<strong>" + formatCount(s.value) + "</strong> " + s.label;
                statsRow.appendChild(span);
              }
            });
            container.appendChild(statsRow);
            var PEEK_W = 40, PEEK_GAP = 4;
            const expandedPlayer = document.createElement("div");
            expandedPlayer.className = "wikihover-tiktok-expanded";
            expandedPlayer.style.cssText = "display:none;position:relative;background:#000;border-radius:6px;overflow:hidden;";
            const carouselRow = document.createElement("div");
            carouselRow.style.cssText = "display:flex;gap:" + PEEK_GAP + "px;height:100%;align-items:stretch;";
            expandedPlayer.appendChild(carouselRow);
            const prevPeek = document.createElement("div");
            prevPeek.style.cssText = "width:" + PEEK_W + "px;flex-shrink:0;overflow:hidden;border-radius:4px;background:#111;cursor:pointer;opacity:0;transition:opacity 0.3s;";
            const prevPeekImg = document.createElement("img");
            prevPeekImg.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
            prevPeek.appendChild(prevPeekImg);
            carouselRow.appendChild(prevPeek);
            const centerSlot = document.createElement("div");
            centerSlot.style.cssText = "flex:1;min-width:0;position:relative;overflow:hidden;border-radius:4px;background:#000;";
            carouselRow.appendChild(centerSlot);
            const coverPlaceholder = document.createElement("div");
            coverPlaceholder.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;z-index:5;display:flex;align-items:center;justify-content:center;background:#000;transition:opacity 0.4s ease;";
            const coverImg = document.createElement("img");
            coverImg.style.cssText = "width:100%;height:100%;object-fit:contain;opacity:0.7;";
            coverPlaceholder.appendChild(coverImg);
            const spinner = document.createElement("div");
            spinner.style.cssText = "position:absolute;width:36px;height:36px;border:3px solid rgba(255,255,255,0.2);border-top-color:#FE2C55;border-radius:50%;animation:wikihover-tiktok-spin 0.8s linear infinite;";
            coverPlaceholder.appendChild(spinner);
            centerSlot.appendChild(coverPlaceholder);
            const iframeWrap = document.createElement("div");
            iframeWrap.style.cssText = "width:100%;height:100%;overflow:hidden;display:flex;justify-content:center;";
            const centerIframe = document.createElement("iframe");
            centerIframe.style.cssText = "display:block;border:none;background:#000;opacity:0;transition:opacity 0.4s ease;";
            centerIframe.setAttribute("allow", "autoplay; encrypted-media");
            centerIframe.setAttribute("allowfullscreen", "");
            centerIframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-forms");
            iframeWrap.appendChild(centerIframe);
            const centerVideo = document.createElement("video");
            centerVideo.style.cssText = "display:none;width:100%;height:100%;object-fit:contain;background:#000;opacity:0;transition:opacity 0.4s ease;";
            centerVideo.setAttribute("autoplay", "");
            centerVideo.setAttribute("controls", "");
            centerVideo.setAttribute("playsinline", "");
            centerVideo.setAttribute("preload", "auto");
            centerSlot.appendChild(centerVideo);
            centerSlot.appendChild(iframeWrap);
            const nextPeek = document.createElement("div");
            nextPeek.style.cssText = "width:" + PEEK_W + "px;flex-shrink:0;overflow:hidden;border-radius:4px;background:#111;cursor:pointer;opacity:0;transition:opacity 0.3s;";
            const nextPeekImg = document.createElement("img");
            nextPeekImg.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
            nextPeek.appendChild(nextPeekImg);
            carouselRow.appendChild(nextPeek);
            const statsBar = document.createElement("div");
            statsBar.style.cssText = "position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.9));color:white;padding:20px 12px 8px;z-index:10;";
            const captionEl = document.createElement("div");
            captionEl.style.cssText = "font-size:12px;line-height:1.4;margin-bottom:4px;max-height:40px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;";
            statsBar.appendChild(captionEl);
            const videoStatsRow = document.createElement("div");
            videoStatsRow.style.cssText = "display:flex;align-items:center;gap:12px;font-size:11px;color:rgba(255,255,255,0.9);flex-wrap:wrap;";
            statsBar.appendChild(videoStatsRow);
            expandedPlayer.appendChild(statsBar);
            function createNavArrow(direction) {
              var arrow = document.createElement("div");
              arrow.style.cssText = "position:absolute;top:40%;" + (direction === "prev" ? "left:" + (PEEK_W + PEEK_GAP + 4) + "px" : "right:" + (PEEK_W + PEEK_GAP + 4) + "px") + ";transform:translateY(-50%);width:32px;height:32px;background:rgba(0,0,0,0.6);color:white;border-radius:50%;display:none;align-items:center;justify-content:center;font-size:16px;cursor:pointer;z-index:15;transition:background 0.2s;";
              arrow.textContent = direction === "prev" ? "\u276E" : "\u276F";
              arrow.addEventListener("mouseenter", function() {
                arrow.style.background = "rgba(0,0,0,0.85)";
              });
              arrow.addEventListener("mouseleave", function() {
                arrow.style.background = "rgba(0,0,0,0.6)";
              });
              return arrow;
            }
            var prevArrow = createNavArrow("prev");
            var nextArrow = createNavArrow("next");
            expandedPlayer.appendChild(prevArrow);
            expandedPlayer.appendChild(nextArrow);
            var closeBtn = document.createElement("div");
            closeBtn.style.cssText = "position:absolute;top:8px;right:8px;width:28px;height:28px;background:rgba(0,0,0,0.7);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;z-index:15;line-height:1;transition:background 0.2s;";
            closeBtn.textContent = "\xD7";
            closeBtn.addEventListener("mouseenter", function() {
              closeBtn.style.background = "rgba(0,0,0,0.9)";
            });
            closeBtn.addEventListener("mouseleave", function() {
              closeBtn.style.background = "rgba(0,0,0,0.7)";
            });
            expandedPlayer.appendChild(closeBtn);
            container.appendChild(expandedPlayer);
            var currentIndex = -1;
            var savedScrollTop = 0, savedCCHeight = "", savedCCMaxHeight = "";
            var playerH = 350;
            var preloadedIframes = {};
            var preloadContainer = document.createElement("div");
            preloadContainer.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;";
            expandedPlayer.appendChild(preloadContainer);
            function _preloadVideo(videoId) {
              if (!videoId || preloadedIframes[videoId]) return;
              var pf = document.createElement("iframe");
              pf.src = "https://www.tiktok.com/embed/v2/" + videoId + "?autoplay=0&mute=1";
              pf.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-forms");
              pf.style.cssText = "width:1px;height:1px;border:none;";
              preloadContainer.appendChild(pf);
              preloadedIframes[videoId] = pf;
            }
            function _updatePeeks(index) {
              var prevVideo = topVideos[index - 1];
              if (prevVideo && prevVideo.cover_image) {
                prevPeekImg.src = proxyUrl(prevVideo.cover_image);
                prevPeek.style.opacity = "0.5";
              } else {
                prevPeek.style.opacity = "0";
              }
              var nextVideo = topVideos[index + 1];
              if (nextVideo && nextVideo.cover_image) {
                nextPeekImg.src = proxyUrl(nextVideo.cover_image);
                nextPeek.style.opacity = "0.5";
              } else {
                nextPeek.style.opacity = "0";
              }
            }
            function _sizeIframe() {
              var iframeW = Math.round(playerH * 9 / 16);
              var iframeH = Math.round(playerH * 1.25);
              centerIframe.style.width = iframeW + "px";
              centerIframe.style.height = iframeH + "px";
              centerVideo.style.width = iframeW + "px";
              centerVideo.style.height = playerH + "px";
            }
            function _updateStats(index) {
              var video = topVideos[index];
              if (!video) return;
              var post = postLookup[video.video_id] || null;
              var desc = post ? post.description : "";
              captionEl.textContent = desc;
              captionEl.style.display = desc ? "-webkit-box" : "none";
              videoStatsRow.innerHTML = "";
              [
                { icon: "\u25B6", value: video.playcount },
                { icon: "\u2764", value: video.diggcount },
                { icon: "\u{1F4AC}", value: video.commentcount },
                { icon: "\u21AA", value: video.share_count }
              ].forEach(function(s) {
                if (s.value) {
                  var span = document.createElement("span");
                  span.textContent = s.icon + " " + formatCount(s.value);
                  videoStatsRow.appendChild(span);
                }
              });
              prevArrow.style.display = index > 0 ? "flex" : "none";
              nextArrow.style.display = index + 1 < topVideos.length ? "flex" : "none";
            }
            function _loadCenter(video) {
              coverImg.src = proxyUrl(video.cover_image || "");
              coverPlaceholder.style.opacity = "1";
              coverPlaceholder.style.display = "flex";
              if (video.mp4_url) {
                centerIframe.style.display = "none";
                centerIframe.src = "";
                centerVideo.style.display = "block";
                centerVideo.style.opacity = "0";
                centerVideo.pause();
                centerVideo.src = video.mp4_url;
                centerVideo.load();
                centerVideo.play().catch(function() {
                });
                centerVideo.addEventListener("canplay", function onCanPlay() {
                  centerVideo.removeEventListener("canplay", onCanPlay);
                  centerVideo.style.opacity = "1";
                  coverPlaceholder.style.opacity = "0";
                  setTimeout(function() {
                    coverPlaceholder.style.display = "none";
                  }, 400);
                });
              } else {
                centerVideo.style.display = "none";
                centerVideo.pause();
                centerVideo.src = "";
                centerIframe.style.display = "block";
                centerIframe.style.opacity = "0";
                centerIframe.src = "https://www.tiktok.com/embed/v2/" + video.video_id + "?autoplay=1&mute=0";
                centerIframe.addEventListener("load", function onLoad() {
                  centerIframe.removeEventListener("load", onLoad);
                  setTimeout(function() {
                    centerIframe.style.opacity = "1";
                    coverPlaceholder.style.opacity = "0";
                    setTimeout(function() {
                      coverPlaceholder.style.display = "none";
                    }, 400);
                    try {
                      centerIframe.focus();
                    } catch (e) {
                    }
                    try {
                      centerIframe.contentWindow.postMessage({ type: "play" }, "*");
                    } catch (e) {
                    }
                    try {
                      centerIframe.contentWindow.postMessage("play", "*");
                    } catch (e) {
                    }
                  }, 800);
                });
              }
            }
            function showExpanded(index) {
              var video = topVideos[index];
              if (!video) return;
              if (currentIndex < 0) {
                var cc = container.closest(".wikihover-content-container");
                if (cc) {
                  savedScrollTop = cc.scrollTop;
                  savedCCHeight = cc.style.getPropertyValue("height");
                  savedCCMaxHeight = cc.style.getPropertyValue("max-height");
                }
                Array.from(container.children).forEach(function(child) {
                  if (child !== expandedPlayer) {
                    child.dataset.savedDisplay = child.style.display;
                    child.style.display = "none";
                  }
                });
                expandedPlayer.style.display = "block";
                var tooltipEl = cc && cc.closest(".wikihover-tooltip, .wikihover-pinned-tooltip");
                if (tooltipEl && cc) {
                  var ccH = _getContentContainerHeight(tooltipEl, tooltipEl.offsetHeight);
                  cc.style.setProperty("height", ccH + "px", "important");
                  cc.style.setProperty("max-height", ccH + "px", "important");
                }
                playerH = _getExpandedPlayerHeight(cc);
                expandedPlayer.style.height = playerH + "px";
                expandedPlayer.style.maxHeight = playerH + "px";
                _sizeIframe();
                if (cc) cc.scrollTop = 0;
              }
              currentIndex = index;
              _loadCenter(video);
              _updatePeeks(index);
              if (!video.mp4_url) {
                if (topVideos[index - 1]) _preloadVideo(topVideos[index - 1].video_id);
                if (topVideos[index + 1]) _preloadVideo(topVideos[index + 1].video_id);
              }
              _updateStats(index);
            }
            function navigateTo(newIndex) {
              if (newIndex < 0 || newIndex >= topVideos.length || newIndex === currentIndex) return;
              var video = topVideos[newIndex];
              if (!video) return;
              var dir = newIndex > currentIndex ? 1 : -1;
              centerSlot.style.transition = "transform 0.25s ease-out, opacity 0.25s ease-out";
              centerSlot.style.transform = "translateX(" + -dir * 30 + "px)";
              centerSlot.style.opacity = "0.3";
              setTimeout(function() {
                centerSlot.style.transition = "none";
                centerSlot.style.transform = "translateX(" + dir * 30 + "px)";
                void centerSlot.offsetWidth;
                currentIndex = newIndex;
                _loadCenter(video);
                _updatePeeks(newIndex);
                _updateStats(newIndex);
                if (!video.mp4_url) {
                  if (topVideos[newIndex - 1]) _preloadVideo(topVideos[newIndex - 1].video_id);
                  if (topVideos[newIndex + 1]) _preloadVideo(topVideos[newIndex + 1].video_id);
                }
                centerSlot.style.transition = "transform 0.25s ease-out, opacity 0.25s ease-out";
                centerSlot.style.transform = "translateX(0)";
                centerSlot.style.opacity = "1";
              }, 260);
            }
            function collapseExpanded() {
              expandedPlayer.style.display = "none";
              expandedPlayer.style.height = "";
              expandedPlayer.style.maxHeight = "";
              centerIframe.src = "";
              centerIframe.style.opacity = "0";
              centerVideo.pause();
              centerVideo.src = "";
              centerVideo.style.opacity = "0";
              coverPlaceholder.style.opacity = "1";
              coverPlaceholder.style.display = "flex";
              centerSlot.style.transform = "";
              centerSlot.style.opacity = "1";
              preloadContainer.innerHTML = "";
              preloadedIframes = {};
              currentIndex = -1;
              Array.from(container.children).forEach(function(child) {
                if (child !== expandedPlayer && child.dataset.savedDisplay !== void 0) {
                  child.style.display = child.dataset.savedDisplay;
                  delete child.dataset.savedDisplay;
                }
              });
              var cc = container.closest(".wikihover-content-container");
              if (cc) {
                if (savedCCHeight) cc.style.setProperty("height", savedCCHeight, "important");
                else cc.style.removeProperty("height");
                if (savedCCMaxHeight) cc.style.setProperty("max-height", savedCCMaxHeight, "important");
                else cc.style.removeProperty("max-height");
                cc.scrollTop = savedScrollTop;
              }
            }
            closeBtn.addEventListener("click", function(e) {
              e.stopPropagation();
              collapseExpanded();
            });
            prevArrow.addEventListener("click", function(e) {
              e.stopPropagation();
              if (currentIndex > 0) navigateTo(currentIndex - 1);
            });
            nextArrow.addEventListener("click", function(e) {
              e.stopPropagation();
              if (currentIndex + 1 < topVideos.length) navigateTo(currentIndex + 1);
            });
            prevPeek.addEventListener("click", function(e) {
              e.stopPropagation();
              if (currentIndex > 0) navigateTo(currentIndex - 1);
            });
            nextPeek.addEventListener("click", function(e) {
              e.stopPropagation();
              if (currentIndex + 1 < topVideos.length) navigateTo(currentIndex + 1);
            });
            if (topVideos.length > 0) {
              var videosSection = document.createElement("div");
              videosSection.style.marginTop = "10px";
              var videosLabel = document.createElement("div");
              videosLabel.style.cssText = "font-size:12px;font-weight:600;color:var(--wh-text-secondary);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;";
              videosLabel.textContent = "Top Videos";
              videosSection.appendChild(videosLabel);
              var grid = document.createElement("div");
              grid.className = "wikihover-tiktok-grid";
              topVideos.forEach(function(video, idx) {
                var cell = document.createElement("div");
                cell.className = "wikihover-tiktok-media-item";
                cell.style.cssText = "cursor:pointer;position:relative;background:var(--wh-card-bg);";
                var playIcon = document.createElement("div");
                playIcon.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.5);color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;z-index:2;pointer-events:none;";
                playIcon.textContent = "\u25B6";
                cell.appendChild(playIcon);
                if (video.cover_image) {
                  var img = document.createElement("img");
                  img.src = proxyUrl(video.cover_image);
                  img.alt = "TikTok video";
                  img.style.cssText = "width:100%;height:100%;object-fit:cover;";
                  cell.insertBefore(img, cell.firstChild);
                }
                var overlay = document.createElement("div");
                overlay.style.cssText = "position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.6));color:white;font-size:10px;padding:3px 5px;opacity:0;transition:opacity 0.2s;z-index:3;";
                overlay.textContent = video.playcount ? "\u25B6 " + formatCount(video.playcount) : "";
                cell.appendChild(overlay);
                if (video.mp4_url) {
                  let getTikTokRowSiblings = function() {
                    var allCells = Array.from(grid.querySelectorAll(".wikihover-tiktok-media-item"));
                    var myTop = cell.offsetTop;
                    return allCells.filter(function(c) {
                      return Math.abs(c.offsetTop - myTop) < 5;
                    });
                  }, expandTikTokToGrid = function() {
                    if (cellExpanded) return;
                    cellExpanded = true;
                    var allCells = Array.from(grid.querySelectorAll(".wikihover-tiktok-media-item"));
                    allCells.forEach(function(c) {
                      if (c === cell) return;
                      c.style.transition = "opacity 0.3s ease";
                      c.style.opacity = "0";
                      c.style.pointerEvents = "none";
                    });
                    cell.style.overflow = "visible";
                    cell.style.zIndex = "10";
                    grid.style.overflow = "visible";
                    var cellRect = cell.getBoundingClientRect();
                    var gridRect = grid.getBoundingClientRect();
                    var cc = container.closest(".wikihover-content-container");
                    var maxH = cc ? cc.clientHeight : grid.clientHeight;
                    var expandH = Math.min(grid.clientHeight, maxH);
                    var topOffset = cellRect.top - gridRect.top;
                    if (cc) {
                      var ccRect = cc.getBoundingClientRect();
                      var availBelow = ccRect.bottom - cellRect.top;
                      var availAbove = cellRect.bottom - ccRect.top;
                      expandH = Math.min(expandH, availBelow + availAbove - cell.offsetHeight);
                      expandH = Math.max(expandH, cell.offsetHeight);
                      var idealTop = -(cellRect.top - gridRect.top);
                      var overflowBottom = gridRect.top + idealTop + expandH - ccRect.bottom;
                      if (overflowBottom > 0) idealTop -= overflowBottom;
                      topOffset = Math.max(-(cellRect.top - ccRect.top), idealTop);
                    } else {
                      topOffset = -(cellRect.top - gridRect.top);
                    }
                    videoOverlay.style.left = -(cellRect.left - gridRect.left) + "px";
                    videoOverlay.style.top = topOffset + "px";
                    videoOverlay.style.width = grid.clientWidth + "px";
                    videoOverlay.style.height = expandH + "px";
                  }, collapseTikTokFromGrid = function() {
                    if (!cellExpanded) return;
                    cellExpanded = false;
                    var allCells = Array.from(grid.querySelectorAll(".wikihover-tiktok-media-item"));
                    allCells.forEach(function(c) {
                      if (c === cell) return;
                      c.style.opacity = "";
                      c.style.pointerEvents = "";
                    });
                    videoOverlay.style.left = "0";
                    videoOverlay.style.top = "0";
                    videoOverlay.style.width = "100%";
                    videoOverlay.style.height = "100%";
                    setTimeout(function() {
                      if (!cellExpanded) {
                        cell.style.overflow = "hidden";
                        cell.style.zIndex = "";
                        grid.style.overflow = "";
                        videoOverlay.style.display = "none";
                      }
                    }, 350);
                  };
                  var videoOverlay = document.createElement("div");
                  videoOverlay.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;background:#000;border-radius:4px;z-index:4;display:none;overflow:hidden;cursor:pointer;transition:width 0.3s ease,height 0.3s ease,left 0.3s ease,top 0.3s ease;";
                  var hoverVideo = document.createElement("video");
                  hoverVideo.loop = true;
                  hoverVideo.playsInline = true;
                  hoverVideo.preload = "none";
                  hoverVideo.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;z-index:1;";
                  videoOverlay.appendChild(hoverVideo);
                  cell.appendChild(videoOverlay);
                  var hoverTimer = null;
                  var cellExpanded = false;
                  cell.addEventListener("mouseenter", function() {
                    overlay.style.opacity = "1";
                    clearTimeout(hoverTimer);
                    hoverTimer = setTimeout(function() {
                      playIcon.style.opacity = "0";
                      videoOverlay.style.display = "block";
                      hoverVideo.src = video.mp4_url;
                      void videoOverlay.offsetWidth;
                      expandTikTokToGrid();
                      var soundOn = window._whVideoSoundEnabled !== void 0 ? window._whVideoSoundEnabled : true;
                      hoverVideo.muted = !soundOn;
                      hoverVideo.play().catch(function() {
                        hoverVideo.muted = true;
                        hoverVideo.play().catch(function() {
                        });
                      });
                    }, 400);
                  });
                  cell.addEventListener("mouseleave", function() {
                    clearTimeout(hoverTimer);
                    overlay.style.opacity = "0";
                    playIcon.style.opacity = "1";
                    hoverVideo.pause();
                    hoverVideo.currentTime = 0;
                    collapseTikTokFromGrid();
                  });
                } else {
                  cell.addEventListener("mouseenter", function() {
                    overlay.style.opacity = "1";
                  });
                  cell.addEventListener("mouseleave", function() {
                    overlay.style.opacity = "0";
                  });
                }
                cell.addEventListener("click", function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  showExpanded(idx);
                });
                grid.appendChild(cell);
              });
              videosSection.appendChild(grid);
              container.appendChild(videosSection);
            }
            if (topVideos.length === 0) {
              var noMediaBox = document.createElement("div");
              noMediaBox.style.cssText = "margin:10px 0;padding:12px;background:var(--wh-card-bg);border-radius:8px;text-align:center;";
              var msg = document.createElement("div");
              msg.style.cssText = "color:var(--wh-text-secondary);font-size:12px;";
              msg.textContent = "No videos available.";
              noMediaBox.appendChild(msg);
              container.appendChild(noMediaBox);
            }
            var profileUrl = profile.url || "https://www.tiktok.com/@" + (profile.account_id || "");
            var viewLink = document.createElement("div");
            viewLink.style.cssText = "text-align:center;margin-top:12px;padding-top:10px;border-top:1px solid var(--wh-border-light, #eee);";
            var link = document.createElement("a");
            link.href = profileUrl;
            link.target = "_blank";
            link.rel = "noopener";
            link.textContent = "View on TikTok";
            link.style.cssText = "color:#FE2C55;text-decoration:none;font-weight:500;font-size:13px;";
            viewLink.appendChild(link);
            container.appendChild(viewLink);
          }
        }
        if (global.WikiHover) {
          global.WikiHover.registerFeedFactory("tiktok", function() {
            return new TikTokModule();
          });
        }
        global.WikiHoverTikTokModule = TikTokModule;
      })(window);
    }
  });

  // agent/feeds/social-stubs.js
  var require_social_stubs = __commonJS({
    "agent/feeds/social-stubs.js"() {
      (function(global) {
        "use strict";
        function makeStub(key, label, icon) {
          class StubModule extends global.WikiHoverFeedModule {
            get key() {
              return key;
            }
            get label() {
              return label;
            }
            get icon() {
              return icon;
            }
            render(sourceResult, container) {
              var _a;
              const msg = ((_a = sourceResult == null ? void 0 : sourceResult.error) == null ? void 0 : _a.message) || `${label} data not available`;
              this._renderUnavailable(container, msg);
            }
          }
          return StubModule;
        }
        const TwitterModule = makeStub("twitter", "Twitter/X", "\u{1F426}");
        const PinterestModule = makeStub("pinterest", "Pinterest", "\u{1F4CC}");
        const stubs = { twitter: TwitterModule, pinterest: PinterestModule };
        Object.entries(stubs).forEach(([key, Cls]) => {
          if (global.WikiHover) {
            global.WikiHover.registerFeedFactory(key, () => new Cls());
          }
          global[`WikiHover${key.charAt(0).toUpperCase() + key.slice(1)}Module`] = Cls;
        });
      })(window);
    }
  });

  // agent/feeds/polymarket.js
  var require_polymarket = __commonJS({
    "agent/feeds/polymarket.js"() {
      (function(global) {
        "use strict";
        function formatVolume(v) {
          var n = typeof v === "string" ? parseFloat(v) : v || 0;
          if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
          if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
          return "$" + Math.round(n);
        }
        function parseLeadingOutcome(market) {
          var outcomes = market.outcomes || [];
          var raw = market.outcomePrices;
          if (!raw || !outcomes.length) return null;
          try {
            var prices = typeof raw === "string" ? JSON.parse(raw) : raw;
            var parsed = prices.map(function(p) {
              return parseFloat(p);
            });
            var maxIdx = 0;
            for (var i = 1; i < parsed.length; i++) {
              if (parsed[i] > parsed[maxIdx]) maxIdx = i;
            }
            var pct = Math.round(parsed[maxIdx] * 100);
            var label = outcomes[maxIdx] || "Yes";
            var isYes = label === "Yes" || pct >= 50;
            return { label, pct, isYes };
          } catch (_) {
            return null;
          }
        }
        function _parsePrices(market) {
          var raw = market.outcomePrices;
          if (!raw) return null;
          try {
            var prices = typeof raw === "string" ? JSON.parse(raw) : raw;
            if (!Array.isArray(prices) || prices.length < 2) return null;
            var yes = parseFloat(prices[0]);
            var no = parseFloat(prices[1]);
            if (isNaN(yes) || isNaN(no)) return null;
            return { yes, no };
          } catch (_) {
            return null;
          }
        }
        function isLive(event) {
          return event.active === true && event.closed !== true;
        }
        function sortByVolume(a, b) {
          return (b.volume || 0) - (a.volume || 0);
        }
        class PolymarketModule extends global.WikiHoverFeedModule {
          get key() {
            return "polymarket";
          }
          get label() {
            return "Polymarket";
          }
          get icon() {
            return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 12 8 16 12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>';
          }
          render(sourceResult, container) {
            var _a;
            if (!sourceResult || sourceResult.status === "error") {
              this._renderUnavailable(container, ((_a = sourceResult == null ? void 0 : sourceResult.error) == null ? void 0 : _a.message) || "Polymarket not available");
              return;
            }
            var wrapper = (sourceResult.items || [])[0] || {};
            var events = wrapper.events || [];
            if (!events.length) {
              this._renderUnavailable(container, "No prediction markets found");
              return;
            }
            var live = events.filter(isLive).sort(sortByVolume);
            var resolved = events.filter(function(e) {
              return !isLive(e);
            }).sort(sortByVolume);
            var sorted = live.concat(resolved);
            container.innerHTML = "";
            container.style.cssText = "padding:0;overflow-y:auto;";
            this._currentEvents = sorted;
            this._liveEvents = live;
            this._resolvedEvents = resolved;
            this._container = container;
            this._filterMode = live.length ? "live" : "all";
            this._renderGrid(container);
          }
          // ─── Grid View ──────────────────────────────────────────────────────────
          _renderGrid(container) {
            container.innerHTML = "";
            var self = this;
            var wrap = document.createElement("div");
            wrap.style.cssText = "padding:10px 12px;";
            var header = document.createElement("div");
            header.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;";
            var brand = document.createElement("div");
            brand.style.cssText = "display:flex;align-items:center;gap:6px;";
            brand.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--wh-accent,#58a6ff)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 12 8 16 12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>';
            var brandText = document.createElement("span");
            brandText.style.cssText = "font-size:13px;font-weight:600;color:var(--wh-text,#e6edf3);";
            brandText.textContent = "Polymarket";
            brand.appendChild(brandText);
            header.appendChild(brand);
            var pills = document.createElement("div");
            pills.style.cssText = "display:flex;gap:4px;";
            var livePill = document.createElement("span");
            var allPill = document.createElement("span");
            var pillBase = "padding:3px 10px;border-radius:10px;font-size:11px;cursor:pointer;font-weight:500;transition:all 0.15s;";
            function updatePills() {
              if (self._filterMode === "live") {
                livePill.style.cssText = pillBase + "background:#238636;color:#fff;";
                allPill.style.cssText = pillBase + "background:var(--wh-card-bg,#30363d);color:var(--wh-text-muted,#8b949e);";
              } else {
                livePill.style.cssText = pillBase + "background:var(--wh-card-bg,#30363d);color:var(--wh-text-muted,#8b949e);";
                allPill.style.cssText = pillBase + "background:var(--wh-accent,#58a6ff);color:#fff;";
              }
            }
            livePill.textContent = "Live";
            allPill.textContent = "All";
            updatePills();
            livePill.addEventListener("click", function(e) {
              e.stopPropagation();
              self._filterMode = "live";
              updatePills();
              renderTiles();
            });
            allPill.addEventListener("click", function(e) {
              e.stopPropagation();
              self._filterMode = "all";
              updatePills();
              renderTiles();
            });
            pills.appendChild(livePill);
            pills.appendChild(allPill);
            header.appendChild(pills);
            wrap.appendChild(header);
            var tilesWrap = document.createElement("div");
            wrap.appendChild(tilesWrap);
            function renderTiles() {
              tilesWrap.innerHTML = "";
              var showLive = self._liveEvents;
              var showResolved = self._resolvedEvents;
              if (self._filterMode === "live") {
                if (showLive.length) {
                  self._renderSection(tilesWrap, showLive, false);
                } else {
                  var noLive = document.createElement("div");
                  noLive.style.cssText = "text-align:center;color:var(--wh-text-muted,#8b949e);font-size:11px;padding:20px 0;";
                  noLive.textContent = "No live markets";
                  tilesWrap.appendChild(noLive);
                }
              } else {
                if (showLive.length) {
                  self._renderSectionLabel(tilesWrap, "Live Markets", "#3fb950");
                  self._renderSection(tilesWrap, showLive, false);
                }
                if (showResolved.length) {
                  self._renderSectionLabel(tilesWrap, "Resolved", "#8b949e");
                  self._renderSection(tilesWrap, showResolved, true);
                }
              }
            }
            renderTiles();
            container.appendChild(wrap);
          }
          _renderSectionLabel(parent, text, color) {
            var label = document.createElement("div");
            label.style.cssText = "font-size:11px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;margin:10px 0 6px;display:flex;align-items:center;gap:5px;color:" + color + ";";
            label.innerHTML = '<span style="width:4px;height:4px;background:' + color + ';border-radius:50%;display:inline-block;"></span>';
            var span = document.createElement("span");
            span.textContent = text;
            label.appendChild(span);
            parent.appendChild(label);
          }
          _renderSection(parent, events, isResolved) {
            var self = this;
            var grid = document.createElement("div");
            grid.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;";
            events.forEach(function(event) {
              var tile = self._createTile(event, isResolved);
              grid.appendChild(tile);
            });
            parent.appendChild(grid);
          }
          _createTile(event, isResolved) {
            var self = this;
            var tile = document.createElement("div");
            tile.style.cssText = "background:var(--wh-card-bg,#161b22);border:1px solid var(--wh-border,#30363d);border-radius:8px;overflow:hidden;cursor:pointer;" + (isResolved ? "opacity:0.7;" : "");
            var imgWrap = document.createElement("div");
            var bgImg = event.image ? "url(" + event.image + ") center/cover" : "linear-gradient(135deg, #1a1a2e, #16213e)";
            imgWrap.style.cssText = "height:138px;background:" + bgImg + ";position:relative;";
            var badge = document.createElement("div");
            if (isLive(event)) {
              badge.style.cssText = "position:absolute;top:6px;right:6px;background:rgba(35,134,54,0.9);padding:2px 7px;border-radius:5px;font-size:9px;color:#fff;font-weight:600;";
              badge.textContent = "LIVE";
            } else {
              badge.style.cssText = "position:absolute;top:6px;right:6px;background:rgba(139,148,158,0.7);padding:2px 7px;border-radius:5px;font-size:9px;color:#fff;font-weight:500;";
              badge.textContent = "ENDED";
            }
            imgWrap.appendChild(badge);
            var titleOverlay = document.createElement("div");
            titleOverlay.style.cssText = "position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.85));padding:6px 8px;";
            var titleText = document.createElement("div");
            titleText.style.cssText = "font-size:11px;color:#fff;font-weight:600;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;";
            titleText.textContent = event.title || "";
            titleOverlay.appendChild(titleText);
            imgWrap.appendChild(titleOverlay);
            tile.appendChild(imgWrap);
            var bottom = document.createElement("div");
            bottom.style.cssText = "padding:7px 8px;display:flex;justify-content:space-between;align-items:center;";
            var market = (event.markets || [])[0];
            var outcome = market ? parseLeadingOutcome(market) : null;
            var pill = document.createElement("span");
            if (outcome) {
              var pillBg = isResolved ? "#484f58" : outcome.isYes ? "#238636" : "#da3633";
              pill.style.cssText = "background:" + pillBg + ";color:#fff;padding:3px 8px;border-radius:10px;font-size:10px;font-weight:600;white-space:nowrap;";
              pill.textContent = outcome.label + " " + outcome.pct + "%";
            } else {
              pill.style.cssText = "background:#484f58;color:#fff;padding:3px 8px;border-radius:10px;font-size:10px;font-weight:600;";
              pill.textContent = "\u2014";
            }
            bottom.appendChild(pill);
            var vol = document.createElement("span");
            vol.style.cssText = "color:var(--wh-text-muted,#8b949e);font-size:10px;";
            vol.textContent = formatVolume(event.volume);
            bottom.appendChild(vol);
            tile.appendChild(bottom);
            tile.addEventListener("click", function(e) {
              e.stopPropagation();
              var idx = self._currentEvents.indexOf(event);
              self._renderExpanded(self._container, idx >= 0 ? idx : 0);
            });
            return tile;
          }
          // ─── Expanded Panel ─────────────────────────────────────────────────────
          _renderExpanded(container, eventIndex) {
            container.innerHTML = "";
            var self = this;
            var events = this._currentEvents;
            var event = events[eventIndex];
            if (!event) {
              this._renderGrid(container);
              return;
            }
            var panel = document.createElement("div");
            panel.style.cssText = "height:100%;display:flex;flex-direction:column;";
            var hero = document.createElement("div");
            var bgImg = event.image ? "url(" + event.image + ") center/cover" : "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0d1117 100%)";
            hero.style.cssText = "height:150px;flex-shrink:0;background:" + bgImg + ";position:relative;overflow:hidden;";
            var back = document.createElement("div");
            back.style.cssText = "position:absolute;top:10px;left:10px;background:rgba(0,0,0,0.55);border-radius:12px;padding:4px 12px;font-size:12px;color:#fff;cursor:pointer;z-index:1;";
            back.textContent = "\u2190 Back";
            back.addEventListener("click", function(e) {
              e.stopPropagation();
              self._renderGrid(container);
            });
            hero.appendChild(back);
            var badge = document.createElement("div");
            if (isLive(event)) {
              badge.style.cssText = "position:absolute;top:10px;right:10px;background:rgba(35,134,54,0.9);padding:3px 10px;border-radius:12px;font-size:11px;color:#fff;font-weight:600;";
              badge.textContent = "\u25CF LIVE";
            } else {
              badge.style.cssText = "position:absolute;top:10px;right:10px;background:rgba(139,148,158,0.7);padding:3px 10px;border-radius:12px;font-size:11px;color:#fff;font-weight:500;";
              badge.textContent = "ENDED";
            }
            hero.appendChild(badge);
            var titleWrap = document.createElement("div");
            titleWrap.style.cssText = "position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.9));padding:14px 14px;";
            var title = document.createElement("div");
            title.style.cssText = "font-size:16px;color:#fff;font-weight:700;line-height:1.3;";
            title.textContent = event.title || "";
            titleWrap.appendChild(title);
            var stats = document.createElement("div");
            stats.style.cssText = "display:flex;gap:12px;margin-top:4px;";
            var markets = event.markets || [];
            var statsItems = [];
            if (markets.length > 1) statsItems.push(markets.length + " markets");
            statsItems.push(formatVolume(event.volume) + " volume");
            if (event.commentCount) statsItems.push(event.commentCount.toLocaleString() + " comments");
            stats.innerHTML = statsItems.map(function(s) {
              return '<span style="font-size:12px;color:rgba(255,255,255,0.7);">' + s + "</span>";
            }).join("");
            titleWrap.appendChild(stats);
            hero.appendChild(titleWrap);
            panel.appendChild(hero);
            if (event.description) {
              var desc = document.createElement("div");
              desc.style.cssText = "padding:10px 14px;border-bottom:1px solid var(--wh-border,#21262d);";
              var descText = document.createElement("div");
              descText.style.cssText = "font-size:12px;color:var(--wh-text-muted,#8b949e);line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;";
              descText.textContent = event.description;
              desc.appendChild(descText);
              panel.appendChild(desc);
            }
            var listWrap = document.createElement("div");
            listWrap.style.cssText = "flex:1;overflow-y:auto;padding:0;";
            markets.forEach(function(market) {
              var prices = _parsePrices(market);
              var vol = market.volume || market.volumeNum || 0;
              var change = market.oneDayPriceChange;
              var yesPct = prices ? Math.round(prices.yes * 100) : null;
              var yesCents = prices ? (prices.yes * 100).toFixed(1) : null;
              var noCents = prices ? (prices.no * 100).toFixed(1) : null;
              var row = document.createElement("div");
              row.style.cssText = "padding:10px 12px;border-bottom:1px solid var(--wh-border,#2a2e35);";
              var topLine = document.createElement("div");
              topLine.style.cssText = "display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;";
              var nameEl = document.createElement("div");
              nameEl.style.cssText = "font-size:13px;font-weight:600;color:var(--wh-text,#e6edf3);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-right:10px;";
              nameEl.textContent = market.question || "";
              topLine.appendChild(nameEl);
              var pctWrap = document.createElement("div");
              pctWrap.style.cssText = "display:flex;align-items:baseline;gap:4px;flex-shrink:0;";
              var bigPct = document.createElement("span");
              if (yesPct != null) {
                bigPct.style.cssText = "font-size:20px;font-weight:700;color:var(--wh-text,#e6edf3);";
                bigPct.textContent = yesPct < 1 ? "<1%" : yesPct + "%";
              } else {
                bigPct.style.cssText = "font-size:20px;font-weight:700;color:var(--wh-text-muted,#8b949e);";
                bigPct.textContent = "\u2014";
              }
              pctWrap.appendChild(bigPct);
              if (change != null && change !== 0) {
                var changeEl = document.createElement("span");
                var isUp = change > 0;
                var changePct = Math.abs(Math.round(change * 100));
                changeEl.style.cssText = "font-size:10px;font-weight:500;color:" + (isUp ? "#22c55e" : "#ef4444") + ";";
                changeEl.textContent = (isUp ? "\u25B2" : "\u25BC") + changePct + "%";
                pctWrap.appendChild(changeEl);
              }
              topLine.appendChild(pctWrap);
              row.appendChild(topLine);
              var botLine = document.createElement("div");
              botLine.style.cssText = "display:flex;align-items:center;justify-content:space-between;";
              var volEl = document.createElement("span");
              volEl.style.cssText = "font-size:10px;color:var(--wh-text-muted,#8b949e);";
              volEl.textContent = formatVolume(vol) + " Vol.";
              botLine.appendChild(volEl);
              var btns = document.createElement("div");
              btns.style.cssText = "display:flex;gap:6px;";
              if (yesCents != null) {
                var yesBtn = document.createElement("span");
                yesBtn.style.cssText = "padding:4px 10px;border-radius:6px;font-size:10px;font-weight:700;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.35);color:#16a34a;white-space:nowrap;";
                yesBtn.textContent = "Buy Yes " + yesCents + "\xA2";
                btns.appendChild(yesBtn);
                var noBtn = document.createElement("span");
                noBtn.style.cssText = "padding:4px 10px;border-radius:6px;font-size:10px;font-weight:700;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);color:#dc2626;white-space:nowrap;";
                noBtn.textContent = "Buy No " + noCents + "\xA2";
                btns.appendChild(noBtn);
              }
              botLine.appendChild(btns);
              row.appendChild(botLine);
              listWrap.appendChild(row);
            });
            panel.appendChild(listWrap);
            var footer = document.createElement("div");
            footer.style.cssText = "flex-shrink:0;border-top:1px solid var(--wh-border,#30363d);padding:8px 12px;display:flex;justify-content:space-between;align-items:center;";
            var prev = document.createElement("span");
            if (eventIndex > 0) {
              prev.style.cssText = "font-size:10px;color:var(--wh-accent,#58a6ff);cursor:pointer;";
              prev.textContent = "\u2190 Previous";
              prev.addEventListener("click", function(e) {
                e.stopPropagation();
                self._renderExpanded(container, eventIndex - 1);
              });
            } else {
              prev.style.cssText = "font-size:10px;color:transparent;pointer-events:none;";
              prev.textContent = "\u2190 Previous";
            }
            footer.appendChild(prev);
            var link = document.createElement("a");
            link.style.cssText = "font-size:10px;color:var(--wh-accent,#58a6ff);text-decoration:none;cursor:pointer;";
            link.textContent = "View on Polymarket \u2197";
            link.href = "https://polymarket.com/event/" + (event.slug || "");
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.addEventListener("click", function(e) {
              e.stopPropagation();
            });
            footer.appendChild(link);
            var next = document.createElement("span");
            if (eventIndex < events.length - 1) {
              next.style.cssText = "font-size:10px;color:var(--wh-accent,#58a6ff);cursor:pointer;";
              next.textContent = "Next \u2192";
              next.addEventListener("click", function(e) {
                e.stopPropagation();
                self._renderExpanded(container, eventIndex + 1);
              });
            } else {
              next.style.cssText = "font-size:10px;color:transparent;pointer-events:none;";
              next.textContent = "Next \u2192";
            }
            footer.appendChild(next);
            panel.appendChild(footer);
            container.appendChild(panel);
          }
        }
        if (global.WikiHover) {
          global.WikiHover.registerFeedFactory("polymarket", function() {
            return new PolymarketModule();
          });
        }
        global.WikiHoverPolymarketModule = PolymarketModule;
      })(window);
    }
  });

  // styles.css
  var require_styles = __commonJS({
    "styles.css"(exports, module) {
      module.exports = `/* === Theme variables \u2014 Light (default) === */
.wikihover-tooltip,
.wikihover-pinned-tooltip {
  --wh-bg: #ffffff;
  --wh-text: #333;
  --wh-text-secondary: #666;
  --wh-text-muted: #999;
  --wh-content-text: #262626;
  --wh-content-secondary: #536471;
  --wh-border: #e5e5e5;
  --wh-border-light: #eee;
  --wh-header-bg: #f7f7f7;
  --wh-tab-bg: #f5f5f5;
  --wh-tab-hover-bg: #e8e8e8;
  --wh-tab-active-bg: #fff;
  --wh-accent: #0366d6;
  --wh-link: #0645ad;
  --wh-hover-bg: #f7f7f7;
  --wh-card-bg: #f5f7fa;
  --wh-glass-rgb: 255, 255, 255;
  --wh-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08);
  --wh-shadow-pinned: 0 12px 40px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Dark theme */
.wikihover-tooltip[data-wikihover-theme="dark"],
.wikihover-pinned-tooltip[data-wikihover-theme="dark"] {
  --wh-bg: #1e1e1e;
  --wh-text: #ffffff;
  --wh-text-secondary: #ccc;
  --wh-text-muted: #999;
  --wh-content-text: #ffffff;
  --wh-content-secondary: #bbb;
  --wh-border: #444;
  --wh-border-light: #333;
  --wh-header-bg: #2a2a2a;
  --wh-tab-bg: #252525;
  --wh-tab-hover-bg: #333;
  --wh-tab-active-bg: #1e1e1e;
  --wh-accent: #58a6ff;
  --wh-link: #58a6ff;
  --wh-hover-bg: #2a2a2a;
  --wh-card-bg: #252525;
  --wh-glass-rgb: 20, 20, 20;
  --wh-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
  --wh-shadow-pinned: 0 12px 40px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.35);
}

/* Pastel Blue theme */
.wikihover-tooltip[data-wikihover-theme="pastel-blue"],
.wikihover-pinned-tooltip[data-wikihover-theme="pastel-blue"] {
  --wh-bg: #eef4fb;
  --wh-text: #2c3e50;
  --wh-text-secondary: #5a7a96;
  --wh-text-muted: #7a9ab6;
  --wh-content-text: #2c3e50;
  --wh-content-secondary: #5a7a96;
  --wh-border: #c8dae8;
  --wh-border-light: #d8e6f0;
  --wh-header-bg: #dce8f3;
  --wh-tab-bg: #dce8f3;
  --wh-tab-hover-bg: #c8dae8;
  --wh-tab-active-bg: #eef4fb;
  --wh-accent: #3a7bd5;
  --wh-link: #3a7bd5;
  --wh-hover-bg: #dce8f3;
  --wh-card-bg: #dce8f3;
  --wh-glass-rgb: 180, 210, 240;
  --wh-shadow: 0 8px 32px rgba(44, 62, 80, 0.18), 0 2px 8px rgba(44, 62, 80, 0.1);
  --wh-shadow-pinned: 0 12px 40px rgba(44, 62, 80, 0.22), 0 4px 12px rgba(44, 62, 80, 0.12);
}

/* Pastel Rose theme */
.wikihover-tooltip[data-wikihover-theme="pastel-rose"],
.wikihover-pinned-tooltip[data-wikihover-theme="pastel-rose"] {
  --wh-bg: #fdf0f0;
  --wh-text: #4a2c2c;
  --wh-text-secondary: #8a6060;
  --wh-text-muted: #b08080;
  --wh-content-text: #4a2c2c;
  --wh-content-secondary: #8a6060;
  --wh-border: #e8c8c8;
  --wh-border-light: #f0d8d8;
  --wh-header-bg: #f3dce0;
  --wh-tab-bg: #f3dce0;
  --wh-tab-hover-bg: #e8c8c8;
  --wh-tab-active-bg: #fdf0f0;
  --wh-accent: #d5566a;
  --wh-link: #d5566a;
  --wh-hover-bg: #f3dce0;
  --wh-card-bg: #f3dce0;
  --wh-glass-rgb: 240, 200, 200;
  --wh-shadow: 0 8px 32px rgba(74, 44, 44, 0.18), 0 2px 8px rgba(74, 44, 44, 0.1);
  --wh-shadow-pinned: 0 12px 40px rgba(74, 44, 44, 0.22), 0 4px 12px rgba(74, 44, 44, 0.12);
}

/* Pastel Green theme */
.wikihover-tooltip[data-wikihover-theme="pastel-green"],
.wikihover-pinned-tooltip[data-wikihover-theme="pastel-green"] {
  --wh-bg: #f0faf0;
  --wh-text: #2c4a2c;
  --wh-text-secondary: #608a60;
  --wh-text-muted: #80b080;
  --wh-content-text: #2c4a2c;
  --wh-content-secondary: #608a60;
  --wh-border: #c8e8c8;
  --wh-border-light: #d8f0d8;
  --wh-header-bg: #dcf3dc;
  --wh-tab-bg: #dcf3dc;
  --wh-tab-hover-bg: #c8e8c8;
  --wh-tab-active-bg: #f0faf0;
  --wh-accent: #3aad5a;
  --wh-link: #3aad5a;
  --wh-hover-bg: #dcf3dc;
  --wh-card-bg: #dcf3dc;
  --wh-glass-rgb: 200, 240, 200;
  --wh-shadow: 0 8px 32px rgba(44, 74, 44, 0.18), 0 2px 8px rgba(44, 74, 44, 0.1);
  --wh-shadow-pinned: 0 12px 40px rgba(44, 74, 44, 0.22), 0 4px 12px rgba(44, 74, 44, 0.12);
}

/* Pastel Lavender theme */
.wikihover-tooltip[data-wikihover-theme="pastel-lavender"],
.wikihover-pinned-tooltip[data-wikihover-theme="pastel-lavender"] {
  --wh-bg: #f3f0fb;
  --wh-text: #3a2c5a;
  --wh-text-secondary: #7a60a0;
  --wh-text-muted: #9a80c0;
  --wh-content-text: #3a2c5a;
  --wh-content-secondary: #7a60a0;
  --wh-border: #d4c8e8;
  --wh-border-light: #e0d8f0;
  --wh-header-bg: #e6dcf3;
  --wh-tab-bg: #e6dcf3;
  --wh-tab-hover-bg: #d4c8e8;
  --wh-tab-active-bg: #f3f0fb;
  --wh-accent: #7c5ac7;
  --wh-link: #7c5ac7;
  --wh-hover-bg: #e6dcf3;
  --wh-card-bg: #e6dcf3;
  --wh-glass-rgb: 210, 200, 240;
  --wh-shadow: 0 8px 32px rgba(58, 44, 90, 0.18), 0 2px 8px rgba(58, 44, 90, 0.1);
  --wh-shadow-pinned: 0 12px 40px rgba(58, 44, 90, 0.22), 0 4px 12px rgba(58, 44, 90, 0.12);
}

/* Sunset theme */
.wikihover-tooltip[data-wikihover-theme="sunset"],
.wikihover-pinned-tooltip[data-wikihover-theme="sunset"] {
  --wh-bg: #fef6ee;
  --wh-text: #4a3520;
  --wh-text-secondary: #8a6a48;
  --wh-text-muted: #b89470;
  --wh-content-text: #4a3520;
  --wh-content-secondary: #8a6a48;
  --wh-border: #e8d4be;
  --wh-border-light: #f0e0cc;
  --wh-header-bg: #f8e8d4;
  --wh-tab-bg: #f8e8d4;
  --wh-tab-hover-bg: #e8d4be;
  --wh-tab-active-bg: #fef6ee;
  --wh-accent: #e8721c;
  --wh-link: #d0600a;
  --wh-hover-bg: #f8e8d4;
  --wh-card-bg: #f8e8d4;
  --wh-glass-rgb: 240, 215, 180;
  --wh-shadow: 0 8px 32px rgba(74, 53, 32, 0.18), 0 2px 8px rgba(74, 53, 32, 0.1);
  --wh-shadow-pinned: 0 12px 40px rgba(74, 53, 32, 0.22), 0 4px 12px rgba(74, 53, 32, 0.12);
}

/* Ocean theme */
.wikihover-tooltip[data-wikihover-theme="ocean"],
.wikihover-pinned-tooltip[data-wikihover-theme="ocean"] {
  --wh-bg: #eef8f7;
  --wh-text: #1a3a38;
  --wh-text-secondary: #4a7a76;
  --wh-text-muted: #72a09c;
  --wh-content-text: #1a3a38;
  --wh-content-secondary: #4a7a76;
  --wh-border: #b8dcd8;
  --wh-border-light: #cce8e5;
  --wh-header-bg: #d8eeec;
  --wh-tab-bg: #d8eeec;
  --wh-tab-hover-bg: #b8dcd8;
  --wh-tab-active-bg: #eef8f7;
  --wh-accent: #0d9488;
  --wh-link: #0a7c72;
  --wh-hover-bg: #d8eeec;
  --wh-card-bg: #d8eeec;
  --wh-glass-rgb: 180, 230, 225;
  --wh-shadow: 0 8px 32px rgba(26, 58, 56, 0.18), 0 2px 8px rgba(26, 58, 56, 0.1);
  --wh-shadow-pinned: 0 12px 40px rgba(26, 58, 56, 0.22), 0 4px 12px rgba(26, 58, 56, 0.12);
}

/* Cream theme */
.wikihover-tooltip[data-wikihover-theme="cream"],
.wikihover-pinned-tooltip[data-wikihover-theme="cream"] {
  --wh-bg: #faf6f0;
  --wh-text: #3e3428;
  --wh-text-secondary: #7a6a52;
  --wh-text-muted: #a09078;
  --wh-content-text: #3e3428;
  --wh-content-secondary: #7a6a52;
  --wh-border: #ddd0be;
  --wh-border-light: #e8dcc8;
  --wh-header-bg: #f0e8d8;
  --wh-tab-bg: #f0e8d8;
  --wh-tab-hover-bg: #ddd0be;
  --wh-tab-active-bg: #faf6f0;
  --wh-accent: #b8860b;
  --wh-link: #9a7009;
  --wh-hover-bg: #f0e8d8;
  --wh-card-bg: #f0e8d8;
  --wh-glass-rgb: 245, 235, 215;
  --wh-shadow: 0 8px 32px rgba(62, 52, 40, 0.18), 0 2px 8px rgba(62, 52, 40, 0.1);
  --wh-shadow-pinned: 0 12px 40px rgba(62, 52, 40, 0.22), 0 4px 12px rgba(62, 52, 40, 0.12);
}

/* Solarized Light theme */
.wikihover-tooltip[data-wikihover-theme="solarized-light"],
.wikihover-pinned-tooltip[data-wikihover-theme="solarized-light"] {
  --wh-bg: #fdf6e3;
  --wh-text: #586e75;
  --wh-text-secondary: #657b83;
  --wh-text-muted: #93a1a1;
  --wh-content-text: #586e75;
  --wh-content-secondary: #657b83;
  --wh-border: #d6cdb5;
  --wh-border-light: #e6ddc5;
  --wh-header-bg: #eee8d5;
  --wh-tab-bg: #eee8d5;
  --wh-tab-hover-bg: #d6cdb5;
  --wh-tab-active-bg: #fdf6e3;
  --wh-accent: #268bd2;
  --wh-link: #268bd2;
  --wh-hover-bg: #eee8d5;
  --wh-card-bg: #eee8d5;
  --wh-glass-rgb: 250, 240, 210;
  --wh-shadow: 0 8px 32px rgba(88, 110, 117, 0.18), 0 2px 8px rgba(88, 110, 117, 0.1);
  --wh-shadow-pinned: 0 12px 40px rgba(88, 110, 117, 0.22), 0 4px 12px rgba(88, 110, 117, 0.12);
}

/* Nord theme */
.wikihover-tooltip[data-wikihover-theme="nord"],
.wikihover-pinned-tooltip[data-wikihover-theme="nord"] {
  --wh-bg: #2e3440;
  --wh-text: #eceff4;
  --wh-text-secondary: #d8dee9;
  --wh-text-muted: #81a1c1;
  --wh-content-text: #eceff4;
  --wh-content-secondary: #d8dee9;
  --wh-border: #4c566a;
  --wh-border-light: #434c5e;
  --wh-header-bg: #3b4252;
  --wh-tab-bg: #3b4252;
  --wh-tab-hover-bg: #434c5e;
  --wh-tab-active-bg: #2e3440;
  --wh-accent: #88c0d0;
  --wh-link: #88c0d0;
  --wh-hover-bg: #3b4252;
  --wh-card-bg: #3b4252;
  --wh-glass-rgb: 46, 52, 64;
  --wh-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
  --wh-shadow-pinned: 0 12px 40px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.35);
}

/* Dracula theme */
.wikihover-tooltip[data-wikihover-theme="dracula"],
.wikihover-pinned-tooltip[data-wikihover-theme="dracula"] {
  --wh-bg: #282a36;
  --wh-text: #f8f8f2;
  --wh-text-secondary: #d0d0cc;
  --wh-text-muted: #6272a4;
  --wh-content-text: #f8f8f2;
  --wh-content-secondary: #d0d0cc;
  --wh-border: #44475a;
  --wh-border-light: #3a3c4e;
  --wh-header-bg: #343746;
  --wh-tab-bg: #343746;
  --wh-tab-hover-bg: #44475a;
  --wh-tab-active-bg: #282a36;
  --wh-accent: #bd93f9;
  --wh-link: #bd93f9;
  --wh-hover-bg: #343746;
  --wh-card-bg: #343746;
  --wh-glass-rgb: 40, 42, 54;
  --wh-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
  --wh-shadow-pinned: 0 12px 40px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.35);
}

/* Monokai theme */
.wikihover-tooltip[data-wikihover-theme="monokai"],
.wikihover-pinned-tooltip[data-wikihover-theme="monokai"] {
  --wh-bg: #272822;
  --wh-text: #f8f8f2;
  --wh-text-secondary: #cfcfc2;
  --wh-text-muted: #75715e;
  --wh-content-text: #f8f8f2;
  --wh-content-secondary: #cfcfc2;
  --wh-border: #49483e;
  --wh-border-light: #3e3d32;
  --wh-header-bg: #3e3d32;
  --wh-tab-bg: #3e3d32;
  --wh-tab-hover-bg: #49483e;
  --wh-tab-active-bg: #272822;
  --wh-accent: #f92672;
  --wh-link: #66d9ef;
  --wh-hover-bg: #3e3d32;
  --wh-card-bg: #3e3d32;
  --wh-glass-rgb: 39, 40, 34;
  --wh-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
  --wh-shadow-pinned: 0 12px 40px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.35);
}

/* Solarized Dark theme */
.wikihover-tooltip[data-wikihover-theme="solarized-dark"],
.wikihover-pinned-tooltip[data-wikihover-theme="solarized-dark"] {
  --wh-bg: #002b36;
  --wh-text: #93a1a1;
  --wh-text-secondary: #839496;
  --wh-text-muted: #586e75;
  --wh-content-text: #93a1a1;
  --wh-content-secondary: #839496;
  --wh-border: #073642;
  --wh-border-light: #073642;
  --wh-header-bg: #073642;
  --wh-tab-bg: #073642;
  --wh-tab-hover-bg: #0a4a5a;
  --wh-tab-active-bg: #002b36;
  --wh-accent: #2aa198;
  --wh-link: #2aa198;
  --wh-hover-bg: #073642;
  --wh-card-bg: #073642;
  --wh-glass-rgb: 0, 43, 54;
  --wh-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
  --wh-shadow-pinned: 0 12px 40px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.35);
}

/* Midnight theme */
.wikihover-tooltip[data-wikihover-theme="midnight"],
.wikihover-pinned-tooltip[data-wikihover-theme="midnight"] {
  --wh-bg: #1a1b2e;
  --wh-text: #c0caf5;
  --wh-text-secondary: #a9b1d6;
  --wh-text-muted: #565f89;
  --wh-content-text: #c0caf5;
  --wh-content-secondary: #a9b1d6;
  --wh-border: #33355a;
  --wh-border-light: #292b48;
  --wh-header-bg: #24263e;
  --wh-tab-bg: #24263e;
  --wh-tab-hover-bg: #33355a;
  --wh-tab-active-bg: #1a1b2e;
  --wh-accent: #7aa2f7;
  --wh-link: #7aa2f7;
  --wh-hover-bg: #24263e;
  --wh-card-bg: #24263e;
  --wh-glass-rgb: 26, 27, 46;
  --wh-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
  --wh-shadow-pinned: 0 12px 40px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.35);
}

/* High Contrast theme */
.wikihover-tooltip[data-wikihover-theme="high-contrast"],
.wikihover-pinned-tooltip[data-wikihover-theme="high-contrast"] {
  --wh-bg: #000000;
  --wh-text: #ffffff;
  --wh-text-secondary: #ffff00;
  --wh-text-muted: #ffdd00;
  --wh-content-text: #ffffff;
  --wh-content-secondary: #ffff00;
  --wh-border: #555555;
  --wh-border-light: #333333;
  --wh-header-bg: #1a1a1a;
  --wh-tab-bg: #1a1a1a;
  --wh-tab-hover-bg: #333333;
  --wh-tab-active-bg: #000000;
  --wh-accent: #ffff00;
  --wh-link: #ffff00;
  --wh-hover-bg: #1a1a1a;
  --wh-card-bg: #1a1a1a;
  --wh-glass-rgb: 0, 0, 0;
  --wh-shadow: 0 8px 32px rgba(0, 0, 0, 0.8), 0 0 0 2px rgba(255, 255, 255, 0.3);
  --wh-shadow-pinned: 0 12px 40px rgba(0, 0, 0, 0.9), 0 0 0 2px rgba(255, 255, 255, 0.4);
}

/* === CSS Isolation: protect tooltip from host page styles === */
.wikihover-tooltip,
.wikihover-pinned-tooltip {
  direction: ltr !important;
  text-align: left !important;
  unicode-bidi: embed !important;
  font-family: Arial, sans-serif !important;
  line-height: 1.5 !important;
  color: var(--wh-text) !important;
  -webkit-text-size-adjust: 100% !important;
  text-size-adjust: 100% !important;
}

.wikihover-tooltip *,
.wikihover-pinned-tooltip * {
  direction: ltr !important;
  box-sizing: border-box !important;
  font-family: Arial, sans-serif !important;
  letter-spacing: normal !important;
  word-spacing: normal !important;
  text-transform: none !important;
  text-indent: 0 !important;
  text-shadow: none !important;
}

.wikihover-tooltip button,
.wikihover-pinned-tooltip button {
  appearance: none !important;
  -webkit-appearance: none !important;
  background: none !important;
  border: none !important;
  padding: 8px 8px !important;
  margin: 0 !important;
  font-size: 12px !important;
  cursor: pointer !important;
  outline: none !important;
  color: var(--wh-text-secondary) !important;
  line-height: 1 !important;
}

.wikihover-tooltip img,
.wikihover-pinned-tooltip img {
  max-width: 100% !important;
  border: none !important;
}

.wikihover-tooltip h3,
.wikihover-tooltip h4,
.wikihover-pinned-tooltip h3,
.wikihover-pinned-tooltip h4 {
  margin: 0 !important;
  padding: 0 !important;
  font-weight: bold !important;
  line-height: 1.3 !important;
  letter-spacing: normal !important;
  text-transform: none !important;
}

.wikihover-tooltip a,
.wikihover-pinned-tooltip a {
  text-decoration: none !important;
  color: var(--wh-link) !important;
}

.wikihover-tooltip p,
.wikihover-pinned-tooltip p {
  margin: 0 0 8px 0 !important;
  padding: 0 !important;
  line-height: 1.5 !important;
}

/* Name highlight styles */
span.wikihover-name,
span.wikihover-name[data-name] {
  cursor: help;
  color: inherit !important;
  position: relative;
  text-decoration: underline !important;
  text-decoration-color: rgba(6, 69, 173, 0.35) !important;
  text-decoration-thickness: 1px !important;
  background-color: rgba(6, 69, 173, 0.12) !important;
  background-image: none !important;
  border-radius: 2px;
  padding: 0 1px;
}

span.wikihover-name:hover,
span.wikihover-name[data-name]:hover {
  background-color: rgba(6, 69, 173, 0.20) !important;
  text-decoration-color: rgba(6, 69, 173, 0.55) !important;
  z-index: 1;
}

/* Dark theme name highlights */
html[data-wikihover-theme="dark"] span.wikihover-name {
  background-color: rgba(88, 166, 255, 0.08) !important;
  text-decoration-color: rgba(88, 166, 255, 0.25) !important;
}
html[data-wikihover-theme="dark"] span.wikihover-name:hover {
  background-color: rgba(88, 166, 255, 0.16) !important;
  text-decoration-color: rgba(88, 166, 255, 0.45) !important;
}

/* Pastel Blue theme name highlights */
html[data-wikihover-theme="pastel-blue"] span.wikihover-name {
  background-color: rgba(58, 123, 213, 0.06) !important;
  text-decoration-color: rgba(58, 123, 213, 0.25) !important;
}
html[data-wikihover-theme="pastel-blue"] span.wikihover-name:hover {
  background-color: rgba(58, 123, 213, 0.12) !important;
  text-decoration-color: rgba(58, 123, 213, 0.45) !important;
}

/* Pastel Rose theme name highlights */
html[data-wikihover-theme="pastel-rose"] span.wikihover-name {
  background-color: rgba(213, 86, 106, 0.06) !important;
  text-decoration-color: rgba(213, 86, 106, 0.25) !important;
}
html[data-wikihover-theme="pastel-rose"] span.wikihover-name:hover {
  background-color: rgba(213, 86, 106, 0.12) !important;
  text-decoration-color: rgba(213, 86, 106, 0.45) !important;
}

/* Pastel Green theme name highlights */
html[data-wikihover-theme="pastel-green"] span.wikihover-name {
  background-color: rgba(58, 173, 90, 0.06) !important;
  text-decoration-color: rgba(58, 173, 90, 0.25) !important;
}
html[data-wikihover-theme="pastel-green"] span.wikihover-name:hover {
  background-color: rgba(58, 173, 90, 0.12) !important;
  text-decoration-color: rgba(58, 173, 90, 0.45) !important;
}

/* Pastel Lavender theme name highlights */
html[data-wikihover-theme="pastel-lavender"] span.wikihover-name {
  background-color: rgba(124, 90, 199, 0.06) !important;
  text-decoration-color: rgba(124, 90, 199, 0.25) !important;
}
html[data-wikihover-theme="pastel-lavender"] span.wikihover-name:hover {
  background-color: rgba(124, 90, 199, 0.12) !important;
  text-decoration-color: rgba(124, 90, 199, 0.45) !important;
}

/* Sunset theme name highlights */
html[data-wikihover-theme="sunset"] span.wikihover-name {
  background-color: rgba(232, 114, 28, 0.06) !important;
  text-decoration-color: rgba(232, 114, 28, 0.25) !important;
}
html[data-wikihover-theme="sunset"] span.wikihover-name:hover {
  background-color: rgba(232, 114, 28, 0.12) !important;
  text-decoration-color: rgba(232, 114, 28, 0.45) !important;
}

/* Ocean theme name highlights */
html[data-wikihover-theme="ocean"] span.wikihover-name {
  background-color: rgba(13, 148, 136, 0.06) !important;
  text-decoration-color: rgba(13, 148, 136, 0.25) !important;
}
html[data-wikihover-theme="ocean"] span.wikihover-name:hover {
  background-color: rgba(13, 148, 136, 0.12) !important;
  text-decoration-color: rgba(13, 148, 136, 0.45) !important;
}

/* Cream theme name highlights */
html[data-wikihover-theme="cream"] span.wikihover-name {
  background-color: rgba(184, 134, 11, 0.06) !important;
  text-decoration-color: rgba(184, 134, 11, 0.25) !important;
}
html[data-wikihover-theme="cream"] span.wikihover-name:hover {
  background-color: rgba(184, 134, 11, 0.12) !important;
  text-decoration-color: rgba(184, 134, 11, 0.45) !important;
}

/* Solarized Light theme name highlights */
html[data-wikihover-theme="solarized-light"] span.wikihover-name {
  background-color: rgba(38, 139, 210, 0.06) !important;
  text-decoration-color: rgba(38, 139, 210, 0.25) !important;
}
html[data-wikihover-theme="solarized-light"] span.wikihover-name:hover {
  background-color: rgba(38, 139, 210, 0.12) !important;
  text-decoration-color: rgba(38, 139, 210, 0.45) !important;
}

/* Nord theme name highlights */
html[data-wikihover-theme="nord"] span.wikihover-name {
  background-color: rgba(136, 192, 208, 0.08) !important;
  text-decoration-color: rgba(136, 192, 208, 0.25) !important;
}
html[data-wikihover-theme="nord"] span.wikihover-name:hover {
  background-color: rgba(136, 192, 208, 0.16) !important;
  text-decoration-color: rgba(136, 192, 208, 0.45) !important;
}

/* Dracula theme name highlights */
html[data-wikihover-theme="dracula"] span.wikihover-name {
  background-color: rgba(189, 147, 249, 0.08) !important;
  text-decoration-color: rgba(189, 147, 249, 0.25) !important;
}
html[data-wikihover-theme="dracula"] span.wikihover-name:hover {
  background-color: rgba(189, 147, 249, 0.16) !important;
  text-decoration-color: rgba(189, 147, 249, 0.45) !important;
}

/* Monokai theme name highlights */
html[data-wikihover-theme="monokai"] span.wikihover-name {
  background-color: rgba(249, 38, 114, 0.08) !important;
  text-decoration-color: rgba(249, 38, 114, 0.25) !important;
}
html[data-wikihover-theme="monokai"] span.wikihover-name:hover {
  background-color: rgba(249, 38, 114, 0.16) !important;
  text-decoration-color: rgba(249, 38, 114, 0.45) !important;
}

/* Solarized Dark theme name highlights */
html[data-wikihover-theme="solarized-dark"] span.wikihover-name {
  background-color: rgba(42, 161, 152, 0.08) !important;
  text-decoration-color: rgba(42, 161, 152, 0.25) !important;
}
html[data-wikihover-theme="solarized-dark"] span.wikihover-name:hover {
  background-color: rgba(42, 161, 152, 0.16) !important;
  text-decoration-color: rgba(42, 161, 152, 0.45) !important;
}

/* Midnight theme name highlights */
html[data-wikihover-theme="midnight"] span.wikihover-name {
  background-color: rgba(122, 162, 247, 0.08) !important;
  text-decoration-color: rgba(122, 162, 247, 0.25) !important;
}
html[data-wikihover-theme="midnight"] span.wikihover-name:hover {
  background-color: rgba(122, 162, 247, 0.16) !important;
  text-decoration-color: rgba(122, 162, 247, 0.45) !important;
}

/* High Contrast theme name highlights */
html[data-wikihover-theme="high-contrast"] span.wikihover-name {
  background-color: rgba(255, 255, 0, 0.08) !important;
  text-decoration-color: rgba(255, 255, 0, 0.25) !important;
}
html[data-wikihover-theme="high-contrast"] span.wikihover-name:hover {
  background-color: rgba(255, 255, 0, 0.16) !important;
  text-decoration-color: rgba(255, 255, 0, 0.45) !important;
}

/* Keep pointer cursor when name is inside a link */
a span.wikihover-name,
a.wikihover-name {
  cursor: pointer;
}

/* Processed container */
.wikihover-processed {
  display: inline;
}

/* Tooltip styles */
.wikihover-tooltip {
  position: fixed !important;
  display: flex !important;
  flex-direction: column !important;
  width: 482px !important;
  height: auto !important;
  max-height: 750px !important;
  background: rgba(var(--wh-glass-rgb), 0.88) !important;
  backdrop-filter: blur(24px) saturate(160%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(160%) !important;
  border: 1px solid rgba(255, 255, 255, 0.28) !important;
  border-radius: 16px !important;
  box-shadow: var(--wh-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.35) !important;
  z-index: 999999 !important;
  font-family: Arial, sans-serif !important;
  overflow: hidden !important;
  pointer-events: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  transform: scale(0.92) !important;
  transform-origin: 50% 0 !important;
  will-change: transform, opacity !important;
  /* Exit transition: quick ease-in scale-down */
  transition:
    transform 0.18s ease-in,
    opacity 0.15s ease-in !important;
}

/* Specular highlight \u2014 simulates light hitting the top edge of the glass */
.wikihover-tooltip::before,
.wikihover-pinned-tooltip::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 45% !important;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 255, 255, 0.06) 50%,
    rgba(255, 255, 255, 0) 100%
  ) !important;
  border-radius: 16px 16px 0 0 !important;
  pointer-events: none !important;
  z-index: 0 !important;
}

/* Fallback grow-origin when JS placement hasn't fired yet */
.wikihover-tooltip[data-wh-placement="below"] {
  transform-origin: 50% 0 !important;
}
.wikihover-tooltip[data-wh-placement="above"] {
  transform-origin: 50% 100% !important;
}

.wikihover-tooltip.visible {
  flex-direction: column !important;
  visibility: visible !important;
  opacity: 1 !important;
  transform: scale(1) !important;
  z-index: 9999999 !important;
  pointer-events: auto !important;
  /* Enter transition: spring pop */
  transition:
    transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.18s ease-out !important;
}

/* Hide all tooltips when one is visible */
.wikihover-tooltip.visible ~ .wikihover-tooltip {
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  z-index: -1 !important;
}

.wikihover-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 10px 15px !important;
  background: rgba(var(--wh-glass-rgb), 0.68) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18) !important;
  cursor: move !important;
  user-select: none !important;
  position: relative !important;
  z-index: 1 !important;
}

.wikihover-header-buttons {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}

.wikihover-title {
  margin: 0 !important;
  font-size: 16px !important;
  font-weight: bold !important;
  color: var(--wh-text) !important;
}

.wikihover-pin {
  cursor: pointer !important;
  font-size: 14px !important;
  color: var(--wh-text-muted) !important;
  line-height: 1 !important;
  transition: color 0.15s ease !important;
}

.wikihover-pin:hover {
  color: var(--wh-accent) !important;
}

.wikihover-unmark {
  cursor: pointer !important;
  font-size: 14px !important;
  color: var(--wh-text-muted) !important;
  line-height: 1 !important;
  transition: color 0.15s ease !important;
}

.wikihover-unmark:hover {
  color: #cc3333 !important;
}

.wikihover-close {
  cursor: pointer !important;
  font-size: 20px !important;
  color: var(--wh-text-muted) !important;
  line-height: 1 !important;
}

.wikihover-close:hover {
  color: var(--wh-text) !important;
}

.wikihover-fullscreen-btn {
  cursor: pointer !important;
  font-size: 16px !important;
  padding: 0 4px !important;
  opacity: 0.6 !important;
  transition: opacity 0.2s !important;
  line-height: 1 !important;
}

.wikihover-fullscreen-btn:hover {
  opacity: 1 !important;
}

.wikihover-duplicate-pin {
  cursor: pointer !important;
  font-size: 14px !important;
  color: var(--wh-text-muted) !important;
  line-height: 1 !important;
  transition: color 0.15s ease !important;
}

.wikihover-duplicate-pin:hover {
  color: var(--wh-accent) !important;
}

.wikihover-fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  max-height: 100vh !important;
  border-radius: 0 !important;
  border: none !important;
  z-index: 99999999 !important;
}

/* Pinned tooltip */
.wikihover-pinned-tooltip {
  position: fixed !important;
  display: flex !important;
  flex-direction: column !important;
  visibility: visible !important;
  opacity: 1 !important;
  z-index: 9999999 !important;
  width: 482px !important;
  max-height: 750px !important;
  background: rgba(var(--wh-glass-rgb), 0.88) !important;
  backdrop-filter: blur(24px) saturate(160%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(160%) !important;
  border: 1px solid rgba(255, 255, 255, 0.28) !important;
  border-radius: 16px !important;
  box-shadow: var(--wh-shadow-pinned), inset 0 1px 0 rgba(255, 255, 255, 0.35) !important;
  font-family: Arial, sans-serif !important;
  overflow: hidden !important;
  pointer-events: auto !important;
}

/* Body wrapper: sidebar + content side by side */
.wikihover-body {
  display: flex !important;
  flex-direction: row !important;
  flex: 1 !important;
  min-height: 0 !important;
  overflow: hidden !important;
}

/* Sidebar navigation */
.wikihover-sidebar {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  width: 60px !important;
  min-width: 60px !important;
  padding: 8px 0 !important;
  background: transparent !important;
  border-right: 1px solid rgba(255, 255, 255, 0.25) !important;
  overflow: visible !important;
  scrollbar-width: none !important;
  gap: 4px !important;
  flex-shrink: 0 !important;
  position: relative !important;
  z-index: 2 !important;
}

.wikihover-sidebar::-webkit-scrollbar {
  display: none;
}

.wikihover-tab {
  padding: 8px 0 !important;
  border: none !important;
  border-left: 3px solid transparent !important;
  border-radius: 0 6px 6px 0 !important;
  background: none !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  flex-shrink: 0 !important;
}

/* Favicon wrapper: static 28px icon, no dock scaling */
.wikihover-tab-favicon-wrap {
  width: 28px !important;
  height: 28px !important;
  flex-shrink: 0 !important;
  border-radius: 6px !important;
  display: block !important;
  position: relative !important;
  overflow: hidden !important;
  isolation: isolate !important;
}

/* B&W base layer (always visible, behind color layer) */
.wikihover-tab-favicon-wrap .wikihover-tab-favicon-bw {
  display: block !important;
  width: 28px !important;
  height: 28px !important;
  border-radius: 6px !important;
  filter: grayscale(1) !important;
  object-fit: contain !important;
  position: relative !important;
  z-index: 0 !important;
}

/* Color layer: hidden by default, fades in when revealed */
.wikihover-tab-favicon-wrap .wikihover-tab-favicon-color {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  opacity: 0 !important;
  transition: opacity 0.3s ease !important;
  border-radius: 6px !important;
  z-index: 1 !important;
}

.wikihover-tab-favicon-wrap .wikihover-tab-favicon-color.wikihover-tab-favicon-revealed {
  opacity: 1 !important;
}

/* Color layer img: no filter so it stays in color (overrides host page grayscale on img) */
.wikihover-tab-favicon-wrap .wikihover-tab-favicon-color img {
  display: block !important;
  width: 28px !important;
  height: 28px !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  border-radius: 6px !important;
  object-fit: contain !important;
  filter: none !important;
}

.wikihover-tab:hover {
  background: none !important;
}

.wikihover-tab.active {
  background: rgba(255, 255, 255, 0.12) !important;
  border-left-color: var(--wh-accent) !important;
}

/* Content container \u2014 extra bottom padding so last content doesn\u2019t sit under footer */
.wikihover-content-container {
  padding: 10px 10px 16px !important;
  flex: 1 !important;
  min-height: 0 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  background: transparent !important;
  position: relative !important;
  z-index: 1 !important;
  scrollbar-width: thin !important;
  scrollbar-color: rgba(128, 128, 128, 0.3) transparent !important;
}

.wikihover-content-container::-webkit-scrollbar {
  width: 4px;
}
.wikihover-content-container::-webkit-scrollbar-track {
  background: transparent;
}
.wikihover-content-container::-webkit-scrollbar-thumb {
  background: rgba(128, 128, 128, 0.3);
  border-radius: 2px;
}
.wikihover-content-container::-webkit-scrollbar-thumb:hover {
  background: rgba(128, 128, 128, 0.5);
}

.wikihover-content {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
  transition: opacity 0.3s ease !important;
}

.wikihover-content.active {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  height: auto !important;
  overflow: visible !important;
  position: relative !important;
  z-index: 1 !important;
}

.wikihover-imdb-content.active {
  display: flex !important;
  flex-direction: column !important;
  flex: 1 1 0 !important;
  min-height: 0 !important;
  overflow: hidden !important;
}

.wikihover-wiki-content, .wikihover-tvmaze-content {
  margin: 0;
  padding: 0;
  font-size: 13px;
  line-height: 1.5;
}

/* Fix for TVMaze content to ensure it's properly displayed */
.wikihover-tvmaze-content.active {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  height: auto !important;
  overflow: visible !important;
  position: relative !important;
  z-index: 1 !important;
}

.wikihover-powered-by {
  text-align: center !important;
  padding: 4px 24px 4px 15px !important;
  border-top: 1px solid rgba(255, 255, 255, 0.18) !important;
  background: rgba(var(--wh-glass-rgb), 0.3) !important;
  border-radius: 0 0 16px 16px !important;
  position: relative !important;
  z-index: 5 !important;
  flex-shrink: 0 !important;
}

.wikihover-powered-by a {
  color: var(--wh-text-secondary) !important;
  text-decoration: none !important;
  font-size: 11px !important;
}

/* Action buttons with brand-colored backgrounds \u2014 preserve white text */
.wikihover-tooltip .wikihover-action-btn,
.wikihover-pinned-tooltip .wikihover-action-btn {
  color: #fff !important;
}

.wikihover-powered-by a:hover {
  color: var(--wh-link) !important;
}

/* Family tree: no card background \u2014 smooth continue with content above */
.wikihover-family-tree {
  background: transparent !important;
  padding: 14px 0 28px !important;
  margin-top: 16px !important;
  border-top: 1px solid var(--wh-border, #e0e0e0) !important;
}
.wikihover-family-tree .wikihover-family-tree-inner {
  background: transparent !important;
}

.wikihover-resize-handle {
  position: absolute !important;
  bottom: 0 !important;
  right: 0 !important;
  width: 16px !important;
  height: 16px !important;
  cursor: nwse-resize !important;
  z-index: 10 !important;
  background: linear-gradient(135deg, transparent 50%, var(--wh-text-muted) 50%, var(--wh-text-muted) 60%, transparent 60%, transparent 70%, var(--wh-text-muted) 70%, var(--wh-text-muted) 80%, transparent 80%) !important;
  border-radius: 0 0 8px 0 !important;
  opacity: 0.6 !important;
  transition: opacity 0.2s !important;
}

.wikihover-resize-handle:hover {
  opacity: 1 !important;
}

/* Wikipedia specific styles */
.wikihover-thumbnail {
  float: right !important;
  max-width: 100px !important;
  max-height: 100px !important;
  margin: 0 0 10px 10px !important;
  border-radius: 4px !important;
}

.wikihover-loader {
  border: 3px solid var(--wh-border);
  border-top: 3px solid var(--wh-accent);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: wikihover-spin 2s linear infinite;
  margin: 20px auto;
}

@keyframes wikihover-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.wikihover-twitter-content {
  margin: 0;
  padding: 0;
  font-size: 13px;
  line-height: 1.5;
}

.wikihover-twitter-content.active {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  height: auto !important;
  overflow: visible !important;
  position: relative !important;
  z-index: 1 !important;
}

/* Twitter specific styles */
.wikihover-twitter-header {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--wh-border);
}

.wikihover-twitter-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.wikihover-twitter-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.wikihover-twitter-info h4 {
  margin: 0;
  color: var(--wh-content-text);
  font-size: 16px;
}

.wikihover-twitter-username {
  color: var(--wh-content-secondary);
  font-size: 14px;
}

.wikihover-twitter-stats {
  display: flex;
  gap: 15px;
  margin: 10px 0;
  color: var(--wh-content-secondary);
  font-size: 14px;
}

.wikihover-twitter-bio {
  color: var(--wh-content-text);
  font-size: 14px;
  margin: 10px 0;
  line-height: 1.4;
}

.wikihover-tweets {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.wikihover-tweet {
  padding: 12px;
  border: 1px solid var(--wh-border);
  border-radius: 8px;
  transition: background-color 0.15s ease;
}

.wikihover-tweet:hover {
  background-color: var(--wh-hover-bg);
}

.wikihover-tweet-text {
  color: var(--wh-content-text);
  font-size: 14px;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.wikihover-tweet-metrics {
  display: flex;
  gap: 15px;
  color: var(--wh-content-secondary);
  font-size: 12px;
}

.wikihover-verified-badge {
  color: #1d9bf0;
  margin-left: 5px;
  font-size: 14px;
}

/* Twitter match list styles */
.wikihover-twitter-matches {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 482px;
  overflow-y: auto;
}

.wikihover-twitter-match {
  padding: 12px;
  border: 1px solid var(--wh-border);
  border-radius: 8px;
  background-color: var(--wh-card-bg);
}

.wikihover-twitter-match .wikihover-twitter-profile {
  margin-bottom: 10px;
}

.wikihover-twitter-match .wikihover-twitter-avatar {
  width: 40px;
  height: 40px;
}

.wikihover-twitter-profile-link {
  display: inline-block;
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #1DA1F2;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 12px;
}

.wikihover-twitter-profile-link:hover {
  background-color: #0c85d0;
}

/* Twitter X button in Wikipedia tab */
.wikihover-x-button {
  margin-top: 15px;
  text-align: center;
}

.wikihover-x-button a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  background-color: rgba(29, 161, 242, 0.1);
  color: #1DA1F2;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.wikihover-x-button a:hover {
  background-color: rgba(29, 161, 242, 0.2);
}

.wikihover-x-button svg {
  flex-shrink: 0;
}

/* Instagram specific styles */
.wikihover-instagram-content {
  margin: 0;
  padding: 0;
  font-size: 13px;
  line-height: 1.5;
}

.wikihover-instagram-content.active {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  height: auto !important;
  overflow: visible !important;
  position: relative !important;
  z-index: 1 !important;
}

.wikihover-instagram-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.wikihover-instagram-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid var(--wh-border);
  object-fit: cover;
}

.wikihover-instagram-info h4 {
  margin: 0;
  color: var(--wh-content-text);
  font-size: 15px;
}

.wikihover-instagram-stats {
  display: flex;
  gap: 15px;
  margin: 8px 0;
  color: var(--wh-content-text);
  font-size: 13px;
}

.wikihover-instagram-stats strong {
  font-weight: 600;
}

.wikihover-instagram-bio {
  color: var(--wh-content-text);
  font-size: 13px;
  margin: 8px 0;
  line-height: 1.4;
}

.wikihover-instagram-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-top: 10px;
}

.wikihover-instagram-media-item {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 4px;
  background: var(--wh-card-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.wikihover-instagram-media-item video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

/* Instagram Reels / Video autoplay area expansion */
.wikihover-reel-expanded-player {
  position: relative !important;
  background: #000 !important;
  border-radius: 6px !important;
  overflow: hidden !important;
  cursor: pointer !important;
  animation: wikihover-reel-expand 0.2s ease-out;
}

@keyframes wikihover-reel-expand {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

.wikihover-reel-expanded-player video {
  width: 100% !important;
  object-fit: contain !important;
  background: #000 !important;
  display: block !important;
}

.wikihover-reel-expanded-player img {
  width: 100% !important;
  object-fit: contain !important;
  background: #000 !important;
}

.wikihover-player-btn {
  transition: color 0.2s !important;
}
.wikihover-player-btn:hover {
  color: #E1306C !important;
}
.wikihover-next-btn {
  transition: color 0.2s, background 0.2s !important;
}
.wikihover-next-btn:hover {
  color: #E1306C !important;
  background: rgba(255,255,255,0.25) !important;
}

/* TikTok specific styles */
.wikihover-tiktok-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.wikihover-tiktok-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
}

.wikihover-tiktok-info h4 {
  margin: 0;
  color: var(--wh-content-text);
  font-size: 15px;
}

.wikihover-tiktok-stats {
  display: flex;
  gap: 15px;
  margin: 8px 0;
  color: var(--wh-content-text);
  font-size: 13px;
}

.wikihover-tiktok-stats strong {
  font-weight: 600;
}

.wikihover-tiktok-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-top: 10px;
}

.wikihover-tiktok-media-item {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 4px;
  background: var(--wh-card-bg, #f5f5f5);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.wikihover-tiktok-expanded {
  animation: wikihover-tiktok-expand 0.2s ease-out;
}

@keyframes wikihover-tiktok-expand {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes wikihover-tiktok-spin {
  to { transform: rotate(360deg); }
}

/* Football specific styles */
.wikihover-football-content {
  margin: 0;
  padding: 0;
  font-size: 13px;
  line-height: 1.5;
}

.wikihover-football-content.active {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  height: auto !important;
  overflow: visible !important;
  position: relative !important;
  z-index: 1 !important;
}

.wikihover-football-profile {
  display: flex !important;
  align-items: flex-start !important;
  gap: 12px !important;
  margin-bottom: 12px !important;
  padding-bottom: 10px !important;
  border-bottom: 1px solid var(--wh-border-light) !important;
}

.wikihover-football-photo {
  width: 60px !important;
  height: 60px !important;
  border-radius: 50% !important;
  object-fit: cover !important;
  flex-shrink: 0 !important;
  border: 2px solid var(--wh-border) !important;
}

.wikihover-football-info {
  flex: 1 !important;
}

.wikihover-football-info h4 {
  margin: 0 0 4px 0 !important;
  font-size: 15px !important;
  color: var(--wh-content-text) !important;
}

.wikihover-football-info .wikihover-football-meta {
  font-size: 12px !important;
  color: var(--wh-text-secondary) !important;
  line-height: 1.4 !important;
}

.wikihover-football-team {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 8px 0 !important;
  border-bottom: 1px solid var(--wh-border-light) !important;
  margin-bottom: 10px !important;
}

.wikihover-football-team img {
  width: 24px !important;
  height: 24px !important;
  object-fit: contain !important;
}

.wikihover-football-team-info {
  display: flex !important;
  flex-direction: column !important;
  font-size: 13px !important;
}

.wikihover-football-team-name {
  font-weight: 600 !important;
  color: var(--wh-text) !important;
}

.wikihover-football-league-name {
  font-size: 11px !important;
  color: var(--wh-text-muted) !important;
}

.wikihover-football-stats {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 6px !important;
  margin-bottom: 12px !important;
}

.wikihover-football-stat {
  background: var(--wh-card-bg) !important;
  border-radius: 6px !important;
  padding: 8px 4px !important;
  text-align: center !important;
}

.wikihover-football-stat-value {
  display: block !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  color: var(--wh-text) !important;
}

.wikihover-football-stat-label {
  display: block !important;
  font-size: 10px !important;
  color: var(--wh-text-muted) !important;
  text-transform: uppercase !important;
  margin-top: 2px !important;
}

.wikihover-football-section-title {
  font-size: 12px !important;
  font-weight: 600 !important;
  color: var(--wh-text-secondary) !important;
  margin: 10px 0 6px 0 !important;
  padding-bottom: 4px !important;
  border-bottom: 1px solid var(--wh-border-light) !important;
}

.wikihover-football-highlights {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  gap: 8px !important;
  margin-top: 8px !important;
}

.wikihover-football-highlight {
  border-radius: 6px !important;
  overflow: hidden !important;
  background: var(--wh-card-bg) !important;
  cursor: pointer !important;
  position: relative !important;
}

.wikihover-football-highlight-thumb {
  width: 100% !important;
  aspect-ratio: 16/9 !important;
  object-fit: cover !important;
  display: block !important;
}

.wikihover-football-highlight-play {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  width: 36px !important;
  height: 36px !important;
  background: rgba(0,0,0,0.6) !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: white !important;
  font-size: 16px !important;
  pointer-events: none !important;
}

.wikihover-football-highlight-title {
  font-size: 11px !important;
  color: var(--wh-text) !important;
  padding: 4px 6px !important;
  line-height: 1.3 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.wikihover-football-highlight iframe {
  width: 100% !important;
  aspect-ratio: 16/9 !important;
  border: none !important;
  display: block !important;
}

.wikihover-football-career {
  margin-top: 8px !important;
}

.wikihover-football-career-item {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 4px 0 !important;
  font-size: 12px !important;
  color: var(--wh-text-secondary) !important;
  border-bottom: 1px solid var(--wh-border-light) !important;
}

.wikihover-football-career-item img {
  width: 20px !important;
  height: 20px !important;
  object-fit: contain !important;
}

.wikihover-football-career-item:last-child {
  border-bottom: none !important;
}

/* TikTok specific styles */
.wikihover-tiktok-content {
  margin: 0;
  padding: 0;
  font-size: 13px;
  line-height: 1.5;
}

.wikihover-tiktok-content.active {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  height: auto !important;
  overflow: visible !important;
  position: relative !important;
  z-index: 1 !important;
}

.wikihover-tiktok-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.wikihover-tiktok-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid var(--wh-border);
  object-fit: cover;
}

.wikihover-tiktok-info h4 {
  margin: 0;
  color: var(--wh-content-text);
  font-size: 15px;
}

.wikihover-tiktok-stats {
  display: flex;
  gap: 15px;
  margin: 8px 0;
  color: var(--wh-content-text);
  font-size: 13px;
}

.wikihover-tiktok-stats strong {
  font-weight: 600;
}

.wikihover-tiktok-bio {
  color: var(--wh-content-text);
  font-size: 13px;
  margin: 8px 0;
  line-height: 1.4;
}

.wikihover-tiktok-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-top: 10px;
}

.wikihover-tiktok-video-item {
  aspect-ratio: 9/16;
  overflow: hidden;
  border-radius: 4px;
  background: var(--wh-card-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.wikihover-tiktok-video-item img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}

.wikihover-tiktok-video-item video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

/* TikTok expanded video player */
.wikihover-tiktok-expanded-player {
  position: relative !important;
  background: #000 !important;
  border-radius: 6px !important;
  overflow: hidden !important;
  cursor: pointer !important;
  animation: wikihover-reel-expand 0.2s ease-out;
}

.wikihover-tiktok-expanded-player video {
  width: 100% !important;
  object-fit: contain !important;
  background: #000 !important;
  display: block !important;
}

.wikihover-tiktok-player-btn {
  transition: color 0.2s;
}

.wikihover-tiktok-player-btn:hover {
  color: #fe2c55 !important;
}

.wikihover-tiktok-next-btn {
  transition: color 0.2s, background 0.2s;
}

.wikihover-tiktok-next-btn:hover {
  color: #fe2c55 !important;
  background: rgba(255, 255, 255, 0.25) !important;
}

/* Pinterest specific styles */
.wikihover-pinterest-content {
  margin: 0;
  padding: 0;
  font-size: 13px;
  line-height: 1.5;
}

.wikihover-pinterest-content.active {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  height: auto !important;
  overflow: visible !important;
  position: relative !important;
  z-index: 1 !important;
}

.wikihover-pinterest-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.wikihover-pinterest-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--wh-border);
  object-fit: cover;
}

.wikihover-pinterest-stats {
  display: flex;
  gap: 15px;
  margin: 8px 0;
  color: var(--wh-content-text);
  font-size: 13px;
}

.wikihover-pinterest-bio {
  color: var(--wh-content-text);
  font-size: 13px;
  margin: 8px 0;
  line-height: 1.4;
}

.wikihover-pinterest-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-top: 10px;
}

.wikihover-pinterest-pin {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  background: var(--wh-card-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  text-decoration: none !important;
  transition: opacity 0.15s ease;
}

.wikihover-pinterest-pin:hover {
  opacity: 0.85;
}

.wikihover-pinterest-pin img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}

.wikihover-pinterest-pin-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px 6px;
  background: linear-gradient(transparent, rgba(0,0,0,0.6));
  color: white !important;
  font-size: 10px;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Pinterest expanded image viewer */
.wikihover-pinterest-expanded {
  position: relative !important;
  background: #000 !important;
  border-radius: 6px !important;
  overflow: hidden !important;
  animation: wikihover-reel-expand 0.2s ease-out;
}

.wikihover-pinterest-expanded-img {
  width: 100% !important;
  max-height: 400px !important;
  object-fit: contain !important;
  background: #000 !important;
  display: block !important;
}

.wikihover-pinterest-expanded-close {
  position: absolute !important;
  top: 8px !important;
  right: 8px !important;
  width: 28px !important;
  height: 28px !important;
  background: rgba(0,0,0,0.6) !important;
  color: white !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 18px !important;
  cursor: pointer !important;
  z-index: 15 !important;
  line-height: 1 !important;
  transition: background 0.2s !important;
}

.wikihover-pinterest-expanded-close:hover {
  background: rgba(0,0,0,0.85) !important;
}

.wikihover-pinterest-expanded-nav {
  position: absolute !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 32px !important;
  height: 32px !important;
  background: rgba(0,0,0,0.5) !important;
  color: white !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 16px !important;
  cursor: pointer !important;
  z-index: 15 !important;
  transition: background 0.2s !important;
  user-select: none !important;
}

.wikihover-pinterest-expanded-nav:hover {
  background: rgba(0,0,0,0.8) !important;
}

.wikihover-pinterest-nav-prev {
  left: 8px !important;
}

.wikihover-pinterest-nav-next {
  right: 8px !important;
}

.wikihover-pinterest-expanded-caption {
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  background: linear-gradient(transparent, rgba(0,0,0,0.75)) !important;
  color: white !important;
  font-size: 12px !important;
  padding: 20px 12px 10px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}`;
    }
  });

  // content.js
  var require_content = __commonJS({
    "content.js"() {
      var DEBUG = false;
      function debugLog(...args) {
        if (DEBUG) console.log("WikiHover:", ...args);
      }
      function isExtensionValid() {
        try {
          return !!(chrome && chrome.runtime && chrome.runtime.id);
        } catch (e) {
          return false;
        }
      }
      function safeStorageGet(keys) {
        return new Promise((resolve) => {
          if (!isExtensionValid()) {
            resolve({});
            return;
          }
          try {
            chrome.storage.local.get(keys, (result) => {
              if (chrome.runtime.lastError) {
                resolve({});
                return;
              }
              resolve(result);
            });
          } catch (e) {
            resolve({});
          }
        });
      }
      function safeStorageSet(data) {
        if (!isExtensionValid()) return;
        try {
          chrome.storage.local.set(data, () => {
            if (chrome.runtime.lastError) {
              debugLog("Storage set failed:", chrome.runtime.lastError.message);
            }
          });
        } catch (e) {
        }
      }
      var tooltipElement = null;
      var currentWord = null;
      var currentHoveredElement = null;
      var tooltipTimer = null;
      var TOOLTIP_DELAY = 300;
      var markedNames = /* @__PURE__ */ new Set();
      var markedByDocument = /* @__PURE__ */ new Set();
      var processedNamesCount = 0;
      var apiCallCount = 0;
      var lastScanTimestamp = 0;
      var observer = null;
      var isScanning = false;
      var MAX_API_CALLS = 50;
      var RESCAN_INTERVAL = 500;
      var VIEWPORT_BUFFER = 200;
      var isTooltipVisible = false;
      var tooltipHideGraceUntil = 0;
      var lastRepositionTime = 0;
      var REPOSITION_GRACE_MS = 300;
      var pendingScrollRAF = false;
      var cachedTooltipWidth = 0;
      var cachedTooltipHeight = 0;
      var initialized = false;
      var extensionEnabled = true;
      var pinnedTooltips = [];
      var MAX_PINNED_TOOLTIPS = 3;
      var unmarkedNames = /* @__PURE__ */ new Set();
      var tabOrder = null;
      var tooltipNavHistory = [];
      var tooltipNavIndex = -1;
      var navFromHistory = false;
      var feedPrefetchCache = {};
      var feedResultCache = {};
      var MAX_PREFETCH_CACHE_NAMES = 100;
      function _feedKeyToClass(key) {
        const map = {
          wiki: "wiki",
          wikipedia: "wiki",
          tvmaze: "tvmaze",
          imdb: "imdb",
          instagram: "instagram",
          twitter: "twitter",
          tiktok: "tiktok",
          pinterest: "pinterest",
          football: "football",
          books: "books"
        };
        return map[key] || key;
      }
      function _tabNameToFeedKey(tabName) {
        if (tabName === "wiki") return "wikipedia";
        return tabName;
      }
      function _feedIdToKey(feedId) {
        var _a2, _b;
        if (feedId == null || !((_a2 = window.WikiHover) == null ? void 0 : _a2.isReady())) return null;
        const feedsMap = (_b = window.WikiHover.getConfig()) == null ? void 0 : _b.feeds;
        if (!feedsMap) return null;
        for (const [key, entry] of Object.entries(feedsMap)) {
          const entryId = entry && typeof entry === "object" ? entry.id : entry;
          if (entryId === feedId) return key;
        }
        return null;
      }
      var nameRegex = /\b[A-Z][a-zÀ-ÿ][a-zA-ZÀ-ÿ\-']*\s+[A-Z][a-zÀ-ÿ][a-zA-ZÀ-ÿ\-']*\b/g;
      var multiWordNameRegex = /\b[A-Z][a-zÀ-ÿ][a-zA-ZÀ-ÿ\-']*(?:\s+[A-Z][a-zÀ-ÿ][a-zA-ZÀ-ÿ\-']*){2,}\b/g;
      var NON_PERSON_POS_TAGS = [
        "#Demonym",
        // Canadian, American, French
        "#Determiner",
        // The, A, This
        "#Gerund",
        // Cursing, Breaking, Running
        "#Adjective",
        // Olympic, Grand, Metal, Red, Super
        "#Preposition",
        // Of, In, At
        "#Pronoun",
        // He, She, They
        "#QuestionWord",
        // Who, What, Where
        "#Conjunction",
        // And, But, Or
        "#Country",
        // Korea, France (missed by .places())
        "#City",
        // London, Paris (missed by .places())
        "#Region",
        // Midwest, Scandinavia
        "#Month",
        // January, March
        "#WeekDay",
        // Monday, Friday
        "#Holiday",
        // Christmas, Easter
        "#Currency",
        // Dollar, Euro
        "#Activity",
        // Sports, games
        "#Unit",
        // Meter, Cup (unit of measure)
        "#Copula",
        // is, am, are, was
        "#Modal"
        // can, could, should
      ];
      var hebrewWordRegex = /[\u05D0-\u05EA][\u0590-\u05FF]+/g;
      function isHebrewText(text) {
        return /[\u05D0-\u05EA]/.test(text);
      }
      function stripNikud(text) {
        return text.replace(/[\u0591-\u05C7]/g, "");
      }
      function findHebrewNames(text) {
        const matches = [];
        const words = [];
        let m;
        hebrewWordRegex.lastIndex = 0;
        while ((m = hebrewWordRegex.exec(text)) !== null) {
          words.push({ word: stripNikud(m[0]), raw: m[0], index: m.index, end: m.index + m[0].length });
        }
        let i = 0;
        while (i < words.length) {
          const w1 = words[i];
          const isFirst = HEBREW_FIRST_NAMES.has(w1.word);
          if (i + 1 < words.length) {
            const w2 = words[i + 1];
            const gap = text.substring(w1.end, w2.index);
            if (/^\s+$/.test(gap)) {
              const isLast2 = HEBREW_LAST_NAMES.has(w2.word);
              if (isFirst) {
                const fullMatch = text.substring(w1.index, w2.end);
                matches.push({ 0: fullMatch, index: w1.index });
                i += 2;
                continue;
              }
              if (isLast2) {
                const fullMatch = text.substring(w1.index, w2.end);
                matches.push({ 0: fullMatch, index: w1.index });
                i += 2;
                continue;
              }
            }
          }
          i++;
        }
        return matches;
      }
      var enableEnhancedNameDetection = true;
      var dataSourceSettings = {
        wikipedia: true,
        tvmaze: true,
        imdb: true,
        books: true,
        instagram: true,
        twitter: true,
        football: true,
        tiktok: true,
        pinterest: true
      };
      var videoSoundEnabled = true;
      safeStorageGet(["dataSourceSettings", "videoSound"]).then((result) => {
        if (result.dataSourceSettings) {
          dataSourceSettings = { ...dataSourceSettings, ...result.dataSourceSettings };
        }
        if (result.videoSound !== void 0) {
          videoSoundEnabled = result.videoSound !== false;
        }
        window._whVideoSoundEnabled = videoSoundEnabled;
      });
      function handleCompromiseFailure() {
        window.compromiseAvailable = false;
      }
      function loadCompromiseLibrary() {
        if (typeof window !== "undefined" && typeof window.nlp === "function") {
          return Promise.resolve(window.nlp);
        }
        handleCompromiseFailure();
        return Promise.reject(
          new Error(
            window.__WIKIHOVER_EMBED__ ? "WikiHover embed: window.nlp missing \u2014 rebuild player (compromise.min.js must be prepended)" : "Compromise not loaded \u2014 ensure compromise.min.js is listed before content.js in manifest.json"
          )
        );
      }
      function hasNonPersonPOSTags(doc, candidateName) {
        try {
          const matchDoc = doc.match(candidateName);
          if (matchDoc.found) {
            if (matchDoc.has("#Person") || matchDoc.has("#FirstName") || matchDoc.has("#LastName") || matchDoc.has("#Honorific") || matchDoc.has("#NickName")) {
              return false;
            }
            for (const tag of NON_PERSON_POS_TAGS) {
              if (matchDoc.has(tag)) return true;
            }
          }
          const words = candidateName.split(/\s+/);
          for (const word of words) {
            if (word.length < 2) continue;
            const wordDoc = window.nlp(word);
            if (wordDoc.has("#Person") || wordDoc.has("#FirstName") || wordDoc.has("#LastName") || wordDoc.has("#Honorific") || wordDoc.has("#NickName")) {
              return false;
            }
            for (const tag of NON_PERSON_POS_TAGS) {
              if (wordDoc.has(tag)) {
                debugLog('rejected word "' + word + '" has tag ' + tag + ' in "' + candidateName + '"');
                return true;
              }
            }
          }
          return false;
        } catch (error) {
          return false;
        }
      }
      function getNlpApprovedNames(fullText) {
        const approved = /* @__PURE__ */ new Set();
        if (!window.compromiseAvailable || !fullText) return approved;
        try {
          const doc = window.nlp(fullText);
          const people = doc.people().out("array");
          const places = doc.places().out("array");
          const orgs = doc.organizations().out("array");
          const rejected = /* @__PURE__ */ new Set();
          for (const p of places) rejected.add(p.toLowerCase().trim());
          for (const o of orgs) rejected.add(o.toLowerCase().trim());
          for (const person of people) {
            const clean = person.replace(/'s$/i, "").trim();
            if (!clean || rejected.has(clean.toLowerCase())) continue;
            if (hasNonPersonPOSTags(doc, clean)) {
              debugLog("rejected (POS tags):", clean);
              continue;
            }
            approved.add(clean);
          }
          if (approved.size > 0) debugLog("batch NLP approved:", Array.from(approved));
          return approved;
        } catch (error) {
          console.error("WikiHover: Error in getNlpApprovedNames:", error);
          return approved;
        }
      }
      function isNameNlpApproved(name, approvedNames) {
        const cleanName = name.replace(/'s$/i, "").trim();
        const lowerName = cleanName.toLowerCase();
        for (const approved of approvedNames) {
          if (approved === cleanName) return true;
        }
        for (const approved of approvedNames) {
          const lowerApproved = approved.toLowerCase();
          if (lowerApproved.includes(lowerName) || lowerName.includes(lowerApproved)) {
            return true;
          }
        }
        return false;
      }
      function extractPersonFromSequence(sequence, nlpApproved) {
        if (!window.compromiseAvailable) return null;
        try {
          const words = sequence.split(/\s+/);
          if (words.length < 3) return null;
          const doc = window.nlp(sequence);
          const people = doc.people().out("array");
          if (people.length > 0) {
            let personName = people[0].replace(/'s$/i, "").trim();
            const personMatch = doc.match(personName);
            if (personMatch.found) {
              const personTerms = personMatch.terms().out("tags");
              const personWords = personName.split(/\s+/);
              const cleanedWords = [];
              for (let i = 0; i < personWords.length; i++) {
                const wordTags = personTerms[i] ? Object.values(personTerms[i])[0] || [] : [];
                if (wordTags.includes("Honorific")) {
                  debugLog('stripping honorific "' + personWords[i] + '" from "' + personName + '"');
                  continue;
                }
                cleanedWords.push(personWords[i]);
              }
              if (cleanedWords.length >= 2) {
                personName = cleanedWords.join(" ");
              }
            }
            const nameIdx = sequence.indexOf(personName);
            if (nameIdx !== -1) {
              return {
                name: personName,
                startOffset: nameIdx,
                endOffset: nameIdx + personName.length
              };
            }
          }
          if (nlpApproved && nlpApproved.size > 0) {
            for (let i = words.length - 2; i >= 0; i--) {
              const pair = words[i] + " " + words[i + 1];
              if (isNameNlpApproved(pair, nlpApproved)) {
                const pairIdx = sequence.indexOf(pair);
                if (pairIdx !== -1) {
                  return {
                    name: pair,
                    startOffset: pairIdx,
                    endOffset: pairIdx + pair.length
                  };
                }
              }
            }
          }
          for (let i = words.length - 2; i >= 0; i--) {
            const pair = words[i] + " " + words[i + 1];
            const pairDoc = window.nlp(pair);
            if (pairDoc.people().out("array").length > 0 && !hasNonPersonPOSTags(pairDoc, pair)) {
              const pairIdx = sequence.indexOf(pair);
              if (pairIdx !== -1) {
                return {
                  name: pair,
                  startOffset: pairIdx,
                  endOffset: pairIdx + pair.length
                };
              }
            }
          }
          return null;
        } catch (error) {
          debugLog("Error in extractPersonFromSequence:", error);
          return null;
        }
      }
      function enhanceNameDetection(name, contextText) {
        try {
          const cleanName = name.replace(/'s$/i, "").trim();
          const textToAnalyze = contextText && contextText.length > cleanName.length ? contextText : cleanName;
          const doc = window.nlp(textToAnalyze);
          const people = doc.people().out("array");
          const places = doc.places().out("array");
          const orgs = doc.organizations().out("array");
          const rejectedLower = /* @__PURE__ */ new Set();
          for (const p of places) rejectedLower.add(p.toLowerCase().trim());
          for (const o of orgs) rejectedLower.add(o.toLowerCase().trim());
          if (rejectedLower.has(cleanName.toLowerCase())) {
            debugLog("rejected (place/org):", cleanName);
            return null;
          }
          if (hasNonPersonPOSTags(doc, cleanName)) {
            debugLog("rejected (POS tags):", cleanName);
            return null;
          }
          if (people.length > 0) {
            for (const person of people) {
              const cleanPerson = person.replace(/'s$/i, "").trim();
              const lowerPerson = cleanPerson.toLowerCase();
              const lowerName = cleanName.toLowerCase();
              if (lowerPerson.includes(lowerName) || lowerName.includes(lowerPerson)) {
                const result = !cleanPerson.includes(" ") && cleanName.includes(" ") ? cleanName : cleanPerson;
                debugLog("approved (NLP):", result);
                return result;
              }
            }
          }
          debugLog("rejected:", cleanName);
          return null;
        } catch (error) {
          console.error("WikiHover: Error in enhanceNameDetection:", error);
          return null;
        }
      }
      function initOnce() {
        if (initialized) return;
        initialized = true;
        debugLog("Initializing");
        createTooltip();
        safeStorageGet(["enabled"]).then((result) => {
          if (result.enabled !== void 0) {
            extensionEnabled = result.enabled;
          }
        });
        safeStorageGet(["tooltipTheme"]).then((result) => {
          const theme = result.tooltipTheme || "light";
          if (theme !== "light") {
            document.documentElement.setAttribute("data-wikihover-theme", theme);
          }
        });
        loadCompromiseLibrary().then(() => {
          if (typeof window.nlp === "function") {
            debugLog("Compromise loaded successfully");
            window.compromiseAvailable = true;
          } else {
            handleCompromiseFailure();
          }
        }).catch((error) => {
          console.error("WikiHover: Failed to load Compromise:", error);
          handleCompromiseFailure();
        }).finally(() => {
          initializeExtensionOnPage();
        });
      }
      if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(initOnce, 0);
      } else {
        document.addEventListener("DOMContentLoaded", initOnce);
      }
      function ensureTooltipExists() {
        if (!tooltipElement || !document.body.contains(tooltipElement)) {
          createTooltip();
        }
        return tooltipElement;
      }
      function createTooltip() {
        var _a2, _b, _c;
        debugLog("Creating tooltip");
        const existingTooltips = document.querySelectorAll(".wikihover-tooltip");
        existingTooltips.forEach((tooltip) => {
          if (tooltip !== tooltipElement) {
            tooltip.remove();
          }
        });
        if (tooltipElement && !document.body.contains(tooltipElement)) {
          tooltipElement = null;
        }
        if (tooltipElement) {
          tooltipElement.classList.remove("visible");
          isTooltipVisible = false;
          return;
        }
        tooltipElement = document.createElement("div");
        tooltipElement.className = "wikihover-tooltip";
        tooltipElement.setAttribute("data-wikihover-tooltip", "true");
        tooltipElement.setAttribute("id", "wikihover-tooltip-" + Date.now());
        safeStorageGet(["tooltipTheme"]).then((result) => {
          const theme = result.tooltipTheme || "light";
          if (theme !== "light") {
            tooltipElement.setAttribute("data-wikihover-theme", theme);
            document.documentElement.setAttribute("data-wikihover-theme", theme);
          }
        });
        const header = document.createElement("div");
        header.className = "wikihover-header";
        const title = document.createElement("h3");
        title.className = "wikihover-title";
        header.appendChild(title);
        const navButtons = document.createElement("div");
        navButtons.style.cssText = "display:flex;align-items:center;gap:2px;margin-left:6px;";
        const navBack = document.createElement("span");
        navBack.innerHTML = "&#9664;";
        navBack.title = "Back";
        navBack.style.cssText = "display:none;cursor:pointer;font-size:11px;color:#999;padding:2px 5px;border-radius:3px;transition:color 0.2s,background 0.2s;user-select:none;line-height:1;white-space:nowrap;";
        navBack.addEventListener("mouseenter", () => {
          navBack.style.color = "#0645AD";
          navBack.style.background = "rgba(6,69,173,0.08)";
        });
        navBack.addEventListener("mouseleave", () => {
          navBack.style.color = "#999";
          navBack.style.background = "transparent";
        });
        navBack.addEventListener("click", (e) => {
          e.stopPropagation();
          if (tooltipNavIndex > 0) {
            tooltipNavIndex--;
            navFromHistory = true;
            navigateToHistoryEntry(tooltipNavHistory[tooltipNavIndex]);
          }
        });
        navButtons.appendChild(navBack);
        const navFwd = document.createElement("span");
        navFwd.innerHTML = "&#9654;";
        navFwd.title = "Forward";
        navFwd.style.cssText = "display:none;cursor:pointer;font-size:11px;color:#999;padding:2px 5px;border-radius:3px;transition:color 0.2s,background 0.2s;user-select:none;line-height:1;white-space:nowrap;";
        navFwd.addEventListener("mouseenter", () => {
          navFwd.style.color = "#0645AD";
          navFwd.style.background = "rgba(6,69,173,0.08)";
        });
        navFwd.addEventListener("mouseleave", () => {
          navFwd.style.color = "#999";
          navFwd.style.background = "transparent";
        });
        navFwd.addEventListener("click", (e) => {
          e.stopPropagation();
          if (tooltipNavIndex < tooltipNavHistory.length - 1) {
            tooltipNavIndex++;
            navFromHistory = true;
            navigateToHistoryEntry(tooltipNavHistory[tooltipNavIndex]);
          }
        });
        navButtons.appendChild(navFwd);
        header.appendChild(navButtons);
        tooltipElement._navBack = navBack;
        tooltipElement._navFwd = navFwd;
        const headerButtons = document.createElement("div");
        headerButtons.className = "wikihover-header-buttons";
        const fullscreenBtn = document.createElement("span");
        fullscreenBtn.className = "wikihover-fullscreen-btn";
        fullscreenBtn.innerHTML = "&#x26F6;";
        fullscreenBtn.title = "Toggle fullscreen";
        fullscreenBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const tt = fullscreenBtn.closest(".wikihover-tooltip, .wikihover-pinned-tooltip");
          if (!tt) return;
          const isFullscreen = tt.classList.contains("wikihover-fullscreen");
          if (isFullscreen) {
            tt.classList.remove("wikihover-fullscreen");
            const savedLeft = tt.dataset.whFsLeft;
            const savedTop = tt.dataset.whFsTop;
            const savedWidth = tt.dataset.whFsWidth;
            const savedHeight = tt.dataset.whFsHeight;
            tt.style.setProperty("left", savedLeft, "important");
            tt.style.setProperty("top", savedTop, "important");
            applyTooltipSize(tt, parseFloat(savedWidth), parseFloat(savedHeight));
            delete tt.dataset.whFsLeft;
            delete tt.dataset.whFsTop;
            delete tt.dataset.whFsWidth;
            delete tt.dataset.whFsHeight;
            fullscreenBtn.innerHTML = "&#x26F6;";
            fullscreenBtn.title = "Toggle fullscreen";
          } else {
            const rect = tt.getBoundingClientRect();
            tt.dataset.whFsLeft = tt.style.getPropertyValue("left") || rect.left + "px";
            tt.dataset.whFsTop = tt.style.getPropertyValue("top") || rect.top + "px";
            tt.dataset.whFsWidth = rect.width;
            tt.dataset.whFsHeight = rect.height;
            tt.classList.add("wikihover-fullscreen");
            applyTooltipSize(tt, window.innerWidth, window.innerHeight);
            fullscreenBtn.innerHTML = "&#x29C4;";
            fullscreenBtn.title = "Exit fullscreen";
          }
          tooltipHideGraceUntil = Date.now() + 2e3;
        });
        headerButtons.appendChild(fullscreenBtn);
        const resizeBtn = document.createElement("span");
        resizeBtn.className = "wikihover-resize-btn";
        resizeBtn.innerHTML = "&#9634;";
        resizeBtn.title = "Reset size (500\xD7500)";
        resizeBtn.style.cssText = "cursor:pointer;font-size:16px;padding:0 4px;opacity:0.6;transition:opacity 0.2s;line-height:1;";
        resizeBtn.addEventListener("mouseenter", () => {
          resizeBtn.style.opacity = "1";
        });
        resizeBtn.addEventListener("mouseleave", () => {
          resizeBtn.style.opacity = "0.6";
        });
        resizeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const tt = resizeBtn.closest(".wikihover-tooltip, .wikihover-pinned-tooltip");
          if (tt) {
            if (tt.classList.contains("wikihover-fullscreen")) {
              tt.classList.remove("wikihover-fullscreen");
              const savedLeft = tt.dataset.whFsLeft;
              const savedTop = tt.dataset.whFsTop;
              if (savedLeft) tt.style.setProperty("left", savedLeft, "important");
              if (savedTop) tt.style.setProperty("top", savedTop, "important");
              delete tt.dataset.whFsLeft;
              delete tt.dataset.whFsTop;
              delete tt.dataset.whFsWidth;
              delete tt.dataset.whFsHeight;
              const fsBtn = tt.querySelector(".wikihover-fullscreen-btn");
              if (fsBtn) {
                fsBtn.innerHTML = "&#x26F6;";
                fsBtn.title = "Toggle fullscreen";
              }
            }
            applyTooltipSize(tt, 500, 500);
            safeStorageSet({ tooltipSize: { width: 500, height: 500 } });
            tooltipHideGraceUntil = Date.now() + 2e3;
          }
        });
        headerButtons.appendChild(resizeBtn);
        const dupPinBtn = document.createElement("span");
        dupPinBtn.className = "wikihover-duplicate-pin";
        dupPinBtn.innerHTML = "&#x29C9;";
        dupPinBtn.title = "Duplicate & pin";
        dupPinBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          duplicateAndPinTooltip(dupPinBtn.closest(".wikihover-tooltip, .wikihover-pinned-tooltip"));
        });
        headerButtons.appendChild(dupPinBtn);
        const pinButton = document.createElement("span");
        pinButton.className = "wikihover-pin";
        pinButton.innerHTML = "&#128204;";
        pinButton.title = "Pin tooltip";
        pinButton.addEventListener("click", (e) => {
          e.stopPropagation();
          pinCurrentTooltip();
        });
        headerButtons.appendChild(pinButton);
        const unmarkButton = document.createElement("span");
        unmarkButton.className = "wikihover-unmark";
        unmarkButton.innerHTML = "&#128683;";
        unmarkButton.title = "Unmark this name";
        unmarkButton.addEventListener("click", (e) => {
          e.stopPropagation();
          unmarkCurrentName();
        });
        headerButtons.appendChild(unmarkButton);
        const closeButton = document.createElement("span");
        closeButton.className = "wikihover-close";
        closeButton.innerHTML = "&times;";
        closeButton.addEventListener("click", hideTooltip);
        headerButtons.appendChild(closeButton);
        header.appendChild(headerButtons);
        tooltipElement.appendChild(header);
        const tabs = document.createElement("div");
        tabs.className = "wikihover-sidebar";
        const tabDefs = [
          { key: "wiki", label: "Wikipedia", favicon: "https://www.google.com/s2/favicons?domain=wikipedia.org&sz=128", active: true },
          { key: "tvmaze", label: "TVMaze", favicon: "https://www.google.com/s2/favicons?domain=tvmaze.com&sz=128" },
          { key: "imdb", label: "IMDb", favicon: "https://www.google.com/s2/favicons?domain=imdb.com&sz=128" },
          { key: "books", label: "Books", favicon: "https://www.google.com/s2/favicons?domain=openlibrary.org&sz=128" },
          { key: "instagram", label: "Instagram", favicon: "https://www.google.com/s2/favicons?domain=instagram.com&sz=128" },
          { key: "twitter", label: "X", favicon: "https://www.google.com/s2/favicons?domain=x.com&sz=128" },
          { key: "football", label: "Football", favicon: "https://www.google.com/s2/favicons?domain=api-football.com&sz=128" },
          { key: "tiktok", label: "TikTok", favicon: "https://www.google.com/s2/favicons?domain=tiktok.com&sz=128" },
          { key: "pinterest", label: "Pinterest", favicon: "https://www.google.com/s2/favicons?domain=pinterest.com&sz=128" },
          { key: "polymarket", label: "Polymarket", favicon: "https://www.google.com/s2/favicons?domain=polymarket.com&sz=128" }
        ];
        if (tabOrder && tabOrder.length) {
          tabDefs.sort((a, b) => {
            const aIdx = tabOrder.indexOf(TAB_TO_SETTING[a.key]);
            const bIdx = tabOrder.indexOf(TAB_TO_SETTING[b.key]);
            return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
          });
        }
        const tabElements = {};
        tabDefs.forEach((def) => {
          const tab = document.createElement("button");
          tab.className = "wikihover-tab" + (def.active ? " active" : "");
          tab.setAttribute("data-tab", def.key);
          tab.title = def.label;
          tab.setAttribute("aria-label", def.label);
          const wrap = document.createElement("div");
          wrap.className = "wikihover-tab-favicon-wrap";
          const bwImg = document.createElement("img");
          bwImg.src = def.favicon;
          bwImg.alt = def.label;
          bwImg.className = "wikihover-tab-favicon-bw";
          wrap.appendChild(bwImg);
          const colorDiv = document.createElement("div");
          colorDiv.className = "wikihover-tab-favicon-color" + (def.key === "wiki" ? " wikihover-tab-favicon-revealed" : "");
          const colorImg = document.createElement("img");
          colorImg.src = def.favicon;
          colorImg.alt = def.label;
          colorDiv.appendChild(colorImg);
          wrap.appendChild(colorDiv);
          tab.appendChild(wrap);
          tab.addEventListener("click", () => switchTab(def.key));
          tabs.appendChild(tab);
          tabElements[def.key] = tab;
        });
        const wikiTab = tabElements.wiki;
        const tvMazeTab = tabElements.tvmaze;
        const imdbTab = tabElements.imdb;
        const booksTab = tabElements.books;
        const instagramTab = tabElements.instagram;
        const twitterTab = tabElements.twitter;
        const footballTab = tabElements.football;
        const tiktokTab = tabElements.tiktok;
        const pinterestTab = tabElements.pinterest;
        const body = document.createElement("div");
        body.className = "wikihover-body";
        body.appendChild(tabs);
        const contentContainer = document.createElement("div");
        contentContainer.className = "wikihover-content-container";
        const wikiContent = document.createElement("div");
        wikiContent.className = "wikihover-content wikihover-wiki-content active";
        contentContainer.appendChild(wikiContent);
        const tvMazeContent = document.createElement("div");
        tvMazeContent.className = "wikihover-content wikihover-tvmaze-content";
        contentContainer.appendChild(tvMazeContent);
        const imdbContent = document.createElement("div");
        imdbContent.className = "wikihover-content wikihover-imdb-content";
        contentContainer.appendChild(imdbContent);
        const booksContent = document.createElement("div");
        booksContent.className = "wikihover-content wikihover-books-content";
        contentContainer.appendChild(booksContent);
        const instagramContent = document.createElement("div");
        instagramContent.className = "wikihover-content wikihover-instagram-content";
        contentContainer.appendChild(instagramContent);
        const twitterContent = document.createElement("div");
        twitterContent.className = "wikihover-content wikihover-twitter-content";
        contentContainer.appendChild(twitterContent);
        const footballContent = document.createElement("div");
        footballContent.className = "wikihover-content wikihover-football-content";
        contentContainer.appendChild(footballContent);
        const tiktokContent = document.createElement("div");
        tiktokContent.className = "wikihover-content wikihover-tiktok-content";
        contentContainer.appendChild(tiktokContent);
        const pinterestContent = document.createElement("div");
        pinterestContent.className = "wikihover-content wikihover-pinterest-content";
        contentContainer.appendChild(pinterestContent);
        const polymarketContent = document.createElement("div");
        polymarketContent.className = "wikihover-content wikihover-polymarket-content";
        contentContainer.appendChild(polymarketContent);
        body.appendChild(contentContainer);
        tooltipElement.appendChild(body);
        const poweredBy = document.createElement("div");
        poweredBy.className = "wikihover-powered-by";
        const poweredLink = document.createElement("a");
        poweredLink.href = "https://wikihover.com";
        poweredLink.target = "_blank";
        poweredLink.textContent = "Powered by WikiHover";
        poweredBy.appendChild(poweredLink);
        tooltipElement.appendChild(poweredBy);
        const resizeHandle = document.createElement("div");
        resizeHandle.className = "wikihover-resize-handle";
        tooltipElement.appendChild(resizeHandle);
        document.body.appendChild(tooltipElement);
        safeStorageGet(["tooltipSize"]).then((result) => {
          if (result.tooltipSize) {
            applyTooltipSize(tooltipElement, result.tooltipSize.width, result.tooltipSize.height);
          }
        });
        makeResizable(tooltipElement, resizeHandle);
        makeDraggable(tooltipElement);
        const defaultFeedId = ((_a2 = window.WikiHover) == null ? void 0 : _a2.isReady()) && ((_b = window.WikiHover.getConfig()) == null ? void 0 : _b.defaultFeed);
        const defaultModuleKey = defaultFeedId != null ? _feedIdToKey(defaultFeedId) : null;
        const defaultTabKey = defaultModuleKey ? _feedKeyToClass(defaultModuleKey) : null;
        const firstEnabledInit = defaultTabKey ? tabDefs.find((d) => d.key === defaultTabKey && dataSourceSettings[TAB_TO_SETTING[d.key]] !== false) : null;
        const fallbackInit = tabDefs.find((d) => dataSourceSettings[TAB_TO_SETTING[d.key]] !== false);
        switchTab(((_c = firstEnabledInit || fallbackInit) == null ? void 0 : _c.key) || "wiki");
        document.addEventListener("click", function(e) {
          if (isTooltipVisible && !isTooltipElement(e.target) && !(currentHoveredElement == null ? void 0 : currentHoveredElement.contains(e.target))) {
            hideTooltip();
          }
        });
        document.addEventListener("wikihover:navigate", function(e) {
          var _a3;
          const name = (_a3 = e.detail) == null ? void 0 : _a3.name;
          if (!name) return;
          const pinned = e.target.closest(".wikihover-pinned-tooltip");
          if (pinned) {
            navigateInPinnedTooltip(pinned, name, false);
          } else {
            navigateToHistoryEntry(name);
          }
        });
        let tooltipLeaveTimeout = null;
        tooltipElement.addEventListener("mouseleave", () => {
          tooltipLeaveTimeout = setTimeout(() => {
            if (Date.now() - lastRepositionTime < REPOSITION_GRACE_MS) return;
            if (isTooltipVisible && !isMouseOverTooltip() && !isMouseOverHoveredName()) {
              hideTooltip();
            }
          }, 900);
        });
        tooltipElement.addEventListener("mouseenter", () => {
          clearTimeout(tooltipLeaveTimeout);
        });
        hideTooltip();
      }
      function pinCurrentTooltip() {
        var _a2;
        if (!tooltipElement || !isTooltipVisible) return;
        if (pinnedTooltips.length >= MAX_PINNED_TOOLTIPS) return;
        const pinnedName = tooltipElement.querySelector(".wikihover-title").textContent;
        const pinned = document.createElement("div");
        pinned.className = "wikihover-pinned-tooltip";
        pinned.setAttribute("data-wikihover-tooltip", "true");
        pinned.setAttribute("data-tooltip-name", pinnedName);
        pinned.setAttribute("id", "wikihover-pinned-" + Date.now());
        const currentTheme = tooltipElement.getAttribute("data-wikihover-theme");
        if (currentTheme) {
          pinned.setAttribute("data-wikihover-theme", currentTheme);
        }
        const rect = tooltipElement.getBoundingClientRect();
        pinned.style.setProperty("position", "fixed", "important");
        pinned.style.setProperty("left", rect.left + "px", "important");
        pinned.style.setProperty("top", rect.top + "px", "important");
        pinned.style.setProperty("width", rect.width + "px", "important");
        pinned.style.setProperty("height", rect.height + "px", "important");
        pinned.style.setProperty("max-height", rect.height + "px", "important");
        pinned.style.setProperty("display", "flex", "important");
        pinned.style.setProperty("visibility", "visible", "important");
        pinned.style.setProperty("opacity", "1", "important");
        pinned.style.setProperty("z-index", "9999999", "important");
        while (tooltipElement.firstChild) {
          pinned.appendChild(tooltipElement.firstChild);
        }
        const pinnedPinBtn = pinned.querySelector(".wikihover-pin");
        if (pinnedPinBtn) pinnedPinBtn.remove();
        const pinnedDupPinBtn = pinned.querySelector(".wikihover-duplicate-pin");
        if (pinnedDupPinBtn) pinnedDupPinBtn.remove();
        const oldCloseBtn = pinned.querySelector(".wikihover-close");
        if (oldCloseBtn) {
          const newCloseBtn = oldCloseBtn.cloneNode(true);
          newCloseBtn.addEventListener("click", () => {
            pinned.querySelectorAll("video").forEach((v) => {
              v.pause();
              v.removeAttribute("src");
              v.load();
            });
            pinned.remove();
            pinnedTooltips = pinnedTooltips.filter((p) => p !== pinned);
          });
          oldCloseBtn.parentNode.replaceChild(newCloseBtn, oldCloseBtn);
        }
        pinned.querySelectorAll(".wikihover-tab").forEach((oldTab) => {
          const newTab = oldTab.cloneNode(true);
          newTab.addEventListener("click", () => {
            const tabName = newTab.getAttribute("data-tab");
            pinned.querySelectorAll("video").forEach((v) => {
              if (v.src && !v.paused) {
                v.dataset.whSavedSrc = v.src;
                v.dataset.whSavedTime = v.currentTime;
                v.dataset.whSavedMuted = v.muted;
              }
              v.pause();
            });
            pinned.querySelectorAll(".wikihover-content").forEach((c) => {
              c.style.display = "none";
              c.style.visibility = "hidden";
              c.style.opacity = "0";
              c.classList.remove("active");
            });
            pinned.querySelectorAll(".wikihover-tab").forEach((t) => t.classList.remove("active"));
            newTab.classList.add("active");
            const selectedContent = pinned.querySelector(`.wikihover-${tabName}-content`);
            if (selectedContent) {
              selectedContent.style.display = "block";
              selectedContent.style.visibility = "visible";
              selectedContent.style.opacity = "1";
              selectedContent.classList.add("active");
              const expandedVideo = selectedContent.querySelector("video[data-wh-saved-src]");
              if (expandedVideo) {
                const savedSrc = expandedVideo.dataset.whSavedSrc;
                const savedTime = parseFloat(expandedVideo.dataset.whSavedTime) || 0;
                const savedMuted = expandedVideo.dataset.whSavedMuted === "true";
                delete expandedVideo.dataset.whSavedSrc;
                delete expandedVideo.dataset.whSavedTime;
                delete expandedVideo.dataset.whSavedMuted;
                expandedVideo.src = savedSrc;
                expandedVideo.muted = savedMuted;
                expandedVideo.addEventListener("loadeddata", function onLoaded() {
                  expandedVideo.removeEventListener("loadeddata", onLoaded);
                  expandedVideo.currentTime = savedTime;
                  expandedVideo.play().catch(() => {
                  });
                });
                expandedVideo.load();
              }
            }
          });
          oldTab.parentNode.replaceChild(newTab, oldTab);
        });
        const oldResizeHandle = pinned.querySelector(".wikihover-resize-handle");
        if (oldResizeHandle) {
          const newResizeHandle = oldResizeHandle.cloneNode(true);
          oldResizeHandle.parentNode.replaceChild(newResizeHandle, oldResizeHandle);
          makeResizable(pinned, newResizeHandle);
        }
        makeDraggable(pinned);
        updateTabVisibility(pinned);
        document.body.appendChild(pinned);
        pinnedTooltips.push(pinned);
        if ((_a2 = window.WikiHover) == null ? void 0 : _a2.isReady()) {
          window.WikiHover.getRegistry().keys().forEach((key) => {
            const promise = feedPrefetchCache[pinnedName] && feedPrefetchCache[pinnedName][key];
            if (!promise) return;
            promise.then((sourceResult) => {
              if (!document.body.contains(pinned)) return;
              renderSingleFeedIntoTooltip(pinned, key, sourceResult);
            });
          });
        }
        while (pinnedTooltips.length > MAX_PINNED_TOOLTIPS) {
          const oldest = pinnedTooltips.shift();
          oldest.remove();
        }
        const pinnedSidebar = pinned.querySelector(".wikihover-sidebar");
        tooltipElement.remove();
        tooltipElement = null;
        isTooltipVisible = false;
        stopTrackingMouse();
      }
      function duplicateAndPinTooltip(sourceTooltip) {
        var _a2, _b;
        if (!sourceTooltip) return;
        if (pinnedTooltips.length >= MAX_PINNED_TOOLTIPS) return;
        const pinnedName = (_a2 = sourceTooltip.querySelector(".wikihover-title")) == null ? void 0 : _a2.textContent;
        if (!pinnedName) return;
        const pinned = document.createElement("div");
        pinned.className = "wikihover-pinned-tooltip";
        pinned.setAttribute("data-wikihover-tooltip", "true");
        pinned.setAttribute("data-tooltip-name", pinnedName);
        pinned.setAttribute("id", "wikihover-pinned-" + Date.now());
        const currentTheme = sourceTooltip.getAttribute("data-wikihover-theme");
        if (currentTheme) pinned.setAttribute("data-wikihover-theme", currentTheme);
        const rect = sourceTooltip.getBoundingClientRect();
        pinned.style.setProperty("position", "fixed", "important");
        pinned.style.setProperty("left", Math.min(rect.left + 20, window.innerWidth - rect.width) + "px", "important");
        pinned.style.setProperty("top", Math.min(rect.top + 20, window.innerHeight - rect.height) + "px", "important");
        pinned.style.setProperty("width", rect.width + "px", "important");
        pinned.style.setProperty("height", rect.height + "px", "important");
        pinned.style.setProperty("max-height", rect.height + "px", "important");
        pinned.style.setProperty("display", "flex", "important");
        pinned.style.setProperty("visibility", "visible", "important");
        pinned.style.setProperty("opacity", "1", "important");
        pinned.style.setProperty("z-index", "9999999", "important");
        Array.from(sourceTooltip.children).forEach((child) => {
          pinned.appendChild(child.cloneNode(true));
        });
        const clonedPinBtn = pinned.querySelector(".wikihover-pin");
        if (clonedPinBtn) clonedPinBtn.remove();
        pinned.querySelectorAll("video").forEach((v) => {
          v.pause();
          v.removeAttribute("src");
          v.load();
        });
        const oldCloseBtn = pinned.querySelector(".wikihover-close");
        if (oldCloseBtn) {
          const newCloseBtn = oldCloseBtn.cloneNode(true);
          newCloseBtn.addEventListener("click", () => {
            pinned.querySelectorAll("video").forEach((v) => {
              v.pause();
              v.removeAttribute("src");
              v.load();
            });
            pinned.remove();
            pinnedTooltips = pinnedTooltips.filter((p) => p !== pinned);
          });
          oldCloseBtn.parentNode.replaceChild(newCloseBtn, oldCloseBtn);
        }
        const oldFsBtn = pinned.querySelector(".wikihover-fullscreen-btn");
        if (oldFsBtn) {
          const newFsBtn = oldFsBtn.cloneNode(true);
          newFsBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const tt = pinned;
            const isFs = tt.classList.contains("wikihover-fullscreen");
            if (isFs) {
              tt.classList.remove("wikihover-fullscreen");
              tt.style.setProperty("left", tt.dataset.whFsLeft, "important");
              tt.style.setProperty("top", tt.dataset.whFsTop, "important");
              applyTooltipSize(tt, parseFloat(tt.dataset.whFsWidth), parseFloat(tt.dataset.whFsHeight));
              delete tt.dataset.whFsLeft;
              delete tt.dataset.whFsTop;
              delete tt.dataset.whFsWidth;
              delete tt.dataset.whFsHeight;
              newFsBtn.innerHTML = "\u26F6";
              newFsBtn.title = "Toggle fullscreen";
            } else {
              const r = tt.getBoundingClientRect();
              tt.dataset.whFsLeft = tt.style.getPropertyValue("left") || r.left + "px";
              tt.dataset.whFsTop = tt.style.getPropertyValue("top") || r.top + "px";
              tt.dataset.whFsWidth = r.width;
              tt.dataset.whFsHeight = r.height;
              tt.classList.add("wikihover-fullscreen");
              applyTooltipSize(tt, window.innerWidth, window.innerHeight);
              newFsBtn.innerHTML = "\u29C4";
              newFsBtn.title = "Exit fullscreen";
            }
          });
          oldFsBtn.parentNode.replaceChild(newFsBtn, oldFsBtn);
        }
        const oldDupBtn = pinned.querySelector(".wikihover-duplicate-pin");
        if (oldDupBtn) {
          const newDupBtn = oldDupBtn.cloneNode(true);
          newDupBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            duplicateAndPinTooltip(pinned);
          });
          oldDupBtn.parentNode.replaceChild(newDupBtn, oldDupBtn);
        }
        const oldResizeBtn = pinned.querySelector(".wikihover-resize-btn");
        if (oldResizeBtn) {
          const newResizeBtn = oldResizeBtn.cloneNode(true);
          newResizeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (pinned.classList.contains("wikihover-fullscreen")) {
              pinned.classList.remove("wikihover-fullscreen");
              const savedLeft = pinned.dataset.whFsLeft;
              const savedTop = pinned.dataset.whFsTop;
              if (savedLeft) pinned.style.setProperty("left", savedLeft, "important");
              if (savedTop) pinned.style.setProperty("top", savedTop, "important");
              delete pinned.dataset.whFsLeft;
              delete pinned.dataset.whFsTop;
              delete pinned.dataset.whFsWidth;
              delete pinned.dataset.whFsHeight;
              const fsBtn = pinned.querySelector(".wikihover-fullscreen-btn");
              if (fsBtn) {
                fsBtn.innerHTML = "&#x26F6;";
                fsBtn.title = "Toggle fullscreen";
              }
            }
            applyTooltipSize(pinned, 500, 500);
          });
          newResizeBtn.addEventListener("mouseenter", () => {
            newResizeBtn.style.opacity = "1";
          });
          newResizeBtn.addEventListener("mouseleave", () => {
            newResizeBtn.style.opacity = "0.6";
          });
          oldResizeBtn.parentNode.replaceChild(newResizeBtn, oldResizeBtn);
        }
        pinned.querySelectorAll(".wikihover-tab").forEach((oldTab) => {
          const newTab = oldTab.cloneNode(true);
          newTab.addEventListener("click", () => {
            const tabName = newTab.getAttribute("data-tab");
            pinned.querySelectorAll("video").forEach((v) => {
              if (v.src && !v.paused) {
                v.dataset.whSavedSrc = v.src;
                v.dataset.whSavedTime = v.currentTime;
                v.dataset.whSavedMuted = v.muted;
              }
              v.pause();
            });
            pinned.querySelectorAll(".wikihover-content").forEach((c) => {
              c.style.display = "none";
              c.style.visibility = "hidden";
              c.style.opacity = "0";
              c.classList.remove("active");
            });
            pinned.querySelectorAll(".wikihover-tab").forEach((t) => t.classList.remove("active"));
            newTab.classList.add("active");
            const selectedContent = pinned.querySelector(`.wikihover-${tabName}-content`);
            if (selectedContent) {
              selectedContent.style.display = "block";
              selectedContent.style.visibility = "visible";
              selectedContent.style.opacity = "1";
              selectedContent.classList.add("active");
              const expandedVideo = selectedContent.querySelector("video[data-wh-saved-src]");
              if (expandedVideo) {
                const savedSrc = expandedVideo.dataset.whSavedSrc;
                const savedTime = parseFloat(expandedVideo.dataset.whSavedTime) || 0;
                const savedMuted = expandedVideo.dataset.whSavedMuted === "true";
                delete expandedVideo.dataset.whSavedSrc;
                delete expandedVideo.dataset.whSavedTime;
                delete expandedVideo.dataset.whSavedMuted;
                expandedVideo.src = savedSrc;
                expandedVideo.muted = savedMuted;
                expandedVideo.addEventListener("loadeddata", function onLoaded() {
                  expandedVideo.removeEventListener("loadeddata", onLoaded);
                  expandedVideo.currentTime = savedTime;
                  expandedVideo.play().catch(() => {
                  });
                });
                expandedVideo.load();
              }
            }
          });
          oldTab.parentNode.replaceChild(newTab, oldTab);
        });
        pinned._navHistory = [pinnedName];
        pinned._navIndex = 0;
        const navBtns = pinned.querySelectorAll('[title="Back"], [title="Forward"]');
        navBtns.forEach((oldBtn) => {
          const newBtn = oldBtn.cloneNode(true);
          const isBack = newBtn.title === "Back";
          newBtn.addEventListener("mouseenter", () => {
            newBtn.style.color = "#0645AD";
            newBtn.style.background = "rgba(6,69,173,0.08)";
          });
          newBtn.addEventListener("mouseleave", () => {
            newBtn.style.color = "#999";
            newBtn.style.background = "transparent";
          });
          newBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (isBack && pinned._navIndex > 0) {
              pinned._navIndex--;
              navigateInPinnedTooltip(pinned, pinned._navHistory[pinned._navIndex], true);
            } else if (!isBack && pinned._navIndex < pinned._navHistory.length - 1) {
              pinned._navIndex++;
              navigateInPinnedTooltip(pinned, pinned._navHistory[pinned._navIndex], true);
            }
          });
          oldBtn.parentNode.replaceChild(newBtn, oldBtn);
        });
        const oldResizeHandle = pinned.querySelector(".wikihover-resize-handle");
        if (oldResizeHandle) {
          const newResizeHandle = oldResizeHandle.cloneNode(true);
          oldResizeHandle.parentNode.replaceChild(newResizeHandle, oldResizeHandle);
          makeResizable(pinned, newResizeHandle);
        }
        makeDraggable(pinned);
        updateTabVisibility(pinned);
        document.body.appendChild(pinned);
        pinnedTooltips.push(pinned);
        if ((_b = window.WikiHover) == null ? void 0 : _b.isReady()) {
          window.WikiHover.getRegistry().keys().forEach((key) => {
            const promise = feedPrefetchCache[pinnedName] && feedPrefetchCache[pinnedName][key];
            if (!promise) return;
            promise.then((sourceResult) => {
              if (!document.body.contains(pinned)) return;
              renderSingleFeedIntoTooltip(pinned, key, sourceResult);
            });
          });
        }
        while (pinnedTooltips.length > MAX_PINNED_TOOLTIPS) {
          const oldest = pinnedTooltips.shift();
          oldest.remove();
        }
        const pinnedSidebar = pinned.querySelector(".wikihover-sidebar");
        tooltipHideGraceUntil = Date.now() + 2e3;
      }
      function makeDraggable(tooltipEl) {
        const header = tooltipEl.querySelector(".wikihover-header");
        if (!header) return;
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        header.addEventListener("mousedown", (e) => {
          if (e.target.closest(".wikihover-close") || e.target.closest(".wikihover-pin")) return;
          isDragging = true;
          const rect = tooltipEl.getBoundingClientRect();
          offsetX = e.clientX - rect.left;
          offsetY = e.clientY - rect.top;
          e.preventDefault();
        });
        document.addEventListener("mousemove", (e) => {
          if (!isDragging) return;
          if (tooltipEl.classList.contains("wikihover-fullscreen")) {
            tooltipEl.classList.remove("wikihover-fullscreen");
            delete tooltipEl.dataset.whFsLeft;
            delete tooltipEl.dataset.whFsTop;
            delete tooltipEl.dataset.whFsWidth;
            delete tooltipEl.dataset.whFsHeight;
            const fsBtn = tooltipEl.querySelector(".wikihover-fullscreen-btn");
            if (fsBtn) {
              fsBtn.innerHTML = "&#x26F6;";
              fsBtn.title = "Toggle fullscreen";
            }
          }
          tooltipEl.style.setProperty("position", "fixed", "important");
          tooltipEl.style.setProperty("left", e.clientX - offsetX + "px", "important");
          tooltipEl.style.setProperty("top", e.clientY - offsetY + "px", "important");
          tooltipEl.setAttribute("data-dragged", "true");
        });
        document.addEventListener("mouseup", () => {
          isDragging = false;
        });
      }
      function getContentContainerHeight(tooltipEl, totalH) {
        let usedH = 0;
        const cc = tooltipEl.querySelector(".wikihover-content-container");
        const body = tooltipEl.querySelector(".wikihover-body");
        Array.from(tooltipEl.children).forEach((child) => {
          if (child !== cc && child !== body && child.classList && !child.classList.contains("wikihover-resize-handle")) {
            usedH += child.offsetHeight || 0;
          }
        });
        return Math.max(50, totalH - usedH - 4);
      }
      function applyTooltipSize(tooltipEl, width, height) {
        if (width) tooltipEl.style.setProperty("width", width + "px", "important");
        if (height) {
          tooltipEl.style.setProperty("max-height", height + "px", "important");
          tooltipEl.style.setProperty("height", height + "px", "important");
          const cc = tooltipEl.querySelector(".wikihover-content-container");
          const body = tooltipEl.querySelector(".wikihover-body");
          if (cc) {
            const ccH = getContentContainerHeight(tooltipEl, height);
            if (body) {
              body.style.setProperty("max-height", ccH + "px", "important");
              body.style.setProperty("height", ccH + "px", "important");
            }
            cc.style.setProperty("max-height", ccH + "px", "important");
            cc.style.setProperty("height", ccH + "px", "important");
            const ccPadStyle = getComputedStyle(cc);
            const ccPad = (parseFloat(ccPadStyle.paddingTop) || 0) + (parseFloat(ccPadStyle.paddingBottom) || 0);
            const expandH = Math.floor(ccH - ccPad);
            cc.querySelectorAll(".wikihover-reel-expanded-player, .wikihover-tiktok-expanded-player, .wikihover-imdb-expanded-player").forEach((player) => {
              if (player.style.display !== "none") {
                player.style.height = expandH + "px";
                player.style.maxHeight = expandH + "px";
                const video = player.querySelector("video");
                if (video) video.style.height = expandH + "px";
                const img = player.querySelector("img");
                if (img) img.style.height = expandH + "px";
              }
            });
          }
        }
      }
      function makeResizable(tooltipEl, handle) {
        let isResizing = false;
        let startX, startY, startW, startH;
        let resizeSaveTimeout = null;
        handle.addEventListener("mousedown", (e) => {
          e.preventDefault();
          e.stopPropagation();
          isResizing = true;
          const rect = tooltipEl.getBoundingClientRect();
          startX = e.clientX;
          startY = e.clientY;
          startW = rect.width;
          startH = rect.height;
        });
        document.addEventListener("mousemove", (e) => {
          if (!isResizing) return;
          e.preventDefault();
          const newW = Math.max(320, startW + (e.clientX - startX));
          const newH = Math.max(200, startH + (e.clientY - startY));
          applyTooltipSize(tooltipEl, newW, newH);
        });
        document.addEventListener("mouseup", () => {
          if (!isResizing) return;
          isResizing = false;
          clearTimeout(resizeSaveTimeout);
          resizeSaveTimeout = setTimeout(() => {
            const rect = tooltipEl.getBoundingClientRect();
            safeStorageSet({ tooltipSize: { width: Math.round(rect.width), height: Math.round(rect.height) } });
          }, 300);
        });
      }
      var TAB_TO_SETTING = {
        wiki: "wikipedia",
        tvmaze: "tvmaze",
        imdb: "imdb",
        books: "books",
        instagram: "instagram",
        twitter: "twitter",
        football: "football",
        tiktok: "tiktok",
        pinterest: "pinterest",
        polymarket: "polymarket"
      };
      function getFirstEnabledTabKey() {
        var _a2;
        if ((_a2 = window.WikiHover) == null ? void 0 : _a2.isReady()) {
          const cfg = window.WikiHover.getConfig();
          if (cfg && cfg.defaultFeed != null) {
            const moduleKey = _feedIdToKey(cfg.defaultFeed);
            if (moduleKey) {
              const defaultTabKey = _feedKeyToClass(moduleKey);
              const settingKey = TAB_TO_SETTING[defaultTabKey];
              if (settingKey && dataSourceSettings[settingKey] !== false) {
                return defaultTabKey;
              }
            }
          }
        }
        if (tabOrder && tabOrder.length) {
          const settingToTab = {};
          for (const [tabKey, settingKey] of Object.entries(TAB_TO_SETTING)) {
            settingToTab[settingKey] = tabKey;
          }
          for (const settingKey of tabOrder) {
            if (dataSourceSettings[settingKey] !== false && settingToTab[settingKey]) {
              return settingToTab[settingKey];
            }
          }
        }
        for (const [tabKey, settingKey] of Object.entries(TAB_TO_SETTING)) {
          if (dataSourceSettings[settingKey] !== false) return tabKey;
        }
        return "wiki";
      }
      function reorderTooltipTabs(tooltipEl) {
        if (!tabOrder || !tabOrder.length) return;
        const tabsContainer = tooltipEl.querySelector(".wikihover-sidebar");
        if (!tabsContainer) return;
        const tabButtons = [...tabsContainer.querySelectorAll(".wikihover-tab")];
        tabButtons.sort((a, b) => {
          const aKey = TAB_TO_SETTING[a.getAttribute("data-tab")];
          const bKey = TAB_TO_SETTING[b.getAttribute("data-tab")];
          const aIdx = tabOrder.indexOf(aKey);
          const bIdx = tabOrder.indexOf(bKey);
          return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
        });
        tabButtons.forEach((btn) => tabsContainer.appendChild(btn));
      }
      function updateTabVisibility(tooltipEl) {
        if (!tooltipEl) return;
        tooltipEl.querySelectorAll(".wikihover-tab").forEach((tab) => {
          const tabKey = tab.getAttribute("data-tab");
          const settingKey = TAB_TO_SETTING[tabKey];
          const disabled = settingKey && dataSourceSettings[settingKey] === false;
          tab.style.setProperty("display", disabled ? "none" : "", "important");
          const contentEl = tooltipEl.querySelector(`.wikihover-${tabKey}-content`);
          if (contentEl && disabled) {
            contentEl.style.setProperty("display", "none", "important");
            contentEl.style.visibility = "hidden";
            contentEl.style.opacity = "0";
            contentEl.style.height = "0";
            contentEl.classList.remove("active");
          }
        });
        const activeTab = tooltipEl.querySelector(".wikihover-tab.active");
        if (!activeTab || activeTab.style.display === "none") {
          const firstVisible = tooltipEl.querySelector('.wikihover-tab:not([style*="display: none"])');
          if (firstVisible) {
            const tabKey = firstVisible.getAttribute("data-tab");
            if (tooltipEl === tooltipElement) {
              switchTab(tabKey);
            } else {
              firstVisible.click();
            }
          }
        }
      }
      function revealTabIconColor(tooltipEl, tabKey) {
        if (!tooltipEl) return;
        const tabBtn = tooltipEl.querySelector(`.wikihover-tab[data-tab="${tabKey}"]`);
        if (!tabBtn) return;
        const colorDiv = tabBtn.querySelector(".wikihover-tab-favicon-color");
        if (colorDiv) colorDiv.classList.add("wikihover-tab-favicon-revealed");
      }
      function resetTabIconsToBw(tooltipEl) {
        if (!tooltipEl) return;
        tooltipEl.querySelectorAll(".wikihover-tab[data-tab]").forEach((tab) => {
          const key = tab.getAttribute("data-tab");
          const colorDiv = tab.querySelector(".wikihover-tab-favicon-color");
          if (!colorDiv) return;
          if (key === "wiki") {
            colorDiv.classList.add("wikihover-tab-favicon-revealed");
          } else {
            colorDiv.classList.remove("wikihover-tab-favicon-revealed");
          }
        });
      }
      function hideTabButton(tooltipEl, tabKey) {
        if (!tooltipEl) return;
        const tabBtn = tooltipEl.querySelector(`.wikihover-tab[data-tab="${tabKey}"]`);
        if (!tabBtn) return;
        tabBtn.style.setProperty("display", "none", "important");
        tabBtn.removeAttribute("data-wh-pending");
        const contentEl = tooltipEl.querySelector(`.wikihover-${tabKey}-content`);
        if (contentEl) {
          contentEl.style.setProperty("display", "none", "important");
          contentEl.classList.remove("active");
        }
        if (tabBtn.classList.contains("active")) {
          const firstVisible = tooltipEl.querySelector('.wikihover-tab:not([style*="display: none"])');
          if (firstVisible) {
            if (tooltipEl === tooltipElement) {
              switchTab(firstVisible.getAttribute("data-tab"));
            } else {
              firstVisible.click();
            }
          }
        }
      }
      function switchTab(tabName) {
        if (!tooltipElement) return;
        tooltipElement.querySelectorAll("video").forEach((v) => {
          if (v.src && !v.paused) {
            v.dataset.whSavedSrc = v.src;
            v.dataset.whSavedTime = v.currentTime;
            v.dataset.whSavedMuted = v.muted;
          }
          v.pause();
        });
        debugLog("Switching to tab:", tabName);
        const contents = tooltipElement.querySelectorAll(".wikihover-content");
        contents.forEach((content) => {
          content.style.display = "none";
          content.style.visibility = "hidden";
          content.style.opacity = "0";
          content.style.position = "absolute";
          content.style.zIndex = "-1";
          content.classList.remove("active");
        });
        const tabs = tooltipElement.querySelectorAll(".wikihover-tab");
        tabs.forEach((tab) => {
          tab.classList.remove("active");
        });
        const selectedTab = tooltipElement.querySelector(`[data-tab="${tabName}"]`);
        const selectedContent = tooltipElement.querySelector(`.wikihover-${tabName}-content`);
        if (selectedTab) {
          selectedTab.classList.add("active");
        }
        if (selectedContent) {
          selectedContent.style.display = "block";
          selectedContent.style.visibility = "visible";
          selectedContent.style.opacity = "1";
          selectedContent.style.position = "relative";
          selectedContent.style.zIndex = "1";
          selectedContent.classList.add("active");
          const expandedVideo = selectedContent.querySelector("video[data-wh-saved-src]");
          if (expandedVideo) {
            const savedSrc = expandedVideo.dataset.whSavedSrc;
            const savedTime = parseFloat(expandedVideo.dataset.whSavedTime) || 0;
            const savedMuted = expandedVideo.dataset.whSavedMuted === "true";
            delete expandedVideo.dataset.whSavedSrc;
            delete expandedVideo.dataset.whSavedTime;
            delete expandedVideo.dataset.whSavedMuted;
            expandedVideo.src = savedSrc;
            expandedVideo.muted = savedMuted;
            expandedVideo.addEventListener("loadeddata", function onLoaded() {
              expandedVideo.removeEventListener("loadeddata", onLoaded);
              expandedVideo.currentTime = savedTime;
              expandedVideo.play().catch(() => {
              });
            });
            expandedVideo.load();
          }
        }
      }
      async function checkDataSourceSettings() {
        const result = await safeStorageGet(["dataSourceSettings", "unmarkedNames", "tabOrder"]);
        if (result.dataSourceSettings) {
          dataSourceSettings = { ...dataSourceSettings, ...result.dataSourceSettings };
        }
        if (result.unmarkedNames && Array.isArray(result.unmarkedNames)) {
          unmarkedNames = new Set(result.unmarkedNames);
        }
        if (result.tabOrder && Array.isArray(result.tabOrder)) {
          tabOrder = result.tabOrder;
        }
      }
      function debounce(fn, delay) {
        let timer = null;
        return function(...args) {
          clearTimeout(timer);
          timer = setTimeout(() => fn.apply(this, args), delay);
        };
      }
      var debouncedScanOnScroll = debounce(function() {
        const now = Date.now();
        if (now - lastScanTimestamp > RESCAN_INTERVAL && !isScanning) {
          scanForNames();
        }
      }, 200);
      function initializeExtensionOnPage() {
        debugLog("Initializing extension on page");
        ensureTooltipExists();
        window.addEventListener("scroll", function() {
          debouncedScanOnScroll();
          if (isTooltipVisible && !pendingScrollRAF) {
            pendingScrollRAF = true;
            requestAnimationFrame(function() {
              pendingScrollRAF = false;
              repositionTooltip();
            });
          }
        });
        document.addEventListener("keydown", function(e) {
          if (e.key === "Escape" && isTooltipVisible) {
            hideTooltip();
          }
        });
        checkDataSourceSettings().then(() => {
          if (tooltipElement) reorderTooltipTabs(tooltipElement);
          loadCompromiseLibrary().catch(() => {
            debugLog("Proceeding without Compromise");
          }).finally(() => {
            debugLog("Starting name scan");
            scanForNames();
            observer = new MutationObserver(function(mutations) {
              if (isScanning) return;
              const hasRelevantMutation = mutations.some(function(mutation) {
                if (!mutation.addedNodes || mutation.addedNodes.length === 0) return false;
                if (mutation.target && mutation.target.nodeType === Node.ELEMENT_NODE) {
                  if (mutation.target.closest && mutation.target.closest(".wikihover-name, .wikihover-processed, .wikihover-tooltip")) {
                    return false;
                  }
                }
                let allWikihover = true;
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                  const node = mutation.addedNodes[i];
                  if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.classList && (node.classList.contains("wikihover-tooltip") || node.classList.contains("wikihover-name") || node.classList.contains("wikihover-processed"))) {
                      continue;
                    }
                    if (node.getAttribute && node.getAttribute("data-wikihover-tooltip") === "true") {
                      continue;
                    }
                  }
                  if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
                    if (node.parentElement.closest && node.parentElement.closest(".wikihover-name, .wikihover-processed")) {
                      continue;
                    }
                    if (node.previousSibling && node.previousSibling.classList && node.previousSibling.classList.contains("wikihover-name")) {
                      continue;
                    }
                    if (node.nextSibling && node.nextSibling.classList && node.nextSibling.classList.contains("wikihover-name")) {
                      continue;
                    }
                  }
                  allWikihover = false;
                }
                return !allWikihover;
              });
              if (hasRelevantMutation) {
                setTimeout(function() {
                  scanForNames();
                }, 500);
              }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            debugLog("Mutation observer started");
          });
        });
      }
      function scanForNames() {
        if (isScanning || !extensionEnabled) return;
        isScanning = true;
        lastScanTimestamp = Date.now();
        if (observer) observer.disconnect();
        debugLog("Scanning for names");
        scanSpecificNameElements();
        const textNodes = getVisibleTextNodes();
        textNodes.forEach(function(node) {
          if (!node.parentElement) return;
          if (node.parentElement.tagName === "SCRIPT" || node.parentElement.tagName === "STYLE" || node.parentElement.tagName === "NOSCRIPT" || isTooltipElement(node.parentElement) || hasWikiHoverAncestor(node.parentElement)) {
            return;
          }
          processTextNode(node);
        });
        scanSplitNames();
        isScanning = false;
        if (observer) {
          observer.observe(document.body, { childList: true, subtree: true });
        }
      }
      function scanSpecificNameElements() {
        const imdbNameSelectors = [
          "h1.header",
          'h1[data-testid="hero__pageTitle"]',
          'span[data-testid="hero__primary-text"]',
          'a[data-testid="title-cast-item__actor"]',
          'a[data-testid="title-cast-item__character"]',
          '[data-testid="title-pc-principal-credit"] a',
          "a.name-link",
          "td.name a",
          ".cast-item-actor a",
          ".primary_photo + td a",
          ".titlereference-primary-name"
        ];
        const wikiNameSelectors = [
          ".vcard .fn",
          ".infobox-above",
          "h1.firstHeading",
          ".mw-page-title-main"
        ];
        const generalNameSelectors = [
          ".actor-name",
          ".celebrity-name",
          ".person-name",
          ".artist-name",
          ".cast-name",
          "h1.name",
          "h1.title",
          '[data-testid*="name"]',
          '[data-testid*="title"]',
          '[data-testid*="primary-text"]'
        ];
        const allSelectors = [...imdbNameSelectors, ...wikiNameSelectors, ...generalNameSelectors].join(",");
        try {
          const potentialNameElements = document.querySelectorAll(allSelectors);
          potentialNameElements.forEach((element) => {
            if (isTooltipElement(element) || hasWikiHoverAncestor(element)) {
              return;
            }
            if (!isInViewport(element)) {
              return;
            }
            markWholeElementAsName(element);
          });
        } catch (e) {
          console.error("WikiHover: Error scanning specific name elements:", e);
        }
      }
      function scanSplitNames() {
        const checked = /* @__PURE__ */ new Set();
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
          acceptNode: function(el) {
            const tag = el.tagName;
            if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return NodeFilter.FILTER_REJECT;
            if (isTooltipElement(el) || hasWikiHoverAncestor(el)) return NodeFilter.FILTER_REJECT;
            if (el.getAttribute("data-wikihover-processed") === "true") return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          }
        });
        while (walker.nextNode()) {
          const el = walker.currentNode;
          if (el.childNodes.length < 2) continue;
          if (!isInViewport(el)) continue;
          if (checked.has(el)) continue;
          checked.add(el);
          const text = el.textContent.replace(/\s+/g, " ").trim();
          if (text.length < 3 || text.length > 50) continue;
          nameRegex.lastIndex = 0;
          const match = nameRegex.exec(text);
          if (!match || match[0] !== text) continue;
          if (window.compromiseAvailable && !isHebrewText(text)) {
            const parentText = el.parentElement ? el.parentElement.textContent : "";
            const contextText = parentText.length > text.length && parentText.length < 500 ? parentText : null;
            const enhanced = enhanceNameDetection(text, contextText);
            if (enhanced === null) continue;
          }
          markWholeElementAsName(el);
        }
      }
      function hasWikiHoverAncestor(element) {
        if (element.getAttribute && element.getAttribute("data-wikihover-processed") === "true") {
          return true;
        }
        let el = element;
        while (el) {
          if (el.classList && (el.classList.contains("wikihover-name") || el.classList.contains("wikihover-processed"))) {
            return true;
          }
          el = el.parentElement;
        }
        return false;
      }
      function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const viewportTop = -VIEWPORT_BUFFER;
        const viewportBottom = window.innerHeight + VIEWPORT_BUFFER;
        return rect.bottom >= viewportTop && rect.top <= viewportBottom;
      }
      function getVisibleTextNodes() {
        const textNodes = [];
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: function(node) {
              if (!node.textContent.trim()) {
                return NodeFilter.FILTER_REJECT;
              }
              if (!node.parentElement || node.parentElement.offsetParent === null) {
                return NodeFilter.FILTER_REJECT;
              }
              if (node.parentElement.offsetHeight === 0) {
                return NodeFilter.FILTER_REJECT;
              }
              if (!isInViewport(node.parentElement)) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
          }
        );
        while (walker.nextNode()) {
          textNodes.push(walker.currentNode);
        }
        return textNodes;
      }
      function processTextNode(textNode) {
        try {
          const text = textNode.nodeValue;
          const twoWordMatches = Array.from(text.matchAll(nameRegex));
          const multiWordMatches = Array.from(text.matchAll(multiWordNameRegex));
          const englishMatches = [];
          const coveredRanges = [];
          for (const m of multiWordMatches) {
            englishMatches.push({ text: m[0], index: m.index, isMultiWord: true });
            coveredRanges.push({ start: m.index, end: m.index + m[0].length });
          }
          for (const m of twoWordMatches) {
            const mStart = m.index;
            const mEnd = m.index + m[0].length;
            const overlaps = coveredRanges.some((r) => mStart < r.end && mEnd > r.start);
            if (!overlaps) {
              englishMatches.push({ text: m[0], index: m.index, isMultiWord: false });
            }
          }
          const hebrewMatches = findHebrewNames(text);
          const allMatches = [
            ...englishMatches.map((m) => ({ 0: m.text, index: m.index, isMultiWord: m.isMultiWord })),
            ...hebrewMatches
          ].sort((a, b) => a.index - b.index);
          const matches = [];
          let lastEnd = -1;
          for (const match of allMatches) {
            if (match.index > lastEnd) {
              matches.push(match);
              lastEnd = match.index + match[0].length - 1;
            }
          }
          if (matches.length === 0) return;
          let nlpApproved = null;
          const hasEnglishMatches = englishMatches.length > 0;
          if (window.compromiseAvailable && enableEnhancedNameDetection && hasEnglishMatches) {
            nlpApproved = getNlpApprovedNames(text);
          }
          const fragment = document.createDocumentFragment();
          let lastIndex = 0;
          let markedCount = 0;
          for (const match of matches) {
            const matchText = match[0];
            const matchStart = match.index;
            const isHebrew = isHebrewText(matchText);
            if (match.isMultiWord && !isHebrew) {
              const extracted = extractPersonFromSequence(matchText, nlpApproved);
              if (extracted) {
                if (matchStart > lastIndex) {
                  fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchStart)));
                }
                if (extracted.startOffset > 0) {
                  fragment.appendChild(document.createTextNode(matchText.substring(0, extracted.startOffset)));
                }
                fragment.appendChild(markName(extracted.name, true));
                markedCount++;
                if (extracted.endOffset < matchText.length) {
                  fragment.appendChild(document.createTextNode(matchText.substring(extracted.endOffset)));
                }
                lastIndex = matchStart + matchText.length;
                continue;
              }
              if (matchStart > lastIndex) {
                fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchStart)));
              }
              fragment.appendChild(document.createTextNode(matchText));
              lastIndex = matchStart + matchText.length;
              debugLog("rejected multi-word (no person):", matchText);
              continue;
            }
            if (matchStart > lastIndex) {
              fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchStart)));
            }
            let approved = true;
            if (!isHebrew && nlpApproved !== null) {
              approved = isNameNlpApproved(matchText, nlpApproved);
              if (!approved) {
                debugLog("rejected (batch NLP):", matchText);
              }
            }
            if (approved) {
              fragment.appendChild(markName(matchText, nlpApproved !== null));
              markedCount++;
            } else {
              fragment.appendChild(document.createTextNode(matchText));
            }
            lastIndex = matchStart + matchText.length;
          }
          if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
          }
          textNode.parentNode.replaceChild(fragment, textNode);
          processedNamesCount += markedCount;
        } catch (error) {
          console.error("WikiHover: Error processing text node:", error);
        }
      }
      function normalizeNameForDedup(name) {
        return name.replace(/['\u2019]s$/i, "").replace(/[\-\!\,\.\:\;\?\)\]\u2014\u2013]+$/, "").trim();
      }
      function createNameSpan(displayText, dataNameAttr) {
        const key = normalizeNameForDedup(dataNameAttr);
        const nameSpan = document.createElement("span");
        nameSpan.className = "wikihover-name";
        nameSpan.setAttribute("data-name", key);
        nameSpan.textContent = displayText;
        nameSpan.addEventListener("mouseenter", handleNameHover);
        nameSpan.addEventListener("mouseleave", function() {
          clearTimeout(tooltipTimer);
          tooltipTimer = setTimeout(function() {
            if (Date.now() - lastRepositionTime < REPOSITION_GRACE_MS) return;
            if (!isMouseOverTooltip()) {
              hideTooltip();
            }
          }, TOOLTIP_DELAY);
        });
        markedNames.add(key);
        return nameSpan;
      }
      function markName(name, nlpPreApproved) {
        if (unmarkedNames.has(name) || unmarkedNames.has(normalizeNameForDedup(name))) {
          return document.createTextNode(name);
        }
        debugLog("Marking name:", name);
        let enhancedName = name;
        if (!nlpPreApproved && window.compromiseAvailable && !isHebrewText(name)) {
          enhancedName = enhanceNameDetection(name);
          if (enhancedName === null) {
            return document.createTextNode(name);
          }
          if (enhancedName !== name && name.indexOf(enhancedName) !== -1) {
            const cleanEnhanced = normalizeNameForDedup(enhancedName);
            const fragment = document.createDocumentFragment();
            const namePosition = name.indexOf(cleanEnhanced);
            if (namePosition > 0) {
              fragment.appendChild(document.createTextNode(name.substring(0, namePosition)));
            }
            fragment.appendChild(createNameSpan(cleanEnhanced, cleanEnhanced));
            const afterNamePosition = namePosition + cleanEnhanced.length;
            if (afterNamePosition < name.length) {
              fragment.appendChild(document.createTextNode(name.substring(afterNamePosition)));
            }
            return fragment;
          }
        }
        const cleanName = normalizeNameForDedup(enhancedName);
        const suffix = name.substring(name.indexOf(cleanName) + cleanName.length);
        const prefix = name.substring(0, name.indexOf(cleanName));
        const span = createNameSpan(cleanName, cleanName);
        if (prefix || suffix) {
          const fragment = document.createDocumentFragment();
          if (prefix) fragment.appendChild(document.createTextNode(prefix));
          fragment.appendChild(span);
          if (suffix) fragment.appendChild(document.createTextNode(suffix));
          return fragment;
        }
        return span;
      }
      function markWholeElementAsName(element) {
        if (hasWikiHoverAncestor(element)) {
          return;
        }
        const rawText = element.textContent.trim();
        if (unmarkedNames.has(rawText) || unmarkedNames.has(normalizeNameForDedup(rawText))) {
          element.setAttribute("data-wikihover-processed", "true");
          return;
        }
        if (rawText.length === 0 || rawText.length > 60) {
          element.setAttribute("data-wikihover-processed", "true");
          return;
        }
        const collapsed = rawText.replace(/\s+/g, " ");
        nameRegex.lastIndex = 0;
        const regexMatch = nameRegex.exec(collapsed);
        let text;
        if (regexMatch) {
          text = regexMatch[0];
        } else if (isHebrewText(collapsed) && findHebrewNames(collapsed).length > 0) {
          text = findHebrewNames(collapsed)[0][0];
        } else {
          element.setAttribute("data-wikihover-processed", "true");
          return;
        }
        let enhancedName = text;
        if (window.compromiseAvailable && enableEnhancedNameDetection && !isHebrewText(text)) {
          const parentText = element.parentElement ? element.parentElement.textContent : "";
          const contextText = parentText.length > text.length && parentText.length < 500 ? parentText : null;
          enhancedName = enhanceNameDetection(text, contextText);
          if (enhancedName === null) {
            element.setAttribute("data-wikihover-processed", "true");
            return;
          }
        }
        const wrapper = document.createElement("span");
        wrapper.className = "wikihover-processed";
        wrapper.setAttribute("data-wikihover-processed", "true");
        const nameSpan = document.createElement("span");
        nameSpan.className = "wikihover-name";
        nameSpan.setAttribute("data-name", normalizeNameForDedup(enhancedName));
        if (text !== collapsed) {
          element.setAttribute("data-wikihover-processed", "true");
          return;
        }
        const clonedChildren = Array.from(element.childNodes).map((node) => node.cloneNode(true));
        clonedChildren.forEach((child) => nameSpan.appendChild(child));
        nameSpan.addEventListener("mouseenter", handleNameHover);
        nameSpan.addEventListener("mouseleave", function() {
          clearTimeout(tooltipTimer);
          tooltipTimer = setTimeout(function() {
            if (Date.now() - lastRepositionTime < REPOSITION_GRACE_MS) return;
            if (!isMouseOverTooltip()) {
              hideTooltip();
            }
          }, TOOLTIP_DELAY);
        });
        wrapper.appendChild(nameSpan);
        const tag = element.tagName.toLowerCase();
        if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "a" || tag === "span" || tag === "td" || tag === "li") {
          element.innerHTML = "";
          element.appendChild(wrapper);
          element.setAttribute("data-wikihover-processed", "true");
        } else {
          try {
            element.parentNode.replaceChild(wrapper, element);
          } catch (e) {
            element.setAttribute("data-wikihover-processed", "true");
          }
        }
        markedNames.add(normalizeNameForDedup(text));
      }
      function handleNameHover(event) {
        if (!extensionEnabled) return;
        clearTimeout(tooltipTimer);
        currentHoveredElement = event.target;
        currentWord = event.target.getAttribute("data-name");
        prefetchFeedsForName(currentWord);
        tooltipTimer = setTimeout(async function() {
          var _a2, _b, _c;
          if (currentWord) {
            try {
              ensureTooltipExists();
              const wikiContent = tooltipElement.querySelector(".wikihover-wiki-content");
              const tvMazeContent = tooltipElement.querySelector(".wikihover-tvmaze-content");
              const imdbContent = tooltipElement.querySelector(".wikihover-imdb-content");
              const booksContent = tooltipElement.querySelector(".wikihover-books-content");
              const instagramContent = tooltipElement.querySelector(".wikihover-instagram-content");
              const twitterContent = tooltipElement.querySelector(".wikihover-twitter-content");
              const footballContent = tooltipElement.querySelector(".wikihover-football-content");
              const tiktokContent = tooltipElement.querySelector(".wikihover-tiktok-content");
              const pinterestContent = tooltipElement.querySelector(".wikihover-pinterest-content");
              tooltipElement.querySelector(".wikihover-title").textContent = currentWord;
              if (navFromHistory) {
                navFromHistory = false;
              } else if (tooltipNavHistory.length === 0 || tooltipNavHistory[tooltipNavIndex] !== currentWord) {
                tooltipNavHistory = [currentWord];
                tooltipNavIndex = 0;
              }
              updateNavButtons();
              [wikiContent, tvMazeContent, imdbContent, booksContent, instagramContent, twitterContent, footballContent, tiktokContent, pinterestContent].forEach((content) => {
                if (content) content.innerHTML = '<div class="wikihover-loader"></div>';
              });
              updateTabVisibility(tooltipElement);
              if ((_a2 = window.WikiHover) == null ? void 0 : _a2.isReady()) {
                const registeredKeys = new Set(window.WikiHover.getRegistry().keys());
                tooltipElement.querySelectorAll(".wikihover-tab[data-tab]").forEach((tab) => {
                  const tabKey = tab.getAttribute("data-tab");
                  if (!registeredKeys.has(_tabNameToFeedKey(tabKey))) hideTabButton(tooltipElement, tabKey);
                });
              }
              const firstEnabledTab = getFirstEnabledTabKey();
              showTooltip();
              resetTabIconsToBw(tooltipElement);
              const nameToFetch = currentWord;
              if ((_b = window.WikiHover) == null ? void 0 : _b.isReady()) {
                const keys = window.WikiHover.getRegistry().keys();
                let firstOkSwitched = false;
                const cfgDefaultKey = _feedIdToKey((_c = window.WikiHover.getConfig()) == null ? void 0 : _c.defaultFeed);
                keys.forEach((key) => {
                  const promise = feedPrefetchCache[nameToFetch] && feedPrefetchCache[nameToFetch][key];
                  if (!promise) return;
                  promise.then((sourceResult) => {
                    if (currentWord !== nameToFetch || !isTooltipVisible) return;
                    renderSingleFeedIntoTooltip(tooltipElement, key, sourceResult);
                    if (!firstOkSwitched && sourceResult && sourceResult.status === "ok") {
                      if (cfgDefaultKey && key !== cfgDefaultKey) return;
                      firstOkSwitched = true;
                      switchTab(_feedKeyToClass(key));
                    }
                    debouncedRepositionTooltip();
                  });
                });
              }
              switchTab(firstEnabledTab);
            } catch (error) {
              console.error("WikiHover: Error handling name hover:", error);
            }
          }
        }, TOOLTIP_DELAY);
      }
      var _mouseX = 0;
      var _mouseY = 0;
      var mouseMoveListenerActive = false;
      function onMouseMove(e) {
        _mouseX = e.clientX;
        _mouseY = e.clientY;
      }
      function startTrackingMouse() {
        if (!mouseMoveListenerActive) {
          document.addEventListener("mousemove", onMouseMove);
          mouseMoveListenerActive = true;
        }
      }
      function stopTrackingMouse() {
        if (mouseMoveListenerActive) {
          document.removeEventListener("mousemove", onMouseMove);
          mouseMoveListenerActive = false;
        }
      }
      function isMouseOverTooltip() {
        if (!tooltipElement) return false;
        const tooltip = tooltipElement.getBoundingClientRect();
        return _mouseX >= tooltip.left && _mouseX <= tooltip.right && _mouseY >= tooltip.top && _mouseY <= tooltip.bottom;
      }
      function isMouseOverHoveredName() {
        if (!currentHoveredElement) return false;
        const rect = currentHoveredElement.getBoundingClientRect();
        return _mouseX >= rect.left && _mouseX <= rect.right && _mouseY >= rect.top && _mouseY <= rect.bottom;
      }
      function showTooltip() {
        if (!tooltipElement) {
          createTooltip();
        }
        if (!currentHoveredElement) return;
        const wasVisible = isTooltipVisible && tooltipElement.classList.contains("visible");
        tooltipElement.style.setProperty("visibility", "visible", "important");
        tooltipElement.style.setProperty("z-index", "9999999", "important");
        tooltipElement.style.setProperty("position", "fixed", "important");
        tooltipElement.style.setProperty("pointer-events", "auto", "important");
        isTooltipVisible = true;
        if (!tooltipElement.getAttribute("data-dragged")) {
          cachedTooltipWidth = 0;
          cachedTooltipHeight = 0;
          repositionTooltip();
        }
        if (wasVisible) {
          tooltipElement.classList.remove("visible");
          tooltipElement.style.setProperty("transition", "none", "important");
          tooltipElement.style.setProperty("transform", "scale(0.92)", "important");
          tooltipElement.style.setProperty("opacity", "0", "important");
          void tooltipElement.offsetHeight;
          tooltipElement.style.removeProperty("transition");
          tooltipElement.style.removeProperty("transform");
          tooltipElement.style.removeProperty("opacity");
        } else {
          void tooltipElement.offsetHeight;
        }
        requestAnimationFrame(() => {
          if (!tooltipElement || !isTooltipVisible) return;
          tooltipElement.classList.add("visible");
          requestAnimationFrame(() => {
            if (!tooltipElement || !isTooltipVisible) return;
            const h = tooltipElement.offsetHeight;
            const w = tooltipElement.offsetWidth;
            if (h > 0 && w > 0) applyTooltipSize(tooltipElement, w, h);
          });
        });
        startTrackingMouse();
      }
      function repositionTooltip() {
        if (!tooltipElement || !isTooltipVisible || !currentHoveredElement) return;
        if (tooltipElement.getAttribute("data-dragged")) return;
        const margin = 10;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        if (!cachedTooltipWidth || !cachedTooltipHeight) {
          cachedTooltipWidth = tooltipElement.offsetWidth;
          cachedTooltipHeight = tooltipElement.offsetHeight;
        }
        const tooltipWidth = cachedTooltipWidth;
        const tooltipHeight = cachedTooltipHeight;
        const rect = currentHoveredElement.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        let posX = elementCenterX - tooltipWidth / 2;
        posX = Math.max(margin, Math.min(posX, viewportWidth - tooltipWidth - margin));
        const spaceBelow = viewportHeight - (rect.bottom + margin);
        const spaceAbove = rect.top - margin;
        const preferBelow = spaceBelow >= spaceAbove && spaceBelow >= tooltipHeight;
        let posY;
        if (preferBelow) {
          posY = rect.bottom + 5;
          posY = Math.min(posY, viewportHeight - tooltipHeight - margin);
          if (posY + tooltipHeight > viewportHeight - margin && spaceAbove >= tooltipHeight) {
            posY = Math.max(margin, rect.top - tooltipHeight - 5);
          }
        } else {
          posY = rect.top - tooltipHeight - 5;
          posY = Math.max(posY, margin);
          if (posY < margin && spaceBelow >= tooltipHeight) {
            posY = Math.min(viewportHeight - tooltipHeight - margin, rect.bottom + 5);
          }
        }
        posY = Math.max(margin, Math.min(posY, viewportHeight - tooltipHeight - margin));
        tooltipElement.style.left = `${posX}px`;
        tooltipElement.style.top = `${posY}px`;
        const placement = preferBelow ? "below" : "above";
        tooltipElement.setAttribute("data-wh-placement", placement);
        if (tooltipWidth > 0) {
          const nameCenter = rect.left + rect.width / 2;
          const originXPct = Math.max(5, Math.min(95, Math.round((nameCenter - posX) / tooltipWidth * 100)));
          const originY = placement === "below" ? "0%" : "100%";
          tooltipElement.style.setProperty("transform-origin", `${originXPct}% ${originY}`, "important");
        }
        lastRepositionTime = Date.now();
      }
      var debouncedRepositionTooltip = debounce(function() {
        cachedTooltipWidth = 0;
        cachedTooltipHeight = 0;
        repositionTooltip();
      }, 80);
      function pauseAllTooltipVideos(destroy) {
        if (tooltipElement) {
          tooltipElement.querySelectorAll("video").forEach((v) => {
            v.pause();
            if (destroy) {
              v.removeAttribute("src");
              v.load();
            }
          });
        }
      }
      function unmarkCurrentName() {
        const name = currentWord;
        const el = currentHoveredElement;
        if (!name) return;
        unmarkedNames.add(name);
        safeStorageSet({ unmarkedNames: Array.from(unmarkedNames) });
        document.querySelectorAll(`.wikihover-name[data-name="${CSS.escape(name)}"]`).forEach((span) => {
          const text = document.createTextNode(span.textContent);
          span.parentNode.replaceChild(text, span);
        });
        markedNames.delete(name);
        markedByDocument.delete(name);
        hideTooltip();
      }
      function hideTooltip() {
        if (Date.now() < tooltipHideGraceUntil) return;
        if (tooltipElement) {
          pauseAllTooltipVideos(true);
          tooltipElement.classList.remove("visible");
          isTooltipVisible = false;
          cachedTooltipWidth = 0;
          cachedTooltipHeight = 0;
          tooltipElement.style.setProperty("pointer-events", "none", "important");
          tooltipNavHistory = [];
          tooltipNavIndex = -1;
          navFromHistory = false;
          updateNavButtons();
          stopTrackingMouse();
          const el = tooltipElement;
          setTimeout(() => {
            if (isTooltipVisible || !el) return;
            el.style.removeProperty("visibility");
            el.style.removeProperty("opacity");
            el.style.removeProperty("transform");
            el.style.removeProperty("transform-origin");
            el.style.removeProperty("z-index");
            el.style.removeProperty("pointer-events");
            el.removeAttribute("data-positioned");
            el.removeAttribute("data-dragged");
            el.style.removeProperty("position");
            const title = el.querySelector(".wikihover-title");
            if (title) title.textContent = "";
            el.querySelector(".wikihover-wiki-content").innerHTML = "";
            el.querySelector(".wikihover-tvmaze-content").innerHTML = "";
            el.querySelector(".wikihover-imdb-content").innerHTML = "";
            const booksCont = el.querySelector(".wikihover-books-content");
            if (booksCont) booksCont.innerHTML = "";
            const twitterCont = el.querySelector(".wikihover-twitter-content");
            if (twitterCont) twitterCont.innerHTML = "";
            const footballCont = el.querySelector(".wikihover-football-content");
            if (footballCont) footballCont.innerHTML = "";
            el.querySelectorAll(".wikihover-tab").forEach((tab) => {
              tab.classList.toggle("active", tab.getAttribute("data-tab") === "wiki");
            });
            el.querySelectorAll(".wikihover-content").forEach((content) => {
              content.classList.toggle("active", content.classList.contains("wikihover-wiki-content"));
            });
          }, 220);
        }
      }
      function isTooltipElement(element) {
        try {
          return element.classList && (element.classList.contains("wikihover-tooltip") || element.classList.contains("wikihover-pinned-tooltip")) || element.closest && (element.closest(".wikihover-tooltip") || element.closest(".wikihover-pinned-tooltip")) || element.getAttribute && element.getAttribute("data-wikihover-tooltip") === "true";
        } catch (err) {
          return false;
        }
      }
      function prefetchFeedsForName(name) {
        var _a2;
        if (!((_a2 = window.WikiHover) == null ? void 0 : _a2.isReady())) return;
        const client = window.WikiHover.getClient();
        const keys = window.WikiHover.getRegistry().keys();
        if (!keys.length) return;
        const cacheNames = Object.keys(feedPrefetchCache);
        if (cacheNames.length >= MAX_PREFETCH_CACHE_NAMES) {
          const oldest = cacheNames[0];
          delete feedPrefetchCache[oldest];
          delete feedResultCache[oldest];
        }
        if (!feedPrefetchCache[name]) feedPrefetchCache[name] = {};
        if (!feedResultCache[name]) feedResultCache[name] = {};
        keys.forEach((key) => {
          if (feedPrefetchCache[name][key]) return;
          feedPrefetchCache[name][key] = client.fetch(name, [key]).then((resp) => {
            const result = resp.feeds && resp.feeds[key] || null;
            feedResultCache[name][key] = result;
            return result;
          }).catch(() => {
            feedResultCache[name][key] = null;
            return null;
          });
        });
      }
      function renderSingleFeedIntoTooltip(tooltipEl, key, sourceResult) {
        var _a2;
        if (!tooltipEl || !((_a2 = window.WikiHover) == null ? void 0 : _a2.isReady())) return;
        const registry = window.WikiHover.getRegistry();
        const cssKey = _feedKeyToClass(key);
        const container = tooltipEl.querySelector(`.wikihover-${key}-content`) || tooltipEl.querySelector(`.wikihover-${cssKey}-content`);
        if (!container) return;
        const module2 = registry.get(key);
        if (!module2) return;
        try {
          module2.render(sourceResult || { status: "error" }, container);
          if (sourceResult && sourceResult.status === "ok") {
            revealTabIconColor(tooltipEl, cssKey);
          } else {
            hideTabButton(tooltipEl, cssKey);
          }
        } catch (e) {
          console.warn(`[WikiHover] ${key} render error:`, e);
        }
      }
      function updateNavButtons() {
        if (!(tooltipElement == null ? void 0 : tooltipElement._navBack)) return;
        const hasBack = tooltipNavIndex > 0;
        const hasFwd = tooltipNavIndex < tooltipNavHistory.length - 1;
        tooltipElement._navBack.style.display = hasBack ? "inline-block" : "none";
        tooltipElement._navFwd.style.display = hasFwd ? "inline-block" : "none";
        if (hasBack) {
          const prevName = tooltipNavHistory[tooltipNavIndex - 1];
          tooltipElement._navBack.innerHTML = "&#9664; " + prevName;
          tooltipElement._navBack.title = prevName;
        }
        if (hasFwd) {
          const nextName = tooltipNavHistory[tooltipNavIndex + 1];
          tooltipElement._navFwd.innerHTML = nextName + " &#9654;";
          tooltipElement._navFwd.title = nextName;
        }
      }
      function navigateToHistoryEntry(name) {
        const tempSpan = document.createElement("span");
        tempSpan.className = "wikihover-name";
        tempSpan.setAttribute("data-name", name);
        tempSpan.setAttribute("data-wikihover", "true");
        tempSpan.style.cssText = "position:fixed;left:0;top:0;opacity:0;pointer-events:none;font-size:0;height:1px;";
        tempSpan.textContent = name;
        document.body.appendChild(tempSpan);
        clearTimeout(tooltipTimer);
        tooltipHideGraceUntil = Date.now() + 3e3;
        if (tooltipElement) tooltipElement.setAttribute("data-dragged", "true");
        handleNameHover({ target: tempSpan });
        setTimeout(() => tempSpan.remove(), 5e3);
      }
      function navigateInPinnedTooltip(pinnedEl, name, fromHistory) {
        var _a2;
        resetTabIconsToBw(pinnedEl);
        if (!pinnedEl._navHistory) {
          pinnedEl._navHistory = [name];
          pinnedEl._navIndex = 0;
        } else if (!fromHistory) {
          pinnedEl._navHistory = pinnedEl._navHistory.slice(0, pinnedEl._navIndex + 1);
          pinnedEl._navHistory.push(name);
          pinnedEl._navIndex = pinnedEl._navHistory.length - 1;
        }
        const navBtns = pinnedEl.querySelectorAll('[title="Back"], [title="Forward"]');
        navBtns.forEach((btn) => {
          if (btn.title === "Back") {
            btn.style.display = pinnedEl._navIndex > 0 ? "inline-block" : "none";
          } else {
            btn.style.display = pinnedEl._navIndex < pinnedEl._navHistory.length - 1 ? "inline-block" : "none";
          }
        });
        const titleEl = pinnedEl.querySelector(".wikihover-title");
        if (titleEl) titleEl.textContent = name;
        pinnedEl.setAttribute("data-tooltip-name", name);
        const wikiContent = pinnedEl.querySelector(".wikihover-wiki-content");
        if (wikiContent) wikiContent.innerHTML = '<div class="wikihover-loader"></div>';
        pinnedEl.querySelectorAll(".wikihover-content").forEach((c) => {
          c.style.display = "none";
          c.style.visibility = "hidden";
          c.style.opacity = "0";
          c.classList.remove("active");
        });
        pinnedEl.querySelectorAll(".wikihover-tab").forEach((t) => t.classList.remove("active"));
        const wikiTab = pinnedEl.querySelector('[data-tab="wiki"]');
        if (wikiTab) wikiTab.classList.add("active");
        if (wikiContent) {
          wikiContent.style.display = "block";
          wikiContent.style.visibility = "visible";
          wikiContent.style.opacity = "1";
          wikiContent.classList.add("active");
        }
        pinnedEl.querySelectorAll(".wikihover-content").forEach((c) => {
          if (c !== wikiContent) {
            c.innerHTML = '<div class="wikihover-loader"></div>';
          }
        });
        prefetchFeedsForName(name);
        if ((_a2 = window.WikiHover) == null ? void 0 : _a2.isReady()) {
          const keys = window.WikiHover.getRegistry().keys();
          keys.forEach((key) => hideTabButton(pinnedEl, _feedKeyToClass(key)));
          let firstOkPinned = false;
          keys.forEach((key) => {
            const promise = feedPrefetchCache[name] && feedPrefetchCache[name][key];
            if (!promise) return;
            promise.then((sourceResult) => {
              if (pinnedEl.getAttribute("data-tooltip-name") !== name) return;
              if (!document.body.contains(pinnedEl)) return;
              renderSingleFeedIntoTooltip(pinnedEl, key, sourceResult);
              if (!firstOkPinned && sourceResult && sourceResult.status === "ok") {
                firstOkPinned = true;
                const cssKey = _feedKeyToClass(key);
                pinnedEl.querySelectorAll(".wikihover-content").forEach((c) => {
                  c.style.display = "none";
                  c.style.visibility = "hidden";
                  c.style.opacity = "0";
                  c.classList.remove("active");
                });
                pinnedEl.querySelectorAll(".wikihover-tab").forEach((t) => t.classList.remove("active"));
                const tab = pinnedEl.querySelector(`[data-tab="${cssKey}"]`);
                const content = pinnedEl.querySelector(`.wikihover-${cssKey}-content`);
                if (tab) tab.classList.add("active");
                if (content) {
                  content.style.display = "block";
                  content.style.visibility = "visible";
                  content.style.opacity = "1";
                  content.classList.add("active");
                }
              }
            });
          });
        }
      }
      var _a;
      if (!window.__WIKIHOVER_EMBED__ && chrome.runtime && typeof ((_a = chrome.runtime.onMessage) == null ? void 0 : _a.addListener) === "function") {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
          if (message.action === "getStats") {
            sendResponse({
              success: true,
              nameCount: markedNames.size,
              apiCallCount,
              maxApiCalls: MAX_API_CALLS
            });
          } else if (message.action === "toggleExtension") {
            extensionEnabled = message.enabled;
            if (!extensionEnabled) {
              hideTooltip();
              pinnedTooltips.forEach((p) => p.remove());
              pinnedTooltips = [];
              if (observer) observer.disconnect();
              document.querySelectorAll(".wikihover-processed").forEach((wrapper) => {
                const parent = wrapper.parentNode;
                if (!parent) return;
                while (wrapper.firstChild) {
                  parent.insertBefore(wrapper.firstChild, wrapper);
                }
                parent.removeChild(wrapper);
              });
              document.querySelectorAll(".wikihover-name").forEach((span) => {
                const parent = span.parentNode;
                if (!parent) return;
                const textNode = document.createTextNode(span.textContent);
                parent.replaceChild(textNode, span);
              });
              document.body.normalize();
              markedNames.clear();
              markedByDocument.clear();
              processedNamesCount = 0;
              document.querySelectorAll("[data-wikihover-processed]").forEach((el) => {
                el.removeAttribute("data-wikihover-processed");
              });
            } else {
              if (observer) observer.observe(document.body, { childList: true, subtree: true });
              scanForNames();
            }
            sendResponse({ success: true });
          } else if (message.action === "updateDataSourceSettings") {
            const oldSettings = { ...dataSourceSettings };
            if (message.settings) {
              dataSourceSettings = { ...dataSourceSettings, ...message.settings };
            }
            if (tooltipElement) updateTabVisibility(tooltipElement);
            pinnedTooltips.forEach((p) => updateTabVisibility(p));
            sendResponse({ success: true });
          } else if (message.action === "updateTabOrder") {
            tabOrder = message.tabOrder;
            if (tooltipElement) reorderTooltipTabs(tooltipElement);
            pinnedTooltips.forEach((p) => reorderTooltipTabs(p));
            sendResponse({ success: true });
          } else if (message.action === "updateTheme") {
            const theme = message.theme || "light";
            const applyTheme = (el) => {
              if (theme === "light") {
                el.removeAttribute("data-wikihover-theme");
              } else {
                el.setAttribute("data-wikihover-theme", theme);
              }
            };
            applyTheme(document.documentElement);
            if (tooltipElement) applyTheme(tooltipElement);
            pinnedTooltips.forEach((p) => applyTheme(p));
            sendResponse({ success: true });
          } else if (message.action === "updateVideoSound") {
            videoSoundEnabled = message.videoSound;
            window._whVideoSoundEnabled = message.videoSound;
            const allTooltips = [tooltipElement, ...pinnedTooltips].filter(Boolean);
            allTooltips.forEach((tt) => {
              tt.querySelectorAll("video").forEach((v) => {
                v.muted = !videoSoundEnabled;
              });
            });
            sendResponse({ success: true });
          } else if (message.action === "clearCache") {
            Object.keys(feedPrefetchCache).forEach((k) => delete feedPrefetchCache[k]);
            Object.keys(feedResultCache).forEach((k) => delete feedResultCache[k]);
            sendResponse({ success: true });
          }
          return true;
        });
      }
    }
  });

  // player-entry.js
  require_wikihover_embed_polyfill();
  require_player_server_client();
  require_feed_registry();
  require_feed_module();
  require_agent();
  require_wikipedia();
  require_tvmaze();
  require_imdb();
  require_instagram();
  require_tiktok();
  require_social_stubs();
  require_polymarket();
  (function() {
    var css = require_styles();
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  })();
  (function initPlayerFromPageConfig() {
    "use strict";
    const config = window.WikiHoverConfig;
    if (!config || !config.token || !config.orgId) {
      console.error("[WikiHover Player] Missing WikiHoverConfig \u2014 token and orgId are required");
      return;
    }
    if (window.WikiHover && window.WikiHover._initialized) {
      window.WikiHover.reset();
    }
    window.WikiHover.init({
      token: config.token,
      orgId: config.orgId,
      feeds: config.feeds,
      server: config.server,
      feedResponseMap: config.feedResponseMap || null,
      version: config.version != null ? config.version : null,
      defaultFeed: config.defaultFeed != null ? config.defaultFeed : 5
    });
  })();
  require_content();
})();

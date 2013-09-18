/*!
 * jLimei JavaScript Library v1.1.0
 * http://www.limei.com
 *
 * Copyright 2012 jLimei Foundation and other contributors
 * Released under the MIT license
 *
 * Date: Thu Feb 07 2013 13:31:38 
 */
(function (document,undefined){
	function createSafeFragment( document ) {
		var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

		if ( safeFrag.createElement ) {
			while ( list.length ) {
				safeFrag.createElement(
					list.pop()
				);
			}
		}
		return safeFrag;
	};
	var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	core_rnotwhite = /\S/,
	_readyfn = [],
	core_px = /^(\d)+px$/i,
	core_toString = Object.prototype.toString,
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

	jLimei = function (selector){
		return new jLimei.fn.init(selector);
	};
	window.jLimei = window.$ = jLimei;

	jLimei.prototype = jLimei.fn = {
		constructor:jLimei,
		jlimei:'1.1',
		init:function(selector){
			if ( typeof selector === "string" || selector==window|| selector == document || selector.nodeType) {
				var domList = jLimei.getAllObj(selector);
				if(!domList) domList = [];
				this[0] = domList;
			} else if( typeof selector === "function" ){
				this.ready(selector);
			} else if(selector.constructor==Array){
				this[0] = selector;
			}
			return this;
		},
		_readyrun:function (fn){
			for(var i=0,j=fn.length;i<j;i++){
				fn[i]();
			}
		},
		ready:function (f){
			var browser = jLimei.browerV();	
			var d = document;
			var ie = browser.ie;
			var wk = browser.webkit;
			if (!ie&&!wk&&d.addEventListener) {
				return d.addEventListener('DOMContentLoaded', f, false); 
			};
			var fn = _readyfn,run = this._readyrun;
			var fnval = fn.push(f);
			if (fnval>1) {
				return this;
			};
			if(ie){
				(function (){
					try{
						d.documentElement.doScroll('left');
						run(fn);
					} catch(ex){
						setTimeout(arguments.callee,0);
					}
				})();
			} else if(wk){
				var t = setInterval(function () {
					if (/^(loaded|complete)$/.test(d.readyState)) {
						clearInterval(t),run(fn);
					};
	            	
				},0);
			}
			return this;
		},
		size:function(){
			if(this[0]==null) return 0;
			return this[0].length;
		},
		length:function(){
			return this.size();
		},
		gt:function (index){
			var temp = [];
			var elems = this[0];
			if(elems.length>index){
				for(var i = index,j=elems.length;i<j;i++){
					temp.push(elems[i]);
				}
				this[0] = temp;
				return this;
			}
			return null;
		},
		lt:function (index){
			var temp = [];
			var elems = this[0];
			if(elems.length>index){
				for(var i = 0,j=index;i<j;i++){
					temp.push(elems[i]);
				}
				this[0] = temp;
				return this;
			}
			return null;		
		},
		get:function (index){
			var elems = this[0];
			if(elems.length>index){
				return this[0][index];
			}
			return null;
		},
		eq:function (index){
			var elems = this[0];
			if(elems.length>index){
				return jLimei(this[0][index]);
			}
			return null;
		},
		find:function (selector){
			var domList = jLimei.getAllObj(selector,this);
			if(!domList) domList = [];
			domList = jLimei(domList);
			return domList;
		}
	};

	jLimei.fn.init.prototype = jLimei.prototype;

	//many module develop
	jLimei.fn.extend = function() {
		var target = arguments[0] || {};
		for(var o in target){
           if(typeof(target[o])=="function"){
           		jLimei.fn[o]=target[o];
           }
        }
		return jLimei;
	};

	jLimei.extend = function(){
		var target = arguments[0] || {};
		for(var o in target){
           if(typeof(target[o])){
           		$[o]=target[o];
           } 
        }
		return jLimei;
	};


	//get object

	jLimei.extend({
		getItself:function(id){
			return "string"== typeof id?document.getElementById(id):id;
		},
		_getAllClsObj:function(pobj,curr){
			var len = pobj.length,index = 0,_temp=[];
			while(len&&index<len){
				var _obj = null;
				if(pobj[index].getElementsByClassName){
					_obj = pobj[index].getElementsByClassName(curr.substring(1));
				} else {
					_obj = jLimei.support.fixGetElementsByClassName(curr.substring(1),pobj[index]);
				}
				
				if(!_obj) return null;
				for(m=0,n=_obj.length;m<n;m++){
					_temp.push(_obj[m]);
				}
				index++;
			}
			return _temp;
		},
		_getAllTagObj:function(pobj,curr){
			var len = pobj.length,index = 0,_temp = [];
			while(len&&index<len){
				var children = pobj[index].getElementsByTagName(curr);
				for(var i = 0,j=children.length;i<j;i++){
					_temp.push(children[i]);
				}
				index++;
			}
			return _temp;
		},
		_is:function (domArr,dom){
			for(var i = 0,j=domArr.length;i<j;i++){
				if(domArr[i]==dom) return true;
			}
			return false;
		},
		_filterRepeatDom:function(domArr){
			var filterArr = [];
			for(var i = 0,j=domArr.length;i<j;i++){
				if(!this._is(filterArr,domArr[i])){
					filterArr.push(domArr[i]);
				}
			}
			return filterArr;
		},

		getAllObj:function (string,$obj){
			if(string==window||string==document||string.nodeType==1){
				return [string];
			}

			var splitComma = string.split(/,|，/g);
			var allObj  = [];

			for (var indexComma = 0,lenComma = splitComma.length;indexComma<lenComma;indexComma++){
				var blocks = splitComma[indexComma];
				if(!blocks) continue;
				var arr = blocks.split(/\s+/g);
				var pobj = [document];
				if($obj&&$obj.length()>0){
					pobj = $obj[0];
				}
				for(var i=0,j=arr.length;i<j;i++){
					var curr = arr[i];
					var c = curr.charAt(0);
					var reqkw = /([\.#]\w)?\[(\w)+=(\w)+\]$/g;
					if(c==="#"){
						var _obj = document.getElementById(curr.substring(1));
						if(!_obj) return null;
						pobj = [_obj];
						
					} else if(reqkw.test(curr)){
						var index = curr.indexOf("[");
						var _temp = null;
						if(index){
							var val = curr.substring(1,index);
							if(!val) return null;
							if(c==="."){
								_temp = jLimei._getAllClsObj(pobj,"."+val);
								
							} else if (c==="#"){
								_temp = document.getElementById(val);
								if(!_temp) return null;
								else _temp = [_temp];
							} else {
								_temp = jLimei._getAllTagObj(pobj,curr.substring(0,index));
							}
							var key = curr.substring(curr.indexOf("[")+1,curr.indexOf("="));
							var value = curr.substring(curr.indexOf("=")+1,curr.indexOf("]"));	
							var _newtemp = [];
							for(var m = 0, n = _temp.length; m < n; m++) {
								var _value = _temp[m].getAttribute(key);
								if(_value===value){
									_newtemp.push(_temp[m]);
								}
							};
							pobj = _newtemp;
						}
					} else if(c==="."){				
						pobj = jLimei._getAllClsObj(pobj,curr);
					} else {//tag
						pobj = jLimei._getAllTagObj(pobj,curr);
					}
				}

				allObj = allObj.concat(pobj);
			}
			
			if((allObj instanceof Array) && allObj.length>0){
				return jLimei._filterRepeatDom(allObj);
			}
			return null;
		}

	});

	jLimei.extend({
		Map:function (){
			return (new this._map());
		},
		StringBuffer:function (){
			return (new this._stringBuffer());
		},
		_map:function (){
			this.length = 0;
			this.prefix = "hashMap_www_limei_2012";
			this.put = function(key,value){
				this[this.prefix+key] = value;
				this.length++;
			};
			this.get = function(key){
				return (typeof this[this.prefix+key]=='undefined'?null:this[this.prefix+key]);
			};

			this.keySet=function(){
				var arrKeySet = new Array();
				for(var obj in this){
					if(obj.substring(0,this.prefix.length)==this.prefix)
						arrKeySet.push(obj.substring(this.prefix.length));
				}
				this.length = arrKeySet.length;
				return arrKeySet.length==0?null:arrKeySet;
			}; 
			this.values = function(){
				var arrValues = new Array();
				for(var obj in this){
					if(obj.substring(0,this.prefix.length)==this.prefix)
						arrValues.push(this[obj]);
				}
				this.length = arrValues.length;
				return arrValues.length==0?null:arrValues;
			};

			this.size = function(){
				return this.length;
			};

			this.remove = function(key){
				delete this[this.prefix+key];
				this.length--;
			};

			this.clear = function(){
				for(var obj in this){
					if(obj.substring(0,this.prefix.length)==this.prefix)
						delete this[obj];
				}
			};

			this.isEmpty = function(){
				return this.length==0;
			};

			this.containKey = function(key){
				for(var obj in this){
					if(obj==this.prefix+key)
						return true;
				}
				return false;
			};
			this.toString = function(){
			    var str = "";
			    for(var strKey in this){
			        if(strKey.substring(0,this.prefix.length) == this.prefix)
			              str+=strKey.substring(this.prefix.length)+":"+this[strKey]+"\r\n";
			    }
			    return str;
			};
		},
		_stringBuffer:function(){
			this._strings_ = new Array();
			this.append = function (s){
				this._strings_.push(s);
			};
			this.toString = function (){
				return this._strings_.join("");
			};
		}
	});

	//EventUtil single event
	jLimei.extend({
		addEventHandler:function (oTarget,sEventType,fnHandler){
			if(oTarget.addEventListener){//for dom - compliant false
				oTarget.addEventListener(sEventType,fnHandler,false);
			} else if(oTarget.attachEvent){ //for ie
				oTarget.attachEvent("on"+sEventType,function (){
					fnHandler.call(oTarget);
				});
			} else {//other browser
				oTarget["on"+sEventType] = fnHandler;
			}
		},
		removeEventHandler:function (oTarget,sEventType,fnHandler){
			if(oTarget.removeEventListener){
				oTarget.removeEventListener(sEventType,fnHandler,false);
			} else if(oTarget.detachEvent){
				oTarget.detachEvent("on"+sEventType,fnHandler);
			} else {
				oTarget["on"+sEventType] = null;
			}
		},
		_formatEvent:function (oEvent){
			var v = jLimei.browerV();
			if(v.ie){
				oEvent.charCode=(oEvent.type=="keypress")?oEvent.keyCode:0;
				oEvent.eventPhase=2;
				oEvent.isChar=(oEvent.charCode>0);
				oEvent.pageX=oEvent.clientX+document.body.scrollLeft;
				oEvent.pageY=oEvent.clientY+document.body.scrollTop;
				oEvent.preventDefault=function(){
					this.returnValue=false;
				};	
				if(oEvent.type=="mouseout"){
					oEvent.relatedTarget=oEvent.toElement;
				}else if(oEvent.type=="mouseover"){
					oEvent.relatedTarget=oEvent.fromElement;
				}	
				oEvent.stopPropagation=function  () {
					this.cancelBubble=true;
				};	
				oEvent.target=oEvent.srcElement;
				oEvent.time=(new Date).getTime();
			}
			return oEvent;
		},
		getEvent:function (){
			if(window.event){
				return jLimei._formatEvent(window.event);
			}else{
				return jLimei.getEvent.caller.arguments[0];
			}
		}
	});

	//many event
	jLimei.fn.extend({
		bind:function(types,fn){
			for(var i=0,j=this[0].length;i<j;i++){
				jLimei.addEventHandler(this[0][i],types,fn);
			}
		},
		unbind:function(types,fn){
			for(var i=0,j=this[0].length;i<j;i++){
				jLimei.removeEventHandler(this[0][i],types,fn);
			}
		}
	});

	//
	jLimei.extend({
		_listenerList : jLimei.Map(),
		_delegateHandle:function ($id,event){
			var event = jLimei.getEvent(event);
			var target = event.target;
			if(!$id||!target) return false;
			var isContains = $id.contains(target);
			return isContains;
		},
		delegate:function (objs,listenerType,fnHandler,delegates){//这种代理移除事件,之后写
			var $parentObj = $(document);
			if(delegates){
				 $parentObj = jLimei(delegates);
			}			
			if($parentObj&&$parentObj.length()>0){
				$parentObj = $parentObj[0][0];
				(function (_objs,_fnHandler){

					var _fn = function (event){
						var event = jLimei.getEvent(event);

						var doms = jLimei(_objs);
						if(doms&&doms.length()>0){
							var arr = doms[0];
							for(var i=0,j=arr.length;i<j;i++){
								var obj = arr[i];
								var isHandler = jLimei._delegateHandle(obj,event);
								if(isHandler){
									fnHandler(obj);
									break;
								} 
							}
						}
						
					};
					
					jLimei._listenerList.put(objs+"_-_"+listenerType,_fn);
					jLimei.addEventHandler($parentObj,listenerType,_fn);
				})(objs,fnHandler);
			} else {
				return delegateId+" not found";
			}
		},
		undelegate:function (objs,listenerType,delegates){
			var _fnName = objs+"_-_"+listenerType;
			var _fn = jLimei._listenerList.get(_fnName);
			var $parentObj = $(document);
			if(delegates){
				$parentObj = jLimei(delegates);
			}
			if(_fn&&$parentObj&&$parentObj.length()>0){
				jLimei.removeEventHandler($parentObj[0][0],listenerType,_fn);
				jLimei._listenerList.remove(_fnName);
			}
		}
	});


	jLimei.extend({
		browerV:function (){
			var Sys = {};
			var ua = navigator.userAgent.toLowerCase();
			var s;
			(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
			(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
			(s = ua.match(/webkit\/([\d.]+)/)) ? Sys.webkit = s[1] : //chrome
			(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
			(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
			return Sys;
		},
		isFunction: function( obj ) {
			return jLimei.type(obj) === "function";
		},

		isArray: Array.isArray || function( obj ) {
			return jLimei.type(obj) === "array";
		},

		isWindow: function( obj ) {
			return obj != null && obj == obj.window;
		},

		isNumeric: function( obj ) {
			return !isNaN( parseFloat(obj) ) && isFinite( obj );
		},

		type: function( obj ) {
			return obj == null ?
				String( obj ) :
				[ core_toString.call(obj) ] || "object";
		},
		parseJSON: function( data ) {
			return ( new Function( "return " + data ) )();
		},
		parseXML: function( data ) {
			var xml, tmp;
			
			if ( !data || typeof data !== "string" ) {
				return null;
			}
			try {
				if ( window.DOMParser ) { // Standard
					tmp = new DOMParser();
					xml = tmp.parseFromString( data , "text/xml" );
				} else { // IE
					xml = new ActiveXObject( "Microsoft.XMLDOM" );
					xml.async = "false";
					xml.loadXML( data );
				}
			} catch( e ) {
				xml = undefined;
			}
			if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
				return "Invalid XML: " + data;
			}
			return xml;
		},
		globalEval: function( data ) {
			if ( data && core_rnotwhite.test( data ) ) {
				// We use execScript on Internet Explorer
				// We use an anonymous function so that context is window
				// rather than jQuery in Firefox
				( window.execScript || function( data ) {
					window[ "eval" ].call( window, data );
				} )( data );
			}
		},

		serializePost: function(data){
			var arr = [];
			for(var o in data){
				arr.push(o+"="+data[o]);
			}
			if(arr.length) return arr.join("&");
			return null;
		},
		getUrlParam: function (name,searchString){
			if(!searchString) searchString = location.search;
			if(typeof searchString == "string"){
				var index = searchString.indexOf("?");
				if(index>=0){
					searchString = searchString.substring(index+1);
				} 
				var params = unescape(searchString).split("&");
				for(var i=0,j=params.length;i<j;i++){
					if(params[i].indexOf("=") > 0){
						if (params[i].split("=")[0].toLowerCase()==name.toString().toLowerCase()){
							return params[i].split("=")[1];
						}
					}
				}
			}
			return null;
		},
		contains:function(dom1,dom2){
			return dom1.contains(dom2);
		},
		stringToDom:function (string){
			fragmentDiv.innerHTML = string;
			return fragmentDiv.childNodes;
		},
		stringify:function(obj) {
	        if (typeof obj == 'object') {
	            if (obj.push) {
	                var out = [];
	                for (var p = 0; p < obj.length; p++) {
	                    out.push(obj[p]);
	                }
	                return '[' + out.join(',') + ']';
	            } else {
	                var out = [];
	                for (var p in obj) {
	                    out.push('\''+p+'\':'+obj[p]);
	                }
	                return '{' + out.join(',') + '}';
	            }
	        } else {
	            return String(obj);
	        }
	    },
	    checkArray:function (array,id){
	    	if(array instanceof Array){
	    		for(var i = 0, j = array.length;i<j;i++){
	    			if(array[i]==id) return true;
	    		}
	    		return false;
	    	}
	    	return null;
	    },
	    removeArrayRecord:function (array,id){
	    	if(array instanceof Array){
		    	for(var i=0,n=0;i<array.length;i++){
					if(array[i]!=id) array[n++]=array[i];
			    }
			    array.length = array.length-1;
			    return array;
		    }
		    return null;
	    },
	    createCookie:function (name,value,days){
	    	var expires="";
	    	if (days){
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				expires = ";expires="+date.toGMTString();
			} 
			try{
				document.cookie = name+"="+value+expires+"; path=/";
			} catch (e){
				//alert("cookie:"+e);
			}
			
	    },
	    readCookie:function (name){
	    	try{
	    		var nameEQ = name + "=";
				var ca = document.cookie.split(';');
				for(var i=0;i < ca.length;i++){
					var c = ca[i];
					while (c.charAt(0)==' ') c = c.substring(1,c.length);
					if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
				}
	    	} catch(e){
	    		return null;
	    	}
	    	
			return null;
	    },
	    eraseCookie : function (name){
			jLimei.createCookie(name,"",-1);
		},
		clone:function (elem){
			var clone;
			if(jLimei.support.html5Clone || elem.cloneNode){
				clone = elem.cloneNode( true );
			}  else {
				fragmentDiv.innerHTML = elem.outerHTML;
				fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
			}
			// no copy event
		    return clone;
		},
		setLocalStorage:function (key,value,days){
			try{
				if(localStorage){
					localStorage.setItem(key,value);
				} else {
					var len = value.length;
					if(len<2000){
						this.createCookie(key,value,days);
					} else {
						var flag = len/2000;
						var iflag = parseInt(flag,10);
						if(flag>iflag){
							iflag = iflag+1;
						}
						for(var i=0;i<iflag;i++){
							val = value.substring(i*2000,i*2000+2000);
							this.createCookie(key+"_"+i,val,days);
						}
					}
				}
			} catch(e){
				//alert("storage:"+e);
				return -1;

			}
		},
		getLocalStorage:function (key){

			try{
				if(localStorage){
					return localStorage.getItem(key);
				} else {

					var i = 0;
					var string="";
					while(true){
						var val = jLimei.readCookie(key+"_"+i);
						if(!val) break;
						string +=val;
						i++;
					}
					return string;
				}
			} catch (e) {
				//alert("getLocalStorage::"+e);
			}
		},
		clearLocalStore:function (key){

			try{
				if(localStorage){
					localStorage.setItem(key,"");
					//localStorage.clear();
					
				} else {
					var i = 0;
					while(true){
						if(jLimei.readCookie(key+"_"+i)){
							jLimei.eraseCookie(key+"_"+i);
							i++;
						} else 
							break;
					} 
				}
			} catch(e){
				//alert("clearLocalStore:"+e);
			}

		}
	});

	jLimei.support = (function (){
		var support;
		support = {
			getWindow : function (elem){
				return jLimei.isWindow( elem ) ? elem : elem.nodeType === 9 ? 	elem.defaultView || elem.parentWindow : false;
			},
			isBodyOffset:function(){
				var body = document.getElementsByTagName("body")[0];
				return ( body.offsetTop !== 1 );
			},
			fixGetElementsByClassName:function (className,element){
				if(document.getElementsByClassName) return false; //for ie
				var children = (element||document).getElementsByTagName("*");
				var elements = [];
				for(var i = 0,j=children.length;i<j;i++){
					var ele = children[i];
					var classNames = ele.className.split(/\s+/g);
					for(m=0,n=classNames.length;m<n;m++){
						if(className==classNames[m]){
							elements.push(ele);
							break;
						}
					}
				}
				return elements;
			},
			// Makes sure cloning an html5 element does not cause problems
			// Where outerHTML is undefined, this still works
			html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>"
		};
		return support;
	})();

	

	

	//style
	jLimei.fn.extend({
		_fixWh:function(name){
			var elem = this[0][0];
			if ( jLimei.isWindow( elem ) ) {
				// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
				// isn't a whole lot we can do. See pull request at this URL for discussion:
				// https://github.com/jquery/jquery/pull/764
				return elem.document.documentElement[ "client" + name ];
			}
			var doc;
			// Get document width or height
			if ( elem.nodeType === 9 ) {
				doc = elem.documentElement;
				// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
				// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
				return Math.max(
					elem.body[ "scroll" + name ], doc[ "scroll" + name ],
					elem.body[ "offset" + name ], doc[ "offset" + name ],
					doc[ "client" + name ]
				);
			}
			// Get width or height on the element
			return elem["offset"+name];
		},
		width:function (){
			return this._fixWh("Width");
				//return 
		},
		height:function(){
			return this._fixWh("Height");
		},
		css:function (string,value){
			var elems = this[0];
			if(!elems) return null;
			var elem = this[0][0];
			if(string=="class") string = string + "Name";
			if(typeof value == "string"){
				for(var i = 0,j=elems.length;i<j;i++){
					if(string==="className") elems[i][string] = value;
					else elems[i].style[string] = value;
				}				
				return this;
			} else if(string && typeof string == "object"){
				for(var i = 0,j=elems.length;i<j;i++){
					for (var o in string){
						if(o=="class") {
							o += "Name";
							elems[i][o] = string[o];
						} else 	elems[i].style[o] = string[o];
					}
				}
				return this;
			} else if(string && typeof string == "string"){
				if(string==="className") return elem[string];
				var val = elem.style[string];
				if( core_px.test(val) ){
					val = parseInt(val.replace(/px/g,""),10);
				}
				return val;
			}
			
			return this;
		},
		show:function(){
			this.css("display","inline");
			return this;
		},
		hide:function(){
			this.css("display","none");
			return this;
		},
		bodyOffset: function() {
			var elem = this[0][0];
			var top = elem.offsetTop,
				left = elem.offsetLeft;
			if ( jLimei.support.isBodyOffset() ) {
				top  += parseFloat( this.css("marginTop") ) || 0;
				left += parseFloat( this.css("marginLeft") ) || 0;
			}

			return { top: top, left: left };
		},
		offset:function () {
			var box, docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft, top, left,
			elem = this[0][0],
			doc = elem && elem.ownerDocument;
			if ( !doc ) {
				return;
			}
			if ( (body = doc.body) === elem ) {
				return this.bodyOffset();
			}
			docElem = doc.documentElement;
			if ( !jLimei.contains( docElem, elem ) ) {
				return { top: 0, left: 0 };
			}
			box = elem.getBoundingClientRect();
			win = jLimei.support.getWindow(doc);
			clientTop  = docElem.clientTop  || body.clientTop  || 0;
			clientLeft = docElem.clientLeft || body.clientLeft || 0;
			scrollTop  = win.pageYOffset || docElem.scrollTop;
			scrollLeft = win.pageXOffset || docElem.scrollLeft;
			top  = box.top  + scrollTop  - clientTop;
			left = box.left + scrollLeft - clientLeft;
			return {top:top,left:left};
		},
		hasClass:function (cls){
			if(!cls) return false;
			var elem = this[0][0];
			var classNames = elem.className.split(/\s+/g);
			return jLimei.checkArray(classNames,cls);
		},
		_oprateClass:function (cls,type){
			var elems = this[0];
			for(var i=0,j=elems.length;i<j;i++){
				var elem = elems[i];
				var elemCls = elem.className;
				//if(!elemCls) continue;

				var classNames = elemCls.split(/\s+/g);//匹配任何换行符 空格
				var isCls = jLimei.checkArray(classNames,cls);
				if(type==="remove"&&isCls){
					elem.className=jLimei.removeArrayRecord(classNames,cls).join(" ");
				} else if(type==="add" && !isCls){

					elem.className += " "+cls;
				}
			}
			return this;
		},
		removeClass:function (cls){
			return this._oprateClass(cls,"remove");
		},
		addClass:function (cls){
			return this._oprateClass(cls,"add");
		},
		html:function (text){
			var elems = this[0];
			if(!elems) return null;
			if(typeof text === "string"){
				for(var i=0,j=elems.length;i<j;i++){
					var elem = elems[i];
					elem.innerHTML = text;
				}
			} else {
				return elems[0].innerHTML;
			}
			return this;
		},
		_dom:function (elem,type){
			var domElem;
			if(elem.constructor===String){
				domElem = jLimei.stringToDom(elem);
			} else {
				domElem =  elem[0];
			}
			var elems = this[0];
			for (var m = 0,n = domElem.length;m<n;m++){
				var temp = domElem[m];
				for(var i=0,j=elems.length;i<j;i++){
					var o = jLimei.clone(temp);
					var currElem = elems[i];
					if(type=="append"){
						currElem.appendChild(o);
					} else if(type=="prepend"){
						currElem.insertBefore(o, currElem.firstChild );
					} else if (type=="before") {
						currElem.parentNode.insertBefore(o,currElem);
					} else if(type=="after") {
						currElem.parentNode.insertBefore(o,currElem.nextSibling);
					}			
				}
			}
			return this;
		},
		append:function (elem){
			return this._dom(elem,"append");
		},
		prepend:function (elem){
			return this._dom(elem,"prepend");
		},
		before:function (elem){
			return this._dom(elem,"before");
		},
		after:function (elem){
			return this._dom(elem,"after");
		},
		remove:function (){
			var elems = this[0];
			if(elems.length>0){
				for(var i=0,j=elems.length;i<j;i++){
					var elem = elems[i];
					var pnode = elem.parentNode;
					pnode.removeChild(elem);
				}
			}
		},
		attr:function (key,value){
			var elems = this[0];
			if(!elems) return this;
			if(value){
				for(var i=0,j=elems.length;i<j;i++){
					if(key=="class"){
						elems[i].setAttribute("className",value);
					}
					elems[i].setAttribute(key,value);
				}
			} else {
				var _value;
				if(key=="class"){
					_value = elems[0].getAttribute("className");
					if(_value) return _value;
				}
				return elems[0].getAttribute(key);
			}
			return this;
		},
		val:function (value){
			var elem = this[0][0];
			if(elem && ("value" in elem)){
				if(typeof (value) != "string"){
					return elem.value;
				} else {
					elem.value = value;
				}
				
			} 
			return this;			
		},
		parents:function (val){
			var elem = this[0][0];
			var reqkw = /([\.#]\w)?\[(\w)+=(\w)+\]$/g;
			var parent = elem.parentNode;
			var robj = null;
			while(parent&&val){
				var c = val.charAt(0);
				if(c==="#"){
					var idName = jLimei(parent).attr("id");
					if(("#"+idName)==val){
						robj = parent;
						break;
					}
				} else if(reqkw.test(val)){

					var index = val.indexOf("[");
					var key = val.substring(val.indexOf("[")+1,val.indexOf("="));
					var value = val.substring(curr.indexOf("=")+1,val.indexOf("]"));
					if(index&&c=="."){
						var className = val.substring(1,index);
						var isClass = jLimei(parent).hasClass(className);
						if(isClass&&jLimei(parent).attr(key)==value){
							robj = parent;
							break;
						}
					} else if(!index&&jLimei(parent).attr(key)==value){
						robj = parent;
						break;
					}
					
				} else if(c==="."){
					var className = val.substring(1);
					var isClass = jLimei(parent).hasClass(className);
					if(isClass){
						robj = parent;
						break;
					}
				} else {
					var tagName = parent.tagName.toUpperCase();
					var upperVal = val.toUpperCase();
					if(tagName==upperVal){
						robj = parent;
						break;
					}
				}
				parent = parent.parentNode;
			}
			return robj?jLimei(robj):robj;
		}
	});	




	//ajax,jsonp
	jLimei.extend({
		ajax:function(json){
			var xmlHttp = null;
			if (window.XMLHttpRequest) xmlHttp = new XMLHttpRequest();
			else if (window.ActiveXObject) xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			else return null;
			var _fixFF = false;
			var fnResponseText = function (data){
				if(json.dataType==="json"){
					return jLimei.parseJSON(data);
				} else if(json.dataType=="xml"){
					return jLimei.parseXML(data);
				} else if(json.dataType=="string"){
					return data;
				} else {
					return data;
				}				
				
			};
			if(json.isSync){
				var _fixChrome = 1;
				xmlHttp.onreadystatechange = function (){
					_fixFF = true;
					if(xmlHttp.readyState==4 && xmlHttp.status==200){
						if(json.callback&&_fixChrome){
							_fixChrome = 0;
							json.callback(fnResponseText(xmlHttp.responseText));
						}
					}
				};
			}
			xmlHttp.open(json.method,json.url,json.isSync);//true为异步，false为同步
			var dataString = "";
			if(json.method=="post"){
				if(json.data){
					dataString = this.serializePost(json.data);
				}
				xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=UTF-8");
			}
			xmlHttp.send(dataString);
			if(json.isSync===false){
				return fnResponseText(xmlHttp.responseText);
			}
			if(!document.all&&!_fixFF){
				if(json.callback){
					json.callback(fnResponseText(xmlHttp.responseText));
				}
			}
		},
		loadScript:function(json){//url, (callback,dataType) post submit need dynamic iframe
			var url = json.url;
			var callback = json.callback;
			if(this.prototype.jsMap&&json.flag!==0){
				var jm = this.prototype.jsMap.get(url);
				if(jm==url){
					if (callback) callback();
					return;//避免重复加载
				} else {
					this.prototype.jsMap.put(url,url);
				}
				
			} else {
				this.prototype.jsMap = jLimei.Map();
				this.prototype.jsMap.put(url,url);
			}
			var doc = document;
			var	el = doc.createElement('script');
			var	head = doc.getElementsByTagName('head')[0];
			if (callback) {
				if (doc.all) {
					el.onreadystatechange = function(){
						if (el.readyState == 'loaded' || el.readyState == 'complete') callback();
					};
				}
				else el.onload = callback;
			}
			el.setAttribute('type','text/javascript');
			el.src = url;
			head.appendChild(el);
			return this;
		},
		jsonp:function(json){
			var url = json.url;
			var callbackVal = this.getUrlParam("callback",url);
			if(callbackVal==="?"||callbackVal===null){
				url = url.replace(/\?callback\=\?/,"")+"?callback=jsonpCallback";
				callbackVal = "jsonpCallback";
			}
			window [callbackVal] = json.callback;
			var stringParam = this.serializePost(json.data);
			if(stringParam) url = url + "&"+stringParam;
			this.loadScript({url:url,flag:0}); 
		}
	});

	jLimei.extend({
		isEmail:function (email){
			var regExp =  /^([a-z0-9A-Z]+[_\-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
			return regExp.test(email);
		}
	});
})(document);
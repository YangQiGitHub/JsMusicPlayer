(function(win,tcf){
		var doc    		= win.document;
		var docEl  		= doc.documentElement; 
		var metaEl 		= doc.querySelector('meta[name="viewport"]');
		var dpr    		= 0;
		var scale  		= 0;
		var handler	 	= null;

		var flexible = tcf.flexible || (tcf.flexible = {});

    	//将根据已有的meta标签来设置缩放比例
		if (metaEl) { 
	        var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
	        if (match) {
	            scale = parseFloat(match[1]);
	            dpr = parseInt(1 / scale);
	        }
	    }
	    //如果没有设置，那么会自动添加meta viewport的设置
	    if (!dpr && !scale) {
	        var isAndroid 		 = win.navigator.appVersion.match(/android/gi);
	        var isIPhone 		 = win.navigator.appVersion.match(/iphone/gi);
	        var isLiebao 		 = win.navigator.appVersion.match(/LieBao/gi);
	        var isSogou 		 = win.navigator.appVersion.match(/Sogou/gi);
	        var clsName 		 = String(isIPhone||isLiebao||isSogou||isAndroid||'').toLowerCase();
	        var devicePixelRatio = Math.floor(win.devicePixelRatio)||1;
	        if (isIPhone) {
	            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {                
	                dpr = 3;
	            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
	                dpr = 2;
	            } else {
	                dpr = 1;
	            }

	        }else if(isLiebao || isSogou){
	        	dpr = 1;
	        }else {
	            dpr = devicePixelRatio;   
	        }

	        doc.body.classList.add(clsName);
	        scale = 1 / dpr;
	    }

		

		if (!metaEl) {
			metaEl = doc.createElement('meta');
	        metaEl.setAttribute('name', 'viewport');
	        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale +',user-scalable=no');
	        if (docEl.firstElementChild) {
	            docEl.firstElementChild.appendChild(metaEl);
	        } else {
	            var wrap = doc.createElement('div');
	            wrap.appendChild(metaEl);
	            doc.write(wrap.innerHTML);
	        }
	    }

	    docEl.setAttribute('data-dpr', dpr);

		var setFontSize = function(){
			var width = docEl.getBoundingClientRect().width;
	        if (width / dpr > 540) {
	            width = 540 * dpr;
	        }
	        var rem = width / 10;
	        rem = Math.max(rem,32);
			docEl.style.fontSize =  rem+'px';
			flexible.width = width;
			flexible.rem = win.rem = rem;
		};

		['resize','orientationchange'].forEach(function(item){
			win.addEventListener(item, function(e) {
		        clearTimeout(handler);
		        handler = setTimeout(setFontSize, 300);
		    }, false);
		})

	    win.addEventListener('pageshow', function(e) {
	        if (e.persisted) {
	            clearTimeout(handler);
	            handler = setTimeout(setFontSize, 300);
	        }
	    }, false);

	    if (doc.readyState === 'complete') {
	    	
	        doc.body.style.fontSize = 12 * dpr + 'px';
	    } else {
	        doc.addEventListener('DOMContentLoaded', function(e) {
	            doc.body.style.fontSize = 12 * dpr + 'px';

	        }, false);
	    }
    
    	setFontSize();

	    flexible.dpr = win.dpr = dpr;
	    flexible.setFontSize = setFontSize;
	    flexible.rem2px = function(d) {
	        var val = parseFloat(d) * this.rem;
	        if (typeof d === 'string' && d.match(/rem$/)) {
	            val += 'px';
	        }
	        return val;
	    }
	    flexible.px2rem = function(d) {
	        var val = parseFloat(d) / this.rem;
	        if (typeof d === 'string' && d.match(/px$/)) {
	            val += 'rem';
	        }
	        return val;
	    }

}(window,window['tcf'] || (window['tcf'] = {})))
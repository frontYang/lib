/**
 * 日历控件 frontYang
 * @param input对象
 * @param {object} config 日历配置
 */
;function Calendar(target,config){
	if(!target){ return; }
	var yealSel = target.querySelector(".year"),
		monthSel = target.querySelector(".month"),
		daySel = target.querySelector(".day"),
		btnCancel = target.querySelector(".btn-cancel"),
		btnComfrim = target.querySelector(".btn-confirm");

	var date = document.getElementById("date"),	
		overlay = document.getElementById("Joverlay");

	var initConfig = {
		JyearSel: yealSel, //年份对象
		JmonthSel: monthSel, //月份对象
		JdaySel: daySel, //日期对象
		inputObj: date,
		btnCancel: btnCancel,
		btnComfrim: btnComfrim,
		overlay: overlay,		
		dateDefault: "1992/6/6",//默认日期
		startYear: "1966", //开始年份
		endYear: "1992", //结束年份
		indexY: 1, //默认
		indexM: 1, //默认
		indexD: 1 //默认
	};

	config = config || {};
	this.config = this.extend(config,initConfig, false);
	this.target = target;
	this.init();
};

Calendar.prototype  = {
	/*判断是否存在class*/
	hasCls: function(el, cls){
		return el.classList && el.classList.contains(cls) || !!el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	},

	/*添加class*/
	addCls: function(el, cls) {
	    el.classList ? el.classList.add(cls) : !this.hasCls(el, cls) && (el.className += (!el.className ? '' : ' ') + cls);
	},

	/*移除class*/
	rmCls: function(el, cls) {
	    el.classList ? el.classList.remove(cls) : this.hasCls(el, cls) && (el.className = el.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), ''));
	},

	/**
	 * 判断是否平年
	 * @param {number} year 年份
	 */
	IsPinYear: function(year){ 
		return (0 == year % 4 && (year % 100 !=0 || year % 400 == 0));
	},

	/**
	 * 获取相应li的innerHTML
	 * @param  {object} selObj 年份/月份/日期外层
	 * @param  {number} index  第几个li	 
	 */
	getSel: function(selObj,index){
		return selObj.getElementsByTagName("li")[index].innerHTML;
	},

	/**
	 * 获取ul对象
	 * @param  {object} ulObj 年份/月份/日期ul	 
	 */
	getSelUl: function(ulObj){
		if(!ulObj) return;
		return ulObj.getElementsByTagName("ul")[0];
	},

	/**
	 * 分割字符串，获取纯数字
	 * @param  {str} str 年份/月份/日期	 
	 */
	subStrSel: function(str){
		return str.substring(0, str.length - 1);
	},

	/**
	 * 判断日期，写入日期HTML
	 * @param  {object} _self this
	 * @param  {number} y     年份
	 * @param  {number} m     月份
	 * @param  {number} d     日期	 
	 */
	initDay: function(_self, y, m, d){
		if(m == 2){ //2月份
			if(_self.IsPinYear(y)) {
				_self.createDayHTML(_self, 28);
			}else{
				_self.createDayHTML(_self, 29);
			}
		}else if((m < 9 && m % 2 != 0 )|| (m >= 9 && m % 2 == 0 ) || m == 8){ //月大
			_self.createDayHTML(_self, 31);
		}else{ //月小
			_self.createDayHTML(_self, 30);
		}

		if (typeof window.dScroll != "undefined" && window.dScrollY){
			window.dScroll.scrollTo(0, window.dScrollY);
		}
	},

	/**
	 * 获取默认年份/月份/日期的位置
	 * @param  {object} _self this
	 * @param  {object} obj  年份/月份/日期外层对象 
	 * @param  {string} str  默认的年份/月份/日期	 
	 */
	getDefIndex: function(_self, obj, str){
		var index;
		var lis = obj.getElementsByTagName("li");
		for(var  i =0,len = lis.length; i < len; i++){
			if(_self.subStrSel(lis[i].innerHTML) == _self.subStrSel(str)){
				index = i;
			}
		}
		return index;
	},

	/**
	 * 判断天数，写入日期
	 * @param  {object} _self   this
	 * @param  {object} _config config
	 * @param  {object} def     默认年月日	 
	 */
	checkDay: function(_self, _config, def){
		var strY, strM, strD;
		var year, month, day;

		if(def){		
			strY = def.yDefault;
			strM = def.mDefault; 
			strD = def.dDefault;

			_config.indexY = _self.getDefIndex(_self, _config.JyearSel, strY),
			_config.indexM = _self.getDefIndex(_self, _config.JmonthSel, strM),
			_config.indexD = _self.getDefIndex(_self, _config.JdaySel, strD);	

			window.yScroll.scrollToElement(_config.JyearSel.querySelectorAll('li')[_config.indexY - 1],0);
			window.mScroll.scrollToElement(_config.JmonthSel.querySelectorAll('li')[_config.indexM - 1],0);
			window.dScroll.scrollToElement(_config.JdaySel.querySelectorAll('li')[_config.indexD - 1],0);

		}else{
			strY = _self.getSel(_config.JyearSel, _config.indexY);
			strM = _self.getSel(_config.JmonthSel, _config.indexM);
			strD = _self.getSel(_config.JdaySel, _config.indexD);
		}

		year = _self.subStrSel(strY);
		month = _self.subStrSel(strM);
		day = _self.subStrSel(strD);

	
		_config.inputObj.value = strY + '-' + strM + '-' +  strD; 
		_self.initDay(_self, year, month, day);
	},

	/**
	 * 年份HTML
	 * @param  {object} _self   this
	 * @param  {object} _config config	 
	 */
 	createYearHTML: function(_self, _config){
		var yearSel = _self.getSelUl(_config.JyearSel),
			html = "<li></li>";

		var date = new Date(), y, len;	
		if(!_config.endYear){
			y = date.getFullYear();
		}else{
			y = _config.endYear;
		}

		len = (y - _config.startYear) + 1;

		for(var i = 0; i < len; i++){
			html += '<li>'+ y +'年</li>';
			y = y - 1;
		}
		html += '<li></li>';
		yearSel.innerHTML = html;
	},

	/**
	 * 月份HTML
	 * @param  {object} _self   this
	 * @param  {object} _config config	 
	 */
	createtMonthHTML: function(_self, _config){
		var monthObj =  _self.getSelUl(_config.JmonthSel),
			html = "<li></li>";

		for(var i = 0; i < 12; i++){
			html += '<li>'+ (i + 1) +'月</li>';		
		}
		html += '<li></li>';
		monthObj.innerHTML = html;
	},

	/**
	 * 日期HTML
	 * @param  {object} _self   this
	 * @param  {object} _config config
	 * @param  {number} len     天数	 
	 */
	createDayHTML: function(_self, _config, len){
		if(!len){len = 31;}
		var dayObj = _self.getSelUl(_config.JdaySel),
			html = "<li></li>";

		if(!dayObj) {return;}

		for(var i = 0; i < len; i++){
			html += '<li>'+ (i + 1) +'日</li>';
		}
		html += '<li></li>';		
		dayObj.innerHTML = html;	
		if (typeof window.dScroll != "undefined"){
			window.dScrollY = dScroll.getComputedPosition().y;
		}
	},

	/**
	 * 实例化年份Iscroll
	 * @param  {object} _self   this
	 * @param  {object} _config config
	 */
	initScrollYear: function(_self, _config){
		//年份iscroll
		window.yScroll =  new IScroll(_config.JyearSel, {    	
	        scrollX: false,
	        snap:"li",	        
	        scrollY: true,
	        mouseWheel: true, // 允许鼠标滑轮滑动
	        preventDefault: false // 不让 iScroll 阻止默认行为
	        
	    });
		yScroll.on('scrollEnd', function(){
			_config.indexY = (this.y/40)*(-1) + 1;
		})
	},

	/**
	 * 实例化月份Iscroll
	 * @param  {object} _self   this
	 * @param  {object} _config config
	 */
	initScrollMonth: function(_self, _config){
		//月份iscroll
		window.mScroll =  new IScroll(_config.JmonthSel, {
	        scrollX: false,
	        snap:"li",
	        scrollY: true,
	        mouseWheel: true, // 允许鼠标滑轮滑动
	        preventDefault: false // 不让 iScroll 阻止默认行为
	        
	    });

	    mScroll.on('scrollEnd', function(){
			_config.indexM = (this.y/40)*(-1) + 1;
		})
	},

	/**
	 * 实例化日期Iscroll
	 * @param  {object} _self   this
	 * @param  {object} _config config
	 */
	initScrollDay: function(_self, _config){
		//日期iscroll
		window.dScroll =  new IScroll(_config.JdaySel, {
	        scrollX: false,
	        snap:"li",
	        scrollY: true,
	        mouseWheel: true, // 允许鼠标滑轮滑动
	        preventDefault: false // 不让 iScroll 阻止默认行为
	    });

	    dScroll.on('scrollEnd', function(){
			_config.indexD = (this.y/40)*(-1) + 1;	
		})
	},

	/**
	 * 关闭日历弹窗
	 * @param  {object} _self   this
	 * @param  {object} _config config
	 */
	closeCalendar: function(_self, _config){
		_self.addCls(_self.target ,"s-dn");
		_self.addCls(_config.overlay ,"s-dn");

	},

	/**
	 * 打开日历弹窗
	 * @param  {object} _self   this
	 * @param  {object} _config config
	 */
	popCalendar: function(_self, _config){
		_self.rmCls(_self.target,"s-dn");
		_self.rmCls(_config.overlay ,"s-dn");
	},

	// 运行
	init: function(){
		var _self = this;
		var _config = _self.config;
		// _self.createCalender();

		_self.popCalendar(_self, _config);

		//html结构
		_self.createYearHTML(_self, _config);
		_self.createtMonthHTML(_self, _config);
		_self.createDayHTML(_self, _config);

		//初始化iscroll
		_self.initScrollYear(_self, _config);
		_self.initScrollMonth(_self, _config);
		_self.initScrollDay(_self, _config);

		//将日期置入input
		if(_config.dateDefault){ //有默认日期
			if(_config.inputObj.value != ""){ //input无值
				var dateDefault = _config.inputObj.value;
				var dateArr = dateDefault.split('-');
				var def = {
					yDefault: _self.subStrSel(dateArr[0]) + '年',
					mDefault: _self.subStrSel(dateArr[1]) + '月',
					dDefault: _self.subStrSel(dateArr[2]) + '日'
				}
				_self.checkDay(_self, _config, def);
			}else{ //input有值
				var dateDefault = _config.dateDefault;
				var dateArr = dateDefault.split('/');
				var def = {
					yDefault: dateArr[0] + '年',
					mDefault: dateArr[1] + '月',
					dDefault: dateArr[2] + '日'
				}
				_self.checkDay(_self, _config, def);		
			}
			
		}else{//无默认日期
			if(_config.inputObj.value != ""){ //input无值
				var dateDefault = _config.inputObj.value;
				var dateArr = dateDefault.split('-');
				var def = {
					yDefault: _self.subStrSel(dateArr[0]) + '年',
					mDefault: _self.subStrSel(dateArr[1]) + '月',
					dDefault: _self.subStrSel(dateArr[2]) + '日'
				}
				_self.checkDay(_self, _config, def);
			}else{//input有值
				_self.checkDay(_self, _config);		
			}
			
		}

		//取消
		_config.btnCancel.addEventListener("click",function(){
			_self.closeCalendar(_self,_config);
		});

		//确定 将选定日期置入input
		_config.btnComfrim.addEventListener("click",function(){
			_self.checkDay(_self, _config);
			_self.closeCalendar(_self,_config);	
		});

		//点击遮罩层关闭
		_config.overlay.addEventListener("click",function(){
			_self.closeCalendar(_self,_config);
		});
	},

	// 对 json 对象进行更新扩展，会修改待更新扩展的对象，同时将其返回。
	extend: function(destination, source, override, replacer) {
		if (override === undefined) override = true;
		for (var property in source) {
			if (override || !(property in destination)) {
				if (replacer) replacer(property);
				else destination[property] = source[property];
			}
		}
		return destination;
	}
};

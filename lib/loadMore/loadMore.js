/**
 * 点击/滚动分页加载更多
 * CONFIG: {}, // 存放初始值
 * getData: function(){}, // 加载数据
 */
var loadMore = (function(){
    var pageNo = 1; //初始页码
    var isLoad = true; // 加载开关
    var loadMoreFn = {
        getId: function(id){
            return (typeof id == "object") ? id : document.getElementById(id);
        },

        getScroll: function(){ // 跨浏览器获取滚动条位置
            return {
                top: document.documentElement.scrollTop || document.body.scrollTop,
                left: document.documentElement.scrollLeft || document.body.scrollLeft,
            }
        },        
        getInner: function(){  // 跨浏览器获取视口大小
            if(typeof window.innerWidth != 'undefined'){
                return {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            }else { // 兼容ie8及ie8以下
                return {
                    width: document.documentElement.innerWidth,
                    height: document.documentElement.innerHeight
                }
            }
        },        
        addEvent: function(ele, type, handler){ //添加事件
            if(!ele) { return; }

            if(ele.addEventListener) {
                return ele.addEventListener(type, handler, false);
            }else if(ele.attachEvent){
                return ele.attachEvent('on' + type, handler);
            }else {
                ele['on' + type] = hander;
            }
        },        
        removeEvent: function(ele, type, handler){ //删除事件
            if(!ele) { return; }

            if(ele.removeEventListener) {
                return ele.removeEventListener(type, handler, false);
            }else if(ele.detachEvent) {
                return ele.detachEvent('on' + type, handler);
            }else {
                ele['on' + type] = null;
            }
        },
        scrollMoreFn: function(){
            var windowHeight = loadMoreFn.getInner().height; // 可视窗口高度
            var scrollTop = loadMoreFn.getScroll().top; // 获取滚动条的位置
            var scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight; // 文档高度
            if(scrollTop + windowHeight >= scrollHeight && isLoad){
                // 滚动到底部加载数据
                loadMore.getData(pageNo);
                isLoad = false;
            }
        },
        clickMoreFn: function(){
            loadMore.getData(pageNo);
        }
    };

    return {
        CONFIG: {}, // 存放初始值
        getData: function(){}, // 加载数据
        scrollMore: function(){ // 滚动加载更多
            loadMoreFn.removeEvent(window, "scroll", loadMoreFn.scrollMoreFn);
            loadMoreFn.addEvent(window, "scroll", loadMoreFn.scrollMoreFn);
        },
        clickMore: function(){ // 点击加载更多
            var loadBtn = loadMoreFn.getId(loadMore.CONFIG.loadId);
            if(!loadBtn) return;
            loadMoreFn.removeEvent(loadBtn, "click", loadMoreFn.clickMoreFn);
            loadMoreFn.addEvent(loadBtn, "click", loadMoreFn.clickMoreFn);
        }, 
        loadData: function(data, loadingCallback, loadedCallback){
            var pageTotal = data.pageTotal;
            if(pageNo > pageTotal){ // 没有更多数据了                
                loadedCallback && loadedCallback();
                return;
            } else{ // 加载中
                loadingCallback && loadingCallback();
                isLoad = true;
            }
        }
    };
}()); 
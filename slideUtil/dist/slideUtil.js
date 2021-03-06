'use strict';

var slideUtil = function () {
  var slidePic = $('#slidePic'),
      slideInner = slidePic.find('.slideInner'),
      tpl = '<a href="{linkUrl}" class="pic"><img src="{imgUrl}" alt=""></a>',
      slideItemWidth = 0,
      pageCur = PAGE_CONFIG.pageNo,
      // 当前页
  pageIndexNo = pageCur,
      pageTotal = PAGE_CONFIG.pageTotal,
      // 总页数
  prevIndex = pageCur - 1,
      // 记录上一页的起始页
  nextIndex = pageCur + 1,
      //记录下一页的起始页
  flgPrev = [],
      flgNext = [];

  // 避免重复请求
  flgPrev[prevIndex] = true;
  flgNext[nextIndex] = true;

  var slideFn = {
    getData: function getData(index, callback) {
      // 请求接口
      $.ajax({
        type: 'GET',
        url: PAGE_CONFIG.picSlideIntf,
        data: {
          pageNo: index
        },
        dataType: 'jsonp',
        jsonpCallback: 'cb_getPicData',
        success: function success(json) {
          var data = json.data;

          if (!data || data.length <= 0) return;

          callback && callback(data);
        }
      });
    },
    setWidth: function setWidth(obj) {
      // 设置宽度，并返回
      var width = $(obj).width();

      slideInner.css({
        'width': $(obj).length * width
      });
      return width;
    },
    accAdd: function accAdd(arg1, arg2) {
      // 加法，避免计算失误
      var r1 = void 0,
          r2 = void 0,
          m = void 0,
          c = void 0;
      try {
        r1 = arg1.toString().split(".")[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split(".")[1].length;
      } catch (e) {
        r2 = 0;
      }
      c = Math.abs(r1 - r2);
      m = Math.pow(10, Math.max(r1, r2));
      if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
          arg1 = Number(arg1.toString().replace(".", ""));
          arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
          arg1 = Number(arg1.toString().replace(".", "")) * cm;
          arg2 = Number(arg2.toString().replace(".", ""));
        }
      } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
      }
      return (arg1 + arg2) / m;
    },
    accSub: function accSub(arg1, arg2) {
      // 减法，避免计算失误
      var r1 = void 0,
          r2 = void 0,
          m = void 0,
          n = void 0;
      try {
        r1 = arg1.toString().split(".")[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split(".")[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      //last modify by deeka
      //动态控制精度长度
      n = r1 >= r2 ? r1 : r2;
      return ((arg1 * m - arg2 * m) / m).toFixed(n);
    },
    start: function start() {
      // 加载初始页
      var self = this;

      self.getData(pageCur, function (data) {
        var html = '<div class="slideItem"></div><div class="slideItem">';

        for (var i = 0, len = data.length; i < len; i++) {
          html += tpl.replace('{linkUrl}', data[i].linkUrl).replace('{imgUrl}', data[i].imgUrl);
        }

        html += '</div>';
        slideInner.html(html);

        // 设置轮播的宽度
        var slideItem = slidePic.find('.slideItem'),
            slideItemWidth = self.setWidth(slideItem);

        slideInner.css({
          'left': -slideItemWidth
        });

        // 设置当前页面高亮
        var curPic = slideInner.find('.slideItem').eq(1).find('.pic').eq(PAGE_CONFIG.curIndex);

        if (!curPic.hasClass('current')) curPic.addClass('current');
      });
    },
    toPrev: function toPrev() {
      //上一页
      var self = this,
          slidePrev = slidePic.find('.slidePrev');

      slidePrev.on('click', function (event) {

        if (pageIndexNo <= 1) {
          //如果是第一页，不往下执行
          return;
        }

        if (pageIndexNo > pageCur || prevIndex <= 0) {
          // 大于当前页码时，不加载数据，只执行位移
          var slideItem = slidePic.find('.slideItem'),
              _slideItemWidth = slideItem.width();

          var left = slideInner.css('left').replace(/px/, '');

          slideInner.animate({
            'left': self.accAdd(left, _slideItemWidth)
          }, 500);
          pageIndexNo--;
          return;
        }

        if (flgPrev[prevIndex]) {
          self.getData(prevIndex, function (data) {

            var html = '';

            for (var i = 0, len = data.length; i < len; i++) {
              html += tpl.replace('{linkUrl}', data[i].linkUrl).replace('{imgUrl}', data[i].imgUrl);
            }
            slideInner.find('.slideItem').eq(0).html(html);

            /**
             * 记录当前显示的item
             */
            prevIndex--;
            pageIndexNo--;

            // 设置轮播的宽度
            var slideItem = slidePic.find('.slideItem'),
                slideItemWidth = self.setWidth(slideItem);

            // 添加上一个空白div，设置偏移
            slideInner.animate({ "left": 0 }, 500, function () {
              slideInner.prepend('<div class="slideItem"></div>');

              var slideItem = slidePic.find('.slideItem'),
                  slideItemWidth = self.setWidth(slideItem);

              slideInner.css({
                'left': -slideItemWidth
              });

              flgPrev[prevIndex] = true;
            });

            flgPrev[prevIndex] = false;
          });
        }
      });
    },
    toNext: function toNext() {
      //下一页
      var self = this,
          slideNext = slidePic.find('.slideNext');

      slideNext.on('click', function (event) {

        if (pageIndexNo >= pageTotal) {
          // 大于最大页数，不往下执行
          return;
        }
        if (pageIndexNo < pageCur || nextIndex >= pageTotal + 1) {
          // 小于当前页码时，不加载数据，只执行位移
          var slideItem = slidePic.find('.slideItem'),
              _slideItemWidth2 = slideItem.width();

          var left = slideInner.css('left').replace(/px/, '');

          slideInner.animate({
            'left': self.accSub(left, _slideItemWidth2)
          }, 500);
          pageIndexNo++;
          return;
        }

        // 加载下一页
        if (flgNext[nextIndex]) {
          self.getData(nextIndex, function (data) {

            var html = '<div class="slideItem">';

            for (var i = 0, len = data.length; i < len; i++) {
              html += tpl.replace('{linkUrl}', data[i].linkUrl).replace('{imgUrl}', data[i].imgUrl);
            }

            html += '</div>';

            slideInner.append(html);
            nextIndex++;
            pageIndexNo++;

            // 设置轮播的宽度及偏移
            var slideItem = slidePic.find('.slideItem'),
                slideItemWidth = self.setWidth(slideItem),
                left = slideInner.css('left').replace(/px/, '');

            slideInner.animate({ "left": self.accSub(left, slideItemWidth) }, 500, function () {
              flgNext[nextIndex] = true;
            });
            flgNext[nextIndex] = false;
          });
        }
      });
    },
    init: function init() {
      // 初始化
      this.start();
      this.toPrev();
      this.toNext();
    }
  };

  return {
    init: function init() {
      slideFn.init();
    }
  };
}();

slideUtil.init();

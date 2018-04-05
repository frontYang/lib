
;(function(){
  const chartUtil = {
    /* 从小到大排序*/
    bubbleSort(arr){
      var i = arr.length, tempExchangVal, arr1 = [];
      for (let a = 0; a < arr.length; a++) {
        arr1[a] = arr[a]
      }
      while(i > 0){
        for(let j = 0; j < i - 1; j++){
          if(parseFloat(arr1[j]) > parseFloat(arr1[j + 1])){
            tempExchangVal = arr1[j];
            arr1[j] = arr1[j + 1];
            arr1[j + 1] = tempExchangVal;
          }
        }
        i--;
      }

      return arr1;
    },
    /* 绘制仪表图 */
    drawDashboard(opts){
      let canvas = document.getElementById(opts.id);
      if(!canvas) return;

      let ctx = canvas.getContext('2d'),
          data = opts.data,
          width = data.width * 2, // 宽
          height = data.height * 2, // 高
          lineWidth = data.lineWidth * 2, // 环宽度
          R = width / 2 - lineWidth / 2, // 半径
          otherHeight = width / 2 - height / 2, // 半圆多余的高度
          per = data.per, // 占比
          bgColor = '#e6f2fe', // 背景环颜色
          curStartColor = '#52bff9',
          curEndColor = '#0780e1',
          scaleColor = '#b8deee', // 刻度颜色
          ox = R + lineWidth / 2, // 圆心 X
          oy = height + lineWidth / 2 - otherHeight / 2; // 圆心 Y

      canvas.width = width;
      canvas.height = height;

      // 清除画布
      let clear = function(){
            ctx.clearRect(0, 0, width, height);
          },
          // 画底层圆弧
          drawArcBg = function(){
            ctx.beginPath();
            ctx.lineCap = 'round';
            ctx.arc(ox, oy, R, 0.8 * Math.PI, 0.2 * Math.PI);
            // ctx.arc(ox, oy, R, 1 * Math.PI, 0 * Math.PI);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = bgColor;
            ctx.stroke();
            ctx.closePath();
          },

          // 画高亮圆弧
          drawArcCur = function(){
            let rad = Math.PI / data.max;
            ctx.beginPath();
            ctx.arc(ox, oy, R, 0.8 * Math.PI, Math.PI + per * rad); // 计算结束点弧度
            // ctx.arc(ox, oy, R, 1 * Math.PI, Math.PI + per * rad); // 计算结束点弧度
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = curEndColor;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.closePath();
          },

          // 画刻度
          drawArcScale = function(){
            let scaleLen = 23, // 刻度数  ?? 只画了16个
                padding = lineWidth / 2 + 12 * 2 , // 距圆环距离
                R1 = (width / 2) - padding, // 半径
                smallWidth = 10, // 小刻度宽
                largeWidth = 20 // 大刻度宽

            for (let i = 1; i <= scaleLen * 2; i++) {
              ctx.beginPath();

              let rad =  Math.PI + Math.PI / scaleLen * (i - 1),
                  x1 = ox + Math.sin(rad) * R1,
                  y1 = oy - Math.cos(rad) * R1,
                  x2, y2;

              ctx.moveTo(x1, y1);

              if(i == 1 || i == scaleLen * 2) {
                ctx.strokeStyle = '#000';
              }else {
                ctx.strokeStyle = scaleColor;
              }

              ctx.lineWidth = 2;

              if(i % 2 == 0){ // 偶數 长刻度
                x2 = ox + Math.sin(rad) * (R1 - largeWidth);
                y2 = oy - Math.cos(rad) * (R1 - largeWidth);
              }else{ // 奇数 短刻度
                x2 = ox + Math.sin(rad) * (R1 - smallWidth);
                y2 = oy - Math.cos(rad) * (R1 - smallWidth);
              }

              ctx.lineTo(x2 , y2);
              ctx.stroke();
              ctx.closePath();
            }
          },

          // 填充文案
          fillText = function(){
            ctx.beginPath();
            ctx.font = 'bold 80px Microsoft Yahei';
            ctx.textAlign = 'center';
            ctx.fillText(data.cur, width / 2, height - 100);
            ctx.closePath();

            ctx.beginPath();
            ctx.font = '24px Microsoft Yahei';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#999';
            ctx.fillText(`满分${data.max}`, width / 2, height - 60);
            ctx.closePath();

            ctx.beginPath();

            let stateText = '', stateColor = '';
            if(data.state == 1){
              stateColor = '#f94e4e';
            }else if(data.state == 2){
              stateColor = '#ff8800';
            }else if(data.state == 3){
              stateColor = '#ffbb00';
            }else if(data.state == 4){
              stateColor = '#cccccc';
            }

            stateText = data.stateText;

            ctx.font = '36px Microsoft Yahei';
            ctx.textAlign = 'center';
            ctx.fillStyle = stateColor;
            ctx.fillText(stateText, width / 2, height - 15);
            ctx.closePath();
          },

          draw = function(){
            clear();
            drawArcBg();
            drawArcCur();
            drawArcScale();
            fillText();
          };

      draw();
    },

    /* 绘制圆环占比 */
    drawRound(opts){
      let canvas = document.getElementById(opts.id);
      if(!canvas) return;

      let ctx = canvas.getContext('2d'),
          data = opts.data,
          width = data.width * 2, // 宽
          height = data.height * 2, // 高
          lineWidth = data.lineWidth * 2, // 环宽度
          R = width / 2 - lineWidth / 2, // 半径
          per = data.per, // 占比
          bgColor = '#f4f4f8', // 背景环颜色
          curColor = '#3496e9',
          ox = width / 2, // 圆心 X
          oy = height / 2; // 圆心 Y

      canvas.width = width;
      canvas.height = height;

      // 清除画布
      let clear = function(){
            ctx.clearRect(0, 0, width, height);
          },
          // 画底层圆弧
          drawArcBg = function(){
            ctx.beginPath();
            ctx.lineCap = 'round';
            ctx.arc(ox, oy, R, 0, 2 * Math.PI);

            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = bgColor;
            ctx.stroke();
            ctx.closePath();
          },

          // 画高亮圆弧
          drawArcCur = function(){
            let rad = 2 * Math.PI / data.max;
            ctx.beginPath();
            ctx.arc(ox, oy, R, 1.5 * Math.PI, 1.5 * Math.PI + per * rad); // 计算结束点弧度
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = curColor;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.closePath();
          },

          // 填充文案
          fillText = function(){
            ctx.beginPath();
            ctx.font = '20px Microsoft Yahei';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#999';
            ctx.fillText(data.name, width / 2, height - 75);
            ctx.closePath();

            ctx.beginPath();

            let stateText = '', stateColor = '';
            if(data.state == 1){
              // stateText = '优秀';
              stateColor = '#f94e4e';
            }else if(data.state == 2){
              // stateText = '良好';
              stateColor = '#ff8800';
            }else if(data.state == 3){
              // stateText = '一般';
              stateColor = '#ffbb00';
            }else if(data.state == 4){
              // stateText = '较差';
              stateColor = '#cccccc';
            }

            stateText = data.stateText;

            ctx.font = '26px Microsoft Yahei';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#333';
            ctx.fillStyle = stateColor;
            ctx.fillText(stateText, width / 2, height - 35);
            ctx.closePath();
          },

          draw = function(){
            clear();
            drawArcBg();
            drawArcCur();
            fillText();
          };

      draw();
    },

    /* 绘制折线图 */
    drawLineChart(opts){
      let canvas = document.getElementById(opts.id)
      if(!canvas) return;

      let ctx = canvas.getContext('2d'),
          data = opts.data,
          width = data.width * 2,
          height = data.height * 2,
          xArr = [], yArr = [],
          yPerWidth = 82, // y轴文案宽度
          yWidth = width - yPerWidth, // y轴宽度
          yHeight = 60, // y轴间距
          xWidth = yWidth / data.xAxis.length, // 每个 x 宽度
          lineColor = '#007adf', // 折线颜色
          axisColor = '#eee' // 轴线颜色

      // 设置宽高
      canvas.width = width;
      canvas.height = height;

      ctx.font = '24px Microsoft Yahei';


      /**
       * 画圆点
       * @param  {object} ctx     canvas绘图环境
       * @param  {object} opt x,y起始点; r半径
       */
      let drawPoint = function(ctx, opt){
        ctx.arc(opt.x, opt.y, opt.r, 0, 2 * Math.PI, Math.PI, false);
        ctx.fillStyle = opt.color;
        ctx.fill();
        ctx.closePath();
      },

        /**
         * 画折线
         * @param  {object} ctx     canvas绘图环境
         * @param  {object} opt x0,y0起始点; x1,y1结束点
         */
        drawLine = function(ctx, opt){
          ctx.beginPath();
          ctx.moveTo(opt.x0, opt.y0);
          ctx.lineTo(opt.x1, opt.y1);
          ctx.strokeStyle = opt.color;
          ctx.stroke();
          ctx.closePath();
        },

        // 画X轴
        drawX = function(){
          ctx.beginPath();

          // 第一个刻度
          ctx.moveTo(yPerWidth, height - yHeight - 10);
          ctx.lineTo(yPerWidth, height - yHeight - 20);
          ctx.textAlign = 'center';
          ctx.lineWidth = 2;
          ctx.strokeStyle = axisColor;

          // 其余刻度
          for (let i = 0; i < data.xAxis.length; i++) {
            ctx.moveTo(yPerWidth + xWidth * (i + 1), height - yHeight - 10);
            ctx.lineTo(yPerWidth + xWidth * (i + 1), height - yHeight - 20);
            ctx.fillText(data.xAxis[i], xWidth * (i + 1) + 24, yHeight * data.yAxis.length + 24);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
          }
        },

        // 画Y轴
        drawY = function(){
          ctx.beginPath();
          for (let i = 0; i < data.yAxis.length; i++) {
            ctx.fillText(data.yAxis[i], 0, yHeight * (i + 1), yPerWidth);
            ctx.moveTo(yPerWidth, yHeight * (i + 1) - 8);
            ctx.lineTo(width, yHeight * (i + 1) - 8);
            ctx.lineWidth = 2;
            ctx.strokeStyle = axisColor;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
          }
        },

        drawCurLine = function(){
          let H = yHeight * 5;
          let R = 6;

          ctx.fillStyle = lineColor;
          ctx.moveTo(yPerWidth, yHeight);
          for (let i = 0; i < data.yData.length; i++) {
            let perH = data.yData[i].replace(/%/, '') / 100 * H

            ctx.beginPath();
            ctx.arc(xWidth * (i + 1) - R / 2, H - perH + yHeight - R, R, 0, 2 * Math.PI, false);
            ctx.fillStyle = lineColor;
            ctx.fill();
            if(i <= data.yData.length - 2){
              perH = data.yData[i + 1].replace(/%/, '') / 100 * H;
              ctx.lineTo(xWidth * (i + 2) - R / 2, H - perH + yHeight - R)
            }
            ctx.strokeStyle = lineColor;
            ctx.stroke();
            ctx.closePath();
          }
        },

        draw = function(){
          drawY();
          drawX();
          drawCurLine();
        }

      draw();
    },

    /* 绘制价格区间横向柱形图 */
    drawColumChartH(opts){
      let chartObj = document.getElementById(opts.id);

      if(!chartObj) return;

      // 提取数据
      let getData = function(){
        let data = opts.data,
            dataLen = data.length,
            XWidth = chartObj.querySelector('.J_xAxis').parentNode.offsetWidth,
            startXArr = [], endXArr =[], YArr = [], isCurArr = [];

        // 提取数据
        for (var i = 0; i < dataLen; i++) {
          startXArr.push(data[i].startX); // 最小值
          endXArr.push(data[i].endX); // 最大值
          YArr.push(data[i].Y); // 存放Y数据
          isCurArr.push(data[i].isCur); // 存放是否高亮
        }

        let sortEndArr = chartUtil.bubbleSort(endXArr),
            sortStartArr = chartUtil.bubbleSort(startXArr),
            minX = Math.floor(sortStartArr[0]), // X最小值
            maxX = Math.ceil(sortEndArr[sortEndArr.length - 1]), // X轴最大值
            increase = Math.ceil((maxX - minX) / (dataLen - 1)), // 每个区间相差值
            perX = XWidth / increase; // 每一份的宽度 return

        return {minX, maxX, increase, perX, isCurArr, endXArr, startXArr, YArr }
      }

      let axisData = getData();

      // 填入X轴
      let drawXData = function(){
        let JxAxis = chartObj.querySelectorAll('.J_xAxis');

        for (let i = 0; i < 5; i++) {
          if(i == 0){
            JxAxis[i].innerHTML = `${axisData.minX}万`;
          }else if(i == 4){
            JxAxis[i].innerHTML =  `${axisData.maxX}万`;
          }else{
            JxAxis[i].innerHTML = `${Math.ceil(axisData.minX + axisData.increase * i)}万`;
          }
        }
      }();

      // 填入Y轴,高亮当前车
      let drawYData = function(){
        let JyAxis = chartObj.querySelectorAll('.J_yAxis'),
            JperTxt = chartObj.querySelectorAll('.J_perTxt');

        for (let i = 0; i < JyAxis.length; i++) {
          let rowW = (axisData.endXArr[i] - axisData.startXArr[i]) * axisData.perX,
              rowLeft = (axisData.startXArr[i] - axisData.minX) * axisData.perX;

          JyAxis[i].innerHTML = axisData.YArr[i];

          JperTxt[i].innerHTML = `${axisData.startXArr[i]}-${axisData.endXArr[i]}万`;

          JperTxt[i].parentNode.style.width = rowW + 'px';
          JperTxt[i].parentNode.style.left = rowLeft + 'px';

          if(axisData.isCurArr[i] == 1)  JyAxis[i].parentNode.className = JyAxis[i].parentNode.className + ' current';
        }
      }()
    },
    /**
     * 绘制条形区间柱形图
     * @param  {object} opts 图表相关参数
     * opts = {
     *   id: chart's id,
     *   data: {
     *     num: 5, // 区间数
     *     curMin: 500, // 起始值
     *     curMax: 500, // 结束值
     *     min: 0, // 最小值
     *     max: 1000 // 最大值
     *   }
     * }
     */
    drawIntervalChart(opts){ // 养车费用
      let chartObj = document.getElementById(opts.id);

      if(chartObj.length <= 0) return;

      let data = opts.data,
          lineW = chartObj.querySelector('.price-line').offsetWidth / (data.num + 1),
          Jprice = chartObj.querySelectorAll('.J_price'),
          interval = Math.floor(data.max - data.min) / data.num;

      // 提取区间值
      let getData = function(){
        let arr = [];

        for (let i = 0; i < data.num; i++) {
          if(i > 0) arr.push(Math.floor(data.min + interval * i));
        }
        arr.push(data.max);

        return arr;
      }

      // 填入区间值
      let drawData = function(){
        let arr = getData();
        for (var i = 0; i < arr.length; i++) {
          Jprice[i].innerHTML = `${arr[i]}万`;
        }
      }();

      // 高亮 + 偏移
      let drawCurLine = function(){
        let curPriceLine = chartObj.querySelector('.price-line-cur'),
            Jline = chartObj.querySelectorAll('.J_line'),
            startX = lineW / interval * data.curMin,
            endX = lineW / interval * data.curMax,
            indexStart = Math.floor(startX / lineW),
            indexEnd = Math.ceil(endX / lineW);

        if(data.curMin == data.curMax){ // 车型页 圆点
          curPriceLine.style.left = `${startX}px`;
          curPriceLine.className = `${curPriceLine.className} pointPrice`;
        }else { // 车系页 一段高亮
          curPriceLine.style.left = `${startX}px`;
          curPriceLine.style.width = `${endX - startX}px`;
        }

        // 状态高亮
        for (var i = indexStart; i < indexEnd; i++) {
          Jline[i].className = `${Jline[i].className} current`;
        }
      }();

    }

  }

  window.chartUtil = chartUtil;
})();



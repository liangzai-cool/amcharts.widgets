$.widget('report.amChart', {
  options: {
    chartId: 'chart',
    chartDataProvider: null,
    chartCreditsPosition: 'top-left',
    depth3D: 2, //
    angle: 5,   //
    pathToImages: 'plugins/amcharts/amcharts/images/',
    path: 'plugins/amcharts/amcharts/images/',
    titles: [],
    legend: null
  },
  chartConfig: {},
  chart:null,
  _init:function(){
    var self = this;
    self.initChart();
  },
  initChart:function(){

  },
  initChartCommonConfig: function(){
    var self = this;
    self.chartConfig = self.chartConfig || {};
    self.chartConfig.dataProvider = self.options.chartDataProvider;
    self.chartConfig.language = 'cn';
    self.chartConfig.pathToImages = self.options.pathToImages
    self.chartConfig.path = self.options.path;
    self.chartConfig.creditsPosition = self.options.chartCreditsPosition; //水印位置
    self.chartConfig.depth3D = self.options.depth3D;
    self.chartConfig.angle = self.options.angle;
    if (self.options.legend) {
      self.chartConfig.legend = $.extend(true, {}, self.options.legend);
    } else {
      self.chartConfig.legend = null;
    }
  },
  validateNow: function(chartData) {
    var self = this;
    self.chart.dataProvider = chartData;
    self.chart.validateData();
  }
});

//堆积图(横向)
$.widget('report.stackedBarChart', $.report.amChart, {
  options: {
    legend: {
      horizontalGap: 10,
      maxColumns: 1,
      position: 'right',
      useGraphSettings: true,
      markerSize: 10
    }
  },
  initChart:function(){
    var self = this, dom = self.element;
    self.initChartCommonConfig();
    self.initChartConfig();
    self.updateGraphs();
    self.chart = AmCharts.makeChart(self.options.chartId, self.chartConfig);
  },
  initChartConfig:function(){
    var self = this;
    var config = {
      type: 'serial',
      theme: 'light',
      dataProvider: [],
      valueAxes: [{
        stackType: 'regular',
        axisAlpha: 0.5,
        gridAlpha: 0
      }],
      graphs: [],
      rotate: true,
      categoryField: 'date',
      categoryAxis: {
        gridPosition: 'start',
        axisAlpha: 0,
        gridAlpha: 0,
        position: 'left'
      },
      export: {
        enabled: true
      }
    };
    self.chartConfig = self.chartConfig || {};
    self.chartConfig = $.extend(true, config, self.chartConfig);
    return self.chartConfig;
  },
  updateGraphs:function(){
    var self = this;
    var dataProvider = self.chartConfig.dataProvider;
    var graphs = [];
    if(dataProvider && dataProvider.length){
      for (var key in dataProvider[0]) {
        if (key === self.chartConfig.categoryField) {
          continue;
        }
        graphs[graphs.length] = {
          balloonText: '<b>[[title]]</b><br><span style="font-size:14px">[[category]]: <b>[[value]]</b></span>',
          fillAlphas: 0.8,
          // labelText: '[[value]]',
          lineAlpha: 0.3,
          title: key,
          type: 'column',
          color: '#000000',
          valueField: key
        };
      }
    }
    self.chartConfig.graphs = graphs;
  }
});

//堆积图(纵向)
$.widget('report.stackedColumnChart', $.report.amChart, {
  options: {
    columnGraphs:[],
    categoryField:'date',
    categoryAxis: {},
    legend: {
      autoMargins: false,
      borderAlpha: 0.2,
      equalWidths: false,
      horizontalGap: 10,
      markerSize: 10,
      useGraphSettings: true,
      valueAlign: 'left',
      valueWidth: 0
    },
    valueAxes:[]
  },
  initChart:function(){
    var self = this;
    var dom = self.element;
    self.initChartCommonConfig();
    self.initChartConfig();
    self.createValueAxes();
    self.createColumnGraphs();
    self.createLineGraphs();
    self.chart = AmCharts.makeChart(self.options.chartId, self.chartConfig);
  },
  initChartConfig:function(){
    var self = this;
    var config = {
      type: 'serial',
      theme: 'light',
      addClassNames: true,
      titles: self.options.titles,
      startDuration: 1,
      dataProvider: [],
      valueAxes: [],
      graphs: [],
      chartScrollbar: {},
      chartCursor: {
        cursorPosition: 'mouse'
      },
      balloon: {
        fadeOutDuration: 1 //气泡消失时间
      },
      categoryField: self.options.categoryField,
      categoryAxis: $.extend(true, {
        gridPosition: 'start',
        axisAlpha: 0,
        tickLength: 0,
        parseDates: true,     //转换日期
        axisColor: '#0000AA',
        minorGridEnabled: true
        // title: '日期'
      }, self.options.categoryAxis),
      export: true    //    'export': AmCharts.exportCFG
    };
    self.chartConfig = self.chartConfig || {};
    self.chartConfig = $.extend(true, config, self.chartConfig);
    return self.chartConfig;
  },
  createValueAxes: function(){
    var self = this;
    var valueAxes = self.options.valueAxes || [];
    for (var i in valueAxes) {
      valueAxes[i] = $.extend(true, {
          position: 'left',
          integersOnly: true,
          axisColor: '#0000AA',
          axisThickness: 2,
          gridAlpha: 0,
          axisAlpha: 1
      }, valueAxes[i]);
    }
    self.chartConfig.valueAxes = self.chartConfig.valueAxes || [];
    self.chartConfig.valueAxes = self.chartConfig.valueAxes.concat(valueAxes);//合并graphs
  },
  createColumnGraphs: function(){
    var self = this;
    var columnGraphs = self.options.columnGraphs || [];
    for (var i in columnGraphs) {
      columnGraphs[i] = $.extend(true, 
        {
          balloonText: '[[title]]: <b>[[value]]</b>',
          fillAlphas: 0.8,
          lineAlpha: 0.3,
          title: '',
          type: 'column',
          hideBulletsCount: 1        //大于等于1个的都隐藏，即全部隐藏
          // labelText: '[[value]]'
        },
      columnGraphs[i]);
    }
    self.chartConfig.graphs = self.chartConfig.graphs || [];
    self.chartConfig.graphs = self.chartConfig.graphs.concat(columnGraphs);//合并graphs
  },
  createLineGraphs: function(){
    var self = this;
    var lineGraphs = self.options.lineGraphs || [];
    for (i in lineGraphs) {
      lineGraphs[i] = $.extend(true, 
        {
          lineColor: 'red',
          bullet: 'triangleUp',
          balloonText: '<b>[[title]]</b><br><span style="font-size:14px">[[category]]: <b>[[value]]</b></span>',
          //hideBulletsCount | Number | 0 
          //| If there are more data points than hideBulletsCount, 
          //the bullets will not be shown. 0 means the bullets will always be visible.
          type: 'smoothedLine',
          hideBulletsCount: 30,
          lineThickness: 3,
          title: '',
          valueField: ''
        },
      lineGraphs[i]);
    }
    self.chartConfig.graphs = self.chartConfig.graphs || [];
    self.chartConfig.graphs = self.chartConfig.graphs.concat(lineGraphs);//合并graphs
  }
});

//折线图
$.widget('report.multipleValueAxesChart', $.report.amChart, {
  options: {
    graphs:[],
    categoryField:'date',
    categoryAxis: {},
    valueAxes:[],
    legend: {
      useGraphSettings: true,
      useMarkerColorForValues: true
    }
  },
  initChart:function(){
    var self = this;
    var dom = self.element;
    self.initChartCommonConfig();
    self.initChartConfig();
    self.createValueAxes();
    self.createLineGraphs();
    self.chart = AmCharts.makeChart(self.options.chartId, self.chartConfig);
  },
  initChartConfig:function(){
    var self = this;
    var config = {
      type: 'serial',
      theme: 'light',
      //startDuration: 1.5,
      valueAxes: [],
      graphs: [],
      chartScrollbar: {},
      chartCursor: {
        cursorPosition: 'mouse'
      },
      categoryField: self.options.categoryField,
      categoryAxis: $.extend(true, {
        parseDates: true,
        axisColor: '#0000AA',
        minorGridEnabled: true
        // title: '日期'
      }, self.options.categoryAxis),
      balloon: {
        fadeOutDuration: 1 //气泡消失时间
      },
      export: true   //    'export': AmCharts.exportCFG   this shows how externally included config file can be used

    };
    self.chartConfig = self.chartConfig || {};
    self.chartConfig = $.extend(true, config, self.chartConfig);
    return self.chartConfig;
  },
  createValueAxes: function(){
    var self = this;
    var valueAxes = self.options.valueAxes || [];
    for (var i in valueAxes) {
      valueAxes[i] = $.extend(true, 
        {
          id:'v1',
          axisColor: '#0000AA',
          axisThickness: 2,
          gridAlpha: 0,
          axisAlpha: 1,
          position: 'left',
          integersOnly: true
        },
      valueAxes[i])
    }
    self.chartConfig.valueAxes = valueAxes;
  },
  createLineGraphs: function(){
    var self = this;
    var lineGraphs = self.options.lineGraphs || [];
    for (var i in lineGraphs) {
      lineGraphs[i] = $.extend(true, 
        {
          lineColor: '#0000AA',
          bullet: 'round',
          balloonText: '[[title]]：<b>[[value]]</b>',
          type: 'smoothedLine',//smoothedLine： 平滑的线条, candlestick:柱体
          hideBulletsCount: 30,
          lineThickness: 3
        },
      lineGraphs[i]);
    }
    self.chartConfig.graphs = lineGraphs;
  }
});

//柱状图(集合)
$.widget('report.clusteredBarChart', $.report.amChart, {
  options: {
    columnGraphs:[],
    valueField:'date',
    categoryAxis: {},
    valueAxes:[],
    legend: {
      autoMargins: false,
      borderAlpha: 0.2,
      equalWidths: false,
      horizontalGap: 10,
      markerSize: 10,
      useGraphSettings: true,
      valueAlign: 'left',
      valueWidth: 0
    }
  },
  initChart:function(){
    var self = this;
    var dom = self.element;

    self.initChartCommonConfig();
    self.initChartConfig();
    self.createValueAxes();
    self.createColumnGraphs();
    self.createLineGraphs();
    self.chart = AmCharts.makeChart(self.options.chartId, self.chartConfig);
  },
  initChartConfig:function(){
    var self = this;
    var config = {
      type: 'serial',
      theme: 'light',
      startDuration: 1,
      categoryField: self.options.categoryField,
      categoryAxis: $.extend(true, {
        gridPosition: 'start',
        position: 'bottom'
      }, self.options.categoryAxis),
      trendLines: [],
      graphs: [],
      guides: [],
      valueAxes: [],
      allLabels: [],
      balloon: {
        fadeOutDuration: 1 //气泡消失时间
      },
      titles: [],
      dataProvider: [],
      export: true

    };
    self.chartConfig = self.chartConfig || {};
    self.chartConfig = $.extend(true, config, self.chartConfig);
    return self.chartConfig;
  },
  createValueAxes: function(){
    var self = this;
    var valueAxes = self.options.valueAxes || [];
    for (var i in valueAxes) {
      valueAxes[i] = $.extend(true, 
        {
          position: 'left',
          axisColor: '#0000AA',
          integersOnly: true,
          axisThickness: 2,
          gridAlpha: 0,
          axisAlpha: 1
        },
      valueAxes[i]);
    }
    self.chartConfig.valueAxes = self.chartConfig.valueAxes || [];
    self.chartConfig.valueAxes = self.chartConfig.valueAxes.concat(valueAxes);//合并graphs
  },
  createColumnGraphs: function(){
    var self = this;
    var columnGraphs = self.options.columnGraphs || [];
    for (var i in columnGraphs) {
      columnGraphs[i] = $.extend(true, 
        {
          balloonText: '[[category]]<br>[[title]]: <b>[[value]]</b>',
          fillAlphas: 0.8,
          lineAlpha: 0.2,
          title: '',
          type: 'column',
          // labelText: '[[value]]',    //[[value]], [[description]], [[percents]], [[open]], [[category]].
          valueField: ''
        },
      columnGraphs[i]);
    }
    self.chartConfig.graphs = self.chartConfig.graphs || [];
    self.chartConfig.graphs = self.chartConfig.graphs.concat(columnGraphs);//合并graphs
  },
  createLineGraphs: function(){
    var self = this;
    var lineGraphs = self.options.lineGraphs || [];
    for (i in lineGraphs) {
      lineGraphs[i] = $.extend(true, 
        {
          lineColor: 'red',
          bullet: 'triangleUp',
          balloonText: '<b>[[title]]</b><br><span style="font-size:14px">[[category]]: <b>[[value]]</b></span>',
          //hideBulletsCount | Number | 0 
          //| If there are more data points than hideBulletsCount, 
          //the bullets will not be shown. 0 means the bullets will always be visible.
          type: 'smoothedLine',
          hideBulletsCount: 30,
          lineThickness: 3,
          title: '',
          valueField: ''
        },
      lineGraphs[i]);
    }
    self.chartConfig.graphs = self.chartConfig.graphs || [];
    self.chartConfig.graphs = self.chartConfig.graphs.concat(lineGraphs);//合并graphs
  }
});

//饼状图
$.widget('report.pieChart', $.report.amChart, {
  options: {
    titleField: 'title',
    valueField: 'value',
    innerRadius: '50%',      //空心部分半径
    minRadius: null,
    legend:{
      position: 'right',
      marginRight: 100,
      autoMargins: false
    }
  },
  initChart:function(){
    var self = this;
    var dom = self.element;

    self.initChartCommonConfig();
    self.initChartConfig();
    self.chart = AmCharts.makeChart(self.options.chartId, self.chartConfig);
  },
  initChartConfig:function(){
    var self = this;
    var config = {
      type: 'pie',
      titles: self.options.titles,
      startDuration: 0,
      theme: 'light',
      addClassNames: true,
      innerRadius: '30%',
      defs: {
        filter: [{
          id: 'shadow',
          width: '200%',
          height: '200%',
          feOffset: {
            result: 'offOut',
            in: 'SourceAlpha',
            dx: 0,
            dy: 0
          },
          feGaussianBlur: {
            result: 'blurOut',
            in: 'offOut',
            stdDeviation: 5
          },
          feBlend: {
            in: 'SourceGraphic',
            in2: 'blurOut',
            mode: 'normal'
          }
        }]
      },
      innerRadius: self.options.innerRadius,
      minRadius: self.options.minRadius,
      valueField: self.options.valueField,
      titleField: self.options.titleField,
      export: {
        enabled: true
      }
    };
    self.chartConfig = self.chartConfig || {};
    self.chartConfig = $.extend(true, config, self.chartConfig);
    return self.chartConfig;
  }
});
var map;						
var baseLayer;

var currLayerId;

var peopleMap = {};
var currPeopleGraphic;

var layerListPanel,tablePanel,chartPanel,lengedPanel;


require(
    [ 	"esri/map", 
      	"esri/layers/ArcGISDynamicMapServiceLayer",
		"esri/layers/ImageParameters", 
		"esri/layers/GraphicsLayer", 
		"esri/tasks/query",
		"esri/tasks/QueryTask", 
		"esri/dijit/Scalebar",
		"esri/dijit/Popup",
		"esri/dijit/HomeButton",
		"esri/dijit/OverviewMap",
		"esri/symbols/SimpleFillSymbol",
		"esri/graphic", 
		"dojo/dom",
		"dojo/dom-attr", 
		"dojo/domReady!",
		],
	function(esriBasemaps) {
    	esri.config.defaults.io.corsDetection=false;
    	initMap(esriBasemaps);
    	initEvent();
	    
});


function initMap(esriBasemaps){
	
	
	var popup = new esri.dijit.Popup({
		anchor : "left",
		fillSymbol: new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
					new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
					new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]))
   }, dojo.create("div"));
	
	map = new esri.Map("mapDiv", {
		infoWindow : popup
	});
	baseLayer = new esri.layers.ArcGISDynamicMapServiceLayer(
			arcgis_url);
	map.addLayer(baseLayer);
	
    var scalebar=new esri.dijit.Scalebar({
    	  map:map,
    	  attachTo:"bottom-left",
    	  scalebarUnit: "metric"
    	});
    
    var home = new esri.dijit.HomeButton({
		map: map
	}, "homeButton");
	home.startup();
    
	var overviewMap = new esri.dijit.OverviewMap({
		map: map,
		visible: false,			 // 初始化可见，默认为false  
		attachTo: "bottom-right",   // 默认右上角  
		width: 250,				 // 默认值是地图高度的 1/4th  
		height: 150,			 // 默认值是地图高度的 1/4th   
		opacity: 0.5,            // 透明度 默认0.5  
		maximizeButton: true,    // 最大化,最小化按钮，默认false  
		expandFactor: 2,         //概览地图和总览图上显示的程度矩形的大小之间的比例。默认值是2，这意味着概览地图将至少是两倍的大小的程度矩形。  
		color: "#000000"         // 默认颜色为#000000  
	});
	overviewMap.startup();
	
//	var imageMeasureTool = new esri.toolbars.ImageServiceMeasureTool({
//		  map: map,
//		  layer: new ArcGISImageServiceLayer()
//		});
	
	
	if($(window).width()>=800){	
		var panel = buildLayerListPanel();
		panel.toolitem = $("#toolbar-item-layers");
		$("#toolbar-item-layers")[0].panel = panel;
		$("#toolbar-item-layers").addClass("toolbar-item-selected");
		panel.option.onclosed=function(){$(panel.toolitem).removeClass("toolbar-item-selected")};

	}
	
}


function initEvent(){
	
    map.on("click",function(){
    	map.infoWindow.hide();
    	if (currPeopleGraphic) {
    		map.graphics.remove(currPeopleGraphic);
    	}
    });
    
    
	$(".toolbar-item").click(function() {
		var show = !$(this).hasClass("toolbar-item-selected");
		var panel = null;
		if(show){
			if(this.id=="toolbar-item-layers"){
				panel = buildLayerListPanel();
			}else if(this.id=="toolbar-item-chart"){
				panel = buildChartPanel();
				
			}else if(this.id=="toolbar-item-list"){
				panel = buildTablePanel();
			
			}else if(this.id=="toolbar-item-lenged"){
				panel = buildLengedPanel();
			}
			panel.toolitem = this;
			this.panel = panel;
			$(this).addClass("toolbar-item-selected");
			panel.option.onclosed=function(){$(panel.toolitem).removeClass("toolbar-item-selected")};
			
		}else{
			$(this).removeClass("toolbar-item-selected");
			this.panel.close();
		}
		

		
		
	});
	
}

function popup(id) {
	var people = peopleMap[id];
	var point = people.geometry;
	var attr = people.attributes;



	if (currPeopleGraphic) {
		map.graphics.remove(currPeopleGraphic);
	}
	var picSymbol = new esri.symbol.PictureMarkerSymbol(
			"imgs/people.png",
			28, 28);
    var graphic = new esri.Graphic(point, picSymbol);
	map.graphics.add(graphic);
	graphic.show();

	
	map.infoWindow.hide();
	map.infoWindow.setTitle("贫困户信息");
	map.infoWindow.setContent("姓名："+attr.name+"<br/>贫困原因："+attr.CausesName+" "+attr.SecendCaus+"<br/>所在镇："+attr.town+"<br/>所在村："+attr.cun+"<br/>");
	map.infoWindow.show(point);
	
	currPeopleGraphic = graphic;
	map.centerAt(point);
//	 map.centerAndZoom(point,10);

}


function buildLayerListPanel(){
	
	layerListPanel = $.jsPanel({
		headerTitle : '专题图',
		position : {
			my : 'right-top', /* 'left-top' for example 6a */
			at : 'right-top', /* 'left-top' for example 6a */
			offsetY : 50,
			offsetX : -10
		},
		theme : "#485566",
		show: "jsPanelFadeIn",
		contentSize : "300 auto",
		headerControls : {
			controls : 'closeonly',
		},
		content : function() {
			var str = '<div style="padding:5px"><div>'


			for (var i = 0; i < layerInfoList.length; i++) {
				var l = layerInfoList[i];
				str += '<div style="padding-left:0px;margin-top:5px"><label class="layer-check-label"><input name="'
						+ l.name + '" id="'+l.id
						+ '" class="layer-check" type="checkbox"/>' 
						+ l.name + '</label></div>';

			}
			str +=  '</div>';

			return str;

		},

		callback : function(panel) {
			$(".layer-check", this.content).click(function() {
				var layerId = null;
				if (this.checked) {
					layerId = this.id;
					var vLayers = [0,21,this.id];
					baseLayer.setVisibleLayers(vLayers);  
						
				} else {
					var vLayers = [0,1,2,9,10,21,22];
					baseLayer.setVisibleLayers(vLayers); 
					layerId = null;
				}
				var self = this;
				$(".layer-check").each(function() {
					if (self != this) {
						$(this).removeAttr("checked");
					}
				})
				
				currLayerId = layerId;
				EventBus.dispatch("showZtLayer",null, layerId);
			})

			
		}
	});
	return layerListPanel;
}

function buildTablePanel(){
	
	tablePanel = $
	.jsPanel({
		headerTitle : '贫困户查询',
		position : {
			my : 'right-top', /* 'left-top' for example 6a */
			at : 'right-top', /* 'left-top' for example 6a */
			offsetY : 60,
			offsetX : -20
		},
		theme : "#485566",
		show: "jsPanelFadeIn",
		contentSize : "480 auto", 
		headerControls : {
			controls:"closeonly"
		},
		// content : "<iframe style='height:310px;width:630px'
		// src='pkh_list.jsp?title=陵水黎族自治县'>",
		content : '<div style="padding:5px"><table style="width:100%" id="peopleTable" class="row-border compact hover" >'
				+ '<thead>'
				+ '	<tr>'
				+ '		<th>姓名</th>'
				+ '		<th>贫困原因</th>'
				+ '		<th>所在村镇</th>'
				+ '	</tr>'
				+ '</thead>'
				+ '</table><div>'
	});
	
	
	//列表数据
	var queryTask = new esri.tasks.QueryTask(
			arcgis_url+"/6");
	var query = new esri.tasks.Query();
	query.where = "1=1";
	// 需要返回的字段
	query.outFields = [ "Id", "name", "CausesName", "SecendCaus",
			"dwdm", "town", "cun" ];
	query.returnGeometry = true;
	queryTask.execute(query, function(fset) {
		var graphicArr = fset.features;
		var dataSet = [];
		for ( var i in graphicArr) {
			var point = graphicArr[i].geometry;
			var a = graphicArr[i].attributes;
			peopleMap[a.Id] = graphicArr[i];
			dataSet[dataSet.length] = [
					"<a style='cursor:pointer' onclick=popup('" + a.Id
							+ "')>" + a.name + "</a>", a.CausesName,
					a.town+" "+ a.cun ];
		}

		// var dataSet = [
		// ['Trident','Internet Explorer 4.0','Win 95+','4','X'],
		// ['Trident','Internet Explorer 5.0','Win 95+','5','C']
		// ];
		$('#peopleTable').DataTable(
				{
					"lengthMenu" : [ [ 10, 20 ],
							[ 10, 20] ],
					"data" : dataSet,
				});

	});
	
	return tablePanel;
	
}

function buildChartPanel(){
	chartPanel = $.jsPanel({
		headerTitle : '报表',
		position : {
			my : 'right-top', /* 'left-top' for example 6a */
			at : 'right-top', /* 'left-top' for example 6a */
			offsetY : 70,
			offsetX : -30
		},

		theme : "#485566",
		show: "jsPanelFadeIn",
		headerControls : {
			controls:"closeonly"
		},
		contentSize : "340 395",
		content:function(){
			return "<div id='chartDiv' style='padding:5px;min-width:330px'><div>";
		},
		callback:function(){
			this.updateChartListener = function(scope,layerId){
				this.updateChart(layerId);
			},
			this.updateChart = function(layerId){
				if(!layerId){
					$("#chartDiv").html("请选择专题图");
					return;
					
				}
				var countField = layerInfoMap[layerId].countField;
				var queryTask = new esri.tasks.QueryTask(
						arcgis_url+"/12");
				var query = new esri.tasks.Query();
				query.where = "1=1";
				
				query.outFields = [ countField, "XZMC"];
				query.returnGeometry = false;
				queryTask.execute(query, function(fset) {	
					var graphicArr = fset.features;
					var dataSet = [];
					var str =layerInfoMap[layerId].name+"<br/>";
					var xzmcList = [];
					var countList = [];
					for ( var i in graphicArr) {
						var a = graphicArr[i].attributes;
						var xzmc = a["XZMC"];
						var count = a[countField];
						
						xzmcList[i] = xzmc;
						countList[i] = count;
					}
		
					
					$("#chartDiv").highcharts({
						chart: {
				            type: 'column'
				        },
				        title: {
				            text: layerInfoMap[layerId].name
				        },
				        xAxis: {
				            categories: xzmcList,
				            title: {
				                text: ''
				            }
				        },
				        yAxis: {
				        	min: 0,
				            title: {
				                text: ''
				            }
				        },
				        tooltip: {
				            formatter:function(){return this.y+' 人'}
				            
				        },
				        legend: {
			 	           enabled:false
			 	        },
			 	        credits: {
			 	            enabled: false
			 	        },
				        series: [{
				            name: '',
				            data: countList
				        }]
					});
					
				});
			}
			
			this.updateChart(currLayerId);
			EventBus.addEventListener("showZtLayer", this.updateChartListener,this);
		},
		onbeforeclose:function(){
			EventBus.removeEventListener("showZtLayer", this.updateChartListener,this);
			return true;
			
		}
	});
	
	return chartPanel;
}

function buildLengedPanel(){
	lengedPanel = $.jsPanel({
		headerTitle : '图例',
		position :"left-center 21 100",
		contentSize : "120 auto",
		theme : "#485566",
		show: "jsPanelFadeIn",
		headerControls : {
			controls : 'closeonly',
		},
		content :"<img id='lengedImg' src='imgs/lenged/null.png'/>",
		
		callback:function(){
			this.updateLengedListener = function(scope,layerId){
				this.updateLenged(layerId);
			},
			this.updateLenged = function(layerId){
				if(layerId){
					$("#lengedImg").attr("src","imgs/lenged/"+layerInfoMap[layerId].name+".png");
				}else{
					$("#lengedImg").attr("src","imgs/lenged/null.png");
				}
				
			}
			
			this.updateLenged(currLayerId);
			EventBus.addEventListener("showZtLayer", this.updateLengedListener,this);
		},
		
		onbeforeclose:function(){
			EventBus.removeEventListener("showZtLayer", this.updateLengedListener,this);
			return true;
			
		}
	});
	
	return lengedPanel;
	
}



	
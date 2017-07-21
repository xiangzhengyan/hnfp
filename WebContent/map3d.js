var map;		
var view;
var baseLayer;

var currLayerId;
var curr3dLayer;

var peopleMap = {};
var currPeopleGraphic;

var layerListPanel,tablePanel,chartPanel,legendPanel;


require(
[ "esri/Map", 
  "esri/views/SceneView", 
  "esri/layers/FeatureLayer",
  "esri/layers/MapImageLayer",
  "esri/layers/GraphicsLayer", 
  "esri/Graphic",
  "esri/renderers/SimpleRenderer",
  "esri/symbols/PolygonSymbol3D",
  "esri/symbols/ExtrudeSymbol3DLayer",
  "esri/symbols/PointSymbol3D",
  "esri/symbols/IconSymbol3DLayer",
  "esri/symbols/ObjectSymbol3DLayer",
  "esri/symbols/PictureMarkerSymbol",
  "esri/tasks/QueryTask",
  "esri/tasks/support/Query",
  "esri/widgets/Legend",
  "esri/widgets/Home",
  "esri/widgets/LayerList",
  "esri/config",
  "dojo/domReady!",
  ],main

);

function main(Map, SceneView, FeatureLayer,MapImageLayer,GraphicsLayer, Graphic,SimpleRenderer, 
		PolygonSymbol3D,ExtrudeSymbol3DLayer,PointSymbol3D,IconSymbol3DLayer,ObjectSymbol3DLayer,
		PictureMarkerSymbol,QueryTask, Query, Legend,Home,LayerList,esriConfig) {
	
this.init = function(){
	
	esriConfig.request.proxyUrl = "proxy.jsp";
	
	
	
	baseLayer = MapImageLayer(arcgis_url);
	
	
	curr3dLayer = build3dLayer(11,"count","贫困人口数量");
	curr3dLayer.visible = false;

	var graphicsLayer = new GraphicsLayer({

		
	});

	map = new Map({
		basemap : "streets",
		layers : [ baseLayer,curr3dLayer,graphicsLayer ]
	});
	map.graphicsLayer=graphicsLayer;

	view = new SceneView({
		container : "mapDiv",
		map : map,
		camera : {
//			position : {
//				latitude : 18.24237,
//				longitude : -88.72943,
//				z : 1534560
//			},
			tilt : 45,
//			heading : 10
			}
	});



	if($(window).width()>=800){	//PC
		var panel = buildLayerListPanel();
		panel.toolitem = $("#toolbar-item-layers");
		$("#toolbar-item-layers")[0].panel = panel;
		$("#toolbar-item-layers").addClass("toolbar-item-selected");
		panel.option.onclosed=function(){$(panel.toolitem).removeClass("toolbar-item-selected")};
		
		var panel = buildLegendPanel();
		panel.toolitem = $("#toolbar-item-lenged");
		$("#toolbar-item-lenged")[0].panel = panel;
		$("#toolbar-item-lenged").addClass("toolbar-item-selected");
		panel.option.onclosed=function(){$(panel.toolitem).removeClass("toolbar-item-selected")};
	}

	
	var homeWidget = new Home({
		  view: view
	});
	view.ui.add(homeWidget, "top-left");
	
	
	curr3dLayer.then(function() {
		view.goTo(curr3dLayer.fullExtent);
	});
	
	 view.then(function() {
//	        var layerList = new LayerList({
//	          view: view
//	        });
//	        view.ui.add(layerList, "top-right");
	});
	
	initEvent();
}

 this.initEvent = function(){
//	    map.on("click",function(){
//	    	map.infoWindow.hide();
//	    	if (currPeopleGraphic) {
//	    		map.graphicsLayer.graphics.remove(currPeopleGraphic);
//	    	}
//	    });
    
    
	$(".toolbar-item").click(function() {
		var show = !$(this).hasClass("toolbar-item-selected");
		var panel = null;
		if(show){
			if(this.id=="toolbar-item-layers"){
				buildLayerListPanel();
				panel = layerListPanel;
			}else if(this.id=="toolbar-item-chart"){
				buildChartPanel(QueryTask,Query);
				panel = chartPanel;
				
			}else if(this.id=="toolbar-item-list"){
				buildTablePanel(QueryTask,Query);
				panel = tablePanel;
			
			}else if(this.id=="toolbar-item-lenged"){
				buildLegendPanel(Legend);
				panel = legendPanel;
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

this.build3dLayer = function(id,field,name){
	
	var maxValue = 150;
	var mulSize = 80
	if(id=="11"){
		maxValue = 1000;
		mulSize = 8;
	}
	
	var renderer = new SimpleRenderer({
		symbol : new PolygonSymbol3D({
			symbolLayers : [ new ExtrudeSymbol3DLayer()]
		}),
		visualVariables : [ {
			type : "size",
			field : field,
			stops : [ {
				value : 0,
				size : 50,
				label : "0"
			}, {
				value : maxValue,
				size : maxValue*mulSize,
				label : ">"+maxValue
			} ]

		}, {
			// "#FFFF99","#CCFFCC","#CCCCFF","#6699FF","#0066FF","#0066CC"
			type : "color",
			field : field,
			legendOptions : {
				title : name
			},
			stops : [ {
				value : 0,
				color : [51,153,0,0.9],
				label : "0"
			}, {
				value : maxValue,
				color : [255,133,102,0.9],
				label : ">"+maxValue
			} ]
		} ],

	});

	 var layer = new FeatureLayer(
	 {
		url : arcgis_url+"/"+id,
		renderer : renderer,

		outFields : [ "*" ],
//		popupTemplate : {
//			title : "{XZMC}",
//			content : name+"：{"+field+"}"
//		},
		
		definitionExpression : "1=1",
		visible:"false"
		
	});
	 
	 return layer;
	
}


 this.buildLayerListPanel= function(){
	
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
				
			str+="<div class='layer-split'>2D</div>"

			for (var i = 0; i < layerInfoList.length; i++) {
				var l = layerInfoList[i];
				str += '<div class="layer-check-item"><label class="layer-check-label"><input name="'
						+ l.name + '" id="'+l.id
						+ '" class="layer-check" type="checkbox"/>' 
						+ l.name + '</label></div>';

			}
			str+="<div class='layer-split'>3D</div>"
			
			for (var i = 0; i < layerInfoList.length; i++) {
				var l = layerInfoList[i];
				str += '<div class="layer-check-item"><label class="layer-check-label"><input name="'
						+ l.name + '" id="'+l.id
						+ '" class="layer-check 3d-layer-check" type="checkbox"/>' 
						+ l.name + '</label></div>';

			}
			
			str +=  '</div>';

			return str;

		},

		callback : function(panel) {
			$(".layer-check", this.content).click(function() {
				var layerId = null;
				if(currLayerId){
					baseLayer.findSublayerById(parseInt(currLayerId)).visible = false;
				}
				if(curr3dLayer){
					map.layers.remove(curr3dLayer);
				}
				if (this.checked) {
					layerId = this.id;
					
					baseLayer.findSublayerById(parseInt(2)).visible = false;
					baseLayer.findSublayerById(parseInt(9)).visible = false;
					baseLayer.findSublayerById(parseInt(10)).visible = false;
					baseLayer.findSublayerById(parseInt(22)).visible = false;
					
					if($(this).hasClass("3d-layer-check")){
						//3d
						var layerInfo = layerInfoMap[layerId];
						curr3dLayer=build3dLayer(layerId, layerInfo.countField, layerInfo.name);
						map.layers.add(curr3dLayer);
					}else{
						//2d
						 
						baseLayer.findSublayerById(parseInt(layerId)).visible = true;
					}
						
				} else {
					baseLayer.findSublayerById(parseInt(2)).visible = true;
					baseLayer.findSublayerById(parseInt(9)).visible = true;
					baseLayer.findSublayerById(parseInt(10)).visible = true;
					baseLayer.findSublayerById(parseInt(22)).visible = true;
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
 
this.buildTablePanel = function(){
		
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
		var queryTask = new QueryTask({url:arcgis_url+"/6"});
		var query = new Query({
			returnGeometry : true,
			outFields : [ "Id", "name", "CausesName", "SecendCaus",
			  			"dwdm", "town", "cun" ]
		});
		query.where="1=1";
		queryTask.execute(query).then(function(fset) {
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


 this.buildChartPanel = function(){
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
				
				
				var queryTask = new QueryTask({url:arcgis_url+"/12"});
				var query = new Query({
					returnGeometry: false,
			        outFields: [ countField, "XZMC"]
				});
				query.where = "1=1";
				queryTask.execute(query).then(function(fset) {
					
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

this.buildLegendPanel = function(){
	if(!legendPanel){
		legendPanel = $.jsPanel({
			headerTitle : '图例',
			position :"left-top 15 288",
			contentSize : "auto auto",
			theme : "#485566",
			show: "jsPanelFadeIn",
			headerControls : {
				controls : 'closeonly',
			},
			content :"<div id='legendPanel' style='min-height:300px;max-height:350px;width:180px;overflow-x:hidden;margin:5px'></div>",
			
			callback:function(){
				var legend = new Legend({
					view : view,
					container:"legendPanel"
				});
			},
			
			onbeforeclose:function(){
				this.hide();
				return false;
				
			}
			
		});
	}else{
		legendPanel.show();
	}
	
	
	return legendPanel;
	
}

this.popup = function (id) {
	var people = peopleMap[id];
	var point = people.geometry;
	var attr = people.attributes;

	

	if (currPeopleGraphic) {
		map.graphicsLayer.remove(currPeopleGraphic);
	}
	
	var picSymbol = new PictureMarkerSymbol(
			"imgs/people.png",
			28, 28);
    var graphic = new Graphic(point, picSymbol);
	map.graphicsLayer.graphics.add(graphic);

//	var pointSymbol3D = new PointSymbol3D({
//	    symbolLayers: [new IconSymbol3DLayer({
//	        size: 10, 
//	        material: {
//	            color: [255, 85, 0, 0.8]
//	        }
//	    })]
//	});
//    var graphic = new Graphic(point, pointSymbol3D);
//	map.graphicsLayer.graphics.add(graphic); 
	
	view.popup.open({
	  title: attr.name,
	  location: point,
	  content:"贫困原因："+attr.CausesName+" "+attr.SecendCaus+"<br/>所在镇："+attr.town+"<br/>所在村："+attr.cun+"<br/>",
	});
	

	currPeopleGraphic = graphic;
	view.goTo(point);
//	 map.centerAndZoom(point,10);

}
 

init();

}//main









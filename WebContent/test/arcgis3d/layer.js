require(
		[ "esri/Map", "esri/views/SceneView", "esri/layers/FeatureLayer",
		  "esri/layers/MapImageLayer",
				"esri/renderers/SimpleRenderer",
				"esri/symbols/PolygonSymbol3D",
				"esri/symbols/ExtrudeSymbol3DLayer", "esri/widgets/Legend",
				"dojo/domReady!" ],
		function(Map, SceneView, FeatureLayer,MapImageLayer, SimpleRenderer, PolygonSymbol3D,
				ExtrudeSymbol3DLayer, Legend) {

			var renderer = new SimpleRenderer({
				symbol : new PolygonSymbol3D({
					symbolLayers : [ new ExtrudeSymbol3DLayer() ]
				}),
				visualVariables : [ {
					type : "size",
					field : "count",
					stops : [ {
						value : 100,
						size : 1000,
						label : "<100"
					}, {
						value : 1000,
						size : 10000,
						label : ">1000"
					} ]

				}, {
					// "#FFFF99","#CCFFCC","#CCCCFF","#6699FF","#0066FF","#0066CC"
					type : "color",
					field : "count",
					legendOptions : {
						title : "贫困人口数量"
					},
					stops : [ {
						value : 100,
						color : "#E0FF66",
						label : "<100"
					}, {
						value : 1000,
						color : "#FF8566",
						label : ">1000"
					} ]
				} ],

			});

			var povLyr = new FeatureLayer(
					{
						url : "http://192.168.2.110:6080/arcgis/rest/services/hainan_hope/cunbianjie22/MapServer/8",
						renderer : renderer,

						outFields : [ "*" ],
						popupTemplate : {
							title : "{XZMC}",
							content : "贫困人口数量：{count}"
						},

						definitionExpression : "1=1"
					});
			
			var baseLayer = MapImageLayer(
					"http://192.168.2.110:6080/arcgis/rest/services/hainan_hope/cunbianjie22/MapServer");
//			map.addLayer(baseLayer);

			var map = new Map({
				basemap : "streets",
				layers : [ baseLayer ]
			});

			var view = new SceneView({
				container : "viewDiv",
				map : map,
				camera : {
					position : {
						latitude : 18.24237,
						longitude : -88.72943,
						z : 1534560
					},
					tilt : 45,
					heading : 10
				}
			});

			var legend = new Legend({
				view : view
			});

			view.ui.add(legend, "bottom-right");

			baseLayer.then(function() {
				view.goTo(baseLayer.fullExtent);
			});

		});
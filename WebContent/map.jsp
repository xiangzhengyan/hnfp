<%@page import="java.util.Date"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<meta name="viewport"
	content="initial-scale=1, maximum-scale=1,user-scalable=no">
<title>海南扶贫</title>


<script type="text/javascript">
	var arcgis_url = "http://125.208.30.158:6080/arcgis/rest/services/lingshui/MapServer";
</script>


<link rel="stylesheet" href="resource/font-awesomer-4.4.0/css/font-awesome.min.css" />

<script src="resource/jquery-2.2.0.min.js"></script>

<script src="resource/EventBus.js"></script>

<!-- 
<link rel="stylesheet"
	href="resource/jquery-ui/jquery-ui-1.12.1.min.css" />
<script type="text/javascript"
	src="resource/jquery-ui/jquery-ui-1.12.1.min.js"></script>
 -->

<link rel="stylesheet" href="resource/jspanel/jquery.jspanel.min.css" />
<script src="resource/jspanel/jquery.jspanel-compiled.js"></script>

<link rel="stylesheet" href="resource/jquery-datatable/css/jquery.dataTables.css">
<script src="resource/jquery-datatable/js/jquery.dataTables.js"></script>

<script src="resource/chart/highcharts.js"></script>

<!-- 
<link rel="stylesheet" href="http://192.168.2.201:8080/hnfp/arcgis_js_api/3.17compact/esri/css/esri.css" />
<script src="http://192.168.2.201:8080/hnfp/arcgis_js_api/3.17compact/init.js"></script>
 -->
<link rel="stylesheet" href="https://js.arcgis.com/3.20/esri/css/esri.css">
<script src="https://js.arcgis.com/3.20/"></script>



<link rel="stylesheet" href="map.css?time=<%=System.currentTimeMillis() %>" />
<script src="map-config.js?time=<%=System.currentTimeMillis() %>"></script>
<script src="map.js?time=<%=System.currentTimeMillis() %>"></script>

</head>
<body>

	<div id="header" class="header">
		<div class="logo">
			<img src="imgs/app-logo.png"
				style="height: 30px; margin-top: 5px; cursor: default;" />
		</div>


		<div class="title">海南扶贫</div>
		
		<div class="subtitle" >Powered
			by www.asiacom-online.com</div>
		




		<div id="toolbar-item-chart" class="toolbar-item" title="报表" style="margin-right:10px">
			<img src="imgs/icon-chart.png">
		</div>
		
		<div id="toolbar-item-list" class="toolbar-item" title="贫困户查询" >
			<img src="imgs/icon-list.png">
		</div>
		
				<div id="toolbar-item-lenged" class="toolbar-item" title="图例" >
			<img src="imgs/icon-lenged.png">
		</div>
		
		<div id="toolbar-item-layers" class="toolbar-item" title="专题图">
			<img src="imgs/icon-layers.png">
		</div>


	</div>

	<div id="mapDiv">
	</div>
	
	<div id="homeButtonDiv" style="position:absolute;top:128px;left:20px"><div id="homeButton"></div></div>

	<script>
	
		function resizeHeight() {
			$("#mapDiv")[0].style.height = (window.parent.window.document.body.scrollHeight - 40)
					+ "px";
		}

		$(window).resize(function() {
			setTimeout(function() {
				resizeHeight();
			}, 1);

		});

		resizeHeight();
	</script>
</body>
</html>

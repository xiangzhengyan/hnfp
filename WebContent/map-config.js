
layerInfoList = [

{
	name : "贫困人口分布",
	id : 11
	,countField:"count"
},
              {
	name : "因学",
	id : 12
	,countField:"yinxue"
}, {
	name : "因残",
	id : 13,countField:"yincan" 
}, {
	name : "因病",
	id : 14,countField:"yinbing"
}, {
	name : "缺劳动力",
	id : 15,countField:"quelaoli" 
}, {
	name : "缺土地",
	id : 16,countField:"quetudi"
}, {
	name : "缺技术",
	id : 17,countField:"quejishu" 
}, {
	name : "缺水",
	id : 18,countField:"queshui" 
}, {
	name : "缺资金",
	id : 19,countField:"quezijin"
}, {
	name : "自身发展动力不足",
	id : 20,countField:"zishen"
} ];


layerInfoMap = {};
for (var i = 0; i < layerInfoList.length; i++) {
	var layer = layerInfoList[i];
	layerInfoMap[layer.id] = layer;
}
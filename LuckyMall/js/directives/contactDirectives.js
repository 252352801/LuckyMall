angular.module('LuckyMall')
    /*banner*/
    .directive('locationMap', function () {
        return {
            link: function (scope, element, attrs) {
                //创建和初始化地图函数：
                function initMap(){
                    createMap();//创建地图
                    setMapEvent();//设置地图事件
                    addMapControl();//向地图添加控件
                    addMapOverlay();//向地图添加覆盖物
                }
                function createMap(){
                    map = new BMap.Map("map");
                    map.centerAndZoom(new BMap.Point(113.3883004,23.10479),16);
                }
                function setMapEvent(){
                    map.enableScrollWheelZoom();
                    map.enableKeyboard();
                    map.enableDragging();
                    map.enableDoubleClickZoom()
                }
                function addClickHandler(target,window){
                    target.addEventListener("click",function(){
                        target.openInfoWindow(window);
                    });
                }
                function addMapOverlay(){
                    var markers = [
                        {content:"<h3>广州幸云至商电子商务有限公司</h3>广州市海珠区新港东路琶洲蟠龙新街3号1902室（距万胜围地铁站D出口200米）",title:"",imageOffset: {width:-46,height:-21},position:{lat:23.104788,lng:113.388284}},
                    ];
                    for(var index = 0; index < markers.length; index++ ){
                        var point = new BMap.Point(markers[index].position.lng,markers[index].position.lat);
                        var marker = new BMap.Marker(point,{icon:new BMap.Icon("http://api.map.baidu.com/lbsapi/createmap/images/icon.png",new BMap.Size(20,25),{
                            imageOffset: new BMap.Size(markers[index].imageOffset.width,markers[index].imageOffset.height)
                        })});
                        var label = new BMap.Label(markers[index].title,{offset: new BMap.Size(25,5)});
                        var opts = {
                            width: 200,
                            title: markers[index].title,
                            enableMessage: false
                        };
                        var infoWindow = new BMap.InfoWindow(markers[index].content,opts);
                        map.openInfoWindow(infoWindow, map.getCenter());

                        marker.setLabel(label);
                        addClickHandler(marker,infoWindow);
                        map.addOverlay(marker);
                    };
                    var plOpts = [
                        {strokeColor:"#f0f",strokeWeight:"1",strokeOpacity:"0.4"}
                    ];
                    var plPath = [
                        [
                            new BMap.Point(113.391073,23.104618),
                            new BMap.Point(113.390907,23.104211),
                            new BMap.Point(113.388594,23.104244),
                            new BMap.Point(113.388351,23.104871),
                            new BMap.Point(113.388266,23.104855),
                            new BMap.Point(113.388266,23.104855),
                            new BMap.Point(113.388266,23.104855)
                        ],
                    ];
                    for(var index = 0; index < plOpts.length; index++){
                        var polyline = new BMap.Polyline(plPath[index],plOpts[index]);
                        map.addOverlay(polyline);
                    }
                }
                //向地图添加控件
                function addMapControl(){
                    //向地图中添加比例尺控件
                    var scaleControl = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
                    scaleControl.setUnit(BMAP_UNIT_METRIC);
                    map.addControl(scaleControl);
                    //向地图中添加缩放控件
                    var navControl = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_RIGHT,type:1});
                    map.addControl(navControl);
                    //向地图中添加缩略图控件
                    var overviewControl = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:true});
                    map.addControl(overviewControl);
                }
                var map;
                initMap();
            }
        }
    })
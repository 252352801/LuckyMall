angular.module('LuckyMall')
    /*banner*/

    .directive('bannerCss3',function ($timeout){
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var change_time=4000;//切换时间
                scope.banner_index = 0;
                if(attrs.bannerCss3) {
                    var bannerWatch=scope.$watch(attrs.bannerCss3, function (new_val,old_val) {
                        if(new_val) {
                            start(new_val.length);
                            bannerWatch();
                        }
                    });
                }
                function start(val) {
                    var len = val;
                    run();
                    function run() {
                        element.timer=setTimeout(function(){
                            if(scope.banner_index<len-1) {
                                $timeout(function(){scope.banner_index++});
                            }else{
                                $timeout(function(){scope.banner_index=0});
                            }
                            run();
                        },change_time)
                    }
                    scope.prevBanner=function(){
                        if(scope.banner_index>0) {
                            scope.banner_index--;
                        }else{
                            scope.banner_index = len-1;
                        }
                    };
                    scope.nextBanner=function(){
                        if(scope.banner_index<len-1) {
                            scope.banner_index++;
                        }else{
                            scope.banner_index = 0;
                        }
                    };
                    scope.showBanner=function(index){
                        scope.banner_index = index;
                    };


                    element.bind('mouseenter',function(e){
                        clearTimeout(element.timer);
                    });
                    element.bind('mouseleave',function(e){
                        clearTimeout(element.timer);
                        start(val);
                    });
                }
            }
        }
    })





    .directive('banner', function () {
        return {
            restrict:'A',
            controller:function($scope,$timeout){
                $scope.banner_index=0;
                function startBanner(param){
                    var obj=param.element;
                    var ul=document.getElementById("banner_ul");
                    var li=ul.getElementsByTagName("li");
                    var count=li.length;
                    var bar_index=getByClass('banner-index',obj)[0];//索引按钮
                    var lock=true;
                    var rep_speed=200;//切换一次所需时间
                    var rep_timeout=3000;//切换一次间隔时间
                    li[ $scope.banner_index].style.opacity='1';
                    changeSelf($scope.banner_index,$scope.banner_index+1);
                    function gradualChange(hide_index,show_index,callback){
                       try { //万恶的IE，真想“踹”你
                           tweenMultiFixAnimate({
                               obj: [
                                   {
                                       element: li[hide_index],
                                       object: [
                                           {
                                               attr: 'opacity',//需要改变的属性
                                               value: -1,//改变的值 可以为正负
                                               moveName: 'Linear',//动画名，默认为Linear
                                               moveType: 'easeIn'//动画的缓动方式，默认为easeIn
                                           }
                                       ]
                                   },
                                   {
                                       element: li[show_index],
                                       object: [
                                           {
                                               attr: 'opacity',//需要改变的属性
                                               value: 1,//改变的值 可以为正负
                                               moveName: 'Linear',//动画名，默认为Linear
                                               moveType: 'easeIn'//动画的缓动方式，默认为easeIn
                                           }
                                       ]
                                   }
                               ],
                               time: rep_speed,//执行动画的时间
                               callback: callback
                           });
                       }catch (err){

                       }
                    }
                    function changeSelf(h_index,s_index) {
                        if(obj.timer){
                            clearInterval(obj.timer);
                            lock=true;
                        }
                        if(lock==false){
                            return;
                        }
                        lock=false;
                        if(s_index>count-1){
                            h_index=count-1;
                            s_index=0;
                        }
                        obj.timer=setTimeout(function(){
                            gradualChange(h_index,s_index,function(){
                                changeSelf(s_index,s_index+1);
                                $timeout(function(){
                                    $scope.banner_index=s_index;
                                    lock=true;
                                },5);
                            });
                        },rep_timeout);
                    }

                    obj.addEventListener('mouseover',function(){clearInterval(obj.timer);lock=true;});
                    obj.addEventListener('mouseout',function(){changeSelf($scope.banner_index,$scope.banner_index+1);});

                    bar_index.onclick=function(e){
                        if(lock==false){
                            return;
                        }
                        lock=false;
                        var e=e|| window.event;
                        var target= e.target|| e.srcElement;
                        if(target.nodeName=='A'){
                                var clk_index=parseInt(target.getAttribute("data-index"));
                                if(clk_index!=$scope.banner_index) {
                                    gradualChange($scope.banner_index, clk_index, function () {
                                        $timeout(function () {
                                            $scope.banner_index = clk_index;
                                            lock = true;
                                        }, 5);
                                    });
                                }
                        }
                    };
                    getById('prev_banner').onclick=function(){
                        if(lock==false){
                            return;
                        }
                        lock=false;
                        if($scope.banner_index>0) {
                            gradualChange($scope.banner_index, $scope.banner_index - 1, function () {
                                $timeout(function () {
                                    $scope.banner_index--;
                                    lock=true;
                                }, 5);
                            });
                        }else{
                            gradualChange($scope.banner_index,count-1, function () {
                                $timeout(function () {
                                    $scope.banner_index=count-1;
                                    lock=true;
                                }, 5);
                            });
                        }
                    };
                    getById('next_banner').onclick=function(){
                        if(lock==false){
                            return;
                        }
                        lock=false;
                        if($scope.banner_index<count-1) {
                            gradualChange($scope.banner_index, $scope.banner_index + 1, function () {
                                $timeout(function () {
                                    $scope.banner_index++;
                                    lock=true;
                                }, 5);

                            });
                        }else{
                            gradualChange($scope.banner_index, 0, function () {
                                $timeout(function () {
                                    $scope.banner_index=0;
                                    lock=true;
                                }, 5);
                            });
                        }
                    };

                }
                $scope.$on('bannerReady',function(){
                    $timeout(function(){
                        startBanner({
                            element:getById("banner")
                        });
                    },1);
                });
            },
            link:function(scope,element,attrs){
            }
        };
    })

    .directive('grid',function() {
        return {
            templateUrl: 'common/templates/grid.html?v='+v,
            restrict: 'E',
            replace: true,
            //scope:{
            //    data_grid:'='
            //},
            link: function(scope, element, attrs) {
                // scope.data_grid=init(angular.fromJson(attrs['griddata']));
                scope.w=1100;//$(element).context.parentElement.clientWidth;
                function init(obj){
                    if(obj) {
                        for (var o in obj) {
                            if(obj[o].mode!=undefined&&obj[o].link!=undefined){
                                switch (obj[o].mode){
                                    case 0:
                                        obj[o].href='/list/category='+obj[o].link+'/0/';//设置楼成链接
                                        break;
                                }
                            }
                            for (var i in obj[o].items) {
                                var r = [];
                                for(var n=0;n<obj[o].items[i].row;n++){
                                    for(var m=0;m<obj[o].items[i].col;m++){
                                        r.push({
                                            location:{x:m,y:n},
                                            isSelected: false
                                        });
                                    }
                                }
                                obj[o].items[i].baseGrid = r;

                                for(var j in obj[o].items[i].grids){
                                    switch(obj[o].items[i].grids[j].mode){
                                        case 0:
                                            obj[o].items[i].grids[j].href='/list/category='+obj[o].items[i].grids[j].link+'/0/';
                                            break;
                                        case 1:
                                            obj[o].items[i].grids[j].href='/brand/'+obj[o].items[i].grids[j].link;
                                            break;
                                        case 2:
                                            obj[o].items[i].grids[j].href='/item/'+obj[o].items[i].grids[j].link;
                                            break;
                                    }
                                }
                                obj[o].items[i].height=(scope.w/obj[o].items[i].col)*obj[o].items[i].row;//设置高度



                                obj[o].items[i].isAllBrands=true;//假设全是品牌
                                for(var _index in obj[o].items[i].grids){
                                    if(obj[o].items[i].grids[_index].mode!=1){
                                        obj[o].items[i].isAllBrands=false;
                                    }
                                }
                            }
                        }
                    }
                    try {
                        var ad_count = obj.length >= 5 ? 5 : obj.length;
                        var ad_arr = [];
                        for (var i = 1; i < ad_count + 1; i++) {
                            ad_arr.push(i);
                        }
                        for (var i = 0; i < ad_arr.length; i++) {
                            var rand = parseInt(Math.random() * ad_count + 1);
                            var temp = ad_arr[i];
                            ad_arr[i] = ad_arr[rand];
                            ad_arr[rand] = temp;
                        }
                        for (var i = 0; i < ad_arr.length; i++) {
                            obj[i].ad = ad_arr[i];
                        }
                    }catch (err){

                    }
                    return obj;
                };
                scope.$watch(attrs['griddata'],function(n_val,o_val){
                    if(n_val!=o_val){
                        scope.data_grid=init(n_val);
                    }
                });

            }
        }
    })


    .directive('floorNav',function($timeout) {
        return {
            restrict: 'A',
            link: function (scope,element,attrs) {
                var floor_top=[];//楼层top
                var win_h=window.screen.availHeight;
               scope.$watch(attrs.len,function(new_val,old_val){
                    if(new_val!=old_val){
                        init(new_val);
                    }
                });
                function init(length){
                    element.css('margin-top',-length*40/2+'px');
                    window.addEventListener('scroll',function(){
                        var scroll_top;
                        if (document.documentElement.scrollTop) {
                            scroll_top = document.documentElement.scrollTop;
                        } else {
                            scroll_top = document.body.scrollTop;
                        }
                        if(scroll_top>=650){
                            $timeout(function(){
                                scope.showFloorNav=true;
                            });
                        }else{
                            $timeout(function(){
                                scope.showFloorNav=false;
                            });
                        }
                        if(floor_top.length==0&&document.getElementById("floor"+(length-1))!=null) {
                            for (var i = 0; i < length; i++) {
                                var f_top = getPosition(document.getElementById("floor" + i));
                                floor_top.push(f_top.top);
                            }
                            setCurrentFloor(scroll_top);
                        }else{
                           setCurrentFloor(scroll_top);
                        }

                    });
                    function setCurrentFloor(scroll_top){//设置当前楼层 scroll_top:浏览器滚动高度
                        for(var o in floor_top){
                            if(scroll_top>=floor_top[o]-win_h/2){
                                scope.cur_floor=o;
                            }
                        }
                    }
                    scope.scrollTo=function(target_id){
                        var t=document.getElementById(target_id);//目标元素
                        var t_top=getPosition(t).top;
                        var obj;
                        if (document.documentElement.scrollTop) {
                            obj= document.documentElement;
                        } else {
                            obj = document.body;
                        }
                        var scroll_top=obj.scrollTop;
                        var change_val=t_top-scroll_top;
                        tweenMove({
                            element: obj,
                            attr: 'scrollTop',//需要改变的属性
                            value: change_val,//改变的值 可以为正负
                            time: 300,//执行动画的时间
                            moveName: 'Quadratic',//动画名，默认为Linear
                            moveType: 'easeOut',//动画的缓动方式，默认为easeIn
                            callback:function(){

                            }
                        });
                    };

                }
            }
        };
    })
    .directive('sooSlider',function($timeout) {
        return {
            restrict: 'A',


            link: function (scope, element, attrs) {

                var c_t=3000;//切换时间
                scope.data_slider=scope.data_soo;
                run();

                function run(){
                    var lock=false;//锁
                    var index=0;
                    var elem=element[0];
                    var len=scope.data_slider.length*2;
                    var per_w=1100;
                    element.slider =setTimeout(function(){
                        slide(-1,true);
                    },c_t);
                    function slide(d,isInfinite){//d 方向   1向右  -1向左   isInfinite是否无限滚
                        if(lock){
                            return;
                        }
                        if (index >= len / 2&&d==-1) {
                            index = 0;
                            elem.style.left = '0px';
                        } else if (index <= 0&&d==1) {
                            index=len/2;
                            elem.style.left = -len/2*per_w+'px';

                        }
                        lock = true;
                        tweenMove({
                            element: element[0],
                            attr: 'left',
                            value: per_w * d,
                            time: 250,
                            moveName: 'Quadratic',
                            moveType: 'easeOut',
                            callback: function () {
                                lock = false;
                                index -= d;
                                if(isInfinite) {
                                    element.slider = setTimeout(function () {
                                        slide(-1,true);
                                    }, c_t);
                                }
                            }
                        });
                    }
                    element.parent().bind('mouseenter',function(){
                        clearTimeout(element.slider);
                    });
                    element.parent().bind('mouseleave',function(){
                        clearTimeout(element.slider);
                        element.slider =setTimeout(function(){
                            slide(-1,true);
                        },c_t);
                    });
                    scope.prev=function(){
                        if(!lock) {
                            clearTimeout(element.slider);
                            slide(1,false);
                        }
                    };
                    scope.next=function(){
                        if(!lock) {
                            clearTimeout(element.slider);
                            slide(-1,false);
                        }
                    };
                }
            }
        };
    })
    .directive('fsSlider',function($timeout) {
        return {
            restrict: 'A',

            link: function (scope, element, attrs) {
               /* var watcher=scope.$watch(attrs.fsSlider,function(new_val,old_val){
                    console.log("&&");
                        if(new_val!=old_val){
                            console.log("&&1");
                            run(new_val);
                            watcher();
                        }
                });*/
                var c_t=3000;//切换时间
                $timeout(function(){

                },c_t);
                run(scope.data_fs);
                function run(data){
                    var lock=false;//锁
                    var index=0;
                    var elem=element[0];
                    var len=data.length*2;
                    var per_w=220;
                    element.slider =setTimeout(function(){
                        slide(-1,true);
                    },c_t);
                    function slide(d,isInfinite) {//d 方向   1向右  -1向左   isInfinite是否无限滚
                        if (lock) {
                            return;
                        }else{
                            if (index >= len / 2&&d==-1) {
                                index = 0;
                                elem.style.left = '0px';
                            } else if (index <= 0&&d==1) {
                                index=len/2;
                                elem.style.left = -len/2*per_w+'px';

                            }
                            lock = true;
                            tweenMove({
                                element:elem,
                                attr: 'left',
                                value: per_w * d,
                                time: 180,
                                moveName: 'Linear',
                                moveType: 'easeOut',
                                callback: function () {
                                    lock = false;
                                    index -= d;
                                    if(isInfinite) {
                                        element.slider = setTimeout(function () {
                                            slide(-1,true);
                                        }, c_t);
                                    }
                                }
                            });
                        }
                    }
                    element.parent().bind('mouseenter',function(){
                        clearTimeout(element.slider);
                    });
                    element.parent().bind('mouseleave',function(){
                        clearTimeout(element.slider);
                        element.slider =setTimeout(function(){
                            slide(-1,true);
                        },c_t);
                    });

                };

            }
        }
    })



angular.module('LuckyMall')
    /*banner*/

    .directive('bannerCss3',function ($timeout){
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var change_time=3000;//切换时间
                scope.banner_index = 0;
                if(attrs.bannerLength) {
                    scope.$watch(attrs.bannerLength, function (new_val,old_val) {
                        if(new_val!=old_val) {
                            start(new_val);
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


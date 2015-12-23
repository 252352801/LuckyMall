angular.module('LuckyMall')

    .directive('toggleMenu', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.showMenu=false;
                window.addEventListener('scroll',function(){
                    var scroll_top;
                    if (document.documentElement.scrollTop) {
                        scroll_top = document.documentElement.scrollTop;
                    } else {
                        scroll_top = document.body.scrollTop;
                    }
                    console.log(scroll_top);
                    if(scroll_top>=200){
                        $timeout(function(){
                            scope.showMenu=true;
                        });
                    }else{
                        $timeout(function(){
                            scope.showMenu=false;
                        });
                    }
                });
            }
        };
    })

    .directive('btnScrollFilter', function ($timeout,$rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click',function(){
                    var obj;
                    if (document.documentElement.scrollTop) {
                        obj = document.documentElement;
                    } else {
                        obj = document.body;
                    }
                    var cur_scroll_top=obj.scrollTop;
                    var o_val=200;//参照
                    var scroll_val=o_val-cur_scroll_top;
                    tweenMove({
                        element: obj,
                        attr: 'scrollTop',//需要改变的属性
                        value: scroll_val,//改变的值 可以为正负
                        time: 100,//执行动画的时间
                        moveName: 'Quadratic',//动画名，默认为Linear
                        moveType: 'easeOut'//动画的缓动方式，默认为easeIn
                    });
                });

            }
        };
    })
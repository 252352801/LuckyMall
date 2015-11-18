angular.module('LuckyCat')
.directive('slideBoxImg',function($timeout){
    return {
       link:function(scope,element,attrs){
           scope.index=0;
           scope.showBigImg=function(i){
               scope.index=i;
           };
           scope.prevImg=function(min_index){
               if(scope.index>min_index){
                   scope.index--
               }
           };
           scope.nextImg=function(max_index){
               if(scope.index<max_index){
                    scope.index++;
               }
           };
       }
    };
})
    /*加入购物车按钮*/
    .directive('btnAddIntoCart', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
               element.bind('click', function () {
                    scope.addToCart(function(){
                        moveGoods();
                    });
                });

                function moveGoods(){
                    var img=document.createElement('IMG');
                    img.src=attrs.img;
                    img.className='moving-img';
                    document.body.appendChild(img);
                    var s_poi=getPosition(document.getElementById(attrs.id));
                    var scroll_y=document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop;
                    img.style.left=''+s_poi.left+'px';
                    img.style.top=''+s_poi.top-scroll_y+'px';
                    var e_poi=getPosition(document.getElementById('aside_right_cart'));
                    var x=e_poi.left-s_poi.left;
                    var y=e_poi.top-(s_poi.top-scroll_y);
                    var time=600;
                    tweenMove({
                        element:img,
                        attr:'left',
                        value:x,
                        time:time,
                        moveName:'Quadratic',
                        moveType:'easeOut'
                    });
                    tweenMove({
                        element:img,
                        attr:'top',
                        value:y,
                        time:time,
                        moveName:'Back',
                        moveType:y>0?'easeIn':'easeOut',
                        callback:function(){
                            document.body.removeChild(img);
                        }
                    });
                }
            }
        }
    })
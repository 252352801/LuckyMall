angular.module('LuckyMall')
    .directive('slideBoxImg', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                scope.index = 0;
                scope.showBigImg = function (i) {
                    scope.index = i;
                };
                scope.prevImg = function (min_index) {
                    if (scope.index > min_index) {
                        scope.index--
                    }
                };
                scope.nextImg = function (max_index) {
                    if (scope.index < max_index) {
                        scope.index++;
                    }
                };
            }
        };
    })


    .directive('fangdajing', function () {
        return {
            link: function (scope, element, attrs) {

            }
        };
    })

    /*加入购物车按钮*/
    .directive('btnAddIntoCart', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    scope.createOrder(0, function () { //0表示加入购物车   1表示立即购买
                        moveGoods();
                    });
                });
                function moveGoods() {
                    var img = document.createElement('IMG');
                    img.src = attrs.img;
                    img.className = 'moving-img';
                    document.body.appendChild(img);
                    var s_poi = getPosition(document.getElementById(attrs.id));
                    var scroll_y = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
                    img.style.left = '' + s_poi.left + 'px';
                    img.style.top = '' + s_poi.top - scroll_y + 'px';
                    var e_poi = getPosition(document.getElementById('aside_right_cart'));
                    var x = e_poi.left - s_poi.left;
                    var y = e_poi.top - (s_poi.top - scroll_y);
                    var time = 600;

                    tweenAnimate({
                        element: img,
                        obj: [
                            {
                                attr: 'left',
                                value: x,
                                moveName: 'Quadratic',
                                moveType: 'easeOut'
                            },
                            {
                                attr: 'top',
                                value: y,
                                moveName: 'Back',
                                moveType: y > 0 ? 'easeIn' : 'easeOut'
                            }
                        ],
                        time: time,
                        callback: function () {
                            document.body.removeChild(img);
                        }
                    });
                }
            }
        }
    })
angular.module('LuckyMall')
    .directive('slideBoxImg', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                scope.index = 0;
                scope.showBigImg = function (i) {
                    scope.index = i;
                };
                scope.prevImg = function (max_index) {
                    if (scope.index > 0) {
                        scope.index--;
                    } else {
                        scope.index = max_index;
                    }
                };
                scope.nextImg = function (max_index) {
                    if (scope.index < max_index) {
                        scope.index++;
                    } else {
                        scope.index = 0;
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


    /*图片放大镜*/
    .directive('magnifier', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                //  if(element.attr('ng-src')) {
                //scope.$watch(attrs.ngSrc, function (val) {
                element.bind('mouseover', function () {
                    magnifier({
                        elem: document.getElementById(attrs.id),
                        width: 250,
                        height: 250,
                        src: attrs.magnifierImg
                    });
                });

                function magnifier(params) {
                    var img = params.elem;
                    var s_box;
                    var big_img
                    if (!document['magnifier']) {
                        document['magnifier'] = document.createElement("div");
                        s_box = document['magnifier'];
                        document.body.appendChild(s_box);

                        document['magnifier_img'] = document.createElement('img');
                        big_img = document['magnifier_img'];
                        big_img.style.position = 'absolute';
                        s_box.appendChild(big_img);
                    }
                    s_box = document['magnifier'];
                    big_img = document['magnifier_img'];
                    s_box.style.width = params.width + 'px';
                    s_box.style.height = params.height + 'px';
                    s_box.style.background = "#fff";
                    s_box.style.position = "absolute";
                    s_box.style.display = "none";
                    s_box.style.overflow = "hidden";
                    s_box.style.border = "1px solid #fff";
                    s_box.style.backgroundClip = 'padding-clip';
                    s_box.style.cursor='move';
                    big_img.src = params.src;
                    /*s_box.style.borderRadius='50%';*/
                    /* var big_img = document.createElement('img');

                     big_img.style.position = 'absolute';
                     big_img.src = params.src;
                     s_box.appendChild(big_img);*/
                    /*document.body.appendChild(s_box);*/
                    s_box.onmousemove = function (e) {
                        var img_poit = getPosition(img);
                        var mul = big_img.offsetWidth / img.offsetWidth;
                        var e = e || window.event;
                        var m_p = getMousePosition(e);
                        var m_x = m_p.left;
                        var m_y = m_p.top;
                        s_box.style.left = m_x - s_box.offsetWidth / 2 + 'px';
                        s_box.style.top = m_y - s_box.offsetHeight / 2 + 'px';

                        big_img.style.left = -(m_x - img_poit.left) * mul + params.width / 2 + 'px';
                        big_img.style.top = -(m_y - img_poit.top) * mul + params.height / 2 + 'px';


                        var p = getMousePosition(e);
                        if (p.left > img_poit.left && p.left < img_poit.left + img.offsetWidth && p.top > img_poit.top && p.top < img_poit.top + img.offsetHeight) {
                            s_box.style.display = '';
                        } else {
                            s_box.style.display = 'none';
                        }
                    };

                    big_img.onload = function () {
                        img.onmousemove = function (e) {
                            var img_poit = getPosition(img);
                            var e = e || window.event;
                            var m_p = getMousePosition(e);
                            var m_x = m_p.left;
                            var m_y = m_p.top;
                            s_box.style.left = m_x - s_box.offsetWidth / 2 + 'px';
                            s_box.style.top = m_y - s_box.offsetHeight / 2 + 'px';
                            s_box.style.display = '';

                        };
                    };
                    addEvent(document.body,'mouseover',hideSBox);
                    function hideSBox(e) {
                        var e = e || window.event;
                        var target = e.target || e.srcElement;
                        if (target != s_box && target != img && target != big_img) {
                            s_box.style.display = 'none';
                            removeEvent(document.body,'mouseover',hideSBox);
                        }
                    }

                    function getPosition(obj) {
                        var topValue = 0, leftValue = 0;
                        while (obj) {
                            leftValue += obj.offsetLeft;
                            topValue += obj.offsetTop;
                            obj = obj.offsetParent;
                        }
                        return {left: leftValue, top: topValue};
                    }

                    function getMousePosition(e) {
                        var m_x = e.pageX || (e.clientX +
                            (document.documentElement.scrollLeft
                                || document.body.scrollLeft));
                        var m_y = e.pageY || (e.clientY +
                            (document.documentElement.scrollTop
                                || document.body.scrollTop));
                        return {left: m_x, top: m_y};
                    }

                }

            }
        }
    })

    /*数字滑动*/
    .directive('numberSlider', function ($timeout, $compile) {
        return {
            link: function (scope, element, attrs) {
                scope.numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10];
                scope.overlay=[0,0,0,0];
                var change_time = 2000;//切换的间隔时间
                var num_len=scope.numbers.length;

                if (attrs.numberSlider) {
                    scope.$watch(attrs.numberSlider, function (new_val, old_val) {
                        if (new_val != old_val) {
                            start(new_val);
                        }
                    });
                }

                function start(data_goods) {


                    var slider=getByClass("item-slider");
                    scope.h=45;//高度
                    var price = data_goods.RetailPrice;
                    var max_disc = data_goods.MaxDiscount;
                    var min_disc = data_goods.MinDiscount;
                    scope.cur_disc = min_disc;
                    var cur_price = (price * min_disc).toFixed(0);
                    initPrice(cur_price);
                    initOverlayStatus();
                    for(var o=0;o<scope.indexes.length;o++){
                        slider[o].style.top=-(num_len+parseInt(scope.indexes[o]))*scope.h+'px';
                    }
                    var rand = Math.random();//随机数
                    $timeout(function () {
                        run();
                    }, change_time)
                    function run() {

                        $timeout(function () {
                            scope.new_disc=rand+0.1;//构建新的折扣卡
                            scope.new_disc=scope.new_disc.toFixed(1);
                            if(scope.new_disc>=1){
                                scope.new_disc-=0.2;
                            }
                            scope.dc_animate = true;//开启动画
                        });
                        $timeout(function () {
                            scope.dc_animate=false;//暂停动画
                            /*#################计算当前折扣、价格数组####################*/
                            if (scope.cur_disc == max_disc) {
                                scope.cur_disc = min_disc;
                                scope.dc_animate=0;
                            } else {
                                scope.cur_disc *= scope.new_disc;
                            }
                            if (scope.cur_disc < max_disc) {
                                scope.cur_disc = max_disc;
                            }
                            cur_price = Math.ceil(price * scope.cur_disc);
                            var old_index=scope.indexes;
                            initPrice(cur_price);
                            /*#################end####################*/
                            var new_index=scope.indexes;
                            var val=[0,0,0,0];
                            for(var o in new_index){
                                if(parseInt(new_index[o])>parseInt(old_index[o])){
                                    val[o]=num_len+parseInt(old_index[o])-parseInt(new_index[o]);
                                }else{
                                    val[o]=parseInt(old_index[o])-parseInt(new_index[o]);
                                }
                            }
                            tweenMultiFixAnimate({
                                obj: [
                                    {
                                        element: slider[0],
                                        object: [
                                            {
                                                attr: 'top',//需要改变的属性
                                                value: parseInt(val[0])*scope.h,//改变的值 可以为正负
                                                moveName: 'Linear',//动画名，默认为Linear
                                                moveType: 'easeIn'//动画的缓动方式，默认为easeIn
                                            }
                                        ]
                                    },
                                    {
                                        element: slider[1],
                                        object: [
                                            {
                                                attr: 'top',//需要改变的属性
                                                value: parseInt(val[1])*scope.h,//改变的值 可以为正负
                                                moveName: 'Linear',//动画名，默认为Linear
                                                moveType: 'easeIn'//动画的缓动方式，默认为easeIn
                                            }
                                        ]
                                    },
                                    {
                                        element: slider[2],
                                        object: [
                                            {
                                                attr: 'top',//需要改变的属性
                                                value:parseInt(val[2])*scope.h,//改变的值 可以为正负
                                                moveName: 'Linear',//动画名，默认为Linear
                                                moveType: 'easeIn'//动画的缓动方式，默认为easeIn
                                            }
                                        ]
                                    },
                                    {
                                        element: slider[3],
                                        object: [
                                            {
                                                attr: 'top',//需要改变的属性
                                                value:parseInt(val[3])*scope.h,//改变的值 可以为正负
                                                moveName: 'Linear',//动画名，默认为Linear
                                                moveType: 'easeIn'//动画的缓动方式，默认为easeIn
                                            }
                                        ]
                                    }
                                ],
                                time: 300,//执行动画的时间
                                callback: function(){
                                    initOverlayStatus();
                                    for(var o in new_index){
                                        if(parseInt(new_index[o])>parseInt(old_index[o])){
                                            slider[o].style.top=slider[o].offsetTop-scope.h*num_len+'px';
                                        }
                                    }
                                    rand = Math.random();//生成新的随机数
                                    run();
                                }
                            });
                        }, change_time);
                    }
                }

                function initPrice(val) {
                    scope.indexes = [0, 0, 0, 0];
                    var a = scope.indexes.length - 1;
                    var b = ('' + val).split('');
                    var c = b.length - 1;
                    while (c >= 0) {
                        scope.indexes[a] = b[c];
                        c--;
                        a--;
                    }
                }
                function initOverlayStatus(){
                   scope.overlay=[0,0,0,0];
                    for(var o in scope.indexes){
                        if(parseInt(scope.indexes[o])==0){
                            scope.overlay[o]=1;
                        }else{
                            break;
                        }
                    }
                }
            }
        }
    })
angular.module('LuckyMall')

    /*回到顶部*/
    .directive('btnPageUp', function () {
        return {
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    if (document.documentElement.scrollTop) {
                        document.documentElement.scrollTop = 0;
                    } else {
                        document.body.scrollTop = 0;
                    }
                });
            }
        };
    })
    /*登陆弹出框*/
    .directive('modalLogin', function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/modal-login.html',
            replace: true,
            controller: 'LoginCtrl',
            link: function (scope, element, attrs) {
            }
        };
    })
    /*登陆弹出框*/
    .directive('modalFeedback', function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/modal-feedback.html',
            replace: true,
            controller: 'FeedbackCtrl'
        };
    })
    /*页头*/
    .directive('header', function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/header.html',
            replace: true,
            transclude: true,
            controller: function ($scope, LoginSer, $timeout, $rootScope) {
                if (document.documentElement.scrollTop) {//每次加载头部时，滚动条Y值为0（回到页面顶端）
                    document.documentElement.scrollTop = 0;
                } else {
                    document.body.scrollTop = 0;
                }

                $scope.exit = function () {
                    LoginSer.exit();
                    $rootScope.$broadcast('exit');
                    $timeout(function () {
                        $scope.isLogin = LoginSer.isLogin();
                    }, 5)
                };
            },
            link: function (scope, element, attrs) {

            }
        };
    })

    /*sub页头*/
    .directive('subHeader', function (CartSer, $timeout, $state, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/sub-header.html',
            replace: true,
            transclude: true,
            controller: function ($rootScope, $scope, $timeout, LoginSer) {
                $scope.isLogin = LoginSer.isLogin();
                $scope.removeGoodsInCart = function (order_id) {
                    swal({
                            title: "确定要删除吗?",
                            text: "删除后商品将从购物车移除!",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            cancelButtonText: '取消',
                            confirmButtonText: "确定",
                            closeOnConfirm: false,
                            showLoaderOnConfirm: true
                        },
                        function () {
                            CartSer.cancelOrder(order_id, function (response, status) {
                                if (status == 1) {
                                    swal({
                                        title: "删除成功!",
                                        type: "success",
                                        confirmButtonText: "确定"
                                    });
                                    $rootScope.$broadcast('cart-update');
                                } else if (status == 0) {
                                    swal({
                                        title: "您不能删除此订单!",
                                        type: "error",
                                        confirmButtonText: "确定"
                                    });
                                }
                            });
                        });
                };
            },
            link: function (scope, element, attrs) {
                $timeout(function () {
                    scope.cur_nav = attrs.nav;
                }, 5);
            }
        };
    })

    /*页头*/
    .directive('longHeader', function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/long-header.html',
            replace: true,
            link: function (scope, element, attrs) {
                if (document.documentElement.scrollTop) {//每次加载头部时，滚动条Y值为0（回到页面顶端）
                    document.documentElement.scrollTop = 0;
                } else {
                    document.body.scrollTop = 0;
                }
                scope.cur_nav = attrs.nav;
            }
        };
    })

    /*商品分类*/
    .directive('category', function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/category.html',
            replace: true,
            controller: function ($scope, $timeout) {
            },
            link: function (scope, element, attrs) {
                scope.showSubCategory = attrs.hasSubCategory ? ((attrs.hasSubCategory == 'false') ? false : true) : true;
                scope.showMoreCategory = false;
                scope.showMore = function () {
                    scope.showMoreCategory = true;
                };
                scope.hideMore = function () {
                    scope.showMoreCategory = false;
                };
            }
        };
    })

    /*页脚*/
    .directive('footer', function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/footer.html',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {

            }
        };
    })


    /*sub页脚*/
    .directive('subFooter', function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/sub-footer.html',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {

            }
        };
    })

    /*介绍模块*/
    .directive('introduction', function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/introduction.html',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {

            }
        };
    })

    /*右边栏*/
    .directive('asideRight', function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/aside-right.html',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {
                /*隐藏反馈窗口*/
                scope.showFeedbackModal = function () {
                    scope.$emit('show-feedback-modal');
                };
            }
        };
    })

    /*要求输入邮箱*/
    .directive('requireEmail', function () {
        return {
            link: function (scope, element, attrs) {
                element.bind('keyup', function () {
                    var reg = /^[A-z0-9]+([._\\-]*[A-z0-9])*@([A-z0-9]+[-A-z0-9]*[A-z0-9]+.){1,63}[A-z0-9]+$/;
                    if (!reg.test(this.value)) {
                        element.css('borderColor', '#ff0000');//输入不正确时边框变红
                        element.attr('data-valid', false);//data-valid:用于标志输入是否有效
                    } else {
                        element.css('borderColor', '');
                        element.attr('data-valid', true);
                    }
                });
            }
        };
    })

    /*要求输入手机号码*/
    .directive('requireCellPhone', function () {
        return {
            link: function (scope, element, attrs) {
                var reg = /^[1][358]\d{9}$/;
                element.bind('blur', function () {
                    if (!reg.test(this.value) && this.value != '') {
                        if (scope[attrs.inputtips]) {
                            scope[attrs.inputtips]('请正确输入手机号 !');
                        }
                    } else {
                        if (scope[attrs.inputtips]) {
                            scope[attrs.inputtips]('');
                        }
                    }
                });
                element.bind('keyup', function () {
                    if (scope[attrs.inputtips]) {
                        scope[attrs.inputtips]('');
                    }
                });
            }
        };
    })

    /*要求输入固定电话号码*/
    .directive('requireTel', function () {
        return {
            link: function (scope, element, attrs) {
                element.bind('keyup', function () {
                    var reg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;
                    if (!reg.test(this.value)) {
                        element.css('borderColor', '#ff0000');//输入不正确时边框变红
                        element.attr('data-valid', false);//data-valid:用于标志输入是否有效
                    } else {
                        element.css('borderColor', '');
                        element.attr('data-valid', true);
                    }
                });
            }
        };
    })

    /*要求输入整数*/
    .directive('requireInteger', function () {
        return {
            link: function (scope, element, attrs) {
                element.bind('keyup', function () {
                    var reg = /^[0-9]+$/;
                    if (!reg.test(this.value)) {
                        element.css('borderColor', '#ff0000');//输入不正确时边框变红
                        element.attr('data-valid', false);//data-valid:用于标志输入是否有效
                    } else {
                        element.css('borderColor', '');
                        element.attr('data-valid', true);
                    }
                });
            }
        };
    })

    /*要求输入邮政编码*/
    .directive('requirePostcode', function () {
        return {
            link: function (scope, element, attrs) {
                element.bind('keyup', function () {
                    var reg = /^\d{6}$/;
                    if (this.value != '') {
                        if (!reg.test(this.value)) {
                            element.css('borderColor', '#ff0000');//输入不正确时边框变红
                            element.attr('data-valid', false);//data-valid:用于标志输入是否有效
                        } else {
                            element.css('borderColor', '');
                            element.attr('data-valid', true);
                        }
                    } else {
                        element.css('borderColor', '');
                        element.attr('data-valid', true);
                    }
                });
            }
        };
    })

    /*选择日期插件*/
    .directive('datePicker', function () {
        return {
            link: function (scope, element, attrs) {
                var loadScriptCallback = function () {
                    if (getById('laydate_box') != null) {
                        document.body.removeChild(getById('laydate_box'));
                    }
                    var _id = attrs.id;
                    setTimeout(function () {
                        var reg = /^[-+]*\d{1,}$/;
                        laydate({
                            elem: '#' + _id,
                            format: attrs.format ? attrs.format : '',
                            istime: attrs.istime ? attrs.istime : '',
                            istoday: attrs.istoday ? attrs.istoday : '',
                            min: attrs.min ? (reg.test(attrs.min) ? laydate.now(attrs.min) : attrs.min) : '',
                            max: attrs.max ? (reg.test(attrs.max) ? laydate.now(attrs.max) : attrs.max) : ''
                        });
                    }, 50);
                };
                var script = document.createElement("SCRIPT");
                if (script.readyState) { //IE
                    script.onreadystatechange = function () {
                        if (script.readyState == "loaded" ||
                            script.readyState == "complete") {
                            script.onreadystatechange = null;
                            loadScriptCallback();
                        }
                    };
                } else { //Others: Firefox, Safari, Chrome, and Opera
                    script.onload = function () {
                        loadScriptCallback();
                    };
                }
                script.id = 'script_date';
                script.src = './lib/laydate/laydate.js';
                if (getById("script_date") == null) {
                    element.after(script);
                } else {
                    loadScriptCallback();
                }
            }
        }
    })


    /*滚动加载图片脚本*/
    .directive('scrollLoadImg', function ($timeout) {
        return {
            restrict: 'E',
            scope: true,
            controller: function ($scope) {

            },
            link: function (scope, element, attrs) {
                var temp = -1;//用来判断是否是向下滚动（向上滚动就不需要判断延迟加载图片了）
                var imgElements = document.getElementsByTagName("img");
                var lazyImgArr = new Array();
                var bodyHeight = window.screen.availHeight;//body（页面）可见区域的总高度
                for (var i = 0; i < imgElements.length; i++) {
                    if (imgElements[i].getAttribute("real-src") != null) {
                        addClass(imgElements[i], 'img-loading');
                        lazyImgArr.push(imgElements[i]);
                    }
                }
                var onScroll = function () {
                    var scrollHeight = (document.body.scrollTop == 0) ? document.documentElement.scrollTop : document.body.scrollTop;//滚动的高度
                    if (temp < scrollHeight) {//为true表示是向下滚动，否则是向上滚动，不需要执行动作。
                        for (var k = 0; k < lazyImgArr.length; k++) {
                            var imgTop = getPosition(lazyImgArr[k]).top;//（图片纵坐标）
                            if (imgTop - scrollHeight + 150 <= bodyHeight) {
                                lazyImgArr[k].setAttribute('src', lazyImgArr[k].getAttribute("real-src"));
                                addClass(lazyImgArr[k], 'img-loaded');
                                //removeClass(lazyImgArr[k],'img-loading');
                                lazyImgArr.splice(k, 1);
                            }
                        }
                    }

                };
                $timeout(function () {
                    onScroll();
                }, 5);
                window.onscroll = onScroll;
            }

        };
    })

    /*倒计时按钮*/
    .directive('btnCountDown', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    if (attrs.require == 'false') {
                        return;
                    }
                    element.attr('disabled', true);
                    var remain_time = attrs.btnCountDown ? parseInt(attrs.btnCountDown) : 60;
                    var org_value;
                    if (attrs.value) {
                        org_value = attrs.value;
                        element.attr('value', remain_time + '秒');
                    } else {
                        org_value = element.html();
                        element.html(remain_time + '秒');
                    }
                    countDown();
                    function countDown() {
                        $timeout(function () {
                            remain_time--;
                            if (attrs.value) {
                                element.attr('value', remain_time + '秒');
                                if (remain_time > 0) {
                                    countDown();
                                } else {
                                    element.attr('disabled', false);
                                    element.attr('value', org_value);
                                }
                            } else {
                                element.html(remain_time + '秒');
                                if (remain_time > 0) {
                                    countDown();
                                } else {
                                    element.attr('disabled', false);
                                    element.html(org_value);
                                }
                            }
                        }, 1000);
                    }
                });
            }
        };
    })

    /*回到顶部*/
    .directive('btnReturnTop', function () {
        return {
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    var obj;
                    if (document.documentElement.scrollTop) {
                        obj = document.documentElement;
                    } else {
                        obj = document.body;
                    }
                    tweenMove({
                        element: obj,
                        attr: 'scrollTop',//需要改变的属性
                        value: -obj.scrollTop,//改变的值 可以为正负
                        time: 300,//执行动画的时间
                        moveName: 'Quadratic',//动画名，默认为Linear
                        moveType: 'easeOut'//动画的缓动方式，默认为easeIn
                    });
                });
            }
        }
    })

    /*收货人输入验证*/
    .directive('requireName', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                var reg = /^([a-zA-Z ]+|[\u4e00-\u9fa5]{1,25})$/;
                element.bind('blur', function () {
                    if (element.val() == ('' | undefined)) {
                        scope[attrs.requireName]('请输入收货人姓名');
                    } else {
                        if (!reg.test(element.val())) {
                            scope[attrs.requireName]('请按要求收货人姓名');
                        } else {
                            scope[attrs.requireName]('');
                        }
                    }
                });
                element.bind('keyup', function () {
                    if (reg.test(element.val())) {
                        scope[attrs.requireName]('');
                    }
                });
            }
        };
    })

    /*收货人手机输入验证*/
    .directive('requireMobile', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                var reg = /^[1][358]\d{9}$/;
                element.bind('blur', function () {
                    if (element.val() == ('' | undefined)) {
                        scope[attrs.requireMobile]('请输入收货人的手机号码');
                    } else {
                        if (!reg.test(element.val())) {
                            scope[attrs.requireMobile]('您输入了错误的手机号码');
                        } else {
                            scope[attrs.requireMobile]('');
                        }
                    }
                });
                element.bind('keyup', function () {
                    if (reg.test(element.val())) {
                        scope[attrs.requireMobile]('');
                    }
                });
            }
        };
    })

    /*只能输入数字*/
    .directive('requireNumber', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('keydown', function (event) {
                    if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8)) {
                        if (event.preventDefault) {
                            event.preventDefault();
                        } else {
                            event.returnValue = false;
                        }
                    }
                });
                element.bind('keyup', function () {
                    var max = parseInt(attrs.max);
                    if (element.val() > max) {
                        scope.overMax(max);
                    } else {
                        if (element.val() === 0) {
                            element.val(1);
                        }
                    }
                });
            }
        };
    })


    /* 图片预加载和错误处理*/
    .directive('tempSrc', function () {
        return {
            link: function (scope, element, attrs) {
                var src = attrs.realSrc;
                attrs.$set('src', attrs.tempSrc);
                var img = document.createElement("img");
                img.src = src;
                element.addClass('img-loading');
                img.onload = function () {
                    attrs.$set('src', src);
                    element.removeClass('img-loading');
                    element.addClass('img-loaded');
                };
                img.onerror = function () {
                    element.removeClass('img-loading');
                };
            }
        }
    })

    /* loading*/
    .directive('loading', function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/loading.html',
            replace: true
        }
    })

    /*图片滚动出现时加载*/
    .directive('lazySrc', ['$window', '$document', function ($window, $document) {
        var doc = $document[0],
            body = doc.body,
            win = $window,
            $win = angular.element(win),
            uid = 0,
            elements = {};

        function getUid(el) {
            return el.__uid || (el.__uid = '' + ++uid);
        }

        function getWindowOffset() {
            var t,
                pageXOffset = (typeof win.pageXOffset == 'number') ? win.pageXOffset : (((t = doc.documentElement) || (t = body.parentNode)) && typeof t.ScrollLeft == 'number' ? t : body).ScrollLeft,
                pageYOffset = (typeof win.pageYOffset == 'number') ? win.pageYOffset : (((t = doc.documentElement) || (t = body.parentNode)) && typeof t.ScrollTop == 'number' ? t : body).ScrollTop;
            return {
                offsetX: pageXOffset,
                offsetY: pageYOffset
            };
        }

        function isVisible(iElement) {
            var elem = iElement[0],
                elemRect = elem.getBoundingClientRect(),
                windowOffset = getWindowOffset(),
                winOffsetX = windowOffset.offsetX,
                winOffsetY = windowOffset.offsetY,
                elemWidth = elemRect.width,
                elemHeight = elemRect.height,
                elemOffsetX = elemRect.left + winOffsetX,
                elemOffsetY = elemRect.top + winOffsetY,
                viewWidth = Math.max(doc.documentElement.clientWidth, win.innerWidth || 0),
                viewHeight = Math.max(doc.documentElement.clientHeight, win.innerHeight || 0),
                xVisible,
                yVisible;

            if (elemOffsetY <= winOffsetY) {
                if (elemOffsetY + elemHeight >= winOffsetY) {
                    yVisible = true;
                }
            } else if (elemOffsetY >= winOffsetY) {
                if (elemOffsetY <= winOffsetY + viewHeight) {
                    yVisible = true;
                }
            }

            if (elemOffsetX <= winOffsetX) {
                if (elemOffsetX + elemWidth >= winOffsetX) {
                    xVisible = true;
                }
            } else if (elemOffsetX >= winOffsetX) {
                if (elemOffsetX <= winOffsetX + viewWidth) {
                    xVisible = true;
                }
            }

            return xVisible && yVisible;
        };

        function checkImage() {
            Object.keys(elements).forEach(function (key) {
                var obj = elements[key],
                    iElement = obj.iElement,
                    $scope = obj.$scope;
                if (isVisible(iElement)) {
                    iElement.attr('src', $scope.lazySrc);
                }
            });
        }

        $win.bind('scroll', checkImage);
        $win.bind('resize', checkImage);

        function onLoad() {
            var $el = angular.element(this),
                uid = getUid($el);

            $el.css('opacity', 1);

            if (elements.hasOwnProperty(uid)) {
                delete elements[uid];
            }
        }

        return {
            restrict: 'A',
            scope: {
                lazySrc: '@'
            },
            link: function ($scope, iElement, attrs) {
                attrs.$set('src', './res/images/default.png');
                iElement.bind('load', onLoad);
                iElement.bind('error', function () {
                    attrs.$set('src', './res/images/default.png');
                });
                $scope.$watch('lazySrc', function () {
                    if (isVisible(iElement)) {
                        iElement.attr('src', $scope.lazySrc);
                    } else {
                        var uid = getUid(iElement);
                        iElement.css({
                            'background-color': '#fff',
                            'opacity': 0,
                            '-webkit-transition': 'opacity 1s',
                            'transition': 'opacity 1s'
                        });
                        elements[uid] = {
                            iElement: iElement,
                            $scope: $scope
                        };
                    }
                });

                $scope.$on('$destroy', function () {
                    iElement.unbind('load');
                });
            }
        };
    }])


    /*绑定内容*/
    .directive('innerHtml', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                testLoad();
                function testLoad() {
                    if (scope[attrs.innerHtml] == undefined) {
                        setTimeout(testLoad, 100);
                    } else {
                        element.html(scope[attrs.innerHtml]);
                    }
                }
            }
        };
    })

    /*倒计时*/
    .directive('countDown', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                function polling() {
                    if (attrs.countDown == '') {
                        $timeout(polling, 500);
                    } else {
                        start();
                    }
                }

                polling();
                function start() {
                    element.time = parseInt(attrs.countDown);
                    var inner = element.time >= 60 ? parseInt(element.time / 60) + '分' + element.time % 60 + '秒' : element.time % 60 + '秒';
                    element.html(inner);
                    countDown();
                    function countDown() {
                        element.timer = setInterval(function () {
                            if (element.time > 0) {
                                element.time--;
                                var new_inner = element.time >= 60 ? parseInt(element.time / 60) + '分' + element.time % 60 + '秒' : element.time % 60 + '秒';
                                element.html(new_inner);
                            } else {
                                clearInterval(element.timer);
                                if (typeof scope[attrs.timeOver] == "function") {
                                    scope[attrs.timeOver]();
                                }
                            }
                        }, 1000);
                    }
                }
            }
        };
    })

    /*地址选择*/
    .directive('areaPicker', function (AreaSer) {
        return {
            link: function (scope, element, attrs) {
                function start() {
                    var data_area = AreaSer.getData();
                    areaPicker({
                        elem: document.getElementById(attrs.id),
                        data: data_area,
                        callback: function () {
                            if (typeof scope[attrs.areaPickerFinish] == 'function') {//选择完毕的回调
                                var val = element.val() || element.html();
                                scope[attrs.areaPickerFinish](val);
                            }
                        }
                    });
                }

                if (AreaSer.getData() == null) {
                    AreaSer.requestData(function (response, status) {
                        if (status == 1) {
                            start();
                        }
                    });
                } else {
                    start();
                }
            }
        }
    })

/*图片上传*/
.directive('btnFileUpload', function ($compile) {
    return {
        link: function (scope, element, attrs) {
            if(!scope.count){
                scope.count=0;
            }
           element.find('input').bind('change',function(e){
               setImagePreview();
               function setImagePreview() {
                   var is_img_null=(!element.find('img').attr('src')||element.find('img').attr('src')=='')?true:false;
                   var new_f_box=$compile(element.clone())(scope);
                   element.find('span').css('display','none');
                   element.find('img').attr('src',window.URL.createObjectURL((e.srcElement || e.target).files[0]));
                   element.find('i').css('display','block');
                   if(is_img_null){
                       var max_count=parseInt(attrs.maxFileCount);
                       if(scope.count<max_count) {
                           element.after(new_f_box);
                           scope.count++;
                       }
                   }
                   element.find('i').bind('click',function(){
                       var max_count=parseInt(attrs.maxFileCount);
                       if(scope.count==max_count){
                           element.after(new_f_box);
                       }
                       element.remove();
                       scope.count--;
                   });
               }
           });
        }
    }
});
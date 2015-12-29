angular.module('LuckyMall')

    .directive('ngTitle', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if(attrs.ngTitle) {
                    scope.$watch(attrs.ngTitle, function (val) {
                        document.title=val;
                    });
                }
            }
        };
    })

    .directive('spinner', function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/spinner.html',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {
                if(attrs.text){
                    element.html(attrs.text);
                }
            }
        };
    })

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
    .directive('modalLogin', function ($state) {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/modal-login.html',
            replace: true,
            controller: 'LoginCtrl',
            link: function (scope, element, attrs) {
                scope.goLostPWPage=function(){
                    scope.$emit('close-login-modal');
                    $state.go("lostPassword");
                }
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
            controller: function ($scope, LoginSer, $timeout, $rootScope,$state) {
                $scope.exit = function () {
                    LoginSer.exit();
                    $rootScope.$broadcast('exit');
                    $timeout(function () {
                        $scope.isLogin = LoginSer.isLogin();
                    }, 5)
                };
                $scope.goLogin=function(){
                    $rootScope.login_target={
                        state:'home',
                        params:{}
                    };
                    $state.go('login');
                };
            },
            link: function (scope, element, attrs) {
                var obj;
                if (document.documentElement.scrollTop) {
                    obj = document.documentElement;
                } else {
                    obj = document.body;
                }
                obj.scrollTop=0;
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
                scope.cur_nav = attrs.nav;
                var obj;
                if (document.documentElement.scrollTop) {
                    obj = document.documentElement;
                } else {
                    obj = document.body;
                }
                obj.scrollTop=0;
            }
        };
    })

    /*商品分类*/
    .directive('category', function ($state) {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/category.html',
            replace: true,
            controller: function ($scope, $timeout) {
            },
            link: function (scope, element, attrs) {
                scope.showCategoryContent = attrs.hasSubCategory ? ((attrs.hasSubCategory == 'false') ? false : true) : true;
                scope.showMoreCategory = false;
                scope.showMore = function () {
                    scope.showMoreCategory = true;
                };
                scope.hideMore = function () {
                    scope.showMoreCategory = false;
                };
                if($state.current.name=='home'){
                    scope.isShowCategoryBtn=false;
                }else{
                    scope.isShowCategoryBtn=true;
                }
            }
        };
    })


    /*商品分类(隐藏的)*/
    .directive('hiddenCategory', function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/hiddenCategory.html',
            controller:function($scope,CategorySer,$timeout){
                $scope.toggleCategory=function(){
                    $scope.showHiddenCategory=!$scope.showHiddenCategory;
                    if($scope.showHiddenCategory){
                        if(CategorySer.getData()==null){
                            $scope.category_loading=true;
                            CategorySer.requestData(function(){
                                $scope.data_category= CategorySer.getData();
                                $scope.category_loading=false;
                            });
                        }else{
                            $scope.data_category= CategorySer.getData();
                        }
                    }
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
                scope.showQRCode=function(){
                    scope.isQRCodeShow=true;
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
    .directive('tempSrc', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                var src = attrs.realSrc;
                attrs.$set('src', attrs.tempSrc);
                var img = document.createElement("img");
                img.src = src;
                img.onload = function () {
                    element.css('opacity','0');
                    $timeout(function(){
                        element.css('transition','opacity 1s');
                        element.css('opacity','1');
                        attrs.$set('src', src);
                    },300);
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
                            '-webkit-transition': 'all 1s!important',
                            'transition': 'all 1s!important'
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
                if(attrs.innerHtml) {
                    scope.$watch(attrs.innerHtml, function (html) {
                        element.html(html || '');//更新html内容
                    });
                }
            }
        };
    })

    /*倒计时*/
    .directive('countDown', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if(attrs.countDown) {
                    scope.$watch(attrs.countDown, function (new_val,old_val) {
                        start(new_val);
                    });
                }
                function start(val) {
                    clearInterval(element.timer);
                    element.time = parseInt(val);
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
                                element.time=parseInt(val);
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

/*图片上传预览*/
.directive('btnFileUpload', function ($compile) {
    return {
        link: function (scope, element, attrs) {
            var max_count= parseInt(element.attr('max-count'));
            element.find('input').bind('change',function(e){
                var count=element.parent().attr('count');
                if(count==undefined){
                    count=1;
                }else{
                    count=parseInt(count);
                }
               setImagePreview();
               function setImagePreview() {
                   var is_img_null=(!element.find('img').attr('src')||element.find('img').attr('src')=='')?true:false;
                   var new_f_box=$compile(element.clone())(scope);
                   element.find('span').css('display','none');
                   element.find('img').attr('src',window.URL.createObjectURL((e.srcElement || e.target).files[0]));
                   element.find('i').css('display','block');
                   if(is_img_null){
                       if(count<max_count){
                           element.after(new_f_box);
                       }
                       element.parent().attr('count',count+1);
                   }
                   element.find('i').bind('click',function(){
                       if(count>=max_count){
                           element.after(new_f_box);
                       }
                       element.parent().attr('count',count);
                       element.remove();
                   });
               }
           });
        }
    }
})

    /*剩余时间*/
    .directive('timeDown', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if(attrs.timeDown){
                    scope.$watch(attrs.timeDown,function(new_val,old_val){
                        if(new_val!=undefined&&new_val!='') {
                            start(new_val);
                        }
                    });
                }

                function start(time_second){
                    element.time = parseInt(time_second);
                    var inner = initTime(element.time);
                    element.html(inner);
                    countDown();
                    function countDown() {
                        element.timer = setInterval(function () {
                            if (element.time > 0) {
                                element.time--;
                                var new_inner = initTime(element.time);
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

                function initTime(time){
                    var t=time;
                    var str='';
                    if(t>3600*24){
                        str+=parseInt(t/(3600*24))+'天';
                        t=t%(3600*24);
                    }
                    if(t>3600){
                        str+=parseInt(t/3600)+'时';
                        t=t%3600;
                    }
                    if(t>60){
                        str+=parseInt(t/60)+'分';
                        t=t%60;
                    }
                    str+=t+'秒';
                    return str;
                }
            }
        };
    })

/*图片出错*/
.directive('errorSrc', function ($compile) {
    return {
        restrict:'A',
        link: function (scope, element, attrs) {
            element.bind('error',function(){
                element.attr('src',attrs.errorSrc);
            });
        }
    }
})


/*游戏窗口*/
.directive('gameWindow', function ($rootScope,$state,MyOrdersSer) {
    return {
        restrict: 'E',
        templateUrl: 'common/templates/iFrame-game.html',
        replace: true,
        link: function (scope, element, attrs) {
              scope.isLoadingGame=true;
                var iframe_game=element.find('iframe');
                scope.$watch("game.url", function (new_val, old_val) {
                     if (new_val!=old_val) {
                        iframe_game.attr('src', new_val);
                     }
                });
                window.addEventListener('message',gameHandler,false);

                function gameHandler(e){
                  //  if(e.origin=='http://www.xingyunmao.cn:9004'){
                        if(e.data==true){
                            scope.isLoadingGame=false;
                        }else {
                            switch (e.data.mode) {
                                case 0://返回购物车
                                    $rootScope.$broadcast('cart-update');
                                    $state.go('shoppingCart');
                                    break;
                                case 1://付定金
                                    $rootScope.$broadcast('cart-update');
                                    $state.go('payForEarnest', {params: 'order_id=' + $rootScope.game.orderId});
                                    break;
                                case 2://支付
                                    $rootScope.$broadcast('cart-update');
                                    MyOrdersSer.setTempOrder($rootScope.game.orderId);
                                    $state.go('confirmOrder', {source: 'source=game'});
                                    break;
                                case 3://登陆
                                    $state.go('login');
                                    break;
                                case 4://详情页
                                    $rootScope.$broadcast('cart-update');
                                    $rootScope.$broadcast('refresh-item-isCanFree');
                                    $state.go('item', {goods_id: $rootScope.game.commodityId});
                                    break;
                            }
                            $rootScope.closeGame();
                        }
                    //}
                }
        }
    }
})


    /*免费试玩按钮*/
    .directive('btnFreePlay', function (CartSer,$timeout) {
        return {
            restrict: 'A',
            replace: true,
            link: function (scope, element, attrs) {
                scope.canPlay=false;
                var goods_id=attrs.btnFreePlay;
                CartSer.isCanFreePlay(goods_id,function(response,status){
                    if(status==1){
                        if(response==true){
                            $timeout(function(){
                                scope.canPlay=true;
                            })
                        }
                    }
                });
            }
        }
    })


    /*进入游戏前的modal*/
/*    .directive('modalBeforeGame', function () {
        return {
            restrict: 'E',
            templateUrl: './common/templates/modal-beforeGame.html',
            replace: true,
            link:function(scope, element, attrs){
            }
        };
    })*/
    /*进入游戏前的modal*/
    .directive('modalBeforeGame', function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/modal-beforeGame.html',
            replace: true,
           /* scope:{

            },*/
            link:function(scope, element, attrs){
            },
            controller:function($scope,TokenSer,$rootScope,RefreshUserDataSer,$state,Host,$timeout,MyOrdersSer){
                if(TokenSer.getToken()){//存有token时请求用户数据
                    loadUserData();
                }
                $scope.isModal1show=false;
                $scope.energy = {
                    isEnough: true,
                    tips: ''
                };
                $scope.play=function(){
                    ga('send', 'pageview', {
                        'page': '/enter_paygame',
                        'title': '进入付定金游戏'
                    });
                    $rootScope.openGame($scope.gameUrl,$scope.game_orderId,$scope.game_commodityId);
                }
                $scope.showModal1 = function (order) {
                    if($scope.data_user!=undefined) {
                        show(order);
                    }else{
                        loadUserData(function(){
                            show(order);
                        });
                    }

                };
                $scope.closeModal1 = function () {
                    $scope.isModal1show = false;
                    $scope.agree = false;
                    $scope.energy.tips = '';
                };
                $scope.showModal2 = function () {
                    $scope.isModal1show = false;
                    $scope.isModal2show = true;
                };
                $scope.closeModal2 = function () {
                    $scope.agree = false;
                    $scope.isModal2show = false;
                };
                $scope.returnModal1 = function () {
                    $scope.isModal1show = true;
                    $scope.isModal2show = false;
                };

                $scope.payForEarnest = function () {
                        $state.go('payForEarnest',{params:'order_id='+$scope.data_eo.Id});
                };
                function show(order){
                    $scope.data_eo = order;
                    $scope.data_orgCost = Math.ceil($scope.data_eo.UnitPrice * $scope.data_eo.Count);//打折前总花费
                    if (testEnergy($scope.data_orgCost, order.EarnestPercent, order.EarnestMoney, $scope.data_user.LuckyEnergy.PaidValue)) {//判断能量是否能进入游戏; 参数依次为  总价 定金比例 已付定金 用户剩余能量
                        $scope.energy.isEnough = true;
                    } else {
                        $scope.energy.isEnough = false;
                    }
                    $scope.gameUrl = Host.game + '?orderid=' + order.Id + '&from=' + Host.gameOverPage + '&authorization=' + TokenSer.getToken(); //设置游戏地址
                    $scope.game_orderId = order.Id;
                    $scope.game_commodityId = order.CommodityId;
                    MyOrdersSer.setTempOrder(order);
                    $scope.btn_buyNow_href = '/confirmOrder/source=purchase';
                    $timeout(function () {
                        $scope.isModal1show = true;
                    });
                }

                 /**检查能量是否够4发炮弹**/
                function testEnergy(total_cost,percent,paid_value,remain_energy) {
                    var per_cost=total_cost*percent/10; // 每发消耗￥=每发消耗能量=原价*定金百分比/10
                    var remain_amount=remain_energy/per_cost;//剩余能量支持的弹药数量
                    if(remain_amount>=10){
                        $scope.energy.tips = '喵喵体力充足，快去赢取更多折扣吧！';
                        return true;
                    }else{
                        if(paid_value>0){
                            if(remain_amount>=1){
                                $scope.energy.tips = '进入游戏赢取更多折扣吧！';
                                return true;
                            }else{
                                $scope.energy.tips = '喵喵体力不支，可先去付定金获得赠送体力！';
                                return false;
                            }
                        }else{
                            if(remain_amount<4){
                                $scope.energy.tips = '喵喵体力不足，可先去付定金获得赠送体力！';
                                return false;
                            }else if(remain_amount>=4){
                                $scope.energy.tips = '喵喵体力不多，建议先去支付定金获赠体力！';
                                return true;
                            }
                        }
                    }
                }

                function loadUserData(callback) {
                    RefreshUserDataSer.requestUserData(function (response, status) {
                        if (status == 1) {
                            $scope.data_user = RefreshUserDataSer.getData();
                            if(callback){
                                callback();
                            }
                        }
                    });

                }
            }
        }
    })
angular.module('LuckyMall')

    .directive('ngTitle', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if(attrs.ngTitle) {
                    scope.$watch(attrs.ngTitle, function (new_val,old_val) {
                        if(new_val!=old_val) {
                            document.title = new_val;
                            woopraTrack();
                        }
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


/**
 * 抢红包按钮
 */
    .directive('btnGetCoupons', function () {
        return {
            restrict: 'E',
            template: '<div class="img-btn-getCoupons txt-no-select" ng-click="open()"></div>',
            scope:{

            },
            controller:function($scope,$rootScope,$state){
                $scope.open=function(){
                    if($rootScope.isLogin) {
                        $rootScope.isGetCouponsModalShow = true;
                    }else{
                        $scope.$emit("show-login-modal");
                    }
                };
            }
        };
    })



    .directive('modalDownloadApp', function (svc,API) {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/modal-downloadApp.html',
            replace: true,
            scope:{
                visible:'=visible'
            },
            controller: function ($scope, $rootScope) {
                $scope.closeDownloadAppModal=function(){
                    $rootScope.isDownloadAppModalShow=false;
                    $scope.visible=false;
                };
            }
        };
    })





/**
 * 抢红包模态框
 */
    .directive('modalGetCoupons', function (svc,API) {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/modal-getCoupons.html',
            scope:{
                visible:'=',
                count:'=count'
            },
            controller:function($scope,$rootScope,Host,TokenSer){
                $scope.close=function(){
                    $scope.visible=false;
                   $rootScope.isGetCouponsModalShow=$scope.visible;
                    $scope.index=0;
                };
                $scope.index=0;
                $scope.changeStep=function(new_index){
                    $scope.index=new_index;
                };
                $scope.play=function(){
                    if($scope.count>0) {
                        var g_url = Host.game.fishing + '?id=0&mode=5&from=' + Host.playFrom + '&authorization=' + TokenSer.getToken(); //设置游戏地址
                        $rootScope.openGame(g_url, '', '');
                        $scope.close();
                    }
                };
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
            replace: true
        };
    })
    /*页头*/
    .directive('header', function () {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/header.html',
            replace: true,
            transclude: true,
            controller: function ($scope,$rootScope, LoginSer, $timeout, $rootScope,$state) {
                $scope.exit = function () {
                    $rootScope.$broadcast('exit');
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
    .directive('subHeader', function ($timeout) {
        return {
            restrict: 'E',
            templateUrl: 'common/templates/sub-header.html',
            replace: true,
            transclude: true,
            controller: function ($rootScope, $scope,$state, LoginSer,CartSer,SearchSer,SOTDSvc) {
               // $scope.kw='';//搜索关键字
                $scope.kw_list=[];
                $scope.isKeywordShow=true;
                $scope.clearKw=function(){
                    $timeout(function(){
                        $scope.kw='';
                    });
                };
                $scope.hideKwList=function(){
                    $timeout(function(){
                        $scope.isKeywordShow=false;
                    },300);
                };
                $scope.showKwList=function(){
                    $timeout(function(){
                        $scope.isKeywordShow=true;
                    },100);
                };
                $scope.getKeyWordList=function(kw){
                    //console.log(kw);
                    if(kw!=''&&kw!=null&&kw!=undefined) {
                        var params = {
                            "key": kw,
                            "psize": 10,
                            "pindex": 0
                        };
                        SearchSer.getKeyWords(params, function (response, status) {
                            if (status == 1) {
                                $scope.kw_list = response;
                                //console.log($scope.kw_list);
                            }
                        });
                    }
                };
                $scope.openDownloadAppModal=function(){
                    $rootScope.isModalDownloadAppShow = true;
                };
                $scope.search=function(){
                    if($scope.kw){
                        $state.go('search',{keyword:$scope.kw});
                        $scope.kw_list=[];
                    }
                };
                $scope.goItemPage=function(kw){
                    $state.go('item',{id:kw.key});
                };
                $scope.searchWithKeyWord=function(kw){
                    if(kw){
                        $state.go('search',{keyword:kw});
                    }
                };

                /*跳转订单确认页*/
                $scope.goConfirm = function () {
                    var orders=$rootScope.sp_data_cart;
                    if(orders.length>0) {
                        var tmp_data={
                            "from":'shoppingCart',
                            "orders":[]
                        };
                        for(var o in orders){
                            if(typeof orders[o]=='object') {
                                tmp_data.orders.push(orders[o].Id);
                            }
                        }
                        SOTDSvc.set(tmp_data);
                        $state.go('confirmOrder');
                    }
                };
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
            scope:{

            },
            controller: function ($scope, $timeout,CategorySer) {
                var initCategory=function(){
                    var data = CategorySer.getData().slice(0, 9);//截9个  不能再多了
                    var result = [];
                    for (var o in data) {
                        var obj = {
                            categoryName: data[o].CategoryName,
                            link: '/list/category=' + data[o].Id + '/0/',
                            children: []
                        };
                        //result.push(obj);
                        if (data[o].SubCategories == '' || data[o].SubCategories == null) {//没有子类时
                            for (var s in data[o].FilterModels) {
                                var children = {
                                    childName: data[o].FilterModels[s].FilterName,
                                    link: '/list/category=' + data[o].Id + '/0/',
                                    items: []
                                };
                                for (var i in data[o].FilterModels[s].FilterItemModels) {
                                    var item = {
                                        itemName: data[o].FilterModels[s].FilterItemModels[i].ItemValue,
                                        link: '/list/category=' + data[o].Id + '/0/filter=' + data[o].FilterModels[s].Id + '_0_items=' + data[o].FilterModels[s].FilterItemModels[i].Id
                                    };
                                    children.items.push(item);
                                }
                                obj.children.push(children);
                            }
                        } else {
                            for (var s in data[o].SubCategories) {
                                var children = {
                                    childName: data[o].SubCategories[s].CategoryName,
                                    link: '/list/category=' + data[o].Id + '_' + data[o].SubCategories[s].Id + '/0/',
                                    items: []
                                };
                                for (var i in data[o].SubCategories[s].FilterModels) {
                                    for (var j in data[o].SubCategories[s].FilterModels[i].FilterItemModels) {
                                        var item = {
                                            itemName: data[o].SubCategories[s].FilterModels[i].FilterItemModels[j].ItemValue,
                                            link: '/list/category=' + data[o].Id + '_' + data[o].SubCategories[s].Id + '/0/filter=' + data[o].SubCategories[s].FilterModels[i].Id + '_0_items=' + data[o].SubCategories[s].FilterModels[i].FilterItemModels[j].Id
                                        };
                                        children.items.push(item);
                                    }
                                }
                                obj.children.push(children);
                            }
                        }
                        result.push(obj);
                    }
                    $scope.data = result;
                };
                if(CategorySer.getData()!=null){
                    initCategory();
                }else {
                    CategorySer.requestData(function () {
                        initCategory();

                    });
                }
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
                            //console.log(attrs.require)
                            if (attrs.value) {
                                element.attr('value', remain_time + '秒');
                                if (remain_time > 0&&attrs.require=='true') {
                                    countDown();
                                } else {
                                    element.attr('disabled', false);
                                    element.attr('value', org_value);
                                }
                            } else {
                                element.html(remain_time + '秒');
                                if (remain_time > 0&&attrs.require=='true') {
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
                var reg = /^[1][0123456789]\d{9}$/;
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
                    },100);
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
    /* 图片自适应*/
    .directive('imgAdaptSelf', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                var old_src=attrs.tempSrc;
                var parent_w=element[0].offsetParent.clientWidth;
                var parent_h=element[0].offsetParent.clientHeight;
                function checkSize(){
                    element.checkSize=setTimeout(function(){
                        element.width=element[0].clientWidth;
                        element.height=element[0].clientHeight;
                        if(element.width>0&&element.height>0&&attrs.src!=old_src){
                            if(element.width>element.height){//高度小于宽度  把高度先撑满
                                element.width*=(parent_h/element.height);
                                element.height=parent_h;
                                if(element.width<parent_w){//高度撑满后宽度仍小于容器宽  把宽度撑满  高度按比例放大
                                    element.height*=(parent_w/element.width);
                                    element.width=parent_w;
                                }

                            }else{
                                element.height*=(parent_w/element.width);
                                element.width=parent_w;
                                if(element.height<parent_h){
                                    element.width*=(parent_h/element.height);
                                    element.height=parent_h;
                                }
                            }
                            element[0].style.width=element.width+'px';
                            element[0].style.height=element.height+'px';
                            clearTimeout(element.checkSize);
                            delete  element.checkSize;
                        }else{
                            checkSize();
                        }
                    },10);
                }
                checkSize();
            }
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
    .directive('innerHtml', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if(attrs.innerHtml) {
                    scope.$watch(attrs.innerHtml, function (html,o) {
                        if(html!=o) {
                            var content =$compile('<div>'+ html+'</div>')(scope);
                            element.append(content);
                            runJs(content[0].children);
                            function runJs(obj){//执行内部的js
                                for(var o in obj){
                                    if(obj[o].nodeName=='SCRIPT'){
                                        eval(obj[o].innerHTML);
                                    }else{
                                       if(obj[o].children){
                                            runJs(obj[o].children);
                                        }
                                    }
                                }
                            }
                        }
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
                    var watcher=scope.$watch(attrs.timeDown,function(new_val,old_val){
                        if(new_val!=undefined&&new_val!='') {
                            start(new_val);
                            watcher();
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
                            if (element.time >= 0) {
                                element.time--;
                                var new_inner = initTime(element.time);
                                element.html(new_inner);
                            } else {
                                clearInterval(element.timer);
                                if (typeof scope[attrs.timeOver] == "function") {
                                    scope[attrs.timeOver]();
                                }
                                if(attrs.timevershow){
                                    element.html(attrs.timevershow);
                                }
                            }
                        }, 1000);
                    }

                }

                function initTime(time){
                    var t=time;
                    if(t<0){
                        if(attrs.timevershow){
                            element.html(attrs.timevershow);
                        }
                        return;
                    }
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



    /*剩余时间(小时)*/
    .directive('timeDownAdapt', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if(attrs.timeDownAdapt){
                    var watcher=scope.$watch(attrs.timeDownAdapt,function(new_val,old_val){
                        if(new_val!=undefined&&new_val!='') {
                            start(new_val);
                            watcher();
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
                            if (element.time >= 0) {
                                element.time--;
                                var new_inner = initTime(element.time);
                                element.html(new_inner);
                            } else {
                                clearInterval(element.timer);
                                if (typeof scope[attrs.timeOver] == "function") {
                                    scope[attrs.timeOver]();
                                }
                                if(attrs.timevershow){
                                    element.html(attrs.timevershow);
                                }
                            }
                        }, 1000);
                    }

                }

                function initTime(time){
                    var t=time;
                    if(t<0){
                        if(attrs.timevershow){
                            element.html(attrs.timevershow);
                        }
                        return;
                    }
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
                    if(str.indexOf('天')>=0){
                        var str_index=str.indexOf('时');
                        str=str.substring(0,str_index+1);
                        return '剩余'+str;
                    }else if(str.indexOf('时')>=0){
                        var str_index=str.indexOf('分');
                        str=str.substring(0,str_index+1);
                        return '剩余'+str;
                    }else{
                        return str;
                    }
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
.directive('gameWindow', function ($rootScope,$state,MyOrdersSer,Host,SOTDSvc,$timeout) {
    return {
        restrict: 'E',
        templateUrl: 'common/templates/iFrame-game.html?v='+v,
        replace: true,
        link: function (scope, element, attrs) {

              scope.isLoadingGame=true;

                scope.$watch("game.url", function (new_val, old_val) {
                     if (new_val!=old_val) {
                         var IFrame_game=element.find('iframe');
                         IFrame_game.attr('src', new_val);
                     }
                });
                window.addEventListener('message',gameHandler,false);

                function gameHandler(e){
                  //  if(e.origin=='http://www.xingyunmao.cn:9004'){
                    if(e.origin==Host.localMsgOrigin){
                        switch (e.data.mode) {
                            case 'closeGame':
                                break;
                        }
                    }else {
                        if (e.data === true) {
                            console.log('####################loadedGame##################');
                            $timeout(function(){
                                scope.isLoadingGame = false;
                            });
                        } else {
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
                                    SOTDSvc.set({
                                        "from":'game',
                                        "orders":[$rootScope.game.orderId]
                                    });
                                    $state.go('confirmOrder');
                                    break;
                                case 3://登陆
                                    $state.go('login');
                                    break;
                                case 4://
                                    scope.$emit('refresh-coupon');
                                    if($state.current.name=='home') {

                                    }else {
                                        $rootScope.$broadcast('cart-update');
                                       // $state.go('item', {goods_id: $rootScope.game.commodityId});
                                    }
                                    break;
                                case 5://无任何处理
                                    break;
                            }
                            $rootScope.closeGame();
                            scope.isLoadingGame = true;
                        }
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


    /*点击滚动到指定高度*/
    .directive('btnScrollTo', function ($timeout,$rootScope) {
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
                    var o_val=parseInt(attrs.btnScrollTo);//参照
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


/**
 * 游戏菜单
 */
    .directive('modalGameMenu',function(){
        return{
            restrict:'E',
            replace:true,
            templateUrl:'./common/templates/modal-gameMenu.html',
            scope:{
                visible:"=visible",
                gameUrl:"=gameurl",
                gameMenu:'=gamectrl'
            },
            controller:function($scope,$rootScope){
                $scope.closeModal=function(){
                    $scope.visible=false;
                };
                $scope.play=function(game_name){
                    $scope.visible=false;
                    $rootScope.openGame($scope.gameMenu.gameUrl[game_name],$scope.gameMenu.orderId,$scope.gameMenu.commodityId);
                };
            },
            link:function(scope,element,attrs){
            }
        }
    })

    /*获取折扣modal*/
    .directive('modalGetDiscount', function () {
        return {
            restrict: 'E',
            replace:true,
            scope:{
                visible:"=visible",
                order:"=data",
                imgHost:'=imghost',
                couponBalance:'=couponbalance',
                gameMenu:'=gamectrl'
            },
            templateUrl: 'common/templates/modal-getDiscount.html?v='+v,
            controller:function($scope,$rootScope,$state,$timeout,SOTDSvc,RefreshUserDataSer,TokenSer,Host,BalanceSvc,svc,API){
                $scope.isCheckedWallet=false;
                $scope.isCheckedCoupon=false;
                $scope.content_exchange_energy=false;
                $scope.content_exchange_earnest=false;
                $scope.content_pay_earnest=false;
                $scope.use_wallet=0;
                $scope.use_coupon=0;

                $scope.gameType=-1;//-1  未定义  0没玩过游戏  1捕鱼   2猜拳



                $scope.btn_val={
                    exc_coupon:'使用幸运豆进入游戏',
                    exc_db:'确定抵用'
                };
                $scope.energy={
                    isEnough:false,
                    tips:''
                };
                if(TokenSer.getToken()) {
                    watchOrder();
                    loadBalanceInfo();
                }else{
                    $rootScope.$on("user-login",function(new_val,old_val){
                        watchOrder();
                        loadBalanceInfo();
                    });
                }
                $scope.exchange_val=function(){
                    return $scope.use_wallet+$scope.use_coupon;
                };
                $scope.showContentExchangeEnergy=function(){
                    $scope.content_exchange_energy=true;
                };
                $scope.showContentExchangeEarnest=function(){
                    $scope.content_exchange_earnest=true;
                };

                $scope.hideContentExchangeEnergy=function(){
                    $scope.content_exchange_energy=false;
                };
                $scope.hideContentExchangeEarnest=function(){
                    $scope.content_exchange_earnest=false;
                };

                $scope.closeModal=function(){
                    $scope.visible=false;
                };
                $scope.toggleCheckWallet=function(){
                    $scope.isCheckedWallet = !$scope.isCheckedWallet;
                    initUsedBalance($scope.data_balance.Coupon.Balance,$scope.data_balance.Wallet.Balance);
                    if($scope.use_coupon==0){
                        $scope.isCheckedCoupon=false;
                    }
                };
                $scope.toggleCheckCoupon=function(){
                    $scope.isCheckedCoupon=!$scope.isCheckedCoupon;
                    initUsedBalance($scope.data_balance.Coupon.Balance,$scope.data_balance.Wallet.Balance);
                    if($scope.use_wallet==0){
                        $scope.isCheckedWallet=false;
                    }
                };
                $scope.payEarnest=function(){
                    if($scope.order.EarnestBusinessType==0) {
                        $state.go('payForEarnest', {params: $scope.order.Id});
                    }else{
                        swal({
                            title: "该订单已经获取过优惠了！",
                            text:'获取过优惠的订单不能再支付定金',
                            type: "error",
                            confirmButtonColor: "#6dd17b",
                            confirmButtonText: "确定"
                        });
                        $scope.visible=false;
                    }
                };
                $scope.purchase=function(){
                    SOTDSvc.set({
                        "from":'purchase',
                        "orders":[$scope.order.Id]
                    });
                    $state.go('confirmOrder');
                };
                function watchOrder() {
                    $scope.$watch("order", function (new_val, old_val) {
                        if (new_val != old_val) {
                            initPage($scope.order);
                            $scope.content_exchange_energy = false;
                            $scope.content_exchange_earnest = false;
                            $scope.content_pay_earnest = false;
                        }
                    });
                }
                $scope.play=function(){
                    if(($scope.order.EarnestBusinessType==1||$scope.order.EarnestBusinessType==3)&&$scope.energy.isEnough) {
                            if(parseInt($scope.order.OriginalPrice)>200){//大于两百时直接进入捕鱼游戏
                                $rootScope.openGame($scope.gameMenu.gameUrl.fishing,$scope.gameMenu.orderId,$scope.gameMenu.commodityId);
                            }else{
                                if($scope.gameType==0) {
                                    $scope.gameMenu.show = true;
                                }else if($scope.gameType==1){
                                    $rootScope.openGame($scope.gameMenu.gameUrl.fishing,$scope.gameMenu.orderId,$scope.gameMenu.commodityId);
                                }else if($scope.gameType==2){
                                    $rootScope.openGame($scope.gameMenu.gameUrl.fingerGuessing,$scope.gameMenu.orderId,$scope.gameMenu.commodityId);
                                }
                            }
                            $scope.visible=false;
                    }
                }
                $scope.playWidthCoupon=function(){
                    if($scope.data_balance.Coupon.Balance>=$scope.order.earnest_cost) {
                        $scope.btn_val.exc_coupon = '正在处理...';
                        BalanceSvc.exchangeWithCoupon($scope.order.Id, function (response, status) {
                            if (status == 1) {
                                ga('send', 'pageview', {
                                    'page': '/enter_paygame',
                                    'title': '进入付定金游戏'
                                });
                                loadBalanceInfo();
                                $rootScope.$broadcast('cart-update');
                                if(parseInt($scope.order.OriginalPrice)>200){
                                    $rootScope.openGame($scope.gameMenu.gameUrl.fishing, $scope.game_orderId, $scope.game_commodityId);
                                }else {
                                    $scope.gameMenu.show = true;
                                }
                                $scope.visible = false;
                            } else {
                                swal('兑换失败!', '', 'error');
                                $scope.visible = false;
                            }

                            $scope.btn_val.exc_coupon = '使用红包进游戏';
                        });
                    }
                };


                $scope.exchange=function(){
                    if(($scope.use_coupon+$scope.use_wallet)<=0){
                        return;
                    }
                    var params={
                        "id":$scope.order.Id,
                        "useCoupon": $scope.use_coupon>0?true:false,
                        "useWallet": $scope.use_wallet>0?true:false
                    };
                    $scope.btn_val.exc_db='正在处理...';
                    BalanceSvc.exchangeWithCouponAndWallet(params,function(response,status){
                        if(status==1){
                            $scope.visible = false;
                            swal({
                                    title: "抵用成功，是否立即支付?",
                                    type: "success",
                                    showCancelButton: true,
                                    confirmButtonColor: "#DD6B55",
                                    cancelButtonText: '取消',
                                    confirmButtonText: "确定",
                                    closeOnConfirm: true
                                },
                                function () {
                                    $scope.purchase();
                                }
                            );
                            loadBalanceInfo();
                            $rootScope.$broadcast('cart-update');
                        }else{
                            swal('抵用失败!', '', 'error');
                            $scope.visible = false;
                        }
                        $scope.btn_val.exc_db='确定抵用';
                    });
                };

                /**检查能量是否够4发炮弹**/
                function testEnergy() {
                   /* svc.get(API.gameType.url+$scope.order.Id,function(response,status){
                            if(status==200){
                                $scope.gameType=response;
                            }
                        });*/
                    return true;
                }
                function initPage(order){
                   var data_orgCost = Math.round(order.UnitPrice * $scope.order.Count);//打折前总花费
                    $scope.order.earnest_cost=parseInt($scope.order.TotalEarnestPrice)-$scope.order.EarnestMoney;//需支付的定金总额
                    if (testEnergy()) {//判断能量是否能进入游戏; 参数依次为  总价 定金比例 已付定金 用户剩余能量
                        $scope.energy.isEnough = true;
                        if($scope.order.EarnestBusinessType==1||$scope.order.EarnestBusinessType==3) {
                            $scope.isCanPlay = true;
                        }else{
                            $scope.isCanPlay=false;
                        }
                    } else {
                        $scope.energy.isEnough = false;
                        $scope.isCanPlay=false;
                    }

                    $scope.gameMenu.gameUrl.fishing = Host.game.fishing + '?id=' + order.Id + '&mode=1&from=' + Host.playFrom + '&authorization=' + TokenSer.getToken(); //设置游戏地址
                    $scope.gameMenu.gameUrl.fingerGuessing = Host.game.fingerGuessing + '?id=' + order.Id + '&mode=1&from=' + Host.playFrom + '&authorization=' + TokenSer.getToken(); //设置游戏地址
                    $scope.gameMenu.orderId = order.Id;
                    $scope.gameMenu.commodityId = order.CommodityId;

                    initExchangeData($scope.data_balance.Coupon.Balance,$scope.data_balance.Wallet.Balance);
                    console.log($scope.data_balance);
                    if($scope.order.EarnestBusinessType==0) {
                        if ($scope.data_balance.Coupon.Balance >= $scope.order.earnest_cost) {
                            $timeout(function () {
                                $scope.content_exchange_energy = true;
                            })
                        } else if ($scope.data_balance.Wallet.Balance >= $scope.order.earnest_cost) {
                            // $scope.payEarnest();
                        } else {
                            $scope.payEarnest();
                        }
                    }

                }

               function initExchangeData(coupon_val,wallet_val){
                   var coupon_balance=coupon_val;//红包可支配余额
                   var wallet_balance=wallet_val;//钱包可支配余额

                   $scope.isCheckedCoupon=false;
                   if(wallet_balance>0){
                       $scope.isCheckedWallet=true;
                   }else{
                       $scope.isCheckedWallet=false;
                   }
                    initUsedBalance(coupon_balance,wallet_balance);


               }


              function initUsedBalance(coupon_val,wallet_val){
                  var coupon_balance=coupon_val;//红包可支配余额
                  var wallet_balance=wallet_val;//钱包可支配余额
                  if($scope.isCheckedCoupon){
                      if(coupon_balance>=$scope.order.earnest_cost){
                          $scope.use_coupon=$scope.order.earnest_cost;
                          $scope.use_wallet=0;
                      }else{
                          $scope.use_coupon=coupon_balance;
                          if($scope.isCheckedWallet) {
                              if (wallet_balance >= $scope.order.earnest_cost - $scope.use_coupon) {
                                  $scope.use_wallet = $scope.order.earnest_cost - $scope.use_coupon;
                              } else {
                                  $scope.use_wallet = wallet_balance;
                              }
                          }else{
                              $scope.use_wallet=0;
                          }
                      }
                  }else{
                      $scope.use_coupon=0;
                      if($scope.isCheckedWallet) {
                          if (wallet_balance >= $scope.order.earnest_cost - $scope.use_coupon) {
                              $scope.use_wallet = $scope.order.earnest_cost - $scope.use_coupon;
                          } else {
                              $scope.use_wallet = wallet_balance;
                          }
                      }else{
                          $scope.use_wallet=0;
                      }
                  }
              }
                function loadBalanceInfo(){
                    BalanceSvc.requestBalanceInfo(function(response,status){
                        if(status==1){
                            $scope.data_balance=response;
                            $scope.couponBalance=response.Coupon.Balance;

                        }
                    });
                }


            },
            link: function (scope, element, attrs) {

            }
        };
    })

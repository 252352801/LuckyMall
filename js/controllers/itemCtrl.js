angular.module('LuckyMall.controllers')
    .controller('ItemCtrl',
    function ($scope, ItemSer, $state, $stateParams, LoginSer, $rootScope, $timeout, TokenSer, CategorySer, Host, MyOrdersSer, CartSer) {
        var goods_id = $stateParams.goods_id;
        $scope.loaded = false;
        $scope.isLogin = LoginSer.isLogin();//是否应经登录
        $scope.showingTab = 'tab1';//当前显示的tab
        $scope.showTips = false;//开始默认不显示提示
        $scope.finishSelect = false;
        loadGoodsDetailsData();//加载本页数据
        $scope.amount = 1;//当前数量
        $scope.isFreePlayed = false;
        $scope.data_eo={};
        $scope.btn_value = {//按钮文字
            addToCart: '加入购物车',
            buyNow: '立即抢折扣',
            freePlay:'试玩抢折扣'
        };
        $scope.discount = function (cur_price, old_price) {
            return ((cur_price / old_price) * 10).toFixed(1);
        };
        /*数量减*/
        $scope.reduce = function () {
            if($scope.data_goods.status==1) {
                if (!isFinishSelect()) {
                    $timeout(function () {
                        $scope.showTips = true;
                    });
                    return;
                } else if ($scope.amount > 1) {
                    $scope.amount--;
                }
            }
        };
        /*数量加*/
        $scope.add = function () {
            if($scope.data_goods.status==1) {
                if (!isFinishSelect()) {
                    $timeout(function () {
                        $scope.showTips = true;
                    });
                    return;
                } else if ($scope.amount < $scope.inventory) {
                    if (!$scope.data_goods.IsCanFree) {
                        $scope.amount++;
                    } else {
                        if ($scope.isFreePlayed) {
                            $scope.amount++;
                        } else {
                            swal({
                                title: "免费游戏模式的商品每次限购一件喔",
                                type: "error",
                                confirmButtonText: "确定"});
                        }
                    }
                }
            }
        };
        /*选择属性*/
        $scope.selectAttr = function (attr, val, attr_index, val_index, disabled) {
            if($scope.data_goods.status==1) {//商品正在销售时
                if (!disabled || $scope.isNoSelection()) {
                    if ($scope.choice.length <= 0) {
                        swal({
                            title: "抱歉，该商品暂时缺货!",
                            text: '库存正在补充，敬请期待',
                            type: "error",
                            confirmButtonText: "确定"});
                        return;
                    } else {
                        checkedAttr(attr, val, attr_index, val_index);
                        if (isFinishSelect()) {//选择完毕显示库存
                            var selected_sku = ItemSer.getSkuByChoice($scope.choice);//已选的sku
                            $scope.sku_id = selected_sku.Id;//sku_id，用以提交
                            $scope.inventory = selected_sku.Stock;//库存
                            $scope.showTips = false;
                            $scope.finishSelect = true;
                        }
                    }
                } else {
                    clearChecked();
                    checkedAttr(attr, val, attr_index, val_index);
                }
            }
        };
        /*tab切换*/
        $scope.showTab = function (tab_name) {
            $scope.showingTab = tab_name;
        };
        /* 是否没有选项被选择*/
        $scope.isNoSelection = function () {
            var len = 0;
            for (var i = 0; i < $scope.choice.length; i++) {
                if ($scope.choice[i] == -1) {
                    len++
                }
            }
            if (len == $scope.choice.length) {
                return true;
            } else {
                return false;
            }
        };
        $scope.goLogin = function () {//跳转登录页面
            $state.go('login');
        };
        $rootScope.$on('user-login', function () {
            $timeout(function () {
                $scope.isLogin = LoginSer.isLogin();
            }, 5);
            isCanFreePlay();
        });
        /*玩游戏之后刷新状态*/
        $rootScope.$on('refresh-item-isCanFree',function(){
            isCanFreePlay();
        });

        /*只有一个选项时默认勾选*/
        function autoSelected(){
            var obj=$scope.data_goods.Property;
            for(var o in obj){
                if(obj[o].attributes.length==1){
                    $scope.selectAttr(obj[o].name,obj[o].attributes[0].value,o,0,obj[o].attributes[0].disabled);
                }
            }
        }
        function isCanFreePlay(){
            if ($scope.isCanFree) {//测试是否玩使用过免费机会
                ItemSer.isCanFreePlay(goods_id, function (response, status) {
                    if (status == 1) {
                        if (response) {
                            $timeout(function(){
                                $scope.isFreePlayed = false;
                            });
                        } else {
                            $timeout(function(){
                                $scope.isFreePlayed = true;
                            });
                        }
                    }
                });
            }
        }
        $scope.overMax = function (reset_value) {
            swal({
                title: "库存不足!",
                text: '购买数量已帮您设为最大库存',
                type: "error",
                confirmButtonText: "确定"});
            $timeout(function () {
                $scope.amount = reset_value;
            });
        };

        /*赢折扣*/
        $scope.playForDiscount = function (goods_id) {
            if (LoginSer.isLogin()) {
                if (!isFinishSelect()) {//如果没有完成选择
                    $timeout(function () {
                        $scope.showTips = true;
                    });
                    return;
                }
                if ($scope.amount <= 0) {
                    swal({
                        title: "数量有误!",
                        text: '请输入正确的商品数量',
                        type: "error",
                        confirmButtonText: "确定"
                    });
                    $scope.amount = 1;
                    return;
                }
                var _type = ($scope.data_goods.IsCanFree == true) ? 1 : 0;
                var params = {
                    "Type": _type,
                    "CommodityId": $scope.data_goods.Id,
                    "UserId": LoginSer.getData().UserModel.Id,
                    "SkuId": $scope.sku_id,
                    "Count": $scope.amount,
                    "Specifications": angular.toJson(ItemSer.getSelectedAttributes())
                };
                $scope.btn_value.freePlay='正在处理...';
                ItemSer.addToCart(params, function (response,status) {
                    $scope.btn_value.freePlay='试玩抢折扣';
                    if (status == 1) {
                        $scope.$emit('cart-update');
                        ga('send', 'pageview', {
                            'page': '/enter_freegame',
                            'title': '进入免费游戏'
                        });

                        var g_url=Host.game + '?orderid=' + response.Data.Id + '&mode=2&from=' + Host.hostname + '&authorization=' + TokenSer.getToken();
                        $scope.openModalBFFP(g_url,response.Data.Id,response.Data.CommodityId);
                    } else if(status == 0) {
                        handleErrs(response.Code);
                    } else if (status == 2) {
                        $scope.$emit("exit");
                        $scope.$emit("show-login-modal");
                    }
                });
            } else {
                handleLoginTimeOut();
            }
        };

        /*下单*/
        $scope.createOrder = function (act, callback) { //act : 0加入购物车  1 立即购买
            if ($scope.choice.length <= 0) {
                swal({
                    title: "该商品处于缺货状态!",
                    text: '看一看其他的商品吧',
                    type: "info",
                    confirmButtonText: "确定"
                });
                return;
            }
            if (!isFinishSelect()) {//如果没有完成选择
                $timeout(function () {
                    $scope.showTips = true;
                });
                return;
            }
            if (!LoginSer.isLogin()) {
                $scope.$emit("show-login-modal");
                return;
            }
            if ($scope.amount <= 0) {
                swal({
                    title: "购买数量有误!",
                    text: '请输入正确的商品数量',
                    type: "error",
                    confirmButtonText: "确定"
                });
                $scope.amount = 1;
                return;
            }
            var _type = ($scope.data_goods.IsCanFree == true) ? 1 : 0;
            if($scope.isFreePlayed){ //如果已经玩过
                _type=0;
            }
            var params = {
                "Type": _type,
                "CommodityId": $scope.data_goods.Id,
                "UserId": LoginSer.getData().UserModel.Id,
                "SkuId": $scope.sku_id,
                "Count": $scope.amount,
                "Specifications": angular.toJson(ItemSer.getSelectedAttributes())
            };
            if (act == 0) {
                $scope.btn_value.addToCart = '正在处理...';
            } else if (act == 1) {
                $scope.btn_value.buyNow = '正在处理...';
            }
            ItemSer.addToCart(params, function (response, status) {
                if (status == 1) {
                    $scope.$emit('cart-update');
                    if (act == 0) {
                        $scope.btn_value.addToCart = '加入购物车';
                        callback();
                    } else if (act == 1) {
                        $scope.purchase_order=response.Data;//立即购买的订单
                        $scope.showModal1($scope.purchase_order);
                        $scope.btn_value.buyNow = '立即抢折扣';
                       /* CartSer.requestCartData(function (response, status) {
                            $scope.btn_value.buyNow = '立即抢折扣';
                            if (status == 1) {
                                $state.go('confirmOrder', {source: 'source=purchase'});
                            }
                        });*/
                    }
                } else if (status == 0) {
                    $scope.btn_value.addToCart = '加入购物车';
                    $scope.btn_value.buyNow = '立即抢折扣';
                    handleErrs(response.Code);

                }else if (status == 2) {
                    handleLoginTimeOut();
                }
            });
        };
        function loadItemData(){
            $scope.loaded = false;
            ItemSer.requestData(goods_id, function () { //加载商品详细信息数据
                $scope.data_goods = ItemSer.getData();//产品数据
                if($scope.data_goods==null){
                    $state.go("home");
                    return;
                }
                $scope.isCanFree = $scope.data_goods.IsCanFree;
                if($scope.isLogin) {
                    isCanFreePlay();
                }
                $scope.choice = new Array();//产品规格选择器，存放被选的属性的下标（索引）
                $scope.loaded=true;
                if (ItemSer.getData().StockKeepingUnitModels != null) {
                    /*根据sku产品属性的长度初始化选择器choice*/
                    var len = ItemSer.getData().StockKeepingUnitModels[0].Specifications.split(',').length;
                    for (var i = 0; i < len; i++) { //sku数组字符串分离
                        $scope.choice.push(-1);
                    }
                } else {

                }
                if($scope.data_goods.status==1) {
                    autoSelected();
                }
            });
        }
        /*加载本页数据*/
        function loadGoodsDetailsData() {
            loadItemData();
            ItemSer.requestCategoryByGoodsId(goods_id, function (response, status) {
                if (status == 1) {
                    $scope.data_category = response;//品类数据  包含所属项和品类ID
                    if (CategorySer.getData() == null) {
                        CategorySer.requestData(function () {
                            $scope.data_categoryName = CategorySer.getCategoryById($scope.data_category.categoryId).CategoryName;//通过品类ID获取品类名
                        });
                    } else {
                        $scope.data_categoryName = CategorySer.getCategoryById($scope.data_category.Id).CategoryName;
                    }
                }else if(status==0){

                }
            });
        }

        /*清空选择*/
        function clearChecked() {
            ItemSer.clearSelections();//重置所有isSelected属性
            clearChoice();//重置选择器
            $scope.inventory = null;//重置库存显示
            $scope.amount = 1;
        }

        /*勾选商品属性*/
        function checkedAttr(attr, val, attr_index, val_index) {
            $scope.choice[attr_index] = val_index;
            ItemSer.testSku($scope.choice, function () {
                $timeout(function () {
                    $scope.data_goods = ItemSer.getData();//产品数据
                }, 5);
            });
            ItemSer.selectAttr(attr, val, function () { //function:所选属性已被选择时的回调
                ItemSer.cancelSelection(val);
                cancelChoice(attr_index);
                ItemSer.testSku($scope.choice, function () {
                    $timeout(function () {
                        $scope.data_goods = ItemSer.getData();//产品数据
                    }, 5);
                });
                $scope.inventory = null;//库存
                $scope.amount = 1;//数量重置为1
            });
            if (isFinishSelect()) {//选择完毕显示库存
                var selected_sku = ItemSer.getSkuByChoice($scope.choice);//已选的sku
                $scope.sku_id = selected_sku.Id;//sku_id，用以提交
                $scope.inventory = selected_sku.Stock;//库存
                $scope.finishSelect = true;
            }
        }

        /*是否已完成选择*/
        function isFinishSelect() {
            var len = 0;
            for (var i = 0; i < $scope.choice.length; i++) {
                if ($scope.choice[i] == -1) {
                    len++;
                }
            }
            if (len == 0) {
                return true;
            } else {
                return false;
            }
        }

        /*重置选项容器choice*/
        function clearChoice() {
            for (var i = 0; i < $scope.choice.length; i++) {
                $scope.choice[i] = -1;
            }
            $scope.finishSelect = false;
        }

        /*取消某选项*/
        function cancelChoice(attr_index) {
            $scope.choice[attr_index] = -1;
            $scope.finishSelect = false;
        }

        /*处理登陆超时*/
        function handleLoginTimeOut(){
            $scope.isLogin=false;
            $scope.$emit('login-time-out');
            $scope.$emit("show-login-modal");
        }
        /*处理下单错误*/
        function handleErrs(err_code){
            if (err_code == '0X50') {
                swal({
                    title: "请不要重复下单!",
                    text: '您可以在购物车或“我的订单”里看到它',
                    type: "error",
                    confirmButtonText: "确定"
                });
            }else if(err_code == '0X51'){
                swal({
                    title: "折扣卡与订单不匹配!",
                    /*text: '错误码：0X51',*/
                    type: "error",
                    confirmButtonText: "确定"
                });
            }else if(err_code == '0X52'){
                swal({
                    title: "订单状态异常!",
                    /*text: '错误码：0X52',*/
                    type: "error",
                    confirmButtonText: "确定"
                });
            }else if(err_code == '0X60'){
                swal({
                    title: "购物车已有试玩订单，请处理后再加入商品!",
/*                    text: '错误码：0X60',*/
                    type: "error",
                    confirmButtonText: "确定"
                });
            }else if(err_code== '0X61'){
                swal({
                    title: "商品的试玩次数已用完!",
                    /*text: '错误码：0X61',*/
                    type: "error",
                    confirmButtonText: "确定"
                });
            } else if(err_code== '0X62'){
                swal({
                    title: "该商品一次只能购买一件喔!",
                    text: '提供免费模式的商品，一次限购一件',
                    type: "error",
                    confirmButtonText: "确定"
                });
            }else if (err_code== '0XXX') {
                swal({
                    title: "未知错误!",
                    text: '错误码：0XXX',
                    type: "error",
                    confirmButtonText: "确定"
                });
            }
        }
    });

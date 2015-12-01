angular.module('LuckyCat.controllers')
    .controller('GoodsDetailsCtrl', function ($scope, GoodsDetailsSer, $state, $stateParams, LoginSer, $rootScope, $timeout, TokenSer,CategorySer,Host) {
        var goods_id = $stateParams.goods_id;
        $scope.loaded = false;
        $scope.isLogin = LoginSer.isLogin;//是否应经登录
        $scope.showingTab = 'tab1';//当前显示的tab
        $scope.showTips = false;//开始默认不显示提示
        $scope.finishSelect = false;
        loadGoodsDetailsData();//加载本页数据
        $scope.amount = 1;//当前数量
        $scope.loading = true;
        $scope.discount = function (cur_price, old_price) {
            return ((cur_price / old_price) * 10).toFixed(1);
        };
        /*数量减*/
        $scope.reduce = function () {
            if ($scope.amount > 1) {
                $scope.amount--;
            }
        };
        /*数量加*/
        $scope.add = function () {
            if ($scope.amount < $scope.inventory) {
                $scope.amount++;
            }
        };
        /*选择属性*/
        $scope.selectAttr = function (attr, val, attr_index, val_index, disabled) {
            if (!disabled || $scope.isNoSelection()) {
                if ($scope.choice.length <= 0) {
                    swal({
                        title: "抱歉，该商品暂时缺货!",
                        text: '库存正在补充，敬请期待',
                        type: "error",
                        confirmButtonText: "确定"});
                    return;
                }
                checkedAttr(attr, val, attr_index, val_index);
                if (isFinishSelect()) {//选择完毕显示库存
                    var selected_sku = GoodsDetailsSer.getSkuByChoice($scope.choice);//已选的sku
                    $scope.sku_id = selected_sku.Id;//sku_id，用以提交
                    $scope.inventory = selected_sku.Stock;//库存
                    $scope.showTips = false;
                    $scope.finishSelect = true;
                }
            } else {
                clearChecked();
                checkedAttr(attr, val, attr_index, val_index);
            }
        };
        /*tab切换*/
        $scope.showTab = function (tab_name) {
            $scope.showingTab = tab_name;
        };
        /*计算价格*/
        $scope.computePrice = function (price) {
            return price.toFixed(2);
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
                $scope.isLogin = LoginSer.isLogin;
            }, 5);
        });

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
                    "Specifications": angular.toJson(GoodsDetailsSer.getSelectedAttributes())
                };
                GoodsDetailsSer.addToCart(params, function (response, status) {
                    if (status == 1) {
                        $scope.$emit('cart-update');
                        location.href = Host.game + '?orderid=' + response.Data.Id + '&from=' + Host.gameOverPage + '&authorization=' + TokenSer.getToken();
                    } else {
                        if (status == 0) {
                            if (response.Code == '0XXX') {
                                swal({
                                    title: "未知错误!",
                                    text: '错误码：0XXX',
                                    type: "error",
                                    confirmButtonText: "确定"
                                });
                            }
                        }
                        if (status == 2) {
                            $scope.$emit("show-login-modal");
                        }
                    }
                });
            } else {
                $scope.$emit("show-login-modal");
            }
        };

        /*加入购物车*/
        $scope.addToCart = function (callback) {
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
            var params = {
                "Type": _type,
                "CommodityId": $scope.data_goods.Id,
                "UserId": LoginSer.getData().UserModel.Id,
                "SkuId": $scope.sku_id,
                "Count": $scope.amount,
                "Specifications": angular.toJson(GoodsDetailsSer.getSelectedAttributes())
            };
            GoodsDetailsSer.addToCart(params, function (response, status) {
                if (status == 1) {
                    console.log('加入购物成功！');
                    callback();
                    $scope.$emit('cart-update');
                } else {
                    if (status == 0) {
                        if (response.Code == '0XXX') {
                            swal({
                                title: "未知错误!",
                                text: '错误码：0XXX',
                                type: "error",
                                confirmButtonText: "确定"
                            });
                        }
                    }
                    if (status == 2) {
                        swal({
                            title: "您的账号在别处登陆，请退出后重新登陆!",
                            type: "error",
                            confirmButtonText: "确定"
                        });
                    }
                }
            });
        };
        /*加载本页数据*/
        function loadGoodsDetailsData() {
            $scope.loading = true;
            var loaded = 0;
            GoodsDetailsSer.requestData(goods_id, function () { //加载商品详细信息数据
                $scope.data_goods = GoodsDetailsSer.getData();//产品数据
                $scope.choice = new Array();//产品规格选择器，存放被选的属性的下标（索引）
                loaded++;
                isFinishLoad();
                if (GoodsDetailsSer.getData().StockKeepingUnitModels != null) {
                    /*根据sku产品属性的长度初始化选择器choice*/
                    var len = GoodsDetailsSer.getData().StockKeepingUnitModels[0].Specifications.split(',').length;
                    for (var i = 0; i < len; i++) { //sku数组字符串分离
                        $scope.choice.push(-1);
                    }
                } else {

                }
            });
            GoodsDetailsSer.requestCategoryByGoodsId(goods_id, function (response, status) {
                if (status == 1) {
                    $scope.data_category = response;//品类数据  包含所属项和品类ID
                    if(CategorySer.getData()==null){
                        CategorySer.requestData(function(){
                            $scope.data_categoryName=CategorySer.getCategoryById($scope.data_category.categoryId).CategoryName;//通过品类ID获取品类名
                        });
                    }else{
                        $scope.data_categoryName=CategorySer.getCategoryById($scope.data_category.categoryId).CategoryName;
                    }
                }
                loaded++;
                isFinishLoad();
            });

            function isFinishLoad() {
                if (loaded >= 2) {
                    $timeout(function () {
                        $scope.loading = false;
                    }, 300)
                    $scope.loaded = true;//加载完成标志
                }
            }
        }
        /*清空选择*/
        function clearChecked() {
            GoodsDetailsSer.clearSelections();//重置所有isSelected属性
            clearChoice();//重置选择器
            $scope.inventory = null;//重置库存显示
            $scope.amount = 1;
        }

        /*勾选商品属性*/
        function checkedAttr(attr, val, attr_index, val_index) {
            $scope.choice[attr_index] = val_index;
            GoodsDetailsSer.testSku($scope.choice, function () {
                $timeout(function () {
                    $scope.data_goods = GoodsDetailsSer.getData();//产品数据
                }, 5);
            });
            GoodsDetailsSer.selectAttr(attr, val, function () { //function:所选属性已被选择时的回调
                GoodsDetailsSer.cancelSelection(val);
                cancelChoice(attr_index);
                GoodsDetailsSer.testSku($scope.choice, function () {
                    $timeout(function () {
                        $scope.data_goods = GoodsDetailsSer.getData();//产品数据
                    }, 5);
                });
                $scope.inventory = null;//库存
                $scope.amount = 1;//数量重置为1
            });
            if (isFinishSelect()) {//选择完毕显示库存
                var selected_sku = GoodsDetailsSer.getSkuByChoice($scope.choice);//已选的sku
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

    });

angular.module('LuckyMall.controllers')
    .controller('ItemCtrl',
    ['$scope', 'ItemSer', '$state', '$stateParams', 'LoginSer', '$rootScope', '$timeout', 'TokenSer', 'CategorySer', 'Host','UserSer', 'OrderDetailsSer',
    function ($scope, ItemSer, $state, $stateParams, LoginSer, $rootScope, $timeout, TokenSer, CategorySer, Host,UserSer, OrderDetailsSer) {


        function Item(item_id){
            var $this=this;
            this.id=item_id;//商品id
            this.itemData={};//商品数据
            this.categoryData={};//分类数据
            this.rankingData=[];//排行榜数据
            this.POOData=[];//其他平台的价格
            this.categoryName='';//商品所属分类名称
            this.loading=false;//是否在加载
            this.curTab=1;//当前显示的tab
            this.showTips=false;//未选择规格时的提示
            this.isFinishSelect=false;//是否完成选择
            this.amount=1;//当前输入的数量
            this.inventory=null;//库存
            this.selecedSkuId=null;//选择的sku id
            this.selecedSpecifications='';//选择的规格信息
            this.isModalGetDiscountShow=false;//是否显示“获取折扣”模态框
            this.choices=[];//已选择的规格
            this.primeNumber=[];//个数为属性长度的质数集合
            this.btnVal={ //按钮文字
                addToCart: {
                    org:'试玩练手',
                    temp:'正在处理...',
                    cur:'试玩练手'
                },
                buyNow: {
                    org:'抢折购买',
                    temp:'正在处理...',
                    cur:'抢折购买'
                }
            };
            /**
             * 清除某种规格的选项
             */
            var clearSelected=function(obj){
                for(var o in obj){
                    obj[o].isSelected=false;
                }
            };
            /**
             * 验证是按钮否可用
             */
            var testDisabled=function(){
                for(var o in $this.itemData.Property){
                    for(var p in $this.itemData.Property[o].attributes){
                        var temp=$this.choices[o].primeNumber;//暂存已选项的质数
                        $this.choices[o].primeNumber=$this.itemData.Property[o].attributes[p].primeNumber;
                        var cur_product=1;
                        for(var n in $this.choices){
                            cur_product*=$this.choices[n].primeNumber;
                        }
                        var isDisabled=true;//按钮是否禁用
                        for(var n in $this.itemData.StockKeepingUnitModels){//匹配是否满足组合
                            if($this.itemData.StockKeepingUnitModels[n].Specifications.product%cur_product==0){
                                isDisabled=false;
                                break;
                            }
                        }
                        $this.itemData.Property[o].attributes[p].disabled=isDisabled;
                        $this.choices[o].primeNumber=temp;//重取已选项的质数
                    }
                }
            };
            /**
             * 是否已经选择完毕
             * @returns {boolean}
             */
            var isFinishSelect=function(){
                for(var o in $this.choices) {
                    if ($this.choices[o].attr == null) {
                        return false;
                    }
                }
                return true;
            };

            /**
             *清除一行的选项
             */
            var clearSelection=function(){
                for(var o in $this.itemData.Property){
                    for(var n in $this.itemData.Property[o].attributes){
                        $this.itemData.Property[o].attributes[n].isSelected=false;
                    }
                }
            };

            /**
             * 生成指定数量的质数
             * @param count
             * @returns {Array}
             */
            var createPrimeNumber=function(count){
                var result=[];
                var cur_num=2;
                while(result.length<count){
                    var flag=true;
                    for(var i=2;i<cur_num;i++){
                        if(cur_num%i==0){
                            flag=false;
                            break;
                        }
                    }
                    if(flag){
                        result.push(cur_num);
                    }
                    cur_num++;
                }
                return result;
            };

            /**
             * 只有一个选项时默认勾选
             */
            var autoSelected=function(){
                var obj=$this.itemData.Property;
                for(var o in obj){
                    if(obj[o].attributes.length==1){
                        //$scope.selectAttr(obj[o].name,obj[o].attributes[0].value,o,0,obj[o].attributes[0].disabled,obj[o].attributes[0].valid);
                        $this.toggleSelect(o,0,obj[o].attributes[0]);
                    }
                }
            };
            /*处理登陆超时*/
            var  handleLoginTimeOut=function(){
                $scope.isLogin=false;
                $scope.$emit('login-time-out');
                $scope.$emit("show-login-modal");
            };
            /*处理下单错误*/
            var handleErrs=function(err_code){
                if (err_code == '0X50') {
                    swal({
                        title: "请不要重复下单!",
                        text: '您可以在购物车或订单列表里看到它',
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
            };
            /**
             * tab切换
             * @param index
             */
            this.changeTab=function(index){
                $this.curTab=index;
            };

            this.isNoSelection=function(){

            };
            //数量减
            this.reduce = function () {
                if($this.itemData.status==1) {
                    if ($this.amount > 1) {
                        $this.amount--;
                    }
                }
            };
            //数量加
            this.add = function () {
                if($this.itemData.status==1) {
                    if($this.inventory==null){
                        $this.amount++;
                    }else if ($this.amount < $this.inventory) {
                        $this.amount++;
                    }
                }
            };

            /**
             * 选择和取消选择
             * @param pindex 规格下标
             * @param aindex  属性下标
             * @param obj 选项对象
             */
            this.toggleSelect=function(pindex,aindex,obj){
                if(!obj.disabled&&obj.valid) {//若按钮可用
                    if(obj.isSelected){
                        clearSelected($this.itemData.Property[pindex].attributes);
                    }else{
                        clearSelected($this.itemData.Property[pindex].attributes);
                        obj.isSelected=true;
                    }
                }else{
                    return;
                }
                if(obj.isSelected){
                    $this.choices[pindex].attr=$this.itemData.Property[pindex].attributes[aindex].index;//添加已选项
                    $this.choices[pindex].primeNumber=$this.itemData.Property[pindex].attributes[aindex].primeNumber;//添加已选项对应质数
                }else{
                    $this.choices[pindex].attr=null;
                    $this.choices[pindex].primeNumber=1;
                }
                testDisabled();
                console.log($this.choices);
                if(isFinishSelect()){//如果完成选择
                    var choices_product=1;
                    for(var o in $this.choices){
                        choices_product*=$this.choices[o].primeNumber;
                    }
                    for(var o in $this.itemData.StockKeepingUnitModels){
                        if($this.itemData.StockKeepingUnitModels[o].Specifications.product==choices_product){
                            $this.inventory=$this.itemData.StockKeepingUnitModels[o].Stock;
                            $this.selecedSkuId=$this.itemData.StockKeepingUnitModels[o].Id;
                        }
                    }
                    $this.showTips=false;
                    if($this.inventory<$this.amount){//如果当前数量大于库存，将数量设为库存
                        $this.amount=$this.inventory;
                    }
                    var spec_result=[];
                    for (var o in $this.itemData.Property) {//构建已选商品的属性字符串
                        for (var i in $this.itemData.Property[o].attributes) {
                            if($this.itemData.Property[o].attributes[i].isSelected==true){
                                var attr={"name":$this.itemData.Property[o].name,"value":$this.itemData.Property[o].attributes[i].value};
                                spec_result.push(attr);
                            }
                        }
                    }
                    $this.selecedSpecifications=angular.toJson(spec_result);//选择属性的字符串
                }else{
                    $this.selecedSpecifications='';
                    $this.inventory=null;
                    $this.selecedSkuId=null;
                }
            };
            /**
             * 测试库存
             */
            this.testInventory=function(){
                if($this.inventory!=null){
                    if($this.amount>$this.inventory){
                        swal({
                            title: "库存不足!",
                            text: '购买数量已帮您设为最大库存',
                            type: "error",
                            confirmButtonText: "确定"});
                        $timeout(function () {
                            $this.amount =$this.inventory;
                        });
                    }
                }
            };
            /**
             * 加载数据
             */
            this.loadData=function(){
                $this.loading = true;
                ItemSer.requestData($this.id, function () { //加载商品详细信息数据
                    $this.itemData = ItemSer.getData();//产品数据
                    if($this.itemData==null){
                        $state.go("home");
                        return;
                    }
                    $this.choices = [];//产品规格选择器，存放被选的属性的下标（索引）
                    $this.loading = false;
                    if ($this.itemData.StockKeepingUnitModels != null) {
                        /*根据sku产品属性的长度初始化选择器choice*/
                        var len = $this.itemData.StockKeepingUnitModels[0].Specifications.split(',').length;
                        for (var i = 0; i < len; i++) {
                            var obj={
                                attr:null,
                                primeNumber:1//用于存属性对应的质数
                            };
                            $this.choices .push(obj);
                        }
                        var attr_len=0;//可选属性长度
                        for(var o in $this.itemData.Property){//计算属性长度
                            attr_len+=$this.itemData.Property[o].attributes.length;
                        }
                        $this.primeNumber=createPrimeNumber(attr_len);//根据属性长度生成质数
                        var pn_index=0;//质数下标
                        for(var o in $this.itemData.Property){//可选项绑定逐个绑定质数
                            for(var i in $this.itemData.Property[o].attributes){
                                $this.itemData.Property[o].attributes[i].primeNumber=$this.primeNumber[pn_index];
                                $this.itemData.Property[o].attributes[i].index=parseInt(i);
                                pn_index++;
                            }
                        }
                        for(var o in $this.itemData.StockKeepingUnitModels){//sku计算对应质数乘积
                            var sku_spec=angular.fromJson($this.itemData.StockKeepingUnitModels[o].Specifications);
                            var product=1;
                            for(var i=0;i<sku_spec.length;i++){//给每一条sku绑定一个质数的积
                                product*=$this.itemData.Property[i].attributes[sku_spec[i]].primeNumber;
                            }
                            $this.itemData.StockKeepingUnitModels[o].Specifications={
                                val:angular.toJson(sku_spec),
                                product:product

                            };
                        }
                        console.log($this);

                    }
                    if($this.itemData.status==1) {
                        autoSelected();
                    }
                });
                ItemSer.requestCategoryByGoodsId($this.id, function (response, status) {//加载分类数据
                    if (status == 1) {
                        $this.categoryData = response;//品类数据  包含所属项和品类ID
                        CategorySer.requestData(function () {
                            $this.categoryName = CategorySer.getCategoryById($this.categoryData.categoryId).CategoryName;//通过品类ID获取品类名
                        });
                    }else if(status==0){
                    }
                });
                ItemSer.getRanking($this.id,function(response,status){//加载排行榜
                    if(status==1){
                        $this.rankingData=response;
                    }
                });
                ItemSer.getPricesOfOthers($this.id,function(response,status){
                    if(status==1){
                        $this.POOData=response;//其他平台的价格
                    }
                });
            };

            /*试玩练手*/
            this.playFreeGame = function () {
                var auth='';
                if(!$scope.isLogin){
                    if($rootScope.session_key!=null) {
                        auth = $rootScope.session_key;
                        var g_url = Host.game + '?id=' + $this.id + '&mode=2&from=' + Host.playFrom+ '&authorization=' + auth;
                        $rootScope.openGame(g_url, '', $this.id);
                    }else{
                        UserSer.getSessionKey(function(response,status){
                            if(status==1){
                                $rootScope.session_key=response;
                                auth = $rootScope.session_key;
                                var g_url = Host.game + '?id=' + $this.id + '&mode=2&from=' + Host.playFrom + '&authorization=' + auth;
                                $rootScope.openGame(g_url, '', $this.id);
                            }
                        });
                    }
                }else{
                    auth=TokenSer.getToken();
                    var g_url = Host.game + '?id=' + $this.id + '&mode=2&from=' + Host.playFrom + '&authorization=' + auth;
                    $rootScope.openGame(g_url, '', $this.id);
                }
            };
            /*下单*/
            this.createOrder = function (act, callback) { //act : 0加入购物车  1 立即购买
                if ($this.choices.length <= 0) {
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
                        $this.showTips = true;
                    });
                    return;
                }
                if (!LoginSer.isLogin()) {
                    $scope.$emit("show-login-modal");
                    return;
                }
                if ($this.amount <= 0) {
                    swal({
                        title: "购买数量有误!",
                        text: '请输入正确的商品数量',
                        type: "error",
                        confirmButtonText: "确定"
                    });
                    $this.amount = 1;
                    return;
                }
                var _type = 0;

                var params = {
                    "Type": _type,
                    "CommodityId": $this.id,
                    "UserId": LoginSer.getData().UserModel.Id,
                    "SkuId": $this.selecedSkuId,
                    "Count": $this.amount,
                    "Specifications":  $this.selecedSpecifications
                };
                if(LoginSer.getData()==null){
                    $scope.$emit("show-login-modal");
                    return;
                }
                if (act == 0) {
                    $this.btnVal.addToCart.cur = $this.btnVal.addToCart.temp;
                } else if (act == 1) {
                    $this.btnVal.buyNow.cur = $this.btnVal.buyNow.temp;
                }
                ItemSer.addToCart(params, function (response, status) {
                    if (status == 1) {
                        $scope.$emit('cart-update');
                        if (act == 0) {
                            $this.btnVal.addToCart.cur = $this.btnVal.addToCart.org;
                            callback();
                        } else if (act == 1) {
                            var order_id=response.Data.Id;//立即购买的订单
                            OrderDetailsSer.requestData(order_id,function(response,status){
                                if(status==1) {
                                    $scope.showModalGetDisc(response);
                                    $this.btnVal.buyNow.cur = $this.btnVal.buyNow.org;
                                }
                            });

                        }
                    } else if (status == 0) {
                        $this.btnVal.addToCart.cur = $this.btnVal.addToCart.org;
                        $this.btnVal.buyNow.cur = $this.btnVal.buyNow.org;;
                        handleErrs(response.Code);

                    }else if (status == 2) {
                        handleLoginTimeOut();
                    }
                });
            };

        }

        {//init
            $scope.isLogin = LoginSer.isLogin();//是否应经登录
            $scope.isModalGetDiscountShow=false;
            $scope.item = new Item($stateParams.goods_id);
            $scope.item.loadData();
        }

        $scope.showModalGetDisc=function(order){
            $scope.isModalGetDiscountShow=true;
            $scope.data_modal_getDisc=order;
        };
        $scope.goLogin = function () {//跳转登录页面
            $state.go('login');
        };
        $rootScope.$on('user-login', function () {
            $timeout(function () {
                $scope.isLogin = LoginSer.isLogin();
            }, 5);
        });

    }]);

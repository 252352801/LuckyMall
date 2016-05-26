angular.module('LuckyMall.controllers')
    .controller('FsCtrl',
    ['$scope', 'ItemSer', '$state', '$stateParams', 'LoginSer','CartSer', '$rootScope', '$timeout', 'TokenSer', 'CategorySer', 'Host','UserSer', 'OrderDetailsSer','ShowOffOrdersSer','svc','API','FreeShoppingSer',
    function ($scope, ItemSer, $state, $stateParams, LoginSer, CartSer,$rootScope, $timeout, TokenSer, CategorySer, Host,UserSer, OrderDetailsSer,ShowOffOrdersSer,svc,API,FreeShoppingSer) {


        function Item(item_id){
            var $this=this;
            this.id=item_id;//商品id
            this.itemData={};//商品数据
            this.categoryData={};//分类数据
            this.rankingData=[];//排行榜数据
            this.POOData=[];//其他平台的价格
            this.SOOData=[];//晒单数据
            this.currentPageOfSOO=[];//晒单数据
            this.fs={};
            this.pageOfSOO={//晒单分页
                index:0,
                pageSize:10,
                count:0,
                pageCount:0,
                items:[],
                loading:false
            };
            $this.selectedActivity={},
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

            this.params={};//购买的参数
            this.btnVal={ //按钮文字
                addToCart: {
                    org:'试玩练手',
                    temp:'正在处理...',
                    cur:'试玩练手'
                },
                buyNow: {
                    org:'幸运购',
                    temp:'正在处理...',
                    cur:'幸运购'
                }
            };
            this.menuLuckyBuy={
                show:false
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
                if(index==3){
                    $this.loadSOOData();
                }
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
                        for(var o in response){
                            response[o].sSiteName=response[o].name.length>4?response[o].name.substr(0,4):response[o].name;
                        }
                        $this.POOData=response;//其他平台的价格
                    }
                });
            };

            var getCurrentPageOfSOO=function(pg_index){
                return $this.SOOData.slice((pg_index)*$this.pageOfSOO.pageSize,(pg_index+1)*$this.pageOfSOO.pageSize)
            };
            this.loadSOOData=function(){
                if($this.SOOData.length!=0){
                    return;
                }
                var params={
                    "cid": $this.id,
                    "pSize": 100,
                    "pIndex": 0
                };
                $this.pageOfSOO.loading=true;
                  ItemSer.getSOOData(params,function(response,status){
                      if(status==1){
                          $this.SOOData=response;
                          $this.pageOfSOO.count=$this.SOOData.length;
                          $this.pageOfSOO.pageCount=Math.ceil($this.pageOfSOO.count/$this.pageOfSOO.pageSize);
                          for(var i= 0;i<$this.pageOfSOO.pageCount;i++){
                              $this.pageOfSOO.items.push(i);
                          }
                          $this.currentPageOfSOO=getCurrentPageOfSOO(0);
                      }
                      $this.pageOfSOO.loading=false;
                  });
            };
            this.prevPageOfSOO=function(){
                if($this.pageOfSOO.index>0) {
                    $this.pageOfSOO.index--;
                    $this.currentPageOfSOO =getCurrentPageOfSOO($this.pageOfSOO.index);
                }
            };
            this.nextPageOfSOO=function(){
                if($this.pageOfSOO.index<$this.pageOfSOO.pageCount-1){
                    $this.pageOfSOO.index++;
                    $this.currentPageOfSOO =getCurrentPageOfSOO($this.pageOfSOO.index);
                }
            };
            this.changePageOfSOO=function(new_index){
                $this.pageOfSOO.index=new_index;
                $this.currentPageOfSOO =getCurrentPageOfSOO($this.pageOfSOO.index);
            };
            this.likeSOO=function(soo){//点赞
                if(!soo.liked) {

                    ShowOffOrdersSer.like(soo.Id, function (response, status) {
                        if (status == 1) {
                            if (response.code == 0) {
                                //点赞成功
                                soo.liked = true;
                                soo.LikeCount = response.count;
                            } else if (response.code == -1) {
                                //点赞异常(通常是未登陆)
                                soo.liked = true;
                                soo.LikeCount++;
                            } else if (response.code == 1) {
                                //已经点赞
                                soo.liked = true;
                                 soo.LikeCount++;
                            } else if (response.code == 2) {
                                //点赞失败
                                soo.liked = true;
                                soo.LikeCount++;
                            }
                        }
                    });
                }
            };
            /*试玩练手*/
            this.playFreeGame = function () {
                var auth='';
                $scope.gameMenu.commodityId=$this.id;
                var initGame=function(authorization){
                    $scope.gameMenu.gameUrl.fingerGuessing=Host.game.fingerGuessing+ '?id=' + $this.id + '&mode=2&from=' + Host.playFrom+ '&authorization=' + authorization;
                    $scope.gameMenu.gameUrl.fishing=Host.game.fishing+ '?id=' + $this.id + '&mode=2&from=' + Host.playFrom+ '&authorization=' + authorization;
                    if($this.itemData.maxPrice>200) {
                        $rootScope.openGame($scope.gameMenu.gameUrl.fishing,$scope.gameMenu.orderId,$scope.gameMenu.commodityId);
                    }else{
                        $scope.gameMenu.show = true;
                    }
                };
                if(!$scope.isLogin){
                    if($rootScope.session_key!=null) {
                        auth = $rootScope.session_key;
                        initGame(auth);
                    }else{
                        UserSer.getSessionKey(function(response,status){
                            if(status==1){
                                $rootScope.session_key=response;
                                auth = $rootScope.session_key;
                                initGame(auth);
                            }
                        });
                    }
                }else{
                    auth=TokenSer.getToken();
                    initGame(auth);
                }
            };
            /*下单*/
            this.luckyBuy = function () {
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

               $this.params = {
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

                $this.menuLuckyBuy.show=true;

            };

            var enterFreeGame=function(){
                $rootScope.paramsOfTryGame.skuId=$this.params.SkuId;
                $rootScope.paramsOfTryGame.count=$this.params.Count;
                $rootScope.paramsOfTryGame.specifications=$this.params.Specifications;

                $this.menuLuckyBuy.show=false;
                $scope.gameMenu.gameUrl.fingerGuessing=Host.game.fingerGuessing+ '?id=' + $this.id + '&mode=3&from=' + Host.playFrom+ '&authorization=' + TokenSer.getToken();
                $scope.gameMenu.gameUrl.fishing=Host.game.fishing+ '?id=' + $this.id + '&mode=3&from=' + Host.playFrom+ '&authorization=' + TokenSer.getToken();
                if($this.itemData.maxPrice>200){
                    $rootScope.openGame($scope.gameMenu.gameUrl.fishing,$scope.gameMenu.orderId,$scope.gameMenu.commodityId);
                }else{
                    $scope.gameMenu.show = true;
                }
            };
            this.tryAction = function () {
                var orders = $rootScope.sp_data_cart;//获取购物车数据
                for (var o in orders) {
                    if (orders[o].CommodityId == $this.id) {
                        $this.menuLuckyBuy.show = false;
                        if (orders[o].OrderType == 1) {
                            swal({
                                    title: "已存在免费订单，是否删除继续?",
                                    text: "同一时间只能有一个免费订单喔!",
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#DD6B55",
                                    cancelButtonText: '取消',
                                    confirmButtonText: "确定",
                                    closeOnConfirm: true,
                                    showLoaderOnConfirm: true
                                },
                                function () {
                                    CartSer.cancelOrder(orders[o].Id, function (response, status) {
                                        if (status == 1) {
                                            $scope.$emit('cart-update');
                                            enterFreeGame();
                                        } else {
                                            swal({
                                                title: '无法删除该订单！',
                                                text: '重试一下吧',
                                                type: 'error',
                                                confirmButtonText: "好的"
                                            });
                                        }
                                    });
                                }
                            );

                        } else {
                            swal({
                                title: '该商品已下订单！',
                                text: '您可以在购物车里找到它',
                                type: 'info',
                                confirmButtonText: "好的"
                            });
                        }
                        return;
                    }
                }
                for (var o in orders) {
                    if (orders[o].OrderType == 1) {
                        swal({
                                title: "已存在免费订单，是否删除继续?",
                                text: "同一时间只能有一个免费订单喔!",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#DD6B55",
                                cancelButtonText: '取消',
                                confirmButtonText: "确定",
                                closeOnConfirm: true,
                                showLoaderOnConfirm: true
                            },
                            function () {
                                CartSer.cancelOrder(orders[o].Id, function (response, status) {
                                    if (status == 1) {
                                        $scope.$emit('cart-update');
                                        enterFreeGame();
                                    } else {
                                        swal({
                                            title: '无法删除该订单！',
                                            text: '重试一下吧',
                                            type: 'error',
                                            confirmButtonText: "好的"
                                        });
                                    }
                                });
                            }
                        );
                        return;
                    }
                }
                //   for(var o in)
                enterFreeGame();


            };
            this.normalAction=function(){//正常的流程
                //$this.btnVal.buyNow.cur = $this.btnVal.buyNow.temp;
                ItemSer.addToCart($this.params, function (response, status) {
                    $this.menuLuckyBuy.show=false;
                    if (status == 1) {
                        $scope.$emit('cart-update');
                        var order_id=response.Data.Id;//立即购买的订单
                        OrderDetailsSer.requestData(order_id,function(resp,stat){
                            if(stat==1) {
                                $scope.showModalGetDisc(resp);
                               // $this.btnVal.buyNow.cur = $this.btnVal.buyNow.org;
                            }
                        });
                        $rootScope.woopra.evet.PO.properties.productname=$this.itemData.CommodityName;
                        $rootScope.woopra.track($rootScope.woopra.evet.PO);

                    } else if (status == 0) {
/*                        $this.btnVal.addToCart.cur = $this.btnVal.addToCart.org;
                        $this.btnVal.buyNow.cur = $this.btnVal.buyNow.org;*/
                        handleErrs(response.Code);

                    }else if (status == 2) {
                        handleLoginTimeOut();
                    }
                });
            };
            this.closeLuckyBuyMenu=function(){
                $this.menuLuckyBuy.show=false;
            };
            this.showBigImgOfSOO=function(index,soo){
                if(soo.bigImgIndex==index||index==-1){
                    soo.bigImgIndex=-1;
                }else{
                    soo.bigImgIndex=index;
                    soo.bigImgUrl=soo.images[index];
                }
            };
            this.loadFsData=function(){
                svc.get(API.welfareDetails.url+$stateParams.fs_id,function(response,status){
                    if(status==200&&response){
                        response.Property=angular.fromJson(response.Specifications);
                        $this.fs=response;
                        var cur_time=new Date($this.fs.CurrentTime.replace(/-/g,'-')).getTime();
                        var end_time=new Date($this.fs.EndTime.replace(/-/g,'-')).getTime();
                        $this.remainTime=(end_time-cur_time)/1000;
                    }
                });
            };
            var selectGameAction=function(callback){
                FreeShoppingSer.createOrder($this.selectedActivity.Id,function(resp,stat){
                    var is_success=false;
                    if(stat==200&&resp){
                        if(resp.Data){
                            is_success=true;
                        }
                    }
                    if(is_success){
                        $scope.gameMenu.orderId=resp.Data.Id;
                        $scope.gameMenu.commodityId=resp.Data.CommodityId;
                        $scope.gameMenu.gameUrl.fingerGuessing = Host.game.fingerGuessing + '?id=' + $scope.gameMenu.orderId + '&mode=6&from=' + Host.playFrom + '&authorization=' + TokenSer.getToken();
                        $scope.gameMenu.gameUrl.fishing = Host.game.fishing + '?id=' + $scope.gameMenu.orderId + '&mode=6&from=' + Host.playFrom + '&authorization=' + TokenSer.getToken();
                        callback();
                    }else{
                        if(resp.Code=='0X202'){
                            swal({
                                title:'幸运豆不足',
                                type:'error',
                                confirmButtonText:'确定',
                                timer:5000
                            });
                        }else{
                            swal({
                                title:resp.Msg,
                                type:'error',
                                confirmButtonText:'确定',
                                timer:5000
                            });
                        }
                    }
                });
            };
            var fsPlayAction=function(fs){//改来改去。。。。这么多回调
                $this.selectedActivity=fs;
                $this.isLoadingChance=true;//正在加载剩余次数
                FreeShoppingSer.getWelfarePlayChance(function (response, status) {
                    if (status == 200) {
                        $myLog('福利社游戏机会：');
                        $myLog(response);
                        if (response >0) {
                            swal({
                                    title: '即将进入"福利社"游戏',
                                    text: "今日您还有" + response + "次机会!",
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#DD6B55",
                                    cancelButtonText: '我再想想',
                                    confirmButtonText: "进入游戏",
                                    closeOnConfirm: true,
                                    showLoaderOnConfirm: false
                                },
                                function () {
                                    $scope.gameMenu.selectAction = function (callback) {
                                        selectGameAction(callback);
                                    };

                                    if (fs.OptionalGameType == 0 || fs.OptionalGameType == 3) {
                                        $timeout(function () {
                                            $scope.gameMenu.show = true;
                                        });
                                    } else if (fs.OptionalGameType == 1) {
                                        selectGameAction(function () {
                                            $timeout(function () {
                                                $rootScope.openGame($scope.gameMenu.gameUrl.fishing, $scope.gameMenu.orderId, $scope.gameMenu.commodityId);
                                            });
                                        });
                                    } else if (fs.OptionalGameType == 2) {
                                        selectGameAction(function () {
                                            $timeout(function () {
                                                $rootScope.openGame($scope.gameMenu.gameUrl.fingerGuessing, $scope.gameMenu.orderId, $scope.gameMenu.commodityId);
                                            });
                                        });
                                    }
                                }
                            );
                        } else {
                            swal('没有更多的机会了！', '明天再来吧', 'info');
                        }
                    }
                    $this.isLoadingChance=false;
                });
            };
            this.fsPlay=function(fs){
                var fs=$this.fs;
                if(fs.SurplusCount==0){
                    swal({
                        title:'该商品已被抢购一空！',
                        text:'看看其他商品吧',
                        type:'error',
                        confirmButtonText:'确定'
                    });
                    return;
                }
                if(!$rootScope.isLogin){
                    $scope.$emit("show-login-modal");
                }else {
                    if(fs.AreaType==1){
                        FreeShoppingSer.testCompleteOrder(function(resp,stat){
                            if(stat==200&&resp){
                                fsPlayAction(fs);
                            }
                        });
                    }else{
                        fsPlayAction(fs);
                    }
                }
            };

        }

        {//init
            if($stateParams.item_id==''||$stateParams.item_id==null||$stateParams.item_id==undefined){
                $state.go('home');
            }else{
                $scope.isLogin = LoginSer.isLogin();//是否应经登录
                $scope.isModalGetDiscountShow=false;
                $scope.item = new Item($stateParams.item_id);
                $scope.item.loadData();
                $scope.item.loadFsData();
            }
        }

        $scope.gameMenu={//游戏菜单
            show:false,
            orderId:'',
            commodityId:'',
            gameUrl:{
                fingerGuessing:'',
                fishing:''
            }
        };


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

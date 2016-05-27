
angular.module('LuckyMall.controllers')
    .controller('FreeShoppingCtrl',
    ['$scope','$rootScope','FreeShoppingSer','$timeout','Host','TokenSer','BalanceSvc',
        function ($scope,$rootScope,FreeShoppingSer,$timeout,Host,TokenSer,BalanceSvc) {

            function FreeShopping(){
                var $this=this;
                this.loading=false;
                this.isLoadingChance=false;//是否在加载次数
                this.selectedActivity={};//当前选择的活动的
               this.remainTime=0;
                this.data=[];
                this.balance={
                    coupon:0
                };
                this.page={
                    index:0,
                    pageSize:10000,
                    count:0,
                    pageCount:0,
                    items:[]
                };
                this.time={
                    h:'00',
                    m:'00',
                    s:'00'
                };
                this.loadBalance=function(){
                    BalanceSvc.requestBalanceInfo(function(response,status){
                        if(status==1){
                            $this.balance.coupon=response.Coupon.Balance;
                        }
                    });
                };
                this.loadData=function(pg_index,is_create_pg){//加载数据   pg_index:页码   is_create_pg:是否创建分页
                    var params={
                        pSize: $this.page.pageSize,
                        pIndex: pg_index
                    };
                    if(is_create_pg) {
                        $this.loading = true;
                    }
                    FreeShoppingSer.requestData(params,function(response,status){
                            if(status==200&&response){
                               $myLog(response);
                                var data=response.Data;
                                $this.data=response.Data;
                                for(var o in data){
                                    data[o].Specifications=angular.fromJson(data[o].Specifications);
                                }
                                $this.data=data;
                                if(is_create_pg) {
                                    $this.page.index=pg_index;

                                    $this.page.count = response.Container.TotalCount;
                                    $this.page.pageCount = Math.ceil($this.page.count/$this.page.pageSize);
                                    $this.page.items=[];
                                    for(var i=0;i<$this.page.pageCount;i++){
                                        $this.page.items.push(i);
                                    }
                                    {//初始化倒计时
                                        var last_act = {};//最迟下架的
                                        var exp_time = 0;//过期时间
                                        for (var o in $this.data) {//取最迟下架的剩余时间作为剩余时间
                                            var t = new Date($this.data[o].EndTime.replace(/-/g, '/')).getTime();
                                            if (t > exp_time) {
                                                exp_time = t;
                                                last_act = $this.data[o];
                                            }
                                        }
                                        var e_time = new Date(last_act.EndTime.replace(/-/g, '/')).getTime();
                                        var c_time = new Date(last_act.CurrentTime.replace(/-/g, '/')).getTime();
                                        $this.remainTime = (e_time - c_time) / 1000;
                                        $this.timeDown();
                                    }
                                }

                            }
                        $this.loading=false;
                    });
                };
                this.prevPage=function(){
                    if($this.page.index>0){
                        $this.page.index--;
                        $this.loadData($this.page.index,false);
                    }

                };
                this.nextPage=function(){
                    if($this.page.index<$this.page.pageCount-1){
                        $this.page.index++;
                        $this.loadData($this.page.index,false);
                    }
                };
                this.changePage=function(index){
                    $this.page.index=index;
                    $this.loadData($this.page.index,false);
                };
               this.timeDown=function(){
                    $timeout(function(){
                        if($this.remainTime>0){
                            $this.remainTime--;
                        }
                        var h=Math.floor($this.remainTime/3600);
                        var m=Math.floor($this.remainTime%3600/60);
                        var s=$this.remainTime%3600%60;
                        $this.time.h=h>=10?h:'0'+h;
                        $this.time.m=m>=10?m:'0'+m;
                        $this.time.s=s>=10?s:'0'+s;
                        $this.timeDown();
                    },1000);
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
                                        closeOnConfirm:true,
                                        showLoaderOnConfirm: false
                                    },
                                    function () {
                                        if($this.balance.coupon*2<fs.EarnestPrice){
                                            setTimeout(function(){
                                                swal({
                                                    title: '幸运豆不足！',
                                                    text: '需要'+fs.EarnestPrice*50+'幸运豆',
                                                    type: 'error',
                                                    confirmButtonText: '确定'
                                                });
                                            },300);
                                            return;
                                        }else{

                                        }
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
                this.fsPlay=function(fs) {
                    if (fs.SurplusCount == 0) {
                        swal({
                            title: '该商品已被抢购一空！',
                            text: '看看其他商品吧',
                            type: 'error',
                            confirmButtonText: '确定'
                        });
                        return;
                    }
                    if (!$rootScope.isLogin) {
                        $scope.$emit("show-login-modal");
                    } else {
                        if($this.isLoadingChance){//禁止疯狂点击
                            swal({
                                title: '请不要频繁操作！',
                                type: 'error',
                                confirmButtonText: '确定'
                            });
                            return;
                        }
                        if(fs.AreaType==1){
                            FreeShoppingSer.testCompleteOrder(function(resp,stat){
                                if(stat==200&&resp){
                                    fsPlayAction(fs);
                                }else if(stat==200&&!resp){
                                    swal({
                                        title:'您需要完成一次幸运购才可参与！',
                                        type:'error',
                                        confirmButtonText:'确定',
                                        timer:5000
                                    });
                                }
                            });
                        }else{
                            fsPlayAction(fs);
                        }

                    }
                }

            }

            $scope.freeShopping=new FreeShopping();
            $scope.freeShopping.loadData(0,true);
            $scope.freeShopping.loadBalance();
            $scope.gameMenu = {//游戏菜单
                show:false,
                orderId: '',
                commodityId: '',
                gameUrl: {
                    fingerGuessing: '',
                    fishing: ''
                },
                selectAction:function(){}//点击游戏按钮的动作
            };



    }]);

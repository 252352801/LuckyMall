
angular.module('LuckyMall.controllers')
    .controller('FreeShoppingCtrl',
    ['$scope','$rootScope','FreeShoppingSer','$timeout','Host','TokenSer',
        function ($scope,$rootScope,FreeShoppingSer,$timeout,Host,TokenSer) {

            function FreeShopping(){
                var $this=this;
                this.loading=false;
               this.remainTime=0;
                this.data=[];
                this.page={
                    index:0,
                    pageSize:10,
                    count:0,
                    pageCount:0,
                    items:[]
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
                                $this.data=response.Data;
                                if(is_create_pg) {
                                    $this.page.index=pg_index;
                                    var e_time=new Date($this.data[0].EndTime.replace(/-/g,'/')).getTime();
                                    var c_time=new Date($this.data[0].CurrentTime.replace(/-/g,'/')).getTime();
                                    $this.remainTime=(e_time-c_time)/1000;
                                    $this.page.count = response.Container.TotalCount;
                                    $this.page.pageCount = Math.ceil($this.page.count/$this.page.pageSize);
                                    $this.page.items=[];
                                    for(var i=0;i<$this.page.pageCount;i++){
                                        $this.page.items.push(i);
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
                this.fsPlay=function(fs){
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
                        FreeShoppingSer.getFreeShoppingPlayChance(function (response, status) {
                            if (status == 200) {
                                $myLog('0元购游戏机会：');
                                $myLog(response);
                                if (response > 0) {
                                    swal({
                                            title: '即将进入"0元抢购"游戏',
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
                                            $scope.gameMenu.gameUrl.fingerGuessing=Host.game.fingerGuessing+ '?id=' + fs.Id + '&mode=6&from=' + Host.playFrom+ '&authorization=' + TokenSer.getToken();
                                            $scope.gameMenu.gameUrl.fishing=Host.game.fishing+ '?id=' +  fs.Id + '&mode=6&from=' + Host.playFrom+ '&authorization='+ TokenSer.getToken();
                                            if(fs.OptionalGameType==0){
                                               /* $timeout(function() {
                                                    $scope.gameMenu.show = true;
                                                });*/
                                                $timeout(function(){
                                                    $rootScope.openGame($scope.gameMenu.gameUrl.fishing,$scope.gameMenu.orderId,$scope.gameMenu.commodityId);
                                                });
                                            }else if(fs.OptionalGameType==1){
                                                $timeout(function(){
                                                    $rootScope.openGame($scope.gameMenu.gameUrl.fishing,$scope.gameMenu.orderId,$scope.gameMenu.commodityId);
                                                });

                                            }else if(fs.OptionalGameType==2){
                                                $timeout(function() {
                                                    $rootScope.openGame($scope.gameMenu.gameUrl.fingerGuessing, $scope.gameMenu.orderId, $scope.gameMenu.commodityId);
                                                });
                                            }else if(fs.OptionalGameType==3){
                                                swal('弹珠游戏未开放！');
                                            }
                                        }
                                    );
                                } else {
                                    swal('没有更多的0元购机会了！', '明天再来吧', 'info');
                                }
                            }

                        });
                    }
                };
            }

            $scope.freeShopping=new FreeShopping();
            $scope.freeShopping.loadData(0,true);
            $scope.gameMenu = {//游戏菜单
                show:false,
                orderId: '',
                commodityId: '',
                gameUrl: {
                    fingerGuessing: '',
                    fishing: ''
                }
            };



    }]);

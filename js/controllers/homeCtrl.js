angular.module('LuckyMall.controllers')
    .controller('HomeCtrl', ['$scope', '$rootScope', '$state', 'HomeSer', '$cookies', '$timeout', 'ShowOffOrdersSer', 'TokenSer', 'UserSer', 'Host', 'ENV',
        function ($scope, $rootScope, $state, HomeSer, $cookies, $timeout, ShowOffOrdersSer, TokenSer, UserSer, Host, ENV) {

            $scope.gameMenu = {
                show: false,
                orderId: '',
                commodityId: '',
                gameUrl: {
                    fingerGuessing: '',
                    fishing: ''
                }
            };
            $scope.modalDownloadApp={
                show:false
            };

            $scope.closeModalDownloadApp=function(){
                $scope.modalDownloadApp.show=false;
            };

            $scope.data_soo = [];


            if (HomeSer.getData().banner == null) {
                HomeSer.requestBannerData(function (response, status) {
                    if (status == 1) {
                        $scope.data_banner = HomeSer.getData().banner;
                    }
                });
            } else {
                $scope.data_banner = HomeSer.getData().banner;
            }

            HomeSer.requestFloorData(function (response, status) {
                if (status == 200) {
                    $scope.data_floor = response;
                }
            });







            $scope.actionBanner = function (banner) {
                if (banner.PromotionType == 1) {//详情
                    if (banner.TypeId != 0) {
                        $state.go('item', {id: banner.TypeId});
                    }
                } else if (banner.PromotionType == 0) {//品牌
                    $state.go('brand', {brand_id: banner.TypeId});
                } else if (banner.PromotionType == 2) {//市场活动
                    $state.go('market', {id: banner.TypeId});
                } else if (banner.PromotionType == 3) {//0元购
                    $state.go('freeShopping');
                } else if (banner.PromotionType == 4) {//游戏
                    var auth = '';
                    $scope.gameMenu.commodityId = ENV == 1 ? 1060328483 : 2494474873;
                    var initGame = function (authorization) {
                        $scope.gameMenu.gameUrl.fingerGuessing = Host.game.fingerGuessing + '?id=' + $scope.gameMenu.commodityId + '&mode=2&from=' + Host.playFrom + '&authorization=' + authorization;
                        $scope.gameMenu.gameUrl.fishing = Host.game.fishing + '?id=' + $scope.gameMenu.commodityId + '&mode=2&from=' + Host.playFrom + '&authorization=' + authorization;
                        if (banner.TypeId == 1) {
                            $rootScope.openGame($scope.gameMenu.gameUrl.fishing, $scope.gameMenu.orderId, $scope.gameMenu.commodityId);
                        } else if (banner.TypeId == 2) {
                            $rootScope.openGame($scope.gameMenu.gameUrl.fingerGuessing, $scope.gameMenu.orderId, $scope.gameMenu.commodityId);
                        } else {
                            $scope.gameMenu.show = true;
                        }
                    };
                    if (!$rootScope.isLogin) {
                        if ($rootScope.session_key != null) {
                            auth = $rootScope.session_key;
                            initGame(auth);
                        } else {
                            UserSer.getSessionKey(function (response, status) {
                                if (status == 1) {
                                    $rootScope.session_key = response;
                                    auth = $rootScope.session_key;
                                    initGame(auth);
                                }
                            });
                        }
                    } else {
                        auth = TokenSer.getToken();
                        initGame(auth);
                    }
                }
            };


            if (localStorage.getItem('access')) {
                $scope.isFirstAcc = false;
            } else {
                $scope.isFirstAcc = true;
            }
            $scope.cancelGuide = function () {
                localStorage.setItem('access', true);
                $scope.isFirstAcc = false;
            };

            loadSOOData();


            $scope.data_soo = [];

            function loadSOOData() {
                var params = {
                    status: 1, pSize: 10, pIndex: 0
                };
                ShowOffOrdersSer.requestData(params, function (response, status) {
                    $myLog(response);
                    if (status == 1 && response) {
                        var result = [];
                        var index = 0;
                        var len = response.length;
                        while (index < len) {
                            result.push(response.slice(index, index + 2));
                            index += 2;
                        }
                        if (result[result.length - 1].length < 2) {
                            result.pop();
                        }
                        $myLog(result);
                        $scope.data_soo = result;
                    }
                })

            }

            $scope.data_broadcasts = [];
            $scope.bro_ctrl = {
                timeout:undefined,
                length:0,
                index:0,
                changeTime:3000
            };
            loadBroadCasts(function(){
                return;
                var count=0;
                if($scope.data_broadcasts.length>2) {
                    slide();
                }
                function slide(){
                    $scope.bro_ctrl.timeout=$timeout(function(){
                        if($scope.bro_ctrl.index< $scope.bro_ctrl.length-1){
                            $scope.bro_ctrl.index++;
                        }else{
                            $scope.bro_ctrl.index=0;
                        }
                        count++;//滚动次数
                        if(count<$scope.bro_ctrl.length*2-1) {
                            slide();
                        }else{//滚动两轮后刷新
                            count=0;
                            //slide();
                            HomeSer.requestBroadCasts(function (response,status) {
                                if(status==200&&response) {
                                    for (var o in response) {
                                        if (response[o].Avatar != '') {
                                            response[o].Avatar = angular.fromJson(response[o].Avatar);
                                        }
                                        response[o].CreateTime=setTimeGoOn(response[o].CreateTime);
                                    }
                                    var new_bro = response;
                                    var temp=new_bro[new_bro.length-1];
                                    new_bro[new_bro.length-1] = $scope.data_broadcasts[$scope.bro_ctrl.index];
                                    $scope.data_broadcasts = new_bro;
                                    $scope.bro_ctrl.length=$scope.data_broadcasts.length;
                                    slide();
                                    $timeout(function(){
                                        $scope.data_broadcasts[new_bro.length-1]=temp;
                                    },$scope.bro_ctrl.changeTime)
                                }else{
                                    slide();
                                }
                            });
                        }
                    },$scope.bro_ctrl.changeTime);
                }
                pollingBroadcasts();
                function pollingBroadcasts(){
                    loadBroadCasts();
                }

            });
            function loadBroadCasts(callback) {
                return;
                HomeSer.requestBroadCasts(function (response,status) {
                    if(status==200&&response) {
                        for (var o in response) {
                            if (response[o].Avatar != '') {
                                response[o].Avatar = angular.fromJson(response[o].Avatar);
                            }
                            response[o].CreateTime=setTimeGoOn(response[o].CreateTime);
                        }
                        $scope.data_broadcasts = response;
                        $scope.bro_ctrl.length = $scope.data_broadcasts.length;
                        $myLog($scope.data_broadcasts);
                    }
                    if (typeof callback == 'function') {
                        callback(response,status);
                    }
                });
            }
            $scope.data_fs=[];
            loadFreeShoppingData();
            function loadFreeShoppingData(){
                var params={
                    pSize: 10,
                    pIndex: 0
                };
                HomeSer.requestFreeShoppingData(params,function(response,status){
                    if(status==200&&response){

                        var arr=response.Data;
                        if(arr.length>0) {
                            for (var o in arr) {
                                arr[o].remainTime = ((new Date(arr[o].EndTime.replace(/-/g, '/')).getTime()) - (new Date(arr[o].CurrentTime.replace(/-/g, '/')).getTime()))/1000;
                            }
                            $timeout(function(){
                                $scope.data_fs=arr;
                            });
                            //$scope.data_fs=arr;
                        }
                    }
                });
            }


            function setTimeGoOn(time_str){
                var time=new Date(time_str.replace(/-/g,"/"));
                var now_time=new Date();
                var time_val=Math.round((now_time-time)/1000);
                var days = Math.floor(time_val / (60 * 60 * 24));//天
                if(days<=30) {
                    var result = '';
                    var sec = time_val % 60;//秒
                    var minutes = Math.floor(time_val % (60 * 60) / 60);//分
                    var hours = Math.floor(time_val % (60 * 60 * 24) / (60 * 60));//时
                    result += (days != 0 ? days + '天' : '') + (hours != 0 ? hours + '小时' : '') + (minutes != 0 ? minutes + '分' : '') + (sec + '秒') + '前';
                    return result;
                }else{
                    return time_str;
                }

            }



        }]);

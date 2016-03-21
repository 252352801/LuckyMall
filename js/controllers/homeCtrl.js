angular.module('LuckyMall.controllers')
 .controller('HomeCtrl',['$scope','$rootScope','$state','HomeSer','$cookies','$timeout','ShowOffOrdersSer','TokenSer','UserSer','Host','ENV',
        function($scope,$rootScope,$state,HomeSer,$cookies,$timeout,ShowOffOrdersSer,TokenSer,UserSer,Host,ENV){

          $scope.gameMenu={
              show:false,
              orderId:'',
              commodityId:'',
              gameUrl:{
                  fingerGuessing:'',
                  fishing:''
              }
          };



        if (HomeSer.getData().banner == null) {
            HomeSer.requestBannerData(function (response, status) {
                if (status == 1) {
                    $scope.data_banner = HomeSer.getData().banner;
                }
            });
        } else {
            $scope.data_banner = HomeSer.getData().banner;
        }

        HomeSer. requestFloorData(function(response,status){
            if(status==200){
                $scope.data_floor=response;
            }
        });




       $scope.actionBanner=function(banner){
           if (banner.PromotionType == 1) {
               if(banner.TypeId!=0){
                   $state.go('item',{id:banner.TypeId});
               }
           } else if (banner.PromotionType == 0) {
               $state.go('brand',{brand_id:banner.TypeId});
           }else if(banner.PromotionType == 2){
               $state.go('market',{id:banner.TypeId});
           }else if(banner.PromotionType == 3){
               //擂台的 已停用
           }else if(banner.PromotionType == 4){
               var auth='';
               $scope.gameMenu.commodityId=ENV==1?459700190:2494474873;
               var initGame=function(authorization){
                   $scope.gameMenu.gameUrl.fingerGuessing=Host.game.fingerGuessing+ '?id=' + $scope.gameMenu.commodityId + '&mode=2&from=' + Host.playFrom+ '&authorization=' + authorization;
                   $scope.gameMenu.gameUrl.fishing=Host.game.fishing+ '?id=' + $scope.gameMenu.commodityId + '&mode=2&from=' + Host.playFrom+ '&authorization=' + authorization;
                   if(banner.TypeId==1) {
                       $rootScope.openGame($scope.gameMenu.gameUrl.fishing,$scope.gameMenu.orderId,$scope.gameMenu.commodityId);
                   }else if(banner.TypeId==2) {
                       $rootScope.openGame($scope.gameMenu.gameUrl.fingerGuessing,$scope.gameMenu.orderId,$scope.gameMenu.commodityId);
                   }else{
                       $scope.gameMenu.show = true;
                   }
               };
               if(!$rootScope.isLogin){
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
           }
       };





        if(localStorage.getItem('access')){
            $scope.isFirstAcc=false;
        }else{
            $scope.isFirstAcc=true;
        }
        $scope.cancelGuide=function(){
            localStorage.setItem('access',true);
            $scope.isFirstAcc=false;
        };

            loadSOOData();
       /* loadActivityData();
        loadChallengeRecord();*/
        /**
         * 活动数据
         */
        function loadActivityData() {
            var params = {
                type:1,
                psize: 10000,
                pindex: 0
            };
            ActivitySer.requestData(params, function (response, status) {
                if (response && status == 200) {

                    function setGroup(index,size){//分组
                        if(index<data_act.length){
                            group.push(data_act.slice(index,size+index));
                            index+=size;
                            setGroup(index,size);
                        }
                    }
                    var  data_act= response;//获取当前页数据
                    //console.log($scope.data_activity);
                    var group=[];
                    var group_size=5;//每组大小
                    setGroup(0,group_size);

                    $scope.data_act_group=group;
                    $scope.act_group_index=0;
                } else {
                    $scope.data_act_group=[];//活动数据组
                }
                slideAct();

                function slideAct(){
                    $timeout(function(){
                        if($scope.act_group_index<$scope.data_act_group.length-1) {
                            $scope.act_group_index++;
                        }else{
                            $scope.act_group_index=0;
                        }
                        slideAct();
                    },5000);
                }
            });
        }


            $scope.data_soo=[];

        function loadSOOData(){
            var params={
                status:1, pSize:4, pIndex: 0
            };
            ShowOffOrdersSer.requestData(params,function(response,status){
                if(status==1&&response){
                    var data_soo=response;

                   $scope.data_soo={
                        orgData:response,
                        general:response.slice(1,4),
                        large:response[0]
                    };
                }
            })

        }











        /**
         * 挑战记录
         */
        function loadChallengeRecord() {
            getData(scrollRecords);

            function getData(callback){
                var params = {
                    "PageIndex": 0,
                    "PageSize": 10,
                    "TotalSize": 10,
                    "TotalPage": 1
                }
                ActivitySer.requestRecord(params, function (response, status) {
                    if (status == 200 && response) {
                        $scope.data_record = response;
                        $scope.isScrollRecEnd=false;
                        if(callback) {
                            $scope.record_index=0;
                            callback();
                        }
                    //    console.log($scope.data_record);
                        $timeout(function(){//1分钟刷新一次挑战记录
                            getData();
                        },60000);
                    }
                });
            }

            var t_o=2000//间隔时间
            function scrollRecords(){//挑战记录滚动
                if($scope.data_record!=undefined&&$scope.data_record!=''&&$scope.data_record!=null) {
                    $timeout(function () {
                        if ($scope.record_index < $scope.data_record.length * 2 - 1) {
                            $scope.record_index++;
                            t_o = 2000;
                            scrollRecords();
                        } else {

                            $scope.isScrollRecEnd = true;
                            $scope.record_index = $scope.data_record.length - 1;
                            $timeout(function () {
                                $scope.isScrollRecEnd = false;
                                t_o = 0;
                                scrollRecords();
                            }, 500);
                        }
                    }, t_o);
                }
            }
        }





    }]);

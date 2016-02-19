angular.module('LuckyMall.controllers')
 .controller('HomeCtrl',function($scope,HomeSer,ActivitySer,$cookies,$timeout){
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
        if(localStorage.getItem('access')){
            $scope.isFirstAcc=false;
        }else{
            $scope.isFirstAcc=true;
        }
        $scope.cancelGuide=function(){
            localStorage.setItem('access',true);
            $scope.isFirstAcc=false;
        };


        loadActivityData();
        loadChallengeRecord();
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

                    var  data_act= response;//获取当前页数据
                    //console.log($scope.data_activity);
                    var group=[];
                    var group_size=5;//每组大小
                    setGroup(0,group_size);
                    function setGroup(index,size){//分组
                         if(index<data_act.length){
                             group.push(data_act.slice(index,size+index));
                             index+=size;
                             setGroup(index,size);
                         }
                    }
                    /*if(group[group.length-1].length<group_size){//最后一组不够时把第一组的填充进去
                        var start=group[group.length-1].length-1;
                        var cp_index=0;//填充（复制）的组里数据的下标
                        for(var i=start;i<group_size;i++){
                            group[group.length-1].push(group[0][cp_index]);
                            cp_index++;
                        }
                    }*/
                  //  console.log(group);
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





    });

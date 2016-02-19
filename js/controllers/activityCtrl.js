angular.module('LuckyMall.controllers')
    .controller('ActivityCtrl', function ($scope, ActivitySer, $rootScope, $state, Host, TokenSer,$timeout,$cookies) {

        $scope.modal={
            share:{
                isShow:false,
                unShowAble:$cookies.get('unShowShareModal')?true:false
            }
        };
        $scope.challengeCards=0;//挑战次数

        /**
         * 发起挑战
         * @param act
         */
        $scope.challenge = function (act) {
            if ($rootScope.isLogin) {

                ActivitySer.isCanPlay(act.Id,function(response,status){
                    if(status==200){
                        if(response){
                            var g_url = Host.game + '?id=' + act.Id + '&mode=4&from=' + Host.hostname + '&authorization=' + TokenSer.getToken();
                            $rootScope.openGame(g_url, '', '');
                        }else{
                            $scope.challengeCards=0;
                            ActivitySer.getArenaTickets(function(response,status){
                                if(status==200){
                                    $scope.challengeCards=response;
                                    if($scope.challengeCards>0){
                                        swal({
                                                title: "使用挑战券发起挑战吗?",
                                                text: "您的挑战券剩余"+$scope.challengeCards+'张',
                                                type: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#DD6B55",
                                                cancelButtonText: '取消',
                                                confirmButtonText: "确定",
                                                closeOnConfirm: true,
                                                showLoaderOnConfirm: true
                                            },
                                            function () {
                                                $timeout(function(){
                                                    var g_url = Host.game + '?id=' + act.Id + '&mode=4&from=' + Host.hostname + '&authorization=' + TokenSer.getToken();
                                                    $rootScope.openGame(g_url, '', '');
                                                    ga('send', 'pageview', {
                                                        'page': '/enter_arenagame',
                                                        'title': '进入擂台游戏'
                                                    });
                                                });
                                            }
                                        );
                                    }else{
                                        if(!$cookies.get('unShowShareModal')) {
                                            $scope.showModal('share');
                                        }else{
                                            $scope.modal.share.unShowAble=false;
                                            swal({
                                                    title: "没有多余的挑战卡了",
                                                    text: '每个擂台可以挑战一次，使用挑战卡可以再次发起挑战',
                                                    type: "info",
                                                    showCancelButton: true,
                                                    confirmButtonColor: "#6dd17b",
                                                    cancelButtonText: '取消',
                                                    confirmButtonText: "获取挑战卡",
                                                    closeOnConfirm:true,
                                                    showLoaderOnConfirm: false
                                                },
                                                function () {
                                                    $cookies.remove('unShowShareModal');
                                                    $scope.showModal('share');
                                                }
                                            );
                                        }
                                    }
                                }
                            });

                        }
                    }
                });
            } else {

                $scope.$emit("show-login-modal");
            }
        };
        $scope.showModal=function(modal_name){
            $timeout(function(){
                $scope.modal[modal_name].isShow=true;
            });
        };
        $scope.closeModal=function(modal_name){

            $timeout(function(){
                $scope.modal[modal_name].isShow=false;
            });
        };

        $scope.hideShareModel=function(){
            $scope.closeModal('share');
            if($scope.modal.share.unShowAble==true){
                $cookies.put('unShowShareModal',true);
            }
        };
    })
    .controller('ActivityIndexCtrl', function ($scope, ActivitySer, $rootScope, $state, Host, TokenSer) {

        {// init
            $scope.cur_tab = 1;//首页当前显示的tab 0往期  1选择  2下期
            $scope.data_record = [];//挑战记录
            $scope.data_activity = [];//擂台列表
            $scope.isMyRecordShow = false;
            $scope.loading_list = false;
            $scope.data_my_record=[];
            var data_list=[];//一个状态的所有擂台数据
            $scope.page = {
                myRecord: {
                    pageSize: 10,
                    index: 0
                },
                list: {
                    total:0,
                    totalPage:0,
                    pageSize: 8,
                    index: 0
                }
            };
            loadData();
            loadChallengeRecord();
        }


        $scope.nextPage=function(){
            if($scope.page.list.index<$scope.page.list.totalPage-1){
                 $scope.page.list.index++;
                $scope.data_activity=getCurrentPage(data_list);
            }else{
            }
        };
        $scope.prevPage=function(){
            if($scope.page.list.index>0){
                $scope.page.list.index--;
                $scope.data_activity=getCurrentPage(data_list);
            }
        };
        function loadData() {
            $scope.data_activity = [];
            if (ActivitySer.getData($scope.cur_tab) == null) {
                var params = {
                    type: $scope.cur_tab,
                    psize: 10000,
                    pindex: 0
                };
                $scope.loading_list = true;
                ActivitySer.requestData(params, function (response, status) {
                    if (response && status == 200) {
                        data_list=response;
                        $scope.page.list.total=data_list.length;
                        $scope.page.list.totalPage=Math.ceil($scope.page.list.total/$scope.page.list.pageSize);
                        $scope.data_activity = getCurrentPage(data_list);//获取当前页数据
                    }else{

                    }
                    $scope.loading_list = false;

                });
            } else {
                data_list=ActivitySer.getData($scope.cur_tab);
                $scope.page.list.total=data_list.length;
                $scope.page.list.totalPage=Math.ceil($scope.page.list.total/$scope.page.list.pageSize);
                $scope.data_activity = getCurrentPage(data_list);
            }
        }


        function getCurrentPage(arr){
            var result=arr.slice($scope.page.list.pageSize*$scope.page.list.index,$scope.page.list.pageSize*($scope.page.list.index+1));
            //console.log(result);
             return result;
        };

        function loadChallengeRecord() {
            var params = {
                "PageIndex": 0,
                "PageSize": 10,
                "TotalSize": 10,
                "TotalPage": 1
            }
            ActivitySer.requestRecord(params, function (response, status) {
                if (status == 200 && response) {
                    $scope.data_record = response;
                    //console.log($scope.data_record);
                }
            });
        }

        /**
         * tab切换
         * @param index
         */
        $scope.changeTab = function (index) {
            $scope.cur_tab = index;
            $scope.page.list.index=0;
            loadData();
        };


        $scope.showMyRecord = function () {
            if ($rootScope.isLogin) {
                $scope.page.myRecord.index=0;
                loadMyRecord();
                $scope.isMyRecordShow = true;
            } else {
                $scope.$emit("show-login-modal");
            }
        };

        $scope.closeMyRecord = function () {
            $scope.isMyRecordShow = false;
        };
        $scope.prevPageOfMyRecord = function () {
            if ($scope.page.myRecord.index > 0) {
                $scope.page.myRecord.index--;
                loadMyRecord();
            }
        };

        $scope.nextPageOfMyRecord=function(){
            if($scope.data_my_record.length<$scope.page.myRecord.pageSize){
                return;
            }else{
                $scope.page.myRecord.index++;
                loadMyRecord();
            }
        };

        function loadMyRecord() {
            var params = {
                "PageIndex": $scope.page.myRecord.index,
                "PageSize": $scope.page.myRecord.pageSize,
                "TotalSize": 0,
                "TotalPage": 0
            };
            $scope.loading_my_rec=true;
            $scope.data_my_record=[];
            ActivitySer.requestMyRecord(params, function (response, status) {
                if (status == 200 && response) {
                    $scope.data_my_record = response;
                    //console.log(response);
                }
                $scope.loading_my_rec=false;
            });
        }

    })
    .controller('ActivityDetailsCtrl', function ($scope, ActivitySer, $rootScope, $state, $stateParams) {


        {//init
            $scope.params_winner_rec={
                "PageIndex": 0,
                "PageSize":10,
                "TotalSize": 0,
                "TotalPage": 0
            };
            $scope.isLastPageOfWinner=false;
            $scope.data_dt = null;
            ActivitySer.requestDetailsById($stateParams.id, function (response, status) {
                if (status == 200 && response) {
                    $scope.data_dt = response;
                    //console.log($scope.data_dt);

                    var params = {
                        "PageIndex": 0,
                        "PageSize": 10,
                        "TotalSize": 1000,
                        "TotalPage": 100
                    };
                    ActivitySer.requestRecordById(false,$scope.data_dt.Id, params, function (r, s) {//获取该单品的所有挑战记录  false：所有
                        if (s == 200 && r) {
                            //console.log(r);
                            $scope.data_dt_record = r;
                        }
                    });

                    $scope.params_winner_rec.PageIndex=0;
                    loadCurrentPageOfWinnerRecords(function(response){
                        $scope.cur_winner_area=response[0].UserAreaStr;
                    });
                }
            });

            $scope.prevPageOfWinnerRecords=function(){
                if($scope.params_winner_rec.PageIndex>0){
                    $scope.params_winner_rec.PageIndex--;
                    loadCurrentPageOfWinnerRecords();
                }
            };
            $scope.nextPageOfWinnerRecords=function(){
                if($scope.data_winner_record.length>=$scope.params_winner_rec.PageSize){
                    $scope.params_winner_rec.PageIndex++;
                    loadCurrentPageOfWinnerRecords();
                }
            };
            function loadCurrentPageOfWinnerRecords(callback){
                ActivitySer.requestRecordById(true,$scope.data_dt.Id, $scope.params_winner_rec, function (r, s) {//获取该单品的擂主挑战记录  true:只查询擂主的记录
                    if (s == 200 && r) {
                        if(r.length>0) {
                            $scope.data_winner_record = r;
                            $scope.isLastPageOfWinner=false;
                        }else{
                            $scope.isLastPageOfWinner=true;
                        }
                        if(typeof callback=='function'){
                            callback(r);
                        }
                    }
                });
            };

        }



    });
angular.module('LuckyMall.controllers')
    .controller('UserCenterCtrl',
    ['$scope', 'LoginSer', '$state', '$timeout', 'UserSer', 'TokenSer', '$rootScope',
        function ($scope, LoginSer, $state, $timeout, UserSer, TokenSer, $rootScope) {
            if (!TokenSer.getToken()) {
                $state.go('home');
                return;
            }
            $scope.isMTXXShow = false;

            if (LoginSer.getData() == null) {
                $state.go('home');
                return;
            }
            $scope.e_val = LoginSer.getData().UserModel.LuckyEnergy.PaidValue;//幸运能量
            if (TokenSer.getToken()) {//判断是否登陆
                $scope.data_user = UserSer.getData();
                $scope.simpleMobile = hideSomeStr($scope.data_user.UserModel.Mobile, 3, 8, '*');
            } else {
                $scope.data_user = null;
                return;
            }
            $scope.$on('changeMenu', function (e, menu_index) {
                $scope.curMenu = menu_index;
            });

            /*签到*/
            /*  $rootScope.signUp=function(){
             if($rootScope.freePlay.isCanSignUp) {
             FreePlaySvc.signUp(function (response) {
             $rootScope.freePlay = FreePlaySvc.getData();
             console.log(response);
             if(response.code=='0X00'){
             swal({
             title: "签到成功！",
             text: "恭喜，您的免费游戏次数+1",
             type:"success",
             confirmButtonText: "确定"
             });
             }else{
             swal({
             title: response.msg,
             type:'error',
             confirmButtonText: "确定"
             });
             }
             });
             }
             };*/
            /*关闭美图秀秀*/
            $scope.closeMTXX = function () {
                $timeout(function () {
                    $scope.isMTXXShow = false;
                }, 5);
            };
            /*监听打开头像编辑*/
            $scope.$on("showMTXX", function () {
                $scope.openMTXX();
            });
            /*监听关闭头像编辑*/
            $scope.$on("closeMTXX", function () {
                $timeout(function () {
                    $scope.isMTXXShow = false;
                });
            });
            /* 打开头像编辑*/
            $scope.openMTXX = function () {
                $timeout(function () {
                    $scope.isMTXXShow = true;
                });
            };
            function hideSomeStr(str, start, end, replace_str) {
                var sub_str = str.substring(start, end);
                var finally_str = '';
                for (var i = 0; i < (end - start); i++) {
                    finally_str += replace_str;
                }
                return str.replace(sub_str, finally_str);
            }

        }]);

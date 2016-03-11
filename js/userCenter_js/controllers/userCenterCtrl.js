angular.module('LuckyMall.controllers')
    .controller('UserCenterCtrl',
    ['$scope', 'LoginSer', '$state', '$timeout', 'UserSer', 'TokenSer', '$rootScope',
        function ($scope, LoginSer, $state, $timeout, UserSer, TokenSer, $rootScope) {
            if (!TokenSer.getToken()) {
                $state.go('home');
                return;
            }
            $scope.isMTXXShow = false;

            if (TokenSer.getToken()) {//判断是否登陆
                $scope.data_user = UserSer.getData();

            } else {
                $scope.data_user = null;
                return;
            }
            $scope.$on('changeMenu', function (e, menu_index) {
                $scope.curMenu = menu_index;
            });
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


        }]);

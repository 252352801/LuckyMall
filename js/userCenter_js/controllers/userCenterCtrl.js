angular.module('LuckyMall.controllers')
    .controller('UserCenterCtrl',
    ['$scope', 'LoginSer', '$state', '$timeout', 'UserSer', 'TokenSer', '$rootScope','svc','API',
        function ($scope, LoginSer, $state, $timeout, UserSer, TokenSer, $rootScope,svc,API) {
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
                $scope.modalAvatarPicker.show=false;
                $timeout(function () {
                    $scope.isMTXXShow = true;
                });
            };

            $scope.editAvatar=function(){
                $scope.modalAvatarPicker.show=true;
            };
            $scope.closeModalAvatarPicker=function(){
                $scope.modalAvatarPicker.show=false;
            };


            function initSystemAvatars(){
                var result=[];
                for(var i =0;i<26;i++){
                    result.push({
                        index:i,
                        url:$rootScope.imgHost+'/avatar/default/'+(i<10?'0'+i:i)+'.png'
                    });
                }
                return result;
            }
            $scope.systemAvatars=initSystemAvatars();
            console.log($scope.systemAvatars);
            $scope.modalAvatarPicker={
                show:false,
                avatars:initSystemAvatars()
            };

            $scope.setSystemAvatar=function(index){
                svc.get(API.setSystemAvatar.url+index,function(response,status){//抢红包次数
                    if(status==200){
                       // $rootScope.user.UserModel.
                        $scope.$emit('user-update');
                    }
                });
                $scope.modalAvatarPicker.show=false;

            };








        }]);

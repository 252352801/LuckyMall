angular.module('LuckyMall.controllers')
    .controller('AfterGameCtrl', function ($scope, CartSer, LoginSer, $state,$cookies, $timeout, MyOrdersSer,
                                            $rootScope) {
        var str=location.href.split('?')[1];
        var params={
            auth:str.split('&')[0].split('=')[1],
            type:str.split('&')[1].split('=')[1],
            orderId:str.split('&')[2].split('=')[1]
        };
        if(!LoginSer.isLogin()){
            authorization(action);
        }else{
            $scope.$emit('game-over');
            $scope.$on('game-over-handled',function(){
                action();
            });
        }
        /* 授权*/
        function authorization(callback){
            var auth=params.auth;
            LoginSer.authorization(function(response,status){
                if(status==1){
                    $scope.$emit('user-login');
                    $timeout(function(){
                        callback();
                    },500);
                }else{
                    $scope.$emit('game-over');
                    $scope.$emit("show-login-modal");
                    $rootScope.$on('user-login',function(){
                        $scope.$emit('game-over');
                        $scope.$on('game-over-handled',function(){
                            callback();
                        });
                    });
                }
            },auth);
        }



        /*执行相应动作*/
        function action() {
            switch(params.type){
                case '0':
                    $state.go('shoppingCart');
                    break;
                case '1':
                    $state.go('payForEarnest',{params:'order_id='+params.orderId});
                    break;
                case '2':
                    MyOrdersSer.setTempOrder(params.orderId);
                    $state.go('confirmOrder',{source:'source=game'});
                    break;
            }
        }

    });
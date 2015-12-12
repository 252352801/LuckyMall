angular.module('LuckyMall.controllers')
    .controller('AfterGameCtrl', function ($scope, CartSer, LoginSer, $state,$cookies, $timeout, MyOrdersSer,
                                            $rootScope) {
        var str=location.href.split('?')[1];
        var params={
            auth:str.split('&')[0].split('=')[1],
            type:str.split('&')[1].split('=')[1],
            orderId:str.split('&')[2].split('=')[1]
        };
        console.log( params);
        if(!LoginSer.isLogin()){
            authorization(action);
        }else{
            action();
        }
        /* 授权*/
        function authorization(callback){
            var auth=params.auth;
            LoginSer.authorization(function(response,status){
                if(status==1){
                    $scope.$emit('user-login');
                    callback();
                }else{
                    $scope.$emit("show-login-modal");
                    $rootScope.$on('user-login',function(){
                        callback();
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
                    $state.go('confirmOrders',{source:'source=game'});
                    break;
            }
        }

    });

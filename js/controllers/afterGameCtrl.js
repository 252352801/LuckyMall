angular.module('LuckyMall.controllers')
    .controller('AfterGameCtrl', function ($scope, CartSer, LoginSer, $state,$cookies, $timeout, UserSer,RefreshUserDataSer,Host,PayForEarnest) {
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
            var auth='Basic '+ params.auth;
            LoginSer.authorization(function(response,status){
                if(status==1){
                    $scope.$emit('user-login');
                    callback();
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
                    alert("付定金");
                    $state.go('payForEarnest',{params:params.orderId});
                    break;
                case '2': alert('支付');
            }
        }

    });

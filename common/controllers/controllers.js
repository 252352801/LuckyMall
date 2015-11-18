angular.module('LuckyCat.controllers',['LuckyCat.services'])

.controller('AppCtrl',function($scope,$timeout,CartSer,LoginSer,$cookieStore,$rootScope,$state,MyOrdersSer){
     $scope.imgHost='http://image.luckyec.com/';
     $scope.cartAmount=0;//购物车商品数量
     $scope.isLoginModalShow=false;//登陆框是否显示
     $scope.isLogin=false;//是否已经登陆
     authorization();//授权登录
     $scope.welcome_word=setWelcomeWord();//设置欢迎词
        /* 监听显示模态框*/
     $scope.$on('show-login-modal',function(){
         $timeout(function(){
             $scope.isLoginModalShow=true;
         },5);
     });
       /* 监听关闭登录模态框*/
      $scope.$on('close-login-modal',function(){
            $timeout(function(){
                $scope.isLoginModalShow=false;
            },5);
      });
       /* 监听退出登录*/
      $scope.$on('exit',function(){
          CartSer.clearData();
          $timeout(function(){
              $scope.cartAmount=0;
              $scope.isLogin=false;
              $state.go('home');
          },5);
      });
        /* 监听用户登录*/
      $scope.$on('user-login',function(){
          loadSomeUserData();//用户登录之后初始化和加载一些必要数据
          loadOrdersData();//加载部分订单数目
      });

      /*监听购物车数据改变*/
        $scope.$on('cart-update',function(){
            console.log("购物车有变动！");
            CartSer.requestCartData(function(respnose,status){ //加载购物车数据
                if(status==1){
                    $timeout(function(){
                        $scope.sp_data_cart=CartSer.getData();
                        $scope.cartAmount=$scope.sp_data_cart.totalAmount;
                    },5);
                }else{
                    $timeout(function(){
                        $scope.sp_data_cart=new Array();;
                        $scope.cartAmount=0;
                    },5);
                }
            });
        });
       /* 授权登陆*/

     /*拦截未登录时的跳转*/
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (toState.name == 'login') return; // 如果是进入登录界面则允许
            // 如果用户未登录
            if (!LoginSer.isLogin()) {
                if (toState.name == 'shoppingCart') {
                    event.preventDefault();
                    $state.go('login');
                }
            }
        });

   /* 授权*/
    function authorization(){
        if($cookieStore.get('Token')==null){
            return;
        }
        LoginSer.authorization(function(response,status){
            if(status==1){
                $scope.isLogin=true;
                loadSomeUserData();//加载一些必要数据
            }else{
                console.log('未设置自动登录/到达自动登录期限/授权失效==>>无法自动登录');
            }
        });
    }
     /*用户登录之后初始化和加载一些必要数据*/
    function loadSomeUserData(){
        $timeout(function(){ //初始化
            $scope.simpleData_user=LoginSer.getData();
            $scope.luckyEnergy=setLuckyEnergyLevel(LoginSer.getData().UserModel.LuckyEnergy.PaidValue);
            $scope.showName=$scope.simpleData_user.UserModel.NickName?$scope.simpleData_user.UserModel.NickName:$scope.simpleData_user.UserModel.Mobile;
            $scope.isLogin=true;
        },5);
        CartSer.requestCartData(function(){ //加载购物车数据
            $timeout(function(){
                $scope.sp_data_cart=CartSer.getData();
                if( $scope.sp_data_cart){
                    $scope.cartAmount=$scope.sp_data_cart.totalAmount;
                }else{
                    $scope.cartAmount=0;
                }
            },5);
        });
        CartSer.requestCartDeadline(LoginSer.getData().UserModel.Id,function(response,status){
            if(status==1){
                $scope.cartDeadline=CartSer.getDeadline();
                console.log('购物车期限：'+$scope.cartDeadline);
            }
        });
    }

    function loadOrdersData(){
        MyOrdersSer.requestData(1,function(response,status){//请求未支付订单
            $scope.simpleData_unPay_count=(MyOrdersSer.getUnPayOrders()==null)?0:MyOrdersSer.getUnPayOrders().length;
        });
        MyOrdersSer.requestData(3,function(response,status){//请求待收货订单
            $scope.simpleData_unReceive_count=(MyOrdersSer.getUnReceiveOrders()==null)?0:MyOrdersSer.getUnReceiveOrders().length;
        });
    }
     /* 根据当前时间设置欢迎词*/
     function setWelcomeWord(){
            var result='您好！';
            var date=new Date();
            var hour=date.getHours();
            if (hour < 12) {
                result = '早上好,';
            }
            else {
                if (hour == 12) {
                    result = '中午好,';
                }else{
                    if(hour>12&&hour<=18) {
                        result='下午好,';
                    }else{
                        result='晚上好,';
                    }
                }
            }
            return result;
      }
     function setLuckyEnergyLevel(paid_val){
         var e = paid_val;
         var data={
             level:1,
             percent:0
         };
         if (e >= 0 && e < 10) {
             data.level = 1;
             data.percent=e / 10 * 100;
         }
         else if (e >= 10 && e < 20) {
             data.level = 2;
             data.percent=e / 20 * 100;
         }
         else if (e >= 20 && e < 50) {
             data.level = 3;
             data.percent=e / 50 * 100;
         }
         else if (e >= 50 && e < 100) {
             data.level = 4;
             data.percent=e / 100 * 100;
         }
         else if (e >= 100 && e < 200) {
             data.level = 5;
             data.percent=e / 200 * 100;
         }
         else if (e >= 200 && e < 500) {
             data.level = 6;
             data.percent=e / 500 * 100;
         }
         else if (e >= 500 && e < 1000) {
             data.level = 7;
             data.percent=e / 1000 * 100;
         }
         else if (e >= 1000 && e < 2000) {
             data.level = 8;
             data.percent=e /2000 * 100;
         }
         else if (e >= 2000 && e < 10000) {
             data.level = 9;
             data.percent=e / 10000 * 100;
         }
         else {
             data.evel = 9;
             data.percent=100;
         }
         return data;
     }
})

   /*登录controller*/
.controller('LoginCtrl',function($scope,LoginSer,$state,$rootScope,$stateParams,$timeout,$cookieStore){
       $scope.username='';
       $scope.password='';
     $scope.keepLogin=false;//是否自动登录
        /*关闭登陆框*/
    $scope.closeLoginModal=function(){
        $scope.$emit('close-login-modal');
    };
       /* 跳转注册页*/
    $scope.goRegister=function(){
        $scope.$emit('close-login-modal');
        $state.go('register');
    };

    $scope.hasInputError=false;//是否输入有误
    $scope.tips='';//提示信息
        /*显示提示信息*/
    $scope.showTips=function(msg){
        $scope.tips=msg;
        if(msg!=''){
            $timeout(function() {
                $scope.hasInputError = true;
            },5);
        }else{
            $timeout(function(){
                $scope.hasInputError=false;
            },5);
        }
    };
     $scope.changeKeepLogin=function(){
         $scope.keepLogin=!$scope.keepLogin;
     };
    $scope.value_btn="登陆"; //登陆按钮显示字符串
       /* 登陆操作*/
    $scope.login=function(username,password){
        if(username!=''&&password!='') {
            var reg = /^[1][358]\d{9}$/;
            if(!reg.test(username)){
                $scope.showTips(' 请正确输入手机号！');
                console.log('手机号有误！');
                return;
            }
            $scope.value_btn = "正在登陆···";
            LoginSer.login(username, password, function (response,status) {
                switch(status){
                    case 1:
                        if($scope.keepLogin){
                            console.log('设置了自动登录！');
                            var expireDate = new Date();
                            expireDate.setDate(expireDate.getDate() + 7);
                            console.log(expireDate);
                            $cookieStore.put('Authorization','Basic '+response,{'expires': expireDate}); //设置auth cookie
                            $cookieStore.put('Token',response,{'expires': expireDate}); //设置token cookie
                        }else{
                            $cookieStore.put('Authorization','Basic '+response); //设置auth cookie
                            $cookieStore.put('Token',response); //设置token cookie
                        }
                        $rootScope.$broadcast("user-login");
                        if($state.current.name=='login'){
                            $state.go('home');
                        }
                        $scope.$emit('close-login-modal');
                        break;
                    case 0:
                        $scope.showTips('用户名/密码错误 ！');
                        break;
                    case -1:
                        $scope.showTips('网络错误，请检查您的网络设置 ！');
                        break;
                }
                $timeout(function(){
                    $scope.value_btn = "登陆";
                },0);
            });
        }else if(username==''){
            $scope.showTips('请输入用户名！');
        }else if(password==''){
            $scope.showTips('请输入密码！');
        }
    };
})

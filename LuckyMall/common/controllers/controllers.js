angular.module('LuckyMall.controllers',['LuckyMall.services'])

.controller('AppCtrl',function(API,$scope,$timeout,CartSer,LoginSer,$cookies,$rootScope,$state,MyOrdersSer,ImgSer,RefreshUserDataSer,UserSer,TokenSer,MarketSer,FreePlaySvc){

    $rootScope.login_target={//登陆后跳转的目标
        state:'home',
        params:{}
    };
    $rootScope.freePlay= FreePlaySvc.getData();//免费试玩数据   chance：次数   isCanSignUp:是否可签到
     $scope.cartAmount=0;//购物车商品数量
     $scope.isLoginModalShow=false;//登陆框是否显示
     $scope.isFeedbackModalShow=false;//反馈框是否显示
     $rootScope.isLogin=false;//是否已经登陆
     getImgHost();//获取图片服务器地址
     authorization();//授权登录
       loadMarketData();//市场活动专题
     $scope.welcome_word=setWelcomeWord();//设置欢迎词
        /* 监听显示登陆模态框*/
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
              $state.go("home");
              $scope.cartAmount=0;
              $rootScope.isLogin=false;
          },5);
      });
        /*登陆超时*/
      $scope.$on('login-time-out',function(){
          CartSer.clearData();
          $timeout(function(){
              LoginSer.exit();
              $scope.cartAmount=0;
              $rootScope.isLogin = LoginSer.isLogin();
          });
      });

        /* 监听用户登录*/
      $scope.$on('user-login',function(){
          $timeout(function(){
              $rootScope.isLogin=true;
          });
          UserSer.setData(LoginSer.getData());//设置用户数据
          loadSomeUserData();//用户登录之后初始化和加载一些必要数据
          loadOrdersData();//加载部分订单数目
          initIsCanSignUp();//是否可签到
          $rootScope.initFreeChance();//免费次数
      });

        /* 监听游戏结束*/
        $scope.$on('game-over',function(){
            UserSer.setData(LoginSer.getData());//设置用户数据
            loadSomeUserData();//用户登录之后初始化和加载一些必要数据
            CartSer.requestCartData(function(){ //加载购物车数据
                $timeout(function(){
                    $scope.sp_data_cart=CartSer.getData();
                    if( $scope.sp_data_cart){
                        $scope.cartAmount=$scope.sp_data_cart.totalAmount;
                    }else{
                        $scope.cartAmount=0;
                    }
                    $scope.$broadcast('game-over-handled');
                },5);
            });
        });


        /*监听账号数据改变*/
        $scope.$on('user-update',function(){
            RefreshUserDataSer.requestUserData(function(response,status){
                if(status==1){
                    UserSer.setUserData(RefreshUserDataSer.getData());
                    $scope.simpleData_user.UserModel=UserSer.getUserData();
                    $timeout(function(){
                        UserSer.setUserData(RefreshUserDataSer.getData());
                        $scope.simpleData_user.UserModel=UserSer.getUserData();
                        $scope.showName=$scope.simpleData_user.UserModel.NickName?$scope.simpleData_user.UserModel.NickName:$scope.simpleData_user.UserModel.Mobile;
                    });
                }
            });
        });
        /* 监听反馈框显示消息*/
        $scope.$on('show-feedback-modal',function(){
            $scope.isFeedbackModalShow=true;
        });
        /* 监听反馈框关闭消息*/
        $scope.$on('close-feedback-modal',function(){
            $scope.isFeedbackModalShow=false;
        });
      /*监听购物车数据改变*/
        $scope.$on('cart-update',function(){
            loadCartData();
            initCartTime();//构建购物车时间
        });
        /*是否可以签到（初始化）*/
        function initIsCanSignUp(){
            FreePlaySvc.isCanSignUp(function(){
                $rootScope.freePlay=FreePlaySvc.getData();
                console.log($rootScope.freePlay);
            });
        }

        FreePlaySvc.getSignUpInfo();


        /*获取免费次数*/
        $rootScope.initFreeChance=function(){
            FreePlaySvc.getFreeChance(function(){
                $rootScope.freePlay=FreePlaySvc.getData();
                console.log($rootScope.freePlay);
            });
        };
        /*加载购物车数据*/
        function loadCartData(){
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
        }


      /*监听订单数据改变*/
        $scope.$on('orders-update',function(){
            loadOrdersData();
        });

     /*监听页面跳转*/
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            // 如果用户未登录
            if (!TokenSer.getToken()) {
                if (toState.name == 'confirmOrder') {
                    event.preventDefault();
                    $state.go('shoppingCart');
                }else if(toState.name == 'shoppingCart'){
                    event.preventDefault();
                    $rootScope.login_target = {state: toState,params: toParams};
                    $state.go('login');
                }else if((toState.name).indexOf("UCIndex") >= 0){
                    event.preventDefault();
                    $rootScope.login_target = {state: toState,params: toParams};
                    console.log($rootScope.login_target);
                    $state.go('login');
                }else if(toState.name == 'register'||toState.name == 'lostPassword'){
                    $rootScope.login_target={
                        state:'home',
                        params:{}
                    };
                }else{
                    var t_name=$rootScope.login_target.state.name;
                    if(t_name!='confirmOrder'&&t_name!='shoppingCart'&&t_name!='UCIndex.myOrders'&&t_name!='register'&&t_name!= 'lostPassword') {
                        if(fromState.name=='register'||fromState.name=='lostPassword') {
                            $rootScope.login_target = { state:'home',params:{}};
                        }else{
                            $rootScope.login_target = {state: fromState, params: fromParams};
                        }
                    }
                }
            }else{
                if(fromState.name=='confirmOrder'||fromState.name=='WXPay'){
                    $scope.$broadcast('stop-polling-tradeStatus');
                }
            }
        });

    /*获取阿里云图片服务器地址*/
     function getImgHost(){
         ImgSer.requestData(function(response,status){
             if(status==1){
                 $scope.imgHost=ImgSer.getData();
             }
         });
     }
   /* 授权*/
    function authorization(){
        if($cookies.get('Token')==null){
            console.log('tk null');
            return;
        }
        LoginSer.authorization(function(response,status){
            if(status==1){
               /* $timeout(function(){
                    $rootScope.isLogin=true;
                    UserSer.setData(LoginSer.getData());//设置用户数据
                    loadSomeUserData();//加载一些必要数据
                    loadOrdersData();//加载部分订单数目
                });*/
                $rootScope.$broadcast('user-login');
            }else{
                console.log('未设置自动登录/到达自动登录期限/授权失效==>>无法自动登录');
            }
        },$cookies.get('Token'));
    }


     /*用户登录之后初始化和加载一些必要数据*/
    function loadSomeUserData(){
        $timeout(function(){ //初始化
            $scope.simpleData_user=UserSer.getData();
            $scope.luckyEnergy=setLuckyEnergyLevel(LoginSer.getData().UserModel.LuckyEnergy.PaidValue);
            $scope.showName=$scope.simpleData_user.UserModel.NickName?$scope.simpleData_user.UserModel.NickName:$scope.simpleData_user.UserModel.Mobile;
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
        initCartTime();
    }


        /*计算购物车剩余时间（秒）*/
        $scope.initCartTimeRemain=function(now_time,end_time){
            var t_n=now_time.getTime();
            var t_e=end_time.getTime();
            var res=(t_e-t_n)/1000;
            if(res>0){
                return res;
            }else{
                return 0;
            }
        };
        /*价格向上取整*/
        $rootScope.mathCeilPrice=function(val){
            return Math.ceil(val);
        };
        /*初始化购物车时间*/
        function initCartTime(){
            clearInterval($scope.cartTimer);
            CartSer.requestCartDeadline(LoginSer.getData().UserModel.Id,function(response,status){
                if(status==1){
                    var time_str=CartSer.getDeadline();
                    $scope.cart_end_time=new Date(time_str[1].replace(/-/g,"/"));
                    console.log("购物车时间："+ time_str);
                    var now_time=new Date(time_str[0].replace(/-/g,"/"));
                    $scope.cartTimeRemain= $scope.initCartTimeRemain(now_time,$scope.cart_end_time);
                    $scope.cartTimer=setInterval(function(){
                        if( $scope.cartTimeRemain>0){
                            $timeout(function(){
                                $scope.cartTimeRemain--;
                                $scope.cartTimeRemainFormat=parseInt($scope.cartTimeRemain/60)+'分'+parseInt($scope.cartTimeRemain%60)+'秒';
                            });
                        }else{
                            clearInterval($scope.cartTimer);
                            $timeout(function(){
                                $scope.$broadcast('cart-time-over');
                                loadCartData();
                            },1000);
                            $scope.cartTimeRemainFormat='';
                            console.log("购物车已超时");
                        }
                    },1000);
                }
            });
        }
    function loadOrdersData(){
        MyOrdersSer.requestData(1,function(response,status){//请求未支付订单
            $scope.simpleData_unPay_count=(MyOrdersSer.getUnPayOrders()==null)?0:MyOrdersSer.getUnPayOrders().length;
        });
        MyOrdersSer.requestData(2,function(response,status){//请求待收货订单
            $scope.simpleData_paid_count=(MyOrdersSer.getPaidOrders()==null)?0:MyOrdersSer.getPaidOrders().length;
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
        /*根据时间字符串设置购物车起始时间*/
        function initCartStartTime(str){
            var time_now=new Date();
            var _str=str.split(' ');
            var arr1=_str[0].split('-');
            var arr2=_str[1].split(':');
            var time=new Date();
            time.setFullYear(parseInt(arr1[0]));
            time.setMonth(parseInt(arr1[1])-1);
            time.setDate(parseInt(arr1[2]));
            time.setHours(parseInt(arr2[0]));
            time.setMinutes(parseInt(arr2[1]));
            time.setSeconds(parseInt(arr2[2]));
            return time.getTime();
        }
        function loadMarketData(){
            MarketSer.requestMarketList(function(response,status){
                if(status==1){
                    $rootScope.data_market=MarketSer.getData().marketOnline;//;
                }
            });
        }
        $scope.goMarket=function(url,id){
            MarketSer.setUrl(url,id);
            $state.go('market',{id:id});
        };
})

   /*登录controller*/
.controller('LoginCtrl',function($scope,LoginSer,$state,$rootScope,$stateParams,$timeout,$cookies,TokenSer){
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
    $scope.hasInputError=false;
    $scope.tips='';//提示信息
        /*显示提示信息*/
    $scope.showTips=function(msg){
        $timeout(function(){
            $scope.tips=msg;
            if(msg==''){
                $scope.hasInputError=false;
            }else{
                $scope.hasInputError=true;
            }
        });
    };
     $scope.changeKeepLogin=function(){
         $scope.keepLogin=!$scope.keepLogin;
     };
    $scope.value_btn="登陆"; //登陆按钮显示字符串
       /* 登陆操作*/
    $scope.login=function(){
        if($scope.form_login.$valid) {
            $scope.showTips('');
            $scope.value_btn = "正在登陆···";
            LoginSer.login($scope.username, $scope.password, function (response,status) {
                switch(status){
                    case 1:
                        if($scope.keepLogin){
                            var expire = new Date();
                            expire.setMinutes(expire.getMinutes() + 30);//cookie时间30分钟
                            $cookies.put('Token',response,{"expires": expire }); //设置token cookie
                        }else{
                            $cookies.put('Token',response); //设置token cookie
                        }
                        $rootScope.$broadcast("user-login");
                        if($state.current.name=='login'){
                            console.log($rootScope.login_target.state);
                            if($rootScope.login_target.state=='game') {
                                location.href=$rootScope.login_target.params+TokenSer.getToken();
                            }else{
                                if($rootScope.login_target.state) {
                                    $state.go($rootScope.login_target.state, $rootScope.login_target.params);
                                }else{
                                    $state.go('home');
                                }
                            }
                        }else {
                            $scope.$emit('close-login-modal');
                        }
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
        }else if($scope.form_login.username.$invalid){
            if($scope.form_login.username.$error.required) {
                $scope.showTips('请输入用户名(手机号码)！');
            }else{
                $scope.showTips('您输入了错误的手机号码！');
            }
        }else if($scope.form_login.password.$invalid){
            $scope.showTips('请输入密码！');
        }
    };
})


/*
.controller('FeedbackCtrl',function($scope) {
        *//*隐藏反馈窗口*//*
      $scope.hideFeedbackModal=function(){
        $scope.$emit('close-feedback-modal');
      };
    })*/



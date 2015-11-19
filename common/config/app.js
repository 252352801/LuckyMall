var app = angular.module('LuckyCat', ['LuckyCat.controllers', 'ui.router','oc.lazyLoad','ngCookies']);
app.config(['$stateProvider','$urlRouterProvider','$locationProvider','$httpProvider','$cookiesProvider',function ($stateProvider, $urlRouterProvider,$locationProvider,$httpProvider, $cookiesProvider) {

    function load(url){
        return ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load(url);
          }]
    }
    $locationProvider.html5Mode(true);

    /*默认路由*/
    $urlRouterProvider.otherwise('home');
    $stateProvider
        /*主页*/
        .state('home', {
            url: '/home',
            views: {
                '': {
                    templateUrl: "templates/home.html",
                    controller: 'HomeCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './js/controllers/homeCtrl.js',
                    './js/services/homeSer.js',
                    './js/directives/homeDirectives.js',
                    './lib/sweetAlert/sweetAlert.css',
                    './lib/sweetAlert/sweetAlert.min.js'
                ])
            }
        })
        /*列表页*/
        .state('list', {
            url: '/list/:cate_id/:item_id',
            views: {
                '': {
                    templateUrl: "templates/list.html",
                    controller:'ListCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './js/controllers/listCtrl.js',
                    './js/services/listSer.js'
                ])
            }

        })
        /*登录*/
        .state('login', {
            url: '/login',
            views: {
                '': {
                    templateUrl: "templates/login.html",
                    controller: 'LoginCtrl'
                }
            }
        })
        /*注册*/
        .state('register', {
            url: '/register',
            views: {
                '': {
                    templateUrl: "templates/register.html",
                    controller:'RegisterCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './js/controllers/registerCtrl.js',
                    './js/services/registerSer.js',
                    './js/directives/registerDirectives.js',
                    './lib/sweetAlert/sweetAlert.css',
                    './lib/sweetAlert/sweetAlert.min.js'
                ])
            }
        })

        /*购物车*/
        .state('shoppingCart', {
            url: '/shoppingCart',
            views: {
                '': {
                    templateUrl: "templates/shoppingCart.html",
                    controller:'CartCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './js/controllers/cartCtrl.js',
                    './lib/sweetAlert/sweetAlert.css',
                    './lib/sweetAlert/sweetAlert.min.js',

                    './css/modal-before-game.css'
                ])
            }
        })


        /*新品*/
        .state('newProduct', {
            url: '/newProduct',
            views: {
                '': {
                    templateUrl: "templates/newProduct.html"
                }
            }
        })

        /*商品详情*/
        .state('goodsDetails', {
            url: '/goodsDetails/:goods_id',
            views: {
                '': {
                    templateUrl: "templates/goodsDetails.html",
                    controller:'GoodsDetailsCtrl'
                }
            },
            resolve: {
                loadFiles:load([
                    './js/controllers/goodsDetailsCtrl.js',
                    './js/services/goodsDetailsSer.js',
                    './js/directives/goodsDetailsDirectives.js',
                    './lib/sweetAlert/sweetAlert.css',
                    './lib/sweetAlert/sweetAlert.min.js'
                ])
            }

        })
        /*确认订单*/
        .state('confirmOrder', {
            url: '/confirmOrder',
            views: {
                '': {
                    templateUrl: "templates/confirmOrder.html",
                    controller:'ConfirmOrdersCtrl'
                }
            },
            resolve: {
                loadFiles:load([
                    './js/controllers/confirmOrdersCtrl.js',
                    './lib/areaSelect/area.js'
                ])
            }

        })
        /*订单提交成功页*/
        .state('orderSubmitSuccess', {
            url: '/orderSubmitSuccess',
            views: {
                '': {
                    templateUrl: "templates/status_orderSubmitSuccess.html"
                }
            }

        })
        /*关于幸运猫*/
        .state('about', {
            url: '/about',
            views: {
                '': {
                    templateUrl: "templates/about.html"
                }
            }

        })
        /*联系我们*/
        .state('touchUs', {
            url: '/touchUs',
            views: {
                '': {
                    templateUrl: "templates/touchUs.html"
                }
            },
            resolve: {
                loadFiles:load([
                    './lib/BDMap/BaiDuMap.js',
                    './lib/BDMap/BaiDuMap.css',
                    './js/directives/touchUsDirectives.js'
                ])
            }

        })
        /*帮助中心*/
        .state('help', {
            url: '/help',
            views: {
                '': {
                    templateUrl: "templates/help.html"
                }
            }

        })
        /*活动页*/
        .state('activity', {
            url: '/activity',
            views: {
                '': {
                    templateUrl: "templates/activity.html"
                }
            }

        })

  /*--------------------------------------分割线----------------------------------------------------------*/
        /*用户中心首页*/
        .state('UCIndex', {
            url: '/UCIndex',
            views: {
                '': {
                    templateUrl: "templates/userCenter_templates/UCIndex.html",
                    controller:'UserCenterCtrl'
                }
            },
            resolve:{
                loadFiles:load([
                    './css/style_userCenter.css',
                    './js/userCenter_js/controllers/userCenterCtrl.js',
                    './js/userCenter_js/directives/headerImgEditDirectives.js',
                    './lib/sweetAlert/sweetAlert.css',
                    './lib/sweetAlert/sweetAlert.min.js'
                    
                ])
            }
        })
        /*我的订单*/
        .state('UCIndex.myOrders', {
            url: '/myOrders/:status',
            views: {
                'uc-menu-cont': {
                    templateUrl: "templates/userCenter_templates/myOrders.html",
                    controller:'MyOrdersCtrl'
                }
            },
            resolve:{
                loadFiles:load([
                    './js/userCenter_js/controllers/myOrdersCtrl.js',
                    './js/userCenter_js/services/myOrdersSer.js'
                ])
            }
        })
        /*我的钱包*/
        .state('UCIndex.myWallet', {
            url: '/myWallet',
            views: {
                'uc-menu-cont': {
                    templateUrl: "templates/userCenter_templates/myWallet.html",
                    controller:'MyWalletCtrl'
                }
            },
            resolve:{
                loadFiles:load([
                    './js/userCenter_js/controllers/myWalletCtrl.js'
                ])
            }
        })
        /*我的折扣卡*/
        .state('UCIndex.myDiscountCards', {
            url: '/myDiscountCards',
            views: {
                'uc-menu-cont': {
                    templateUrl: "templates/userCenter_templates/myDiscountCards.html",
                    controller:'MyDiscountCardsCtrl'
                }
            },
            resolve:{
                loadFiles:load([
                    './js/userCenter_js/controllers/myDiscountCardsCtrl.js'
                ])
            }
        })
        /*修改密码*/
        .state('UCIndex.editPassword', {
            url: '/editPassword',
            views: {
                'uc-menu-cont': {
                    templateUrl: "templates/userCenter_templates/editPassword.html",
                    controller:'EditPasswordCtrl'
                }
            },
            resolve:{
                loadFiles:load([
                    './js/userCenter_js/controllers/editPasswordCtrl.js',
                    './js/userCenter_js/services/editPasswordSer.js'
                ])
            }
        })
        /*收货地址*/
        .state('UCIndex.myAddresses', {
            url: '/myAddresses',
            views: {
                'uc-menu-cont': {
                    templateUrl: "templates/userCenter_templates/myAddresses.html",
                    controller:'MyAddressesCtrl'
                }
            },
            resolve:{
                loadFiles:load([
                    './js/userCenter_js/controllers/myAddressesCtrl.js',
                    './js/userCenter_js/directives/myAddressDirectives.js',
                    './lib/areaSelect/area.js'
                ])
            }
        })
        /*帮助中心*/
        .state('UCIndex.helpCenter', {
            url: '/helpCenter',
            views: {
                'uc-menu-cont': {
                    templateUrl: "templates/userCenter_templates/helpCenter.html",
                    controller:'HelpCenterCtrl'
                }
            },
            resolve:{
                loadFiles:load([
                    './js/userCenter_js/controllers/helpCenterCtrl.js'
                ])
            }
        })
        /*关于幸运猫*/
        .state('UCIndex.about', {
            url: '/about',
            views: {
                'uc-menu-cont': {
                    templateUrl: "templates/userCenter_templates/about.html",
                    controller:'AboutCtrl'
                }
            },
            resolve:{
                loadFiles:load([
                    './js/userCenter_js/controllers/aboutCtrl.js'
                ])
            }
        })
        /*建议和反馈*/
        .state('UCIndex.adviceAndFeedback', {
            url: '/adviceAndFeedback',
            views: {
                'uc-menu-cont': {
                    templateUrl: "templates/userCenter_templates/adviceAndFeedback.html",
                    controller:'AdviceAndFeedbackCtrl'
                }
            },
            resolve:{
                loadFiles:load([
                    './js/userCenter_js/controllers/adviceAndFeedbackCtrl.js'
                ])
            }
        })

}]);

/*定义主机地址和接口地址*/
app.host1="http://120.24.175.151:9000/";
app.host2="http://120.25.60.19:9000/";
app.host=app.host1;


//app.gameHost='http://120.24.175.151:9004';//游戏服务器
app.gameHost='http://120.25.60.19:9004';//游戏服务器
app.gameOverPage='http://www.xingyunmao.cn/shoppingCart';//游戏服务器
app.interface={
        login:app.host+'api/user/login',//登陆
        refreshUserData:app.host+'api/user/refresh',//获取最新的用户数据
        authorization:app.host+'api/user/auth/',//授权
        bannerList:app.host+'api/promotion/query/0',//banner轮播图
        todayData:app.host+'api/promotion/query/1',//今日推广商品
        getAllCategory:app.host+'api/category/all2',//获取所有分类
        goodsDetailsData:app.host+'api/commodity/',//商品详情页数据 后接商品id
        getCategoryByGoodsId:app.host+'api/filterby/',//根据商品id获取分类数据，后接商品id
        search:app.host+'api/commodity/search',//商品详情页数据
        getVerifyCode:app.host+'api/user/verificationcode/',//获取手机验证码
        register:app.host+'api/user/register',//注册
        addToCart:app.host+'api/order/add', //加入购物车
        cartList:app.host+'api/order/all/0', //购物车列表
        orderList_unPay:app.host+'api/order/all/1', //待付款订单     {"PageIndex": 1,"PageSize": 2,"TotalSize": 3, "TotalPage": 4}<==>{当前第几页，每页大小，总条数，总页数}
        orderList:app.host+'api/order/all/', //根据状态查询订单数据  后接状态 ：0-已预选 1-待付款 2-已付款 3-已发货 4-已完成 5-已取消
        orderList_paid:app.host+'api/order/all/2', //已付款订单
        orderList_sentOut:app.host+'api/order/all/3', //已发货订单
        orderList_finish:app.host+'api/order/all/4', //已完成订单
        orderList_cancel:app.host+'api/order/all/5', //已取消订单
        cancelOrder:app.host+'api/order/cancel/',//取消单个订单操作 后接id
        cancelOrders:app.host+'api/order/cancels',//取消多个订单操作
        confirmReceive:app.host+'api/order/complete/{id}',//确认收货
        addressList:app.host+'api/user/address/all/',//收货地址列表，后接id
        addAddress:app.host+'api/user/address/add',//添加收货地址
        updateAddress:app.host+'api/user/address/update',//修改收货地址
        removeAddress:app.host+'api/user/address/delete/',//删除收货地址 后接id
        setDefaultAddress:app.host+'api/user/address/setdefault/',//设置默认地址 后接id
        cartDeadline:app.host+'api/user/sctime/', //购物车时间（期限）后接id
        purchaseOrders:app.host+'api/order/purchase',//确认订单
        updatePassword:app.host+'api/user/password/'//修改密码 后接用户id
};
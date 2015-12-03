var app = angular.module('LuckyCat', ['LuckyCat.controllers', 'ui.router', 'oc.lazyLoad', 'ngCookies']);
app.constant('Host',{
    develop: "http://120.24.175.151:9000/", //开发服务器
    test: "http://120.25.60.19:9000/",//测试服务器
    prev:"http://120.24.225.116:9000/", //运营服务器
    game:'http://120.25.60.19:9004', //游戏服务器
    gameOverPage:'http://www.xingyunmao.cn/shoppingCart'//游戏结束后返回地址
});
app.constant('API',{
    login: {//登陆
        method:'post',
        url:'api/user/login'
    },
    ImgHost:{//获取图片服务器地址
        method:'get',
        url: 'api/upload/imagecloudurl'
    },
    refreshUserData:{//获取最新的用户数据
        method:'get',
        url: 'api/user/refresh'
    },
    authorization:{//授权
        method:'get',
        url: 'api/user/auth/'
    },
    bannerList:{//banner轮播图
        method:'post',
        url: 'api/promotion/query/0'
    },
    todayData:{//今日推广商品
        method:'post',
        url: 'api/promotion/query/1'
    },
    marketOnline:{//今日推广商品
        method:'get',
        url: 'api/market/online'
    },
    marketView:{//获取多个市场活动页面
        method:'post',
        url: 'api/market/view'
    },
    getAllCategory:{//获取所有分类(包含筛选器)
        method:'get',
        url: 'api/category/allwithfilter/0'
    },
    goodsDetailsData:{//根据商品ID获取商品详情页数据 后接商品id
        method:'get',
        url: 'api/commodity/'
    },
    getCategoryByGoodsId:{//根据商品id获取分类数据，后接商品id
        method:'get',
        url: 'api/filterby/'
    },
    search:{//根据搜索条件搜索商品
        method:'post',
        url: 'api/commodity/search'
    },
    getVerifyCode:{//获取手机验证码 后接手机号码
        method:'get',
        url: 'api/user/verificationcode/'
    },
    register: {//注册
        method:'post',
        url:'api/user/register'
    },
    addToCart: {//加入购物车
        method:'post',
        url:'api/order/add'
    },
    cartList: {//购物车列表
        method:'post',
        url:'api/order/all/0'
    },
    orderList_unPay: {//待付款订单     {"PageIndex": 1,"PageSize": 2,"TotalSize": 3, "TotalPage": 4}<==>{当前第几页，每页大小，总条数，总页数}
        method:'post',
        url:'api/order/all/1'
    },
    orderList: {//根据状态查询订单数据  后接状态 ：0-已预选 1-待付款 2-已付款 3-已发货 4-已完成 5-已取消
        method:'post',
        url:'api/order/all/'
    },
    orderList_paid: {//已付款订单
        method:'post',
        url:'api/order/all/2'
    },
    orderList_sentOut: { //已发货订单
        method:'post',
        url:'api/order/all/3'
    },
    orderList_finish: { //已完成订单
        method:'post',
        url:'api/order/all/4'
    },
    orderList_cancel: { //已取消订单
        method:'post',
        url:'api/order/all/5'
    },
    cancelOrder: { //取消单个订单操作 后接id
        method:'get',
        url:'api/order/cancel/'
    },
    cancelOrders: { //取消多个订单操作
        method:'post',
        url:'api/order/cancels'
    },
    confirmReceive: { //确认收货 后接订单ID
        method:'get',
        url:'api/order/complete/'
    },
    addressList: { //收货地址列表，后接用户id
        method:'get',
        url:'api/user/address/all/'
    },
    addAddress: { //添加收货地址
        method:'post',
        url:'api/user/address/add'
    },
    updateAddress: { //修改收货地址
        method:'post',
        url:'api/user/address/update'
    },
    removeAddress: {//删除收货地址 后接id
        method:'get',
        url:'api/user/address/delete/'
    },
    setDefaultAddress: {//设置默认地址 后接id
        method:'get',
        url:'api/user/address/setdefault/'
    },
    cartDeadline: { //购物车时间（期限）后接id
        method:'get',
        url:'api/user/sctime/'
    },
    purchaseFromShoppingCart: { //确认订单(购物车)
        method:'post',
        url:'api/order/purchase/0'
    },
    purchaseFromUnPayOrders: { //确认订单(待付款订单)
        method:'post',
        url: 'api/order/purchase/1'
    },
    payForEarnest: { //支付定金获取能量 后接订单ID
        method:'post',
        url: 'api/order/payment/'
    },
    updatePassword: { //修改密码
        method:'post',
        url: 'api/user/password'
    },
    updateNickname: { //修改昵称  后接昵称
        method:'get',
        url: 'api/user/nickname/'
    },
    getQRCodeData: { //获取微信支付二维码数据 后接交易单号
        method:'get',
        url:  'api/wxpay/b/qrcodedata/'
    },
    QRCodeUrl: { //支付二维码图片地址，后接文件名
        method:'get',
        url:  'api/wxpay/qrcode?data='
    },
    aliPaySubmit: { //支付宝支付提交  后接交易单号
        method:'get',
        url:  'api/alipay/submit/'
    },
    getTradeStatus: {//获取交易单状态  后接交易单ID
        method:'get',
        url:  'api/order/tradestatus/'
    },
    getTradeInfo:{ //获取交易单信息
        method:'get',
        url:'api/order/trade/'
    },
    getAreas: {//获取行政区域地址数据
        method:'get',
        url:  'api/user/areas/get'
    },
    messageOfUnRead: {//未读消息
        method:'post',
        url: 'api/user/message/0'
    },
    messageOfRead: {//已读消息
        method:'post',
        url:'api/user/message/1'
    },
    messageContent: {//根据消息ID获取消息内容  后接消息ID
        method:'get',
        url:'api/user/message/content/'
    },
    removeMsg: {//删除指定消息 后接消息ID
        method:'get',
        url:'api/user/message/delete/'
    },
    discountCard: { //获取折扣卡
        method:'get',
        url:'api/user/discountcard/get'
    },
    isMobileSignUp:{  //检测手机号码是否已经注册  后接手机号   返回true表示已注册
        method:'get',
        url:'api/user/checkmobile/'
    },
    getLogisticsInfo:{  //获取物流信息  后接 订单id/类型
        method:'get',
        url:'api/logistics/queryexpress/'
    }
});
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$cookiesProvider','Host','API',
    function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $cookiesProvider,Host,API) {
    function load(url) {
        return ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load(url);
        }]
    }

    $locationProvider.html5Mode(true);

    /*==================================================路由配置    begin=============================================*/
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
                    './css/index.css',
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
            url: '/list/:params',
            views: {
                '': {
                    templateUrl: "templates/list.html",
                    controller: 'ListCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './css/list.css',
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
                    controller: 'RegisterCtrl'
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
                    controller: 'CartCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './css/cart.css',
                    './js/controllers/cartCtrl.js',
                    './lib/sweetAlert/sweetAlert.css',
                    './lib/sweetAlert/sweetAlert.min.js'
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
            },
            resolve: {
                loadFiles: load([
                    './css/list.css'
                ])
            }
        })

        /*商品详情*/
        .state('goodsDetails', {
            url: '/goodsDetails/:goods_id',
            views: {
                '': {
                    templateUrl: "templates/goodsDetails.html",
                    controller: 'GoodsDetailsCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './css/goodsDetails.css',
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
            url: '/confirmOrder/:source',
            views: {
                '': {
                    templateUrl: "templates/confirmOrder.html",
                    controller: 'ConfirmOrdersCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './css/confirmOrders.css',
                    './js/controllers/confirmOrdersCtrl.js',
                    './lib/areaSelect/area.js'
                ])
            }

        })

        /*微信支付页*/
        .state('WXPay', {
            url: '/WXPay/:trade_id',
            views: {
                '': {
                    templateUrl: "templates/WXPay.html",
                    controller: 'WXPayCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './css/WXPay.css',
                    './js/controllers/WXPayCtrl.js'
                ])
            }

        })

        /*支付定金页*/
        .state('payForEarnest', {
            url: '/payForEarnest/:params',
            views: {
                '': {
                    templateUrl: "templates/payForEarnest.html",
                    controller: 'PayForEarnestCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './css/confirmOrders.css',
                    './js/controllers/payForEarnestCtrl.js',
                    './lib/sweetAlert/sweetAlert.css',
                    './lib/sweetAlert/sweetAlert.min.js'
                ])
            }

        })

        /*支付成功页*/
        .state('paySuccess', {
            url: '/paySuccess',
            views: {
                '': {
                    templateUrl: "templates/paySuccess.html"
                }
            },
            resolve: {
                loadFiles: load([
                    './css/paySuccess.css'
                ])
            }

        })
        /*关于幸运猫*/
        .state('about', {
            url: '/about',
            views: {
                '': {
                    templateUrl: "templates/about.html"
                }
            },
            resolve: {
                loadFiles: load([
                    './css/support.css'
                ])
            }

        })
        /*联系我们*/
        .state('contact', {
            url: '/contact',
            views: {
                '': {
                    templateUrl: "templates/contact.html"
                }
            },
            resolve: {
                loadFiles: load([
                    './css/support.css',
                    './lib/BDMap/BaiDuMap.js',
                    './lib/BDMap/BaiDuMap.css',
                    './js/directives/contactDirectives.js'
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
            },
            resolve: {
                loadFiles: load([
                    './css/support.css'
                ])
            }

        })
        /*活动页*/
        .state('market', {
            url: '/market',
            views: {
                '': {
                    templateUrl: "templates/market.html",
                    controller: 'MarketCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './js/controllers/marketCtrl.js',
                    './js/services/marketSer.js'
                ])
            }

        })

        /*--------------------------------------分割线----------------------------------------------------------*/
        /*用户中心首页*/
        .state('UCIndex', {
            url: '/UCIndex',
            views: {
                '': {
                    templateUrl: "templates/userCenter_templates/UCIndex.html",
                    controller: 'UserCenterCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './css/userCenter_css/userCenter.css',
                    './js/userCenter_js/controllers/userCenterCtrl.js',
                    './js/userCenter_js/directives/headerImgEditDirectives.js',
                    './js/userCenter_js/services/userSer.js',
                    './lib/sweetAlert/sweetAlert.css',
                    './lib/sweetAlert/sweetAlert.min.js',
                    'http://open.web.meitu.com/sources/xiuxiu.js'

                ])
            }
        })
        /*我的订单*/
        .state('UCIndex.myOrders', {
            url: '/myOrders/:status',
            views: {
                'uc-menu-cont': {
                    templateUrl: "templates/userCenter_templates/myOrders.html",
                    controller: 'MyOrdersCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './js/userCenter_js/controllers/myOrdersCtrl.js',
                    './js/userCenter_js/services/myOrdersSer.js'
                ])
            }
        })
        /*我的订单*/
        .state('UCIndex.orderDetails', {
            url: '/orderDetails/:order_status/:order_id',
            views: {
                'uc-menu-cont': {
                    templateUrl: "templates/userCenter_templates/orderDetails.html",
                    controller: 'OrderDetailsCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './js/userCenter_js/controllers/orderDetailsCtrl.js'
                ])
            }
        })
        /*我的钱包*/
        .state('UCIndex.myWallet', {
            url: '/myWallet',
            views: {
                'uc-menu-cont': {
                    templateUrl: "templates/userCenter_templates/myWallet.html",
                    controller: 'MyWalletCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './js/userCenter_js/controllers/myWalletCtrl.js'
                ])
            }
        })
        /*我的折扣卡*/
        .state('UCIndex.myDiscountCards', {
            url: '/myDiscountCards/:params',
            views: {
                'uc-menu-cont': {
                    templateUrl: "templates/userCenter_templates/myDiscountCards.html",
                    controller: 'MyDiscountCardsCtrl'
                }
            },
            resolve: {
                loadFiles: load([
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
                    controller: 'EditPasswordCtrl'
                }
            },
            resolve: {
                loadFiles: load([
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
                    controller: 'MyAddressesCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './js/userCenter_js/controllers/myAddressesCtrl.js',
                    './js/userCenter_js/directives/myAddressDirectives.js',
                    //'./lib/areaSelect/area.js'
                    './lib/areaPicker/areaPicker.js',
                    './lib/areaPicker/areaPicker.css'
                ])
            }
        })
        /*修改绑定手机*/
        .state('UCIndex.updateCellPhoneNum', {
            url: '/updateCellPhoneNum',
            views: {
                'uc-menu-cont': {
                    templateUrl: "templates/userCenter_templates/updateCellPhoneNum.html",
                    controller: 'UpdateCellPhoneNumCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './js/userCenter_js/controllers/updateCellPhoneNumCtrl.js'
                ])
            }
        })
        /*帮助中心*/
        .state('UCIndex.helpCenter', {
            url: '/helpCenter',
            views: {
                'uc-menu-cont': {
                    templateUrl: "templates/userCenter_templates/helpCenter.html",
                    controller: 'HelpCenterCtrl'
                }
            },
            resolve: {
                loadFiles: load([
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
                    controller: 'AboutCtrl'
                }
            },
            resolve: {
                loadFiles: load([
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
                    controller: 'AdviceAndFeedbackCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './js/userCenter_js/controllers/adviceAndFeedbackCtrl.js'
                ])
            }
        })
        /*安全中心*/
        .state('UCIndex.safeAccount', {
            url: '/safeAccount',
            views: {
                'uc-menu-cont': {
                    templateUrl: "templates/userCenter_templates/safeAccount.html",
                    controller: 'SafeAccountCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './js/userCenter_js/controllers/safeAccountCtrl.js'
                ])
            }
        })
        /*我的消息*/
        .state('UCIndex.myMessage', {
            url: '/myMessage/:msg_type',
            views: {
                'uc-menu-cont': {
                    templateUrl: "templates/userCenter_templates/myMessage.html",
                    controller: 'MyMessageCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './js/userCenter_js/controllers/myMessageCtrl.js'
                ])
            }
        })

        /*消息详情*/
        .state('UCIndex.messageDetails', {
            url: '/messageDetails/:params',
            views: {
                'uc-menu-cont': {
                    templateUrl: "templates/userCenter_templates/messageDetails.html",
                    controller: 'MessageDetailsCtrl'
                }
            },
            resolve: {
                loadFiles: load([
                    './js/userCenter_js/controllers/messageDetailsCtrl.js'
                ])
            }
        });

    /*==================================================接口配置    end===============================================*/
    initAPI();
    function initAPI(){
        for(var o in API){
            API[o].url=Host.develop+API[o].url;
        }
    }

}]);

angular.module('LuckyCat.services',[])
    .factory('TokenSer',function(API,$http,$timeout,$cookies) {
        return {
            getAuth:function(){
                return  'Basic '+$cookies.get('Token');
             },
            getToken:function(){
                return  $cookies.get('Token');
            },
            remove:function(){
                $cookies.remove('Token');
            }
        };
    })

     /*获取阿里云图片服务器ser*/
    .factory('ImgSer',function(API,$http) {
        var data;
        return {
            getData:function(){
                return data;
            },
            requestData:function(callback){
                $http({
                    method:API.ImgHost.method,
                    url:API.ImgHost.url
                }).success(function(response){
                    if(response!=null){
                        data=response;
                        callback(response,1);
                    }
                });
            }
        };
    })
    /*登陆服务*/
    .factory('LoginSer',function(API,$http,$timeout,TokenSer){
        var data=null;
        var isLogin=false;
        return {
            getData:function(){
                return data;
            },
            getToken:function(){
                return data.token;
            },
            isLogin:function(){
                return isLogin;
            },
            login:function(username,password,callback){
                $http({
                    method:API.login.method,
                    url:API.login.url,
                    data: {  "Name": username, "Password":password}
                }).success(function(response){
                    if(response) {
                        data = response;
                        isLogin=true;
                        if (typeof callback == 'function') {
                            callback(data.Token,1);
                        }
                    }else{
                        callback(null,0);
                    }
                }).error(function(data,status,headers,config){
                    callback(null,-1);
                });
            },
            exit:function(){
                $timeout(function(){
                    data=null;
                    isLogin=false;
                    TokenSer.remove();
                });
            },
            authorization:function(callback){
                if(TokenSer.getToken()){
                    $http({
                        method:API.authorization.method,
                        url:API.authorization.url+TokenSer.getToken()
                    }).success(function(response){
                        if(response) {
                            if(!response.Token){
                                return;
                            }
                            data = response;
                            isLogin=true;
                            if (typeof callback == 'function') {
                                callback(data.Token,1);
                            }
                        }else{
                            TokenSer.remove();
                            callback(null,0);
                        }
                    }).error(function(data,status,headers,config){
                        callback(null,-1);
                    });
                }
            }
        };
    })

    .factory('UserSer',function(API,$http,TokenSer){
        var data={
            UserModel:null,
            LuckyEnergy:null
        }
        return {
            getData:function(){
                return data;
            },
            getUserData:function(){
                return data.UserModel;
            },
            getLuckyEnergyData:function(){
                return data.LuckyEnergy;
            },
            setData:function(new_data){
                data=new_data;
            },
            setUserData:function(new_data){
                data.UserModel=new_data;
            },
            setLuckyEnergyData:function(new_data){
                data.LuckyEnergy=new_data;
            },
            updateNickname:function(new_nickname,callback){
                $http({
                    method:API.updateNickname.method,
                    url:API.updateNickname.url+new_nickname,
                    headers: {
                        'Authorization': TokenSer.getAuth()
                    }
                }).success(function(response,status,headers,config){
                    if(response){
                        callback(response,1);
                    }else{
                        callback(response,0);
                    }
                }).error(function(data,status,headers,config){
                    callback(data,0);
                });
            }
        };
    })


    .factory('RefreshUserDataSer',function(API,$http,TokenSer) {
        var data=null;
        return {
            getData:function(){
                return data;
            },
            requestUserData:function(callback){
                $http({
                    method:API.refreshUserData.method,
                    url:API.refreshUserData.url,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }).success(function(response,status){
                    if(response!=null){
                        data=response;
                        callback(response,1);
                    }
                });
            }
        };
    })

    /*列表页筛选器*/
.factory('FilterSer',function(API,$http,$timeout){
        var data_select={
            category:null,
            items:new Array()
        };
        var data_category=null;
        /*清除与res下的所有选项*/
        var clearSelections=function(res){
            for(var o in res){
                res[o].isSelected=false;
            }
        };
        var filterData=function(data){//筛选出正在销售的商品
            var result=new Array();
            var time_now=new Date();
            for(var o in data){
                var t1=new Date(data[o].OnSaleTime.replace(/-/g,"/"));
                var t2=new Date(data[o].ExpiryDate.replace(/-/g,"/"));
                if(time_now.getTime()>=t1.getTime()&&time_now.getTime()<t2.getTime()){
                    result.push(data[o]);
                }
            }
            return result;
        };
        return {
            getCategoryData:function(){
                return data_category;
            },
            setCategoryData:function(new_data){
                data_category=new_data;
            },
            getSelectData:function(){
                return data_select;
            },
            setSelectData:function(new_data){
                data_select=new_data;
            },
            addSelection:function(item_id){
                data_select.items.push(item_id);
            },
            removeSelection:function(item_id){
                for(var o in data_select.items){
                    if(item_id==data_select.items[o]){
                        data_select.items.splice(o,1);
                    }
                }
            },
            select:function(){
                for(var i=0;i<data_category.FilterModels.length;i++){
                    for(var j=0;j<data_category.FilterModels[i].FilterItemModels.length;j++){
                        for(var o in data_select.items){
                            if(data_select.items[o]==data_category.FilterModels[i].FilterItemModels[j].Id){
                                data_category.FilterModels[i].FilterItemModels[j].isSelected=true;
                            }
                        }
                    }
                }
            },
            /*清除所有已选状态*/
            clearSelect:function(){
                for(var i=0;i<data_category.FilterModels.length;i++){
                    for(var j=0;j<data_category.FilterModels[i].FilterItemModels.length;j++){
                        data_category.FilterModels[i].FilterItemModels[j].isSelected=false;
                    }
                }
            },
            search:function(params){
                var post_data={
                    "Status":3,//3表示已上架商品
                    "CategoryId":""+params.category,
                    "FilterItems":params.items,
                    "Keyword": "",
                    "MinPrice":0,
                    "MaxPrice":0,
                    "OrderNames": ["RetailPrice"],
                    "Asc": params.sortByPrice,//升序   true升序  false非升序
                    "PageIndex": 0,//当前页
                    "PageSize": 1000,//每页大小
                    "TotalSize":10000,//总条数
                    "TotalPage": 10//总页数
                };
                $http({
                    method:API.search.method,
                    url:API.search.url,
                    data: post_data
                }).success(function(response,status,headers,config){
                    params.callback(filterData(response));
                }).error(function(data,status,headers,config){

                });
            }
        };
})
    /*分类数据服务*/
    .factory('CategorySer',function(API,$http){
        var data=null;
        return {
            getData:function(){
                return data;
            },
            requestData:function(callback){
                $http({
                    method:API.getAllCategory.method,
                    url:API.getAllCategory.url
                }).success(function(response,status,headers,config){
                    data=response;
                    if(typeof callback=='function'){
                        callback();
                    }
                }).error(function(data,status,headers,config){

                });
            },
            getCategoryById:function(cg_id){
                for(var i= 0,len=data.length;i<len;i++){
                    if(cg_id==data[i].Id){
                        return data[i];
                    }
                }
            }
        };
    })
   /* 获取手机验证码服务*/
    .factory('VerifyCodeSer',function(API,$http){
        return {
            getVerifyCode:function(mobile_num,callback){
                $http.get(API.getVerifyCode.url+mobile_num)
                    .success(function(response){
                        if(typeof callback=='function'){
                            callback(response);
                        }
                    });
            }
        };
    })

    /* 购物车服务*/
    .factory('CartSer',function(API,$http,TokenSer){
        var data=null;
        var deadline=null;
        var initData=function(){
              var total_amount=0;//商品总数
              var total_cost=0;//总花费
              for(var o in data){
                    data[o].Specifications=JSON.parse(data[o].Specifications);//产品规格字符串转换json
                    data[o].imageUrl=data[o].Commodity.RollingImages.split('|')[0];//商品图片（取第一张）
                    data[o].discountUnitPrice=data[o].UnitPrice*data[o].DiscountVal;//折后单件价
                    data[o].cost=data[o].UnitPrice*data[o].Count*data[o].DiscountVal;//折后价
                    data[o].needToPay=data[o].cost-data[o].EarnestMoney;//待支付
                    data[o].isSelected=true;//勾选状态，默认勾选
                    total_amount+=data[o].Count;
                    total_cost+=data[o].cost;
              }
              data.totalAmount=total_amount;
              data.totalCost=total_cost;
        };
        return {
                getData:function(){
                    return data;
                },
                getDeadline:function(){
                    return  deadline;
                },
                clearData:function(){
                    data=null;
                },
                getTotalAmount:function(){
                    if(data!=null){
                        return  data.totalAmount;
                    }else{
                        return 0;
                    }
                },
                getOrderById:function(order_id){
                    for(var o in data){
                        if(order_id==data[o].Id){
                            return data[o];
                        }
                    }
                },
                getConfirmData:function(){
                    var result=new Array();
                    for(var o in data){
                        if(data[o].isSelected==true){
                            result.push(data[o]);
                        }
                    }
                    return result;
                },
                requestCartData:function(callback) {
                    var params = { "PageIndex": 0, "PageSize": 100,"TotalSize": 0, "TotalPage": 0};
                    $http({
                        method: API.cartList.method,
                        url: API.cartList.url,
                        data:params,
                        headers: {
                            'Authorization':TokenSer.getAuth()
                        }
                    })
                    .success(function(response){
                             if(response){
                                 data=response;
                                 initData();
                                 callback(data,1);
                             }else{
                                 callback(response,0);
                             }
                        })
                        .error(function(){
                            callback(null,-1);
                        });
                },
                requestCartDeadline:function(u_id,callback){
                    $http({
                        method:API.cartDeadline.method,
                        url: API.cartDeadline.url+u_id,
                        headers: {
                            'Authorization':TokenSer.getAuth()
                        }
                    }).success(function(response){
                        if(response){
                            deadline=response;
                            callback(response,1);
                        }
                    });
                },

                /*根据id删除购物车里的订单*/
                cancelOrder:function(order_id,callback){
                    $http({
                        method: API.cancelOrder.method,
                        url: API.cancelOrder.url+order_id,
                        headers: {
                            'Authorization': TokenSer.getAuth()
                        }
                    }).success(function (response) {
                        if (response) {
                            callback(response,1);
                        }else{
                            callback(response,0);
                        }
                    });
                }
        };
    })

    /* 收货地址服务*/
    .factory('AddressSer',function(API,$http,TokenSer){
        var show_add_form=false;//是否显示添加收货地址框
        var show_edit_form=false;//是否显示编辑收货地址框
        var data=null;//地址数据
        return {
            isShowAddForm:function(){
                return show_add_form;
            },
            setAddForm:function(bool_status){
                show_add_form=bool_status;
            },
            isShowEditForm:function(){
                return show_edit_form;
            },
            setEditForm:function(bool_status){
                show_edit_form=bool_status;
            },
            getData:function(){
                return data;
            },
            requestAddressData:function(user_id,callback){
                $http({
                    method:API.addressList.method,
                    url: API.addressList.url+user_id,
                    headers: {
                        'Authorization': TokenSer.getAuth()
                    }
                }).success(function (response) {
                    if (response) {
                        data=response;
                        callback(response,1);
                    }
                }); 
            },
            addAddress:function(params,callback){
                $http({
                    method:API.addAddress.method,
                    url: API.addAddress.url,
                    data:params,
                    headers: {
                        'Authorization': TokenSer.getAuth()
                    }
                }).success(function (response) {
                    if (response) {
                        callback(response,1);
                    }
                });
            },
            updateAddress:function(params,callback){
                $http({
                    method:API.updateAddress.method,
                    url: API.updateAddress.url,
                    data:params,
                    headers: {
                        'Authorization': TokenSer.getAuth()
                    }
                }).success(function (response) {
                    if (response) {
                        callback(response,1);
                    }else{
                        callback(response,0);
                    }
                }).error(function(){
                    callback('网络错误',-1);
                });
            },
            removeAddress:function(addr_id,callback){
                $http({
                    method:API.removeAddress.method,
                    url: API.removeAddress.url+addr_id,
                    headers: {
                        'Authorization': TokenSer.getAuth()
                    }
                }).success(function (response) {
                    if (response) {
                        callback(response,1);
                    }
                });
            },
            setDefaultAddress:function(addr_id,callback){
                $http({
                    method: API.setDefaultAddress.method,
                    url: API.setDefaultAddress.url+addr_id,
                    headers: {
                        'Authorization': TokenSer.getAuth()
                    }
                }).success(function (response){
                    if (response) {
                        callback(response,1);
                    }
                });
            }
        };
    })


    /*订单服务*/
    .factory('MyOrdersSer',function(API,$http,TokenSer){
        var orders_all=null;
        var orders_unPay=null;
        var orders_paid=null;
        var orders_unRecieve=null;
        var orders_finish=null;
        var initData=function(data){
            for(var o in data){
                data[o].Specifications=JSON.parse(data[o].Specifications);//产品规格字符串转换json
                data[o].imageUrl=data[o].Commodity.RollingImages.split('|')[0];//商品图片（取第一张）
                data[o].discountUnitPrice=data[o].UnitPrice*data[o].DiscountVal;//折后单件价
                data[o].cost=data[o].UnitPrice*data[o].Count*data[o].DiscountVal;//折后价
                data[o].needToPay=data[o].cost-data[o].EarnestMoney;//待支付
            }
            return data;
        };
        return {
            getAllOrders:function(){
                return orders_all;
            },
            getUnPayOrders:function(){
                return orders_unPay;
            },
            getPaidOrders:function(){
                return orders_paid;
            },
            getUnReceiveOrders:function(){
                return orders_unRecieve;
            },
            getFinishOrders:function(){
                return orders_finish;
            },
            requestData:function(order_type,callback){ //order_type:1-待付款 2-已付款 3-已发货 4-已完成 5-已取消
                $http({
                    method:API.orderList.method,
                    url:API.orderList.url+order_type,
                    data: { "PageIndex": 0, "PageSize": 100,"TotalSize": 0, "TotalPage": 0},
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }).success(function(response,status,headers,config){
                    if(response){
                        switch(order_type){
                            case 1:orders_unPay=initData(response);break;
                            case 2:orders_paid=initData(response);break;
                            case 3:orders_unRecieve=initData(response);break;
                            case 4:orders_finish=initData(response);break;
                        }
                        callback(response,1);
                    }else{
                        switch(order_type){
                            case 1:orders_unPay=new Array();break;
                            case 2:orders_paid=new Array();break;
                            case 3:orders_unRecieve=new Array();break;
                            case 4:orders_finish=new Array();break;
                        }
                        callback(response,0);
                    }
                }).error(function(data,status,headers,config){

                });
            },
            cancelOrder:function(order_id,order_type,callback){
                $http({
                    method: API.cancelOrder.method,
                    url: API.cancelOrder.url+order_id,
                    headers: {
                        'Authorization': TokenSer.getAuth()
                    }
                }).success(function (response) {
                    if (response) {
                        switch(order_type){
                            case 1:orders_unPay=initData(response);break;
                            case 2:orders_paid=initData(response);break;
                            case 3:orders_unRecieve=initData(response);break;
                            case 4:orders_finish=initData(response);break;
                        }
                        callback(response,1);
                    }else{
                        callback(response,0);
                    }
                });
            }

        };
    })

    /*支付服务*/
    .factory('PaymentSer',function(API,$http,TokenSer){
        var data={
            addressId:null,
            orders:null
        };
        return {
            getData:function(){
                return data;
            },
            setData:function(new_data){
                data=new_data;
            },
            setOrdersData:function(new_data){
                data.orders=new_data;
            },
            clearData:function(){
                data={
                    addressId:null,
                    orders:null
                };
            },
            /*支付订单*/
            purchaseOrders:function(type,params,callback){
                var url=(type==0)?API.purchaseFromShoppingCart.url:API.purchaseFromUnPayOrders.url;
                var method=(type==0)?API.purchaseFromShoppingCart.method:API.purchaseFromUnPayOrders.method;
                $http({
                    method: method,
                    url: url,
                    data:params,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }) .success(function(response){
                    if(response){
                        callback(response,1);
                    }else{
                        callback(response,0);
                    }
                });
            },
           /* 支付定金*/
            payForEarnest:function(order_id,params,callback){
                $http({
                    method:API.payForEarnest.method,
                    url: API.payForEarnest.url+order_id,
                    data:params,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }) .success(function(response){
                    if(response){
                        callback(response,1);
                    }else{
                        callback(response,0);
                    }
                });
            },
            getStatusOfTrade:function(trade_id,callback){
                var url=API.getTradeStatus.url+trade_id;
                $http({
                    method: API.getTradeStatus.method,
                    url: url,
                    timeout: 10000,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }) .success(function(response){
                    if(response){
                        if(response=='2'){
                            callback(response,1);
                        }else{
                            callback(response,0);
                        }
                    }else{
                        callback(response,0);
                    }
                }).error(function(){
                    callback(null,-1);
                });
            }
        };

    })

    /*微信支付*/
    .factory('WXPaySer',function(API,$http,TokenSer){
        var data={
            totalCost:0
        };
        return {
            getData:function(){
                return data;
            },
            setTotalCost:function(new_cost){
                data.totalCost=new_cost;
            },
            getQRCodeData:function(trade_id,callback){
                $http({
                    method:API.getQRCodeData.method,
                    url:API.getQRCodeData.url+trade_id,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }).success(function(response,status,headers,config){
                    if(response){
                        callback(response,1);
                    }else{
                        callback(response,0);
                    }
                }).error(function(data,status,headers,config){

                });
            }
        };

    })

    /*支付定金*/
    .factory('PayForEarnest',function(API,$http,TokenSer){
        var data=null;
        return {
            getData:function(){
                return data;
            },
            setData:function(new_data){
                data=new_data;
            },
            payForEnergy:function(order_id,callback){
                $http({
                    method:API.payForEarnest.method,
                    url:API.payForEarnest.url+order_id,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }).success(function(response,status,headers,config){
                    if(response){
                        callback(response,1);
                    }else{
                        callback(response,0);
                    }
                }).error(function(data,status,headers,config){

                });
            }
        };

    })

    /*区域选择服务*/
    .factory('AreaSer',function(API,$http){
        var data=null;
        return {
            getData:function(){
                return data;
            },
            requestData:function(callback){
                $http({
                    method:API.getAreas.method,
                    url:API.getAreas.url
                }).success(function(response,status,headers,config){
                    if(response){
                        data=response;
                        callback(response,1);
                    }else{
                        callback(response,0);
                    }
                }).error(function(data,status,headers,config){
                    callback("网络错误",-1);
                });
            }
        };

    })

    /*消息服务*/
    .factory('MessageSer',function(API,$http,TokenSer){
        var msg=[null,null];//msg[0]:未读消息，msg[1]:已读消息，
        return {
            getData:function(index){
                return msg[index];
            },
            getMsgById:function(msg_type,msg_id){
                 for(var o in msg[msg_type]){
                     if(msg_id==msg[msg_type][o].Id){
                         return msg[msg_type][o];
                     }
                 }
            },
            /*获取消息列表*/
            requestMsg:function(msg_type,params,callback){
                var url=(msg_type==0)?API.messageOfUnRead.url:API.messageOfRead.url;//0未读 1已读
                var method=(msg_type==0)?API.messageOfUnRead.method:API.messageOfRead.method;
                $http({
                    method:method,
                    url:url,
                    data:params,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }).success(function(response,status,headers,config){
                    if(response){
                        msg[msg_type]=response;
                        callback(response,1);
                    }else{
                        callback(response,0);
                    }
                }).error(function(data,status,headers,config){
                    callback("网络错误",-1);
                });
            },
            /*根据消息ID请求消息内容*/
            requestMsgContentById:function(msg_id,callback){
                var url=API.messageContent.url+msg_id;
                $http({
                    method:API.messageContent.method,
                    url:url,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }).success(function(response,status,headers,config){
                    if(response){
                        callback(response,1);
                    }else{
                        callback("获取消息失败",0);
                    }
                }).error(function(data,status,headers,config){
                    callback("网络错误",-1);
                });
            },
           /* 删除指定消息*/
            removeMsg:function(msg_id,callback){
                $http({
                    method:API.removeMsg.method,
                    url:API.removeMsg.url+msg_id,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }).success(function(response,status,headers,config){
                    if(response){
                        callback(response,1);
                    }else{
                        callback("获取消息失败",0);
                    }
                }).error(function(data,status,headers,config){
                    callback("网络错误",-1);
                });
            }

        };

    })

    /*折扣卡服务*/
    .factory('DiscountCardSer',function(API,$http,TokenSer){
        var data=null;
        function initData(data){
            for(var o in data){
                data[o].Order.Specifications=angular.toJson(data[o].Order.Specifications);
                data[o].Order.imgUrl=data[o].Order.Commodity.RollingImages.split('|')[0];
            }
            console.log(data[0].Order.Specifications[0].name);
            return data;
        }
        return {
            getData:function(){
                return data;
            },
            /*请求折扣卡数据*/
            requestData:function(callback){
                $http({
                    method:API.discountCard.method,
                    url:API.discountCard.url,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }).success(function(response,status,headers,config){
                    if(response){
                       data=initData(response);
                        callback(initData(response),1);
                    }else{
                        callback('',0);
                    }
                }).error(function(data,status,headers,config){
                    callback("网络错误",-1);
                });
            }

        };

    })
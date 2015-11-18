angular.module('LuckyCat.services',[])
    .factory('TokenSer',function($http,$timeout,$cookieStore) {
        return {
            getAuth:function(){
                return  $cookieStore.get('Authorization');
             },
            getToken:function(){
                return  $cookieStore.get('Token');
            },
            remove:function(){
                $cookieStore.remove('Authorization');
                $cookieStore.remove('Token');
            }
        };
    })
    /*登陆服务*/
    .factory('LoginSer',function($http,$timeout,TokenSer){
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
                    method:'post',
                    url:app.interface.login,
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
                        method:'get',
                        url:app.interface.authorization+TokenSer.getToken()
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


    .factory('RefreshUserDataSer',function($http,TokenSer) {
        var data=null;
        return {
            getData:function(){
                return data;
            },
            requestUserData:function(callback){
                $http({
                    method:'get',
                    url:app.interface.refreshUserData,
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
.factory('FilterSer',function($http,$timeout){
        var data=null;
        /*清除与res下的所有选项*/
        var clearSelections=function(res){
            for(var o in res){
                res[o].isSelected=false;
            }
        };
       /* 通过id获取选项对象*/
        var getFilterItemById=function(id){
           for(var i=0;i<data.FilterModels.length;i++){
                for(var j=0;j<data.FilterModels[i].FilterItemModels.length;j++){
                    if(id==data.FilterModels[i].FilterItemModels[j].Id){
                        return data.FilterModels[i].FilterItemModels[j]
                    }
                }
            }
        };
       /* 通过选项id获取其父类对象*/
        var getFilterByItemId=function(id){
            for(var i=0;i<data.FilterModels.length;i++){
                for(var j=0;j<data.FilterModels[i].FilterItemModels.length;j++){
                    if(id==data.FilterModels[i].FilterItemModels[j].Id){
                        return data.FilterModels[i].FilterItemModels;
                    }
                }
            }
        }
        return {
            getData:function(){
                return data;
            },
            setData:function(category){
                data=category;
            },
            select:function(val_id){
                if(data==null){
                    console.log("FilterSer筛选数据未加载");
                    return;
                }
                clearSelections(getFilterByItemId(val_id));
                getFilterItemById(val_id).isSelected=true;
            },
            cancelSelect:function(val_id){
                getFilterItemById(val_id).isSelected=false;
            },
            /*清除所有已选状态*/
            clearSelect:function(){
                for(var i=0;i<data.FilterModels.length;i++){
                    for(var j=0;j<data.FilterModels[i].FilterItemModels.length;j++){
                        data.FilterModels[i].FilterItemModels[j].isSelected=false;
                    }
                }   
            },
            search:function(params){
                var c_id=data.Id;//品类id
                var f_items=new Array();//筛选器id
                for(var o in data.FilterModels){
                    for(var i in data.FilterModels[o].FilterItemModels){
                        if(data.FilterModels[o].FilterItemModels[i].isSelected==true){
                            f_items.push(data.FilterModels[o].FilterItemModels[i].Id);
                        }
                    }
                }
                var post_data={
                    "CategoryId":""+c_id,
                    "FilterItems":f_items,
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
                    method:'post',
                    url:app.interface.search,
                    data: post_data
                }).success(function(response,status,headers,config){
                    params.callback(response);
                }).error(function(data,status,headers,config){

                });
            }
        };
})
    /*分类数据服务*/
    .factory('CategorySer',function($http){
        var data=null;
        return {
            getData:function(){
                return data;
            },
            requestData:function(callback){
                $http({
                    method:'get',
                    url:app.interface.getAllCategory
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
    .factory('VerifyCodeSer',function($http){
        return {
            getVerifyCode:function(mobile_num,callback){
                $http.get(app.interface.getVerifyCode+mobile_num)
                    .success(function(response){
                        if(typeof callback=='function'){
                            callback(response);
                        }
                    });
            }
        };
    })

    /* 购物车服务*/
    .factory('CartSer',function($http,TokenSer){
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
                        method: 'post',
                        url: app.interface.cartList,
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
                        method: 'get',
                        url: app.interface.cartDeadline+u_id,
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
                purchaseOrders:function(params,callback){
                    $http({
                        method: 'post',
                        url: app.interface.purchaseOrders,
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
                    })
                },
                /*根据id删除购物车里的订单*/
                cancelOrder:function(order_id,callback){
                    $http({
                        method: 'get',
                        url: app.interface.cancelOrder+order_id,
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
    .factory('AddressSer',function($http,TokenSer){
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
                    method: 'get',
                    url: app.interface.addressList+user_id,
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
                    method: 'post',
                    url: app.interface.addAddress,
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
                    method: 'post',
                    url: app.interface.updateAddress,
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
            removeAddress:function(addr_id,callback){
                $http({
                    method: 'get',
                    url: app.interface.removeAddress+addr_id,
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
                    method: 'get',
                    url: app.interface.setDefaultAddress+addr_id,
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
    .factory('MyOrdersSer',function($http,TokenSer){
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
                    method:'post',
                    url:app.interface.orderList+order_type,
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
            }

        };
    })
angular.module('LuckyMall.services',[])
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
            categoryId:null,
            filters:new Array()
        };
        var data_category=null;
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
        /*是否已经有筛选项*/
        var hasFilterSelected=function(filter_id){
            for(var o in data_select.filters){
                if(filter_id==data_select.filters[o].filterId){
                    return true;
                }
            }
            return false;
        };
        /*通过id获取筛选项*/
        var getFilterById=function(filter_id){
            for(var o in data_category.FilterModels){
                if(filter_id==data_category.FilterModels[o].Id){
                    return data_category.FilterModels[o];
                }
            }
        };
        /*从容器中删除筛选项*/
        var removeFilter=function(filter_id){
            getFilterById(filter_id).isMultiSelected=false;//多选状态重置
            for(var o in data_select.filters){
                if(filter_id==data_select.filters[o].filterId){
                    data_select.filters.splice(o,1);
                }
            }
        };
        var initMulti=function(data){
            for(var o in data.FilterModels){
                if(!data.FilterModels[o].isMulti){
                    data.FilterModels[o].isMulti=false;
                }
                for(var i in data.FilterModels[o].FilterItemModels){
                    data.FilterModels[o].FilterItemModels[i].isMultiSelected=false;
                }
            }
            return data;
        };
        var clearFilter=function(filter_id){
            removeFilter(filter_id);//将该选项的已选项从容器中移除
            var filter = getFilterById(filter_id);
            filter.isMultiSelected=false;
            for (var o in filter.FilterItemModels) {
                filter.FilterItemModels[o].isSelected = false;//选择状态重置为false
                filter.FilterItemModels[o].isMultiSelected = false;//选择状态重置为false
            }
        };

        return {
            getCategoryData:function(){
                return data_category;
            },
            setCategoryData:function(new_data){
                data_category=initMulti(new_data);
            },
            getSelectData:function(){
                return data_select;
            },
            toggleMultiSelect:function(filter_id){
                for(var o in data_category.FilterModels){
                    if(filter_id!=data_category.FilterModels[o].Id){
                        data_category.FilterModels[o].isMulti=false;
                    }else{
                        data_category.FilterModels[o].isMulti=!data_category.FilterModels[o].isMulti;
                    }
                }
            },
            closeMultiSelect:function(filter_id){
                getFilterById(filter_id).isMulti=false;
            },
            setSelectData:function(new_data){
                data_select=new_data;
            },
            /*增加筛选项*/
            addSelection:function(filter_id,item_id){
                var filter=getFilterById(filter_id);
                if(hasFilterSelected(filter_id)){
                    for(var o in data_select.filters){
                        if(filter_id==data_select.filters[o].filterId){
                            data_select.filters[o].items=[item_id];
                        }
                    }
                }else{
                    data_select.filters.push({
                        filterId:filter_id,
                        type:0,
                        items:[item_id]
                    });
                }

            },
            /*增加筛选项（多选）*/
            addMultiSelection:function(filter_id){
                //clearFilter(filter_id);
                var filter=getFilterById(filter_id);
                var items=new Array();
                for(var o in filter.FilterItemModels){
                    if(filter.FilterItemModels[o].isMultiSelected){
                        items.push(filter.FilterItemModels[o].Id);
                    }
                }
                if(hasFilterSelected(filter_id)){
                    for(var o in data_select.filters){
                        if(filter_id==data_select.filters[o].filterId){
                            data_select.filters[o].type=1;
                            data_select.filters[o].items=items;
                        }
                    }
                }else{
                    data_select.filters.push({
                        filterId:filter_id,
                        type:1,
                        items:items
                    });
                }
                filter.isMultiSelected=true;
            },
            /*一个筛选器的多选操作*/
            multiSelect:function(filter_id,item_id){
                var filter=getFilterById(filter_id);
                for(var o in filter.FilterItemModels){
                    if(item_id==filter.FilterItemModels[o].Id){
                       filter.FilterItemModels[o].isMultiSelected=!filter.FilterItemModels[o].isMultiSelected;
                    }
                }
            },
            /*重置该筛选器的多选*/
            resetMultiSelection:function(filter_id){
                var filter=getFilterById(filter_id);
                filter.isMultiSelected=false;
                for(var o in filter.FilterItemModels){
                    filter.FilterItemModels[o].isMultiSelected=false;
                }
            },
            /*重置某一行筛选项*/
            resetFilter:function(filter_id){
                clearFilter(filter_id);
            },
            removeSelection:function(filter_id){
                removeFilter(filter_id);
            },
            select:function(){
                if(data_category&&data_category.FilterModels) {
                    for(var o in data_select.filters){
                        var filter=getFilterById(data_select.filters[o].filterId);
                        var isMultiSelected=(data_select.filters[o].type==1)?true:false;//是否是多选
                        if (isMultiSelected) {
                            filter.isMultiSelected = true;
                        } else {
                            filter.isMultiSelected = false;
                        }
                        for (var i in filter.FilterItemModels) {
                            for (var j in data_select.filters[o].items) {
                                if (data_select.filters[o].items[j] == filter.FilterItemModels[i].Id) {
                                    if (isMultiSelected) {
                                        filter.FilterItemModels[i].isMultiSelected = true;
                                    } else {
                                        filter.FilterItemModels[i].isSelected = true;
                                    }
                                }
                            }
                        }
                    }
                }
            },
            /*清除所有已选状态*/
            clearSelect:function(){
                if (data_category&&data_category.FilterModels) {
                    for (var i = 0; i < data_category.FilterModels.length;i++) {
                        data_category.FilterModels[i].isMultiSelected=false;
                        for (var j = 0; j < data_category.FilterModels[i].FilterItemModels.length; j++) {
                            data_category.FilterModels[i].FilterItemModels[j].isMultiSelected = false;
                            data_category.FilterModels[i].FilterItemModels[j].isSelected = false;
                        }
                    }
                }
            },


            requestCategoryById:function(cate_id,callback){
                $http({
                    method:API.getCategoryById.method,
                    url:API.getCategoryById.url+cate_id
                }).success(function(response,status,headers,config){
                    if(response&&status==200){
                        data_category=response;
                        callback(response,1);
                    }else{
                        callback('',0);
                    }
                }).error(function(data,status,headers,config){
                    callback('网络错误',-1);
                });
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
                    total_cost+=data[o].needToPay;
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
        var orders_temp=null;
        var orders_after=null;
        var initData=function(data,type){ //type 0 售前单   1 售后单
            for(var o in data){
                var obj=(type==0)?data[o]:data[o].Order;
                obj.brandImg=obj.Brand?obj.Brand.BrandImage:'';
                obj.Specifications=JSON.parse(obj.Specifications);//产品规格字符串转换json
                obj.imageUrl=obj.Commodity.RollingImages.split('|')[0];//商品图片（取第一张）
                obj.discountUnitPrice=obj.UnitPrice*obj.DiscountVal;//折后单件价
                obj.cost=obj.UnitPrice*obj.Count*obj.DiscountVal;//折后价
                obj.needToPay=obj.cost-obj.EarnestMoney;//待支付
                if(obj.ConsigneeInfo!=(''||null)){
                    obj.ConsigneeInfo=JSON.parse(obj.ConsigneeInfo);//收货地址
                }
            }
            return data;
        };
        return {
            getAllOrders:function(){
                return orders_all;
            },
            getTempOrder:function(){
                return orders_temp;
            },
            setTempOrder:function(new_data){
                orders_temp=new_data;
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
            getAfterOrders:function(){
                return orders_after;
            },
            getOrder:function(order_status,order_id){
                var obj='';
                switch (parseInt(order_status)){
                    case 1:obj=orders_unPay;break;
                    case 2:obj=orders_paid;break;
                    case 3:obj=orders_unRecieve;break;
                    case 4:obj=orders_finish;break;
                    case 5:obj=orders_after;break;
                }
                for(var o in obj){
                    if(order_id==obj[o].Id){
                        return obj[o];
                    }
                }
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
                            case 1:orders_unPay=initData(response,0);break;
                            case 2:orders_paid=initData(response,0);break;
                            case 3:orders_unRecieve=initData(response,0);break;
                            case 4:orders_finish=initData(response,0);break;
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
            requestAfterOrders:function(callback){
                $http({
                    method:API.afterOrders.method,
                    url:API.afterOrders.url,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }).success(function(response,status,headers,config){
                    if(response){
                        orders_after=initData(response,1);
                        callback(response,1);
                    }
                });
            },
            confirmReceive:function(order_id,callback){
                $http({
                    method:API.confirmReceive.method,
                    url:API.confirmReceive.url+order_id,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }).success(function(response,status,headers,config){
                    if(response){
                        callback(response,1);
                    }
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
                            case 1:orders_unPay=initData(response,0);break;
                            case 2:orders_paid=initData(response,0);break;
                            case 3:orders_unRecieve=initData(response,0);break;
                            case 4:orders_finish=initData(response,0);break;
                        }
                        callback(response,1);
                    }else{
                        callback(response,0);
                    }
                });
            },
            /*售后服务申请*/
            submitAfterServiceApplication:function(params,callback){
                $http({
                    method: API.ApplyAfterService.method,
                    url: API.ApplyAfterService.url,
                    data:params,
                    timeout:5000,
                    headers: {
                        'Authorization': TokenSer.getAuth()
                    }
                }).success(function (response) {
                   if(response){
                       callback(response,1);
                   }else{
                       callback(response,0);
                   }
                }).error(function(){
                    callback('网络错误',-1);
                });
            }

        };
    })

    /*支付服务*/
    .factory('PaymentSer',function(API,$http,TokenSer){
        var data={
            addressId:null,
            orders:null,
            tempOrder:null //临时订单  存放立即购买时下的订单
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
            setTempOrder:function(new_data){
                data.tempOrder=new_data;
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
            },
            getTradeInfoByOrderId:function(order_id,callback){
                $http({
                    method: API.getTradeInfo.method,
                    url: API.getTradeInfo.url+order_id,
                    timeout: 10000,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }) .success(function(response){
                    if(response){
                        callback(response,1);
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
                var spe=data[o].Order.Specifications;
                data[o].Order.goodsProperty=JSON.parse(spe);
                data[o].Order.imgUrl=data[o].Order.Commodity.RollingImages.split('|')[0];
                data[o].discountPrice=(data[o].BaseDiscount*data[o].Order.UnitPrice).toFixed(2);
                data[o].BaseDiscount=10*(data[o].BaseDiscount.toFixed(2));
            }
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
                        callback('',1);
                    }else{
                        callback('',0);
                    }
                }).error(function(data,status,headers,config){
                    callback("网络错误",-1);
                });
            }

        };
    })

    .factory('LogisticsSer',function(API,$http,TokenSer){
        var data=null;
        return {
            getData:function(){
                return data;
            },
           /* 获取物流信息*/
            requestData:function(order_id,type,callback){ //type状态  0售前  1售后
                $http({
                    method:API.getLogisticsInfo.method,
                    url:API.getLogisticsInfo.url+order_id+'/'+type,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }).success(function(response,status,headers,config){
                    if(response){
                        data=response.lastResult;
                        callback(response,1);
                    }else{
                        callback('',0);
                    }
                }).error(function(data,status,headers,config){
                    callback("网络错误",-1);
                });
            }
        }
    })

    .factory('WalletSer',function(API,$http,TokenSer){
        var data=null;
        return {
            getData:function(){
                return data;
            },
            requestData:function(callback){
                $http({
                    method:API.wallet.method,
                    url:API.wallet.url,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }).success(function(response,status,headers,config){
                    if(response){
                        callback(response,1);
                        console.log(angular.toJson(response));
                    }else{
                        callback('',0);
                    }
                }).error(function(data,status,headers,config){
                    callback("网络错误",-1);
                });
            }
        }
    })

    .factory('UploadSer',function(API,$http,TokenSer,FileUploader){
        return {
            initUploader:function(max_count,max_size){
                var uploader=new FileUploader({
                    url: API.upload.url,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                });

                uploader.filters.push({
                    name: 'customFilter',
                    fn: function(item /*{File|FileLikeObject}*/, options) {
                        return this.queue.length <max_count;
                    }
                });
                // CALLBACKS

                uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                    console.info('onWhenAddingFileFailed', item, filter, options);
                };
                uploader.onAfterAddingFile = function(fileItem) {
                    fileItem.upload();
                    console.info('onAfterAddingFile', fileItem);
                };
                uploader.onAfterAddingAll = function(addedFileItems) {
                    console.info('onAfterAddingAll', addedFileItems);
                };
                uploader.onBeforeUploadItem = function(item) {
                    console.info('onBeforeUploadItem', item);
                };
                uploader.onProgressItem = function(fileItem, progress) {
                    console.info('onProgressItem', fileItem, progress);
                };
                uploader.onProgressAll = function(progress) {
                    console.info('onProgressAll', progress);
                };
                uploader.onSuccessItem = function(fileItem, response, status, headers) {
                    console.info('onSuccessItem', fileItem, response, status, headers);
                };
                uploader.onErrorItem = function(fileItem, response, status, headers) {
                    console.info('onErrorItem', fileItem, response, status, headers);
                };
                uploader.onCancelItem = function(fileItem, response, status, headers) {
                    console.info('onCancelItem', fileItem, response, status, headers);
                };
                uploader.onCompleteItem = function(fileItem, response, status, headers) {
                    console.info('onCompleteItem', fileItem, response, status, headers);
                    fileItem.url=response;
                };
                uploader.onCompleteAll = function() {
                    console.info('onCompleteAll');
                };
                return uploader;
            }
        }
    })

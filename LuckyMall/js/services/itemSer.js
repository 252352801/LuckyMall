angular.module('LuckyMall.services')
.factory('ItemSer',function(API,$http,$timeout,TokenSer){
        var data = null;//商品数据
        var category_info=null;//商品品类信息
        /*初始化产品规格的可选属性*/
        var initData=function(){
            for(var i=0;i<data.Property.length;i++){
                for(var j=0;j<data.Property[i].attributes.length;j++){
                    data.Property[i].attributes[j].disabled=true;//disabled=true表示不可选
                }
/*                if(data.Property[i].attributes.length==1){
                    data.Property[i].attributes[0].isSelected=true;
                }*/
            }
        };
        var setRemainTime=function(cur_time,end_time){
            var t_cur=new Date(cur_time.replace(/-/g,"/"));
            var t_end=new Date(end_time.replace(/-/g,"/"));
            return (t_end-t_cur)/1000;
        };
       var testStatus=function(is_sold_out,cur_time,sale_time,end_time,item_status){
           var t_cur=new Date(cur_time.replace(/-/g,"/"));
           var t_sale=new Date(sale_time.replace(/-/g,"/"));
           var t_end=new Date(end_time.replace(/-/g,"/"));
           if(item_status==0||item_status==1||item_status==2){
               return -2;//未上架
           }else if(item_status==3) {
               if(is_sold_out){
                   return 6;//卖完了
               }
               if (t_cur > t_sale && t_cur < t_end) {
                   return 1;//正在销售(唯一可下单状态)
               } else {
                   if (t_cur >= t_sale) {
                       return -1;//已过出售时间
                   } else if (t_cur <= t_sale) {
                       return 0; //未开售
                   }
               }
           }else if(item_status==4){
               return 4;//下架
           }else if(item_status==5){
               return 5;//已过出售时间
           }
       };
        return {
            /*外部获取数据途径*/
            getData: function () {
                return data;
            },
            /*请求数据*/
            requestData: function (goods_id, callback) {
                $http({
                    method:API.goodsDetailsData.method,
                    url: API.goodsDetailsData.url+ goods_id
                }).success(function (response, status, headers, config) {
                    if(status==200&&response!=null) {
                        data = response;
                        data.minPrice=Math.ceil(data.RetailPrice*data.MaxDiscount);
                        data.maxPrice=Math.ceil(data.RetailPrice*data.MinDiscount);
                        data.SmallImages = data.RollingImages.split('|');
                        data.BigImages = data.DetailImages.split('|');
                        data.Property = JSON.parse(data.Property);
                        data.remainTime=setRemainTime(data.CurrentTime,data.ExpiryDate);
                        data.status=testStatus(data.SoldOut,data.CurrentTime,data.OnSaleTime,data.ExpiryDate,data.CommodityStatus);
                        initData();
                        callback(data,1);
                    }else{
                        callback('',0);
                    }

                }).error(function (data, status, headers, config) {

                });
            },
            /*是否可以免费试玩*/
            isCanFreePlay:function(goods_id,callback){
                $http({
                    method: API.isCanFreePlay.method,
                    url: API.isCanFreePlay.url+goods_id,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }).success(function (response, status, headers, config) {
                    if(status==200){
                        callback(response,1);
                    }else{
                        callback(response,0);
                    }
                })
            },
            /*根据商品id获取品类数据*/
            requestCategoryByGoodsId:function(goods_id,callback){
                $http({
                    method:API.getCategoryByGoodsId.method,
                    url: API.getCategoryByGoodsId.url+ goods_id
                }).success(function (response, status, headers, config) {
                    if(response){
                        var item_data=new Array();
                        for(var o in response){
                            for(var obj in response[o].FilterItemModels){
                                if(response[o].FilterItemModels[obj].Selected==true){
                                    var item={
                                        filterId:response[o].Id,
                                        itemId:response[o].FilterItemModels[obj].Id,
                                        itemValue:response[o].FilterItemModels[obj].ItemValue

                                    };
                                    item_data.push(item);
                                }
                            }
                        }
                        category_info={
                            categoryId:  response[0].CategoryId,
                            items:item_data
                        };
                        callback(category_info,1);
                    }else{
                        callback('',0);
                    }
                })
            },
          /*  选择商品属性*/
            selectAttr: function (attr,val,callback) {
                for (var o in data.Property) {
                    if (data.Property[o].name == attr) {
                        for (var i in data.Property[o].attributes) {
                            if (data.Property[o].attributes[i].value == val) {
                                if(data.Property[o].attributes[i].isSelected==true){//如果该属性已选，则取消选择
                                    callback();
                                }else{
                                    data.Property[o].attributes[i].isSelected = true;
                                }
                            } else {
                                data.Property[o].attributes[i].isSelected = false;
                            }
                        }
                        break;
                    }
                }
            },
            /*清除所有选择状态*/
            clearSelections:function(){
                for (var o in data.Property) {
                        for (var i in data.Property[o].attributes) {
                           data.Property[o].attributes[i].isSelected = false;
                        }
                }
            },
            cancelSelection:function(val){
                for (var o in data.Property) {
                    for (var i in data.Property[o].attributes) {
                        if(val==data.Property[o].attributes[i].value){
                            data.Property[o].attributes[i].isSelected = false;
                        }
                    }
                }
            },
            /*检测库存*/
            testSku:function(choice,callback){
                initData();
                var sku=data.StockKeepingUnitModels;
                var remain_sku=new Array();
                for(var i=0;i<sku.length;i++){
                    if(angular.fromJson(sku[i].Specifications).length>0) {
                        var flag = true;
                        sku[i].specify = sku[i].Specifications.replace('[', '').replace(']', '').split(',');
                        for (var j = 0; j < choice.length; j++) {
                            if (choice[j] != sku[i].specify[j] && choice[j] != -1) {
                                flag = false;
                                break;
                            }
                        }
                        if (flag == true) {
                            remain_sku.push(sku[i].specify);
                        }
                    }
                }
                for(var i=0;i<remain_sku.length;i++){
                        for(var j=0;j<remain_sku[i].length;j++){
                            data.Property[j].attributes[parseInt(remain_sku[i][j])].disabled=false;
                        }
                }
                callback();
            },
            /*获取选择的SKU*/
            getSkuByChoice:function(arr){
                for(var i=0;i<data.StockKeepingUnitModels.length;i++){
                    if(arr.toString()==data.StockKeepingUnitModels[i].specify.toString()){
                        return data.StockKeepingUnitModels[i];
                    }
                }
            },
            /*获取已选的规格、属性*/
            getSelectedAttributes:function(){
                var result=new Array();
                for (var o in data.Property) {
                        for (var i in data.Property[o].attributes) {
                           if(data.Property[o].attributes[i].isSelected==true){
                                var attr={"name":data.Property[o].name,"value":data.Property[o].attributes[i].value};
                                result.push(attr);
                           }
                        }
                }
                return result;
            },
            addToCart:function(params,callback){
                $http({
                    method: API.addToCart.method,
                    url: API.addToCart.url,
                    data:params,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }).success(function (response, status, headers, config) {
                    if(status==200){
                        if(response.Code=="0X00"){
                            callback(response,1);
                        }else{
                            callback(response,0);
                        }
                    }else{
                            callback('下单失败！',-1);
                    }
                })
                .error(function(response,status){
                    if(status==401){
                        callback("账号过期！",2);
                    }else{
                        callback('请求失败！',-2);
                    }
                });
            }
        };
	
})
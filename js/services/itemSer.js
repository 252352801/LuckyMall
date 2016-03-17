angular.module('LuckyMall.services')
.factory('ItemSer',function(API,$http,$timeout,TokenSer){
        var data = null;//商品数据
        var category_info=null;//商品品类信息
        /*初始化产品规格的可选属性*/
        var initData=function(){
            for(var i=0;i<data.Property.length;i++){
                for(var j=0;j<data.Property[i].attributes.length;j++){
                    data.Property[i].attributes[j].disabled=false;//disabled=true表示不可选
                }
            }
            for(var o in data.StockKeepingUnitModels){
                var sku=angular.fromJson(data.StockKeepingUnitModels[o].Specifications);
                for(var i in sku){
                    data.Property[i].attributes[sku[i]].valid=true;//该属性是否有库存
                }
            }
            //console.log(data);
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
           if(item_status==0||item_status==1||item_status==2||item_status==3){
               return -2;//未上架
           }else if(item_status==4) {
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
           }else if(item_status==5){
               return 4;//下架
           }else if(item_status==6){
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
                        data.minPrice=data.FloorPrice;//Math.ceil(data.RetailPrice*data.MaxDiscount);
                        data.maxPrice=data.CeilingPrice;//Math.ceil(data.RetailPrice*data.MinDiscount);
                        data.minDiscount=(data.MinDiscount*10).toFixed(1);
                        data.maxDiscount=(data.MaxDiscount*10).toFixed(1);
                        data.SmallImages = data.RollingImages.split('|');
                        data.BigImages = data.DetailImages.split('|');
                        data.Property = angular.fromJson(data.Property);
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
                    url: API.isCanFreePlay.url+goods_id
                }).success(function (response, status, headers, config) {
                    if(status==200){
                        callback(response,1);
                    }else{
                        callback(response,0);
                    }
                })
            },
            getRanking:function(id,callback){//获取排行榜
                $http.get(API.getRanking.url+id)
                    .success(function(response,status){
                        if(response&&status==200) {
                            callback(response, 1);
                        }else{
                            callback(response,0);
                        }
                    }).error(function(response,status){
                        callback(response,-1);
                    });
            },
            getPricesOfOthers:function(id,callback){
                $http.get(API.getPricesOfOthers.url+id)
                    .success(function(response,status){
                        if(response&&status==200) {
                            callback(response, 1);
                        }else{
                            callback(response,0);
                        }
                    }).error(function(response,status){
                        callback(response,-1);
                    });
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
            addToCart:function(params,callback){
                $http({
                    method: API.addToCart.method,
                    url: API.addToCart.url,
                    data:params
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
            },
            getSOOData:function(params,callback){
                $http({
                    method: API.SOOListOfItem.method,
                    url: API.SOOListOfItem.url,
                    data: params
                }).success(function (response, status, headers, config) {
                    if (status == 200 && response) {
                        for(var o in response){
                            response[o].Avatar=angular.fromJson(response[o].Avatar);
                            response[o].images=response[o].Image.split('|');
                            response[o].bigImgIndex=-1;
                            response[o].bigImgUrl='';
                        }
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                })
                    .error(function (response, status) {
                        callback(response, -1);
                    });
            }
        };
	
})
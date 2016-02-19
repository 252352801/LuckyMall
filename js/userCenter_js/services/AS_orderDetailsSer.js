angular.module('LuckyMall.services')

.factory('AS_OrderDetailsSer',function(API,$http,TokenSer){
    var data=null;
    var initData=function(data){
                data.brandImg=data.Brand?data.Brand.BrandImage:'';
                data.Specifications=JSON.parse(data.Specifications);//产品规格字符串转换json
                data.imageUrl=data.Commodity.RollingImages.split('|')[0];//商品图片（取第一张）
                data.discountUnitPrice=data.UnitPrice*data.DiscountVal;//折后单件价
                data.cost=data.UnitPrice*data.Count*data.DiscountVal;//折后价
                data.needToPay=data.cost-data.EarnestMoney;//待支付
                if(data.ConsigneeInfo!=(''||null)){
                    data.ConsigneeInfo=JSON.parse(data.ConsigneeInfo);//收货地址
                }
            return data;
     };
	return {
        getData:function(){
          return data;
        },
      requestData:function(order_id,callback){
            $http({
                method:API.orderDetails.method,
                url:API.orderDetails.url+order_id
            }).success(function(response,status,headers,config){
                if(response){
                    var new_data=initData(response);
                    data=new_data;
                    callback(new_data,1);
                }else{
                    callback(response,0);
                }
            }).error(function(data,status,headers,config){
                    callback(data,0);
            });
        }
	};
})


angular.module('LuckyCat.services')
.factory('GoodsDetailsSer',function($http,$timeout,TokenSer){
        var data = null;//商品数据
        var category_info=null;//商品品类信息
        /*初始化产品规格的可选属性*/
        var initDisabled=function(){
            for(var i=0;i<data.Property.length;i++){
                for(var j=0;j<data.Property[i].attributes.length;j++){
                    data.Property[i].attributes[j].disabled=true;//disabled=true表示不可选
                }
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
                    method: 'get',
                    url: app.interface.goodsDetailsData+ goods_id
                }).success(function (response, status, headers, config) {
                    data = response;
                    data.SmallImages = data.RollingImages.split('|');
                    data.BigImages = data.DetailImages.split('|');
                    data.Property = JSON.parse(data.Property);
                    initDisabled();
                    callback();

                }).error(function (data, status, headers, config) {

                });
            },
            /*根据商品id获取品类数据*/
            requestCategoryByGoodsId:function(goods_id,callback){
                $http({
                    method: 'get',
                    url: app.interface.getCategoryByGoodsId+ goods_id
                }).success(function (response, status, headers, config) {
                    if(response){
                        var item_data=new Array();
                        for(var o in response){
                            for(var obj in response[o].FilterItemModels){
                                if(response[o].FilterItemModels[obj].Selected==true){
                                    var item={
                                        itemId:response[o].FilterItemModels[obj].Id,
                                        itemValue:response[o].FilterItemModels[obj].ItemValue

                                    };
                                    item_data.push(item);
                                }
                            }
                        }
                        category_info={
                            categoryId:  response[0].CategoryId,
                            categoryName:response[0].FilterName.replace('分类',''),
                            items:item_data
                        };
                        callback(category_info,1);
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
                initDisabled();
                var sku=data.StockKeepingUnitModels;
                var remain_sku=new Array();
                for(var i=0;i<sku.length;i++){
                    var flag=true;
                    sku[i].specify=sku[i].Specifications.replace('[','').replace(']','').split(',');
                    for(var j=0;j<choice.length;j++){
                        if(choice[j]!=sku[i].specify[j]&&choice[j]!=-1){
                            flag=false;
                            break;
                        }
                    }
                    if(flag==true){
                        remain_sku.push(sku[i].specify);
                    }
                }
                console.log(angular.toJson(remain_sku));
                for(var i=0;i<remain_sku.length;i++){
                        console.log('【可选属性'+(i+1)+'】:');
                        for(var j=0;j<remain_sku[i].length;j++){
                            data.Property[j].attributes[parseInt(remain_sku[i][j])].disabled=false;
                            console.log(data.Property[j].attributes[remain_sku[i][j]].value);
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
                    method: 'post',
                    url: app.interface.addToCart,
                    data:params,
                    headers: {
                        'Authorization':TokenSer.getAuth()
                    }
                }).success(function (response, status, headers, config) {
                    if(response.Data!=null){
                            callback(response,1);
                    }else{
                            callback(response,0);

                    }
                })
                .error(function(response,status){
                    if(status==401){
                        callback("您的账号在别处登陆，请退出后重新登陆",2);
                    }
                });
            }
        };
	
})
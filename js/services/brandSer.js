angular.module('LuckyMall.services')
    .factory('BrandSer', function (API, $http, $timeout) {
        var data = null;
        var initData = function (data) {
            for (var o in data) {
                data[o].RollingImages = data[o].RollingImages.split('|');
                data[o].DetailImages = data[o].DetailImages.split('|');
                data[o].minPrice = data[o].FloorPrice;//Math.ceil(data[o].RetailPrice * data[o].MaxDiscount);
                data[o].maxPrice = data[o].CeilingPrice;//Math.ceil(data[o].RetailPrice * data[o].MinDiscount);
            }
            return data
        };
        return {
            getData: function () {
                return data;
            },
            sortByPriceUp:function(){ //从小到大
                if(data){
                    data.sort(function(a,b){return a.maxPrice- b.maxPrice;});
                }
            },
            sortByPriceDown:function(){ //从大到小
                if(data){
                    data.sort(function(a,b){return b.maxPrice- a.maxPrice;});
                }
            },
            /*通过ID获取品牌*/
            getBrandById:function(brand_id,callback){
                $http.get(API.getBrandById.url+brand_id)
                    .success(function(response,status){
                        if(status==200&&response) {
                            callback(response);
                        }
                    });
            },
            requestData: function (params, callback) {
                $http({
                    method: API.searchOnline.method,
                    url: API.searchOnline.url,
                    data: params
                }).success(function (response) {
                    if (response) {
                        data = initData(response);
                        callback(data, 1);
                    }
                })
            }

        };
    })


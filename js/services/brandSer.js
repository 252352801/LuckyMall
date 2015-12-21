angular.module('LuckyMall.services')
    .factory('BrandSer', function (API, $http, $timeout) {
        var data = null;
        var initData = function (data) {
            for (var o in data) {
                data[o].RollingImages = data[o].RollingImages.split('|');
                data[o].DetailImages = data[o].DetailImages.split('|');
                data[o].minPrice = Math.ceil(data[o].RetailPrice * data[o].MaxDiscount);
                data[o].maxPrice = Math.ceil(data[o].RetailPrice * data[o].MinDiscount);
            }
            return data
        };
        return {
            getData: function () {
                return data;
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


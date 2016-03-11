angular.module('LuckyMall.services', [])


    .factory('TokenSer', function (API, $http, $timeout, $cookies) {
        return {
            getAuth: function () {
                return  'Basic ' + $cookies.get('Token');
            },
            getToken: function () {
                return  $cookies.get('Token');
            },
            remove: function () {
                $cookies.remove('Token');
            }
        };
    })

    /*获取阿里云图片服务器ser*/
    .factory('ImgSer', function (API, $http) {
        var data;
        return {
            getData: function () {
                return data;
            },
            requestData: function (callback) {
                $http({
                    method: API.ImgHost.method,
                    url: API.ImgHost.url
                }).success(function (response) {
                    if (response != null) {
                        data = response;
                        callback(response, 1);
                    }
                });
            }
        };
    })
    /*登陆服务*/
    .factory('LoginSer', function (API, $http, $timeout, TokenSer) {
        var data = null;
        /*var isLogin=false;*/
        return {
            getData: function () {
                return data;
            },
            setData: function (new_data) {
                data = new_data;
            },
            getToken: function () {
                return data.token;
            },
            isLogin: function () {
                return TokenSer.getToken() ? true : false;
            },
            login: function (username, password, callback) {
                $http({
                    method: API.login.method,
                    url: API.login.url,
                    data: {  "Name": username, "Password": password}
                }).success(function (response) {
                    if (response) {
                        data = response;
                        /*isLogin=true;*/
                        if (typeof callback == 'function') {
                            callback(data.Token, 1);
                        }
                    } else {
                        callback(null, 0);
                    }
                }).error(function (data, status, headers, config) {
                    callback(null, -1);
                });
            },
            exit: function () {
                $timeout(function () {
                    data = null;
                    TokenSer.remove();
                });
            },
            authorization: function (callback, auth) {
                var param = auth ? auth : TokenSer.getToken();
                if (TokenSer.getToken()) {
                    $http({
                        method: API.authorization.method,
                        url: API.authorization.url + param
                    }).success(function (response) {
                        if (response) {
                            if (!response.Token) {
                                return;
                            }
                            data = response;
                            /*isLogin=true;*/
                            if (typeof callback == 'function') {
                                callback(data.Token, 1);
                            }
                        } else {
                            TokenSer.remove();
                            callback(null, 0);
                        }
                    }).error(function (data, status, headers, config) {
                        callback(null, -1);
                    });
                } else {
                    callback(null, -2);
                }
            }
        };
    })

    .factory('UserSer', function (API, $http, TokenSer) {
        var data = {
            UserModel: null,
            LuckyEnergy: null
        }
        return {
            getData: function () {
                return data;
            },
            getUserData: function () {
                return data.UserModel;
            },
            getLuckyEnergyData: function () {
                return data.LuckyEnergy;
            },
            setData: function (new_data) {
                data = new_data;
            },
            setUserData: function (new_data) {
                data.UserModel = new_data;
            },
            setLuckyEnergyData: function (new_data) {
                data.LuckyEnergy = new_data;
            },
            getSessionKey: function (callback) {
                $http({
                    method: API.getSessionKey.method,
                    url: API.getSessionKey.url
                }).success(function (response, status, headers, config) {
                    if (response && status == 200) {
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                });
            },
            updateNickname: function (new_nickname, callback) {
                $http({
                    method: API.updateNickname.method,
                    url: API.updateNickname.url + new_nickname
                }).success(function (response, status, headers, config) {
                    if (response) {
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                }).error(function (data, status, headers, config) {
                    callback(data, 0);
                });
            },
            agreeEarnestProtocol: function (callback) {
                $http({
                    method: API.agreeEarnestProtocol.method,
                    url: API.agreeEarnestProtocol.url
                }).success(function (response, status, headers, config) {
                    if (response && status == 200) {
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                }).error(function (data, status, headers, config) {
                    callback(data, 0);
                });
            },
            saveAvatar: function (params, callback) {//保存头像数据
                $http({
                    method: API.saveAvatar.method,
                    url: API.saveAvatar.url,
                    data: params
                }).success(function (response, status, headers, config) {
                    if (response && status == 200) {
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                }).error(function (data, status, headers, config) {
                    callback(data, -1);
                });
            },
            getAvatarBase64Img: function (callback) {
                $http({
                    method: API.getAvatarBase64Img.method,
                    url: API.getAvatarBase64Img.url
                }).success(function (response, status) {
                    if (response && status == 200) {
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                })
            }
        };
    })


    .factory('RefreshUserDataSer', function (API, $http, TokenSer) {
        var data = null;
        return {
            getData: function () {
                return data;
            },
            requestUserData: function (callback) {
                $http({
                    method: API.refreshUserData.method,
                    url: API.refreshUserData.url
                }).success(function (response, status) {
                    if (response != null) {
                        data = response;
                        callback(response, 1);
                    }
                });
            }
        };
    })


/**
 * 快速搜索
 */
    .factory('SearchSer', function (API, $http, TokenSer) {

        var initData=function(arr){
            for(var o in arr){
                arr[o].RollingImages=arr[o].RollingImages.split('|');
                arr[o].DetailImages=arr[o].DetailImages.split('|');
                arr[o].minPrice=arr[o].FloorPrice;;//Math.ceil(arr[o].RetailPrice*arr[o].MaxDiscount);
                arr[o].maxPrice=arr[o].CeilingPrice;//Math.ceil(arr[o].RetailPrice*arr[o].MinDiscount);
            }
            return arr;
        };
        return {
            getKeyWords: function (params,callback) {
                $http({
                    method: API.quickSearch.method,
                    url: API.quickSearch.url,
                    data:params
                }).success(function (response, status) {
                    if (status==200&&response != null) {
                        callback(response,1);
                    }
                });
            },
            sortByPriceUp:function(data){ //从小到大
                if(data){
                    data.sort(function(a,b){return a.maxPrice- b.maxPrice;});
                }
                return data;
            },
            sortByPriceDown:function(data){ //从大到小
                if(data){
                    data.sort(function(a,b){return b.maxPrice- a.maxPrice;});
                }
                return data;
            },
            searchCommodities:function(params,callback){
                $http({
                    method: API.searchWithKeyword.method,
                    url: API.searchWithKeyword.url,
                    data:params
                }).success(function (response, status) {
                    if (status==200&&response != null) {
                        callback(initData(response),1);
                    }
                });
            },
            submitWishing:function(params,callback){
                $http({
                    method: API.submitWishing.method,
                    url: API.submitWishing.url,
                    data:params
                }).success(function (response, status) {
                    callback(response,status);
                }).error(function(response,status){
                    callback(response,status);
                });
            }
        };
    })

    /*列表页筛选器*/
    .factory('FilterSer', function (API, $http, $timeout) {
        var data_select = {
            categoryId: null,
            filters: new Array()
        };
        var data_select_brand = {
            isMultiSelected: false,
            items: []
        };
        var data_subCategory = null;
        var data_brands = null;
        var data_category = null;
        var filterData = function (data) {//筛选出正在销售的商品
            var result = new Array();
            var time_now = new Date();
            for (var o in data) {
                var t1 = new Date(data[o].OnSaleTime.replace(/-/g, "/"));
                var t2 = new Date(data[o].ExpiryDate.replace(/-/g, "/"));
                if (time_now.getTime() >= t1.getTime() && time_now.getTime() < t2.getTime()) {
                    result.push(data[o]);
                }
            }
            return result;
        };
        var hasSubCategory = false;
        /*是否已经有筛选项*/
        var hasFilterSelected = function (filter_id) {
            for (var o in data_select.filters) {
                if (filter_id == data_select.filters[o].filterId) {
                    return true;
                }
            }
            return false;
        };
        /*通过id获取筛选项*/
        var getFilterById = function (filter_id) {
            for (var o in data_category.FilterModels) {
                if (filter_id == data_category.FilterModels[o].Id) {
                    return data_category.FilterModels[o];
                }
            }
        };
        /*通过ID获取子分类*/
        var getSubCategoryFilterById = function (filter_id) {
            for (var o in data_category.SubCategories) {
                for (var i in data_category.SubCategories[o].FilterModels) {
                    if (filter_id == data_category.SubCategories[o].FilterModels[i].Id) {
                        return data_category.SubCategories[o].FilterModels[i];
                    }
                }
            }
        };
        /*从容器中删除筛选项*/
        var removeFilter = function (filter_id) {
            var filter = hasSubCategory ? getSubCategoryFilterById(filter_id) : getFilterById(filter_id);
            filter.isMultiSelected = false;//多选状态重置
            for (var o in data_select.filters) {
                if (filter_id == data_select.filters[o].filterId) {
                    data_select.filters.splice(o, 1);
                }
            }
        };
        var initMulti = function (data) {
            for (var o in data.FilterModels) {
                if (!data.FilterModels[o].isMulti) {
                    data.FilterModels[o].isMulti = false;
                }
                for (var i in data.FilterModels[o].FilterItemModels) {
                    data.FilterModels[o].FilterItemModels[i].isMultiSelected = false;
                }
            }
            return data;
        };
        var clearFilter = function (filter_id) {
            removeFilter(filter_id);//将该选项的已选项从容器中移除
            var filter = hasSubCategory ? getSubCategoryFilterById(filter_id) : getFilterById(filter_id);
            filter.isMultiSelected = false;
            for (var o in filter.FilterItemModels) {
                filter.FilterItemModels[o].isSelected = false;//选择状态重置为false
                filter.FilterItemModels[o].isMultiSelected = false;//选择状态重置为false
            }
        };
        var getSubCategoryById = function (sub_id) {
            for (var o in data_category.SubCategories) {
                if (sub_id == data_category.SubCategories[o].Id) {
                    return data_category.SubCategories[o];
                }
            }
        };

        return {
            getCategoryData: function () {
                return data_category;
            },
            setCategoryData: function (new_data) {
                if (new_data) {
                    data_category = initMulti(new_data);
                }
            },
            getSubCategory: function () {
                return data_subCategory;
            },
            setSubCategory: function (new_data) {
                hasSubCategory = true;//有子类时设置状态为true
                data_subCategory = new_data;
            },
            getBrandsData: function () {
                return data_brands;
            },
            setBrandsData: function (new_data) {
                data_brands = new_data;
            },
            getSelectBrandsData: function () {
                return data_select_brand;
            },
            setSelectBrandData: function (new_data) {
                data_select_brand = new_data;
            },
            getSelectData: function () {
                return data_select;
            },
            setSelectData: function (new_data) {
                data_select = new_data;
            },
            getSubCategoryById: function (sub_id) {
                return getSubCategoryById(sub_id);
            },
            toggleMultiSelect: function (filter_id) {
                var obj = (!hasSubCategory) ? data_category.FilterModels : getSubCategoryById(data_subCategory).FilterModels;
                for (var o in obj) {
                    if (filter_id != obj[o].Id) {
                        obj[o].isMulti = false;
                    } else {
                        obj[o].isMulti = !obj[o].isMulti;
                    }
                }
            },
            /* 选择子类*/
            selectSubCategory: function (sub_id) {
                if (data_subCategory != null) {
                    var old_obj = getSubCategoryById(data_subCategory);
                    for (var o in old_obj.FilterModels) {
                        removeFilter(old_obj.FilterModels[o].Id);
                    }
                }
                for (var o in data_category.SubCategories) {
                    data_category.SubCategories[o].isSelected = (data_category.SubCategories[o].Id == sub_id) ? true : false;
                }
                data_subCategory = sub_id;
            },
            /* 子类选择重置*/
            resetSubCategorySelection: function () {
                for (var o in data_category.SubCategories) {
                    data_category.SubCategories[o].isSelected = false;
                    for (var i in data_category.SubCategories[o].FilterModels) {
                        removeFilter(data_category.SubCategories[o].FilterModels[i].Id);
                    }
                }
                data_subCategory = null;
            },
            /*关闭多选框*/
            closeMultiSelect: function (filter_id) {
                if (!hasSubCategory) {
                    getFilterById(filter_id).isMulti = false;
                } else {
                    getSubCategoryFilterById(filter_id).isMulti = false;
                }
            },
            /*单选品牌*/
            selectBrand: function (brand_id) {
                data_select_brand.isMultiSelected = false;
                data_select_brand.items = [brand_id];
                for (var o in data_brands) {
                    if (data_brands[o].Id == brand_id) {
                        data_brands[o].isSelected = true;
                    } else {
                        data_brands[o].isSelected = false;
                    }
                }
            },
            /*多选勾选品牌*/
            multiSelectBrand: function (brand_id) {
                for (var o in data_brands) {
                    if (data_brands[o].Id == brand_id) {
                        data_brands[o].isMultiSelected = !data_brands[o].isMultiSelected;
                        break;
                    }
                }
            },
            addBrandMultiSelection: function () {
                var result = [];
                for (var o in data_brands) {
                    if (data_brands[o].isMultiSelected) {
                        result.push(data_brands[o].Id);
                    }
                }
                data_select_brand.isMultiSelected = true;
                data_select_brand.items = result;
            },
            /*增加筛选项*/
            addSelection: function (filter_id, item_id) {
                var filter = getFilterById(filter_id);
                if (hasFilterSelected(filter_id)) {
                    for (var o in data_select.filters) {
                        if (filter_id == data_select.filters[o].filterId) {
                            data_select.filters[o].items = [item_id];
                        }
                    }
                } else {
                    data_select.filters.push({
                        filterId: filter_id,
                        type: 0,
                        items: [item_id]
                    });
                }

            },
            /*增加筛选项（多选）*/
            addMultiSelection: function (filter_id) {
                //clearFilter(filter_id);
                var filter = (!hasSubCategory) ? getFilterById(filter_id) : getSubCategoryFilterById(filter_id);
                var items = new Array();
                for (var o in filter.FilterItemModels) {
                    if (filter.FilterItemModels[o].isMultiSelected) {
                        items.push(filter.FilterItemModels[o].Id);
                    }
                }
                if (hasFilterSelected(filter_id)) {
                    for (var o in data_select.filters) {
                        if (filter_id == data_select.filters[o].filterId) {
                            data_select.filters[o].type = 1;
                            data_select.filters[o].items = items;
                        }
                    }
                } else {
                    data_select.filters.push({
                        filterId: filter_id,
                        type: 1,
                        items: items
                    });
                }
                filter.isMultiSelected = true;
            },
            /*一个筛选器的多选操作*/
            multiSelect: function (filter_id, item_id) {

                var filter = (!hasSubCategory) ? getFilterById(filter_id) : getSubCategoryFilterById(filter_id);
                for (var o in filter.FilterItemModels) {
                    if (item_id == filter.FilterItemModels[o].Id) {
                        filter.FilterItemModels[o].isMultiSelected = !filter.FilterItemModels[o].isMultiSelected;
                    }
                }
            },
            /*重置品牌所有选项*/
            resetBrandsSelection: function () {
                data_select_brand = {
                    isMultiSelected: false,
                    items: []
                };
                for (var o in data_brands) {
                    data_brands[o].isMultiSelected = false;
                    data_brands[o].isSelected = false;
                }
                data_brands.isMultiSelected = false;
            },
            /*重置品牌的多选选项*/
            resetBrandsMultiSelection: function () {
                for (var o in data_brands) {
                    data_brands[o].isMultiSelected = false;
                }
                data_brands.isMultiSelected = false;
            },
            /*重置该筛选器的多选*/
            resetMultiSelection: function (filter_id) {
                var filter = getFilterById(filter_id);
                filter.isMultiSelected = false;
                for (var o in filter.FilterItemModels) {
                    filter.FilterItemModels[o].isMultiSelected = false;
                }
            },
            /*重置某一行筛选项*/
            resetFilter: function (filter_id) {
                clearFilter(filter_id);
            },
            removeSelection: function (filter_id) {
                removeFilter(filter_id);
            },
            select: function () {

                if (data_category && data_category.FilterModels) {//如果没有子类
                    if (data_category.FilterModels.length > 0) {
                        for (var o in data_select.filters) {
                            var filter = getFilterById(data_select.filters[o].filterId);
                            var isMultiSelected = (data_select.filters[o].type == 1) ? true : false;//是否是多选
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
                }
                if (data_select_brand != null) {
                    for (var o in data_select_brand.items) {
                        for (var i in data_brands) {
                            if (data_brands[i].Id == data_select_brand.items[o]) {
                                if (data_select_brand.isMultiSelected) {
                                    data_brands[i].isMultiSelected = true;
                                } else {
                                    data_brands[i].isSelected = true;
                                }
                            }
                        }
                    }
                    data_brands.isMultiSelected = data_select_brand.isMultiSelected;//品牌是否多选
                }
            },
            selectWithSubCategory: function () {//有子类时的勾选
                for (var o in data_select.filters) {
                    var filter = getSubCategoryFilterById(data_select.filters[o].filterId);
                    var isMultiSelected = (data_select.filters[o].type == 1) ? true : false;//是否是多选
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
                if (data_select_brand != null) {
                    for (var o in data_select_brand.items) {
                        for (var i in data_brands) {
                            if (data_brands[i].Id == data_select_brand.items[o]) {
                                if (data_select_brand.isMultiSelected) {
                                    data_brands[i].isMultiSelected = true;
                                } else {
                                    data_brands[i].isSelected = true;
                                }
                            }
                        }
                    }
                    data_brands.isMultiSelected = data_select_brand.isMultiSelected;//品牌是否多选
                }
                if (data_subCategory != null) {
                    for (var o in data_category.SubCategories) {
                        if (data_subCategory == data_category.SubCategories[o].Id) {
                            data_category.SubCategories[o].isSelected = true;
                        }
                    }
                }
            },
            /*清除所有已选状态(无子类时)*/
            clearSelect: function () {
                if (data_category && data_category.FilterModels) {
                    for (var i = 0; i < data_category.FilterModels.length; i++) {
                        data_category.FilterModels[i].isMultiSelected = false;
                        for (var j = 0; j < data_category.FilterModels[i].FilterItemModels.length; j++) {
                            data_category.FilterModels[i].FilterItemModels[j].isMultiSelected = false;
                            data_category.FilterModels[i].FilterItemModels[j].isSelected = false;
                        }
                    }
                }
                data_subCategory = null;
                hasSubCategory = false;
            },
            /*清除所有已选状态(有子类时)*/
            clearSelectWithSubCategory: function () {
                if (data_category && data_category.SubCategories) {
                    for (var o in data_category.SubCategories) {
                        data_category.SubCategories[o].isSelected = false;
                        for (var i = 0; i < data_category.SubCategories[o].FilterModels.length; i++) {
                            data_category.SubCategories[o].FilterModels[i].isMultiSelected = false;
                            for (var j = 0; j < data_category.SubCategories[o].FilterModels[i].FilterItemModels.length; j++) {
                                data_category.SubCategories[o].FilterModels[i].FilterItemModels[j].isMultiSelected = false;
                                data_category.SubCategories[o].FilterModels[i].FilterItemModels[j].isSelected = false;
                            }
                        }
                    }
                }

            },
            clearBrandsSelect: function () {
                data_brands.isMultiSelected = false;
                for (var o in data_brands) {
                    data_brands[o].isMultiSelected = false;
                    data_brands[o].isSelected = false;
                }
            },

            requestCategoryById: function (cate_id, callback) {
                $http({
                    method: API.getCategoryById.method,
                    url: API.getCategoryById.url + cate_id
                }).success(function (response, status, headers, config) {
                    if (response && status == 200) {
                        data_category = response;
                        callback(response, 1);
                    } else {
                        callback('', 0);
                    }
                }).error(function (data, status, headers, config) {
                    callback('网络错误', -1);
                });
            },

            search: function (params) {
                var post_data = {
                    "FilterBrand": params.FilterBrand,
                    "Brands": params.Brands,
                    "Status": 4,//4表示已上架商品
                    "CategoryId": "" + params.category,
                    "FilterItems": params.items,
                    "Keyword": "",
                    "MinPrice": 0,
                    "MaxPrice": 0,
                    "OrderNames": params.orderNames,
                    "Asc": params.asc,//升序   true升序  false非升序
                    "PageIndex": 0,//当前页
                    "PageSize": 1000,//每页大小
                    "TotalSize": 10000,//总条数
                    "TotalPage": 10//总页数
                };
                $http({
                    method: API.searchOnline.method,
                    url: API.searchOnline.url,
                    timeout: 20000,
                    data: post_data
                }).success(function (response, status, headers, config) {
                    params.callback(filterData(response));
                }).error(function (data, status, headers, config) {
                    //console.log("请求超时，请检查网络设置");
                });
            }
        };
    })
    /*分类数据服务*/
    .factory('CategorySer', function (API, $http) {
        var data = null;
        return {
            getData: function () {
                for(var o in data){
                    if(data[o].CategoryName=='虚拟物品'){
                        data.splice(o,1);
                    }
                }
                return data;
            },
            requestData: function (callback) {
                $http({
                    method: API.getAllCategory.method,
                    url: API.getAllCategory.url
                }).success(function (response, status, headers, config) {
                    data = response;
                    if (typeof callback == 'function') {
                        callback();
                    }
                }).error(function (data, status, headers, config) {

                });
            },
            getCategoryById: function (cg_id) {
                for (var i = 0, len = data.length; i < len; i++) {
                    if (cg_id == data[i].Id) {
                        return data[i];
                    }
                    if (data[i].SubCategories != null) {
                        for (var o in data[i].SubCategories) {
                            if (cg_id == data[i].SubCategories[o].Id) {
                                return data[i].SubCategories[o];
                            }
                        }
                    }
                }
                return null;
            }
        };
    })
    /* 获取手机验证码服务*/
    .factory('VerifyCodeSer', function (API, $http) {
        return {
            getVerifyCode: function (mobile_num, sk, img_code, callback) {
                $http({
                    method: API.getVerifyCode.method,
                    url: API.getVerifyCode.url,
                    data: [img_code, sk, mobile_num]
                }).success(function (response, status) {
                    if (response && status == 200) {
                        callback(response, 1);
                    }
                });
            }
        };
    })

    /* 购物车服务*/
    .factory('CartSer', function (API, $http, TokenSer) {
        var data = null;
        var deadline = null;
        var initData = function () {
            var total_amount = 0;//商品总数
            var total_cost = 0;//总花费
            for (var o in data) {
                data[o].Specifications = angular.fromJson(data[o].Specifications);//产品规格字符串转换json
                data[o].imageUrl = data[o].Commodity.RollingImages.split('|')[0];//商品图片（取第一张）
                data[o].orgCost =parseInt(data[o].OriginalPrice);//原价
                data[o].cost = parseInt(data[o].DiscountPrice);//折后价
                data[o].needToPay =parseInt(data[o].Unpaid);//待支付
                data[o].finalDiscount = data[o].DiscountValue;
                data[o].isSelected = true;//勾选状态，默认勾选

            }
            setTotalData();
            data.isCheckedAll = true;
        };
        var setTotalData = function () {
            var cost = 0;
            var count = 0;
            for (var o in data) {
                if (data[o].isSelected) {
                    cost += data[o].needToPay;
                    count++;
                }
            }
            data.totalCost = cost;
            data.totalAmount = count;
        };
        return {
            getData: function () {
                return data;
            },
            getDeadline: function () {
                return  deadline;
            },
            clearData: function () {
                data = null;
                deadline = 0;
            },
            getTotalAmount: function () {
                if (data != null) {
                    return  data.totalAmount;
                } else {
                    return 0;
                }
            },
            getOrderById: function (order_id) {
                for (var o in data) {
                    if (order_id == data[o].Id) {
                        return data[o];
                    }
                }
            },
            getConfirmData: function () {
                var result = new Array();
                for (var o in data) {
                    if (data[o].isSelected == true) {
                        result.push(data[o]);
                    }
                }
                return result;
            },
            getOrders: function (id_arr) {
                var result = [];
                for (var o in data) {
                    for (var i in id_arr) {
                        if (id_arr[i] == data[o].Id) {
                            result.push(data[o]);
                        }
                    }
                }
                return result;
            },
            toggleCheckedAll: function () {
                if (data.isCheckedAll == true) {
                    for (var o in data) {
                        data[o].isSelected = true;
                    }
                } else {
                    for (var o in data) {
                        data[o].isSelected = false;
                    }
                }
                setTotalData();
            },

            /*检测是否是全选*/
            testChecked: function () {
                var flag = true;
                for (var o in data) {
                    if (data[o].isSelected == false) {
                        flag = false;
                        break;
                    }
                }
                data.isCheckedAll = flag;
                setTotalData();

            },
            requestCartData: function (callback) {
                var params = { "PageIndex": 0, "PageSize": 100, "TotalSize": 0, "TotalPage": 0};
                $http({
                    method: API.cartList.method,
                    url: API.cartList.url,
                    data: params
                })
                    .success(function (response) {
                        if (response) {
                            data = response;
                            initData();
                            callback(data, 1);
                        } else {
                            callback(response, 0);
                        }
                    })
                    .error(function () {
                        callback(null, -1);
                    });
            },
            requestCartDeadline: function (u_id, callback) {
                $http({
                    method: API.cartDeadline.method,
                    url: API.cartDeadline.url + u_id
                }).success(function (response) {
                    if (response) {
                        deadline = response;
                        callback(response, 1);
                    }
                });
            },

            /*是否可以免费试玩*/
            isCanFreePlay: function (goods_id, callback) {
                $http({
                    method: API.isCanFreePlay.method,
                    url: API.isCanFreePlay.url + goods_id
                }).success(function (response, status, headers, config) {
                    if (status == 200) {
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                })
            },

            /*根据id删除购物车里的订单*/
            cancelOrder: function (order_id, callback) {
                $http({
                    method: API.cancelOrder.method,
                    url: API.cancelOrder.url + order_id
                }).success(function (response) {
                    if (response) {
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                }).error(function (response, status) {
                    callback(response, status);
                });
            }
        };
    })

    /* 收货地址服务*/
    .factory('AddressSer', function (API, $http, TokenSer) {
        var show_add_form = false;//是否显示添加收货地址框
        var show_edit_form = false;//是否显示编辑收货地址框
        var data = null;//地址数据
        return {
            isShowAddForm: function () {
                return show_add_form;
            },
            setAddForm: function (bool_status) {
                show_add_form = bool_status;
            },
            isShowEditForm: function () {
                return show_edit_form;
            },
            setEditForm: function (bool_status) {
                show_edit_form = bool_status;
            },
            getData: function () {
                return data;
            },
            clearData: function () {
                show_add_form = false;
                show_edit_form = false;
                data = null;
            },
            requestAddressData: function (user_id, callback) {
                $http({
                    method: API.addressList.method,
                    url: API.addressList.url + user_id
                }).success(function (response) {
                    if (response) {
                        data = response;
                        callback(response, 1);
                    }
                });
            },
            addAddress: function (params, callback) {
                $http({
                    method: API.addAddress.method,
                    url: API.addAddress.url,
                    data: params
                }).success(function (response) {
                    if (response) {
                        callback(response, 1);
                    }
                });
            },
            updateAddress: function (params, callback) {
                $http({
                    method: API.updateAddress.method,
                    url: API.updateAddress.url,
                    data: params
                }).success(function (response) {
                    if (response) {
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                }).error(function () {
                    callback('网络错误', -1);
                });
            },
            removeAddress: function (addr_id, callback) {
                $http({
                    method: API.removeAddress.method,
                    url: API.removeAddress.url + addr_id
                }).success(function (response) {
                    if (response) {
                        callback(response, 1);
                    }
                });
            },
            setDefaultAddress: function (addr_id, callback) {
                $http({
                    method: API.setDefaultAddress.method,
                    url: API.setDefaultAddress.url + addr_id
                }).success(function (response) {
                    if (response) {
                        callback(response, 1);
                    }
                });
            }
        };
    })


    /*订单服务*/
    .factory('MyOrdersSer', function (API, $http, TokenSer) {
        var orders_all = null;
        var orders_unPay = null;
        var orders_paid = null;
        var orders_unRecieve = null;
        var orders_finish = null;
        var orders_temp = null;
        var orders_after = null;
        var initData = function (data, type) { //type 0 售前单   1 售后单
            for (var o in data) {
                var obj = (type == 0) ? data[o] : data[o].Order;
                obj.Specifications = angular.fromJson(obj.Specifications);//产品规格字符串转换json
                try{
                    obj.imageUrl = obj.Commodity.RollingImages.split('|')[0];//商品图片（取第一张）
                }catch(err){

                }
                obj.orgCost = parseInt(obj.OriginalPrice);//原价
                obj.cost = parseInt(obj.DiscountPrice);//折后价
                obj.needToPay = parseInt(obj.Unpaid);//待支付
                obj.finalDiscount = obj.DiscountValue;
            }
            return data;
        };
        return {
            getAllOrders: function () {
                return orders_all;
            },
            getTempOrder: function () {
                return orders_temp;
            },
            setTempOrder: function (new_data) {
                orders_temp = new_data;
            },
            getUnPayOrders: function () {
                return orders_unPay;
            },
            getPaidOrders: function () {
                return orders_paid;
            },
            getUnReceiveOrders: function () {
                return orders_unRecieve;
            },
            getFinishOrders: function () {
                return orders_finish;
            },
            getAfterOrders: function () {
                return orders_after;
            },
            clearData: function () {//清空数据
                orders_all = null;
                orders_unPay = null;
                orders_paid = null;
                orders_unRecieve = null;
                orders_finish = null;
                orders_temp = null;
                orders_after = null;
            },
            getOrders: function (order_status, id_arr) {
                var obj = null;
                switch (parseInt(order_status)) {
                    case 1:
                        obj = orders_unPay;
                        break;
                    case 2:
                        obj = orders_paid;
                        break;
                    case 3:
                        obj = orders_unRecieve;
                        break;
                    case 4:
                        obj = orders_finish;
                        break;
                    case 5:
                        obj = orders_after;
                        break;
                }
                var result = [];
                for (var o in obj) {
                    for (var i in id_arr) {
                        if (id_arr[i] == obj[o].Id) {
                            result.push(obj[o]);
                        }
                    }
                }
                return result;
            },
            requestData: function (order_type, callback) { //order_type:1-待付款 2-已付款 3-已发货 4-已完成 5-已取消
                if (order_type == 2) {
                    order_type = 23;
                }
                $http({
                    method: API.orderList.method,
                    url: API.orderList.url + order_type,
                    data: { "PageIndex": 0, "PageSize": 100, "TotalSize": 0, "TotalPage": 0}
                }).success(function (response, status, headers, config) {
                    if (status == 200 && response != null) {
                        switch (order_type) {
                            case 1:
                                orders_unPay = initData(response, 0);
                                break;
                            case 2:
                                orders_paid = initData(response, 0);
                                break;
                            case 3:
                                orders_unRecieve = initData(response, 0);
                                break;
                            case 4:
                                orders_finish = initData(response, 0);
                                break;
                            case 23:
                                orders_paid = initData(response, 0);
                                break;//已付款+待收货
                        }
                        callback(response, 1);
                    } else {
                        switch (order_type) {
                            case 1:
                                orders_unPay = new Array();
                                break;
                            case 2:
                                orders_paid = new Array();
                                break;
                            case 3:
                                orders_unRecieve = new Array();
                                break;
                            case 4:
                                orders_finish = new Array();
                                break;
                            case 23:
                                orders_paid = new Array();
                                break;//已付款+待收货
                        }
                        callback(response, 0);
                    }
                }).error(function (response, status, headers, config) {
                    if (status == 401) {
                        callback(response, 401);
                    }
                });
            },
            requestAfterOrders: function (callback) {
                $http({
                    method: API.afterOrders.method,
                    url: API.afterOrders.url
                }).success(function (response, status, headers, config) {
                    if (status == 200) {
                        orders_after = initData(response, 1);
                        callback(orders_after, 1);
                    } else {
                        orders_after = new Array();
                        callback(response, 0);
                    }
                });
            },
            confirmReceive: function (order_id, callback) {
                $http({
                    method: API.confirmReceive.method,
                    url: API.confirmReceive.url + order_id
                }).success(function (response, status, headers, config) {
                    if (response) {
                        callback(response, 1);
                    }
                });
            },
            cancelOrder: function (order_id, order_type, callback) {
                $http({
                    method: API.cancelOrder.method,
                    url: API.cancelOrder.url + order_id
                }).success(function (response) {
                    if (response) {
                        switch (order_type) {
                            case 1:
                                orders_unPay = initData(response, 0);
                                break;
                            case 2:
                                orders_paid = initData(response, 0);
                                break;
                            case 3:
                                orders_unRecieve = initData(response, 0);
                                break;
                            case 4:
                                orders_finish = initData(response, 0);
                                break;
                        }
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                });
            },
            /*售后服务申请*/
            submitAfterServiceApplication: function (params, callback) {
                $http({
                    method: API.ApplyAfterService.method,
                    url: API.ApplyAfterService.url,
                    data: params,
                    timeout: 5000
                }).success(function (response) {
                    if (response) {
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                }).error(function (status) {
                    if (status == 401) {
                        callback('账号过期', 2);
                    } else {
                        callback('网络错误', -1);
                    }
                });
            }

        };
    })

    /* 订单详情服务*/
    .factory('OrderDetailsSer', function (API, $http, TokenSer) {
        var data = null;
        var initData = function (data) {
            data.brandImg = data.Brand ? data.Brand.BrandImage : '';
            data.Specifications = angular.fromJson(data.Specifications);//产品规格字符串转换json
            data.imageUrl = data.Commodity.RollingImages.split('|')[0];//商品图片（取第一张）
            data.orgCost =parseInt(data.OriginalPrice);//原价
            data.cost =parseInt(data.DiscountPrice);//折后价
            data.needToPay = parseInt(data.Unpaid);//待支付
            data.finalDiscount = data.DiscountValue;//最终折扣
            if (data.ConsigneeInfo) {
                try {
                    data.ConsigneeInfo = angular.fromJson(data.ConsigneeInfo);//收货地址
                }catch(error){
                    //console.log(error);
                }
            }
            if (data.LogisticsInfo) {
                data.LogisticsInfo = angular.fromJson(data.LogisticsInfo);
                if (data.LogisticsInfo.TrackingData) {
                    data.LogisticsInfo.TrackingData = angular.fromJson(data.LogisticsInfo.TrackingData);
                }
                //data.LogisticsInfo.TrackingData=angular.fromJson(data.LogisticsInfo.TrackingData);
            }
            return data;
        };
        return {
            getData: function () {
                return data;
            },
            requestData: function (order_id, callback) {
                $http({
                    method: API.orderDetails.method,
                    url: API.orderDetails.url + order_id
                }).success(function (response, status, headers, config) {
                    if (response) {
                        data = initData(response);
                        callback(data, 1);
                    } else {
                        callback(response, 0);
                    }
                }).error(function (data, status, headers, config) {
                    callback(data, -1);
                });
            }
        };
    })

    /* 售后订单详情服务*/
    .factory('ASOrderDetailsSer', function (API, $http, TokenSer) {
        var data = null;
        var initData = function (obj) {
            obj.Images = obj.Images.split("|");
            data = obj.Order
            //console.log(obj);
            data.brandImg = data.Brand ? data.Brand.BrandImage : '';
            data.Specifications = angular.fromJson(data.Specifications);//产品规格字符串转换json
            data.imageUrl = data.Commodity.RollingImages.split('|')[0];//商品图片（取第一张）
            data.orgCost = parseInt(data.OriginalPrice);//原价
            data.cost =parseInt(data.DiscountPrice);//折后价
            data.needToPay = parseInt(data.Unpaid);//待支付
            data.finalDiscount = data.DiscountValue;//最终折扣
            if (data.ConsigneeInfo) {
                data.ConsigneeInfo = angular.fromJson(data.ConsigneeInfo);//收货地址
            }
            return obj;
        };
        return {
            getData: function () {
                return data;
            },
            requestData: function (order_id, callback) {
                $http({
                    method: API.getRepairorderById.method,
                    url: API.getRepairorderById.url + order_id
                }).success(function (response, status, headers, config) {
                    if (response) {

                        data = initData(response);
                        callback(data, 1);
                    } else {
                        callback(response, 0);
                    }
                }).error(function (data, status, headers, config) {
                    callback(data, 0);
                });
            }
        };
    })


    /*支付服务*/
    .factory('PaymentSer', function (API, $http, TokenSer) {
        var data = {
            addressId: null,
            orders: null,
            tempOrder: null //临时订单  存放立即购买时下的订单
        };
        var isBackToPay = false;
        return {
            getData: function () {
                return data;
            },
            setData: function (new_data) {
                data = new_data;
            },
            setOrdersData: function (new_data) {
                data.orders = new_data;
            },
            setTempOrder: function (new_data) {
                data.tempOrder = new_data;
            },
            /*是否返回支付*/
            isBackToPay: function () {
                return isBackToPay;
            },
            /*返回支付*/
            setIsBacktoPay: function (status) {
                isBackToPay = status;
            },
            clearData: function () {
                data = {
                    addressId: null,
                    orders: null
                };
            },
            /*支付订单*/
            purchaseOrders: function (type, params, callback) {
                $http({
                    method: API.purchase.method,
                    url: API.purchase.url + type,
                    data: params
                }).success(function (response) {
                    if (response) {
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                }).error(function (response, status) {
                    if (status == 401) {
                        callback('请求失败！', -1);
                    }
                });
            },
            /* 支付定金*/
            payForEarnest: function (type, order_id, params, callback) {//type 支付类型 0 喵喵余额支付  1.网上支付
                if (type != 0) {
                    $http({
                        method: API.payForEarnest.method,
                        url: API.payForEarnest.url + order_id,
                        data: params
                    }).success(function (response) {
                        if (response) {
                            callback(response, 1);
                        } else {
                            callback(response, 0);
                        }
                    }).error(function () {
                        callback('请求失败！', -1);
                    });
                } else {
                    $http({
                        method: API.payEarnestUseBalance.method,
                        url: API.payEarnestUseBalance.url + order_id
                    }).success(function (response) {
                        if (response) {
                            callback(response, 1);
                        } else {
                            callback(response, 0);
                        }
                    }).error(function () {
                        callback('请求失败！', -1);
                    });
                }
            },
            getStatusOfTrade: function (trade_id, callback) {
                var url = API.getTradeStatus.url + trade_id;
                $http({
                    method: API.getTradeStatus.method,
                    url: url,
                    timeout: 10000
                }).success(function (response) {
                    if (response) {
                        if (response == '2') {
                            callback(response, 1);
                        } else {
                            callback(response, 0);
                        }
                    } else {
                        callback(response, 0);
                    }
                }).error(function () {
                    callback(null, -1);
                });
            },
            getTradeInfoByOrderId: function (order_id, callback) {
                $http({
                    method: API.getTradeInfo.method,
                    url: API.getTradeInfo.url + order_id,
                    timeout: 10000
                }).success(function (response) {
                    if (response) {
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                }).error(function () {
                    callback(null, -1);
                });
            },
            getOrderByTradeId: function (trade_id, callback) {
                $http({
                    method: API.getTradeInfoById.method,
                    url: API.getTradeInfoById.url + trade_id,
                    timeout: 10000
                }).success(function (response) {
                    if (response) {
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                }).error(function () {
                    callback(null, -1);
                });
            }
        };

    })

    /*微信支付*/
    .factory('WXPaySer', function (API, $http, $cookies) {
        return {
            getData: function () {
                return angular.fromJson($cookies.get('wx_pay'));
            },
            setTotalCost: function (new_cost) {
                var data = {
                    totalCost: new_cost
                };
                $cookies.put('wx_pay', angular.toJson(data));
            },
            getQRCodeData: function (trade_id, callback) {
                $http({
                    method: API.getQRCodeData.method,
                    url: API.getQRCodeData.url + trade_id
                }).success(function (response, status, headers, config) {
                    //console.log(response);
                    if (response) {
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                }).error(function (data, status, headers, config) {

                });
            }
        };

    })

    /*支付定金*/
    .factory('PayForEarnest', function (API, $http, TokenSer) {
        var data = null;
        return {
            getData: function () {
                return data;
            },
            setData: function (new_data) {
                data = new_data;
            },
            payForEnergy: function (order_id, callback) {
                $http({
                    method: API.payForEarnest.method,
                    url: API.payForEarnest.url + order_id
                }).success(function (response, status, headers, config) {
                    if (response) {
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                }).error(function (data, status, headers, config) {

                });
            }
        };

    })

    /*区域选择服务*/
    .factory('AreaSer', function (API, $http) {
        var data = null;
        return {
            getData: function () {
                return data;
            },
            requestData: function (callback) {
                $http({
                    method: API.getAreas.method,
                    url: API.getAreas.url
                }).success(function (response, status, headers, config) {
                    if (response) {
                        data = response;
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                }).error(function (data, status, headers, config) {
                    callback("网络错误", -1);
                });
            }
        };

    })

    /*消息服务*/
    .factory('MessageSer', function (API, $http, TokenSer) {
        var msg = [null, null];//msg[0]:未读消息，msg[1]:已读消息，
        return {
            getData: function (index) {
                return msg[index];
            },
            getMsgById: function (msg_type, msg_id) {
                for (var o in msg[msg_type]) {
                    if (msg_id == msg[msg_type][o].Id) {
                        return msg[msg_type][o];
                    }
                }
            },
            clearData: function () {
                msg = [null, null];
            },
            /*获取消息列表*/
            requestMsg: function (msg_type, params, callback) {
                var url = (msg_type == 0) ? API.messageOfUnRead.url : API.messageOfRead.url;//0未读 1已读
                var method = (msg_type == 0) ? API.messageOfUnRead.method : API.messageOfRead.method;
                $http({
                    method: method,
                    url: url,
                    data: params
                }).success(function (response, status, headers, config) {
                    if (response) {
                        msg[msg_type] = response;
                        callback(response, 1);
                    } else {
                        callback(response, 0);
                    }
                }).error(function (data, status, headers, config) {
                    callback("网络错误", -1);
                });
            },
            /*根据消息ID请求消息内容*/
            requestMsgContentById: function (msg_id, callback) {
                var url = API.messageContent.url + msg_id;
                $http({
                    method: API.messageContent.method,
                    url: url
                }).success(function (response, status, headers, config) {
                    if (response) {
                        callback(response, 1);
                    } else {
                        callback("获取消息失败", 0);
                    }
                }).error(function (data, status, headers, config) {
                    callback("网络错误", -1);
                });
            },
            /* 删除指定消息*/
            removeMsg: function (msg_id, callback) {
                $http({
                    method: API.removeMsg.method,
                    url: API.removeMsg.url + msg_id
                }).success(function (response, status, headers, config) {
                    if (response) {
                        callback(response, 1);
                    } else {
                        callback("获取消息失败", 0);
                    }
                }).error(function (data, status, headers, config) {
                    callback("网络错误", -1);
                });
            }

        };

    })

    /*折扣卡服务*/
    .factory('DiscountCardSer', function (API, $http, TokenSer) {
        var data = null;

        function initData(data) {
            for (var o in data) {
                var spe = data[o].Order.Specifications;
                data[o].Order.goodsProperty = angular.fromJson(spe);
                data[o].imgUrl = data[o].Order.Commodity.RollingImages.split('|')[0];
                data[o].discountPrice = Math.ceil(data[o].Order.UnitPrice-data[o].BaseDiscountMoney);
                data[o].BaseDiscount = Math.ceil(Math.round(data[o].BaseDiscount * 10000) / 100) / 10;
            }
            return data;
        }

        return {
            getData: function () {
                return data;
            },
            /*请求折扣卡数据*/
            requestData: function (callback) {
                $http({
                    method: API.discountCard.method,
                    url: API.discountCard.url
                }).success(function (response, status, headers, config) {
                    if (response) {
                        data = initData(response);
                        callback('', 1);
                    } else {
                        callback('', 0);
                    }
                }).error(function (data, status, headers, config) {
                    callback("网络错误", -1);
                });
            }

        };
    })

    .factory('LogisticsSer', function (API, $http, TokenSer) {
        var data = null;

        function initData(o_d) {
            o_d.TrackingData = angular.fromJson(o_d.TrackingData);
            return o_d;
        }

        return {
            getData: function () {
                return data;
            },
            /* 获取物流信息*/
            requestData: function (order_id, type, callback) { //type状态  0售前  1售后
                $http({
                    method: API.getLogisticsInfo.method,
                    url: API.getLogisticsInfo.url + order_id + '/' + type
                }).success(function (response, status, headers, config) {
                    if (response) {
                        //console.log(response);
                        data = initData(response[0][0]);
                        //  console.log(data);
                        callback(data, 1);
                    } else {
                        callback('', 0);
                    }
                }).error(function (data, status, headers, config) {
                    callback("网络错误", -1);
                });
            },
            getKDiList: function (callback) {
                $http.get(API.logisticsList.url)
                    .success(function (response, status) {
                        var result = [
                            {Code: 'auto', Name: '请选择快递', index: ''}
                        ];
                        result.push({Code: 'ems', Name: 'EMS'});
                        result.push({Code: 'shunfeng', Name: '顺丰速运'});
                        result.push({Code: 'yuantong', Name: '圆通速递'});
                        result.push({Code: 'yunda', Name: '韵达快递'});
                        result.push({Code: 'zhaijisong', Name: '宅急送'});
                        result.push({Code: 'zhongtong', Name: '中通快递'});
                        for (var o in response) {
                            response[o].index = response[o].Code.substr(0, 1).toUpperCase();
                            result.push(response[o]);
                        }
                        callback(result, 1);
                    });
            }
        }
    })

    .factory('WalletSer', function (API, $http, TokenSer) {
        var data = null;
        return {
            getData: function () {
                return data;
            },
            clearData: function () {
                data = null;
            },
            requestData: function (callback) {
                $http({
                    method: API.wallet.method,
                    url: API.wallet.url
                }).success(function (response, status, headers, config) {
                    if (response) {
                        data = response;
                        callback(response, 1);
                    } else {
                        callback('', 0);
                    }
                }).error(function (data, status, headers, config) {
                    callback("网络错误", -1);
                });
            }
        }
    })


    .factory('CouponSer', function (API, $http, TokenSer) {
        var data = null;

        return {
            getData: function () {
                return data;
            },
            clearData: function () {
                data = null;
            },
            getTotalBalance:function(){
                var total=0;
                var obj=data;
                for(var o in obj){
                    total+=obj[o].Balance;
                }
                return total;
            },
            requestData: function (params,callback) {
                $http({
                    method: API.coupon.method,
                    url: API.coupon.url,
                    data:params
                }).success(function (response, status, headers, config) {
                    if (response) {
                        data = response;
                        callback(response, 1);
                    } else {
                        callback('', 0);
                    }
                }).error(function (data, status, headers, config) {
                    callback("网络错误", -1);
                });
            }
        }
    })

    .factory('UploadSer', function (API, $http, TokenSer, FileUploader) {
        return {
            initUploader: function (max_count, max_size,errorCallback) {
                var uploader = new FileUploader({
                    url: API.upload.url,
                    headers:{
                        Authorization : 'Basic ' + TokenSer.getToken()
                    }
                });
                var error=function(msg){
                      if(typeof errorCallback=='function'){
                          errorCallback(msg);
                      }
                };
                uploader.filters.push({
                    name: 'customFilter',
                    fn: function (item /*{File|FileLikeObject}*/, options) {
                        return this.queue.length < max_count;
                    }
                });
                // CALLBACKS
                uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                    console.info('onWhenAddingFileFailed', item, filter, options);
                };
                uploader.onAfterAddingFile = function (fileItem) {
                    console.log(fileItem);
                    var img_type=fileItem.file.type.split("/");
                    if(img_type[0]!='image'){
                        error('您上传的不是图片文件！');
                    }else{
                        if(!(img_type[1]=='bmp'||img_type[1]=='gif'||img_type[1]=='jpg'||img_type[1]=='jpeg'||img_type[1]=='png')){
                            error('您上传图片格式不符合要求！');
                        }else{
                            if(fileItem.file.size>max_size*1024){
                                error('您上传的图片过大！');
                            }else{
                                fileItem.progress=0;
                                fileItem.upload();
                            }
                        }
                    }
                };
                uploader.onAfterAddingAll = function (addedFileItems) {
                    //console.info('onAfterAddingAll', addedFileItems);
                };
                uploader.onBeforeUploadItem = function (item) {
                    //console.info('onBeforeUploadItem', item);
                };
                uploader.onProgressItem = function (fileItem, progress) {
                    fileItem.progress=progress;
                };
                uploader.onProgressAll = function (progress) {

                };
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    //console.info('onSuccessItem', fileItem, response, status, headers);
                };
                uploader.onErrorItem = function (fileItem, response, status, headers) {
                   // console.info('onErrorItem', fileItem, response, status, headers);
                };
                uploader.onCancelItem = function (fileItem, response, status, headers) {
                    //console.info('onCancelItem', fileItem, response, status, headers);
                };
                uploader.onCompleteItem = function (fileItem, response, status, headers) {
                    //console.info('onCompleteItem', fileItem, response, status, headers);
                    fileItem.imgUrl = response;
                };
                uploader.onCompleteAll = function () {
                    //console.info('onCompleteAll');
                };
                return uploader;
            }
        }
    })

    .factory('MarketSer', function (API, $http) {
        var cur_url = '';
        var data = {
            marketOnline: null,
            pageData: null
        };
        return {
            getUrl: function () {
                return  cur_url;
            },
            setUrl: function (val) {
                cur_url = val;
            },
            getData: function () {
                return data;
            },
            requestMarketList: function (callback) {
                $http({
                    method: API.marketOnline.method,
                    url: API.marketOnline.url
                }).success(function (response) {
                    if (response) {
                        data.marketOnline = response;
                        callback(response, 1);
                    }
                }).error(function (data, status, headers, config) {

                });
            },
            requestMarketPage: function (param, callback) {
                $http({
                    method: API.marketView.method,
                    url: API.marketView.url,
                    data: param
                }).success(function (response) {
                    if (response) {
                        data.pageData = response;
                        callback(response, 1);
                    }
                }).error(function (data, status, headers, config) {

                });
            }
        };
    })

    /*试玩次数/签到*/
    .factory('FreePlaySvc', function (API, $http, TokenSer) {
        var data = {
            chance: 0,//免费试玩机会
            isCanSignUp: false//是否可签到
        };
        return {
            getData: function () {
                return data;
            },
            /*是否可签到*/
            isCanSignUp: function (callback) {
                $http({
                    method: API.isCanSignUp.method,
                    url: API.isCanSignUp.url
                }).success(function (response, status, headers, config) {
                    if (status == 200) {
                        data.isCanSignUp = response;
                        callback(data.isCanSignUp, 1);
                    } else {
                        callback(false, 0);
                    }
                })
            },
            /*签到*/
            signUp: function (callback) {
                $http({
                    method: API.signUp.method,
                    url: API.signUp.url
                }).success(function (response, status, headers, config) {
                    if (response && status == 200) {
                        data.isCanSignUp = false;
                        data.chance = angular.fromJson(response).data;
                        callback(angular.fromJson(response));
                    }
                })
            },
            /*获取免费试玩次数*/
            getFreeChance: function (callback) {
                $http({
                    method: API.getFreeChance.method,
                    url: API.getFreeChance.url
                }).success(function (response, status, headers, config) {
                    //console.log("####");
                    //console.log(response);
                    data.chance = parseInt(response);
                })
            },
            /*获取免费试玩次数*/
            getSignUpInfo: function (callback) {
                $http({
                    method: API.getSignUpInfo.method,
                    url: API.getSignUpInfo.url
                }).success(function (response, status, headers, config) {
                    //console.log("####info");
                    //console.log(response);
                })
            }
        };
    })
    /*提交订单临时数据服务*/
    .factory('SOTDSvc', function ($cookies) {
        return {
            get: function () {
                return angular.fromJson($cookies.get('s_d'));
            },
            set: function (new_data) {
                $cookies.put('s_d', angular.toJson(new_data));
            },
            reset: function () {
                $cookies.remove('s_d');
            }
        };
    })


    /*余额（喵喵钱包&红包）*/
    .factory('BalanceSvc', function (API, $http) {
        var balanceInfo=null;
        return {
            getBalanceInfo: function () {
                return balanceInfo;
            },
            requestBalanceInfo:function(callback){
                $http({
                    method: API.getBalanceInfo.method,
                    url: API.getBalanceInfo.url
                }).success(function (response, status) {
                    if(status==200&&response){
                        balanceInfo=response;
                        callback(balanceInfo,1);
                    }else{
                        callback(response,0);
                    }
                })
            },
            exchangeWithCoupon:function(order_id,callback){
                $http({
                    method: API.exchangeWithCoupon.method,
                    url: API.exchangeWithCoupon.url+order_id
                }).success(function (response, status) {
                    if(status==200&&response){

                        callback(response,1);
                    }else{
                        callback(response,0);
                    }
                }).error(function(response, status){
                    callback(response,-1);
                });
            },
            exchangeWithCouponAndWallet:function(params,callback){
                $http({
                    method: API.exchangeWithCouponAndWallet.method,
                    url: API.exchangeWithCouponAndWallet.url,
                    data:params
                }).success(function (response, status) {
                    if(status==200&&response){
                        callback(response,1);
                    }else{
                        callback(response,0);
                    }
                }).error(function(response, status){
                    callback(response,-1);
                });
            }
        };
    })

/**
 * 晒单列表
 */
    .factory('ShowOffOrdersSer',function(API,$http){
        var initData=function(arr){
            console.log(arr);
             for(var o in  arr){
                 arr[o].Avatar=angular.fromJson(arr[o].Avatar);
                 arr[o].images=arr[o].Image.split('|');
             }
            return arr;
        };
        return {
            requestData:function(params,callback){
                $http({
                    method: API.SOOList.method,
                    url: API.SOOList.url,
                    data:params
                }).success(function (response, status) {
                    if(status==200&&response){
                        callback(initData(response),1);
                    }else{
                        callback(response,0);
                    }
                }).error(function(response, status){
                    callback(response,-1);
                });
            }
        };
    })
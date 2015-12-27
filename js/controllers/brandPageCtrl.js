angular.module('LuckyMall.controllers')
    .controller('BrandPageCtrl', function ($scope, $stateParams,BrandSer,FilterSer, CategorySer, $timeout, $state) {
       var brand_id=$stateParams.brand_id;
       var page_size=40;
        $scope.search_condition=0;//搜索条件 0-新品 1价格
        $scope.price_order=false;//价格排序方式  false:从小到大   true:从大到小
        loadBrandData()
        search();
        $scope.pageIndex = 1;//当前页
        /*前一页*/
        $scope.prevPage = function () {
            if ($scope.pageIndex > 1) {
                $scope.pageIndex--;
                $scope.data_list = BrandSer.getData().slice(($scope.pageIndex - 1) * page_size, $scope.pageIndex * page_size);//从返回的数据数组中取当前页的数据
            }
        };
        /*下一页*/
        $scope.nextPage = function () {
            if ($scope.pageIndex >= $scope.totalPage) return;
            $scope.pageIndex++;
            $scope.data_list = BrandSer.getData().slice(($scope.pageIndex - 1) * page_size, $scope.pageIndex * page_size);
        };
        /*翻页*/
        $scope.changePage = function (index) {
            $scope.pageIndex = index;
            $scope.data_list = BrandSer.getData().slice(($scope.pageIndex - 1) * page_size, $scope.pageIndex * page_size);//从返回的数据数组中取当前页的数据
        };

        /*新品筛选*/
        $scope.searchNew=function(){
            if($scope.search_condition!=0){
                $scope.search_condition = 0;
                search();
            }
        };
        /*价格排序*/
        $scope.searchWidthPrice = function (price_sort) {
            if (price_sort==0||price_sort==1) {
                if(price_sort==$scope.price_order){
                    return;
                }else{
                    $scope.price_order = price_sort;
                }
            } else {
                if($scope.search_condition==1) {
                    $scope.price_order = !$scope.price_order;
                }
            }
            if($scope.price_order){
                BrandSer.sortByPriceDown();
            }else{
                BrandSer.sortByPriceUp();
            }
            var data = BrandSer.getData();
            $scope.pageIndex = 1;//当前页
            $timeout(function(){
                $scope.data_list = data.slice(($scope.pageIndex - 1) * page_size, $scope.pageIndex * page_size);//当前显示数据
            });
            $scope.search_condition=1;
        };
        function loadBrandData(){
            BrandSer.getBrandById(brand_id,function(response){
                $scope.data_brand=response;
                console.log($scope.data_brand);
            });
        }
        function search() {
            $scope.loaded=false;
            var OrderNames=($scope.search_condition==0)?['CreateTime']:[];
            var asc=($scope.search_condition==0)?false:false;
            var params={
                "FilterBrand":true,
                "Brands":[brand_id],
                "Status":3,//3表示已上架商品
                "CategoryId":0,
                "FilterItems":[],
                "Keyword": "",
                "MinPrice":0,
                "MaxPrice":0,
                "OrderNames": OrderNames,
                "Asc": asc,//升序   true升序  false非升序
                "PageIndex": 0,//当前页
                "PageSize": 1000,//每页大小
                "TotalSize":10000,//总条数
                "TotalPage": 10//总页数
            };
            BrandSer.requestData(params,function(response,status){
                if(status==1){
                    $scope.data_brand_pro=BrandSer.getData();
                    var data =BrandSer.getData();
                    $scope.pageIndex = 1;//当前页
                    $scope.data_list = data.slice(($scope.pageIndex - 1) * page_size, $scope.pageIndex * page_size);//当前显示数据
                    $scope.totalAmount = data.length;//商品总数
                    var total_page = Math.ceil($scope.totalAmount /page_size);
                    $scope.totalPage = (total_page <= 0) ? 1 : total_page;
                    createPage(data);//创建页码数组
                    $scope.loaded=true;
                }
            })
        }

        function createPage(_data) {
            $scope.page = [];//用于创建页码
            var len = _data.length > 0 ? Math.ceil(_data.length / page_size) : 1;
            for (var i = 0; i < len; i++) {
                $scope.page.push(i);
            }
        }

    });

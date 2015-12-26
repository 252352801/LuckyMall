angular.module('LuckyMall.controllers')
 .controller('MarketCtrl',function($scope,MarketSer,$stateParams,$rootScope){
        var id=$stateParams.id;
        $scope.loaded=false;
        $scope.curMarket=id;
        if(MarketSer.getData().marketOnline==null){
            MarketSer.requestMarketList(function(response,status){
                if(status==1){
                    $rootScope.data_market=MarketSer.getData().marketOnline;//;
                    loadPageData();
                }
            });
        }else{
            $rootScope.data_market=MarketSer.getData().marketOnline;//;
            loadPageData();
        }
        function loadPageData(){
            for(var o in $rootScope.data_market){
                if(id==$rootScope.data_market[o].Id){
                    $scope.url=$rootScope.data_market[o].DesktopPage;
                }
            }
            MarketSer.requestMarketPage([$scope.url],function(response,status){
                if(status==1){
                    $scope.marketPage=MarketSer.getData().pageData;
                    $scope.loaded=true;
                }
            });
        }
});

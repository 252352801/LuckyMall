angular.module('LuckyMall.controllers')
 .controller('MarketCtrl',function($scope,MarketSer){
        MarketSer.requestMarketList(function(response,status){
            if(status==1){
                var page_url=MarketSer.getData().marketOnline[0].DesktopPage;
                MarketSer.requestMarketPage([page_url],function(response,status){
                    if(status==1){
                        $scope.marketPage=MarketSer.getData().pageData;
                    }
                });
            }
        });
});

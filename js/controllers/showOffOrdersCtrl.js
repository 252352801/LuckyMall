angular.module('LuckyMall.controllers')
    .controller('ShowOffOrdersCtrl',
        ['$rootScope','$scope', '$state', '$stateParams',  '$timeout',"ShowOffOrdersSer",
        function ($rootScope,$scope, $state,$stateParams,$timeout,ShowOffOrdersSer) {

            function ShowOffOrders(){
                var $this=this;
                this.data=[];
                this.currentPage=[];
                this.loading=false;
                this.page={
                    index:0,
                    pageSize:16,
                    count:0,
                    pageCount:0,
                    items:[]
                };
                var getCurrentPage=function(pg_index){
                    return $this.data.slice((pg_index)*$this.page.pageSize,(pg_index+1)*$this.page.pageSize)
                };
                this.loadData=function(){
                    var params={
                        status:1, pSize:10000, pIndex: 0
                    };
                    $this.loading=true;
                    ShowOffOrdersSer.requestData(params,function(response,status){
                        if(status==1&&response){
                            for(var o in response){
                                response[o].CreateTime=response[o].CreateTime.split(' ')[0];
                            }
                            $this.data=response;
                            $this.page.count=$this.data.length;
                            $this.page.pageCount=Math.ceil($this.page.count/$this.page.pageSize);
                            for(var i= 0;i<$this.page.pageCount;i++){
                                $this.page.items.push(i);
                            }
                            $this.currentPage= getCurrentPage(0);
                            console.log(response);
                        }
                        $this.loading=false;
                    })
                };
                this.prevPage=function(){
                    if($this.page.index>0) {
                        $this.page.index--;
                        $this.currentPage =getCurrentPage($this.page.index);
                    }
                };
                this.nextPage=function(){
                    if($this.page.index<$this.page.pageCount-1){
                        $this.page.index++;
                        $this.currentPage =getCurrentPage($this.page.index);
                    }
                };
                this.changePage=function(new_index){
                    $this.page.index=new_index;
                    $this.currentPage =getCurrentPage($this.page.index);
                };
                this.like=function(soo){//点赞
                    if(!soo.liked) {
                        ShowOffOrdersSer.like(soo.Id, function (response, status) {
                            if (status == 1) {
                                if (response.code == 0) {
                                    //点赞成功
                                    soo.liked = true;
                                    soo.LikeCount = response.count;
                                } else if (response.code == -1) {
                                    soo.liked = true;
                                    soo.LikeCount++;
                                } else if (response.code == 1) {
                                    //已经点赞
                                    soo.liked = true;
                                    soo.LikeCount++;
                                } else if (response.code == 2) {
                                    //点赞失败
                                    soo.liked = true;
                                    soo.LikeCount++;
                                }
                            }
                        });
                    }
                };
            }
            $scope.Soo=new ShowOffOrders();
            $scope.Soo.loadData();


    }])
    .controller('SOODetailsCtrl',
    ['$rootScope','$scope', '$state', '$stateParams','$timeout',"ShowOffOrdersSer",
        function ($rootScope,$scope, $state,$stateParams,$timeout,ShowOffOrdersSer) {

            function SOODetails(id){
                var $this=this;
                this.id=id;
                this.loading=false;
                this.orderInfo={};
                this.SOOInfo={};
                this.itemData={};
                this.pageError=false;
                this.imgIndex=0;
                this.failureReason='';//晒单失败原因
                this.loadData=function(){
                    $this.loading=true;
                    ShowOffOrdersSer.requestSOODetails($this.id,function(response,status){
                        if(status==1){
                                $this.SOOInfo=response;
                                console.log($this.SOOInfo);
                                ShowOffOrdersSer.requestOrderInfoBySOOId($this.SOOInfo.Id,function(resp,stat){
                                    if(stat==1){
                                        $this.orderInfo=resp;
                                        $this.orderInfo.spec=angular.fromJson($this.orderInfo.Specifications);
                                    }
                                });
                               ShowOffOrdersSer.requestItemData($this.SOOInfo.CommodityId,function(resp,stat){
                                   if(stat==1){
                                       console.log(resp);
                                       resp.image=resp.RollingImages.split('|')[0];
                                       $this.itemData=resp;
                                   }
                               });
                                if($this.SOOInfo.ShaiDanStatus==2){
                                    ShowOffOrdersSer.failureReason($this.id,function(response,status){
                                        if(status==1){
                                            $this.failureReason=response;
                                        }
                                    });
                                }
                        }else{
                            $this.pageError=true;
                        }
                        $this.loading=false;
                    });
                };
                this.showImg=function(img_index){
                    $this.imgIndex=img_index;
                };
                this.like=function(soo){//点赞
                    if(!soo.liked) {

                        ShowOffOrdersSer.like(soo.Id, function (response, status) {
                            if (status == 1) {
                                if (response.code == 0) {
                                    //点赞成功
                                    soo.liked = true;
                                    soo.LikeCount = response.count;
                                } else if (response.code == -1) {
                                    //点赞异常(通常是未登陆)
                                    soo.liked = true;
                                    soo.LikeCount++;
                                } else if (response.code == 1) {
                                    //已经点赞
                                    soo.liked = true;
                                   soo.LikeCount++;
                                } else if (response.code == 2) {
                                    //点赞失败
                                    soo.liked = true;
                                    soo.LikeCount++;
                                }
                            }
                        });
                    }
                };
            }

            var id=$stateParams.id;
            $scope.soo_dt=new SOODetails(id);
            $scope.soo_dt.loadData();


        }]);


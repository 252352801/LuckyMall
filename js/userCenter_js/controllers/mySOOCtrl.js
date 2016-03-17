angular.module('LuckyMall.controllers')
    .controller('MySOOCtrl',
    ['$scope', '$state', '$stateParams','MySOOSer',
        function ($scope, $state, $stateParams,MySOOSer) {
            $scope.$emit('changeMenu', 17);


            function MySOO(status) {
                var $this=this;
                this.status=status;
                this.page={
                    index:0,
                    pageSize:5,
                    count:0,
                    pageCount:0,
                    items:[]
                };
                this.pageError=false;
                this.data=[];
                this.currentPage=[];
                this.loading=false;
                this.loadData=function(){
                    var params={
                        "status": $this.status,
                        "pSize": 100,
                        "pIndex": 0
                    };
                    $this.loading=true;
                    MySOOSer.requestData(params,function(response,status){
                        if(status==1&&response){
                            $this.data=response;
                            $this.currentPage=getCurrentPage(0);
                            $this.page.count=$this.data.length;
                            $this.page.pageCount=Math.ceil($this.page.count/$this.page.pageSize);
                            for(var i= 0,len=$this.page.pageCount;i<len;i++){//创建页码
                                $this.page.items.push(i);
                            }
                        }else{
                            $this.pageError=true;
                        }
                        $this.loading=false;
                    });
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
                this.showBigImg=function(index,soo){
                    if(soo.bigImgIndex==index||index==-1){
                        soo.bigImgIndex=-1;
                    }else{
                        soo.bigImgIndex=index;
                        soo.bigImgUrl=soo.images[index];
                    }
                };
                var getCurrentPage=function(pg_index){
                     return $this.data.slice((pg_index)*$this.page.pageSize,(pg_index+1)*$this.page.pageSize);
                };

            }
            var status=1;
            if($stateParams.status=='wait'){
                status=0;
            }else if($stateParams.status=='passed'){
                status=1;
            }else if($stateParams.status=='unPassed'){
                status=2;
            }else if($stateParams.status=='endUp'){
                status=3;
            }else if($stateParams.status=='waiting'){
                status=0;
            }
            $scope.mySOO=new MySOO(status);
            $scope.mySOO.loadData();






















        }]);

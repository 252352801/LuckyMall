angular.module('LuckyMall.controllers')
    .controller('ResubmitSooCtrl',
    ['$scope', '$state', '$stateParams','UploadSer','OrderDetailsSer','SubmitSOOSer','ShowOffOrdersSer',
        function ($scope, $state, $stateParams,UploadSer,OrderDetailsSer,SubmitSOOSer,ShowOffOrdersSer) {
            var id=$stateParams.id;
            $scope.loading=true;
            $scope.params_submit={
                "oid":null,
                "images": [],
                "content": ''
            };
            $scope.submitBtn={
                orgVal:'提交',
                tempVal:'正在提交...',
                curVal:'提交',
                disabled:false
            };
            $scope.orderInfo={};
            ShowOffOrdersSer.requestSOODetails(id,function(response,status){
                if(status==1){
                    $scope.params_submit.oid=response.Id;
                    $scope.data_order=response;
                    $scope.params_submit.images=$scope.data_order.Image.split("|");
                    $scope.data_order.imageUrl=$scope.params_submit.images[0];

                    $scope.params_submit.content=response.Content;
                    OrderDetailsSer.requestData($scope.data_order.OrderId, function (response, status) {
                        if (status == 1) {
                            $scope.orderInfo = OrderDetailsSer.getData();
                            $scope.orderInfo.spec=angular.fromJson($scope.orderInfo.Specifications);
                            $scope.loading=false;
                        }
                    });

                }else{
                    $scope.pageError=true;
                }
            });

            $scope.uploader = UploadSer.initUploader(5, 20480,function(msg){ // 最大数量10  最大总大小2048kb(20MB)
                swal(msg,'','error');
                $scope.uploader.queue.pop();
            });

            $scope.removeOldImages=function(index){
                $scope.params_submit.images.splice(index,1);
            };

            $scope.submitSOO=function(){

                if($scope.params_submit.oid!=null&&!$scope.submitBtn.disabled){
                    if($scope.params_submit.content==''){
                        swal('请输入晒单内容！','与小伙伴们分享你的好运吧','error');
                    }else{
                        if($scope.params_submit.content.length<15){
                            swal('字数不够！','15个字都没有T.T','error');
                            return;
                        }
                        if(($scope.uploader.queue.length+$scope.params_submit.images.length)==0){
                            swal('请上传图片！','','error');
                        }else{
                            var img_str=$scope.params_submit.images.concat();
                            for (var o in $scope.uploader.queue) {
                                if ($scope.uploader.queue[o].imgUrl) {
                                    img_str.push($scope.uploader.queue[o].imgUrl[0]);

                                }
                            }
                            if(img_str.length<3){
                                swal('至少上传3张图片！','','error');
                                return;
                            }else if(img_str.length>5){
                                swal('最多上传5张图片！','','error');
                                return;
                            }
                            var params={
                                "oid":$scope.params_submit.oid,
                                "images": img_str.join('|'),
                                "content":$scope.params_submit.content
                            };
                            $myLog(params);return;
                            $scope.submitBtn.curVal=$scope.submitBtn.tempVal;
                            $scope.submitBtn.disabled=true;
                            SubmitSOOSer.submit(params,function(response,status){
                                $scope.submitBtn.disabled=false;
                                $scope.submitBtn.curVal=$scope.submitBtn.orgVal;
                                if(status==1){
                                    swal('成功提交，请耐心等待审核！','','success');
                                    $state.go('UCIndex.myOrders',{"status":'finish'});
                                }else{
                                    swal('晒单失败，请重试！','','error');
                                }
                            });
                        }
                    }
                }
            };









        }]);

angular.module('LuckyMall.controllers')
    .controller('SubmitSOOCtrl',
    ['$scope', '$state', '$stateParams','UploadSer','OrderDetailsSer','SubmitSOOSer',
        function ($scope, $state, $stateParams,UploadSer,OrderDetailsSer,SubmitSOOSer) {
            $scope.$emit('changeMenu', 4);
            var id=$stateParams.id;
            $scope.canShowOff=false;
            $scope.params_submit={
                "oid":null,
                "images": [],
                "content": ''
            };
            $scope.data_order={};
            $scope.loading=true;
            $scope.pageError=false;
            $scope.submitBtn={
                orgVal:'提交',
                tempVal:'正在提交...',
                curVal:'提交',
                disabled:false
            };
            $scope.uploader = UploadSer.initUploader(5, 20480,function(msg){ // 最大数量10  最大总大小2048kb(20MB)
                swal(msg,'','error');
                $scope.uploader.queue.pop();
            });
            OrderDetailsSer.requestData(id,function(response,status){
                if(status==1){
                    $scope.params_submit.oid=response.Id;
                    $scope.data_order=response;
                    SubmitSOOSer.canShowOff($scope.params_submit.oid,function(resp,sts){
                           if(sts==1){
                                if(resp){
                                    $scope.canShowOff=true;
                                }else{
                                    $scope.canShowOff=false;
                                }
                           }else{
                               $scope.pageError=true;
                           }
                        $scope.loading=false;
                    });
                }else{
                    $scope.pageError=true;
                }
            });





            $scope.submitSOO=function(){

                 if($scope.params_submit.oid!=null&&!$scope.submitBtn.disabled){
                     if($scope.params_submit.content==''){
                         swal('请输入晒单内容！','与小伙伴们分享你的好运吧','error');
                     }else{
                         if($scope.params_submit.content.length<15){
                             swal('字数不够！','15个字都没有T.T','error');
                             return;
                         }
                         if($scope.uploader.queue.length==0){
                             swal('请上传图片！','','error');
                         }else{
                             var params={
                                 "oid":$scope.params_submit.oid,
                                 "images": '',
                                 "content":$scope.params_submit.content
                             };
                             var img_str=[];
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

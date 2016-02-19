angular.module('LuckyMall')

    /*地址输入验证*/
    .directive('btnEditAvatar', function ($timeout,API,UserSer,$rootScope) {
        return {
            link: function (scope,element, attrs) {
                var src=element.attr('img-src');
                element.bind('click',function(){
                    /*第1个参数是加载编辑器div容器，第2个参数是编辑器类型，第3个参数是div容器宽，第4个参数是div容器高*/
                    xiuxiu.embedSWF("MTXXContent",5,"700px","490px");
                    //修改为您自己的图片上传接口
                    /*xiuxiu.setUploadURL("http://web.upload.meitu.com/image_upload.php");*/
                    xiuxiu.setUploadType(3);
                  //  xiuxiu.setUploadDataFieldName("upload_file");
                    xiuxiu.onInit = function ()
                    {
                        UserSer.getAvatarBase64Img(function(response,status){
                            if(status==1){
                                xiuxiu.loadPhoto(response,true);
                            }
                        });
                    }

                    xiuxiu.onSaveBase64Image= function(data, fileName, fileType, id) {
                        UserSer.saveAvatar({data:data},function(response,status){
                            if(status==1){
                                $rootScope.avatar=response;
                                scope.$emit('closeMTXX');
                            }
                        });
                    }
                    xiuxiu.onDebug = function (data)
                    {
                        alert("头像编辑出错啦！" + data);
                    }
                });
            }
        };
    })
angular.module('LuckyMall')

    /*地址输入验证*/
    .directive('btnEditImg', function ($timeout,API) {
        return {
            link: function (scope,element, attrs) {
                var src=element.attr('img-src');
                element.bind('click',function(){
                    /*第1个参数是加载编辑器div容器，第2个参数是编辑器类型，第3个参数是div容器宽，第4个参数是div容器高*/
                    xiuxiu.embedSWF("MTXXContent",5,"700px","490px");
                    //修改为您自己的图片上传接口
                    xiuxiu.setUploadURL("http://web.upload.meitu.com/image_upload.php");
                    xiuxiu.setUploadType(2);
                    xiuxiu.setUploadDataFieldName("upload_file");
                    xiuxiu.onInit = function ()
                    {
                        xiuxiu.loadPhoto('http://127.0.0.1/res/images/touxiang.jpg');//修改为要处理的图片url
                    }
                    xiuxiu.onUploadResponse = function (data)
                    {
                        //alert("上传响应" + data); 可以开启调试
                    }
                });
            }
        };
    })
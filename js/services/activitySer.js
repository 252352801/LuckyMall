angular.module('LuckyMall.services')
.factory('ActivitySer',function(API,$http){
        var data={
            history:null,
            now:null,
            next:null
        };
        var my_record=null;
        var initListData=function(arr){
            for(var o in arr){
                arr[o].minPrice=Math.ceil(arr[o].RetailPrice*arr[o].MaxDiscount);
                var cur_t=new Date(arr[o].CurrentTime.replace(/-/g,"/")).getTime();
                var start_t=new Date(arr[o].StartTime.replace(/-/g,"/")).getTime();
                var end_t=new Date(arr[o].EndTime.replace(/-/g,"/")).getTime();
                arr[o].remainTime=parseInt((end_t-cur_t)/1000);
                arr[o].prevTime=parseInt((start_t-cur_t)/1000);
                if(arr[o].UserName==''){
                    arr[o].UserName='暂无';
                }
            }
            return arr;
        };
        var initRecordData=function(arr){
            for(var o in arr){
                arr[o].UserAvatar=angular.fromJson(arr[o].UserAvatar);
                arr[o].UserDiscount=Math.round(arr[o].UserDiscount*100)/10;
            }
            return arr;
        };

        var initDetailsData=function(obj){
            obj.Specifications=angular.fromJson(obj.Specifications);
            try {
                obj.UserAvatar = angular.fromJson(obj.UserAvatar);
            }catch (error){

            }
            obj.maxPrice=Math.ceil(obj.RetailPrice*obj.MinDiscount);
            obj.minPrice=Math.ceil(obj.RetailPrice*obj.MaxDiscount);
            obj.finalPrice=Math.ceil(obj.RetailPrice*obj.CurrDiscount);
            obj.CurrDiscount=Math.round(obj.CurrDiscount*100)/10;
            obj.minDiscount=Math.round(obj.MinDiscount*100)/10;
            obj.maxDiscount=Math.round(obj.MaxDiscount*100)/10;
            var cur_t=new Date(obj.CurrentTime.replace(/-/g,"/")).getTime();
            var start_t=new Date(obj.StartTime.replace(/-/g,"/")).getTime();
            var end_t=new Date(obj.EndTime.replace(/-/g,"/")).getTime();
            obj.remainTime=parseInt((end_t-cur_t)/1000);
            if(cur_t>=start_t&&cur_t<end_t){//是否已经开赛
                obj.status=1;
            }else if(cur_t<start_t){
                obj.status=0;
                obj.prevTime=parseInt((start_t-cur_t)/1000);
            }else if(cur_t>=end_t){
                obj.status=2;
            }
            return obj;
        };
        var initMyRecordsData=function (arr){
            for(var o in arr){
                arr[o].UserDiscount=Math.round(arr[o].UserDiscount*100)/10;
            }
            return arr;
        };
        return {
            /**
             *
             * @param type 类型 0往期 1正在进行 2下期
             * @returns {*}
             */
            getData: function (type) {
                switch (type) {
                    case 0:
                        return data.history;
                        break;
                    case 1:
                        return data.now;
                        break;
                    case 2:
                        return data.next;
                        break;
                }
            },
            getMyRecord:function(){
                return my_record;
            },
            /*请求数据*/
            requestData: function (params, callback) {
                $http({
                    method: API.arenaInfo.method,
                    url: API.arenaInfo.url,
                    data:params
                }).success(function (response, status, headers, config) {
                    switch (params.type){
                        case 0:
                            data.history=initListData(response);
                            callback(data.history,status);
                            break;
                        case 1:
                            data.now=initListData(response);
                            callback(data.now,status);
                            break;
                        case 2:
                            data.next=initListData(response);
                            callback(data.next,status);
                            break;
                    }
                }).error(function (response, status, headers, config) {
                    callback(response,status)
                });
            },
            isCanPlay:function(act_id,callback){
                $http({
                    method: API.isCanPlayActivity.method,
                    url: API.isCanPlayActivity.url+act_id
                }).success(function (response, status, headers, config) {
                    callback(response,status);
                }).error(function (response, status, headers, config) {
                    callback(response,status);
                });
            },
            getArenaTickets:function(callback){//获取擂台挑战票数量
                $http({
                    method: API.arenaTickets.method,
                    url: API.arenaTickets.url
                }).success(function (response, status, headers, config) {
                    callback(response,status);
                }).error(function (response, status, headers, config) {
                    callback(response,status);
                });
            },
            requestDetailsById:function(id,callback){
                $http({
                    method: API.arenaDetails.method,
                    url: API.arenaDetails.url+id
                }).success(function (response, status, headers, config) {
                    callback(initDetailsData(response),status);
                }).error(function (response, status, headers, config) {
                    callback(response,status);
                });
            },
            requestMyRecord:function(params,callback){
                $http({
                    method: API.userRecord.method,
                    url: API.userRecord.url,
                    data:params
                }).success(function (response, status, headers, config) {
                    callback(initMyRecordsData(response),status);
                }).error(function (response, status, headers, config) {
                    callback(response,status);
                });
            },
            requestRecord:function(params, callback){
                $http({
                    method: API.arenaRecord.method,
                    url: API.arenaRecord.url,
                    data:params
                }).success(function (response, status, headers, config) {
                    callback(initRecordData(response),status);
                }).error(function (response, status, headers, config) {
                    callback(response,status);
                });
            },
            /**
             * 查询单个擂台活动的挑战记录
             * @param type false 所有记录  true 擂主记录
             * @param id 活动id
             * @param params
             * @param callback
             */
            requestRecordById:function(type,id,params,callback){
                $http({
                    method: API.arenaRecordOfItem.method,
                    url: API.arenaRecordOfItem.url+id+'/'+type,
                    data:params
                }).success(function (response, status, headers, config) {
                    callback(initRecordData(response),status);
                }).error(function (response, status, headers, config) {
                    callback(response,status);
                });
            }

        };
})
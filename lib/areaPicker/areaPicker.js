(function(){
     function initAreaPicker() {
        var show_elem;
        var ap=new Array(3);
        var cont=new Array(3);
        var select=new Array(3);
        var cur = 0;//0:显示省份 1：显示城市  2；显示县市区  -1：全不显示
        var callback;
        var org_show = ['省份', '城市','县/市/区'];
         /*设置回调函数*/
        this.setCallback= function (cb){
            callback = cb;
        };
         /*清空某选项*/
         function clear(index){
             cont[index].innerHTML = '';
             ap[index].getElementsByTagName("P")[0].innerHTML = org_show[index];
         }
         function show(index) {
             cont[cur].style.display = 'none';
             removeClass(ap[cur], 'cur');
             addClass(ap[index], 'cur');
             cont[index].style.display = 'block';
         }
         /*添加class*/
         function addClass(obj, cls) {
             if (!obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))) {
                 obj.className += " " + cls;
             }
             return obj;
         }
         /*移除class*/
         function removeClass(obj, cls) {
             if (obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))) {
                 var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                 obj.className = obj.className.replace(reg, ' ');
             }
             return obj;
         }
         /*初始化*/
        this.init = function (area_data,show_ele,prov, city, county) {
            show_elem=show_ele;
            ap[0] = prov;
            ap[1]= city;
            ap[2]= county;
            var area = {
                province: '0',
                city: '0_0',
                county: '0_0_0'
            };
            for(var i=0;i<3;i++){
                select[i]=ap[i].getElementsByTagName('p')[0];
                cont[i]=ap[i].getElementsByTagName('ul')[0];
                clear(i);
            }
            var html_province = new Array();
            var data_province = area_data;
            for (var o in data_province) {
                var li = '<li data-item="' + data_province[o].Name + '">' + data_province[o].Name + '</li>';
                html_province.push(li);
            }
            cont[0].innerHTML = html_province.join('');
            show(0);
            cur=0;
            ap[0].addEventListener('mouseover', function () {show(0);cur=0;});
            ap[1].addEventListener('mouseover', function () {show(1);cur=1;});
            ap[2].addEventListener('mouseover', function () {show(2);cur=2;});
            cont[0].data=area_data;
            cont[0].addEventListener('click', function (e) {
                handleClick(e,0,this.data);
            });
            cont[1].addEventListener('click', function (e) {
                handleClick(e,1,this.data)
            });
            cont[2].addEventListener('click', function (e) {
                handleClick(e,2)
            });
            function getAreaByName(name,obj){
                for(var o in obj){
                    if(obj[o].Name==name){
                        return obj[o].ChildAreas;
                    }
                }
            }
            function handleClick(e,index,data){
                var e = e || window.event;
                var target = e.target || e.srcElement;
                if (target.nodeName == 'LI') {
                    if(index==0){
                        clear(1);clear(2);
                    }else if(index==1){
                        clear(2);
                    }
                    select[index].innerHTML = target.innerHTML;
                    select[index].title=target.innerHTML;
                    if(index<2){
                        var html= new Array();
                        var next_data= getAreaByName(target.getAttribute('data-item'),data);
                        console.log(target.getAttribute('data-item'));
                        if(next_data==''||next_data==undefined){
                            var s0=select[0].innerHTML,s1=select[1].innerHTML,s2=select[2].innerHTML;
                            var val=(s0!=s1)?(s0+s1):s1;
                            show_elem.nodeName=='INPUT'?show_elem.value=val:show_elem.innerHTML=val;
                            callback(val);
                            return;
                        }
                        for (var o in next_data) {
                            var li = '<li data-item="' + next_data[o].Name + '">' + next_data[o].Name + '</li>';
                            html.push(li);
                        }
                        cont[index+1].innerHTML = html.join('');
                        cont[index+1].data=next_data;
                        show(index+1);
                        cur=index+1;
                    }else{
                        var val='';
                        var s0=select[0].innerHTML,s1=select[1].innerHTML,s2=select[2].innerHTML;
                        if(s1==s0){
                            val=s1+s2;
                        }else if(s1==s2){
                            val=s0+s1;
                        }else if(s1== s0&&s1==s2){
                            val=s1;
                        }else{
                            val=s0+s1+s2;
                        }
                        show_elem.nodeName=='INPUT'?show_elem.value=val:show_elem.innerHTML=val;
                        callback(val);
                    }
                }
            }
        };
    }

    window.areaPicker=function(params){
        var data=params.data;
        var elem=params.elem;
        var callback=params.callback;
        function getPosition(obj){
            var topValue= 0,leftValue= 0;
            while(obj){
                leftValue+= obj.offsetLeft;
                topValue+= obj.offsetTop;
                obj= obj.offsetParent;
            }
            return {left:leftValue,top:topValue};
        }
        elem.addEventListener('click',function(){
            var ap = new initAreaPicker();
            var poi=getPosition(elem);
            if(elem['elem_ap']){
                var selection = elem['elem_ap'].getElementsByTagName('div');
                ap.init(data,elem, selection[0], selection[1], selection[2]);
                elem['elem_ap'].style.display='block';
            }else {
                elem['elem_ap'] = document.createElement("DIV");
                elem['elem_ap'].style.display = 'none';
                elem['elem_ap'].className = 'areaPicker';
                elem['elem_ap'].innerHTML = '<div class="selector"><p></p><ul></ul></div>' +
                    '<div class="selector"><p></p><ul></ul></div>' +
                    '<div class="selector"><p></p><ul></ul></div>';
                elem['elem_ap'].style.position = 'absolute';
                elem['elem_ap'].style.left = poi.left + 'px';
                elem['elem_ap'].style.top = poi.top + elem.offsetHeight + 'px';
                elem['elem_ap'].style.zIndex = '999';
                elem['elem_ap'].style.display = 'block';
                document.body.appendChild(elem['elem_ap']);
                var selection = elem['elem_ap'].getElementsByTagName('div');
                ap.init(data,elem, selection[0], selection[1], selection[2]);
                ap.setCallback(function (response) {
                    elem['elem_ap'].style.display = 'none';
                    if (callback) {
                        callback(response);
                    }
                });
                document.addEventListener('click', function (e) {
                    var e = e || window.event;
                    var target = e.target || e.srcElement;
                    if (target == elem['elem_ap'] || target == elem) {
                        elem['elem_ap'].style.display = "block";
                        return;
                    } else {
                        while (target != elem['elem_ap']) {
                            if (target) {
                                if (target.nodeName.toLowerCase() == "html") {
                                    elem['elem_ap'].style.display = "none";
                                    break;
                                } else {
                                    target = target.parentNode;
                                }
                            } else {
                                break;
                            }
                        }
                    }
                });
            }
        });
    }
})(window);
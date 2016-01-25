/**
 * Created by huangfeng on 2015/12/17.
 */

var authorization="Bearer "+$.cookie('accessToken');
var ws_authorization=$.cookie('accessToken');

$("textarea[name='compute']").on("input propertychange",function(){

    var p = $(this).caret('position');
    var v=$(this).val();
    var showIn=(v.length-5 == v.lastIndexOf("from "))||(v.length-5 == v.lastIndexOf("join "));
    var showOut=v.length-5 == v.lastIndexOf("into ");
    if(v.length>5&&showIn){
        $("#rule-list-into").hide();
        $("#rule-list-from").css({"top":Math.round(p.top)+30,"left":Math.round(p.left)+10}).show();
        $("#rule-list-from li").eq(0).addClass("select").siblings().removeClass("select")
    }else if(v.length>5&&showOut){
        $("#rule-list-from").hide();
        $("#rule-list-into").css({"top":Math.round(p.top)+30,"left":Math.round(p.left)+10}).show();
        $("#rule-list-into li").eq(0).addClass("select").siblings().removeClass("select")
    }else{
        $("#rule-list-into").hide();
        $("#rule-list-from").hide();
    }

})

$("body").on("click","#rule-list-into li",function(){
    var txt = $("textarea[name='compute']").val();
    $("textarea[name='compute']").val(txt+$(this).text());
    $("#rule-list-into").hide();
})

$("body").on("click","#rule-list-from li",function(){
    var txt = $("textarea[name='compute']").val();
    $("textarea[name='compute']").val(txt+$(this).text());
    $("#rule-list-from").hide();
})

$("body").on("mouseover","#rule-list-into li",function(){
    $(this).addClass("select").siblings().removeClass("select")
})
$("body").on("mouseover","#rule-list-from li",function(){
    $(this).addClass("select").siblings().removeClass("select")
})


$("textarea[name='compute']").on('keypress',function(event){
    if(event.keyCode == "40"){//键盘down按下
        if(!$("#rule-list-from").is(":hidden")){
            var index = $("#rule-list-from li.select").index()
            $("#rule-list-from li").eq(++index).addClass("select").siblings().removeClass("select")
        }
        if(!$("#rule-list-into").is(":hidden")){
            var index = $("#rule-list-into li.select").index();
            $("#rule-list-into li").eq(++index).addClass("select").siblings().removeClass("select")
        }
    }
    if(event.keyCode == "38"){//键盘up按下
        if(!$("#rule-list-from").is(":hidden")){
            var index = $("#rule-list-from li.select").index();
            if(index==0){
                return
            }else{
                $("#rule-list-from li").eq(--index).addClass("select").siblings().removeClass("select")
            }
        }

        if(!$("#rule-list-into").is(":hidden")){
            var index = $("#rule-list-into li.select").index()
            if(index==0){
                return
            }else{
              $("#rule-list-into li").eq(--index).addClass("select").siblings().removeClass("select")
            }
        }

    }
    if(event.keyCode == "13"){//键盘enter按下
        if($("#rule-list-from").is(":hidden")&&$("#rule-list-into").is(":hidden")){
            return;
        }
        var txt = $("textarea[name='compute']").val();
        if(!$("#rule-list-from").is(":hidden")){
            $("textarea[name='compute']").val(txt+$("#rule-list-from li.select").html());
            $("#rule-list-from").hide();
            return false;
        }
        if(!$("#rule-list-into").is(":hidden")){
            $("textarea[name='compute']").val(txt+$("#rule-list-into li.select").html());
            $("#rule-list-into").hide();
            return false;
        }

    }

});

//获取规则列表
var pageSize= 10,listMark=["0"],listsearchMark=["0"];

function goPage(mark){
    $.ajax({
        url: "/api/rule?pageSize="+pageSize+"&mark="+mark,
        dataType:"json",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success: function(data){
            if(data.list==0) {
                if(listMark.length==1){
                    $("#page").hide();
                }else{
                    $("#page").show();
                    utils.alertMsgTip("没有下一页了")
                }
                return;
            };
            var buff = [], list = data.list, length = list.length;
            var len = listMark.length;
            for (var l = 0; l < len; l++) {
                if (listMark[l] == data.mark) {
                    listMark = listMark.slice(0,l+1);
                    break;
                } else {
                    if (l == (listMark.length - 1)) {
                        listMark.push(data.mark);
                    }
                }
            }
            var previous=0;
            if(listMark.length - 3<0){
                previous=0
            }else{
                previous=listMark.length - 3;
            }
            $("#previous").html('<a href="javascript:goPage(\'' + listMark[previous] + '\')">上一页</a>')
            $("#next").html('<a href="javascript:goPage(\'' + data.mark + '\')">下一页</a>');
            $("#currentPage").html('当前第'+(listMark.length-1)+'页')
            $("#page").show();
            for(var i=0;i<length;i++){
                var statusString='',status="";
                if(list[i].status=="started"){
                    status="运行中"
                    statusString='<a href="javascript:;" class="btn-link btn-stop">停止</a>'
                }
                if(list[i].status=="stopped"){
                    status="已停止"
                    statusString='<a href="javascript:;" class="btn-link btn-start">启动</a>'
                }
                if(list[i].status=="starting"){
                    status="正在启动"
                    statusString='<a href="javascript:;" class="btn-link btn-stop">停止</a>'
                }
                if(list[i].status=="stopping"){
                    status="正在停止"
                    statusString='<a href="javascript:;" class="btn-link btn-start">启动</a>'
                }
                buff.push('<tr><td>'+list[i].name+'</td><td class="status">'+status+'</td><td>'+list[i].created.substring(0,10)+'</td>' +
                    '<td rule-id="'+list[i].id+'">'+statusString+'<a href="javascript:;" data-toggle="modal" data-target="#myModal" class="btn-link btn-edit">编辑</a><a href="javascript:;" class="btn-link btn-delete">删除</a></td></tr>')
            };
            $("#list").html(buff.join(''));
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }
    })

}

goPage(listMark[0])


//创建规则

$("#create-rule").on("click",function(){
    $("#myModalLabel").html("新建规则")
    $("#btn-save").show()
    $("#btn-update").hide()
    $("#btn-stop-debug").hide()
    $("#btn-debug").show()
    $("#pre-rule-result").html("")
})

$("#btn-save").on("click",function(){
    var name = $.trim($("input[name='name']").val());
    if (name.length == 0) {
        alert("名称不能为空");
        return
    }
    var compute = $.trim($("textarea[name='compute']").val());
    if (compute.length == 0) {
        alert("规则不能为空");
        return
    }
    var data={
        name:name,
        compute:compute
    }
    $.ajax({
        url: "/api/rule/",
        type:"post",
        contentType:'application/json',
        data:JSON.stringify(data),
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success: function () {
          location.reload()
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }

    })

});

//删除规则
$("body").on("click",".btn-delete",function(){

    if($(this).parent().find(".btn-stop").length>0){
        utils.alertMsgTip("不能删除运行中的规则");
        return;
    }
    if(!confirm("确定删除?")){
        return;
    }
    var id =$(this).parents().attr("rule-id");
    var self=$(this).parent().parent()
    $.ajax({
        url: "/api/rule/"+id,
        type:"DELETE",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success: function (){
            self.remove();
            utils.alertMsgTip("删除成功")
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }
    })
});

//启动规则
$("body").on("click",".btn-start",function(){
    var id =$(this).parents().attr("rule-id");
    var self=$(this).parent().parent();
    var s=$(this)
    $.ajax({
        url: "/api/rule/"+id+"/service",
        type:"post",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success:function(data,textStatus,xhr){
            s.html("停止");
            s.attr("class","btn-link btn-stop");
            self.find(".status").html("运行中")
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }
    })
})

//修改规则

var rule_id =$(this).parents().attr("rule-id");

$("body").on("click",".btn-edit",function(){
    $("#myModalLabel").html("编辑规则")
    rule_id =$(this).parents().attr("rule-id");
    $("#btn-save").hide();
    $("#btn-update").show();
    $("#btn-stop-debug").hide();
    $("#btn-debug").show();
    $("#pre-rule-result").html("").hide();
    $.ajax({
        url: "/api/rule/"+rule_id,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success: function (data){
           $("input[name='name']").val(data.name)
           $("textarea[name='compute']").val(data.compute);
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }
    })
})

$("#btn-update").on("click",function(){
    var name = $.trim($("input[name='name']").val());
    if (name.length == 0) {
        alert("名称不能为空");
        return
    }
    var compute = $.trim($("textarea[name='compute']").val());
    if (compute.length == 0) {
        alert("规则不能为空");
        return
    }
    var data={
        name:name,
        compute:compute
    }
    $.ajax({
        url: "/api/rule/"+rule_id,
        type:"PUT",
        contentType:'application/json',
        data:JSON.stringify(data),
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success:function(data,textStatus,xhr){
            location.reload()
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }
    })
})



//停止规则


$("body").on("click",".btn-stop",function(){
    utils.addLoadMask();
    var id =$(this).parents().attr("rule-id");
    var self=$(this).parent().parent();
    var s=$(this);
    $.ajax({
        url: "/api/rule/"+id+"/service",
        type:"DELETE",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success: function (data){
            utils.removeLoadMask()
            s.html("启动");
            s.attr("class","btn-link btn-start");
            self.find(".status").html("已停止")
        },
        error:function(xhr,textStatus,errorThrown){
            utils.removeLoadMask()
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }
    })
})

//调试规则
var ws=null;
$("#btn-debug").on("click",function(){
    if (!window.WebSocket) {
        alert("你的浏览器不支持WebSocket");
        return
    }
    var query= $.param({
        access_token:ws_authorization,
        compute:$("textarea[name='compute']").val()
    },true)
    ws=new WebSocket("ws://"+location.host+"/api/rule/test?"+query,"json");
    //监听消息
    ws.onmessage = function(event) {
        console.log(event.data)
        var data=JSON.parse(event.data);
        if(data.type=="input"){
            $("#pre-rule-result").append("<p style='font-weight:bold; padding-top: 5px;'>输入</p>")
            $("#pre-rule-result").append(formatJson(data));
        }
        if(data.type=="output"){
            $("#pre-rule-result").append("<p style='font-weight:bold; padding-top: 5px;'>输出</p>")
            $("#pre-rule-result").append(formatJson(data));
        }
        $("#pre-rule-result").show();
    };
    // closeWebSocket
    ws.onclose = function(event) {
        console.log("close")
    };
    // 打开WebSocket
    ws.onopen = function(event) {
        console.log("打开WebSocket")
        $("#btn-stop-debug").show();
        $("#btn-debug").hide();
    };
    ws.onerror =function(event){
        ws.send("onerror!");
    };
})

//停止调试规则
$("#btn-stop-debug").on("click",function(){
    if(ws==null) return;
    ws.close();
    $("#btn-stop-debug").hide();
    $("#btn-debug").show();
    $("#pre-rule-result").html("").hide();
})

//获取数据流名称列表

$.ajax({
    url: "/api/stream/name?action=in",
    beforeSend: function (request) {
        request.setRequestHeader("Authorization", authorization);
    },
    success:function(data,textStatus,xhr){
        var list=data.list,len=list.length,buff=[];
        for(var i=0;i<len;i++){
            buff.push('<li>'+list[i]+'</li>');
        }
        $("#rule-list-from ul").html(buff.join(''))

    },
    error:function(xhr,textStatus,errorThrown){
        var response = eval("("+xhr.responseText+")");
        utils.alertMsgTip(response._message)
    }
})

$.ajax({
    url: "/api/stream/name?action=out",
    beforeSend: function (request) {
        request.setRequestHeader("Authorization", authorization);
    },
    success:function(data,textStatus,xhr){
        var list=data.list,len=list.length,buff=[];
        for(var i=0;i<len;i++){
            buff.push('<li>'+list[i]+'</li>');
        }
        $("#rule-list-into ul").html(buff.join(''))
    },
    error:function(xhr,textStatus,errorThrown){
        var response = eval("("+xhr.responseText+")");
        utils.alertMsgTip(response._message)
    }
})
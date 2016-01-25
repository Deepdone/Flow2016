/**
 * Created by huangfeng on 2016/1/10.
 */

var id =utils.getRequest().id;
var authorization="Bearer "+$.cookie('accessToken');
//获取设备配置列表
$.ajax({
    url: "/api/device/"+id+"/config",
    dataType:"json",
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", authorization);
    },
    success:function(data,textStatus,xhr){
        var list = data.list, len = list.length;
        if (len == 0){
            $("#configureList").html('<tr><td colspan="4" class="text-center" style="padding-top: 20px; color: #ccc;">没有数据</td></tr>');
            return
        };
        var buff = [];
        for (var i = 0; i < len; i++) {
            buff.push('<tr><td>' + list[i].display + '</td><td>' + list[i].name + '</td><td>' + list[i].value + '</td>' +
                '<td><a href="javascript:;" name="' + list[i].name + '" class="btn-link btn-delete">删除</a>' +
                '<a href="javascript:;" data-toggle="modal" data-target="#myModal" name="'+list[i].name+'" value="'+list[i].value+'" display="' + list[i].display + '" class="btn-link btn-edit">修改</a></td></tr>')
        }
        $("#configureList").html(buff.join(''));
    },
    error:function(xhr,textStatus,errorThrown){
        var response = eval("("+xhr.responseText+")");
        utils.alertMsgTip(response._message)
    }
})

//获取当前设备详情

$.ajax({
    url: "/api/device/"+id,
    dataType:"json",
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", authorization);
    },
    success: function(data,textStatus,xhr) {
      $("#device-name").html(data.name)
      $("#device-id").html(data.deviceId)
      $("#created").html(data.created.substring(0,10))
      $("#device-status").html(data.status)
    },
    error:function(xhr,textStatus,errorThrown){
        var response = eval("("+xhr.responseText+")");
        utils.alertMsgTip(response._message)
    }
})


//删除配置

$("body").on("click",".btn-delete",function(){
    if(!confirm("确定删除?")){
        return;
    }
    var name =$(this).attr("name");
    var parent=$(this).parent().parent();
    $.ajax({
        url: "/api/device/"+id+"/config/"+name,
        type:"DELETE",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success: function(data,textStatus,xhr){
          utils.alertMsgTip("删除成功");
            parent.remove();
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }
    })
});

//修改配置

$("body").on("click",".btn-edit",function(){

    $("input[name='display']").val($(this).attr("display"));
    $("input[name='value']").val($(this).attr("value"));
    $("input[name='name']").val($(this).attr("name"));
    $("input[name='name']").val($(this).attr("name")).prop("disabled", true);
    $("#my-title").html("修改设备配置")
    $("#btn-save").hide();
    $("#btn-update").show();

})


$("#btn-update").on("click",function(){
    var name = $("input[name='name']").val();
    var display=$("input[name='display']").val();
    var value=$("input[name='value']").val();
    var data={
        display:display,
        value:value
    }
    $.ajax({
        url: "/api/device/"+id+"/config/"+name,
        type:"PUT",
        contentType:'application/json',
        data:JSON.stringify(data),
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success: function(data,textStatus,xhr){
            utils.alertMsgTip("修改成功");
            setTimeout(function(){
                location.reload();
            },1000)
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }
    })
})



//获取设备状态列表

$.ajax({
    url: "/api/device/"+id+"/status",
    dataType:"json",
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", authorization);
    },
    success:function(data,textStatus,xhr){
        var list = data.list, len = list.length;
        if (len == 0){
            $("#statusList").html('<tr><td colspan="4" class="text-center" style="padding-top: 20px; color: #ccc;">没有数据</td></tr>');
            return
        };
        var buff = [];
        var display="";

        for (var i = 0; i < len; i++) {
            if(list[i].display==null||list[i].display==""){
                display=list[i].name;
            }
            buff.push('<tr><td>' + display + '</td><td>' + list[i].name + '</td><td>' + list[i].value + '</td>' +
                '<td>' + list[i].created.substring(0,10) + '</td></tr>')
        }
        $("#statusList").html(buff.join(''));
    },
    error:function(xhr,textStatus,errorThrown){
        var response = eval("("+xhr.responseText+")");
        utils.alertMsgTip(response._message)
    }
})


//增加设备配置
$("#addConfig").on("click",function(){
    $("#my-title").html("增加设备配置")
    $("#btn-save").show();
    $("#btn-update").hide();
    $("input[name='display']").val("");
    $("input[name='value']").val("");
    $("input[name='name']").val("");
    $("input[name='name']").val("").prop("disabled", false);
})

$("#btn-save").on("click",function(){

    var name = $.trim($("input[name='name']").val());
    if (name.length == 0) {
        alert("名称不能为空");
        return
    }
    var display = $.trim($("input[name='display']").val());
    if (display.length == 0) {
        alert("显示名称不能为空");
        return
    }
    var value = $.trim($("input[name='value']").val());
    if (value.length == 0) {
        alert("值不能为空");
        return
    }
    var data={
        name:name,
        value:value,
        display:display
    }
    $.ajax({
        url: "/api/device/"+id+"/config/",
        type:"post",
        contentType:'application/json',
        data:JSON.stringify(data),
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success: function(data,textStatus,xhr) {
            location.reload()
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }

    })

})


//执行设备控制

$("#btn-execute").on("click",function(){
    var name = $.trim($("input[name='execute-name']").val());
    var args = $.trim($("input[name='args']").val());
    if(name.length == 0) {
        alert("名称不能为空");
        return;
    }
    if(args.length == 0) {
        alert("参数不能为空");
        return;
    }
    var arrayArgs = args.split(" ");
    var data={
        name:name,
        args:arrayArgs
    }
    $.ajax({
        url: "/api/device/"+id+"/control/execute/",
        dataType: "text",
        type:"post",
        contentType:'application/json',
        data:JSON.stringify(data),
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", authorization);
        },
        success:function(data,textStatus,xhr){
            utils.alertMsgTip(data)
        },
        error:function(xhr,textStatus,errorThrown){
            var response = eval("("+xhr.responseText+")");
            utils.alertMsgTip(response._message)
        }
    })

})
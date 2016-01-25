/**
 * Created by huangfeng on 2016/1/3.
 */



var authorization="Bearer "+$.cookie('accessToken');

$.ajax({
    url:"/ucenter/user/basic.do",
    dataType:'json',
    success: function(data){
        $("#username").html('用户名：'+data.username);
        $("#contact").html('联系人：'+data.contact);
        $("#tel").html('电话：'+data.tel);
        $("#company").html('公司：'+data.company);
    }
})




$.ajax({
    url:"/api/services",
    dataType:'json',
    beforeSend: function (request) {
        request.setRequestHeader("Authorization", authorization);
    },
    success: function(data){
        $("#certs-count").html(data.certs.count);
        $("#msg-count").html(data.messages.count);
        $("#devices-count").html(data.devices.count);
        $("#rule-count").html(data.rule.count);
        $("#rule-inputMsg-count").html(data.rule.inputMsg);
        $("#rule-outputMsg-count").html(data.rule.outputMsg);
    },
    error:function(xhr,textStatus,errorThrown){
        var response = eval("("+xhr.responseText+")");
        utils.alertMsgTip(response._message)
    }
})
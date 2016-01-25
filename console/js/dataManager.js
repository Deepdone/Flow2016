/**
 * Created by huangfeng on 2015/12/17.
 */


$(".dataManager-top .btn").on("click",function(){
    var show = $(this).attr("show");
    $(this).addClass("btn-black").parent().siblings().find(".btn").removeClass("btn-black");
    $(".data-item").hide();
    $("#"+show).show();
})



var uploader,uploadReady=false;
function initUpload(){
    uploader = WebUploader.create({
        // swf文件路径
        swf: './lib/Uploader.swf',

        // 文件接收服务端。
        server: 'http://webuploader.duapp.com/server/fileupload.php',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#picker',

        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false
    });
    uploader.on('beforeFileQueued',function(e){
    })
    uploader.on('error',function(e){
    })
    uploader.on('fileQueued', function( file ) {

    });
    uploader.on('uploadSuccess', function( file,response ) {

    });
    uploader.on('uploadComplete', function( file ) {
    });
}

$(".btn-success").on("click",function(){
    if(uploadReady){
        return;
    }
    uploadReady=true;
    setTimeout(function(){
        initUpload()
    },500)
})
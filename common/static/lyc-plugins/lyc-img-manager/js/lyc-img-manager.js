/**
 * Created by linyuchen on 16/8/8.
 */
(function () {
    var currentPath = $("script").last().attr("src");
    var slashPos = currentPath.lastIndexOf("/");
    if (slashPos != -1){
        currentPath = currentPath.substring(0, slashPos) + "/";
        // console.log(currentPath);
    }
    else{
        currentPath = "/"
    }
    function readHtml(url) {
       $.ajax({
        url: url,
        async: false,
        type: "GET",
        success: function (data) {
            document.write(data);
        }
        });
    }
    readHtml(currentPath + "img-selector.html");
    readHtml(currentPath + "img-upload.html");
})();
function LycImageManager(configData) {
    /*
    * 获取图片列表的url,
    * GET方式，返回json格式的列表
    * 如: [{id: "id", url: "url", name: "name"})]
    * 其中url和name是需要存在的， id可不要， 当然你也可以添加额外的东西进去, 但是删除图片的时候是需要id的
    * */
    var imageListUrl = configData.imageListUrl;

    /*
    * 上传的网址
    * POST方式，
    * 上传的内容:
    *   file: 文件
    *   name: 上传时填的图片名字
    *   url: 上传时填的网络图片地址
    * */
    var uploadUrl = configData.uploadUrl;

    /*
    * resultCallback， 图片选择确定后的回调， 接受一个参数data, data包含了被选中图片的一些信息
    * data.name, 图片名字
    * data.url, 图片地址
    * 总之data就是获取图片列表时返回的列表元素
    * */
    var resultCallback = configData.selectedCallback;

    /*
    * 删除图片的api url，
    * 删除时会post "id":图片的id
    * */
    var deleteUrl = configData.deleteUrl;

    /* 上传后的回调函数
     * 此函数接收一个参数，参数是服务器返回的内容
     * */
    var uploadCallback = configData.uploadCallback;


    var selectorView = $(".lyc-image-selector");
    var uploadView = $(".lyc-image-upload");
    var zzView = $(".lyc-image-manager-zz");
    $(".btn-cancel", selectorView).click(function () {
        $(".images-line img", selectorView).attr("selected", false);
        selectorView.hide();
    });

    function showSelectorView() {
        selectorView.show();
        zzView.show();
    }
    function hideSelectorView() {
        selectorView.hide();
        zzView.hide();
    }

    function imgBindClick() {
        $(".images-content .img-group", selectorView).click(function () {
            $(".images-content .img-group", selectorView).attr("selected", false);
            if ($(this).attr("selected") == "selected"){
                $(this).attr("selected", false);
            }
            else{
                $(this).attr("selected", "selected");
            }
        });
    }
    $(".btn-ok", selectorView).click(function () {
        hideSelectorView();
        var imgResult = $(".images-content .img-group[selected=selected]", selectorView);
        var data = imgResult.attr("data");
        data = JSON.parse(data);
        if (imgResult.length < 1){
            resultCallback(null);
        }
        else{
            resultCallback(data);
        }
    });

    $(".btn-cancel", selectorView).click(function () {
        hideSelectorView();
        // resultCallback(null);
    });

    this.selectImage = function(callback) {
        showSelectorView();
        if (callback){
            resultCallback = callback;
        }
        refresh();
    };

    $(".btn-upload", selectorView).click(
        function () {
            hideSelectorView();
            zzView.show();
            uploadView.show();
        }
    );

    $(".btn-del", selectorView).click(function () {
        var selectedImage = $(".images-content .img-group[selected=selected]", selectorView);
        if (selectedImage.length <= 0){
            return;
        }
        if (!confirm("确定删除？")){
            return;
        }
        var imageData = JSON.parse(selectedImage.attr("data"));
        $.post({
            url: deleteUrl,
            data: {"id": imageData.id},
            success: function (data) {
                if (data.code == 0){
                    selectedImage.remove();
                }
                else{
                    alert(data.msg);
                }
            }
        })
    });

    function refresh() {
        $(".images-content .img-group", selectorView).remove();
        $.ajax({
            url: imageListUrl,
            type: "GET",
            async: false,
            success:function(res) {
                if (res.code == 0) {

                    var images = res.data;
                    $(images).each(function () {
                        var imgGroup = $("<div class='img-group'><img src='" + this.url + "'><p class='img-name'>" + this.name + "</p></div>");
                        imgGroup.attr("data", JSON.stringify(this));
                        $(".images-content", selectorView).append(imgGroup);
                    });
                    imgBindClick();
                }
            }
        })
    }

    // 上传相关
    $(".upload-btn-cancel", uploadView).click(
        function () {
            uploadView.hide();
            showSelectorView();
        }
    );

    $(".upload-btn-ok", uploadView).click(function () {
        var outUrl = $(".upload-out-url", uploadView).val();
        var name = $(".upload-name", uploadView).val();

        var data = new FormData($("form")[0]);

         $.ajax({
              url: uploadUrl,
              type: 'POST',
              data: data,
              async: false,
              cache: false,
              contentType: false,
              processData: false,
              success: function (data) {
                  if (data.code == 0){
                      refresh();
                      if (uploadCallback){
                          uploadCallback(data);
                      }
                      $(".upload-btn-cancel").click();
                  }
                  else{
                      alert(data.msg);
                  }
              },
              error: function (data) {
                  alert(data);
              }
         });
    });

}



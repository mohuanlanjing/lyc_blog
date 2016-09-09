/**
 * Created by linyuchen on 16/7/20.
 */

$(".content").keydown(function (e) {
    console.log(e.keyCode);
    var continueDo = true;
    if(e.keyCode === 9){
        // alert("tab");
        // console.log("tab");
        $(this).append("&nbsp;&nbsp;&nbsp;&nbsp;");
        continueDo = false;
    }
    else if(e.keyCode === 13){
        $(this).append("<br>");
        continueDo = false;
    }
    if (!continueDo){
        var range = window.getSelection().getRangeAt(0);  
        var len = this.childNodes.length;
        range.setStart(this, len);
        range.setEnd(this, len);
        // range.collapse(true);
        getSelection().removeAllRanges();
        getSelection().addRange(range);
    }
    return continueDo;
});

$("#new-btn").click(function () {
    var title = $(".title input").val();
    var content = $(".content")[0].innerHTML;
    lycpost({
        url: "/backend/api/edit-article",
        data: {title: title, content: content},
        failed: function (errMsg) {
            alert(errMsg);
        },
        success: function (res) {
            alert("新建文章成功");
            var new_article_id = res.article_id;
            var url = "/backend/edit-article/" + new_article_id;
            location.href= url;
        }
    })
});

$("#save-btn").click(function () {
    var title = $(".title input").val();
    var content = $(".content")[0].innerHTML;
    var article_id = $(this).attr("article-id");
    lycpost({
        url: "/backend/api/edit-article",
        data: {title: title, content: content, article_id: article_id},
        failed: function (errMsg) {
            alert(errMsg);
        },
        success: function (res) {
            alert("保存成功");
            // var new_article_id = res.article_id;
        }
    })
});

$("#preview-btn").click(function () {
    var article_id = $(this).attr("article-id");
    var url = "/article/" + article_id;
    location.href= url;
});
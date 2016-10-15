/**
 * Created by linyuchen on 16/7/20.
 */


(function () {
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
                location.href = url;
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
        open(url);
    });


    var imgConfig = {
        uploadUrl: "/images/upload",
        imageListUrl: "/images/list",
        deleteUrl: "/images/delete"
    };
    var lycEditor = new LycEditor($(".content"), imgConfig);
})();

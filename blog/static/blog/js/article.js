/**
 * Created by linyuchen on 16/7/18.
 */


function addComment(articleId, name, email, content, parentCommentId) {
    var postData = {article_id: articleId, name: name, content: content};
    if (email){
        postData.email = email;
    }
    if (parentCommentId){
        postData.parent_comment_id = parentCommentId;
    }
    lycpost({url:"/article/api/add-comment", data:postData, success:function (data) {
        alert("评论成功");
        $(".new-comment-content").val("");
        $(".new-comment").hide();
        $(".comments-item-reply a").text("回复");
        $(".comments-item-reply a").attr("show-reply", false);
        $(".new-comment").first().show();
        var comment_first = "";
        if (data.comment_first){

            comment_first = data.comment_first;
        }
        var div = '<div class="comments-item" id="comment' + data.comment_id + '" comment-id="' + data.comment_id + '">\
                    <div class="comments-item-username">' + name + '</div>\
                    <div class="comments-item-time">' + data.comment_time + '</div>\
                    <div class="comments-item-content">'
                             + comment_first
                        + content + 
                    '</div>\
                    <div class="comments-item-reply"><a href="javascript:void(0)" show-reply="false">回复</a></div>\
                </div>'
        div = $(div);
        $(".comments").prepend(div);
        $(".comments-item-reply a").click(replyCommentAClick);
        $("#comment"+data.comment_id).focus();
        // window.location.href = "/article/" + data.article_id + "#comment" + data.comment_id;
        // window.location.href = location.href;
        // location.reload();
        // open(location.href);
        // window.location = location;
        // location.reload();
        
    }, failed: function (errMsg) {
        alert(errMsg);
    }})
    
}

function addCommentBtnClick(){
    var articleId = $(this).attr("article-id");
    var parent = $(this).parent().parent();
    var name = $(".new-comment-name", parent).val();
    var email= $(".new-comment-email", parent).val();
    var content= $(".new-comment-content", parent).val();
    var parentCommentId = $(parent).attr("parent-comment-id");
    addComment(articleId, name, email, content, parentCommentId); 
}

$(".add-comment-btn").click(addCommentBtnClick);


function replyCommentAClick() {
    var showReply = $(this).attr("show-reply");
    var newComment = $(".new-comment").first();
    var parent = $(this).parent().parent();
    $(".new-comment").hide();
    $(".comments-item-reply a").text("回复");
    $(".comments-item-reply a").attr("show-reply", false);
    if (showReply == "true"){
        newComment.show();
        $(".new-comment", parent).hide();
        $(this).attr("show-reply", false);
        $(this).text("回复");
    }
    else{
        $(this).text("取消回复");
        newComment.hide();
        if ($(".new-comment", parent).length < 1){
            var _newComment = newComment.clone();
            _newComment.attr("parent-comment-id", parent.attr("comment-id"));
             $(".add-comment-btn", _newComment).click(addCommentBtnClick);
            // _newComment.css("marginTop", "2rem");
            _newComment.attr("class", "new-comment");
            $(parent).append(_newComment);
        }
        $(".new-comment", parent).show();
        $(this).attr("show-reply", true);
    }
}

$(".comments-item-reply a").click(replyCommentAClick);
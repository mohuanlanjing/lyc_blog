/**
 * 
 * Created by linyuchen on 16/6/6.
 */

var OK = 0;

function lycpost(data){
    var url = data.url;
    var postData = JSON.stringify(data.data);
    var success = data.success;
    var failed = data.failed;
    $.post(url, postData, function (resData) {
        if (resData.code != OK){
            if(failed){
                failed(resData.msg);
            }
        }
        else{
            if (success){
                success(resData);
            }
        }
    })
}

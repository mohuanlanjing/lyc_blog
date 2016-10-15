/**
 * Created by linyuchen on 2016/10/15.
 */

function LycEditor(editorElement, imgConfig) {

    var contentEle = $(editorElement);
    var selection = window.getSelection();
    var oldRange;

    contentEle.attr("contenteditable", true);
    var tools = $("<div></div>")
    tools.width(contentEle.width());
    tools.css({"paddingTop": "0.5rem"});
    var insertImgBtn = $("<a href='javacript:void(0)'>插入图片</a>");
    insertImgBtn.css({"textDecoration": "none", "fontSize": "0.8em", "color": "#7a7c7d"});
    tools.append(insertImgBtn);

    contentEle.before(tools);

    var lycImgManager = new LycImageManager(imgConfig);


    insertImgBtn.click(function () {
        lycImgManager.selectImage(function (img) {
            img = $("<img src='" + img.url + "'>")[0];
            addElement(img, oldRange);
        });
    });

    function addElement(element, oldRange) {
        if (oldRange) {

            var currentRange = oldRange;
        }
        else {
            contentEle.focus();
            var currentRange = selection.getRangeAt(0);
        }
        var elementWidth = element.width;
        if (elementWidth >= contentEle.width()) {
            // alert("宽了");
            element.width = contentEle.width() - 202;
        }
        var range = currentRange;
        if (range.commonAncestorContainer.nodeName == "#text") {
            var currentNode = range.commonAncestorContainer;
            var text = range.commonAncestorContainer.data;
            var s1 = text.substring(0, range.startOffset);
            s1 = $("<span>" + s1 + "</span>")[0];
            var s2 = text.substring(range.startOffset);
            $(currentNode).before(s1);
            $(currentNode).before(element);
            var s2 = $("<span>" + s2 + "</span>")[0];
            $(currentNode).before(s2);
            // posNode = s2;
            $(currentNode).remove();
            range.selectNode(s2);
            range.setStart(s2, 0)
            range.setEnd(s2, 0)
        }
        else {
            var currentNode = range.commonAncestorContainer;
            var resetRange = true;
            if (currentNode == contentEle[0]) {
                // contentEle.append(element)
                currentNode = currentNode.childNodes[range.startOffset];

            }

            if (currentNode) {
                $(currentNode).before(element);
                range.setStart(currentNode, 0);
                range.setEnd(currentNode, 0);
            }
            else {
                contentEle.append(element);
                range.setStart(contentEle[0].lastChild, 0);
                range.setEnd(contentEle[0].lastChild, 0);
            }
            // contentEle.animate({scrollTop: element.offsetTop}, "fast");

        }

        getSelection().removeAllRanges();
        getSelection().addRange(range);
    }

    this.addElement = function (element) {
       addElement(element, oldRange);
    };

    contentEle.keydown(function (e) {
        // console.log(e.keyCode);
        var continueDo = true;
        if (e.keyCode === 9) {
            addElement($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>")[0]);
            continueDo = false;
        }
        return continueDo;
    });

    contentEle.hover(null,
    function () {
        if (selection.rangeCount != 0){
            oldRange = selection.getRangeAt(0)
        }
    });
}
/**
 * Created by linyuchen on 2016/10/12.
 */


function Mp3Player(audioElement) {
    var audioElement = audioElement;
    var self = this;
    this.currentIndex = 0;
    this.currentAudioTitle = "";
    this.currentSrc = "";
    this.playList = [];
    var enableRandom = false;
    this.enableRandom = function (enable) {
        enableRandom = enable;
        if (enableRandom){
            this.randomIndex();
        }
    };

    audioElement.addEventListener("ended", function () {
        self.next();
    });
    this.randomIndex = function () {
        if (enableRandom) {
            if (this.playList.length > 1){
                var index = Math.floor(Math.random() * this.playList.length);
                if (index != this.currentIndex){
                    this.currentIndex = index;
                }
                else{
                    this.randomIndex();
                }
            }
        }
    };
    this.setPlayList = function (playList) {
        this.playList = playList;
    };
    this.getCurrentAudio = function () {
        var currentAudio = this.playList[this.currentIndex];
        this.currentAudioTitle = currentAudio.title;
        this.currentSrc = currentAudio.src;
        return currentAudio;
    };
    this.play = function () {
        this.getCurrentAudio();
        var src = this.currentSrc;
        if (src != $(audioElement).attr("src")){
            $(audioElement).attr("src", src);
        }
        audioElement.play();
        this.playCallBack();
    };
    this.pause = function () {
        audioElement.pause();
        this.pauseCallBack();
    };
    this.next = function () {
        if (enableRandom){
            this.randomIndex();
        }
        else{
            if (this.currentIndex < this.playList.length - 1){
                this.currentIndex += 1;
            }
            else{
                this.currentIndex = 0;
            }
        }
        this.play();
    };
    this.last = function () {
        if (this.currentIndex > 0){
            this.currentIndex -= 1;
        }
        else{
            this.currentIndex = this.playList.length - 1;
        }
        this.play();
    };
    this.setPlayCallBack = function (callBack) {
        this.playCallBack = callBack;
    };
    this.setPauseCallBack = function (callBack) {
        this.pauseCallBack = callBack;
    };
    this.setNextCallBack = function (callBack) {
        this.nextCallBack = callBack;
    }

}

function initPlayer() {
    var playerHtml = '<div id="mp3-player">\
        <audio id="_audio">\
        </audio>\
        <div class="song-title">\
            \
        </div>\
        <div class="hide-title"></div>\
        <div class="controls">\
            <a class="last-btn" href="javascript:void(0)"></a>\
            <a class="play-btn" href="javascript:void(0)"></a>\
            <a class="pause-btn" href="javascript:void(0)"></a>\
            <a class="next-btn" href="javascript:void(0)"></a>\
        </div>\
    </div>';
    document.write(playerHtml);
    var hideStatus = true;
    var mp3Div = $("#mp3-player");
    // $(".song-title", mp3Div).hide();
    // $(".controls", mp3Div).hide();
    var mp3Play = new Mp3Player($("#_audio")[0]);
    $(".pause-btn").hide();

    mp3Play.setPlayCallBack(function () {
        $(".play-btn").hide();
        $(".pause-btn").show();
        $(".song-title").text(mp3Play.currentAudioTitle);
    });
    mp3Play.setPauseCallBack(function () {
        $(".play-btn").show();
        $(".pause-btn").hide();
    });

    $(".play-btn").click(function () {
        mp3Play.play();
    });
    $(".pause-btn").click(function () {
        mp3Play.pause();
    });
    $(".next-btn").click(function () {
        mp3Play.next();
    });
    $(".last-btn").click(function () {
        mp3Play.last();
    });
    mp3Div.hover(function () {
        $(".song-title", mp3Div).show();
        $(".controls", mp3Div).show();
        // $(".hide-title", mp3Div).hide();
        mp3Div.filter(':not(:animated)').animate({"right": "0rem"}, function () {
            hideStatus = false;
        })
    },
        function () {
            mp3Div.animate({"right": "-9rem"}, function () {
                hideStatus = true;
                // $(".hide-title", mp3Div).show();
                $(".song-title", mp3Div).hide();
                $(".controls", mp3Div).hide();
            })
        }
    );
    mp3Play.setPlayList = function (playList) {
        mp3Play.playList = playList;
        mp3Play.getCurrentAudio();
        $(".song-title").text(mp3Play.currentAudioTitle);
    };
    return mp3Play;
}
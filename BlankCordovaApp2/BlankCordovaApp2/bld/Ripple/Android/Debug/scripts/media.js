var my_media = null;
var mediaTimer = null;
var IndexMusic;
var testsrc = null;
var BackForwardFlag = false;

function playAudio(src, index) {

    console.log(src);

    IndexMusic = index;
    $("#pause_play").attr('onclick', 'pauseAudio()').removeClass("ui-btn-play").addClass("ui-btn-pause");
    $("#pause_play").html("<i class='fa fa-pause'></i>");
    $('#musicPlayPage h1').html("Parça Çalınıyor...");

    if ($('.playingMusicPath').val().trim() != testsrc) {
        if (my_media) // media varsa değiştir
        {

            my_media.stop();
            my_media.release();
            my_media = new Media(src, onPlaySuccess, onPlayError, status_change);
        }
    }

    if (my_media == null) {

        // Create Media object from src
        my_media = new Media(src, onPlaySuccess, onPlayError, status_change); console.log("calıstı-1");
    } // else play current audio

    testsrc = src;


    // Play audio
    my_media.play();



    GetSingLengt();

    sliderGetİnformation(mediaTimer);
    setInterval(function () { BackForwardFlag = true; }, parseInt($("#duration").attr("max")) * 1000);

}

function change(milliseconds) {
    if (milliseconds <= 0)
        return '00:00';

    var seconds = Math.round(milliseconds);
    var minutes = Math.floor(seconds / 60);
    if (minutes < 10)
        minutes = '0' + minutes;

    seconds = seconds % 60;
    if (seconds < 10)
        seconds = '0' + seconds;

    return minutes + ':' + seconds;
}

function pauseAudio() {

    if (my_media) {
        my_media.pause();
        $("#pause_play").html("<i class='fa fa-play'></i>");
        $('#musicPlayPage h1').html("Parça Duraklatıldı.");
        $("#pause_play").attr("onclick", "playAudio($('.playingMusicPath').val())").removeClass("ui-btn-pause").addClass("ui-btn-play");
        console.log($('.playingMusicPath').val());
    }
}

// Stop audio
// 
function stopAudio() {

    if (my_media) {
        $('#musicPlayPage h1').html("Parça Başa Sarıldı.");
        my_media.stop();
    }
    clearInterval(mediaTimer);
    mediaTimer = null;
}

function onPlaySuccess() {
    console.log("playAudio():Audio Success");
}

// onError Callback 
//
function onPlayError(error) {
    console.log('code: ' + error.code + '\n' +
          'message: ' + error.message + '\n');
}

function sliderGetİnformation(mediaTimer) {
    // Update my_media position every second
    if (mediaTimer == null) {
        mediaTimer = setInterval(function () {
            // get my_media position
            my_media.getCurrentPosition(
                // success callback 

                function (position) {
                    if (position > -1) {
                        $('#duration').val(parseInt(position));
                        $('#duration').slider('refresh');
                    }
                },
                // error callback
                function (e) {
                    console.log("Error getting pos=" + e);
                    setAudioPosition("Error: " + e);
                }
            );
        }, 1000);
    }
}

function GetSingLengt() {
    var counter = 0;
    var timerDuration = setInterval(
           function () {
               counter++;
               if (counter > 20)
                   clearInterval(timerDuration);

               var duration = my_media.getDuration();
               if (duration > -1) {
                   clearInterval(timerDuration);
                   $('.time').html(change(duration));
                   $('#duration').attr("max", parseInt(duration));

               }
               else
                   $('.time').text('Unknown');
           },
           100
        );

}

function status_change1(status) {

    if (status == 4) {
        var a = IndexMusic; console.log(a);
        console.log("status_change calıstı");
        if ($("#AllmusicPage .abc li").eq(a + 1).size()) a = a + 1;
        else a = 0;
        autoplay = subFoldername + "/" + $("#AllmusicPage .abc li").eq(a).find('.a').text();
        $("#musicPlayPage .msgPlay").html("çalınan şarkı " + $("#AllmusicPage .abc li").eq(a).find('.a').text());
        $('.playingMusicPath').val(autoplay);

        playAudio(autoplay, a);


    }

}
function status_change(status) {

    if (status == 4 && BackForwardFlag) {
        status_change1(status);
        BackForwardFlag = false;
    }
}




function BackForward(tip) {

    BackForwardFlag = false;
    if (tip == 1) {

        console.log("Back_Forward calıstı 1");
        if ($("#AllmusicPage .abc li").eq(IndexMusic + 1).size()) IndexMusic = IndexMusic + 1;
        else IndexMusic = 0;
        autoplay = subFoldername + "/" + $("#AllmusicPage .abc li").eq(IndexMusic).find('.a').text();
        $("#musicPlayPage .msgPlay").html("çalınan şarkı " + $("#AllmusicPage .abc li").eq(IndexMusic).find('.b').text());
        $('.playingMusicPath').val(autoplay);
        newMediaPlay(autoplay);
    }
    else if (tip == 2) {
        console.log("Back_Forward calıstı 2");
        if ($("#AllmusicPage .abc li").eq(IndexMusic - 1).size()) IndexMusic = IndexMusic - 1;
        else IndexMusic = $("#AllmusicPage .abc li").size();
        autoplay = subFoldername + "/" + $("#AllmusicPage .abc li").eq(IndexMusic).find('.a').text();
        $("#musicPlayPage .msgPlay").html("çalınan şarkı " + $("#AllmusicPage .abc li").eq(IndexMusic).find('.b').text());
        $('.playingMusicPath').val(autoplay);
        newMediaPlay(autoplay);

    }

}

function newMediaPlay(src) {
    my_media.stop();
    my_media.release();
    my_media = new Media(src, onPlaySuccess, onPlayError, status_change);
    my_media.play();
    GetSingLengt();
    sliderGetİnformation(mediaTimer);
    setInterval(function () { BackForwardFlag = true; }, parseInt($("#duration").attr("max")) * 1000);

}
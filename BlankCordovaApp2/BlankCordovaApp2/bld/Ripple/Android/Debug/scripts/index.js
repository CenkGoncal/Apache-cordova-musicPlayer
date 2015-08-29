// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        //Telefondaki  müzikleri arraya doldur
        readMP3File();

        fileStart();




        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        };

        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        };


    };


    //var subFoldername = "Music";
    var oldFolderName = "";
    var backflag = 0;
    $('.folder', '.musiclist').hide();


    function onFileSystemSuccess(fileSystem) {
        fileSystem.root.getDirectory(subFoldername, { create: false, exclusive: false }, getDirSuccess, fail);
    }

    function getDirSuccess(dirEntry) {
        // Get a directory reader
        var directoryReader = dirEntry.createReader();

        // Get a list of all the entries in the directory
        directoryReader.readEntries(readerSuccess, fail);
    }

    function fail(error) {
        subFoldername = oldFolderName;
        console.log(error);
    }

    function readerSuccess(entries) {

        for (var i = 0; i < entries.length; i++) {

            var control = entries[i].name.search(".mp3");
            if (control == -1) {
                $(".musiclist").hide();
                $('.musics .folder').show().append("<li><a href='#' class='ui-btn'><i class='fa fa-folder'></i>" + entries[i].name + "</a></li>");
            }
            else {
                $(".folder").hide();
                $('.musics .musiclist').show().append("<li><a href='#' class='ui-btn'><i class='fa fa-music'></i>" + entries[i].name + "</a></li>");
            }

        }
        $(".musics .folder li").one("click", function () {
            backflag = 0
            if (backflag == 0) { SubFolderReader($(this).text().trim()); }
        });

        $(".musics .musiclist li").click(function () {

            $('#play').addClass('ui-state-disabled');
            var musicsnamepath = subFoldername + "/" + $(this).text().trim();
            // ChangeMusicInformtation($(this).text().trim(), musicsnamepath)
            // playAudio(musicsnamepath, $(this).index());

        });
    }






    function SubFolderReader(foldername) {
        $('.musics ul').html("");
        oldFolderName = subFoldername;//eski folder ismini Sakla
        subFoldername = subFoldername + "/" + foldername;
        fileStart();
    }


    function fileStart() {

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
    }


    $('.backfolder').click(function () {
        backflag = 1;
        if (oldFolderName == "") subFoldername = "Music";
        else subFoldername = oldFolderName;
        $('.musics ul').html("");
        fileStart();
    })



    function ChangeMusicInformtation(musicname, path) {
        $("#musicPlayPage .msgPlay").html("çalınan şarkı " + musicname);
        $('.playingMusicPath').val(path);
    }


    var links = new Array();
    var musics = new Array();

    function readMP3File() {

        links[0] = "Music";

        $('.abc input,.CalListMenu').hide();

        $(".ui-content.abc ").css("height", "450px");
        $.mobile.loading("show", {
            text: "müzikler yükleniyor...",
            textVisible: true,
            theme: "b",
            textonly: true,
            html: ""
        });
        // ilk önce müzikleri doldur
        var x = 0;
        var myVar = setInterval(
                    function () {  alert(links[x]+" önce");
                        test(x, links, musics); 
                        if (links[x] == undefined || links[x] == null) {
                            alert(links[x]+" if");

                            clearInterval(myVar);
                            musics = musics.sort();

                            $.mobile.loading("hide");
                            $(".ui-content.abc ").css("height", "auto").find("input").show();
                            var options = "<a href='#purchase' data-rel='popup' data-position-to='window' data-transition='pop'>Purchase album</a>";
                            // Müzikleri html bas
                            alert(JSON.stringify(musics));
                            $.each(musics, function (index, obj) {
                                alert(obj[1]+ "obj")
                                $('.allMuscis').append("<li><a href='#musicPlayPage' class='play'><span class='a' hidden>" + obj[1] + "</span><i class='fa fa-music left'></i><span class='b'>" + obj[0] + "</span></a>" + options + "</li>");

                            });
                            $(".allMuscis").listview('refresh');

                            allMuscisClickOption();

                            AddPlayList();


                        }
                        else { x++; alert("else düştü " + x); }
                    }, 100);

    }

    function allMuscisClickOption() {

        $(".allMuscis li").click(function () {
            $("#purchase h3").html("<br>" + $(this).find(".play .b").text());
        });

        $(".play").click(function () {
            console.log($(this).parent("li").index());
            playAudio($(this).find(".a").text(), $(this).parent("li").index());
            ChangeMusicInformtation($(this).find(".b").text(), $(this).find(".a").text());
        })

    }

    function AddPlayList() {

        $('.addPlaylist').click(function () {
            $(".menu").hide();
            $(".CalListMenu").show();

            $("#ListSec").trigger("expand");
        });



        $('.CreateList').click(function () {


            $.ajax({
                type: "POST",
                url: "http://cenkgoncal.esy.es/test.php",
                crossDomain: true,
                beforeSend: function () { $.mobile.loading('show') },
                complete: function () { $.mobile.loading('hide') },
                data: { dbname: $('#dbname').val() },
                dataType: 'json',
                success: function (response) {
                    alert(response);
                    if (response[0] == 0) $('.hata').css("color", "red").html("databese bağlantı hatası oluştu");
                    if (response[0] == 1) $('.hata').css("color", "red").html("databese tablo yarama hatası oluştu");
                    if (response[0] == 2) $('.hata').css("color", "green").html($('#dbname').val() + "listesi olustruldu");
                    if (response[0] == 3) $('.hata').css("color", "red").html("daha önceden <br>" + $('#dbname').val() + "listesi olusturulmus");
                    if (response[0] == 0) $('.hata').css("color", "red").html("veriler post olmadı");
                },
                error: function (request, status, error) {
                    console.error(request);
                    console.error(status);
                    console.error(error);
                }
            });


        })
    }

    function test(x, links, musics) {

        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + links[x],
        function (dirEntry) {
            var directoryReader = dirEntry.createReader();

            directoryReader.readEntries(
            function (entries) {
                
                for (var i = 0; i < entries.length; i++) {
                    alert(entries[i].name + "test");
                    var control = entries[i].name.toLowerCase().search(".mp3");
                    if (control == -1) {
                        if (entries[i].name.toLowerCase().search(".mp4") != -1) continue;

                        var link = entries[i].fullPath;


                        links.push(link); console.log(links[x + 1]);

                    }
                    else {
                        alert(entries[i].name+"test else");
                        musics.push([entries[i].name.toUpperCase(), entries[i].fullPath]);
                        alert(JSON.stringify(musics));
                    }
                }

                x++;

            }, fail);
        }, fail);

    }









})();
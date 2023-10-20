var videoCount = 0;
var networkSpeedBps = 0;

function getVideoCount() {
    var videoCountElement = document.querySelector('span.style-scope.yt-formatted-string');
    var videoCountText = videoCountElement.innerText;

    var videoCount = 0;
    if (videoCountText.indexOf('K') > -1) {
        videoCount = videoCountText.replace('K', '') * 1000;
        videoCount += 100;
    } else if (videoCountText.indexOf('Mn') > -1) {
        videoCount = videoCountText.replace('Mn', '') * 1000000;
        videoCount += 100000;
    } else if (videoCountText.indexOf('B') > -1) {
        videoCount = videoCountText.replace('B', '') * 1000000000;
        videoCount += 100000000;
    } else {
        videoCount = videoCountText;
    }

    return videoCount;
}

var imageAddr = "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bloemen_van_adderwortel_%28Persicaria_bistorta%2C_synoniem%2C_Polygonum_bistorta%29_06-06-2021._%28d.j.b%29.jpg";
var downloadSize = 7300000; //bytes

function ShowProgressMessage(msg) {
    if (console) {
        if (typeof msg == "string") {
            console.log(msg);
        } else {
            networkSpeedBps = msg[1].replace(" bps", "");
            videoCount = getVideoCount();

            var scrollTime = (videoCount / 28) * 1000;
            var minimumScrollTime = 1000;
            scrollTime = Math.min(minimumScrollTime, scrollTime / (networkSpeedBps / 1000000));

            var _autoScroller = setInterval(function () {
                window.scrollBy(0, 99999999);
            }, 1);

            setTimeout(function () {
                clearInterval(_autoScroller);
                getLink();
            }, scrollTime * (videoCount / 28));

            console.log("Scroll Time: " + scrollTime);
            console.log("Video Count: " + videoCount);
            console.log("Network Speed: " + networkSpeedBps);
        }
    }
}

function InitiateSpeedDetection() {
    ShowProgressMessage("Loading the image, please wait...");
    window.setTimeout(MeasureConnectionSpeed, 1);
};

if (window.addEventListener) {
    window.addEventListener('load', InitiateSpeedDetection, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', InitiateSpeedDetection);
}

function MeasureConnectionSpeed() {
    var startTime, endTime;
    var download = new Image();
    download.onload = function () {
        endTime = (new Date()).getTime();
        showResults();
    }

    download.onerror = function (err, msg) {
        ShowProgressMessage("Invalid image, or error downloading");
    }

    startTime = (new Date()).getTime();
    var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;

    function showResults() {
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);

        ShowProgressMessage([
            "Your connection speed is:",
            speedBps + " bps"
        ]);
    }
}

function getLink() {
    var videoList = [];
    var jsonData = "";

    var urls = document.querySelectorAll('a');

    urls.forEach(function (v, i, a) {
        if (v.id == "video-title-link") {
            videoList.push({
                title: v.title,
                href: v.href
            });
        }
    });

    jsonData = JSON.stringify(videoList);

    console.log("JSON VIDELIST: " + jsonData);


    var body = document.querySelector('body');
    body.classList.add('stop_gokboerue');
}

MeasureConnectionSpeed();
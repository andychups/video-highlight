Video highlight (beta)
=========
jQuery plugin which recognize the dominant color of video.

Example
=========
Single color: http://andychups.ru/examples/fitandhighlight/
Several colors: http://andychups.ru/examples/fitandhighlight-gradient/

How to use
=========
```
<h1 id="color-title">Color title</h1>

<video id="js-video-1" class="js-video" data-videohl-timeupdate="50" data-videohl-gradient="true" width="1280" height="720" preload="auto" loop="loop">
    <source src="video/video1.webm" type="video/webm" />
    <source src="video/video1.mp4" type="video/mp4" />
</video>

<video id="js-video-2" class="js-video" width="1280" height="720" preload="auto" loop="loop">
    <source src="video/video2.webm" type="video/webm" />
    <source src="video/video2.mp4" type="video/mp4" />
</video>

<button id="kill-video-2">Kill! Kill! Kill!</button>
```

```
var $videos = $('.js-video');
var $video1 = $('#js-video-1');
var $video2 = $('#js-video-2');

$videos.videoHighlight();

$video1
    .on('videohl-update', function (e, from, to) {
        var pattern = 'linear-gradient(to bottom,  rgba(fromR,fromG,fromB,1) 0%, rgba(toR,toG,toB,1) 100%)';

        pattern = pattern.replace('fromR', from[0]);
        pattern = pattern.replace('fromG', from[1]);
        pattern = pattern.replace('fromB', from[2]);
        pattern = pattern.replace('toR', to[0]);
        pattern = pattern.replace('toG', to[1]);
        pattern = pattern.replace('toB', to[2]);

        $('#color-title').css('background', pattern);
    });

$video2
    .on('videohl-update', function (e, r, g, b) {
        $('#color-title').css('color', 'rgb('+r+', '+g+', '+b+')');
    });

$('#kill-video-2').on('click', function () {
    var api = $video2.data('videohl-api');
    api.getTimeUpdate(); // 300
    api.setTimeUpdate(1000);
    api.getTimeUpdate(); // 1000
    api.destroy(); // See you later, alligator
});

```

API (see code)
=========
api.getTimeUpdate()

api.setTimeUpdate()

api.destroy()

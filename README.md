# um-video-player.js

An HTML5 video player that can take in multiple videos with time offsets, and play them in a sequence. Originally developed by Dan Sawada; expanded by Eric Dahlseng and Savannah Niles.

## Motivation

For playing multiple videos in a sequence, it is possible to use a single `<video>` element and change its `src` to other videos. But there is a time lag from the point it starts to load to the point it actually becomes playable.

This javascript library preloads videos, coordinates the multiple `<video>` elements that are created, and enables cross-disolve transitions during playback. 

## Usage

Have this Javascript file included in your `<head>` section. For now, we recommend using the Github CDN to get the file, since there might be frequent changes and bugfixes to the codebase.

```html
<script src="https://raw.githubusercontent.com/edahlseng/um-video-player-js/master/um-video-player.js"></script>
```

Prepare the render object data structure. The only part of this that's required is the `EDL` array or objects that must contain a `url` to a video, and optionally a `startTime` and `endTime` in seconds.

```javascript
var renderObject = {
    rtitle: 'Ultimate Media Remix',
    EDL: [{
        url: "http://um-static.media.mit.edu/UU-0MrczERAe4/UU-0MrczERAe4_low.mp4",
        startTime: 2.0,
        endTime: 5.0
    }, {
        url: "http://um-static.media.mit.edu/UU-2QqLqnxXJc/UU-2QqLqnxXJc_low.mp4",              
        startTime: 2.0,
        endTime: 4.0
    }, {
        url: "http://um-static.media.mit.edu/UU-0MrczERAe4/UU-0MrczERAe4_low.mp4",
        startTime: 54.0,
        endTime: 56.0
    }, {
        url: "http://um-static.media.mit.edu/UU-2QqLqnxXJc/UU-2QqLqnxXJc_low.mp4",
        startTime: 10.0,
        endTime: 13.0
    }, {
        url: "http://um-static.media.mit.edu/UU-0MrczERAe4/UU-0MrczERAe4_low.mp4",
        startTime: 34.0,
        endTime: 37.0
    }],
};
```

Prepare the placeholder `<div>` somewhere in your HTML document and be sure to define its height and width in css. (`id` could be arbitrary)

```html
<div id="um_video_player_wrapper"></div>
```

Use the syntax below to initialize the player object. You can include any of the optional parameters.

```javascript
window.onload = function(){

    var player;

    function onReady() {
        console.log("READY");
        // player.play();
    }

    function onLoadError(e) {
        console.log("ERROR", e);
    }

    function onTimeUpdate() {
        console.log("ON TIME UPDATE",　"Current Time is:", this.currentTime());
    }

    function onFinish() {
        console.log("ON FINISH");
    }

    player = new UMVideoPlayer("um_video_player_wrapper", renderObject, {
        "onReady" : onReady, 
        "onLoadError" : onLoadError, 
        "onTimeUpdate" : onTimeUpdate, 
        "onFinish" : onFinish,
        "transitionTime" : .3,
        "classString" : "um-video-player video_element"
    });
    // player.setRenderObject(renderObjects);

};
```

## API Reference

#### UMVideoPlayer("id", renderObject, {onReady, onLoadError, onTimeUpdate, onFinish, transitionTime, classString});

- `"id"` is the `id` of the placeholder `<div>` element.
- `renderObject` is the data structure that describes the sources and time ranges of your sequence of clips.
- `onReady` is the callback function for when the video is ready for play.
- `onLoadError` is the callback function for when their is an error.
- `onTimeUpdate` is the callback function for when the video progresses.
- `onFinish` is the callback function for when the video is done.
- `transitionTime` is the length of the cross-fade between videos in seconds.
- `classString` is classes that will be added to the `<video>` elements inside the container div.


#### UMVideoPlayer.play();

- Play render object. Always call after `onReady` is invoked.

#### UMVideoPlayer.pause();

- Pause render object

#### UMVideoPlayer.currentTime();

- Get the current time of the render object.

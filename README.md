UMVideoPlayer
=============

An HTML5 video player that can take in multiple videos with time offsets, and play them in a sequence. Originally developed by Dan Sawada; expanded by Eric Dahlseng and Savannah Niles.

Motivation
----------

If you want to play multiple clips in a sequence, you can use a single `<video>` element and change its `src` when one clip ends and you want to start the next one. Unfortunately, though, there is a time lag between when the `<video>` element begins to load and when it actually becomes playable.

The purpose of this module is to provide a playback method that eliminates this time lag.  This module will preload multiple `<video>` elements, and coordinate their playback. Most of the properties, callbacks, and functions that a typical `<video>` element has are also available with this module. This means that common controls (like seeking for example) can easily be performed, so that the end user doesn't have to know that more than one `<video>` element is being used.

Usage
-----

### Demo ###

To see a demo of how the UMVideoPlayer can be used, clone the repository or download this entire folder, and set up a quick HTTP server. Python comes with a simple built-in HTTP server:

```
$ python -m SimpleHTTPServer
```

### Including in your own project ###

If you want to use this module in a project of your own, you simply need to include the UMVideoPlayer.js file. We recommend copying the file into your project folder and including it in the `<head>` section of your html file:

```html
<script src="\UMVideoPlayer.js"></script>
```

If you want to always use the most updated version, feel free to use the GitHub CDN. Keep in mind, however, that the API is subject to change in the future. Just include this in you html `<head>` section:

```html
<script src="https://raw.githubusercontent.com/edahlseng/um-videoplayer/master/UMVideoPlayer.js"></script>
```

### UMVideoPlayer Setup ###

To use the video player, you create a UMVideoPlayer object:

```javascript
var player = new UMVideoPlayer(videoContainerID, renderObject, options);
```

Only the `videoContainerID` and the `renderObject` are required. The `options` parameter allows for customization of the player. The available options are described in detail in the **API Reference** section below.

The `videoContainerID` is the id of a `<div>` element in your html file.  This `<div>` must be empty (any elements you put in it will be removed by the player) as its only purpose is to hold the multiple `<video>` elements in the same place. Be sure to define its height and width in css. The `id` can be arbitrary:

```html
<div id="umVideoPlayerContainer"></div>
```

The renderObject is an object that describes the sources and time ranges of your sequence of clips. The only required part of the render object is the `EDL` array. This array contains a list of objects that must contain a `url` to a video, and optionally a `startTime` and `endTime` in seconds.

```javascript
var renderObject = {
    EDL: [{
        url: "http://um-static.media.mit.edu/UU-h0G46k4j2Q/UU-h0G46k4j2Q_low.mp4",
        startTime: 1.0,
        endTime: 4.0,
    }, {
        url: "http://um-static.media.mit.edu/UU-KOsIAlLPHE/UU-KOsIAlLPHE_low.mp4",
        startTime: 26.5,
        endTime: 34.0,
    }, {
        url: "http://um-static.media.mit.edu/UU-0MrczERAe4/UU-0MrczERAe4_low.mp4",
        startTime: 54.0,
        endTime: 58.5,
    }],
};
```

API Reference
-------------

The UMVideoPlayer can be easily used by specifying options when you create it, and by calling certain predefined methods.

### Options ###

You may pass in an `options` object in order to customize the video player. The syntax of the options object looks like this:

```javascript
var options = { "classString" : "umVideoPlayer",
                "transitionTime" : .1,
                "loadingErrorHandler" : loadingErrorHandler,
                "loadingStartedHandler" : loadingStartedHandler,
                "loadingStoppedHandler" : loadingStoppedHandler,
                "playHandler" : playHandler,
                "pauseHandler" : pauseHandler,
                "timeUpdateHandler" : timeUpdateHandler,
            }
```

The options object can contain parameters as well as functions to be used as event handler callbacks.

#### Parameters

- `autoLoadDuration` is a boolean that specifies whether the video player should automatically load the duration when it is first created. See **UMVideoPlayer.loadDuration()** below in the **Methods** section for more information. The default is `false`.
- `autoReload` is a boolean that specifies whether the video player should reload the render object when it has reached the end. The default is `true`.
- `classString` is the string that will be added to the class attribute of the `<video>` elements that the player automatically creates. This parameter allows you to apply css rules to those `<video>` elements.
- 'preloadAmount` is the number of clips that should be loaded in advance. In order to elminiate the time lag between clips, the video player will load the clips in advance. By default the player loads 1 clip in advance. If the clips that you use are very short, or your users have slower internet connections, you may specifiy a larger `preloadAmount`. Keep in mind that this may cause a larger loading delay at the beginning, however.
- `transitionTime` is the length in seconds of the cross-fade between clips. The default is 0.

#### Event Handler Callbacks

- `clipStartedHandler` is called when a new clip begins playing.
- `durationLoadedHandler` is called after the duration has first been loaded.
- `finishedHandler` is called when the end of the render object has been reached.
- `loadingErrorHandler` is called when there is a loading error.
- `loadingStartedHandler` is called when the player begins to wait for a loading clip.
- `loadingStoppedHandler` is called when the player is done waiting for a loading clip.
- `playHandler` is called when the player plays.
- `pauseHandler` is called when the player is paused.
- `timeUpdateHandler` is called when the current time of the player updates.
- `videoReadyHandler` is called when the video player is ready to play at the beginning.

### Methods ###

#### UMVideoPlayer.currentTime()

- Returns the current time of the video, independent of the current time of the indiviudal clips.

#### UMVideoPlayer.duration()

- Returns the duration of all clips added together. This may need to be loaded first (see **UMVideoPlayer.loadDuration()** below).

#### UMVideoPlayer.loadDuration()

- Calling this method will load the duration of the video.
-If some of the clips in the render object did not have a specified endTime, then the only way to determine the length of those clips is to load the metadata for those clips and then get the length of the clip.  This only needs to be done once, but must be done before calling `UMVideoPlayer.duration()`, unless the render object contains an endTime for each clip.
- You can specify `"autoloadDuration" : true` in the options object if you want the duration to be automatically loaded when the video player is first created.

#### UMVideoPlayer.play()

- This will play the video player.

#### UMVideoPlayer.pause()

- This will pause the video player.

#### UMVideoPlayer.seekToClipIndex(clipIndex)

- This will seek the current time of the video player to the beginning of the specified `clipIndex`.

#### UMVideoPlayer.seekToSeconds(desiredSeconds)

- This will seek the current time of the video player to the time specified in `desiredSeconds`.
- The duration must be loaded before this method can be used.

#### UMVideoPlayer.togglePlayPause()

- This will play the player if it is currently paused, and will pause the player if it is currently playing.
- This is very useful if you have a single button that acts as both the play button and the pause button.
function UMVideoPlayer(wrapperId, renderObject, options) {
    //to note: clips 1 sec or less experience a delay, need to optimize.
    //option to load X number of videos in advance to adjust accordingly

    var self = this;

    this.videoContainer = document.getElementById(wrapperId);

    //options
    this.onReady = options.onReady;
    this.onLoadError = options.onLoadError;
    this.onRenderObjectTimeUpdate = options.onRenderObjectTimeUpdate;
    this.onVideoFinish = options.onVideoFinish;

    this.transitionTime = 0;
    if (options.transitionTime != null && typeof options.transitionTime == "number") {
        this.transitionTime = options.transitionTime;
    }

    this.classString = ""; //option= additional class tags
    if (options.classString != null && typeof options.classString == "string") {
        this.classString = options.classString;
    }

    this.renderObj = null;
    this.currentVideo = 0;
    this.isVideoReady = false;
    this.videoObjects = [];
    this.renderObjectTime = 0;
    this.contentTime = [];
    this.isVideoPlaying = false;

    //--------------------------------------------------

    this.play = function () {
        if (this.isVideoReady) {
            var videoElement = document.getElementById("video-" + self.elementId + "-" + self.currentVideo);//.getAttribute("id");
            console.log(videoElement);
            videoElement.style.opacity = "1";
            this.videoObjects[self.currentVideo].play();
            this.isVideoPlaying = true;
        } else {
            this.onLoadError("video not ready");
        }
    }

    this.pause = function () {
        if (this.videoObjects[self.currentVideo] != null) {
            if (!this.videoObjects[self.currentVideo].paused()) {
                this.videoObjects[self.currentVideo].pause();
            }
            if (!this.videoObjects[self.currentVideo + 1].paused()) {
                this.videoObjects[self.currentVideo + 1].pause();
            }

            this.isVideoPlaying = false;
        }
    }

    this.currentTime = function (newTime) {

        if (typeof newTime === 'number') {
            return "SKIMMING NOT YET IMPLEMENTED";
        } else {
            return this.renderObjectTime;
        }

    }

    this.generateId = function(num) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < num; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    this.loadInitialVideo = function () {

        this.currentVideo = 0;
        this.isVideoReady = false;
        this.elementId = self.generateId(10);
        // this.renderObjectTime = 0;
        this.contentTime = new Array(this.renderObj.EDL.length);

        this.loadVideoElement(0);
    }

    this.loadVideoElement = function (id) {
        
        var content = this.renderObj.EDL[id];
        this.appendVideo(id, content.url, content.startTime, content.endTime); 

        if (this.renderObj.EDL.length > id + 1) {
            content = null;
            content = this.renderObj.EDL[id + 1];
            this.appendVideo(id + 1, content.url, content.startTime, content.endTime);
        }
    }

    this.appendVideo = function (id) {

        var content = this.renderObj.EDL[id];

        var videoElement = document.createElement('video');
        videoElement.setAttribute('id', "video-" + self.elementId + "-" + id);
        videoElement.setAttribute('class', self.classString);

        var timeString = "#t=";
        timeString += content.startTime;
        if (content.endTime)
        {
            timeString += "," + content.endTime;
        }
        if (timeString == "#t=")
        {
            timeString = "";
        }
        videoElement.setAttribute('src', content.url + timeString);

        videoElement.setAttribute('controls', true);
        videoElement.setAttribute('preload', "auto");

        videoElement.style.position = "absolute";
        videoElement.style.opacity = "0";
        videoElement.style.webkitTransition = self.transitionTime + "s";

        videoElement.addEventListener("loadedmetadata", self.onMetadataLoaded);
        videoElement.addEventListener("loadeddata", self.onVideoReady);
        videoElement.addEventListener("play", self.onPlay);
        videoElement.addEventListener("pause", self.onPause);
        videoElement.addEventListener("timeupdate", self.onTimeUpdate);

        this.videoObjects[id] = videoElement;
        this.contentTime[id] = 0;

        self.videoContainer.insertBefore(videoElement, self.videoContainer.firstChild);
    }    

    this.onMetadataLoaded = function() {
                
        var elementId = this.id;
        var videoId = parseInt(elementId.replace("video-" + self.elementId + "-", ""));

        if (videoId == null || videoId < 0) {
            self.onLoadError("Something wrong with video element...");
            return;
        }

        self.currentTime(self.renderObj.EDL[videoId].startTime);
        self.contentTime[videoId] = self.renderObj.EDL[videoId].startTime;

    }

    this.onVideoReady = function() {

        var elementId = this.id;
        var videoId = parseInt(elementId.replace("video-" + self.elementId + "-", ""));

        if (videoId == null || videoId < 0) {
            self.onLoadError("Something wrong with video element...");
            return;
        }

        if (videoId == 0) {
            self.isVideoReady = true;
            document.getElementById("video-" + self.elementId + "-" + self.currentVideo).style.opacity = "1";
            self.onReady();
        }
    }

    this.onPlay = function() {
        console.log("onPlay");

    }

    this.onPause = function() {
        // console.log("onPause");
        // console.log ("currentVideo = " + self.currentVideo); 
        // console.log ("self.renderObj.EDL.length= " + self.renderObj.EDL.length);
        // console.log ("self.renderObj.EDL[self.currentVideo].endTime= " + self.renderObj.EDL[self.currentVideo].endTime); 
        // console.log ("this.currentTime = " + self.currentTime());
        // console.log ("video currentTime = " + document.getElementById("video-" + self.elementId + "-" + self.currentVideo).currentTime);

        var videoElement = document.getElementById("video-" + self.elementId + "-" + self.currentVideo);
        if (self.renderObj.EDL[self.currentVideo].endTime <= videoElement.currentTime) {
 
            self.currentVideo++;

            if (self.currentVideo - 1 >= 0) {
                    //console.log("video being paused", self.currentVideo - 1);
                    if (self.videoObjects[self.currentVideo - 1] != null) {
                        self.videoObjects[self.currentVideo - 1].pause();
                    }
                    self.videoObjects[self.currentVideo - 1] = null;
                }
            this.remove();
            videoElement.style.opacity = "0"; 


            if (self.renderObj.EDL.length > self.currentVideo) {
                var videoElement2 = document.querySelector("#video-" + self.elementId + "-" + self.currentVideo);
                videoElement2.style.opacity = "1";
                self.videoObjects[self.currentVideo].play();

                if (self.renderObj.EDL.length > self.currentVideo + 1) {
                    var content = self.renderObj.EDL[self.currentVideo + 1];
                    self.appendVideo(self.currentVideo + 1, content.url, content.startTime, content.endTime);
                }

            }
            else {
                // self.onVideoFinish();
                self.loadInitialVideo();
                self.isVideoPlaying = false;
            }

        }
    }

    this.onTimeUpdate = function() {
        //future: better support for transitions, 
        //adding support for a scrubber through the whole concat ro
        //etc.
        //fullscreen support
        //better controls
    }

    //--------------------------------------------------

    this.renderObj = renderObject;

    if (this.renderObj == null) {
        this.onLoadError("Invalid Render Object");
        return;
    }

    this.loadInitialVideo();

    //--------------------------------------------------
}

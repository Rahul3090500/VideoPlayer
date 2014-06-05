function UMVideoPlayer(videoId, wrapperId, onReady, onLoadError, onRenderObjectTimeUpdate, onVideoFinish, transition) {
    var self = this;

    this.videoContainer = document.getElementById(wrapperId);
    console.log (self.videoContainer);
    this.videoId = videoId;
    this.videoStyle;//document.getElementById(videoId).style;
    this.placeholderHeight = 0;
    this.placeholderWidth = 0;

    this.onReady = onReady;
    this.onLoadError = onLoadError;
    this.onRenderObjectTimeUpdate = onRenderObjectTimeUpdate;
    this.onVideoFinish = onVideoFinish;

    this.renderObj = null;
    this.currentVideo = 0;
    this.isVideoReady = false;
    this.videoObjects = [];
    this.renderObjectTime = 0;
    this.contentTime = [];
    this.isVideoPlaying = false;

    this.transitionTime = 300;
    if (transition != null && typeof transition == "number") {
        this.transitionTime = transition;
    }

    this.setRenderObject = function(obj) {

        this.renderObj = obj;

        if (this.renderObj == null) {
            this.onLoadError("Invalid Render Object");
            return;
        }

        this.loadInitialVideo();
        return true;
    }

    this.play = function () {
        if (this.isVideoReady) {
            var videoElement = document.getElementById("video-" + self.videoUuid + "-" + self.currentVideo);//.getAttribute("id");
            console.log(videoElement);
            videoElement.style.webkitTransition = "opacity .3s"; //may want to move
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

        //console.log("loadInitialVideo");
        //this is all fishy 

        this.currentVideo = 0;
        this.videoObjects = new Array(this.renderObj.contentURLs.length);
        this.isVideoReady = false;
        this.videoUuid = self.generateId(10);
        this.renderObjectTime = 0;
        this.contentTime = new Array(this.renderObj.contentURLs.length);
        // this.placeholderWidth = document.querySelector('#'+this.placeholderDiv).clientWidth();
        // this.placeholderHeight = document.querySelector('#'+this.placeholderDiv).clientHeight();

        this.loadVideoElement(0);
    }

    this.loadVideoElement = function (id) {

        //contentURLs = EDL
        
        var content = this.renderObj.contentURLs[id];
        this.appendVideo(id, content.url, content.startTime, content.endTime); //keep this don't touch

        if (this.renderObj.contentURLs.length > id + 1) {
            content = null;
            content = this.renderObj.contentURLs[id + 1];
            this.appendVideo(id + 1, content.url, content.startTime, content.endTime);
        }
    }

    this.appendVideo = function (id) {

        var content = this.renderObj.contentURLs[id];
        var classTag = null; //option= additional class tags

        var videoElement = document.createElement('video');
        videoElement.setAttribute('id', "video-" + self.videoUuid + "-" + id);
        videoElement.setAttribute('class', "um_video_player vjs-default-skin");
        videoElement.setAttribute('height', 400);
        videoElement.setAttribute('width', 400);
        videoElement.setAttribute('src', content.url + "#t=" + content.startTime + "," + content.endTime);
        videoElement.setAttribute('controls', true);
        videoElement.setAttribute('preload', "auto");

        videoElement.style.position = "absolute";
        videoElement.style.left = "0px";
        videoElement.style.top = "0px";
        videoElement.style.opacity = "0";
        videoElement.style.webkitTransitionEnd = ".3s";

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
        var videoId = parseInt(elementId.replace("video-" + self.videoUuid + "-", ""));

        if (videoId == null || videoId < 0) {
            self.onLoadError("Something wrong with video element...");
            return;
        }

        self.currentTime(self.renderObj.contentURLs[videoId].startTime);
        self.contentTime[videoId] = self.renderObj.contentURLs[videoId].startTime;

    }

    this.onVideoReady = function() {

        var elementId = this.id;
        var videoId = parseInt(elementId.replace("video-" + self.videoUuid + "-", ""));

        if (videoId == null || videoId < 0) {
            self.onLoadError("Something wrong with video element...");
            return;
        }

        if (videoId == 0) {
            self.isVideoReady = true;
            self.onReady();
        }
    }

    this.onPlay = function() {
        console.log("onPlay");

    }

    this.onPause = function() {
        console.log("onPause");
        console.log ("currentVideo = " + self.currentVideo); 
        console.log ("self.renderObj.contentURLs.length= " + self.renderObj.contentURLs.length);
        console.log ("self.renderObj.contentURLs[self.currentVideo].endTime= " + self.renderObj.contentURLs[self.currentVideo].endTime); 
        console.log ("this.currentTime = " + self.currentTime());
        console.log ("video currentTime = " + document.getElementById("video-" + self.videoUuid + "-" + self.currentVideo).currentTime);

        var videoElement = document.getElementById("video-" + self.videoUuid + "-" + self.currentVideo);
        if (self.renderObj.contentURLs[self.currentVideo].endTime <= videoElement.currentTime) {
            console.log("Switch!");
 
            self.currentVideo++;

            console.log ("Boom." + self.currentVideo);
            if (self.currentVideo - 1 >= 0) {
                    //console.log("video being paused", self.currentVideo - 1);
                    if (self.videoObjects[self.currentVideo - 1] != null) {
                        self.videoObjects[self.currentVideo - 1].pause();
                    }
                    self.videoObjects[self.currentVideo - 1] = null;
                }
            console.log ("Hiding" + self.currentVideo);
            this.remove();
            videoElement.style.opacity = "0"; 


            if (self.renderObj.contentURLs.length > self.currentVideo) {
                console.log ("FUCK HERE." + self.currentVideo);
                var videoElement2 = document.querySelector("#video-" + self.videoUuid + "-" + self.currentVideo);
                videoElement2.style.opacity = "1";
                self.videoObjects[self.currentVideo].play();

                if (self.renderObj.contentURLs.length > self.currentVideo + 1) {
                    var content = self.renderObj.contentURLs[self.currentVideo + 1];
                    self.appendVideo(self.currentVideo + 1, content.url, content.startTime, content.endTime);
                }

            }

        }
        if (self.currentVideo == self.renderObj.contentURLs.length && (self.renderObj.contentURLs[self.currentVideo - 1].endTime*1000) - (this.currentTime()*1000) < self.transitionTime) {
            self.onVideoFinish();    
            self.loadInitialVideo();
            self.isVideoPlaying = false;
        }
    }

    this.onTimeUpdate = function() {
        //future: better support for transitions, 
        //adding support for a scrubber through the whole concat ro
        //etc.
        //fullscreen support
        //better controls
    }
}

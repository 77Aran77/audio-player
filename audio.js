var stepVolume = 0.1;

// MODEL
  function audioEngine(audioList) {
      
      // Properties
      this.audioList = $.parseJSON(JSON.stringify(audioList));
      this.audio = {};
      this.title = null;
      this.timeStep = 5;

      // Engine methods
      this.init = function() {
          var audioData = this.audioList;
          this.audio = new Audio();
          this.audio.src = audioData.file;
          this.title = audioData.title;
          this.audio.load();
          console.log("Loaded audio '" + this.title + "'");
      }

      this.play = function() {
          this.audio.play();
      }

      this.pause = function() {
          this.audio.pause();
      }

      this.stop = function() {
          this.audio.pause();
          this.audio.currentTime = 0;
      }

      this.forward = function() {
          this.audio.currentTime += this.timeStep;
      }		

      this.back = function() {
          this.audio.currentTime -= this.timeStep;
      }		

      this.volumeUp = function() {
          this.audio.volume += (this.audio.volume <= (1 - stepVolume)) ? stepVolume: null;
          this.audio.volume = this.audio.volume.toFixed(1);
      }

      this.volumeDown = function() {
          this.audio.volume -= (this.audio.volume >= stepVolume) ? stepVolume : null;
          this.audio.volume = this.audio.volume.toFixed(1);
      }
  }

// CONTROLLER
  function audioControls(audioList) {

      // Hooks
      var container = $("#audioPlayer");
      var playButton = $("#play");
      var pauseButton = $("#pause");
      var stopButton = $("#stop");
      var backButton = $("#back");
      var forwardButton = $("#forward");
      var volumeUpButton = $("#volumeUp");
      var volumeDownButton = $("#volumeDown");
      var volumeSlider = $("#volume");
      var muteButton = $("#mute");
      var positionSlider = $("#position");
      var self = this;

      // Properties
      this.engine = new audioEngine(audioList);
      this.engine.init();

      this.display = new audioDisplay(this.engine.audio, this.engine.title);

      // Interface Actions Listeners
      playButton.click(function() {
          self.engine.play();
      });

      pauseButton.click(function() {
          self.engine.pause();
      });

      stopButton.click(function() {
          self.engine.stop();
      });

      forwardButton.click(function() {
          self.engine.forward();
      });

      backButton.click(function() {
          self.engine.back();
      });

      volumeUpButton.click(function() {
          self.engine.volumeUp();
      });

      volumeDownButton.click(function() {
          self.engine.volumeDown();
      });

      muteButton.click(function() {
          self.engine.audio.muted = (self.engine.audio.muted != true) ? true : false;
      });

      volumeSlider.change(function() {
          self.engine.audio.volume = ($(this).val()/10).toFixed(1);
      });

      positionSlider.change(function() {
          self.engine.audio.currentTime = $(this).val();
      });

  }

// VIEW
  function audioDisplay(audioObject, title) {

      // Hooks
      var currentTimeShow = $("#currentTime");
      var durationShow = $("#duration");
      var positionSlider = $("#position");
      var titleAudio = $("#title");
      var volumeSlider = $("#volume");
      var self = this;

      // Properties
      this.audioObject = audioObject;
      this.title = title;

      // Events Listeners while playing
      this.audioObject.addEventListener("playing", function() {
          setInterval(function(){
              self.updatePlayer();
          }, 1000);
      });

      this.audioObject.addEventListener("loadedmetadata", function() {
          self.updatePlayer();
          self.showDuration();
          self.showTitle();
          self.setFinalPositionSlider();
      });

      this.audioObject.addEventListener("volumechange", function() {
          volumeSlider.val(self.audioObject.volume*10).val();
      });

      this.audioObject.addEventListener("ended", function() {
          self.audioObject.currentTime = 0;
      });

      // Display methods

      this.updatePlayer = function() {
          var currentTime = parseTime(self.audioObject.currentTime);
          currentTimeShow.html(currentTime);
          self.updatePositionSlider();
      }

      this.updatePositionSlider = function() {
          var currentTime = Math.round(self.audioObject.currentTime);
          positionSlider.val(currentTime).val();
      }

      this.showDuration = function() {
          var duration = parseTime(self.audioObject.duration)
          durationShow.html(duration);
      }

      this.showTitle = function() {
          titleAudio.html(self.title);
      }

      this.setFinalPositionSlider = function() {
          positionSlider.attr("max", self.audioObject.duration);
      }

      function parseTime(time) {
          var currentTime = new Date(time * 1000);
          var min = currentTime.getMinutes();
          var sec = currentTime.getSeconds();
          min = (min < 10) ? "0" + min : min;
          sec = (sec < 10) ? "0" + sec : sec;
          return  min + ':' + sec;
      }
  }
  
  $(document).ready(function() {

  // Audio Files
  var audioList = { 'file' : 'https://manzdev.github.io/codevember2017/assets/eye-tiger.mp3', 'title' : 'Slash by Other Noises' };
      // Launching!
      new audioControls(audioList);
  });

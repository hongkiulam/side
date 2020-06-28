<script>
  import { socket, call } from "../store/store.js";
  export let videoId;

  let player;
  let playerIsReady = false;
  let hasVideo = true;
  let playerState;
  // seeking
  let seeker;
  let progress;
  let duration = 0;
  let currentTime;
  let secondsPerPixel;
  let checkInterval;

  /**
   * setup youtube iframe
   */
  const onYouTubeIframeAPIReady = () => {
    player = new YT.Player("yt_player", {
      width: "",
      height: "",
      playerVars: {
        controls: 0,
        autoplay: 0
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  };

  const onPlayerReady = e => {
    // IFrame API has successfully created player
    playerIsReady = true;
  };

  const onPlayerStateChange = e => {
    if (e.data == 1) {
      duration = player.getDuration();
      const rect = seeker.getBoundingClientRect();
      secondsPerPixel = duration / rect.width;
      trackCurrentTime();
    } else {
      // stop tracking time when not playing
      clearInterval(checkInterval);
    }
    // put e.data in state for use elsewhere
    playerState = e.data;
    console.log(e.data);
  };

  // if API hasnt been called, load API
  if (!window.YT) {
    let tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";

    // function that is called once api has loaded
    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

    let firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  } else {
    // else API has already loaded, so we just initiate player instance
    setTimeout(onYouTubeIframeAPIReady, 1000);
  }

  /**
   * load new video
   */
  $: if (playerIsReady && videoId) {
    player.loadVideoById({ videoId });
    hasVideo = true;
  }

  /**
   * Receive socket event
   */
  $socket.on("youtubePlayer", ({ playerState, seekTo }) => {
    console.log(playerState, seekTo, videoId);
    // let's handle play, pause and seeking
    if (playerState == 2) {
      player.pauseVideo();
    }
    if (playerState == 1) {
      player.playVideo();
    }
    if (seekTo) {
      player.seekTo(seekTo);
    }
  });

  const handleControlClick = e => {
    if (!hasVideo || !e.target.classList.contains("controls_wrapper")) return;
    if (playerState == 1) {
      player.pauseVideo();
      $socket.emit("youtubePlayer", { playerState: 2, to: $call.user.id });
    }
    if (playerState == 2) {
      player.playVideo();
      $socket.emit("youtubePlayer", { playerState: 1, to: $call.user.id });
    }
  };

  /**
   * seeking logic
   */

  const handleSeeking = e => {
    const rect = seeker.getBoundingClientRect();
    const seekerWidth = rect.width;
    secondsPerPixel = duration / seekerWidth;
    const clickX = e.clientX - rect.left;
    progress.style.width = `${clickX}px`;
    const seekTo = clickX * secondsPerPixel;
    player.seekTo(seekTo);
    $socket.emit("youtubePlayer", { seekTo, to: $call.user.id });
  };

  const trackCurrentTime = () => {
    // update progressbar width every 100ms
    checkInterval = setInterval(() => {
      currentTime = player.getCurrentTime();
      if (currentTime > 0 && currentTime < duration) {
        progress.style.width = currentTime / secondsPerPixel + "px";
      }
    }, 100);
  };
</script>

<style>
  .yt_video {
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .controls_wrapper {
    display: flex;
    align-items: flex-end;
    width: 100%;
    height: 100%;
    position: absolute;
    background: transparent;
    transition: all 0.3s ease;
    opacity: 0;
  }
  .hasVideo:hover {
    opacity: 1;
  }
  .hasVideo:active {
    background: var(--baseGreen);
    opacity: 0.3;
  }
  .seeker {
    background: rgba(255,255,255,0.5);
    height: 10px;
    width: 100%;
    transition: all 0.3s ease;
    position: relative;
    cursor: pointer;
  }
  .seeker:hover {
    height: 20px;
  }
  .progress {
    position: absolute;
    left: 0;
    width: 0px;
    height: 100%;
    background: linear-gradient(45deg, var(--lightBlue), var(--baseGreen));
    cursor: pointer;
    transition: width 0.1s ease;
  }
</style>

<div id="yt_player" class="yt_video" />
<div class="controls_wrapper" class:hasVideo on:click={handleControlClick}>
  <div class="seeker" bind:this={seeker} on:click={handleSeeking}>
    <div class="progress" bind:this={progress} />
  </div>
</div>

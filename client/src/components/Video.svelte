<script>
  import { call, fIcons } from "../store/store.js";
  import childOutsideParent from "../utils/childOutsideParent.js";
  export let stream;
  /**
   * @type 'local' | 'remote'
   */
  export let type;

  let el; // instance of this element
  let videoWrapper;
  let isVideoOff = false;
  let isMuted = false;

  $: if (el && el.srcObject != stream && stream) {
    el.srcObject = stream;
  }
  $: if ($call.state == "disconnected" && el) {
    if (el.srcObject) {
      el.srcObject.getTracks().forEach(track => track.stop());
    }
    el.src = el.srcObject = undefined;
    el.removeAttribute("src");
    el.removeAttribute("srcObject");
  }

  // handle video dragging

  let isMouseDown = false;
  let dragPos = {
    startX: undefined,
    startY: undefined,
    incrementX: undefined,
    incrementY: undefined
  };
  const toggleMouseDown = e => {
    if (type == "local") {
      isMouseDown = !isMouseDown;
      dragPos.startX = e.clientX;
      dragPos.startY = e.clientY;
    }

    // when mouseup, reset pos of video to inside bounds
    if (!isMouseDown) {
      childOutsideParent(videoWrapper, videoWrapper.parentNode).forEach(
        bound => {
          videoWrapper.style[bound.boundingSide] =
            videoWrapper[bound.offset] + bound.resetIncrement + "px";
        }
      );
    }
  };
  const handleMouseMove = e => {
    if (isMouseDown) {
      // get incrememnt
      dragPos.incrementX = dragPos.startX - e.clientX;
      dragPos.incrementY = dragPos.startY - e.clientY;
      // set next pos values
      dragPos.startX = e.clientX;
      dragPos.startY = e.clientY;
      // style
      videoWrapper.style.left =
        videoWrapper.offsetLeft - dragPos.incrementX + "px";
      videoWrapper.style.top =
        videoWrapper.offsetTop - dragPos.incrementY + "px";
    }
  };

  const toggleVideo = () => {
    el.srcObject.getVideoTracks().forEach(v => (v.enabled = !v.enabled));
    isVideoOff = !isVideoOff;
  };
  const toggleAudio = () => {
    el.srcObject.getAudioTracks().forEach(a => (a.enabled = !a.enabled));
    isMuted = !isMuted;
  };
</script>

<style>
  .video_wrapper {
    display: flex;
    border-radius: 1em;
    overflow: hidden;
    height: min-content;
    max-height: 100%;
    position: relative;
  }
  video {
    width: 100%;
    height: min(auto, 100%);
    background: #333;
    transform: rotateY(180deg);
    pointer-events: none;
  }

  .local {
    display: flex;
    position: absolute;
    bottom: 1em;
    right: 1em;
    width: min(200px, 90%);
    z-index: 5;
    box-shadow: 0px 0px 0px 0px var(--lightBlue);
  }
  .local:active {
    cursor: grab;
    box-shadow: 0px 0px 0px 0.25em var(--lightBlue);
  }
  .local:not(:active) {
    transition: all 0.3s ease;
  }
  .remote {
    width: 100%;
    align-self: flex-start;
  }

  .controls {
    position: absolute;
    bottom: 0.5em;
    left: 50%;
    transform: translateX(-50%);
  }
  svg {
    margin: 0 0.5em;
    cursor: pointer;
    stroke: var(--offWhite);
    fill: transparent;
    width: 24px;
    height: 24px;
    transition: all 0.3s ease;
  }
  svg:hover {
    stroke: var(--lightBlue);
  }
</style>

<div
  class={`${type} video_wrapper`}
  bind:this={videoWrapper}
  on:mousedown|preventDefault={toggleMouseDown}
  on:mouseup|preventDefault={toggleMouseDown}
  on:mousemove|preventDefault={handleMouseMove}>
  <video bind:this={el} autoplay />
  {#if type == 'local'}
    <div class="controls">
      <div>
        <svg viewbox="0 0 24 24" on:click={toggleAudio}>
          {@html $fIcons[isMuted ? 'mic-off' : 'mic']}
        </svg>
        <svg viewbox="0 0 24 24" width="24" height="24" on:click={toggleVideo}>
          {@html $fIcons[isVideoOff ? 'video-off' : 'video']}
        </svg>
      </div>
    </div>
  {/if}
</div>

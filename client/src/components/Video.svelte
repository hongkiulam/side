<script>
  import { call, fIcons } from "../store/store.js";
  import { scale } from "svelte/transition";
  import childOutsideParent from "../utils/childOutsideParent.js";
  /**
   * @isDraggable
   * @controls
   * @stream
   */
  export let stream;
  export let isDraggable = false;
  export let controls = false;

  let el; // instance of this element
  let videoWrapper;
  let isVideoOff = false;
  let isMuted = false;
  let type = isDraggable ? "small" : "big";

  // initialise stream
  $: if (el && el.srcObject != stream && stream) {
    el.srcObject = stream;
  }
  // remove stream on disconnect
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
  let offset;
  let pointerOffset;
  const toggleMouseDown = e => {
    e.preventDefault();
    if (e.target.tagName != "DIV") return;
    if (isDraggable && videoWrapper == e.target) {
      const parentBounds = e.target.parentNode.getBoundingClientRect();
      const thisBounds = e.target.getBoundingClientRect();
      offset = { left: parentBounds.left, top: parentBounds.top };
      pointerOffset = {
        left: e.clientX - thisBounds.left,
        top: e.clientY - thisBounds.top
      };
      isMouseDown = !isMouseDown;
      // when mouseup, reset pos of video to inside bounds
      if (!isMouseDown) {
        document.removeEventListener("mouseup", toggleMouseDown);
        document.removeEventListener("mousemove", handleMouseMove);
        // check for outbounds
        childOutsideParent(videoWrapper, videoWrapper.parentNode).forEach(
          bound => {
            videoWrapper.style[bound.boundingSide] =
              videoWrapper[bound.offset] + bound.resetIncrement + "px";
          }
        );
      }
      if (isMouseDown) {
        document.addEventListener("mouseup", toggleMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
      }
    }
  };
  const handleMouseMove = e => {
    e.preventDefault();
    if (isMouseDown) {
      videoWrapper.style.left =
        e.clientX - offset.left - pointerOffset.left + "px";
      videoWrapper.style.top =
        e.clientY - offset.top - pointerOffset.top + "px";
    }
  };

  // TODO pause video only works for sender??? FIX VIDEO JUMPING BUG WHEN CLICK
  // handle controls
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

  .small {
    display: flex;
    position: absolute;
    bottom: 1em;
    right: 1em;
    width: min(200px, 90%);
    z-index: 5;
    box-shadow: 0px 0px 0px 0px var(--lightBlue);
  }
  .small:active {
    cursor: grab;
    box-shadow: 0px 0px 0px 0.25em var(--lightBlue);
  }
  .small:not(:active) {
    transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  }
  .big {
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
  on:mousedown={toggleMouseDown}
  in:scale>
  <video bind:this={el} autoplay />
  {#if controls}
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

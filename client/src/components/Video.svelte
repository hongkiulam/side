<script>
  import { call } from "../store/store.js";
  import childOutsideParent from "../utils/childOutsideParent.js";
  export let stream;
  /**
   * @type 'local' | 'remote'
   */
  export let type;

  let el; // instance of this element

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
      childOutsideParent(el, el.parentNode).forEach(bound => {
        el.style[bound.boundingSide] =
          el[bound.offset] + bound.resetIncrement + "px";
      });
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
      el.style.left = e.target.offsetLeft - dragPos.incrementX + "px";
      el.style.top = e.target.offsetTop - dragPos.incrementY + "px";
    }
  };
</script>

<style>
  video {
    width: 300px;
    height: auto;
    background: #333;
    transform: rotateY(180deg);
    border-radius: 1em;
  }
  .local {
    position: absolute;
    bottom: 1em;
    right: 1em;
    width: min(200px, 90%);
    z-index: 5;
  }
  .local:active {
    cursor: grab;
  }
  .local:not(:active) {
    transition: all 0.3s ease;
  }
  .remote {
    width: 100%;
    height: auto;
    align-self: flex-start;
  }
</style>

<video
  class={type}
  bind:this={el}
  autoplay
  on:mousedown={toggleMouseDown}
  on:mouseup={toggleMouseDown}
  on:mousemove|preventDefault={handleMouseMove} />

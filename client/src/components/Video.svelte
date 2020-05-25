<script>
  import { call } from "../store/store.js";
  import isChildInParent from "../utils/isChildInParent.js";
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
  };
  const handleMouseMove = e => {
    if (isMouseDown) {
      // get incrememnt
      dragPos.incrementX = dragPos.startX - e.clientX;
      dragPos.incrementY = dragPos.startY - e.clientY;
      // set next pos values
      dragPos.startX = e.clientX;
      dragPos.startY = e.clientY;
      // if (isChildInParent(el, el.parentNode)) {
      // style
      el.style.left = e.target.offsetLeft - dragPos.incrementX + "px";
      el.style.top = e.target.offsetTop - dragPos.incrementY + "px";
      // }
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
  .remote {
    width: 100%;
    height: auto;
  }
</style>

<video
  class={type}
  bind:this={el}
  autoplay
  on:mousedown={toggleMouseDown}
  on:mouseup={toggleMouseDown}
  on:mousemove|preventDefault={handleMouseMove} />

<script>
  import { call } from "../store/store.js";
  export let stream;

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
</script>

<style>
  video {
    width: 300px;
    height: 200px;
    background: #333;
    transform: rotateY(180deg);
    border-radius: 1em;
  }
</style>

<video bind:this={el} autoplay />

<script>
  import { localStream, pc, call } from "../store/store.js";
  import { fade } from "svelte/transition";
  import Video from "./Video.svelte";
  export let remoteStream;
</script>

<style>
  .videocall {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
  }
  .oncall {
    font-size: 1.5em;
    text-align: left;
  }
</style>

<div class="videocall" in:fade>
  <h2 class="oncall">
    {$call.state == 'connecting' ? 'Calling' : 'On call with'}
    {$call.user.nickName}...
  </h2>
  <Video stream={$localStream} isDraggable controls />
  <Video stream={remoteStream} />
</div>

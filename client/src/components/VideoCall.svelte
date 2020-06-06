<script>
  import { localStream, call, socket } from "../store/store.js";
  import { fade } from "svelte/transition";
  import Video from "./Video.svelte";
  export let remoteStream;

  const toggle = e => {
    const { mediaType, state } = e.detail;
    switch (mediaType) {
      case "video":
        $localStream.getVideoTracks().forEach(v => (v.enabled = state));
        $socket.emit("toggleMedia", { mediaType, state, to: $call.user.id });
        break;
      case "audio":
        $localStream.getAudioTracks().forEach(a => (a.enabled = state));
        $socket.emit("toggleMedia", { mediaType, state, to: $call.user.id });
        break;
    }
  };
  $socket.on("toggleMedia", ({ mediaType, state }) => {
    switch (mediaType) {
      case "video":
        remoteStream.getVideoTracks().forEach(v => (v.enabled = state));
        break;
      case "audio":
        remoteStream.getAudioTracks().forEach(a => (a.enabled = state));
        break;
    }
  });
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
  <Video stream={$localStream} isDraggable controls on:toggle={toggle} />
  <Video stream={remoteStream} />
</div>

<script>
  import { localStream, pc, call } from "../store/store.js";

  let localVideo;
  let remoteVideo;
  $: if ($localStream && localVideo.srcObject !== $localStream) {
    localVideo.srcObject = $localStream;
  }

  $: if ($call.state == "disconnected" && localVideo && remoteVideo) {
    const videos = [localVideo, remoteVideo];
    videos.forEach(v => {
      if (v.srcObject) {
        v.srcObject.getTracks().forEach(track => track.stop());
      }
      v.src = v.srcObject = undefined;
      v.removeAttribute("src");
      v.removeAttribute("srcObject");
    });
  }

  $: if ($pc.connectionState == "new") {
    $pc.ontrack = ({ streams: [stream] }) => {
      if (remoteVideo) {
        remoteVideo.srcObject = stream;
      }
    };
  }
  $: console.log($call);
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

<video id="localVideo" bind:this={localVideo} autoplay />
<video id="remoteVideo" bind:this={remoteVideo} autoplay />

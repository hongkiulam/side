<script>
  import { localStream, pc, call } from "../store/store.js";
  import Video from "./Video.svelte";
  let remoteStream;

  $: if ($pc.connectionState == "new") {
    $pc.ontrack = ({ streams: [stream] }) => {
      remoteStream = stream;
    };
  }
  $: console.log($call);
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

<div class="videocall">
  <h2 class="oncall">On call with {$call.user.nickName}...</h2>
  <Video stream={$localStream} type="local" />
  <Video stream={remoteStream} type="remote" />
</div>

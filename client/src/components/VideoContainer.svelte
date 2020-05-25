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

</style>

<Video stream={$localStream} />
<Video stream={remoteStream} />

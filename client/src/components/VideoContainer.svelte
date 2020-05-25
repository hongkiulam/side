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
  .container {
    background: white;
    padding: var(--paddingS);
    border-radius: 2em;
    position:relative;
  }
</style>

<div class="container">
  <Video stream={$localStream} type="local"/>
  <Video stream={remoteStream} type="remote"/>
</div>

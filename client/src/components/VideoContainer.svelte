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
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .curtain {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: inherit;
    transform-origin: left;
    transform: scaleX(0);
    z-index: 6;
  }
  .curtainOpen {
    animation: curtainOpen 1s ease;
  }
  @keyframes curtainOpen {
    0% {
      transform: scaleX(1);
      background: white;
    }
    40% {
      transform: scaleX(1);
      background: white;
    }
    100% {
      transform: scaleX(0);
      background: var(--offWhite);
    }
  }
</style>

<div class="container">
  {#if $call.state != 'disconnected'}
    <Video stream={$localStream} type="local" />
    <Video stream={remoteStream} type="remote" />
  {:else}
    <p>Click on someone's name to start a call ~</p>
  {/if}
  <div
    class="curtain"
    class:curtainOpen={$call.state != 'disconnected'} />
</div>

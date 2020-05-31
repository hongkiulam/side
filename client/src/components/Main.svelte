<script>
  import { call, pc } from "../store/store.js";
  import { fade } from "svelte/transition";
  import VideoCall from "./VideoCall.svelte";

  let animationEnded = false;
  let remoteStream;

  const toggleAnimationEnded = () => {
    animationEnded = !animationEnded;
  };

  $: if ($pc.connectionState == "new") {
    $pc.ontrack = ({ streams: [stream] }) => {
      remoteStream = stream;
    };
  }
  $: console.table({ state: $call.state, user: $call.user.nickName });
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
    width: 100%;
    height: 100%;
  }
</style>

<div class="container">
  {#if $call.state != 'disconnected'}
    {#if animationEnded}
      <VideoCall {remoteStream} />
    {/if}
  {:else}
    <p
      transition:fade
      on:outroend={toggleAnimationEnded}
      on:introend={toggleAnimationEnded}>
      Click on someone's name to start a call ~
    </p>
  {/if}
</div>

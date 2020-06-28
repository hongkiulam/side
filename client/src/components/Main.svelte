<script>
  import { call, pc, callType } from "../store/store.js";
  import { fade } from "svelte/transition";
  import VideoCall from "./VideoCall.svelte";
  import YoutubeCall from "./YoutubeCall.svelte";

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
  $: console.log("state:", $call.state, "user:", $call.user.nickName);
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
      <!-- {#if $call.state == 'disconnected'}
    {#if !animationEnded} -->
      {#if $callType == 'video'}
        <VideoCall {remoteStream} />
      {/if}
      {#if $callType == 'youtube'}
        <YoutubeCall {remoteStream} />
      {/if}
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

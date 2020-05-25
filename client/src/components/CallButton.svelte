<script>
  import {
    socket,
    nickName,
    localStream,
    call,
    pc,
    fIcons
  } from "../store/store.js";
  import getMedia from "../utils/getMedia.js";
  import makeOffer from "../utils/makeOffer.js";
  import closeVideoCall from "../utils/closeVideoCall.js";
  export let socketId;
  export let isSelf;
  export let hover;

  $: connected = $call.state == "connected" && $call.user == socketId;

  const handleClick = () => {
    if ($call.state == "disconnected") {
      callUser();
    } else {
      hangup();
    }
  };
  const callUser = async () => {
    call.set({ ...$call, user: socketId, state: "connecting" });
    await getMedia(localStream, $pc, call);
    const offer = await $pc.createOffer();
    await $pc.setLocalDescription(new RTCSessionDescription(offer));
    makeOffer($socket, socketId, offer, $nickName);
  };

  const hangup = () => {
    $socket.emit("closeVideoCall", $call.user);
    $localStream.getTracks().forEach(track => track.stop());
    closeVideoCall(call, $pc, pc);
  };
</script>

<style>
  button {
    display: grid;
    padding: var(--paddingS);
    place-items: center;
    border-radius: 50%;
    background: white;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }
  button:focus {
    outline: none;
  }

  .hover {
    background: var(--callGreen);
  }
  .connected {
    transform: rotate(-135deg);
    background: var(--callRed);
  }
  .isSelf {
    opacity: 0.5;
    pointer-events: none;
  }
  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  .phone {
    transform: rotate(-90deg);
  }
  svg {
    transition: all 0.3s ease;
  }
</style>

<button
  on:click={handleClick}
  class:connected
  class:disabled={$call.state == 'connected' && $call.user != socketId}
  class:isSelf
  class:hover>
  <svg
    viewbox="0 0 24 24"
    width="24px"
    height="24px"
    class="phone"
    stroke={hover || connected ? 'white' : 'var(--callGreen'}
    fill={hover || connected ? 'white' : 'var(--callGreen'}>

    {@html $fIcons.phone}
  </svg>
</button>

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
    background: var(--callGreen);
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
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
</style>

<button
  on:click={handleClick}
  class:connected={$call.state == 'connected' && $call.user == socketId}
  class:disabled={$call.state == 'connected' && $call.user != socketId}
  class:isSelf>
  <svg
    viewbox="0 0 24 24"
    width="24px"
    height="24px"
    class="phone"
    stroke="white"
    fill="white">

    {@html $fIcons.phone}
  </svg>
</button>

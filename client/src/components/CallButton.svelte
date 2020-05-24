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
  export let recipient;
  export let socketId;

  const handleClick = () => {
    if ($call.state == "disconnected") {
      callUser();
    } else {
      hangup();
    }
  };
  const callUser = async () => {
    if ($nickName == recipient) {
      return alert(`Can't call yourself!`);
    }
    // callConnected = true;
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
    // isAlreadyCalling = false;
    // callAccepted = false;
    // callConnected = false;
  };
</script>

<style>
  button {
    display: grid;
    padding: var(--paddingS);
    place-items: center;
    border-radius: 50%;
    background: green;
    transition: all 0.3s ease;
    border: none;
  }
  .connected {
    transform: rotate(-135deg);
    background: red;
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
  class:disabled={$call.state == 'connected' && $call.user != socketId}>
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

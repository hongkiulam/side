<script>
  import { nickName, socket, call, pc, localStream } from "./store/store.js";
  import getMedia from "./utils/getMedia.js";
  import makeAnswer from "./utils/makeAnswer.js";
  import makeOffer from "./utils/makeOffer.js";
  import closeVideoCall from "./utils/closeVideoCall.js";
  import Users from "./components/Users.svelte";
  import VideoContainer from "./components/VideoContainer.svelte";

  // get nickName
  // let nickNameFromPrompt = prompt("Enter Nickname");
  // while (nickNameFromPrompt == "") {
  //   nickNameFromPrompt = prompt("Enter Nickname");
  // }
  nickName.set(Math.random().toString());

  // join server
  $socket.emit("join", $nickName);

  // Receive offer
  $socket.on("receiveOffer", async ({ offer, from, nickName }) => {
    // if already in call, disconnect other person
    if ($call.state == "connected") {
      $socket.emit("alreadyInCall", from);
      return;
    }
    // show confirm prompt when disconnected
    let callAccepted =
      $call.state != "disconnected" ||
      confirm(`Call from ${nickName}\nAccept call?`);
    if (callAccepted) {
      if ($call.state == "connecting") {
        call.set({ ...$call, state: "connected" });
      } else {
        call.set({ ...$call, state: "connecting", user: from });
      }
      await getMedia(localStream, $pc, call);
      await $pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await $pc.createAnswer();
      await $pc.setLocalDescription(new RTCSessionDescription(answer));
      makeAnswer($socket, from, answer);
    } else {
      $socket.emit("closeVideoCall", from);
      call.set({ ...$call, state: "disconnected", user: undefined });
    }
  });
  $socket.on("receiveAnswer", async ({ answer, from }) => {
    await $pc.setRemoteDescription(new RTCSessionDescription(answer));
    if ($call.state != "connected") {
      const offer = await $pc.createOffer();
      await $pc.setLocalDescription(new RTCSessionDescription(offer));
      makeOffer($socket, from, offer, $nickName);
      call.set({ ...$call, state: "connected" });
    }
  });

  $socket.on("closeVideoCall", () => {
    closeVideoCall(call, $pc, pc);
  });
  $socket.on('otherPersonInCall',()=>{
    closeVideoCall(call,$pc,pc);
    alert('This person is already in a call!')
  })
</script>

<style>
  :global(*) {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  :global(*) {
    font-size: 16px;
  }
  :global(:root) {
    --paddingS: 0.5em;
    --padding: 1em;
  }
</style>

<svelte:head>
  <script src="https://webrtc.github.io/adapter/adapter-latest.js">

  </script>
</svelte:head>

<main>
  <h1>Side Video Chat!</h1>
  <Users />
  <VideoContainer />
</main>

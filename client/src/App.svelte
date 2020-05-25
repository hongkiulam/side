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
  nickName.set(
    Math.random()
      .toString(36)
      .substring(7)
  );
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
  $socket.on("otherPersonInCall", () => {
    closeVideoCall(call, $pc, pc);
    alert("This person is already in a call!");
  });
</script>

<style>
  :global(*) {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  :global(*) {
    font-size: 16px;
    font-family: "Cairo", sans-serif;
  }
  :global(:root) {
    --paddingS: 0.5em;
    --padding: 1em;
    --baseGreen: #5ab188;
    --darkBlue: #00717a;
    --lightBlue: #c7f1f5;
    --offWhite: #fffaf0;
    --offBlack: #383838;
    --callGreen: #4da515;
    --callRed: #a51515;
  }
  .grid {
    padding: var(--padding);
    color: #333;
    background: var(--baseGreen);
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: minmax(300px, 2fr) 10fr;
  }
  h1 {
    padding: 0 1rem;
    font-size: 2.5em;
    color: white;
  }
  .app {
    background: var(--offWhite);
    border-radius: 2.5em;
    padding: var(--paddingS);
    display: grid;
    grid-template-columns: minmax(300px, 2fr) 8fr;
    gap: var(--paddingS);
  }
</style>

<svelte:head>
  <script src="https://webrtc.github.io/adapter/adapter-latest.js">

  </script>
  <link
    href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap"
    rel="stylesheet" />
</svelte:head>

<div class="grid">
  <div class="menu">
    <h1>Side</h1>
  </div>
  <div class="app">
    <Users />
    <VideoContainer />
  </div>
</div>

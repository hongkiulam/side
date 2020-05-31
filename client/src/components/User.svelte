<script>
  import CallButton from "./CallButton.svelte";
  import { fly } from "svelte/transition";
  export let nickName;
  export let socketId;
  export let isSelf;

  let hover = false;
  const toggleHover = () => {
    hover = !hover;
  };
</script>

<style>
  .online_user {
    list-style: none;
    transition: all 0.3s ease;
    padding: var(--padding);
    border-radius: 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .online_user:hover {
    background: lightblue;
  }
  span {
    padding: var(--paddingS);
  }
</style>

<div
  class="online_user"
  on:mouseenter={toggleHover}
  on:mouseleave={toggleHover}
  in:fly={{ y: 20 }}
  out:fly={{ x: 200 }}>
  <span>{nickName}</span>
  <CallButton {socketId} {isSelf} {hover} otherNickName={nickName} />
</div>

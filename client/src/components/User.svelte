<script>
  import CallButton from "./CallButton.svelte";
  export let nickName;
  export let socketId;
  export let isSelf;
</script>

<style>
  .online_user {
    list-style: none;
    transition: all 0.3s ease;
  }
  .online_user:hover {
    background: lightblue;
  }
</style>

<div class="online_user">
  <span>{nickName}</span>
  <CallButton {socketId} {isSelf} />
</div>

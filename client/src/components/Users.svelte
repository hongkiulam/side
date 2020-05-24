<script>
  import { socket } from "../store/store.js";
  import CallButton from './CallButton.svelte';

  let members = [];
  $socket.on("newMember", allMembers => {
    members = [...allMembers];
  });
</script>

<style>
  .online_user_list{
  list-style: none;
  }
  .online_user{
    list-style: none;
  }
</style>

<h2 class="title">Online Users</h2>
<ul class="online_user_list">
  {#each members as { nickName='', socketId }}
    {#if nickName != null}
    <li class="online_user">
      {nickName}
      <CallButton recipient={nickName} socketId={socketId}/>
    </li>
    {/if}
  {/each}
</ul>

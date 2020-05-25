<script>
  import { socket, nickName } from "../store/store.js";
  import CallButton from './CallButton.svelte';

  let self = $nickName;
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
    transition:all 0.3s ease;
  }
  .online_user:hover{
    background:lightblue;
  }

</style>

<h2 class="title">Online Users</h2>
<ul class="online_user_list">
  {#each members as { nickName='', socketId }}
    {#if nickName != null && nickName != self}
    <li class="online_user" class:self={nickName == self}>
      {nickName}
      <CallButton socketId={socketId} />
    </li>
    {/if}
  {/each}
</ul>

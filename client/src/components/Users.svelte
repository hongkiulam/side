<script>
  import { socket, nickName } from "../store/store.js";
  import User from './User.svelte';
  
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
</style>

<h2 class="title">Online Users</h2>
<ul class="online_user_list">
  {#each members as { nickName='', socketId }}
    {#if nickName != null }
    <User {socketId} isSelf={nickName==self} {nickName}/>
    {/if}
  {/each}
</ul>

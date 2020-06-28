<script>
  import { socket, nickName, callType, fIcons } from "../store/store.js";
  import User from './User.svelte';

  let self = $nickName;
  let members = [];
  $socket.on("newMember", allMembers => {
    members = [...allMembers];
  });
  const toggleCallType = (type) => {
    callType.set(type);
  }

</script>

<style>
.container{
  background:white;
  padding:var(--paddingS);
  border-radius: 2em;
  position: relative;
  overflow: hidden;
}
  .online_user_list{
  list-style: none;
  }
  .title{
    padding:0 var(--paddingS);
    margin-bottom: 1em;
  }
  h2{
    font-size: 2em;
  }
  h3{
    font-size: 1.5em;
  }
  .call_type_switcher{
    display:flex;
    width:100%;
    height: 4em;
    position: relative;
  }
  .call_type_switcher.youtube .sliding_bar{
    left:50%;
  }
  .call_type{
    position: absolute;
    border:none;
    font:inherit;
    color: inherit;
    font-size: 1.3em;
    background: transparent;
    padding: var(--paddingS) 0;
    width: 50%;
    height: 100%;
    cursor: pointer;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .call_type.video{
    left: 0;
  }
  .call_type.youtube{
    right: 0;
  }
  .call_type svg{
    stroke: var(--offBlack);
    fill: transparent;
    stroke-width: 2px;
    margin-right: 5px;
  }
  .sliding_bar{
    width:50%;
    height: 100%;
    background:var(--lightBlue);
    border-radius: 1em;
    position: absolute;
    left: 0;
    transition: all 0.3s ease;
  }
  .call_type:active ~ .sliding_bar{
    background: var(--darkBlue);
  }
  /* .sliding_bar.right{
    left:50%;
  } */
</style>

<div class="container">
<h2 class="title">Side</h2>

<h3 class="title">Call Type</h3>
<div class="call_type_switcher" class:youtube={$callType == 'youtube'}>
  <button class="call_type video" on:click={()=>{toggleCallType('video')}}>
    <svg viewbox="0 0 24 24" width="24px" height="24px">{@html $fIcons.users}</svg>
    Video
  </button>
  <button class="call_type youtube" on:click={()=> {toggleCallType('youtube')}}>
    <svg viewbox="0 0 24 24" width="24px" height="24px">{@html $fIcons.youtube}</svg>
    Youtube
  </button>
  <div class='sliding_bar'></div>
</div>

<h3 class="title">Online Users</h3>
<ul class="online_user_list">
  {#each members as { nickName='', socketId }}
    {#if nickName != null }
    <User {socketId} isSelf={nickName==self} {nickName} />
    {/if}
  {/each}
</ul>
</div>

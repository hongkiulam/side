<script>
  import { createEventDispatcher } from "svelte";
  export let searchResults = [];
  // dispatch on change event
  const dispatch = createEventDispatcher();

  const selectItem = item => {
    dispatch("selectItem", item);
    searchResults = [];
  };
  document.addEventListener("keydown", e => {
    if (e.key == "Escape") {
      searchResults = [];
    }
  });
</script>

<style>
  .results {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    height: 0em;
    width: 100%;
    transition: all 0.3s ease;
    background: var(--offWhite);
    padding: 0 var(--paddingS);
    box-shadow: 0px 0px 1px var(--offBlack);
    z-index: 5;
  }
  .results.show {
    height: 35em;
    max-height: 80vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .results li {
    display: flex;
    align-items: center;
    height: 3.5em;
    padding: 0.25em 0;
    transition: all 0.3s ease;
    white-space: nowrap;
    cursor: pointer;
  }
  .results li:hover {
    background: var(--lightBlue);
  }
  .results li img {
    height: 3em;
    margin-right: 1em;
  }
  .item_wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .channel_title {
    font-size: 0.8em;
  }
  .title {
    font-weight: bold;
  }
</style>

<ul class="results" class:show={searchResults.length > 0}>
  {#each searchResults as item}
    <li
      on:click={() => {
        selectItem(item);
      }}>
      <img src={item.thumbnail.url} alt="" />
      <div class="item_wrapper">
        <span class="channel_title">{item.channelTitle}</span>
        <span class="title">{item.title}</span>
      </div>
    </li>
  {/each}
</ul>

<script>
  import { localStream, call, socket } from "../store/store.js";
  import { fade } from "svelte/transition";
  import Video from "./Video.svelte";
  import SearchResults from "./SearchResults.svelte";
  import YoutubeIFramePlayer from "./YoutubeIFramePlayer.svelte";
  export let remoteStream;

  $socket.on("toggleMedia", ({ mediaType, state }) => {
    switch (mediaType) {
      case "video":
        remoteStream.getVideoTracks().forEach(v => (v.enabled = state));
        break;
      case "audio":
        remoteStream.getAudioTracks().forEach(a => (a.enabled = state));
        break;
    }
  });

  let searchResults = [];
  let searchQuery = "";
  let ytVideoElement;
  let videoId;

  const fetchYoutube = async () => {
    if (!searchQuery) {
      searchResults = [];
      return;
    }
    let searchUrl = "https://side-server.herokuapp.com/ytsearch";
    searchUrl += `?q=${searchQuery}`;
    const search = await fetch(searchUrl);
    const result = await search.json();
    searchResults = [...result];
  };

  const selectItem = e => {
    console.log(e.detail);
    videoId = e.detail.videoId;
    $socket.emit("youtubePlayer", { videoId, to: $call.user.id });
  };

  $socket.on("youtubePlayer", data => {
    if(data.videoId){
      videoId = data.videoId;
    }
  });

  const handleInputSubmit = e => {
    if (e.key == "Enter") {
      fetchYoutube();
    }
  };

  const handleFocus = () => {
    if (searchQuery) {
      // show previous search results again
      searchResults = [...searchResults];
    }
  };
</script>

<style>
  .youtubecall {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
  }
  .oncall {
    font-size: 1.5em;
    text-align: left;
  }
  .search_box {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
  }
  .search {
    flex: 1;
    padding: var(--paddingS);
    border: none;
    border-bottom: 1px solid var(--offBlack);
  }

  .yt_video_wrapper {
    margin-top: 1em;
    width: 100%;
    height: 0;
    padding-bottom: calc(100% * 9 / 16);
    position: relative;
    background: #333;
    border-radius: 1em;
    overflow: hidden;
  }
</style>

<div class="youtubecall" in:fade>
  <h2 class="oncall">
    {$call.state == 'connecting' ? 'Calling' : 'On call with'}
    {$call.user.nickName}...
  </h2>
  <div class="search_box">
    <input
      type="text"
      class="search"
      id="search"
      placeholder="Search for videos..."
      bind:value={searchQuery}
      on:keydown={handleInputSubmit}
      on:focus={handleFocus} />
    <SearchResults {searchResults} on:selectItem={selectItem} />
  </div>
  <div class="yt_video_wrapper">
    <YoutubeIFramePlayer {videoId} />
  </div>
  <Video stream={remoteStream} isDraggable />
</div>

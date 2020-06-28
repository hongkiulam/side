<script>
  import { fly, slide } from "svelte/transition";
</script>

<style>
  .landing {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    background: linear-gradient(
      135deg,
      var(--baseGreen) 20%,
      var(--lightBlue) 150%
    );
    z-index: 2000;
  }
  .landing_content {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
  }
  h1 {
    padding: 0 1rem;
    font-size: 2.5em;
  }
  .loader {
    width: 200px;
    height: 3px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .bar {
    position: absolute;
    top: 0;
    left: 0;
    background: var(--lightBlue);
    width: 100%;
    height: 100%;
    animation: loadingbar 1.7s cubic-bezier(0.76, 0.04, 1, 1) infinite;
  }
  @keyframes loadingbar {
    0% {
      left: -100%;
    }
    50% {
      left: 100%;
    }
    100% {
      left: -100%;
    }
  }
</style>

<div class="landing" transition:slide={{ delay: 500 }}>
  <div class="landing_content" transition:fly={{ duration: 300 }}>
    <h1>Side Video Chat</h1>
    <span>Connecting to server...</span>
    <div class="loader">
      <div class="bar" />
    </div>
  </div>
</div>

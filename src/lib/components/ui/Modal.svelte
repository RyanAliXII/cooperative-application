<script lang="ts">
  export let isOpen = false;
  export let modalBoxClass = "";
  export let style = "";
  export let close: () => void;
  const handleOnClickSelf = (event: Event) => {
    const clickedElement = event.target as HTMLDivElement;
    if (clickedElement.classList.contains("modal")) {
      close();
    }
  };
</script>

<div
  class="modal flex flex-col"
  class:modal-open={isOpen}
  role={"dialog"}
  on:click={handleOnClickSelf}
>
  <slot name="backdrop" />
  <div class={"modal-box " + modalBoxClass} {style}>
    <slot />
  </div>
</div>

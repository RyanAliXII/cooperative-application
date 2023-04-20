<script lang="ts">
    export let isOpen = false
    export let modalBoxClass = ""
    export let close:()=>void;
    const handleOnClickSelf = (event: Event)=>{
         const clickedElement = event.target as HTMLDivElement
         if(clickedElement.classList.contains("modal")){
                 close()
            }
         
    }
</script>
<div class="modal" class:modal-open={isOpen}  role={"dialog"} on:click={handleOnClickSelf}>

  <div class={'modal-box ' + modalBoxClass}>

    <slot/>
  </div>
</div>

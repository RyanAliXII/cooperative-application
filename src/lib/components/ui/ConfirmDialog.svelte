<script lang="ts">
    import Modal from "./Modal.svelte";
    export let isOpen:boolean;
    export let close: ()=>void;
    export let onConfirm: ()=>void
    export let title = ""
    export let text = ""
    export let cancelBtnText= "Cancel"
    export let confirmBtnText = "Yes, Delete it!"
    export let type: "info" |"error" = "error"
</script>

<Modal isOpen={isOpen} close={close} >
    <h3 class="font-bold text-xl">
        {#if type === "error"}
            <i class="fa-solid fa-circle-exclamation text-error"></i> 
        {/if}
        {#if type === "info"}
         <i class="fa-solid fa-circle-info text-info"></i>
         {/if}
        {title}</h3>
    <p class="py-4">{text}</p>
    <div class="modal-action">
      <button class="btn btn-outline" type="button" on:click={close}>{cancelBtnText}</button>
      <button class="btn" class:btn-error={type === "error"} class:btn-info={type==="info"} type="button" on:click={onConfirm}>{confirmBtnText}</button>
    </div>
  
</Modal>
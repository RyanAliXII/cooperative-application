<script>
    export let isOpen = false
    export let modalId = ""
    export let modalBoxClass = ""
</script>
<div class="modal" class:modal-open={isOpen} on:click|self={()=>isOpen = false} role="presentation">
  <div class={'modal-box ' + modalBoxClass}>
    <slot/>
  </div>
</div>

<script>
 export let value = "";   
  export let error = "";
  export let label = ""
  export let labelFor = ""
</script>

<div class="form-control">
    <label class="label" for={labelFor}>
      <span class="label-text">{label}</span>
    </label>
    <textarea class="{(error ? 'textarea-error ' : '') + 'textarea textarea-bordered h-24'}"  bind:value={value} {...$$restProps}></textarea>

    {#if error }
      <small class="text-error ml-1 mt-1">{error}</small>
    {/if}
 
</div>
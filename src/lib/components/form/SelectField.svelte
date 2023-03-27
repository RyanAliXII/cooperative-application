<script>
    export let value = "";   
     export let error = "";
     export let label = ""
     export let labelFor = ""
   </script>

<div class="form-control w-full">
    <label class="label" for={labelFor}>
      <span class="label-text">{label}</span>
    </label>
    <select class="{(error ? 'select-error ' : '') + 'select select-bordered'}" name="province" bind:value={value} {...$$restProps}>
        <slot/>
    </select>
    {#if error }
    <small class="text-error ml-1 mt-1">{error}</small>
    {/if}
   
 </div>
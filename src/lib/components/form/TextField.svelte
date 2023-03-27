<script lang="ts">
  export let value = "";
  export let error = "";
  export let label = ""
  export let labelFor = ""


</script>

<div class="form-control w-full ">

    <label class="label" for={labelFor}>
      <span class="label-text">{label}</span>
    </label>
    <input type="text" name="name" class="{(error ? 'input-error ' : '')  + 'input input-bordered w-full'}" bind:value={value} on:keyup {...$$restProps}  />
    {#if error }
    <small class="text-error ml-1 mt-1">{error}</small>
    {/if}
   
  </div>
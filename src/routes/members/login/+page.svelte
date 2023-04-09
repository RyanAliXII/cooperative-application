<script>
    export let form;

   
</script>

<div class="w-full h-screen flex items-center flex-col justify-center gap-2" >

  <div class="h-96 w-96 border border-1px rounded flex justify-center items-center">
      
      <form class="w-full px-3" method="POST" action="?/login">
      <h1 class="text-3xl text-center mb-2">Sign In</h1>
      <div class="form-control w-full">
          <label class="label" for="email">
            <span class="label-text">Email</span>
          </label>
          <input type="email" placeholder="Your email" name="email"  class="input input-bordered w-full " required />
     
        </div>
        <div class="form-control w-full">
          <label class="label" for="password">
            <span class="label-text">Password</span>
          </label>
          <input type="password" placeholder="Your password" name="password" class="input input-bordered w-full "  required/>
        </div>
        {#if form?.message && form?.error }
        <div class="alert alert-error mt-5 ">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6 text-base-100" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span class="text-base-100">{form?.message}</span>
            </div>
        </div>  
        {/if}
        {#if form?.message && form?.info }
        <div class="alert alert-info shadow-lg mt-5 text-white">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>{form.message}</span>
          </div>
        </div>
        
        {/if}
        <!-- <a href="/password" class="text-sm mt-1 block text-secondary">Forgot password?</a> -->
      <button type="submit"  class="btn btn-primary mt-5">
             Sign In
  </button>
  </form>
  </div>

</div>
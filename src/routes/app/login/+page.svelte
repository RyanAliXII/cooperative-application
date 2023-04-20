<script>

    import logo from "$lib/assets/images/ccdco-logo.png"

    export let form;
 
</script>

<div class="  w-full h-screen flex items-center flex-col justify-center gap-2 bg-gray-50">

  <div class="bg-base-100 shadow w-11/12 lg:w-3/12  rounded flex justify-center items-center " style=" height: 40rem;">

    <div class="basis-full  flex justify-center px-5 ">
      <form class="w-full" method="POST" action="?/login">
       <div class="flex justify-center">
        <img class="w-28 h-28 lg:w-32 lg:h-32" src={logo} alt="ccdco-logo">
      </div>
      <h1 class="text-3xl lg:text-4xl  mb-2 text-center font-semibold mt-2">Sign In</h1>
      <p class="text-gray-400 text-center ">Sign in and manage cooperatives in the Caloocan City</p>
      
      <div class="form-control w-full mt-4">
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
        {#if form?.message }
        <div class="alert alert-error mt-5 ">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6 text-base-100" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span class="text-base-100">{form?.message}</span>
            </div>
        </div>  
        {/if}
        <!-- <a href="/cooperative/password" class="text-sm mt-1 block text-secondary">Forgot password?</a> -->
      <button type="submit"  class="btn btn-primary mt-5 w-full text-white">
             Sign In
  </button>
  </form>
</div>
  </div>

</div>

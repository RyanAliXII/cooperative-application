
<script lang="ts">
  import axios from 'axios';
   import 'sweetalert2/src/sweetalert2.scss' 
    let sidebarState:Record<string, boolean> = {
        registration: false,
        loan: false,
        rewards: false
    }
    function toggle (sidebarKey: string){
        sidebarState[sidebarKey] = !sidebarState[sidebarKey]
    }
    const logout = async()=>{
      await axios.delete("/api/logout")
      location.reload()
    }
</script>
  <main>
    <header class="navbar bg-base-100">
        <div class="flex-none">
          <button class="btn btn-square btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
        <div class="flex-1">
          <a href="/" class="btn btn-ghost normal-case text-xl">CCDCO</a>
        </div>
        <div class="flex-none">
          <button class="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
          </button>
        </div>
      </header>

      <div class="w-full flex" style="min-height: 100vh;">
        <div class="h-full  bg-white hidden lg:block">
            <ul class="menu bg-base-100 w-64 p-2 rounded-box">
                <li>
                  <a href="/app/dashboard">
                    <i class="fa-solid fa-chart-line"></i>
                    Dashboard
                  </a>
                </li>
                <li>
                    <small class="hover:bg-white text-xs">Application</small>
                    <button type="button" on:click={()=>{toggle("registration")}}>
                            <i class="fa-solid fa-briefcase"></i>
                            Registration
                    </button>
                    {#if sidebarState["registration"] }
                    <div class="pl-10 mt-1 text-sm hover:bg-white">
                        <a href="/app/cooperatives/register" >
                            Add Cooperative
                          </a>
                    </div>
           
                    <div class="pl-10 text-sm hover:bg-white">
                        <a href="/app/cooperatives/" >
                            Cooperative
                          </a>
                    </div>
               
             
                    {/if}

                    
                 
                </li>
                <li>
          
                  <button type="button" on:click={()=>{toggle("rewards")}}>
                          <i class="fa-solid fa-briefcase"></i>
                          Rewards and Recognition
                  </button>
                  {#if sidebarState["rewards"] }
                  <div class="pl-10 mt-1 text-sm hover:bg-white">
                      <a href="/app/rewards" >
                          Rewards
                        </a>
                  </div>
                  <div class="pl-10 text-sm hover:bg-white">
                    <a href="/app/rewards/assign" >
                        Assign Rewards
                      </a>
                </div>
                  <div class="pl-10 mt-1 text-sm hover:bg-white">
                    <a href="/app/recognitions" >
                        Recognitions
                      </a>
                </div>
         
                  
             
           
                  {/if}

                  
               
              </li>
              <li>
              
                <button type="submit" on:click={()=>{logout()}}>
                  <i class="fa-solid fa-right-from-bracket"></i>
                  Sign Out
                </button>
  
              </li>

              </ul>
        </div>
        <div class="w-full bg-gray-100 p-5">
            <slot/>
        </div>
      </div>
  </main>

  
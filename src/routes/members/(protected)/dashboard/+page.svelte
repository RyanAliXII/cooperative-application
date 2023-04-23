<script lang="ts">
    import { MONETARY } from "$lib/internal/config.js";

     export let data;
    
 
</script>

<div class="container  w-full  rounded mt-5  ">
   <div class="container w-full  rounded mb-8 flex flex-col gap-5 lg:flex-row">
 
   
       <div class="basis-6/12 h-full bg-base-100  flex items-center justify-center flex-col text-secondary gap-3 p-3 rounded">
           <i class="fa-solid fa-piggy-bank text-2xl"></i>
         <h2 class="text-3xl font-bold">PHP {data.stat.shares.toLocaleString(undefined, MONETARY)}</h2>
         <p>Savings</p>
       </div>
       <div class="basis-6/12 h-full bg-base-100  flex items-center justify-center flex-col text-amber-500 gap-3 p-3 rounded">
           <i class="fa-solid fa-piggy-bank text-2xl"></i>
         <h2 class="text-3xl font-bold">PHP {data.stat.savings.toLocaleString(undefined, MONETARY)}</h2>
         <p>Shares</p>
       </div>
    
   </div>

</div>
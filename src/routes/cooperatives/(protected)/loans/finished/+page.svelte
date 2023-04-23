<script lang="ts">
  
    import { MONETARY } from '$lib/internal/config.js';
     
      export let data;
    
  </script>
  
  <div>
          <h1 class="text-lg font-semibold mb-3 ml-1 text-gray-500">Finished Loans</h1>


     <div class="container bg-base-100 w-full  p-3 rounded mb-8 h-56 flex">
  
      <div class="basis-1/2 h-full  flex items-center justify-center flex-col text-success gap-2">
        <i class="fa-solid fa-briefcase text-2xl"></i>
        <h2 class="text-3xl font-bold">PHP {data.total.principal.toLocaleString(undefined, MONETARY)}</h2>
       <p>Total Finished Loans</p>
      </div>
      <div class="basis-1/2 h-full  flex items-center justify-center flex-col text-secondary gap-2">
        <i class="fa-solid fa-chart-pie text-2xl"></i>
        <h2 class="text-3xl font-bold">PHP {data.total.interest.toLocaleString(undefined, MONETARY)}</h2>
        <p>Total Interest</p>
      </div>
      <div class="basis-1/2 h-full  flex items-center justify-center flex-col text-neutral gap-2">
        <i class="fa-solid fa-money-bill-trend-up text-2xl"></i>
        <h2 class="text-3xl font-bold">PHP {(data.total.interest + data.total.principal).toLocaleString(undefined, MONETARY)}</h2>
        <p>Total Due</p>
      </div>
     </div>
      <div class="container bg-base-100 w-full  p-3 rounded mb-8 flex">
          <div class="overflow-x-auto w-full">
              <table class="table w-full">
                <!-- head -->
                <thead>
                  <tr>
                    <th>Created On</th>
                    <th>Member</th>
                    <th>Principal</th>
                    <th>Total Due</th>

                    <th>Interest</th>
                  </tr>
                </thead>
                <tbody>
                {#each data.loans as loan}
                  <tr>
                      <td>{new Date(loan.createdAt).toLocaleString()}</td>
                     <td>{loan.member?.givenName} {loan.member?.surname}</td>
               
                     <td>{loan.principal.toLocaleString(undefined, MONETARY)}</td>
                     <td>{loan.totalDue.toLocaleString(undefined, MONETARY)}</td>
                     <td>{ (((loan?.interest ?? 0) / (loan?.principal ?? 0)) * 100)}%</td>
                
                  </tr>
                {/each
  
                }
                </tbody>
              </table>
            </div>
      </div>
  </div>
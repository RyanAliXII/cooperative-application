<script lang="ts">
  import type { CooperativeStats, LiquidityLog, SavingLog, ShareLog } from "$lib/definitions/types";

  
    import { MONETARY } from "$lib/internal/config.js";

     export let shareLogs:ShareLog[] = [];
     export let stat:CooperativeStats;
     export let liquidityLogs: LiquidityLog[] = []
     export let savingLogs:SavingLog[] = []
     import {onMount, onDestroy} from "svelte"
       let overviewChart:any;
       let comparisonChart:any 
       onMount(async()=>{
           let ApexCharts = (await import("apexcharts")).default
               const comparisonChartOptions = {
               
                   chart: {
                       height:"450px",
                       type: 'line',
                 
                   },
                   colors:["#6366f1", "#f59e0b", "#a855f7"],
                   legend: {
                       show: true
                   },
                   series: [{
                       name: 'Shares',
                       data: shareLogs.map((s)=>[new Date(s.createdAt).getTime(), s.value])
                   },
                   {
                       name:'Savings',
                       data: savingLogs.map((l)=>[new Date(l.createdAt).getTime(), l.value])
                   },
                   {
                       name:'Liquidity',
                       data: liquidityLogs.map((l)=>[new Date(l.createdAt).getTime(), l.value])
                   }
                 
               ],
                   xaxis:{
                       labels:{
                           show:true,
                           formatter:(val: string)=>new Date(val).toLocaleString()
                       }
                   },
             
            }
 
            comparisonChart = new ApexCharts(document.querySelector("#comparisonChart"), comparisonChartOptions);
            comparisonChart.render()
            
            const assets = stat.assets
          
            const overviewCharSeriesData = [
                {
                   value: stat.shares,
                   valueInPercentage: (stat.shares/ assets) * 100
               },
                {
                   value: stat.savings,
                   valueInPercentage: (stat.savings/ assets) * 100
               },
            
               {
                   value: stat.loan,
                   valueInPercentage: (stat.loan/ assets) * 100
               },
              
               {
                   value: stat.loanInterest,
                   valueInPercentage: (stat.loanInterest/ assets) * 100
               },
             
               {
                   value: stat.registrationFees,
                   valueInPercentage: (stat.registrationFees/ assets) * 100
               }
            ] 
            const overviewChartOptions = {
                   series: overviewCharSeriesData.map((d)=>d.valueInPercentage),
                   labels:["Loan", "Shares", "Loan Interest", "Savings", "Registration Fees"],
                   chart: {
                   type: 'donut',
                   height:"500px",
                
                   },
                   
                   tooltip: {
                       
                       y: {
                           formatter: function(value:any, data:any, dataIndex:any) {
                               return  overviewCharSeriesData[data.seriesIndex].value
                           }
                       }
                   },
                    legend:{
                           position:"bottom"
                   },
                  
               
                   };
                   overviewChart = new ApexCharts(document.querySelector("#overviewChart"), overviewChartOptions);
                   overviewChart.render();
               

                  
           })
           onDestroy(()=>{
            overviewChart?.destroy()
            comparisonChart?.destroy()
           })
</script>
<div class="container w-full  rounded mb-8 flex flex-col gap-5 lg:flex-row mt-10">
  
    <div class="basis-4/12 h-full bg-base-100 flex items-center justify-center flex-col text-success gap-3 p-3 rounded">
        <i class="fa-solid fa-users text-2xl"></i>
      <h2 class="text-3xl font-bold">{stat.members}</h2>
     <p>Members</p>
    </div>
    <div class="basis-4/12 h-full bg-base-100  flex items-center justify-center flex-col text-secondary gap-3 p-3 rounded">
        <i class="fa-solid fa-piggy-bank text-2xl"></i>
      <h2 class="text-3xl font-bold">PHP {stat.savings.toLocaleString(undefined, MONETARY)}</h2>
      <p>Savings</p>
    </div>
    <div class="basis-4/12 h-full bg-base-100  flex items-center justify-center flex-col text-amber-500 gap-3 p-3 rounded">
        <i class="fa-solid fa-money-bill-transfer"></i>
        <h2 class="text-3xl font-bold">PHP {stat.shares.toLocaleString(undefined, MONETARY)}</h2>
        <p>Shares</p>
    </div>
    <div class="basis-4/12 h-full bg-base-100  flex items-center justify-center flex-col text-indigo-500 gap-3 p-3 rounded">
        <i class="fa-solid fa-money-bill-transfer"></i>
        <h2 class="text-3xl font-bold">PHP {stat.liquidity.toLocaleString(undefined, MONETARY)}</h2>
        <p>Liquidity</p>
    </div>
</div>

<div class="flex flex-col lg:flex-row gap-5">
<div class="bg-base-100 flex items-center justify-center flex-col basis-3/12 p-5 rounded ">
    <h2 class="text-lg font-semibold mb-5 text-center ">Overview</h2>
     <div id="overviewChart"></div>
</div>


<div class="bg-base-100 pt-5 basis-9/12 rounded">
    <h2 class="text-lg font-semibold mb-5 text-center ">Comparison</h2>
    <div id="comparisonChart">
</div>
</div>



</div>
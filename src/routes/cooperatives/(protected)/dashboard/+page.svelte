<script lang="ts">

    export let data;
      import {onMount} from "svelte"
    
        onMount(async()=>{
            let ApexCharts = (await import("apexcharts")).default
                const comparisonChartOptions = {
                
                    chart: {
                        height:"450px",
                        type: 'line',
                  
                    },
                    legend: {
                        show: true
                    },
                    series: [{
                        name: 'Shares',
                        data: data.shares.logs.map((s)=>[new Date(s.createdAt).getTime(), s.value])
                    },
                    {
                        name:'Savings',
                        data: data?.savings?.logs.map((l)=>[new Date(l.createdAt).getTime(), l.value])
                    }
                  
                ],
                    xaxis:{
                        labels:{
                            show:true,
                            formatter:(val: string)=>new Date(val).toLocaleString()
                        }
                    }
                  
            }
  
             const comparisonChart = new ApexCharts(document.querySelector("#comparisonChart"), comparisonChartOptions);
             comparisonChart.render()
             
             const assets = data.stat.assets
           
             const overviewCharSeriesData = [
                {
                    value: data.stat.loan,
                    valueInPercentage: (data.stat.loan/ assets) * 100
                },
                {
                    value: data.stat.shares,
                    valueInPercentage: (data.stat.shares/ assets) * 100
                },
                {
                    value: data.stat.loanInterest,
                    valueInPercentage: (data.stat.loanInterest/ assets) * 100
                },
                {
                    value: data.stat.savings,
                    valueInPercentage: (data.stat.savings/ assets) * 100
                },
                {
                    value: data.stat.registrationFees,
                    valueInPercentage: (data.stat.registrationFees/ assets) * 100
                }
             ] 
             const overviewChartOptions = {
                    series: overviewCharSeriesData.map((d)=>d.valueInPercentage),
                    labels:["Loan", "Shares", "Loan Interest", "Savings", "Registration Fees"],
                    chart: {
                    type: 'donut',
                    height:"500px",
                    width:"450px"
                    },
                   
                    tooltip: {
                        
                        y: {
                            formatter: function(value:any, data:any, dataIndex:any) {
                                return  overviewCharSeriesData[data.seriesIndex].value
                            }
                        }
                        }
                
                    };
                    const overviewChart = new ApexCharts(document.querySelector("#overviewChart"), overviewChartOptions);
                    overviewChart.render();
                
            })
</script>

<div class="container  w-full  p-3 rounded">
<div class="flex gap-5">
    <div class="bg-base-100 flex items-center justify-center flex-col">
        <h2 class="text-lg font-semibold mb-5 text-center ">Overview</h2>
         <div id="overviewChart"></div>
    </div>

  
    <div class="bg-base-100 pt-5 basis-9/12 ">
        <h2 class="text-lg font-semibold mb-5 text-center ">Comparison</h2>
        <div id="comparisonChart">
    </div>
</div>
  
  
 
</div>
</div>
<script lang="ts">

    export let data;
      import {onMount} from "svelte"
     

        onMount(async()=>{
          
            let ApexCharts = (await import("apexcharts")).default
                const options = {
                
                    chart: {
                        height:"380px",
                        type: 'line',
                  
                    },
                    legend: {
                        show: true
                    },
                    series: [{
                        name: 'Shares',
                        data: data.shares.logs.map((s)=>[new Date(s.createdAt).getTime(), s.value])
                    },
                  
                ],
                    xaxis:{
                        labels:{
                            show:true,
                            formatter:(val: string)=>new Date(val).toLocaleString()
                        }
                    }
                  
            }
  
             var chart = new ApexCharts(document.querySelector("#chart"), options);
             chart.render()

                
        })


      
       
      
</script>

<div class="container bg-base-100 w-full  p-3 rounded">
    <div id="chart">
    </div>
</div>
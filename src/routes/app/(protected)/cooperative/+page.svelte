

<script>
      /** @type {import('./$types').PageData} */
      export let data
      
</script>

<h1 class="text-lg font-semibold mb-3 text-gray-500">Cooperatives</h1>
<div class="container bg-base-100 w-full  p-3 rounded">

    <div class="overflow-x-auto">
        <table class="table w-full">
          <!-- head -->
          <thead>
            <tr>
              <th>Cooperative name</th>
              <th>Registration number</th>
              <th>Initials</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            {#each data.coops as coop }
             <tr>
            
                <td>{coop?.name}</td>
                <td>{coop?.registrationNumber}</td>
                <td>{coop?.initials}</td>
                <td><button class="btn btn-outline btn-info"><i class="fa-solid fa-pen-to-square"></i></button></td>
              </tr>
            {/each}
         
            <!-- row 2 -->
          
          </tbody>
        </table>
      </div>
</div>


    
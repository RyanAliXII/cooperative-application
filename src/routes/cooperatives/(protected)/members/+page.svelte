
<script>
    export  let data 
</script>

<div>
  
    <h1 class="text-lg font-semibold mb-3 text-gray-500">Cooperative Members</h1>
    <div class="container bg-base-100 w-full  p-3 rounded">
        <div class="overflow-x-auto">
            <table class="table w-full">
              <!-- head -->
              <thead>
                <tr>
                  <th>Given name</th>
                  <th>Middle name</th>
                  <th>Surname</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {#each data.members as member }
                <tr>
                    <td>
                        {member.givenName}
                    </td>
                    <td>
                        {member.middleName}
                    </td>
                    <td>
                        {member.surname}
                    </td>
                   
                    <td><a href="/cooperatives/members/view/{member.id}" class="btn btn-outline btn-info"><i class="fa-regular fa-eye"></i></a></td>
                    
              
                 </tr>
               {/each}
              
              </tbody>
            </table>
          </div>
      </div>
</div>
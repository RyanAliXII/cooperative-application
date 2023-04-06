
<script lang="ts">
  import type { MemberAccount } from "$lib/definitions/types";
  import axios from "axios";
  import toast from "svelte-french-toast";
  import { each } from "svelte/internal";
 
    export let data;
    console.log(data)
    const approve = async(account :  MemberAccount)=>{
        try{
            const response = await axios.patch(`/api/cooperatives/${account.member.cooperativeId}/members/accounts/${account.id}`, {
                approved:true,
                declined: false,
            })
            toast.success("Account has been apprroved")
        }
        catch(error){
          console.log(error)
          toast.error("Unknown error occured.")
        }

    }
</script>

<div>
  
    <h1 class="text-lg font-semibold mb-3 text-gray-500">Online Registration</h1>
    <div class="container bg-base-100 w-full  p-3 rounded">
        <div class="overflow-x-auto">
            <table class="table w-full">
              <!-- head -->
              <thead>
                <tr>
                  <th>Given name</th>
                  <th>Surname</th>
                  <th>Date of Birth</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {#each data.accounts  as account }
                <tr >
                    <td>
                        {account.givenName}
                    </td>
                    <td>
                        {account.surname}
                    </td>
                    <td>
                        {account.member.birthday}
                    </td>
                    <td>
                        <button class="btn btn-success btn-outline" on:click={()=>{approve(account)}}>Approve</button>
                        <button class="btn btn-error btn-outline">Decline</button>
                    </td>
                </tr>
                {/each}
             
              </tbody>
            </table>
          </div>
      </div>
</div>
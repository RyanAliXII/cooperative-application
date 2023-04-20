
<script lang="ts">
  import type { MemberAccount } from "$lib/definitions/types";
  import axios from "axios";
  import toast, {Toaster} from "svelte-french-toast";

 
    export let data;

   
    let accounts: MemberAccount[] = data?.accounts
    const approve = async(account :  MemberAccount)=>{
        try{
          await axios.patch(`/api/members/${account.member.id}`, {
                approved:true,
                declined: false,
            })
            toast.success("Account has been apprroved")
            fetchUnapprovedMembers()
        }
        catch(error){
          console.log(error)
          toast.error("Unknown error occured.")
        }

    }
    const fetchUnapprovedMembers = async()=>{
      const response = await axios.get("/api/members/accounts/unapproved")
      const {data} =  response.data
      accounts = data?.members ?? []
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
                {#each accounts  as account }
                <tr >
                    <td>
                        {account.member.givenName}
                    </td>
                    <td>
                        {account.member.surname}
                    </td>
                    <td>
                        {account.member.birthday}
                    </td>
                    <td>
                        <button class="btn btn-success btn-outline" on:click={()=>{approve(account)}}>Approve</button>
                        <button class="btn btn-error btn-outline" on:click={()=>{fetchUnapprovedMembers()}}>Decline</button>
                    </td>
                </tr>
                {/each}
             
              </tbody>
            </table>
          </div>
      </div>
</div>
<Toaster/>
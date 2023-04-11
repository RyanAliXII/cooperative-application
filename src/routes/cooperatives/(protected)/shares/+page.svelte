  <script lang="ts">
  import TextAreaField from "$lib/components/form/TextAreaField.svelte";
  import TextField from "$lib/components/form/TextField.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import type { Member } from "$lib/definitions/types";
  import {createForm} from "felte"
  import axios from "axios";
  import {validator} from "@felte/validator-yup"
  import { AddSharesSchemaValidation } from "$lib/definitions/schema";
  import toast, { Toaster } from "svelte-french-toast";

  let isModalOpen = false;
  let isSearchResultOpen = false
  let timer:NodeJS.Timeout;
  let members:Member[] = []


  const handleInput = (event: Event)=>{
    const val = (event.target as HTMLInputElement)?.value;
    if(val.length === 0){
        isSearchResultOpen = false
        return 
    }
    //debounce
    clearTimeout(timer)
    timer = setTimeout(()=>{
        searchMembers(val)
    }, 500)
  }
  const searchMembers = async(query: string)=>{
    const response = await axios.get(`/api/members?q=${query}`)
    const {data} = response.data
    members = data?.members ?? []
   isSearchResultOpen = true;
  }
  const handleInputBlur = (e: FocusEvent)=>{
   
    // isSearchResultOpen = false
  }

  let selectedMember:Member | null;
  const {form, data, errors, reset} = createForm({
    initialValues:{
        memberId:0,
        amount: 0,
        remarks:""
    },
    extend: validator({schema: AddSharesSchemaValidation, castValues: true, level: "error"}),
    onSubmit: async(body)=>{
        try{
             await axios.post("/api/shares", body)
             toast.success("Shares has been added successfully.")
        }
        catch{
          toast.error("Unkwown error occured, Please try again later.")
        }
        finally{
          selectedMember = null
          isModalOpen = false
          reset()
        }
    }
  })
  const handleSearchResultSelection = (member: Member)=>{ 

    data.update((prev)=>{
        prev.memberId = member.id ?? 0;
        return prev
    })
    
    selectedMember = member
    isSearchResultOpen = false
  }

  const removeSelectedMember = ()=>{
    selectedMember = null
    data.update((prev)=>{
        prev.memberId =0;
        return prev
    })
  }

  </script>
  <div>
    <h1 class="text-lg font-semibold mb-3 ml-1 text-gray-500">Shares</h1>
    <div class="container bg-base-100 w-full  p-3 rounded">
        <button class="btn modal-button btn-primary mb-3 text-white" on:click={()=>{isModalOpen = true}}>Add Shares</button>
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
                <!-- {#each data.members as member }
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
               {/each} -->
              
              </tbody>
            </table>
          </div>


      </div>

</div>


<Modal modalId="add-shares-modal" isOpen={isModalOpen} modalBoxClass={"w-11/12 max-w-5xl"}>
    <h3 class="font-bold text-lg">Add Shares</h3>
        <form use:form>
            {#if  selectedMember}
            <div class="flex mt-3 gap-2 w-full bg-white shadow-sm p-5 border">
                <div>
                    <img src="https://api.dicebear.com/6.x/initials/svg?seed={selectedMember?.givenName} {selectedMember?.surname}&backgroundColor=EB7C2A" alt="avatar" class="w-10 rounded-full">

                </div>
                <div class="flex flex-col justify-center">
                <span class="font-bold">{selectedMember?.givenName} {selectedMember?.surname}</span>
                <small class="text-gray-400">{selectedMember?.id}</small>
                </div>
                <div class="text-error cursor-pointer flex items-center flex-1 justify-end gap-0.5" on:click={removeSelectedMember} role={"button"}>
              
                        <i class="fa-solid fa-xmark text-lg"></i> Remove
                 
                 
                </div>
            </div> 
            {:else} 
            <TextField label="Search member by name"  on:input={handleInput} on:blur={handleInputBlur} error={$errors?.memberId?.[0]}/>
            {/if}
             
                
                <div class="relative">
                    <div class="bg-base-100  w-full h-4 absolute rounded shadow mt-1 overflow-y-scroll" class:hidden="{!isSearchResultOpen}" style="min-height: 200px;"  >
                        <ul class="list-none" >
                                {#each members as member }
                                    <li class="cursor-pointer py-3 px-2 flex items-center gap-2 border border-b" on:click={()=>{handleSearchResultSelection(member)}} role={"button"}>
                                        <div>
                                            <img src="https://api.dicebear.com/6.x/initials/svg?seed={member.givenName} {member.surname}&backgroundColor=EB7C2A" alt="avatar" class="w-10 rounded-full">

                                        </div>
                                        <div class="flex flex-col justify-center">
                                        <span class="font-bold">{member.givenName} {member.surname}</span>
                                        <small class="text-gray-400">{member.id}</small>
                                        </div>
                                    
                                    </li>
                                {/each}
                        </ul>
                    </div>
                </div>
                <TextField label="Amount" name="amount" type="number" step="{.01}" error={$errors?.amount?.[0]} />
                <TextAreaField label="Remarks" name="remarks"   error={$errors?.remarks?.[0]}/>
                <button type="submit" class="btn btn-primary mt-5 text-white">Save</button>
                <button type="button" class="btn btn-secondary btn-outline" on:click={()=>{isModalOpen = true}}>Cancel</button>
        </form>
    <!-- <div class="modal-action">
      <label for="my-modal" class="btn">Yay!</label>
    </div> -->
</Modal>
<Toaster/>





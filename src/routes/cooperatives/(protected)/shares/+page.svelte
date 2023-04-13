  <script lang="ts">
  import TextAreaField from "$lib/components/form/TextAreaField.svelte";
  import TextField from "$lib/components/form/TextField.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import type { Member, Share } from "$lib/definitions/types";
  import {createForm} from "felte"
  import axios from "axios";
  import {validator} from "@felte/validator-yup"
  import { AddSharesSchemaValidation, EditSharesSchemaValidation } from "$lib/definitions/schema";
  import toast, { Toaster } from "svelte-french-toast";
  import { SharesTransactionTypes } from "$lib/internal/transaction.js";
  import Time from "svelte-time";
  import AccountSelector from "$lib/components/account-selector/AccountSelector.svelte";
  import { invalidate } from "$app/navigation";
 
  let isAddModalOpen = false;
  let isEditModalOpen = false;
  let isConfirmDialogOpen = false

  export let data;
 
  let selectedMember:Member | null | undefined;
  const {form, data:formBody, errors, reset} = createForm({
    initialValues:{
        memberId:0,
        amount: 0,
        remarks:""
    },
    extend: validator({schema: AddSharesSchemaValidation, castValues: true, level: "error"}),
    onSubmit: async(body)=>{
        try{
             await axios.post("/api/shares", body)
             toast.success("Shares has been added.")
             invalidate((url)=>url.pathname === "/api/shares")
             invalidate((url)=>url.pathname === "/api/shares/total")
        }
        catch{
          toast.error("Unkwown error occured, Please try again later.")
        }
        finally{
          selectedMember = null
          isAddModalOpen = false
          reset()
        }
    }
  })
  
  const {form:editForm, data:editFormBody, errors:editFormErrors, reset:resetEditForm } = createForm({
    initialValues:{
        id:0,
        memberId:0,
        amount: 0,
        remarks:""
    },
    extend:validator({schema: EditSharesSchemaValidation, castValues: true, level: "error"}),
    onSubmit: async(body)=>{
      try{
        await axios.put(`/api/shares/${body.id}`, body)
        toast.success("Shares has been updated.")
        invalidate((url)=>url.pathname === "/api/shares")
        invalidate((url)=>url.pathname === "/api/shares/total")
    
      }
      catch{
        toast.error("Unkwown error occured, Please try again later.")
      }
      finally{
        closeEditSharesModal()
      }
       
    }
  })
  const removeSelectedMember = ()=>{
    selectedMember = null
    formBody.update((prev)=>{
        prev.memberId =0;
        return prev
    })
  }
  const closeAddSharesModal = ()=>{
      isAddModalOpen = false
  }
  const closeEditSharesModal = ()=>{
    selectedMember = null
    isEditModalOpen = false
  }
  const closeConfirmDialog = ()=>{
    isConfirmDialogOpen = false
  }
  const d = new Date().toDateString()


  const edit = (log: Share)=>{
    editFormBody.update(()=>({memberId: log.member?.id ?? 0, amount: log.amount, remarks: log.remarks, id: log.id ?? 0}))
    selectedMember = log.member
    isEditModalOpen = true
  }

  let sharesToDelete:Share;
  const confirmDelete = (share: Share)=>{
       isConfirmDialogOpen = true
       sharesToDelete = share
  }

  const deleteShares = async()=>{
    try{
    await axios.delete(`/api/shares/${sharesToDelete.id}`)
    invalidate((url)=>url.pathname === "/api/shares")
    invalidate((url)=>url.pathname === "/api/shares/total")
    toast.success("Shares has been deleted.")
    }catch(error){
      toast.error("Unknown error occured, Please try again later.")
    }
    finally{
      closeConfirmDialog()
    }
  }
 const selectMemberForAddShareForm = (member:Member)=>{
    selectedMember = member
    formBody.update((prev)=>{
      prev.memberId = member.id ?? 0
      return prev
    })
 }
 const selectMemberForEditShareForm = (member:Member)=>{
  selectedMember = member;
  editFormBody.update((prev)=>{
      prev.memberId = member.id ?? 0
      return prev
    })
 }
  </script>
  <div>
    <h1 class="text-lg font-semibold mb-3 ml-1 text-gray-500">Shares</h1>
   <div class="container bg-base-100 w-full  p-3 rounded mb-8 h-56 flex">

    <div class="basis-1/2 h-full  flex items-center justify-center flex-col text-success gap-2">
      <i class="fa-solid fa-signal text-2xl "></i>
      <h2 class="text-3xl font-bold">PHP {data?.total}</h2>
     <p>Total Shares</p>
    </div>
    <div class="basis-1/2 h-full  flex items-center justify-center flex-col text-secondary gap-2">
      <i class="fa-solid fa-chart-pie text-2xl"></i>
      <h2 class="text-3xl font-bold">PHP {data?.total ?? 0}</h2>
      <p>{d} Shares</p>
    </div>
   </div>
    <div class="container bg-base-100 w-full  p-3 rounded">
        <button class="btn modal-button btn-primary mb-3 text-white" on:click={()=>{isAddModalOpen = true}}> <i class="fa-solid fa-plus mr-1"></i>Add Shares</button>
        <div class="overflow-x-auto">
            <table class="table w-full">
              <!-- head -->
              <thead>
                <tr>
                  <th>Member</th>
 
                  <th>Transaction type</th>
                  <th>Amount</th>
                  <th>Remarks</th>
                  <td></td>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {#each data.shares as share }
                <tr>
                  <td>
                   {share.member?.givenName} {share.member?.middleName} {share.member?.surname}
                  </td>
                  <td>
                    {share.type}
                  </td>
                  <td class:text-success="{share.type === SharesTransactionTypes.Deposit}">
                            +{share.amount} ₱
                  </td>
                  <td>
                    {share.remarks}
                  </td>
                  <td>
                
                    <Time  relative timestamp={share.createdAt}/>
                  </td>
                    <td>
                      <a href="/cooperatives/members/view/{share.member?.id}" class="btn btn-outline btn-info"><i class="fa-regular fa-eye"></i></a>
                      <button class="btn btn-secondary btn-outline" on:click={()=>{edit(share)}}><i class="fa-regular fa-pen-to-square"></i></button>
                      <button class="btn btn-error btn-outline" on:click={()=>confirmDelete(share)}><i class="fa-solid fa-trash"></i></button>
                    </td> 
                    
                   
                 </tr>
               {/each}
              
              </tbody>
            </table>
          </div>


      </div>

</div>


<Modal  isOpen={isAddModalOpen} modalBoxClass={"w-11/12 max-w-5xl"} close={closeAddSharesModal}>
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

            <AccountSelector handleSelect={selectMemberForAddShareForm} error={$errors?.memberId?.[0]}/>

            {/if}
             
              
                <TextField label="Amount" name="amount" type="number" step="{.01}" error={$errors?.amount?.[0]} />
                <TextAreaField label="Remarks" name="remarks"   error={$errors?.remarks?.[0]}/>
                <button type="submit" class="btn btn-primary mt-5 text-white">Save</button>
                <button type="button" class="btn btn-secondary btn-outline" on:click={closeAddSharesModal}>Cancel</button>
        </form>
</Modal>

<Modal isOpen={isEditModalOpen}  modalBoxClass={"w-11/12 max-w-5xl"}  close={closeEditSharesModal}>
  <h3 class="font-bold text-lg">Edit Shares</h3>
  <form use:editForm>
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
        <AccountSelector  handleSelect={selectMemberForEditShareForm} error={$editFormErrors?.memberId?.[0]}/>
      {/if}
       
       
          <TextField value={$editFormBody.amount} label="Amount" name="amount" type="number" step="{.01}" error={$errors?.amount?.[0]} />
          <TextAreaField value={$editFormBody.remarks} label="Remarks" name="remarks"   error={$editFormErrors?.remarks?.[0]}/>
          <button type="submit" class="btn btn-primary mt-5 text-white">Save</button>
          <button type="button" class="btn btn-secondary btn-outline" on:click={closeEditSharesModal}>Cancel</button>
  </form>
</Modal>
<Modal isOpen={isConfirmDialogOpen} close={closeConfirmDialog} >
  <h3 class="font-bold text-xl"><i class="fa-solid fa-circle-exclamation text-error"></i> Delete Shares?</h3>
  <p class="py-4">Are you sure that you want to delete this shares?</p>
  <div class="modal-action">
    <button class="btn btn-outline" type="button" on:click={closeConfirmDialog}>Cancel</button>
    <button class="btn btn-error" type="button" on:click={deleteShares}>Yes, Delete It!</button>
  </div>

</Modal>
<Toaster/>





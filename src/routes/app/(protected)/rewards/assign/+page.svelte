<script lang="ts">
  import { invalidate } from "$app/navigation";
  import CooperativeSelector from "$lib/components/cooperative-selector/CooperativeSelector.svelte";
  import SelectField from "$lib/components/form/SelectField.svelte";
  import TextField from "$lib/components/form/TextField.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import type{ Cooperative} from "$lib/definitions/types"
  import axios from "axios";
  import { createForm } from "felte";
  import {validator} from "@felte/validator-yup"
  import { GiveRewardValidation } from "$lib/definitions/schema.js";
  import toast, { Toaster } from "svelte-french-toast";
  export let data;
  
 let isAssignModalOpen = false;


 let selectedCooperative:Cooperative;
  $:selectedCoopHashTable = data?.cooperatives.reduce<Record<string, Cooperative>>((a, c)=>{
    a[c.id ?? ""] = c
    return a
  }, {})

  const {form:assignForm, data:assignFormData, errors: assignFormErrors, reset: resetAssignForm}  = createForm({
    initialValues:{
      cooperativeId:"",
      rewardId:"",
      date:""
    },
    onSubmit: async(body)=>{
       try {
          await axios.post("/api/recognitions", body);
          toast.success("Reward given successfully")
          
       } catch {
          toast.error("Unknown error occured, please try again later.")
       }
       finally{
        closeAssignModal()
        resetAssignForm()
       }
    },
    onError: async(error)=>{
      console.log(error)
    },
    extend:[
      validator({schema: GiveRewardValidation, castValues: true, level: "error"})
    ]
  })
  const handleSelect = async(cooperative: Cooperative )=>{
      const coop = selectedCoopHashTable[cooperative.id ?? ""]
      if (!coop) {
          await axios.post("/api/rewards/cooperatives", {cooperativeId: cooperative.id})
          invalidate((url)=>url.pathname === "/api/rewards/cooperatives")
          
      }
  }
  const deleteCooperative = async(cooperative:Cooperative)=>{
    await axios.delete(`/api/rewards/cooperatives/${cooperative.id}`)
    invalidate((url)=>url.pathname === "/api/rewards/cooperatives")
  }
  const assign = async(cooperative:Cooperative)=>{
    selectedCooperative = cooperative
    assignFormData.update((prev)=>({...prev, cooperativeId: cooperative.id ?? ''}))
    openAssignModal()
  }

  const closeAssignModal = ()=>{
    isAssignModalOpen = false
  }
  
  const openAssignModal = ()=>{
    isAssignModalOpen  = true
  }

 

</script>
<div class="container bg-base-100 w-full  p-3 rounded pb-9">
    <div>
        <CooperativeSelector handleSelect={handleSelect}></CooperativeSelector>
    </div>

</div>
<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mt-10 gap-2">

  {#each data?.cooperatives as cooperative }
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <div class="flex gap-2 items-center h-30">
      <img src="https://api.dicebear.com/6.x/initials/svg?seed={cooperative.name}&backgroundColor=EB7C2A" alt="avatar" class="w-12 rounded-full">
      <div>
      <h2 class="card-title">{cooperative.name}</h2>
      <small class="text-gray-500">{cooperative.registrationNumber}</small>
    </div>
      </div>
      <div class="container bg-base-100 w-full  p-3 rounded">
        <div class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5">
          <i class="fa-regular fa-address-card"></i>  SAVINGS
        </div>
         
         <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
          <span>Total Savings</span>
          <span class="font-bold">PHP {cooperative?.stats?.savings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) ?? 0}</span>
          </div>
       <div class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5">
        <i class="fa-regular fa-address-card"></i>  SHARES
      </div>
      <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
        <span>Total Shares</span>
        <span class="font-bold">PHP {cooperative?.stats?.shares.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) ?? 0}</span>
      </div>
      <div class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5">
        <i class="fa-regular fa-address-card"></i>  LOAN
      </div>
       
      <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
        <span>Loan</span>
        <span class="font-bold">PHP {cooperative?.stats?.loan.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) ?? 0}</span>
      </div>
      <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
        <span>Loan Interest</span>
        <span class="font-bold">PHP {cooperative?.stats?.loanInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) ?? 0}</span>
      </div>
      <div class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5">
        <i class="fa-regular fa-address-card"></i>  SUMMARY
      </div>
      <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
        <span>Assets</span>
        <span class="font-bold">PHP {cooperative?.stats?.assets.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) ?? 0}</span>
      </div>
      <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
        <span>Liquidity</span>
        <span class="font-bold">PHP {cooperative?.stats?.liquidity.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) ?? 0}</span>
      </div>

      </div>
      <div class="card-actions justify-end">
      
        <button class="btn btn-primary text-white w-full xl:w-fit" on:click={()=>{assign(cooperative)}}>Give Reward</button>
        <button class="btn btn-error w-full xl:w-fit" on:click={()=>{deleteCooperative(cooperative)}}>Remove</button>
        <a href="/app/cooperatives/view/{cooperative.id}" class="btn btn-secondary btn-outline text-white w-full xl:w-fit">View Full Details</a>
      </div>
    </div>
  </div> 
  {/each}
    
</div>
<Modal isOpen={isAssignModalOpen} close={closeAssignModal} >
  <h1 class="text-lg font-bold">Give Reward</h1>
  <form use:assignForm>
      <SelectField label={"Reward"} labelFor="reward" name="rewardId" error={$assignFormErrors.rewardId?.[0]}>
         {#each data.rewards as reward }
          <option value={reward.id}> {reward.name}</option>
         {/each}
      </SelectField>
      <TextField name="date" type="month" error={$assignFormErrors?.date?.[0]}/>
      <button class="btn btn-primary text-base-100 mt-3" type="submit">Give</button>
  </form>
</Modal>
<Toaster/>
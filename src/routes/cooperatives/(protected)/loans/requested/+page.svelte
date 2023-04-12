<script lang="ts">
  import AccountSelector from "$lib/components/account-selector/AccountSelector.svelte";
  import TextAreaField from "$lib/components/form/TextAreaField.svelte";
  import TextField from "$lib/components/form/TextField.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import type { Member } from "$lib/definitions/types";
  import { createForm } from "felte";
  import {validator } from "@felte/validator-yup"
  import { AddLoanSchemaValidation } from "$lib/definitions/schema";
  import toast, { Toaster } from "svelte-french-toast";
  import axios from "axios";
  import { x64 } from "crypto-js";
  import { dataset_dev } from "svelte/internal";

  export let data;
  let isAddLoanModalOpen = false
  let selectedMember: Member | null;
  const {form:addLoanForm, data:addLoanData, errors:addLoanFormErrors} = createForm({
   initialValues:{
    memberId: 0,
    amount:0,
    interest:0,
    tenure:0,
   },
   onSubmit:async(body)=>{
     try{
      const response = await axios.post("/api/loans", body)
      toast.success("Loan has been requested.")
     }
     catch{
      toast.error("Unknown error occured, Please try again later.")
     }
   },
   extend: [validator({schema: AddLoanSchemaValidation, level: "error", castValues: true})]
  })

  const removeSelectedMember = ()=>{
    selectedMember = null
  }

  const selectMemberForAddLoan = (member: Member)=>{
    selectedMember = member
    addLoanData.update((prev)=>{
      prev.memberId = member.id ?? 0
      return prev
    })
 
  }
  $: interest = (($addLoanData.interest ?? 0) / 100 ) * ($addLoanData.amount ?? 0)
  $: totalDue = ($addLoanData.amount ?? 0) + interest 
  $: repaymentPrincipal = ($addLoanData.amount) / $addLoanData.tenure 
  $: repaymentInterest = interest / $addLoanData.tenure;
  $: repaymentTotalDue = repaymentPrincipal + repaymentInterest
</script>
<div>
    <h1 class="text-lg font-semibold mb-3 ml-1 text-gray-500">Requested Loans</h1>
   <div class="container bg-base-100 w-full  p-3 rounded mb-8 h-56 flex">

    <div class="basis-1/2 h-full  flex items-center justify-center flex-col text-success gap-2">
      <i class="fa-solid fa-signal text-2xl "></i>
      <h2 class="text-3xl font-bold">PHP </h2>
     <p>Total Shares</p>
    </div>
    <div class="basis-1/2 h-full  flex items-center justify-center flex-col text-secondary gap-2">
      <i class="fa-solid fa-chart-pie text-2xl"></i>
      <h2 class="text-3xl font-bold">PHP </h2>
      <p>Shares</p>
    </div>
   </div>
    <div class="container bg-base-100 w-full  p-3 rounded">
        <button class="btn modal-button btn-primary mb-3 text-white" on:click={()=>{isAddLoanModalOpen = true }} > <i class="fa-solid fa-plus mr-1"></i>Add Loan</button>
        <div class="overflow-x-auto">
            <table class="table w-full">
              <!-- head -->
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Amount</th>
                  <th>Remarks</th>
                  <td></td>
                  <th></th>
                </tr>
              </thead>
              <tbody>
        
              </tbody>
            </table>
          </div>


      </div>

</div>


<Modal  isOpen={isAddLoanModalOpen} modalBoxClass={"w-11/12 max-w-5xl"} close={()=>{isAddLoanModalOpen = false}}>
    <h3 class="font-bold text-lg">Add Loan</h3>
        <form use:addLoanForm>
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

            <AccountSelector handleSelect={selectMemberForAddLoan} error={$addLoanFormErrors?.memberId?.[0]} />

            {/if} 
                <TextField label="Amount" name="amount" type="number" step="{.01}"  error={$addLoanFormErrors?.amount?.[0]} />
                <TextField label="Interest Rate(%)" name="interest" type="number"  min="1" error={$addLoanFormErrors?.interest?.[0]} />
                <TextField label="Tenure(In Months)" name="tenure" type="number"  min="1" error={$addLoanFormErrors?.tenure?.[0]}/>
                <div class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5">
                    <i class="fa-solid fa-calendar"></i>LOAN SCHEDULE
                </div>
                <div class=" w-full h-30   rounded p-5">
               
                    <div class="grid grid-cols-2 border-b py-2">
                        <span>Principal</span>
                        <span class="font-bold">{$addLoanData?.amount?.toLocaleString(undefined, {minimumFractionDigits: 2}) ?? 0}</span>
                    </div>
                    <div class="grid grid-cols-2 border-b py-2">
                        <span>Interest</span>
                        <span class="font-bold">{interest?.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="grid grid-cols-2 border-b py-2">
                        <span>Total Due</span>
                        <span class="font-bold">{totalDue?.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                </div>

                <div class=" w-full h-30  rounded p-5 flex flex-col gap-1">
                    <h3 class="font-bold mb-2">Repayment</h3>
                    <div class="px-2">
                    <div class="grid grid-cols-2 py-2 border-b">
                        <span>Principal</span>
                        <span class="font-bold">{ isNaN(repaymentPrincipal) || !isFinite(repaymentPrincipal)  ? (0).toLocaleString(undefined, {minimumFractionDigits: 2}) : repaymentPrincipal?.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="grid grid-cols-2 py-2 border-b">
                        <span>Interest</span>
                        <span class="font-bold">{ isNaN(repaymentInterest) || !isFinite(repaymentPrincipal) ? (0).toLocaleString(undefined, {minimumFractionDigits: 2}) : repaymentInterest?.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
           
                    <div class="grid grid-cols-2 py-2 border-b">
                        <span>Total Monthly Due</span>
                        <span class="font-bold">{isNaN(repaymentTotalDue) || !isFinite(repaymentPrincipal) ? (0).toLocaleString(undefined, {minimumFractionDigits: 2}) : repaymentTotalDue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                </div>
           
                </div>
                <button type="submit" class="btn btn-primary mt-5 text-white">Save</button>
                <button type="button" class="btn btn-secondary btn-outline" on:click={()=>{isAddLoanModalOpen= false}}>Cancel</button>
        </form>
</Modal>
<Toaster/>





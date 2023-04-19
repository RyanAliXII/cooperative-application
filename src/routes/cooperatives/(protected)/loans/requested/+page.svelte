<script lang="ts">
  import AccountSelector from "$lib/components/account-selector/AccountSelector.svelte";
  import TextField from "$lib/components/form/TextField.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import type { Loan, Member } from "$lib/definitions/types";
  import { createForm } from "felte";
  import {validator } from "@felte/validator-yup"
  import { AddLoanSchemaValidation, EditLoanSchemaValidation } from "$lib/definitions/schema";
  import toast, { Toaster } from "svelte-french-toast";
  import axios from "axios";
  import { invalidate } from "$app/navigation";
  import { LoanStatuses } from "$lib/internal/transaction.js";
  import ConfirmDialog from "$lib/components/ui/ConfirmDialog.svelte";
  import { MONETARY } from "$lib/internal/config.js";

  export let data;
  let isAddLoanModalOpen = false
  let isEditLoanModalOpen = false
  let isLoanPreviewModalOpen = false
  let isDeleteLoanDialogOpen = false

  let selectedMember: Member | null |undefined;
  let selectedLoan: Loan;
  const {form:addLoanForm, data:addLoanData, errors:addLoanFormErrors, isSubmitting, reset:resetAddLoanForm} = createForm({
   initialValues:{
    memberId: 0,
    amount:0,
    interest:0,
    tenure:0,
   },
   onSubmit:async(body)=>{
     try{
      await axios.post("/api/loans", body)
      toast.success("Loan has been requested.")
      invalidate((url)=>url.pathname === "/api/loans")
      invalidate((url)=>url.pathname === "/api/loans/total")
     }
     catch{
      toast.error("Unknown error occured, Please try again later.")
     }
     finally{
        isAddLoanModalOpen = false
        selectedMember = null
        resetAddLoanForm()
     }
   },
   extend: [validator({schema: AddLoanSchemaValidation, level: "error", castValues: true})]
  })

  const {form:editLoanForm, data:editLoanData, errors:editLoanFormErrors, reset:resetEditLoanForm} = createForm({
   initialValues:{
    id:"",
    memberId: 0,
    amount:0,
    interest:0,
    tenure:0,
   },
   onSubmit:async(body)=>{
     try{
      await axios.put(`/api/loans/${body.id}`, body)
      toast.success("Loan request has been updated.")
      invalidate((url)=>url.pathname === "/api/loans")
      invalidate((url)=>url.pathname === "/api/loans/total")
     }
     catch{
      toast.error("Unknown error occured, Please try again later.")
     }
     finally{
        isEditLoanModalOpen = false
        selectedMember= null
        resetEditLoanForm()
     }
   },
   extend: [validator({schema: EditLoanSchemaValidation, level: "error", castValues: true})]
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
  const edit = (loan:Loan)=>{
    editLoanData.update(()=>({
     id:loan.id ?? "",
     memberId: loan.memberId, 
     amount: loan.principal, 
     interest:((loan.interest/loan.principal) * 100),
     tenure:loan.tenure
    }))
    selectedMember = loan.member
    isEditLoanModalOpen = true
  }
  const preview = (loan:Loan)=>{
    isLoanPreviewModalOpen = true
    selectedLoan = loan
  }
  const declineLoan = async()=>{
     try{
        await axios.patch(`/api/loans/${selectedLoan?.id}`, {status:LoanStatuses.Declined})
        invalidate((url)=>url.pathname === "/api/loans")
        invalidate((url)=>url.pathname === "/api/loans/total")
        toast.success("Loan has been declined.")
     }
     catch{
        toast.error("Unknown error occured, Please try again later.")
     }
     finally{
        isLoanPreviewModalOpen = false
     }
  }

  const approveLoan = async()=>{
     try{
        await axios.patch(`/api/loans/${selectedLoan?.id}`, {status:LoanStatuses.Approved})
        invalidate((url)=>url.pathname === "/api/loans")
        invalidate((url)=>url.pathname === "/api/loans/total")
        toast.success("Loan has been approved.")
     }
     catch{
        toast.error("Unknown error occured, Please try again later.")
     }
     finally{
        isLoanPreviewModalOpen = false
     }
  }
  const deleteLoan = async()=>{
    try{
        await axios.delete(`/api/loans/${selectedLoan?.id}`)
        invalidate((url)=>url.pathname === "/api/loans")
        invalidate((url)=>url.pathname === "/api/loans/total")
        toast.success("Loan has been removed.")
     }
     catch{
        toast.error("Unknown error occured, Please try again later.")
     }
     finally{
        isDeleteLoanDialogOpen = false
     }
  }

  
  $: interest = (($addLoanData.interest ?? 0) / 100 ) * ($addLoanData.amount ?? 0)
  $: totalDue = ($addLoanData.amount ?? 0) + interest 
  $: repaymentPrincipal = ($addLoanData.amount) / $addLoanData.tenure 
  $: repaymentInterest = interest / $addLoanData.tenure;
  $: repaymentTotalDue = repaymentPrincipal + repaymentInterest
  
  $: editLoanInterest = (($editLoanData.interest ?? 0) / 100 ) * ($editLoanData.amount ?? 0)
  $: editLoanTotalDue = ($editLoanData.amount ?? 0) + editLoanInterest 
  $: editLoanRepaymentPrincipal = ($editLoanData.amount) / $editLoanData.tenure 
  $: editLoanRepaymentInterest = editLoanInterest / $editLoanData.tenure;
  $: editLoanRepaymentTotalDue = editLoanRepaymentPrincipal + editLoanRepaymentInterest
</script>
<div>
    <h1 class="text-lg font-semibold mb-3 ml-1 text-gray-500">Requested Loans</h1>
   <div class="container bg-base-100 w-full  p-3 rounded mb-8 h-56 flex">

    <div class="basis-1/2 h-full  flex items-center justify-center flex-col text-success gap-2">
      <i class="fa-solid fa-briefcase text-2xl"></i>
      <h2 class="text-3xl font-bold">PHP {data.total.principal.toLocaleString(undefined, MONETARY)}</h2>
     <p>Total Requested Loans</p>
    </div>
    <div class="basis-1/2 h-full  flex items-center justify-center flex-col text-secondary gap-2">
      <i class="fa-solid fa-chart-pie text-2xl"></i>
      <h2 class="text-3xl font-bold">PHP {data.total.interest.toLocaleString(undefined, MONETARY)}</h2>
      <p>Total Interest</p>
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
                  <th>Principal</th>
                  <th>Interest</th>
                  <td>Total Due</td>
                  <td>Monthly Due</td>
                  <th>Tenure</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                    {#each data.loans as loan }
                      <tr>
                      <td>{loan.member?.givenName} {loan.member?.middleName} {loan.member?.surname}</td>
                      <td>{loan.principal.toLocaleString(undefined,{minimumFractionDigits: 2})}</td>
                      <td>{loan.interest.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                      <td>{(loan.principal + loan.interest).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                      <td>{((loan.principal + loan.interest) / loan.tenure).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                      <td>{loan.tenure > 1 ? `${loan.tenure} months`: `${loan.tenure} month`} </td>
                      <td>
                        <button class="btn btn-info btn-outline" on:click={()=>{preview(loan)}}> <i class="fa-solid fa-eye"></i></button>
                        <button class="btn btn-secondary btn-outline" on:click={()=>{ edit(loan)}}><i class="fa-regular fa-pen-to-square"></i></button>
                        <button class="btn btn-error btn-outline" on:click={()=>{isDeleteLoanDialogOpen = true; selectedLoan = loan}}><i class="fa-solid fa-trash" ></i></button>
                      </td>
                      </tr>
                    {/each

                    }
              </tbody>
            </table>
          </div>


      </div>

</div>

<!-- Add Modal -->
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
                        <span class="font-bold">{$addLoanData?.amount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) ?? 0}</span>
                    </div>
                    <div class="grid grid-cols-2 border-b py-2">
                        <span>Interest</span>
                        <span class="font-bold">{interest?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="grid grid-cols-2 border-b py-2">
                        <span>Total Due</span>
                        <span class="font-bold">{totalDue?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                </div>

                <div class=" w-full h-30  rounded p-5 flex flex-col gap-1">
                    <h3 class="font-bold mb-2">Repayment</h3>
                    <div class="px-2">
                    <div class="grid grid-cols-2 py-2 border-b">
                        <span>Principal</span>
                        <span class="font-bold">{ isNaN(repaymentPrincipal) || !isFinite(repaymentPrincipal)  ? (0).toLocaleString(undefined, {minimumFractionDigits: 2}) : repaymentPrincipal?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2,})}</span>
                    </div>
                    <div class="grid grid-cols-2 py-2 border-b">
                        <span>Interest</span>
                        <span class="font-bold">{ isNaN(repaymentInterest) || !isFinite(repaymentPrincipal) ? (0).toLocaleString(undefined, {minimumFractionDigits: 2}) : repaymentInterest?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</span>
                    </div>
           
                    <div class="grid grid-cols-2 py-2 border-b">
                        <span>Total Monthly Due</span>
                        <span class="font-bold">{isNaN(repaymentTotalDue) || !isFinite(repaymentPrincipal) ? (0).toLocaleString(undefined, {minimumFractionDigits: 2}) : repaymentTotalDue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                </div>
           
                </div>
                <button type="submit" class="btn btn-primary mt-5 text-white" disabled={$isSubmitting}>Save</button>
                <button type="button" class="btn btn-secondary btn-outline" on:click={()=>{isAddLoanModalOpen= false}}>Cancel</button>
        </form>
</Modal>
<!-- End of Add Modal -->

<!-- Edit Modal -->
<Modal  isOpen={isEditLoanModalOpen} modalBoxClass={"w-11/12 max-w-5xl"} close={()=>{isEditLoanModalOpen = false; selectedMember= null}}>
  <h3 class="font-bold text-lg">Edit Loan</h3>
      <form use:editLoanForm>
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

          <AccountSelector handleSelect={selectMemberForAddLoan} error={$editLoanFormErrors?.memberId?.[0]} />

          {/if} 
              <TextField value={$editLoanData.amount} label="Amount" name="amount" type="number" step="{.01}"  error={$editLoanFormErrors?.amount?.[0]} />
              <TextField value= {$editLoanData.interest} label="Interest Rate(%)" name="interest" type="number"  min="1" error={$editLoanFormErrors?.interest?.[0]} />
              <TextField value={$editLoanData.tenure} label="Tenure(In Months)" name="tenure" type="number"  min="1" error={$editLoanFormErrors?.tenure?.[0]}/>
              <div class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5">
                  <i class="fa-solid fa-calendar"></i>LOAN SCHEDULE
              </div>
              <div class=" w-full h-30   rounded p-5">
             
                  <div class="grid grid-cols-2 border-b py-2">
                      <span>Principal</span>
                      <span class="font-bold">{$editLoanData?.amount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) ?? 0}</span>
                  </div>
                  <div class="grid grid-cols-2 border-b py-2">
                      <span>Interest</span>
                      <span class="font-bold">{editLoanInterest?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</span>
                  </div>
                  <div class="grid grid-cols-2 border-b py-2">
                      <span>Total Due</span>
                      <span class="font-bold">{editLoanTotalDue?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
              </div>

              <div class=" w-full h-30  rounded p-5 flex flex-col gap-1">
                  <h3 class="font-bold mb-2">Repayment</h3>
                  <div class="px-2">
                  <div class="grid grid-cols-2 py-2 border-b">
                      <span>Principal</span>
                      <span class="font-bold">{ isNaN(editLoanRepaymentPrincipal) || !isFinite(editLoanRepaymentPrincipal)  ? (0).toLocaleString(undefined, {minimumFractionDigits: 2}) : editLoanRepaymentPrincipal?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</span>
                  </div>
                  <div class="grid grid-cols-2 py-2 border-b">
                      <span>Interest</span>
                      <span class="font-bold">{ isNaN(editLoanRepaymentInterest) || !isFinite(editLoanRepaymentPrincipal) ? (0).toLocaleString(undefined, {minimumFractionDigits: 2}) : editLoanRepaymentInterest?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
         
                  <div class="grid grid-cols-2 py-2 border-b">
                      <span>Total Monthly Due</span>
                      <span class="font-bold">{isNaN(editLoanRepaymentTotalDue) || !isFinite(editLoanRepaymentPrincipal) ? (0).toLocaleString(undefined, {minimumFractionDigits: 2}) : editLoanRepaymentTotalDue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
              </div>
         
              </div>
              <button type="submit" class="btn btn-primary mt-5 text-white">Save</button>
              <button type="button" class="btn btn-secondary btn-outline" on:click={()=>{isEditLoanModalOpen= false; selectedMember = null}}>Cancel</button>
      </form>
</Modal>
<!-- End of Edit Modal -->

<!-- Loan Preview Modal -->
<Modal  isOpen={isLoanPreviewModalOpen} modalBoxClass={"w-11/12 max-w-5xl"} close={()=>{isLoanPreviewModalOpen = false}}>
    <div class="flex mt-3 gap-2 w-full bg-white shadow-sm p-5 border">
        <div>
            <img src="https://api.dicebear.com/6.x/initials/svg?seed={selectedLoan?.member?.givenName} {selectedLoan?.member?.surname}&backgroundColor=EB7C2A" alt="avatar" class="w-10 rounded-full">
        </div>
        <div class="flex flex-col justify-center">
        <span class="font-bold">{selectedLoan?.member?.givenName} {selectedLoan?.member?.middleName} {selectedLoan?.member?.surname}</span>
        <small class="text-gray-400">{selectedLoan?.member?.id}</small>
        </div>
       
    </div> 
    <div class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5">
        <i class="fa-solid fa-calendar"></i>LOAN SCHEDULE
    </div>
    <div class=" w-full h-30 rounded p-5">
   
        <div class="grid grid-cols-2 border-b py-2">
            <span>Principal</span>
            <span class="font-bold">{$editLoanData?.amount?.toLocaleString(undefined, {minimumFractionDigits: 2}) ?? 0}</span>
        </div>
        <div class="grid grid-cols-2 border-b py-2">
            <span>Interest</span>
            <span class="font-bold">{editLoanInterest?.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
        <div class="grid grid-cols-2 border-b py-2">
            <span>Total Due</span>
            <span class="font-bold">{editLoanTotalDue?.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
    </div>

    <div class=" w-full h-30  rounded p-5 flex flex-col gap-1">
        <h3 class="font-bold mb-2">Repayment</h3>
        <div class="px-2">
        <div class="grid grid-cols-2 py-2 border-b">
            <span>Principal</span>
            <span class="font-bold">{ isNaN(editLoanRepaymentPrincipal) || !isFinite(editLoanRepaymentPrincipal)  ? (0).toLocaleString(undefined, {minimumFractionDigits: 2}) : editLoanRepaymentPrincipal?.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
        <div class="grid grid-cols-2 py-2 border-b">
            <span>Interest</span>
            <span class="font-bold">{ isNaN(editLoanRepaymentInterest) || !isFinite(editLoanRepaymentPrincipal) ? (0).toLocaleString(undefined, {minimumFractionDigits: 2}) : editLoanRepaymentInterest?.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>

        <div class="grid grid-cols-2 py-2 border-b">
            <span>Total Monthly Due</span>
            <span class="font-bold">{isNaN(editLoanRepaymentTotalDue) || !isFinite(editLoanRepaymentPrincipal) ? (0).toLocaleString(undefined, {minimumFractionDigits: 2}) : editLoanRepaymentTotalDue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
    </div>
    <div class="w-full flex gap-3 mt-10">
        <button class="btn btn-success basis-1/2" type="button" on:click={approveLoan}>Approve</button>
        <button class="btn btn-error basis-1/2" type="button" on:click={declineLoan} >Decline</button>
    </div>
  
</Modal>
<!-- End of Loan Preview Modal -->
<ConfirmDialog isOpen={isDeleteLoanDialogOpen} close={()=>{isDeleteLoanDialogOpen= false}} title={"Delete Loan Request!"} text={"Are you sure you want to delete is this loan request?"} onConfirm={deleteLoan}/>
<Toaster/>






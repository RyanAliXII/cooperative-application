<script lang="ts">

    import toast, { Toaster } from "svelte-french-toast";
    import axios from "axios";

    import type { Loan } from "$lib/definitions/types.js";
    import { LoanStatuses } from "$lib/internal/transaction.js";
    import Modal from "$lib/components/ui/Modal.svelte";
  import TextField from "$lib/components/form/TextField.svelte";
  import TextAreaField from "$lib/components/form/TextAreaField.svelte";
  import { MONETARY } from "$lib/internal/config.js";
  import { createForm } from "felte";
  import {validator} from "@felte/validator-yup"
  import { AddRepaymentModalSchemaValidation } from "$lib/definitions/schema.js";
  import { invalidate } from "$app/navigation";
    export let data;
    let isRepaymentModalOpen = false
   
    let selectedLoan:Loan;

  const fetchLoanById = async(id: string)=>{
    const response = await axios.get(`/api/loans/${id}?status=${LoanStatuses.Disbursed}`)
    const {data:responseData } = response.data 
    selectedLoan = responseData?.loan as Loan
  }
  const {errors: addRepaymentErrors,data:addRepaymentData ,form:addRepaymentForm, isSubmitting, reset} = createForm({
    initialValues: {
      loanId:"",
      amount:0,
      remainingBalance:0,
      remarks: ""
    },
    onSubmit:async(data)=>{
      try{
        await axios.post("/api/repayments", data)
        toast.success("Repayment has been added.")
        invalidate((url)=>url.pathname === "/api/loans" || url.pathname === "/api/loans/status")
      }
      catch(error){
          toast.error("Unknown error occured, Please try again later.")
      }
      finally{
        isRepaymentModalOpen = false
        reset()
      }
    },
    extend:validator({schema: AddRepaymentModalSchemaValidation, castValues: true, level:"error"})
  })

  const openLoanRepaymentModal = async(id: string)=>{
    await fetchLoanById(id)
    addRepaymentData.update((prev)=>{
      prev.loanId = selectedLoan.id ?? "",
      prev.amount = parseFloat((selectedLoan.totalDue / selectedLoan.tenure).toFixed(2))
      prev.remainingBalance = parseFloat((selectedLoan.remainingBalance).toFixed(2))
      return prev
    })
    isRepaymentModalOpen = true
  }

  
  </script>
  <div>
      <h1 class="text-lg font-semibold mb-3 ml-1 text-gray-500">Disbursed Loans</h1>
     <div class="container bg-base-100 w-full  p-3 rounded mb-8 h-56 flex">
  
      <div class="basis-1/2 h-full  flex items-center justify-center flex-col text-success gap-2">
        <i class="fa-solid fa-briefcase text-2xl"></i>
        <h2 class="text-3xl font-bold">PHP {data.total.principal.toLocaleString(undefined, MONETARY)}</h2>
       <p>Total Disbursed Loans</p>
      </div>
      <div class="basis-1/2 h-full  flex items-center justify-center flex-col text-secondary gap-2">
        <i class="fa-solid fa-chart-pie text-2xl"></i>
        <h2 class="text-3xl font-bold">PHP {data.total.interest.toLocaleString(undefined, MONETARY)}</h2>
        <p>Total Interest</p>
      </div>
      <div class="basis-1/2 h-full  flex items-center justify-center flex-col text-neutral gap-2">
        <i class="fa-solid fa-money-bill-trend-up text-2xl"></i>
        <h2 class="text-3xl font-bold">PHP {(data.total.interest + data.total.principal).toLocaleString(undefined, MONETARY)}</h2>
        <p>Total Due</p>
      </div>
     </div>
      <div class="container bg-base-100 w-full  p-3 rounded">
          <div class="overflow-x-auto">
              <table class="table w-full">
                <!-- head -->
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <td>Total Due</td>
                    <td>Remaining Balance</td>
                    <td>Monthly Due</td>
                    <th>Tenure</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                      {#each data.loans as loan }
                        <tr>
                        <td>{loan.member?.givenName} {loan.member?.middleName} {loan.member?.surname}</td>
                        <td>{loan.principal.toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td>{loan.interest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</td>
                        <td>{(loan.principal + loan.interest).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        <td>{loan.remainingBalance.toLocaleString(undefined, MONETARY)}</td>
                        <td>{((loan.principal + loan.interest) / loan.tenure).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</td>
                        <td>{loan.tenure > 1 ? `${loan.tenure} months`: `${loan.tenure} month`} </td>
                        <td>
                          <button class="btn btn-secondary btn-outline" on:click={()=>{ openLoanRepaymentModal(loan.id ?? "") }}> <i class="fa-solid fa-money-bill"></i></button>
                        </td>
                        </tr>
                      {/each
  
                      }
                </tbody>
              </table>
            </div>
  
  
        </div>
  
  </div>
  <Modal isOpen={isRepaymentModalOpen} close={()=>{isRepaymentModalOpen = false}} modalBoxClass={"w-11/12 max-w-5xl"}>
    <div class="flex mt-3 gap-2 w-full bg-white shadow-sm p-5 border">
      <div>
          <img src="https://api.dicebear.com/6.x/initials/svg?seed={selectedLoan?.member?.givenName} {selectedLoan?.member?.surname}&backgroundColor=EB7C2A" alt="avatar" class="w-10 rounded-full">
      </div>
      <div class="flex flex-col justify-center">
      <span class="font-bold">{selectedLoan?.member?.givenName} {selectedLoan?.member?.middleName} {selectedLoan?.member?.surname}</span>
      <small class="text-gray-400">{selectedLoan?.member?.id}</small>
      </div>
     
  </div> 
  <div class="mt-2">
    <table class="table w-full">
      <!-- head -->
      <thead>
        <tr>
          <th>Total</th>
          <th>Paid</th>
          <th>Balance</th>
        </tr>
      </thead>
     <tbody>
      <tr>
      <td>{selectedLoan?.totalDue.toLocaleString(undefined, MONETARY)}</td>
      <td>{selectedLoan?.interest.toLocaleString(undefined, MONETARY)}</td>
      <td>{selectedLoan?.remainingBalance.toLocaleString(undefined, MONETARY)}</td>
    </tr>
      </tbody>
    </table>
  </div>
  <div>
    <form use:addRepaymentForm>
      <div class="grid grid-cols">
        <TextField label="Amount" value={$addRepaymentData.amount} name="amount" type="number" error={$addRepaymentErrors.amount?.[0]}></TextField>
        <TextAreaField label="Remarks" name="remarks"></TextAreaField>
      </div>
      <div class="mt-2">
        <button class="btn btn-primary text-white" disabled={$isSubmitting}>Add Repayment</button>
        <button class="btn btn-secondary btn-outline text-white" on:click={()=>{isRepaymentModalOpen = false}}>Cancel</button>
      </div>
   
    </form>
  </div>

  </Modal>
  <!-- <ConfirmDialog isOpen={isDisburseLoanDialogOpen} close={()=>{isDisburseLoanDialogOpen =  false}} title={"Disburse Loan"} text={"Are you sure you want to disburse this loan?"} onConfirm={disburseLoan} type="info" confirmBtnText="Yes, Disburse It!"/> -->
  <Toaster/>
  
  
  
  
  
  
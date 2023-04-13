<script lang="ts">

    import toast, { Toaster } from "svelte-french-toast";
    import axios from "axios";
    import { invalidate } from "$app/navigation";
    import ConfirmDialog from "$lib/components/ui/ConfirmDialog.svelte";
    import type { Loan } from "$lib/definitions/types.js";
    import { LoanStatuses } from "$lib/internal/transaction.js";
  
    export let data;

    let isDisburseLoanDialogOpen = false
    let selectedLoan:Loan;
    const disburseLoan = async()=>{
        try{
        await axios.patch(`/api/loans/${selectedLoan?.id}`, {status:LoanStatuses.Disbursed})
        invalidate((url)=>url.pathname === "/api/loans")
        invalidate((url)=>url.pathname === "/api/loans/total")
        toast.success("Loan has been disbursed.")
     }
     catch{
        toast.error("Unknown error occured, Please try again later.")
     }
     finally{
        isDisburseLoanDialogOpen = false
     }
    }

  </script>
  <div>
      <h1 class="text-lg font-semibold mb-3 ml-1 text-gray-500">Disbursed Loans</h1>
     <div class="container bg-base-100 w-full  p-3 rounded mb-8 h-56 flex">
  
      <div class="basis-1/2 h-full  flex items-center justify-center flex-col text-success gap-2">
        <i class="fa-solid fa-briefcase text-2xl"></i>
        <h2 class="text-3xl font-bold">PHP {data.total.principal}</h2>
       <p>Total Disbursed Loans</p>
      </div>
      <div class="basis-1/2 h-full  flex items-center justify-center flex-col text-secondary gap-2">
        <i class="fa-solid fa-chart-pie text-2xl"></i>
        <h2 class="text-3xl font-bold">PHP {data.total.interest}</h2>
        <p>Total Interest</p>
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
                          <button class="btn btn-secondary btn-outline" on:click={()=>{selectedLoan = loan; isDisburseLoanDialogOpen = true }}> <i class="fa-solid fa-money-bill"></i></button>
                          
                        </td>
                        </tr>
                      {/each
  
                      }
                </tbody>
              </table>
            </div>
  
  
        </div>
  
  </div>
  <ConfirmDialog isOpen={isDisburseLoanDialogOpen} close={()=>{isDisburseLoanDialogOpen =  false}} title={"Disburse Loan"} text={"Are you sure you want to disburse this loan?"} onConfirm={disburseLoan} type="info" confirmBtnText="Yes, Disburse It!"/>
  <Toaster/>
  
  
  
  
  
  
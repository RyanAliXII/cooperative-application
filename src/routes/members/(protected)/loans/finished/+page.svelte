<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";
  import type { Loan, Member } from "$lib/definitions/types";
  import { MONETARY } from "$lib/internal/config.js";
  import { createForm } from "felte";

  export let data;

  let isLoanPreviewModalOpen = false;

  let selectedLoan: Loan;

  const { data: editLoanData } = createForm({
    initialValues: {
      id: "",
      memberId: 0,
      amount: 0,
      interest: 0,
      tenure: 0,
    },
  });

  const preview = (loan: Loan) => {
    editLoanData.update(() => ({
      id: loan.id ?? "",
      memberId: loan.memberId,
      amount: loan.principal,
      interest: (loan.interest / loan.principal) * 100,
      tenure: loan.tenure,
    }));
    isLoanPreviewModalOpen = true;
    selectedLoan = loan;
  };

  $: editLoanInterest =
    (($editLoanData.interest ?? 0) / 100) * ($editLoanData.amount ?? 0);
  $: editLoanTotalDue = ($editLoanData.amount ?? 0) + editLoanInterest;
  $: editLoanRepaymentPrincipal = $editLoanData.amount / $editLoanData.tenure;
  $: editLoanRepaymentInterest = editLoanInterest / $editLoanData.tenure;
  $: editLoanRepaymentTotalDue =
    editLoanRepaymentPrincipal + editLoanRepaymentInterest;
</script>

<div>
  <h1 class="text-lg font-semibold mb-3 ml-1 text-gray-500">Finished Loans</h1>
  <div class="container bg-base-100 w-full p-3 rounded mb-8 h-56 flex">
    <div
      class="basis-1/2 h-full flex items-center justify-center flex-col text-success gap-2"
    >
      <i class="fa-solid fa-briefcase text-2xl" />
      <h2 class="text-3xl font-bold">
        PHP {data.memberStats.finishedLoan.toLocaleString(undefined, MONETARY)}
      </h2>
      <p>Total Finished Loans</p>
    </div>
    <div
      class="basis-1/2 h-full flex items-center justify-center flex-col text-secondary gap-2"
    >
      <i class="fa-solid fa-chart-pie text-2xl" />
      <h2 class="text-3xl font-bold">
        PHP {data.memberStats.finishedLoanInterest.toLocaleString(
          undefined,
          MONETARY
        )}
      </h2>
      <p>Total Loan Interest</p>
    </div>
  </div>
  <div class="container bg-base-100 w-full p-3 rounded">
    <div class="overflow-x-auto">
      <table class="table w-full">
        <!-- head -->
        <thead>
          <tr>
            <th>Principal</th>
            <th>Interest</th>
            <td>Total Due</td>
            <td>Monthly Due</td>
            <th>Tenure</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {#each data.loans as loan}
            <tr>
              <td>{loan.principal.toLocaleString(undefined, MONETARY)}</td>
              <td>{loan.interest.toLocaleString(undefined, MONETARY)}</td>
              <td
                >{(loan.principal + loan.interest).toLocaleString(
                  undefined,
                  MONETARY
                )}</td
              >
              <td
                >{(
                  (loan.principal + loan.interest) /
                  loan.tenure
                ).toLocaleString(undefined, MONETARY)}</td
              >
              <td
                >{loan.tenure > 1
                  ? `${loan.tenure} months`
                  : `${loan.tenure} month`}
              </td>
              <td>
                <button
                  class="btn btn-info btn-outline"
                  on:click={() => {
                    preview(loan);
                  }}
                >
                  <i class="fa-solid fa-eye" /></button
                >
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- Loan Preview Modal -->
<Modal
  isOpen={isLoanPreviewModalOpen}
  modalBoxClass={"w-11/12 max-w-5xl"}
  close={() => {
    isLoanPreviewModalOpen = false;
  }}
>
  <div
    class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5"
  >
    <i class="fa-solid fa-calendar" />LOAN SCHEDULE
  </div>
  <div class=" w-full h-30 rounded p-5">
    <div class="grid grid-cols-2 border-b py-2">
      <span>Principal</span>
      <span class="font-bold"
        >{$editLoanData?.amount?.toLocaleString(undefined, MONETARY) ?? 0}</span
      >
    </div>
    <div class="grid grid-cols-2 border-b py-2">
      <span>Interest</span>
      <span class="font-bold"
        >{editLoanInterest?.toLocaleString(undefined, MONETARY)}</span
      >
    </div>
    <div class="grid grid-cols-2 border-b py-2">
      <span>Total Due</span>
      <span class="font-bold"
        >{editLoanTotalDue?.toLocaleString(undefined, MONETARY)}</span
      >
    </div>
  </div>

  <div class=" w-full h-30 rounded p-5 flex flex-col gap-1">
    <h3 class="font-bold mb-2">Repayment</h3>
    <div class="px-2">
      <div class="grid grid-cols-2 py-2 border-b">
        <span>Principal</span>
        <span class="font-bold"
          >{isNaN(editLoanRepaymentPrincipal) ||
          !isFinite(editLoanRepaymentPrincipal)
            ? (0).toLocaleString(undefined, MONETARY)
            : editLoanRepaymentPrincipal?.toLocaleString(
                undefined,
                MONETARY
              )}</span
        >
      </div>
      <div class="grid grid-cols-2 py-2 border-b">
        <span>Interest</span>
        <span class="font-bold"
          >{isNaN(editLoanRepaymentInterest) ||
          !isFinite(editLoanRepaymentPrincipal)
            ? (0).toLocaleString(undefined, MONETARY)
            : editLoanRepaymentInterest?.toLocaleString(
                undefined,
                MONETARY
              )}</span
        >
      </div>

      <div class="grid grid-cols-2 py-2 border-b">
        <span>Total Monthly Due</span>
        <span class="font-bold"
          >{isNaN(editLoanRepaymentTotalDue) ||
          !isFinite(editLoanRepaymentPrincipal)
            ? (0).toLocaleString(undefined, MONETARY)
            : editLoanRepaymentTotalDue.toLocaleString(
                undefined,
                MONETARY
              )}</span
        >
      </div>
    </div>
  </div></Modal
>
<!-- End of Loan Preview Modal -->

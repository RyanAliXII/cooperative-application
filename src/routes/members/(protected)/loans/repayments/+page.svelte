<script lang="ts">
  import { MONETARY } from "$lib/internal/config.js";

  export let data;
</script>

<div>
  <h1 class="text-lg font-semibold mb-3 ml-1 text-gray-500">Loan Repayments</h1>
  <div class="container bg-base-100 w-full p-3 rounded mb-8 flex">
    <div class="overflow-x-auto w-full">
      <table class="table w-full">
        <!-- head -->
        <thead>
          <tr>
            <th>Created On</th>
            <th>Loan Interest</th>
            <th>Amount Paid</th>
            <th>Remaining Balance</th>
            <th>Balance Before Repayment</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {#each data.repayments as repayment}
            <tr>
              <td>{new Date(repayment.createdAt).toLocaleString()}</td>
              <td
                >{((repayment?.loan?.interest ?? 0) /
                  (repayment?.loan?.principal ?? 0)) *
                  100}%</td
              >
              <td>{repayment.amountPaid.toLocaleString(undefined, MONETARY)}</td
              >
              <td
                >{repayment.loan?.remainingBalance.toLocaleString(
                  undefined,
                  MONETARY
                )}</td
              >
              <td
                >{repayment.balanceBeforeRepayment.toLocaleString(
                  undefined,
                  MONETARY
                )}</td
              >
              <td
                >{repayment.remarks.length === 0
                  ? "No Remarks"
                  : repayment.remarks}
              </td>
            </tr>{/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<script lang="ts">
  import { SavingsTransactionTypes } from "$lib/internal/transaction.js";
  import { MONETARY } from "$lib/internal/config.js";
  export let data;
</script>

<div class="container">
  <h1 class="text-lg font-semibold mb-3 ml-1 text-gray-500">Savings</h1>
  <div class="container bg-base-100 w-full p-3 rounded mb-8 h-56 flex">
    <div
      class="basis-1/2 h-full flex items-center justify-center flex-col text-success gap-2"
    >
      <i class="fa-solid fa-signal text-2xl" />
      <h2 class="text-3xl font-bold">
        PHP {data.memberStats.savings.toLocaleString(undefined, MONETARY)}
      </h2>
      <p>Total Savings</p>
    </div>
    <div
      class="basis-1/2 h-full flex items-center justify-center flex-col text-error gap-2"
    >
      <i class="fa-solid fa-arrow-trend-down text-2xl" />
      <h2 class="text-3xl font-bold">
        PHP {data.memberStats.savingsWithdrawal.toLocaleString(
          undefined,
          MONETARY
        )}
      </h2>
      <p>Total Savings Withdrawal</p>
    </div>
  </div>

  <div class="overflow-x-auto">
    <table class="table w-full">
      <!-- head -->
      <thead>
        <tr>
          <th>Created On</th>
          <th>Amount</th>
          <th>Transaction type</th>
          <th>Remarks</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {#each data.savings as saving}
          <tr>
            <td>{new Date(saving.createdAt).toLocaleString()}</td>
            <td
              class:text-success={saving.type ===
                SavingsTransactionTypes.Deposit}
              class:text-error={saving.type ===
                SavingsTransactionTypes.Withdraw}
            >
              {saving.type === SavingsTransactionTypes.Deposit
                ? `+ ${saving.amount}`
                : `- ${saving.amount}`}</td
            >
            <td
              >{saving.type === SavingsTransactionTypes.Deposit
                ? "Deposit"
                : "Withdrawal"}</td
            >
            <td />
            <td>{saving.remarks}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<script lang="ts">
  import { SharesTransactionTypes } from "$lib/internal/transaction.js";
  import { MONETARY } from "$lib/internal/config.js";
  export let data;
</script>

<div class="container">
  <h1 class="text-lg font-semibold mb-3 ml-1 text-gray-500">Shares</h1>
  <div class="container bg-base-100 w-full p-3 rounded mb-8 h-56 flex">
    <div
      class="basis-1/2 h-full flex items-center justify-center flex-col text-success gap-2"
    >
      <i class="fa-solid fa-signal text-2xl" />
      <h2 class="text-3xl font-bold">
        PHP {data.memberStats.shares.toLocaleString(undefined, MONETARY)}
      </h2>
      <p>Total Shares</p>
    </div>
    <div
      class="basis-1/2 h-full flex items-center justify-center flex-col text-error gap-2"
    >
      <i class="fa-solid fa-arrow-trend-down text-2xl" />
      <h2 class="text-3xl font-bold">
        PHP {data.memberStats.sharesWithdrawal.toLocaleString(
          undefined,
          MONETARY
        )}
      </h2>
      <p>Total Shares Withdrawal</p>
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
        {#each data.shares as share}
          <tr>
            <td>{new Date(share.createdAt).toLocaleString()}</td>
            <td
              class:text-success={share.type === SharesTransactionTypes.Deposit}
              class:text-error={share.type === SharesTransactionTypes.Withdraw}
            >
              {share.type === SharesTransactionTypes.Deposit
                ? `+ ${share.amount}`
                : `- ${share.amount}`}</td
            >
            <td
              >{share.type === SharesTransactionTypes.Deposit
                ? "Deposit"
                : "Withdrawal"}</td
            >
            <td />
            <td>{share.remarks}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<script lang="ts">
  import { MONETARY } from "$lib/internal/config.js";

  export let data;
</script>

<div class="container w-full rounded mt-5">
  <div class="container w-full rounded mb-8 grid grid-cols-2 gap-5">
    <div
      class="basis-6/12 h-full bg-base-100 flex items-center justify-center flex-col text-secondary gap-3 p-5 rounded"
    >
      <i class="fa-solid fa-piggy-bank text-2xl" />
      <h2 class="text-3xl font-bold">
        PHP {data.stat.shares.toLocaleString(undefined, MONETARY)}
      </h2>
      <p>Savings</p>
    </div>
    <div
      class="basis-6/12 h-full bg-base-100 flex items-center justify-center flex-col text-amber-500 gap-3 p-5 rounded"
    >
      <i class="fa-solid fa-money-bill-transfer text-2xl" />
      <h2 class="text-3xl font-bold">
        PHP {data.stat.savings.toLocaleString(undefined, MONETARY)}
      </h2>
      <p>Shares</p>
    </div>

    <div
      class="basis-6/12 h-full bg-base-100 flex items-center justify-center flex-col text-indigo-500 gap-3 p-5 rounded"
    >
      <i class="fa-solid fa-solid fa-landmark text-2xl" />
      <h2 class="text-3xl font-bold">
        PHP {data.stat.requestedLoan.toLocaleString(undefined, MONETARY)}
      </h2>
      <p>Requested Loans</p>
    </div>
    <div
      class="basis-6/12 h-full bg-base-100 flex items-center justify-center flex-col text-black gap-3 p-5 rounded"
    >
      <i class="fa-solid fa-solid fa-landmark text-2xl" />
      <h2 class="text-3xl font-bold">
        PHP {data.stat.approvedLoan.toLocaleString(undefined, MONETARY)}
      </h2>
      <p>Approved Loans</p>
    </div>
    <div
      class="basis-6/12 h-full bg-base-100 flex items-center justify-center flex-col text-yellow-500 gap-3 p-5 rounded"
    >
      <i class="fa-solid fa-solid fa-landmark text-2xl" />
      <h2 class="text-3xl font-bold">
        PHP {data.stat.disbursedLoan.toLocaleString(undefined, MONETARY)}
      </h2>
      <p>Disbursed Loans</p>
    </div>

    <div
      class="basis-6/12 h-full bg-base-100 flex items-center justify-center flex-col text-success gap-3 p-5 rounded"
    >
      <i class="fa-solid fa-solid fa-landmark text-2xl" />
      <h2 class="text-3xl font-bold">
        PHP {data.stat.finishedLoan.toLocaleString(undefined, MONETARY)}
      </h2>
      <p>Finished Loans</p>
    </div>
  </div>
</div>

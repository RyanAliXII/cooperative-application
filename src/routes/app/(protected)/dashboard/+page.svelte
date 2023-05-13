<script lang="ts">
  export let data;
</script>

<div class="container w-full rounded mt-5">
  <div class="container w-full rounded mb-8 grid grid-cols-2 gap-5">
    <a
      href="/app/cooperatives"
      class="basis-6/12 h-full bg-base-100 flex items-center justify-center flex-col text-success gap-3 p-5 rounded"
    >
      <i class="fa-solid fa-people-roof text-2xl" />
      <h2 class="text-3xl font-bold">{data.cooperatives.count}</h2>
      <p>Cooperatives</p>
    </a>
    <div
      class="basis-6/12 h-full bg-base-100 flex items-center justify-center flex-col text-secondary gap-3 p-5 rounded"
    >
      <i class="fa-solid fa-user text-2xl" />
      <h2 class="text-3xl font-bold">{data.members.count}</h2>
      <p>Members</p>
    </div>

    <a
      href="/app/recognitions"
      class="basis-6/12 h-full bg-base-100 flex items-center justify-center flex-col text-primary gap-3 p-5 rounded"
    >
      <i class="fa-solid fa-award text-2xl" />
      <h2 class="text-3xl font-bold">{data.recognitions.count}</h2>
      <p>Awards Given</p>
    </a>
    <a
      href="/app/cooperatives/categories"
      class="basis-6/12 h-full bg-base-100 flex items-center justify-center flex-col text-indigo-500 gap-3 p-5 rounded"
    >
      <i class="fa-solid fa-list text-2xl" />
      <h2 class="text-3xl font-bold">{data.categories.count}</h2>
      <p>Cooperative Categories</p>
    </a>
  </div>
</div>

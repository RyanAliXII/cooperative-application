<script>
  import toast, { Toaster } from "svelte-french-toast";

  export let data;
  export let form;
  if (form?.success) {
    toast.success(form?.message);
  }
</script>

<div>
  <h1 class="text-lg font-semibold mb-3 text-gray-500">Cooperative Members</h1>
  <div class="container bg-base-100 w-full p-3 rounded">
    <div class="overflow-x-auto">
      <table class="table w-full">
        <!-- head -->
        <thead>
          <tr>
            <th>Given name</th>
            <th>Middle name</th>
            <th>Surname</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {#each data.members as member}
            <tr>
              <td>
                {member.givenName}
              </td>
              <td>
                {member.middleName}
              </td>
              <td>
                {member.surname}
              </td>

              <td class="flex gap-2"
                ><a
                  href="/cooperatives/members/view/{member.id}"
                  class="btn btn-outline btn-info"
                  ><i class="fa-regular fa-eye" /></a
                >
                <form method="POST" action="?/exit">
                  <input type="hidden" name="memberId" value={member.id} />
                  <button class="btn btn-error btn-outline" type="submit">
                    <i class="fa-solid fa-right-from-bracket" />
                  </button>
                </form>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<Toaster />

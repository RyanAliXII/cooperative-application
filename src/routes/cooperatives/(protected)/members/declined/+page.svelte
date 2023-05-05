<script lang="ts">
  import type { MemberAccount } from "$lib/definitions/types";
  import axios from "axios";
  import toast, { Toaster } from "svelte-french-toast";

  export let data;
  export let form;

  if (form?.success) {
    toast.success(form?.message);
  }
  if (form?.error) {
    toast.error(form?.message);
  }
  let accounts: MemberAccount[] = data?.accounts;
</script>

<div>
  <h1 class="text-lg font-semibold mb-3 text-gray-500">Declined Members</h1>
  <div class="container bg-base-100 w-full p-3 rounded">
    <div class="overflow-x-auto">
      <table class="table w-full">
        <!-- head -->
        <thead>
          <tr>
            <th>Given name</th>
            <th>Surname</th>
            <th>Date of Birth</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {#each accounts as account}
            <tr>
              <td>
                {account.member.givenName}
              </td>
              <td>
                {account.member.surname}
              </td>
              <td>
                {account.member.birthday}
              </td>
              <td class="flex gap-2">
                <form method="POST" action="?/approve">
                  <input
                    type="hidden"
                    name="memberId"
                    value={account.member.id}
                  />
                  <button class="btn btn-success btn-outline" type="submit"
                    >Approve</button
                  >
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

<script lang="ts">
  import axios from "axios";

  export let data;
  import "sweetalert2/src/sweetalert2.scss";
  let sidebarState: Record<string, boolean> = {
    registration: false,
    loan: false,
  };
  function toggle(sidebarKey: string) {
    sidebarState[sidebarKey] = !sidebarState[sidebarKey];
  }
  const logout = async () => {
    await axios.delete("/api/logout");
    location.reload();
  };
</script>

<main>
  <header class="navbar bg-base-100">
    <div class="flex-none">
      <button class="btn btn-square btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block w-5 h-5 stroke-current"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          /></svg
        >
      </button>
    </div>
    <div class="flex-1">
      <a href="/" class="btn btn-ghost normal-case text-xl"
        >{data.sessionData?.member?.cooperative?.name}</a
      >
    </div>
    <div class="flex-none">
      <button class="btn btn-square btn-ghost">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block w-5 h-5 stroke-current"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          /></svg
        >
      </button>
    </div>
  </header>

  <div class="min-h-screen w-full flex">
    <div class="h-full bg-white hidden lg:block">
      <ul class="menu bg-base-100 w-64 p-2 rounded-box">
        <li>
          <a href="/members/dashboard">
            <i class="fa-solid fa-chart-line" />
            Dashboard
          </a>
        </li>

        <li>
          <a href="/members/shares">
            <i class="fa-solid fa-money-bill-transfer" />
            Shares
          </a>
        </li>
        <li>
          <a href="/members/savings">
            <i class="fa-solid fa-piggy-bank" />
            Savings
          </a>
        </li>

        <li>
          <button
            type="button"
            on:click={() => {
              toggle("loan");
            }}
          >
            <i class="fa-solid fa-landmark" />
            Loans
          </button>
          {#if sidebarState["loan"]}
            <div class="pl-10 text-sm hover:bg-white">
              <a href="/members/loans/requested"> Requested Loans </a>
            </div>
            <div class="pl-10 text-sm hover:bg-white">
              <a href="/members/loans/approved"> Approved Loans </a>
            </div>
            <div class="pl-10 text-sm hover:bg-white">
              <a href="/members/loans/disbursed"> Disbursed Loans </a>
            </div>
            <div class="pl-10 text-sm hover:bg-white">
              <a href="/members/loans/finished"> Finished Loans </a>
            </div>
            <div class="pl-10 text-sm hover:bg-white">
              <a href="/members/loans/repayments"> Loan Repayments </a>
            </div>
          {/if}
        </li>
        <li>
          <a href="/members/profile">
            <i class="fa-solid fa-user" />
            Profile
          </a>
        </li>
        <li>
          <button
            type="submit"
            on:click={() => {
              logout();
            }}
          >
            <i class="fa-solid fa-right-from-bracket" />
            Sign Out
          </button>
        </li>
      </ul>
    </div>
    <div class="w-full bg-gray-100 p-5">
      <slot />
    </div>
  </div>
</main>

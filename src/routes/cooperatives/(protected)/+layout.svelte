<script lang="ts">
  import axios from "axios";
  import "sweetalert2/src/sweetalert2.scss";
  export let data;
  let sidebarState: Record<string, boolean> = {
    registration: false,
    loan: false,
    share: false,
    saving: false,
  };
  function toggle(sidebarKey: string) {
    sidebarState[sidebarKey] = !sidebarState[sidebarKey];
  }
  const logout = async () => {
    await axios.delete("/api/logout");
    location.reload();
  };
  let isSidebarOpen = true;
  const toggleSidebar = () => {
    isSidebarOpen = !isSidebarOpen;
  };
  const handleSidebarClick = (event: MouseEvent) => {
    const target = event.target as HTMLDivElement;
    if (target.classList.contains("backdrop")) {
      toggleSidebar();
    }
  };
</script>

<main>
  <header class="navbar bg-base-100">
    <div class="flex-none">
      <button
        class="btn btn-square btn-ghost lg:hidden"
        on:click={toggleSidebar}
      >
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
      <a
        href="/cooperatives/dashboard"
        class="btn btn-ghost normal-case text-xl">{data?.cooperative?.name}</a
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

  <div class=" w-full flex" style="min-height:100vh;">
    <div class="h-full bg-white hidden lg:block">
      <ul class="menu bg-base-100 w-64 p-2 rounded-box">
        <li>
          <a href="/cooperatives/dashboard">
            <i class="fa-solid fa-chart-line" />
            Dashboard
          </a>
        </li>
        <li>
          <small class="hover:bg-white text-xs">Application</small>
          <button
            type="button"
            on:click={() => {
              toggle("registration");
            }}
          >
            <i class="fa-solid fa-briefcase" />
            Registration
          </button>
          {#if sidebarState["registration"]}
            <div class="pl-10 mt-1 text-sm hover:bg-white">
              <a href="/cooperatives/members/register"> Add Member </a>
            </div>
            <div class="pl-10 text-sm hover:bg-white">
              <a href="/cooperatives/members"> Members </a>
            </div>
            <div class="pl-10 mt-1 text-sm hover:bg-white">
              <a href="/cooperatives/members/pending"> Pending Members </a>
            </div>
            <div class="pl-10 mt-1 text-sm hover:bg-white">
              <a href="/cooperatives/members/declined"> Declined Members </a>
            </div>
            <div class="pl-10 mt-1 text-sm hover:bg-white">
              <a href="/cooperatives/members/exited"> Exited Members </a>
            </div>
          {/if}
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
              <a href="/cooperatives/loans/requested"> Requested Loans </a>
            </div>

            <div class="pl-10 text-sm hover:bg-white">
              <a href="/cooperatives/loans/approved"> Approved Loans </a>
            </div>
            <div class="pl-10 text-sm hover:bg-white">
              <a href="/cooperatives/loans/disbursed"> Disbursed Loans </a>
            </div>
            <div class="pl-10 text-sm hover:bg-white">
              <a href="/cooperatives/loans/finished"> Finished Loans </a>
            </div>
            <div class="pl-10 text-sm hover:bg-white">
              <a href="/cooperatives/loans/repayments"> Loan Repayments </a>
            </div>
          {/if}
        </li>

        <li>
          <button
            type="button"
            on:click={() => {
              toggle("share");
            }}
          >
            <i class="fa-solid fa-money-bill-transfer" />
            Shares
          </button>
          {#if sidebarState["share"]}
            <div class="pl-10 text-sm hover:bg-white">
              <a href="/cooperatives/shares"> Add Share </a>
            </div>

            <div class="pl-10 text-sm hover:bg-white">
              <a href="/cooperatives/shares/withdrawal"> Share Withdrawal </a>
            </div>
          {/if}
        </li>

        <li>
          <button
            type="button"
            on:click={() => {
              toggle("saving");
            }}
          >
            <i class="fa-solid fa-piggy-bank" />
            Savings
          </button>
          {#if sidebarState["saving"]}
            <div class="pl-10 text-sm hover:bg-white">
              <a href="/cooperatives/savings"> Add Saving </a>
            </div>

            <div class="pl-10 text-sm hover:bg-white">
              <a href="/cooperatives/savings/withdrawal"> Saving Withdrawal </a>
            </div>
          {/if}
        </li>
        <li>
          <a href="/cooperatives/settings">
            <i class="fa-solid fa-gear" />
            Settings
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
  <div
    class:hidden={!isSidebarOpen}
    class="fixed top-0 w-screen bg-base-300 bg-opacity-60 h-screen lg:hidden backdrop"
    style="z-index: 11;"
    on:click={handleSidebarClick}
    role="presentation"
  >
    <div class="bg-white w-8/12 h-full">
      <ul class="menu bg-base-100 w-full p-2 rounded-box">
        <li>
          <a href="/cooperatives/dashboard">
            <i class="fa-solid fa-chart-line" />
            Dashboard
          </a>
        </li>
        <li>
          <small class="hover:bg-white text-xs">Application</small>
          <button
            type="button"
            on:click={() => {
              toggle("registration");
            }}
          >
            <i class="fa-solid fa-briefcase" />
            Registration
          </button>
          {#if sidebarState["registration"]}
            <div class="pl-10 mt-1 text-sm hover:bg-white">
              <a href="/cooperatives/members/register"> Add Member </a>
            </div>
            <div class="pl-10 text-sm hover:bg-white">
              <a href="/cooperatives/members"> Members </a>
            </div>
            <div class="pl-10 mt-1 text-sm hover:bg-white">
              <a href="/cooperatives/members/pending"> Pending Members </a>
            </div>
          {/if}
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
              <a href="/cooperatives/loans/requested"> Requested Loans </a>
            </div>

            <div class="pl-10 text-sm hover:bg-white">
              <a href="/cooperatives/loans/approved"> Approved Loans </a>
            </div>
            <div class="pl-10 text-sm hover:bg-white">
              <a href="/cooperatives/loans/disbursed"> Disbursed Loans </a>
            </div>
            <div class="pl-10 text-sm hover:bg-white">
              <a href="/cooperatives/loans/finished"> Finished Loans </a>
            </div>
            <div class="pl-10 text-sm hover:bg-white">
              <a href="/cooperatives/loans/repayments"> Loan Repayments </a>
            </div>
          {/if}
        </li>

        <li>
          <button
            type="button"
            on:click={() => {
              toggle("share");
            }}
          >
            <i class="fa-solid fa-money-bill-transfer" />
            Shares
          </button>
          {#if sidebarState["share"]}
            <div class="pl-10 text-sm hover:bg-white">
              <a href="/cooperatives/shares"> Add Share </a>
            </div>

            <div class="pl-10 text-sm hover:bg-white">
              <a href="/cooperatives/shares/withdrawal"> Share Withdrawal </a>
            </div>
          {/if}
        </li>

        <li>
          <button
            type="button"
            on:click={() => {
              toggle("saving");
            }}
          >
            <i class="fa-solid fa-piggy-bank" />
            Savings
          </button>
          {#if sidebarState["saving"]}
            <div class="pl-10 text-sm hover:bg-white">
              <a href="/cooperatives/savings"> Add Saving </a>
            </div>

            <div class="pl-10 text-sm hover:bg-white">
              <a href="/cooperatives/savings/withdrawal"> Saving Withdrawal </a>
            </div>
          {/if}
        </li>
        <li>
          <a href="/cooperatives/settings">
            <i class="fa-solid fa-gear" />
            Settings
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
  </div>
</main>

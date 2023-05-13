<script lang="ts">
  import TextField from "$lib/components/form/TextField.svelte";
  import TextAreaField from "$lib/components/form/TextAreaField.svelte";
  import toast, { Toaster } from "svelte-french-toast";
  import axios from "axios";
  import { EditCooperativeSchema } from "$lib/definitions/schema";
  import { createForm } from "felte";
  import { validator } from "@felte/validator-yup";
  import Swal from "sweetalert2";
  import OveviewTab from "./OveviewTab.svelte";
  import type { CooperativeStats } from "$lib/definitions/types";
  import {
    SavingsTransactionTypes,
    SharesTransactionTypes,
  } from "$lib/internal/transaction";
  import { MONETARY } from "$lib/internal/config";
  import SelectField from "$lib/components/form/SelectField.svelte";

  export let data;
  let isViewMode = true;
  const id = data?.cooperative?.id;
  const {
    form,
    errors,
    data: formData,
    setErrors,
  } = createForm({
    initialValues: {
      ...data.cooperative,
      categoryId: data.cooperative?.categoryId ?? "",
      registrationDate: data.cooperative?.registrationDate ?? "",
    },
    onSubmit: async (body) => {
      if (isViewMode) return;
      try {
        const isTaken = await validateEmail()
        if(isTaken) {
          return
        }
        const response = await axios.put(`/api/cooperatives/${id}`, body);
        const { data } = response.data;
        toast.success("Cooperative has been updated.");
        isViewMode = true;
      } catch {
        toast.error("Unknown error occured, while updating resource.");
      }
    },
    onError: (er) => {
      console.log(er);
    },
    extend: validator({
      schema: EditCooperativeSchema,
      castValues: true,
      level: "error",
    }),
  });
  const toggleMode = () => {
    isViewMode = !isViewMode;
  };

  const resetPassword = async () => {
    const result = await Swal.fire({
      title: "Reset Password",
      icon: "warning",
      text: "Are you sure you want to reset the password for this cooperative account? This action cannot be reverted.",
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      try {
        const response = await axios.patch(
          `/api/cooperatives/${id}/accounts/password`
        );
        const { data } = response.data;
        Swal.fire(
          "New Password",
          `The new password for this cooperative account is <br> <strong>${data?.account.password}</strong> <br>. 
            Please keep the pasword since this will be the only time it will be shown.`,
          "info"
        );
      } catch {
        toast.error("Unknown error occured, while creating resource.");
      }
    }
  };
  type Tab = "details" | "account" | "transactions" | "overview";
  let activeTab: Tab = "details";

  const fallbackStat: CooperativeStats = {
    assets: 0,
    cooperativeId: "",
    liquidity: 0,
    loan: 0,
    cooperativeName: "",
    loanInterest: 0,
    members: 0,
    registrationFees: 0,
    savings: 0,
    savingsPrincipal: 0,
    shares: 0,
    sharesPrincipal: 0,
    withdrawnSavings: 0,
    withdrawnShares: 0,
    exitedMembers: 0,
    exitedRatio: 0,
  };

  const validateEmail = async () => {
    const response = await axios.get(
      `/api/cooperatives/email?email=${$formData.account.email}&except=${data.cooperative?.account.email}`
    );
    if (response.data.exist) {
      setErrors("account.email", "Email is taken.");
    }
    return response.data.exist;
  };
</script>

<div>
  <h1 class="text-lg font-semibold mb-3 text-gray-500">Cooperative</h1>
  <div class="tabs w-full">
    <button
      class="tab tab-lifted"
      class:tab-active={activeTab === "details"}
      on:click={() => {
        activeTab = "details";
      }}>Cooperative Details</button
    >
    <button
      class="tab tab-lifted"
      class:tab-active={activeTab === "overview"}
      on:click={() => {
        activeTab = "overview";
      }}>Overview</button
    >
    <button
      class="tab tab-lifted"
      class:tab-active={activeTab === "account"}
      on:click={() => {
        activeTab = "account";
      }}>Account</button
    >
    <button
      class="tab tab-lifted"
      class:tab-active={activeTab === "transactions"}
      on:click={() => {
        activeTab = "transactions";
      }}>Transactions</button
    >
  </div>

  {#if activeTab === "details"}
    <div class="container bg-base-100 w-full p-3 rounded">
      <div class="mb-10 mt-10 flex items-center gap-5 ml-3">
        <img
          src="https://api.dicebear.com/6.x/initials/svg?seed={data?.cooperative
            ?.name}&backgroundColor=EB7C2A"
          alt="avatar"
          class="w-12 rounded-full"
        />
        <div>
          <h1 class="text-lg font-bold">{data?.cooperative?.name}</h1>
          <small class="text-gray-500"
            >Cooperative ID: {data?.cooperative?.id}</small
          >
        </div>
      </div>
      {#if isViewMode}
        <button
          class="btn btn-secondary btn-outline my-3 mx-1"
          on:click={toggleMode}
          ><i class="fa-regular fa-pen-to-square mr-2" /> Switch to Edit Mode</button
        >
      {:else}
        <button
          class="btn btn-secondary btn-outline my-3 mx-1"
          on:click={toggleMode}
          ><i class="fa-regular fa-eye mr-2" /> Switch to View Mode</button
        >
      {/if}

      <form use:form>
        <form use:form>
          <div
            class="w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2"
          >
            <i class="fa-regular fa-address-card" /> COOPERATIVE INFO
          </div>
          <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
            <TextField
              label="Cooperative name"
              labelFor="name"
              error={$errors?.name?.[0]}
              name="name"
              disabled={isViewMode}
            />
            <TextField
              label="Registration No"
              labelFor="registrationNumber"
              error={$errors?.registrationNumber?.[0]}
              name="registrationNumber"
              disabled={isViewMode}
            />
            <TextField
              label="Cooperative Initials"
              labelFor="initials"
              error={$errors?.initials?.[0]}
              name="initials"
              disabled={isViewMode}
            />
            <TextField
              error={$errors?.registrationDate?.[0]}
              name="registrationDate"
              label="Registration Date"
              labelFor="registrationDate"
              type="date"
              disabled={isViewMode}
            />
            <SelectField
              error={$errors?.categoryId?.[0]}
              name="categoryId"
              label="Category"
              labelFor="category"
              disabled={isViewMode}
            >
              {#each data?.categories ?? [] as category}
                <option value={category.id}>{category.name}</option>
              {/each}
            </SelectField>
          </div>

          <TextAreaField
            label="Address"
            labelFor="address"
            error={$errors?.address?.[0]}
            name="address"
            disabled={isViewMode}
          />

          <div
            class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5"
          >
            <i class="fa-regular fa-address-card" /> COOPERATIVE ACC. INFO
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
            <TextField
              label="Given name"
              labelFor="givenName"
              name="account.givenName"
              error={$errors?.account?.givenName?.[0]}
              disabled={isViewMode}
            />
            <TextField
              label="Middlename"
              labelFor="middleName"
              name="account.middleName"
              error={$errors?.account?.middleName?.[0]}
              disabled={isViewMode}
            />
            <TextField
              label="Surname"
              labelFor="surname"
              name="account.surname"
              error={$errors?.account?.surname?.[0]}
              disabled={isViewMode}
            />
            <TextField
              label="Email"
              labelFor="email"
              name="account.email"
              type="email"
              on:blur={validateEmail}
              error={$errors?.account?.email?.[0]}
              disabled={isViewMode}
            />

            <div class="mt-9 ml-3">
              <button
                type="button"
                class="btn btn-secondary"
                on:click={resetPassword}
                disabled={isViewMode ? true : false}
                ><i class="fa-solid fa-rotate mr-2" />Reset Password</button
              >
            </div>
          </div>
          <div class="mt-5 w-full flex justify-end">
            <button
              class=" btn btn-primary px-8 py-2 mr-2 mb-2 text-base-100"
              disabled={isViewMode ? true : false}
            >
              <i class="fa-regular fa-floppy-disk mr-2 text-lg" />
              Save</button
            >
          </div>
        </form>
      </form>
    </div>
  {/if}

  {#if activeTab === "account"}
    <div class="container bg-base-100 w-full p-3 rounded">
      <div
        class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5"
      >
        <i class="fa-regular fa-address-card" /> SAVINGS
      </div>

      <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
        <span>Savings Principal</span>
        <span class="font-bold"
          >PHP {data?.stat?.savingsPrincipal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) ?? 0}</span
        >
      </div>
      <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
        <span>Savings Withdrawal</span>
        <span class="font-bold"
          >PHP {data?.stat?.withdrawnSavings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) ?? 0}</span
        >
      </div>
      <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
        <span>Total Savings</span>
        <span class="font-bold"
          >PHP {data?.stat?.savings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) ?? 0}</span
        >
      </div>
      <div
        class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5"
      >
        <i class="fa-regular fa-address-card" /> SHARES
      </div>

      <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
        <span>Shares Principal</span>
        <span class="font-bold"
          >PHP {data?.stat?.sharesPrincipal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) ?? 0}</span
        >
      </div>

      <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
        <span>Shares Withdrawal</span>
        <span class="font-bold"
          >PHP {data?.stat?.withdrawnShares.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) ?? 0}</span
        >
      </div>
      <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
        <span>Total Shares</span>
        <span class="font-bold"
          >PHP {data?.stat?.shares.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) ?? 0}</span
        >
      </div>
      <div
        class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5"
      >
        <i class="fa-regular fa-address-card" /> LOAN
      </div>

      <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
        <span>Loan</span>
        <span class="font-bold"
          >PHP {data?.stat?.loan.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) ?? 0}</span
        >
      </div>
      <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
        <span>Loan Interest</span>
        <span class="font-bold"
          >PHP {data?.stat?.loanInterest.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) ?? 0}</span
        >
      </div>
      <div
        class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5"
      >
        <i class="fa-regular fa-address-card" /> SUMMARY
      </div>
      <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
        <span>Assets</span>
        <span class="font-bold"
          >PHP {data?.stat?.assets.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) ?? 0}</span
        >
      </div>
      <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
        <span>Liquidity</span>
        <span class="font-bold"
          >PHP {data?.stat?.liquidity.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) ?? 0}</span
        >
      </div>
    </div>
  {/if}

  {#if activeTab === "transactions"}
    <div class="container bg-base-100 w-full p-5 rounded">
      <div
        class="w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2"
      >
        <i class="fa-regular fa-address-card" /> SHARES TRANSACTIONS
      </div>

      <div class="overflow-x-auto w-full mt-5">
        <table class="table w-full">
          <!-- head -->
          <thead>
            <tr>
              <th>Created On</th>
              <th>Member</th>
              <th>Transaction Type</th>
              <th>Amount</th>
              <th>Remarks</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {#each data?.sharesTransactions ?? [] as shareTransaction}
              <tr>
                <td>{new Date(shareTransaction.createdAt).toLocaleString()}</td>
                <td
                  >{shareTransaction.member?.givenName}
                  {shareTransaction.member?.surname}</td
                >
                <td
                  >{shareTransaction.type === SharesTransactionTypes.Deposit
                    ? "Deposit"
                    : "Withdrawal"}</td
                >
                <td
                  class:text-success={shareTransaction.type ===
                    SharesTransactionTypes.Deposit}
                  class:text-error={shareTransaction.type ===
                    SharesTransactionTypes.Withdraw}
                >
                  {shareTransaction.type === SharesTransactionTypes.Deposit
                    ? `+ ${shareTransaction.amount}`
                    : `- ${shareTransaction.amount}`}</td
                >
                <td
                  >{shareTransaction.remarks.length === 0
                    ? "No Remarks"
                    : shareTransaction.remarks}</td
                >
                <td />
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <div
        class="w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2"
      >
        <i class="fa-regular fa-address-card" /> SAVINGS TRANSACTIONS
      </div>

      <div class="overflow-x-auto w-full mt-5">
        <table class="table w-full">
          <!-- head -->
          <thead>
            <tr>
              <th>Created On</th>
              <th>Member</th>
              <th>Transaction Type</th>
              <th>Amount</th>
              <th>Remarks</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {#each data.savingsTransactions ?? [] as savingsTransaction}
              <tr>
                <td
                  >{new Date(savingsTransaction.createdAt).toLocaleString()}</td
                >
                <td
                  >{savingsTransaction.member?.givenName}
                  {savingsTransaction.member?.surname}</td
                >
                <td
                  >{savingsTransaction.type === SavingsTransactionTypes.Deposit
                    ? "Deposit"
                    : "Withdrawal"}</td
                >
                <td
                  class:text-success={savingsTransaction.type ===
                    SavingsTransactionTypes.Deposit}
                  class:text-error={savingsTransaction.type ===
                    SavingsTransactionTypes.Withdraw}
                >
                  {savingsTransaction.type === SavingsTransactionTypes.Deposit
                    ? `+ ${savingsTransaction.amount}`
                    : `- ${savingsTransaction.amount}`}</td
                >
                <td
                  >{savingsTransaction.remarks.length === 0
                    ? "No Remarks"
                    : savingsTransaction.remarks}</td
                >
                <td />
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <div
        class="w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2"
      >
        <i class="fa-regular fa-address-card" /> LOAN REPAYMENTS
      </div>

      <div class="overflow-x-auto w-full mt-5">
        <table class="table w-full">
          <!-- head -->
          <thead>
            <tr>
              <th>Created On</th>
              <th>Member</th>
              <th>Loan Interest</th>
              <th>Amount Paid</th>
              <th>Remaining Balance</th>
              <th>Balance Before Repayment</th>
              <th>Remarks</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {#each data.repayments ?? [] as repayment}
              <tr>
                <td>{new Date(repayment.createdAt).toLocaleString()}</td>
                <td
                  >{repayment.loan?.member?.givenName ?? ""}
                  {repayment.loan?.member?.surname ?? ""}</td
                >
                <td
                  >{((repayment?.loan?.interest ?? 0) /
                    (repayment?.loan?.principal ?? 0)) *
                    100}%</td
                >
                <td
                  >{repayment.amountPaid.toLocaleString(
                    undefined,
                    MONETARY
                  )}</td
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
                    : repayment.remarks}</td
                >
                <td />
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
  {#if activeTab === "overview"}
    <div class="container bg-base-100 w-full p-3 rounded">
      <OveviewTab
        stat={data.stat ?? fallbackStat}
        liquidityLogs={data.liquidityLogs}
        shareLogs={data.shareLogs}
        savingLogs={data.savingLogs}
      />
    </div>
  {/if}
</div>

<Toaster />

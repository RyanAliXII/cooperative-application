<script lang="ts">
  import SelectField from "$lib/components/form/SelectField.svelte";
  import TextAreaField from "$lib/components/form/TextAreaField.svelte";
  import TextField from "$lib/components/form/TextField.svelte";
  import { createForm } from "felte";
  import { validator } from "@felte/validator-yup";
  import { EditMemberValidationSchema } from "$lib/definitions/schema";
  import axios from "axios";
  import toast, { Toaster } from "svelte-french-toast";
  import type { Member } from "$lib/definitions/types";
  import { MONETARY } from "$lib/internal/config.js";
  import {
    SavingsTransactionTypes,
    SharesTransactionTypes,
  } from "$lib/internal/transaction.js";
  import { invalidateAll } from "$app/navigation";

  let isViewMode = true;
  export let data;
  export let form;
  const {
    form: editMemberForm,
    data: body,
    errors,
  } = createForm<Member>({
    initialValues: data?.member,
    extend: [
      validator({ schema: EditMemberValidationSchema, castValues: true }),
    ],
    onSubmit: async (body) => {
      try {
        await axios.put(`/api/members/${data?.memberId}`, body, {
          withCredentials: true,
        });
        toast.success("Member data has been updated.");
        invalidateAll();
        isViewMode = true;
      } catch (error) {
        console.log(error);
        toast.error("Unknown error occured.");
      }
    },
  });

  const addDependent = () => {
    const newDependent = { name: "", relationship: "", birthday: "" };
    body.update((prev) => {
      prev.dependents.push(newDependent);
      return prev;
    });
  };
  const removeDependent = (index: number) => {
    body.update((prev) => {
      prev.dependents = prev.dependents.filter((_, i) => i != index);
      return prev;
    });
  };
  const toggleMode = () => {
    isViewMode = !isViewMode;
  };
  type Tab = "details" | "account" | "transactions" | "password";
  let activeTab: Tab = form?.error || form?.success ? "password" : "details";
</script>

<div>
  <h1 class="text-lg font-semibold mb-3 text-gray-500">Profile</h1>
  <div class="tabs w-full">
    <button
      class="tab tab-lifted"
      class:tab-active={activeTab === "details"}
      on:click={() => {
        activeTab = "details";
      }}>Member Details</button
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
    <button
      class="tab tab-lifted"
      class:tab-active={activeTab === "password"}
      on:click={() => {
        activeTab = "password";
      }}>Change Password</button
    >
  </div>
  {#if activeTab === "details"}
    <div class="container bg-base-100 w-full p-3 rounded">
      <div class="mb-10 mt-10 flex items-center gap-5 ml-3">
        <img
          src="https://api.dicebear.com/6.x/initials/svg?seed={data?.member
            .givenName} {data?.member?.surname}&backgroundColor=EB7C2A"
          alt="avatar"
          class="w-12 rounded-full"
        />
        <div>
          <h1 class="text-lg font-bold">
            {data?.member?.givenName}
            {data?.member.surname}
          </h1>
          <small class="text-gray-500">Member ID: {data?.member?.id}</small>
        </div>
      </div>
      {#if data.member.filledAt === null}
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
      {/if}
      <form use:editMemberForm>
        <div>
          <div
            class="w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2"
          >
            <i class="fa-regular fa-address-card" /> MEMBER BASIC INFO
          </div>
          <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
            <TextField
              label="Given name"
              labelFor="givenName"
              name="givenName"
              error={$errors?.givenName?.[0]}
              disabled={isViewMode}
            />
            <TextField
              label="Middle name"
              labelFor="middleName"
              name="middleName"
              error={$errors?.givenName?.[0]}
              disabled={isViewMode}
            />
            <TextField
              label="Surname"
              labelFor="surname"
              name="surname"
              error={$errors?.surname?.[0]}
              disabled={isViewMode}
            />
            <TextField
              label="Date of Birth"
              labelFor="birthday"
              name="birthday"
              type="date"
              error={$errors?.birthday?.[0]}
              disabled={isViewMode}
            />
            <SelectField
              label="Gender"
              name="gender"
              error={$errors?.gender?.[0]}
              disabled={isViewMode}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="female">Others</option>
            </SelectField>
            <SelectField
              label="Educational Attainment"
              name="educationalAttainment"
              error={$errors?.educationalAttainment?.[0]}
              disabled={isViewMode}
            >
              <option value="high-school-graduate">Highschool Graduate</option>
              <option value="high-school-undergraduate"
                >Highschool Undergraduate</option
              >
              <option value="college-undergraduate"
                >College Undergraduate</option
              >
              <option value="college-graduate">College Graduate</option>
            </SelectField>
            <TextField
              label="Tax Identification No."
              labelFor="TIN"
              name="TIN"
              error={$errors?.TIN?.[0]}
              disabled={isViewMode}
            />
            <SelectField
              label="Civil Status"
              name="civilStatus"
              error={$errors?.civilStatus?.[0]}
              disabled={isViewMode}
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
            </SelectField>
            <TextField
              label="Name of Spouse(If married)"
              labelFor="spouseName"
              name="spouseName"
              error={$errors?.spouseName?.[0]}
              disabled={isViewMode}
            />
          </div>
          <div
            class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5"
          >
            <i class="fa-regular fa-address-card" /> ADDRESSES
          </div>
          <TextAreaField
            label="Present Home/ Mailing Address"
            labelFor="presentAddress"
            name="presentAddress"
            error={$errors?.presentAddress?.[0]}
            disabled={isViewMode}
          />
          <TextAreaField
            label="Provincial Address"
            labelFor="provincialAddress"
            name="provincialAddress"
            error={$errors?.provincialAddress?.[0]}
            disabled={isViewMode}
          />
          <TextAreaField
            label="Office Address"
            labelFor="officeAddress"
            name="officeAddress"
            error={$errors?.officeAddress?.[0]}
            disabled={isViewMode}
          />
          <div class="grid grid-cols-1 gap-2 md:grid-cols-2" />
          <div
            class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5"
          >
            <i class="fa-regular fa-address-card" /> CONTACT INFO
          </div>
          <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
            <TextField
              label="Email"
              labelFor="email"
              name="account.email"
              type="email"
              error={$errors?.account?.email?.[0]}
              disabled={isViewMode}
            />
            <TextField
              label="Phone number"
              labelFor="mobileNumber"
              name="account.mobileNumber"
              error={$errors?.account?.mobileNumber?.[0]}
              disabled={isViewMode}
            />
            <TextField
              label="Office Phone Number"
              labelFor="officePhoneNumber"
              name="officePhoneNumber"
              error={$errors?.officePhoneNumber?.[0]}
              disabled={isViewMode}
            />
          </div>
          <div
            class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5"
          >
            <i class="fa-regular fa-address-card" /> DEPENDENTS
          </div>
          <button
            class="btn btn-outline btn-primary mt-5"
            type="button"
            on:click={addDependent}
            disabled={isViewMode}>Add Dependent</button
          >
          <div class="overflow-x-auto mt-5">
            <table class="table w-full">
              <!-- head -->
              <thead>
                <tr>
                  <th>Name of Dependent/s</th>
                  <th>Relationship</th>
                  <th>Date of Birth</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {#each $body?.dependents ?? [] as _, i}
                  <tr>
                    <td>
                      <TextField
                        placeholder="Dependent name"
                        name=""
                        bind:value={$body.dependents[i].name}
                        type="text"
                        error={$errors?.dependents?.[i]?.name?.[0]}
                        noErrorText={true}
                        disabled={isViewMode}
                      />
                      <small class="text-error ml-1 mt-1">
                        {$errors?.dependents?.[i]?.name?.[0] ?? ""}</small
                      >
                    </td>

                    <td>
                      <SelectField
                        name=""
                        placeholder="Your relationship with dependent"
                        bind:value={$body.dependents[i].relationship}
                        error={$errors?.dependents?.[i]?.relationship?.[0]}
                        noErrorText={true}
                        disabled={isViewMode}
                      >
                        <option value="father">Father</option>
                        <option value="mother">Mother</option>
                        <option value="spouse">Spouse</option>
                        <option value="children">Children</option>
                      </SelectField>
                      <small class="text-error ml-1 mt-1">
                        {$errors?.dependents?.[i]?.relationship?.[0] ??
                          ""}</small
                      >
                    </td>

                    <td>
                      <TextField
                        name=""
                        bind:value={$body.dependents[i].birthday}
                        type="date"
                        error={$errors?.dependents?.[i]?.birthday?.[0]}
                        noErrorText={true}
                        disabled={isViewMode}
                      />
                      <small class="text-error ml-1 mt-1">
                        {$errors?.dependents?.[i]?.relationship?.[0] ??
                          ""}</small
                      >
                    </td>
                    <td>
                      <button
                        type="button"
                        class="btn btn-error btn-outline mb-2"
                        on:click={() => {
                          removeDependent(i);
                        }}
                        disabled={isViewMode}
                        ><i class="fa-solid fa-xmark" /></button
                      >
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
        {#if data.member.filledAt === null}
          <div class="mt-5 w-full flex justify-end">
            <button
              class="btn btn-primary mr-2 text-base-100"
              type="submit"
              disabled={isViewMode}
            >
              <i class="fa-regular fa-floppy-disk mr-2 text-lg" />
              Save</button
            >
          </div>
        {/if}
      </form>
    </div>
  {/if}

  {#if activeTab === "account"}
    <div class="container bg-base-100 w-full p-5 rounded">
      <div class="grid grid-cols-2 border-b py-3 mt-5">
        <span>Savings</span>
        <span class="font-bold"
          >PHP {data?.stat?.savings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) ?? 0}</span
        >
      </div>
      <div class="grid grid-cols-2 border-b py-3">
        <span>Shares</span>
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

      <div class="grid grid-cols-2 border-b py-3">
        <span>Requested Loan</span>
        <span class="font-bold"
          >PHP {data?.stat?.requestedLoan.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) ?? 0}</span
        >
      </div>
      <div class="grid grid-cols-2 border-b py-3">
        <span>Approved Loan</span>
        <span class="font-bold"
          >PHP {data?.stat?.approvedLoan.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) ?? 0}</span
        >
      </div>
      <div class="grid grid-cols-2 border-b py-3">
        <span>Disbursed Loan</span>
        <span class="font-bold"
          >PHP {data?.stat?.disbursedLoan.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) ?? 0}</span
        >
      </div>
      <div class="grid grid-cols-2 border-b py-3">
        <span>Finished Loan</span>
        <span class="font-bold"
          >PHP {data?.stat?.finishedLoan.toLocaleString(undefined, {
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
              <th>Transaction Type</th>
              <th>Amount</th>
              <th>Remarks</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {#each data.sharesTransactions as shareTransaction}
              <tr>
                <td>{new Date(shareTransaction.createdAt).toLocaleString()}</td>
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
              <th>Transaction Type</th>
              <th>Amount</th>
              <th>Remarks</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {#each data.savingsTransactions as savingsTransaction}
              <tr>
                <td
                  >{new Date(savingsTransaction.createdAt).toLocaleString()}</td
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
              <th>Loan Interest</th>
              <th>Amount Paid</th>
              <th>Remaining Balance</th>
              <th>Balance Before Repayment</th>
              <th>Remarks</th>
              <th />
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

  {#if activeTab === "password"}
    <div class="container bg-base-100 w-full p-3 rounded">
      <div class="mb-10 mt-10 flex items-center gap-5 ml-3">
        <img
          src="https://api.dicebear.com/6.x/initials/svg?seed={data.member
            .givenName} {data.member.surname}&backgroundColor=EB7C2A"
          alt="avatar"
          class="w-12 rounded-full"
        />
        <div>
          <h1 class="text-lg font-bold">
            {data.member.givenName}
            {data.member.surname}
          </h1>
          <small class="text-gray-500">Member ID: {data.member.id}</small>
        </div>
      </div>

      <div
        class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5"
      >
        <i class="fa-regular fa-address-card" /> CHANGE PASSWORD
      </div>
      {#if form?.error === true}
        <div class="alert alert-error shadow-lg text-white mb-3 mt-3">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              /></svg
            >
            <span>{form?.message}</span>
          </div>
        </div>
      {/if}

      {#if form?.success === true}
        <div class="alert alert-success shadow-lg text-white mb-3 mt-3">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              /></svg
            >
            <span>Password has been changed successfully.</span>
          </div>
        </div>
      {/if}
      <div>
        <form method="POST" action="?/changePassword">
          <TextField name="oldPassword" label="Old Password" type="password" />
          <TextField name="newPassword" label="New Password" type="password" />
          <TextField
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
          />
          <button class="btn btn-primary text-base-100 mt-5">
            <i class="fa-regular fa-floppy-disk mr-2 text-lg" />
            Save</button
          >
        </form>
      </div>
    </div>
  {/if}
</div>

<Toaster />

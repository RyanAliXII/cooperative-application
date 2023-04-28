<script lang="ts">
  import TextField from "$lib/components/form/TextField.svelte";
  import TextAreaField from "$lib/components/form/TextAreaField.svelte";

  import toast, { Toaster } from "svelte-french-toast";
  import { EditCooperativeSchema } from "$lib/definitions/schema";
  import { createForm } from "felte";
  import { validator } from "@felte/validator-yup";
  import { onMount } from "svelte";
  import axios from "axios";

  export let data;
  export let form;
  const session = data?.session.data;
  let registrationURL = "";
  onMount(() => {
    registrationURL = `${window.location.host}/cooperatives/registration/${data.cooperative?.id}`;
  });

  const copyUrl = () => {
    navigator.clipboard.writeText(registrationURL);
    toast.success("Registration URL copied to clipboard.");
  };

  type Tab = "details" | "account";
  let activeTab: Tab = form?.error || form?.success ? "account" : "details";
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
      class:tab-active={activeTab === "account"}
      on:click={() => {
        activeTab = "account";
      }}>Your Account</button
    >
  </div>
  <div class="container bg-base-100 w-full p-3 rounded">
    {#if activeTab === "details"}
      <form>
        <div
          class="w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2"
        >
          <i class="fa-regular fa-address-card" /> COOPERATIVE INFO
        </div>
        <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
          <TextField
            value={data.cooperative?.name}
            label="Cooperative name"
            labelFor="name"
            name="name"
            disabled={true}
          />
          <TextField
            value={data?.cooperative?.registrationNumber}
            label="Registration No"
            labelFor="registrationNumber"
            name="registrationNumber"
            disabled={true}
          />
          <TextField
            value={data?.cooperative.initials}
            label="Cooperative Initials"
            labelFor="initials"
            name="initials"
            disabled={true}
          />
        </div>

        <TextAreaField
          label="Address"
          value={data?.cooperative?.address}
          labelFor="address"
          name="address"
          disabled={true}
        />
        <div class="grid gap-2 md:grid-cols-2 mt-5">
          <div class="flex items-center">
            <input
              class="input input-bordered w-full"
              value={registrationURL}
              readonly={true}
            />
          </div>
          <div class="flex items-center w-full">
            <button
              class="btn btn-secondary btn-outline w-full md:w-fit"
              on:click={copyUrl}>Copy Registration URL</button
            >
          </div>
        </div>

        <div
          class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5"
        >
          <i class="fa-regular fa-address-card" /> OWNER ACC. INFO
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
          <TextField
            value={data.cooperative?.account.givenName}
            label="Given name"
            labelFor="givenName"
            name="account.givenName"
            disabled={true}
          />
          <TextField
            value={data?.cooperative?.account?.middleName}
            label="Middlename"
            labelFor="middleName"
            name="account.middleName"
            disabled={true}
          />
          <TextField
            value={data?.cooperative?.account?.surname}
            label="Surname"
            labelFor="surname"
            name="account.surname"
            disabled={true}
          />
          <TextField
            value={data?.cooperative?.account.email}
            label="Email"
            labelFor="email"
            name="account.email"
            type="email"
            disabled={true}
          />
        </div>
      </form>
    {/if}
    {#if activeTab === "account"}
      <div class="mb-10 mt-10 flex items-center gap-5 ml-3">
        <img
          src="https://api.dicebear.com/6.x/initials/svg?seed={session?.givenName} {session?.surname}&backgroundColor=EB7C2A"
          alt="avatar"
          class="w-12 rounded-full"
        />
        <div>
          <h1 class="text-lg font-bold">
            {session?.givenName}
            {session?.surname}
          </h1>
          <small class="text-gray-500">Account ID: {session.id}</small>
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
    {/if}
  </div>
</div>
<Toaster />

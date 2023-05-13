<script lang="ts">
  import TextField from "$lib/components/form/TextField.svelte";
  import { createForm } from "felte";
  import { validator } from "@felte/validator-yup";
  import axios, { AxiosError } from "axios";
  import { RegisterMemberAccountSchema } from "$lib/definitions/schema";
  import type { MemberAccount } from "$lib/definitions/types.js";
  import { goto } from "$app/navigation";

  export let data;
  let message = "";
  const {
    form,
    data: body,
    errors,
    setErrors,
    isSubmitting,
  } = createForm<MemberAccount>({
    extend: validator({
      schema: RegisterMemberAccountSchema,
      castValues: true,
    }),
    onSubmit: async (body) => {
      message = "";

      try {
        const isTaken = await validateEmail();
        if (isTaken) {
          return;
        }
        const response = await axios.post(
          `/api/cooperatives/${data?.cooperative?.id}/members`,
          body
        );
        const { data: responseData } = response.data;
        goto(
          `/cooperatives/registration/success?t=${
            encodeURIComponent(responseData.token) ?? ""
          }`
        );
      } catch (error) {
        if (error instanceof AxiosError) {
          message = error?.response?.data?.message;
        }
      }
    },
  });

  const validateEmail = async () => {
    const response = await axios.get(`/api/members/email?email=${$body.email}`);
    if (response.data.exist) {
      setErrors("email", "Email is taken.");
    }
    return response.data.exist;
  };
</script>

<div
  class="bg-gray-50 flex justify-center items-center"
  style="min-height:100vh;"
>
  <div class="w-11/12 lg:w-4/12">
    {#if message}
      <div class="alert alert-error mb-4">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current flex-shrink-0 h-6 w-6 text-base-100"
            fill="none"
            viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            /></svg
          >
          <span class="text-base-100">{message}</span>
        </div>
      </div>
    {/if}
    <div class="bg-base-100 p-3 pb-6 shadow rounded">
      <div class=" mb-5 mt-5 flex flex-col items-center">
        <img
          src="https://api.dicebear.com/6.x/initials/svg?seed={data?.cooperative
            ?.name}&backgroundColor=EB7C2A"
          alt="avatar"
          class="w-20 rounded-full"
        />
        <h1 class="text-xl text-center mt-2 font-bold">
          {data?.cooperative?.name}
        </h1>
        <p class="text-gray-400">Create your member account and get access.</p>
      </div>
      <form use:form>
        <div class="lg:grid lg:grid-cols-2 gap-2">
          <TextField
            name="member.givenName"
            label="Given name"
            labelFor="givenName"
            error={$errors?.member?.givenName?.[0]}
          />
          <TextField
            name="member.middleName"
            label="Middle name"
            labelFor="middleName"
            error={$errors?.member?.middleName?.[0]}
          />
          <TextField
            name="member.surname"
            label="Surname"
            labelFor="surname"
            error={$errors?.member?.surname?.[0]}
          />
          <TextField
            name="member.birthday"
            label="Date of birth"
            labelFor="birthday"
            type="date"
            error={$errors?.member?.birthday?.[0]}
          />
        </div>
        <div class="mt-5" />
        <TextField
          type="email"
          name="email"
          label="Email"
          labelFor="email"
          on:blur={validateEmail}
          error={$errors?.email?.[0]}
        />
        <TextField
          type="password"
          name="password"
          label="Password"
          labelFor="Password"
          error={$errors?.password?.[0]}
        />
        <button
          class="btn btn-primary mt-3 text-white w-full"
          type="submit"
          disabled={$isSubmitting}
        >
          Sign Up</button
        >
      </form>
    </div>
  </div>
</div>

<script lang="ts">
  import SelectField from "$lib/components/form/SelectField.svelte";
  import TextAreaField from "$lib/components/form/TextAreaField.svelte";
  import TextField from "$lib/components/form/TextField.svelte";
  import { createForm } from "felte";
  import { validator } from "@felte/validator-yup";
  import { NewMemberValidationSchema } from "$lib/definitions/schema";
  import axios from "axios";
  import toast, { Toaster } from "svelte-french-toast";
  import type { Member } from "$lib/definitions/types";
  import Swal from "sweetalert2";

  const { form, data, errors, setErrors, setIsDirty } = createForm<Member>({
    initialValues: {
      dependents: [],
    },
    extend: [
      validator({ schema: NewMemberValidationSchema, castValues: true }),
    ],

    onSubmit: async (body) => {
      try {
        const isTaken = await validateEmail();

        if (isTaken) {
          return;
        }
        const response = await axios.post("/api/members", body, {
          withCredentials: true,
        });
        const { data } = response.data;

        Swal.fire(
          "Member registered",
          `The password for <strong>${data?.account?.email}</strong> is <br><strong>${data?.account?.password}</strong>. 
          Copy the password, since this will be the only time it will be shown.`,
          "success"
        );
      } catch (error) {
        console.log(error);
        toast.error("Unknown error occured.");
      }
    },
  });

  const addDependent = () => {
    const newDependent = { name: "", relationship: "", birthday: "" };
    data.update((prev) => {
      prev.dependents.push(newDependent);
      return prev;
    });
  };
  const removeDependent = (index: number) => {
    data.update((prev) => {
      prev.dependents = prev.dependents.filter((_, i) => i != index);
      return prev;
    });
  };
  const validateEmail = async () => {
    const response = await axios.get(
      `/api/members/email?email=${$data.account.email}`
    );
    if (response.data.exist) {
      setErrors("account.email", "Email is taken.");
    }
    return response.data.exist;
  };
</script>

<div>
  <h1 class="text-lg font-semibold mb-3 text-gray-500">Register Member</h1>
  <div class="container bg-base-100 w-full p-3 rounded">
    <form use:form>
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
          />
          <TextField
            label="Middle name"
            labelFor="middleName"
            name="middleName"
            error={$errors?.middleName?.[0]}
          />
          <TextField
            label="Surname"
            labelFor="surname"
            name="surname"
            error={$errors?.surname?.[0]}
          />
          <TextField
            label="Date of Birth"
            labelFor="birthday"
            name="birthday"
            type="date"
            error={$errors?.birthday?.[0]}
          />
          <SelectField
            label="Gender"
            name="gender"
            error={$errors?.gender?.[0]}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="female">Others</option>
          </SelectField>
          <SelectField
            label="Educational Attainment"
            name="educationalAttainment"
            error={$errors?.educationalAttainment?.[0]}
          >
            <option value="high-school-graduate">Highschool Graduate</option>
            <option value="high-school-undergraduate"
              >Highschool Undergraduate</option
            >
            <option value="college-undergraduate">College Undergraduate</option>
            <option value="college-graduate">College Graduate</option>
          </SelectField>
          <TextField
            label="Tax Identification No."
            labelFor="TIN"
            name="TIN"
            error={$errors?.TIN?.[0]}
          />
          <SelectField
            label="Civil Status"
            name="civilStatus"
            error={$errors?.civilStatus?.[0]}
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
        />
        <TextAreaField
          label="Provincial Address"
          labelFor="provincialAddress"
          name="provincialAddress"
          error={$errors?.provincialAddress?.[0]}
        />
        <TextAreaField
          label="Office Address"
          labelFor="officeAddress"
          name="officeAddress"
          error={$errors?.officeAddress?.[0]}
        />
        <div class="grid grid-cols-1 gap-2 md:grid-cols-2" />
        <div
          class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5"
        >
          <i class="fa-regular fa-address-card" /> ACCOUNT INFO
        </div>
        <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
          <TextField
            label="Email"
            labelFor="email"
            name="account.email"
            type="email"
            on:blur={validateEmail}
            error={$errors?.account?.email?.[0]}
          />
          <TextField
            label="Phone number"
            labelFor="mobileNumber"
            name="account.mobileNumber"
            error={$errors?.account?.mobileNumber?.[0]}
          />
          <TextField
            label="Office Phone Number"
            labelFor="officePhoneNumber"
            name="officePhoneNumber"
            error={$errors?.officePhoneNumber?.[0]}
          />
          <TextField
            label="Registration Fee"
            labelFor="registrationFee"
            name="registrationFee"
            type="number"
            error={$errors?.registrationFee?.[0]}
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
          on:click={addDependent}>Add Dependent</button
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
              {#each $data?.dependents as _, i}
                <tr>
                  <td>
                    <TextField
                      placeholder="Dependent name"
                      name=""
                      bind:value={$data.dependents[i].name}
                      type="text"
                      error={$errors?.dependents?.[i]?.name?.[0]}
                      noErrorText={true}
                    />
                    <small class="text-error ml-1 mt-1">
                      {$errors?.dependents?.[i]?.name?.[0] ?? ""}</small
                    >
                  </td>

                  <td>
                    <SelectField
                      name=""
                      placeholder="Your relationship with dependent"
                      bind:value={$data.dependents[i].relationship}
                      error={$errors?.dependents?.[i]?.relationship?.[0]}
                      noErrorText={true}
                    >
                      <option value="father">Father</option>
                      <option value="mother">Mother</option>
                      <option value="spouse">Spouse</option>
                      <option value="children">Children</option>
                    </SelectField>
                    <small class="text-error ml-1 mt-1">
                      {$errors?.dependents?.[i]?.relationship?.[0] ?? ""}</small
                    >
                  </td>

                  <td>
                    <TextField
                      name=""
                      bind:value={$data.dependents[i].birthday}
                      type="date"
                      error={$errors?.dependents?.[i]?.birthday?.[0]}
                      noErrorText={true}
                    />
                    <small class="text-error ml-1 mt-1">
                      {$errors?.dependents?.[i]?.relationship?.[0] ?? ""}</small
                    >
                  </td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-error btn-outline mb-2"
                      on:click={() => {
                        removeDependent(i);
                      }}><i class="fa-solid fa-xmark" /></button
                    >
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-5 w-full flex justify-end">
        <button class="btn btn-primary text-white mt-10" type="submit">
          <i class="fa-regular fa-floppy-disk mr-2 text-lg" />
          Save</button
        >
      </div>
    </form>
  </div>
  <Toaster />
</div>

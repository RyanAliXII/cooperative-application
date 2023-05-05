<script lang="ts">
  import type { Recognition } from "$lib/definitions/types";
  import axios from "axios";
  import { createForm } from "felte";
  import toast, { Toaster } from "svelte-french-toast";
  import { validator } from "@felte/validator-yup";
  import {
    EditGivenRewardValidation,
    GiveRewardValidation,
  } from "$lib/definitions/schema.js";
  import Modal from "$lib/components/ui/Modal.svelte";
  import TextField from "$lib/components/form/TextField.svelte";
  import SelectField from "$lib/components/form/SelectField.svelte";
  import { invalidate } from "$app/navigation";
  import CertificatePreviewModal from "./CertificatePreviewModal.svelte";
  let isAssignModalOpen = false;
  let isCertificatePreviewOpen = false;
  export let data;

  const closeAssignModal = () => {
    isAssignModalOpen = false;
  };
  const openAssignModal = () => {
    isAssignModalOpen = true;
  };
  const closeCertificatePreviewModal = () => {
    isCertificatePreviewOpen = false;
  };

  const openCertificatePreviewModal = () => {
    isCertificatePreviewOpen = true;
  };

  const {
    form: assignForm,
    data: assignFormData,
    errors: assignFormErrors,
    reset: resetAssignForm,
  } = createForm({
    initialValues: {
      cooperativeId: "",
      rewardId: "",
      date: "",
      id: "",
    },
    onSubmit: async (body) => {
      try {
        await axios.put(`/api/recognitions/${body.id}`, body);
        toast.success("Recognition has been successfully updated.");
        invalidate((url) => url.pathname === "/api/recognitions");
      } catch {
        toast.error("Unknown error occured, please try again later.");
      } finally {
        closeAssignModal();
        resetAssignForm();
      }
    },
    extend: [
      validator({
        schema: EditGivenRewardValidation,
        castValues: true,
        level: "error",
      }),
    ],
  });

  let selectedRecognition: Recognition;
  const edit = (recognition: Recognition) => {
    assignFormData.set({
      cooperativeId: recognition.cooperativeId,
      date: recognition.date,
      rewardId: recognition.rewardId,
      id: recognition.id ?? "",
    });
    openAssignModal();
  };
  const previewCertificate = (recognition: Recognition) => {
    selectedRecognition = recognition;
    openCertificatePreviewModal();
  };
</script>

<h1 class="text-lg font-semibold mb-3 text-gray-500 ml-1">Recognitions</h1>
<div class="container bg-base-100 w-full p-3 rounded">
  <div class="overflow-x-auto">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Cooperative</th>
          <th>Reward name</th>
          <th>Reward Description</th>
          <th>Date</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {#each data.recognitions as recognition}
          <tr>
            <td class="text-sm font-semibold"
              >{recognition.cooperative?.name}</td
            >
            <td class="text-sm font-semibold">{recognition.reward?.name}</td>
            <td class="text-sm">{recognition.reward?.description}</td>
            <td class="text-sm">{recognition.date}</td>
            <td>
              <button
                class="btn btn-secondary btn-outline"
                on:click={() => {
                  edit(recognition);
                }}><i class="fa-regular fa-pen-to-square" /></button
              >
              <button
                class="btn btn-primary btn-outline"
                on:click={() => {
                  previewCertificate(recognition);
                }}><i class="fa-solid fa-certificate" /></button
              >
              <button class="btn btn-error btn-outline">
                <i class="fa-solid fa-trash" />
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<Modal isOpen={isAssignModalOpen} close={closeAssignModal}>
  <h1 class="text-lg font-bold">Edit Recognition</h1>
  <form use:assignForm>
    <SelectField
      value={$assignFormData.rewardId}
      label={"Reward"}
      labelFor="reward"
      name="rewardId"
      error={$assignFormErrors.rewardId?.[0]}
    >
      {#each data.rewards as reward}
        <option value={reward.id}> {reward.name}</option>
      {/each}
    </SelectField>
    <TextField
      value={$assignFormData.date}
      name="date"
      type="date"
      error={$assignFormErrors?.date?.[0]}
    />
    <button class="btn btn-primary text-base-100 mt-3" type="submit"
      >Save</button
    >
  </form>
</Modal>

<CertificatePreviewModal
  close={closeCertificatePreviewModal}
  isOpen={isCertificatePreviewOpen}
  recognition={selectedRecognition}
/>
<Toaster />

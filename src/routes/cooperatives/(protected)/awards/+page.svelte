<script lang="ts">
  import type { Recognition } from "$lib/definitions/types";
  import AwardPreview from "./AwardPreview.svelte";

  export let data;
  let isCertificatePreviewOpen = false;
  const closeCertificatePreviewModal = () => {
    isCertificatePreviewOpen = false;
  };

  const openCertificatePreviewModal = () => {
    isCertificatePreviewOpen = true;
  };

  let selectedRecognition: Recognition;

  const previewCertificate = (recognition: Recognition) => {
    selectedRecognition = recognition;
    openCertificatePreviewModal();
  };
</script>

<h1 class="text-lg font-semibold mb-3 text-gray-500 ml-1">Awards</h1>
<div class="container bg-base-100 w-full p-3 rounded">
  <div class="overflow-x-auto">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Reward name</th>
          <th>Reward Description</th>
          <th>Date</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {#each data.recognitions as recognition}
          <tr>
            <td class="text-sm font-semibold">{recognition.reward?.name}</td>
            <td class="text-sm">{recognition.reward?.description}</td>
            <td class="text-sm">{recognition.date}</td>
            <td>
              <button
                class="btn btn-primary btn-outline"
                on:click={() => {
                  previewCertificate(recognition);
                }}><i class="fa-solid fa-certificate" /></button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
<AwardPreview
  recognition={selectedRecognition}
  close={closeCertificatePreviewModal}
  isOpen={isCertificatePreviewOpen}
/>

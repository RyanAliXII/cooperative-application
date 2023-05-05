<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";
  import type { Recognition } from "$lib/definitions/types";

  export let isOpen: boolean;
  export let close: () => void;
  export let recognition: Recognition;
  import logo from "$lib/assets/images/ccdco-logo.png";
  const recognitionDate = new Date(recognition?.date);
  let year = recognitionDate.getFullYear();
  let month = recognitionDate.toLocaleString("default", { month: "long" });
  console.log(month);
</script>

<Modal
  {isOpen}
  {close}
  modalBoxClass="max-w-7xl"
  style="width: 1300px; height:800px; overflow-x: scroll;"
>
  <div
    class="container mx-auto px-4 py-8 sm:px-6 lg:px-8 h-full"
    style="width: 1300px"
  >
    <div
      class="mx-auto bg-white rounded-lg shadow-lg flex items-center justify-center flex-col h-full"
    >
      <div class="px-4 py-4 sm:px-6 lg:px-8 w-full h-full">
        <div class="w-full flex flex-col items-center mb-20">
          <img src={logo} width="100px" alt="ccdco-logo" />
          <h3 class="font-bold">
            Caloocan City Cooperative Development and Coordinating Office
          </h3>
        </div>
        <div class="flex items-center flex-col">
          <h2 class="text-4xl font-bold text-primary">
            Certificate of {recognition?.reward?.certificateType}
          </h2>
          <p class="mt-2 text text-gray-500">This certificate is awarded to</p>
          <h3 class="text-2xl font-bold text-gray-800">
            {recognition?.cooperative?.name}
          </h3>
          <p class="mt-2 text-gray-500">
            {recognition?.reward?.certificateDescription}
          </p>
          <p class="mt-2 text-gray-500">
            Given on {month}
            {year}
          </p>
        </div>
      </div>
    </div>
  </div>
</Modal>

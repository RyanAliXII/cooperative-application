<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";
  import type { Recognition } from "$lib/definitions/types";
  import html2canvas from "html2canvas";
  import { jsPDF } from "jspdf";
  export let isOpen: boolean;
  export let close: () => void;
  export let recognition: Recognition;
  import logo from "$lib/assets/images/ccdco-logo.png";
  import ordinal from "ordinal";
  $: recognitionDate = new Date(recognition?.date);

  $: year = recognitionDate.getFullYear();
  $: month = recognitionDate.toLocaleString("default", { month: "long" });
  $: day = recognitionDate.getDay();
  let certificateDiv: HTMLDivElement;
  const saveAsPDF = async () => {
    const canvas = await html2canvas(certificateDiv, { scale: 4 });
    console.log(certificateDiv);
    const pdf = new jsPDF("landscape", "px", [629, 350]);
    pdf.addImage(canvas, 0, 0, 629, 350);
    pdf.save(
      `${recognition.reward?.name}_${year}_${recognition.cooperative?.name}`
    );
  };
</script>

<Modal
  {isOpen}
  {close}
  style="width: 1500px; height:800px; overflow-x: scroll; max-width: none;"
>
  <div
    slot="backdrop"
    class="container mx-auto px-6 flex justify-end sm:px-6 lg:px-8"
  >
    <button class="btn btn-secondary text-white mb-2" on:click={saveAsPDF}>
      <i class="fa-solid fa-file-arrow-down mr-2" />Save as PDF</button
    >
  </div>
  <div
    class="container mx-auto px-4 py-8 sm:px-6 lg:px-8 h-full"
    style="width: 1300px"
  >
    <div
      class="mx-auto bg-white rounded-lg border-primary bor flex items-center justify-center flex-col h-full"
      style="border-width: 40px;"
      bind:this={certificateDiv}
    >
      <div class="px-4 py-4 sm:px-6 lg:px-8 w-full h-full">
        <div class="w-full flex flex-col items-center mb-16">
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
            This awards was given on {ordinal(day)} day of

            {month}
            {year}.
          </p>
        </div>
      </div>
    </div>
  </div>
</Modal>

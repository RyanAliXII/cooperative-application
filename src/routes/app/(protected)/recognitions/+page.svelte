<script lang="ts">
    import type {Recognition} from "$lib/definitions/types"
  import axios from "axios";
  import { createForm } from "felte";
  import toast, { Toaster } from "svelte-french-toast";
  import {validator} from "@felte/validator-yup"
  import { EditGivenRewardValidation, GiveRewardValidation } from "$lib/definitions/schema.js";
  import Modal from "$lib/components/ui/Modal.svelte";
  import TextField from "$lib/components/form/TextField.svelte";
  import TextAreaField from "$lib/components/form/TextAreaField.svelte";
  import SelectField from "$lib/components/form/SelectField.svelte";
  import { invalidate } from "$app/navigation";
  let isAssignModalOpen = false;
  let isCertificatePreviewOpen = false;
  export let data;
   

  
  const closeAssignModal = ()=>{
    isAssignModalOpen = false
  }
  
  const openAssignModal = ()=>{
    isAssignModalOpen  = true
  }
  const closeCertificatePreviewModal = ()=>{
    isCertificatePreviewOpen = false
  }
  
  const openCertificatePreviewModal = ()=>{
    isCertificatePreviewOpen  = true
  }


  const {form:assignForm, data:assignFormData, errors: assignFormErrors, reset: resetAssignForm}  = createForm({
    initialValues:{
      cooperativeId:"",
      rewardId:"",
      date:"",
      id:""
    },
    onSubmit: async(body)=>{
       try {
         
          await axios.put(`/api/recognitions/${body.id}`, body);
          toast.success("Recognition has been successfully updated.")
          invalidate((url)=>url.pathname === "/api/recognitions")   
       } catch {
          toast.error("Unknown error occured, please try again later.")
       }
       finally{
        closeAssignModal()
        resetAssignForm()
       }
    },
    extend:[
      validator({schema: EditGivenRewardValidation, castValues: true, level: "error"})
    ]
  })
  
  let selectedRecognition: Recognition;
    const edit = (recognition: Recognition)=>{
        const date = new Date(recognition.date)
        const month = date.getMonth()
        const year = date.getFullYear()
        assignFormData.set({
            cooperativeId: recognition.cooperativeId,
            date: `${year}-${month < 10 ? `0${month}`: month}`,
            rewardId: recognition.rewardId,
            id: recognition.id ?? ""
        })
        openAssignModal()
    }
    const previewCertificate = (recognition: Recognition)=>{
        selectedRecognition = recognition
        openCertificatePreviewModal()
    }

   
</script>
<h1 class="text-lg font-semibold mb-3 text-gray-500 ml-1">Recognitions</h1>
<div class="container bg-base-100 w-full  p-3 rounded">
    <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Cooperative</th>
              <th>Reward name</th>
              <th>Reward Description</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {#each data.recognitions as recognition }
              <tr>
                <td class="text-sm font-semibold">{recognition.cooperative?.name}</td>
                <td class="text-sm font-semibold">{recognition.reward?.name}</td>
                <td class="text-sm">{recognition.reward?.description}</td>
                <td class="text-sm">{recognition.date}</td>
                <td>
                    <button class="btn btn-secondary btn-outline " on:click={()=>{edit(recognition)}}><i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="btn btn-primary btn-outline " on:click={()=>{previewCertificate(recognition)}}><i class="fa-solid fa-certificate"></i></button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
</div>

<Modal isOpen={isAssignModalOpen} close={closeAssignModal} >
    <h1 class="text-lg font-bold">Edit Recognition</h1>
    <form use:assignForm>
        <SelectField  value={$assignFormData.rewardId} label={"Reward"} labelFor="reward" name="rewardId" error={$assignFormErrors.rewardId?.[0]}>
           {#each data.rewards as reward }
            <option value={reward.id}> {reward.name}</option>
           {/each}
        </SelectField>
        <TextField value={$assignFormData.date} name="date" type="month" error={$assignFormErrors?.date?.[0]}/>
        <button class="btn btn-primary text-base-100 mt-3" type="submit">Save</button>
    </form>
</Modal>

<Modal isOpen={isCertificatePreviewOpen} close={closeCertificatePreviewModal}  modalBoxClass="max-w-4xl" style="width: 90%; height:550px;">
    <div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8 h-full">
        <div class="w-full h-full mx-auto bg-white rounded-lg shadow-lg flex items-center justify-center flex-col">
          <div class="px-4 py-4 sm:px-6 lg:px-8 ">
            <div class="flex items-center flex-col">
              <h2 class="text-4xl font-bold text-gray-800">Certificate of {selectedRecognition?.reward?.certificateType}</h2>
              <p class="mt-2 text text-gray-500">This certificate is awarded to</p>
              <h3 class="text-2xl font-bold text-gray-800">{selectedRecognition?.cooperative?.name}</h3>
              <p class="mt-2  text-gray-500">{selectedRecognition?.reward?.certificateDescription}</p>
            
            </div>
           
          </div>
          
        </div>
      </div>
</Modal>
  <Toaster/>
<script lang="ts">
  import TextAreaField from "$lib/components/form/TextAreaField.svelte";
  import TextField from "$lib/components/form/TextField.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import { createForm } from "felte";
  import {validator} from "@felte/validator-yup"
  import { CreateRewardValidation, EditRewardValidation } from "$lib/definitions/schema";
  import axios from "axios";
  import toast, { Toaster } from "svelte-french-toast";
  import { invalidate } from "$app/navigation";
  import type { Reward } from "$lib/definitions/types.js";
  let isAddModalOpen = false
  let isEditModalOpen = false
  export let data;
  const closeAddModal = ()=>{
    isAddModalOpen = false
  }
  const openAddModal = ()=>{
    isAddModalOpen = true
  }

  const closeEditModal = ()=>{
    isEditModalOpen = false
  }
  const openEditModal = ()=>{
    isEditModalOpen = true
  }

      
const {data:addAwardData, form:addAwardForm, errors: addAwardError, reset: resetAddAwardForm, } = createForm({
    onSubmit:async(body)=>{
      try {
        const response = await axios.post("/api/rewards", body)
        invalidate((url)=>url.pathname === "/api/rewards")
       toast.success("Reward has been created successfully.")
      } catch {
        toast.error("Unknown error occurred, please try again.")
      } 
      finally{
        resetAddAwardForm();
        closeAddModal()
      }
       
    },
    extend:[validator({schema:CreateRewardValidation, level:"error", castValues: true })]
})

const {data:editAwardData, form:editAwardForm, errors: editAwardError, reset: resetEditAwardForm, } = createForm<Reward>({
  initialValues:{
    id:"",
    name:"",
    description:"",
    certificateDescription:"",
    certificateType:"",
  },
    onSubmit:async(body)=>{
      try {
        const response = await axios.put(`/api/rewards/${body?.id}`, body)
        invalidate((url)=>url.pathname === "/api/rewards")
        toast.success("Reward has been created successfully.")
      } catch {
        toast.error("Unknown error occurred, please try again.")
      } 
      finally{
        resetAddAwardForm();
        closeAddModal()
      }
       
    },
    extend:[validator({schema:EditRewardValidation, level:"error", castValues: true })]
})

const edit = (reward: Reward)=>{
    editAwardData.set(reward)
    openEditModal()
  }

</script>
<h1 class="text-lg font-semibold mb-3 text-gray-500 ml-1">Rewards</h1>
<div class="container bg-base-100 w-full  p-3 rounded">
    <button class="btn btn-primary text-base-100 mb-2" on:click={openAddModal}>Create Reward</button>
    <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Reward name</th>
              <th>Reward Description</th>
              <th>Certificate Type</th>
              <th>Certificate Description </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {#each data.rewards as reward }
              <tr>
                <td class="text-sm font-semibold">{reward.name}</td>
                <td class="text-sm">{reward.description}</td>
                <td class="text-sm">{reward.certificateType}</td>
                <td class="text-sm">{reward.certificateDescription}</td>
                <td><button class="btn btn-secondary btn-outline " on:click={()=>{edit(reward)}}><i class="fa-regular fa-pen-to-square"></i></button></td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
</div>

<Modal isOpen={isAddModalOpen} close={closeAddModal} >
<form use:addAwardForm>
    <h1 class="text-lg font-bold">New Reward</h1>
    <TextField label="Name" labelFor="name" name="name" error={$addAwardError.name}/>
    <TextAreaField label="Description" name="description" labelFor="description"  error={$addAwardError.description}/>
    <div class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5">
        <i class="fa-solid fa-calendar"></i>CERTIFICATE GENERATOR
    </div>
    <TextField label="Certificate type" labelFor="name" name="certificateType" placeholder="e.g Recognition, Appreciation" error={$addAwardError.certificateType}/>
    <TextAreaField label="Certificate Description" labelFor="description" name="certificateDescription" placeholder="e.g For the exemplary performance etc." error={$addAwardError.certificateDescription}/>
    <button class="btn btn-primary mt-5 text-base-100">Save</button>
  </form>
</Modal>

<Modal isOpen={isEditModalOpen} close={closeEditModal} >
  <form use:addAwardForm>
      <h1 class="text-lg font-bold">Edit Reward</h1>
      <TextField value={$editAwardData.name} label="Name" labelFor="name" name="name" error={$editAwardError.name?.[0]}/>
      <TextAreaField value={$editAwardData.description}  label="Description" name="description" labelFor="description"  error={$editAwardError.description?.[0]}/>
      <div class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5">
          <i class="fa-solid fa-calendar"></i>CERTIFICATE GENERATOR
      </div>
      <TextField value={$editAwardData.certificateType}  label="Certificate type" labelFor="name" name="certificateType" placeholder="e.g Recognition, Appreciation" error={$editAwardError.certificateType?.[0]}/>
      <TextAreaField  value={$editAwardData.certificateDescription} label="Certificate Description" labelFor="description" name="certificateDescription" placeholder="e.g For the exemplary performance etc." error={$editAwardError.certificateDescription?.[0]}/>
      <button class="btn btn-primary mt-5 text-base-100">Save</button>
    </form>
  </Modal>
<Toaster/>

    
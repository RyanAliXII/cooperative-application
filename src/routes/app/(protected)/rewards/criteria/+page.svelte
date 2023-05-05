<script lang="ts">
  import TextField from "$lib/components/form/TextField.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import { createForm } from "felte";
  import { validator } from "@felte/validator-yup";
  import type {
    CooperativeCriteria,
    CriteriaField,
  } from "$lib/definitions/types";
  import {
    CreateCriteriaValidation,
    EditCriteriaValidation,
  } from "$lib/definitions/schema";
  import toast, { Toaster } from "svelte-french-toast";
  import axios from "axios";
  import { invalidate } from "$app/navigation";
  import ConfirmDialog from "$lib/components/ui/ConfirmDialog.svelte";

  let isAddCriteriaModalOpen = false;
  let isEditCriteriaModalOpen = false;
  let isDeleteConfimationOpen = false;
  export let data;
  const {
    form: addCriteriaForm,
    errors: addCriteriaErrors,
    reset: resetAddCategoryForm,
    data: addCriteriaData,
  } = createForm({
    initialValues: {
      name: "",
      financialPerformancePoints: 0,
      organizationManagementPoints: 0,
      criteriaFields: [] as CriteriaField[],
    },
    onSubmit: async (body) => {
      try {
        await axios.post("/api/rewards/criterias", body);
        toast.success("Criteria has been added.");
        invalidate((url) => url.pathname == "/api/rewards/criterias");
      } catch {
        toast.error("Unknown error occured, Please try again");
      } finally {
        resetAddCategoryForm();
        isAddCriteriaModalOpen = false;
      }
    },
    extend: [
      validator({
        schema: CreateCriteriaValidation,
        level: "error",
        castValues: true,
      }),
    ],
  });

  const {
    form: editCriteriaForm,
    data: editCriteriaData,
    errors: editCriteriaErrors,
  } = createForm({
    initialValues: {
      id: "",
      name: "",
      financialPerformancePoints: 0,
      organizationManagementPoints: 0,
      criteriaFields: [] as CriteriaField[],
    },
    onSubmit: async (body) => {
      try {
        await axios.put(`/api/rewards/criterias/${body.id}`, body);
        toast.success("Criteria has been updated.");
        invalidate((url) => url.pathname == "/api/rewards/criterias");
      } catch {
        toast.error("Unknown error occured, Please try again");
      } finally {
        isEditCriteriaModalOpen = false;
      }
    },
    extend: [
      validator({
        schema: EditCriteriaValidation,
        level: "error",
        castValues: true,
      }),
    ],
  });
  $: console.log(editCriteriaData);
  const edit = (criteria: CooperativeCriteria) => {
    editCriteriaData.set({
      id: criteria.id ?? "",
      name: criteria.name,
      financialPerformancePoints: criteria.financialPerformancePoints,
      organizationManagementPoints: criteria.organizationManagementPoints,
      criteriaFields: criteria.criteriaFields,
    });
    isEditCriteriaModalOpen = true;
  };
  let selectedCriteria: CooperativeCriteria;
  const initDeleteConfirmDialog = (criteria: CooperativeCriteria) => {
    selectedCriteria = criteria;
    isDeleteConfimationOpen = true;
  };
  const onConfirmDelete = async () => {
    try {
      await axios.delete(`/api/rewards/criterias/${selectedCriteria?.id}`);
      toast.success("Criteria has been deleted.");
      invalidate((url) => url.pathname == "/api/rewards/criterias");
    } catch {
      toast.error("Unknown error occured, Please try again");
    } finally {
      isDeleteConfimationOpen = false;
    }
  };

  const addCriteriaField = (field: CriteriaField) => {
    addCriteriaData.update((prev) => {
      prev.criteriaFields = [...prev.criteriaFields, field];
      return prev;
    });
  };

  const removeCriteriaField = (index: number) => {
    addCriteriaData.update((prev) => {
      prev.criteriaFields = prev.criteriaFields.filter((_, i) => i != index);
      return prev;
    });
  };

  const addEditCriteriaField = (field: CriteriaField) => {
    editCriteriaData.update((prev) => {
      prev.criteriaFields = [...prev.criteriaFields, field];
      return prev;
    });
  };

  const removeEditCriteriaField = (index: number) => {
    editCriteriaData.update((prev) => {
      prev.criteriaFields = prev.criteriaFields.filter((_, i) => i != index);
      return prev;
    });
  };

  $: console.log($editCriteriaData);
</script>

<div>
  <h1 class="text-lg font-semibold mb-3 text-gray-500">
    Cooperative Scoring Criteria
  </h1>
  <div class="container bg-base-100 w-full p-3 rounded mb-8">
    <button
      class="btn modal-button btn-primary mb-3 text-white"
      on:click={() => {
        isAddCriteriaModalOpen = true;
      }}
    >
      <i class="fa-solid fa-plus mr-1" />Add Criteria</button
    >
    <div class="overflow-x-auto">
      <table class="table w-full">
        <!-- head -->
        <thead>
          <tr>
            <th>Criteria</th>

            <th>Financial Performance Points</th>
            <th>Organization Management Points</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {#each data.criterias as criteria}
            <tr>
              <td class="font-semibold">{criteria.name}</td>
              <td>{criteria.financialPerformancePoints}</td>
              <td>{criteria.organizationManagementPoints}</td>
              <th>
                <button
                  class="btn btn-secondary btn-outline"
                  on:click={() => {
                    edit(criteria);
                  }}><i class="fa-regular fa-pen-to-square" /></button
                >
                <button
                  class="btn btn-error btn-outline"
                  on:click={() => {
                    initDeleteConfirmDialog(criteria);
                  }}><i class="fa-solid fa-trash" /></button
                >
              </th>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<Modal
  isOpen={isAddCriteriaModalOpen}
  modalBoxClass={"w-11/12 max-w-5xl"}
  close={() => {
    isAddCriteriaModalOpen = false;
  }}
>
  <form use:addCriteriaForm>
    <h1 class="text-lg font-bold text-gray-500">Add Criteria</h1>
    <TextField
      label="Criteria name"
      name="name"
      type="text"
      error={$addCriteriaErrors?.name?.[0]}
    />
    <TextField
      label="Financial Performance Points"
      name="financialPerformancePoints"
      type="number"
      error={$addCriteriaErrors?.financialPerformancePoints?.[0]}
    />
    <TextField
      label="Organization Management Points"
      name="organizationManagementPoints"
      type="number"
      error={$addCriteriaErrors?.organizationManagementPoints?.[0]}
    />
    <div
      class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5"
    >
      <i class="fa-regular fa-address-card" /> OTHER CRITERIA
    </div>

    <div class="overflow-x-auto mt-2">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Criteria</th>
            <th>Max Points</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {#each $addCriteriaData.criteriaFields as _, i}
            <tr>
              <td class="font-semibold"
                ><TextField
                  name=""
                  noErrorText={true}
                  bind:value={$addCriteriaData.criteriaFields[i].name}
                />
                <small class="text-error ml-1 mt-1">
                  {$addCriteriaErrors.criteriaFields?.[i].name?.[0] ??
                    ""}</small
                >
              </td>
              <td class="font-semibold"
                ><TextField
                  type="number"
                  name=""
                  noErrorText={true}
                  bind:value={$addCriteriaData.criteriaFields[i].maxPoints}
                />
                <small class="text-error ml-1 mt-1">
                  {$addCriteriaErrors.criteriaFields?.[i].maxPoints?.[0] ??
                    ""}</small
                >
              </td>
              <td>
                <button
                  type="button"
                  class="btn btn-error btn-outline mb-2"
                  on:click={() => {
                    removeCriteriaField(i);
                  }}><i class="fa-solid fa-xmark" /></button
                >
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <button
      class="btn btn-primary btn-outline text-base-100 mt-5"
      type="button"
      on:click={() => {
        addCriteriaField({ name: "", maxPoints: 0, criteriaId: "" });
      }}
    >
      <i class="fa-solid fa-plus mr-1" />
      Add Criteria Field</button
    >
    <button class="btn btn-primary text-base-100 mt-5" type="submit">
      <i class="fa-regular fa-floppy-disk mr-2 text-lg" />
      Save</button
    >
  </form>
</Modal>
<Modal
  modalBoxClass={"w-11/12 max-w-5xl"}
  isOpen={isEditCriteriaModalOpen}
  close={() => {
    isEditCriteriaModalOpen = false;
  }}
>
  <form use:editCriteriaForm>
    <h1 class="text-lg font-bold text-gray-500">Edit Criteria</h1>
    <TextField
      value={$editCriteriaData.name}
      label="Criteria name"
      name="name"
      type="text"
      error={$editCriteriaErrors?.name?.[0]}
    />
    <TextField
      value={$editCriteriaData.financialPerformancePoints}
      label="Financial Performance Points"
      name="financialPerformancePoints"
      type="number"
      error={$editCriteriaErrors?.financialPerformancePoints?.[0]}
    />

    <TextField
      value={$editCriteriaData.organizationManagementPoints}
      label="Organization Management Points"
      name="organizationManagementPoints"
      type="number"
      error={$editCriteriaErrors?.organizationManagementPoints?.[0]}
    />
    <div
      class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5"
    >
      <i class="fa-regular fa-address-card" /> OTHER CRITERIA
    </div>

    <div class="overflow-x-auto mt-2">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Criteria</th>
            <th>Max Points</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {#each $editCriteriaData.criteriaFields as _, i}
            <tr>
              <td class="font-semibold"
                ><TextField
                  name=""
                  noErrorText={true}
                  bind:value={$editCriteriaData.criteriaFields[i].name}
                />
                <small class="text-error ml-1 mt-1">
                  {$editCriteriaErrors.criteriaFields?.[i].name?.[0] ??
                    ""}</small
                >
              </td>
              <td class="font-semibold"
                ><TextField
                  type="number"
                  name=""
                  noErrorText={true}
                  bind:value={$editCriteriaData.criteriaFields[i].maxPoints}
                />
                <small class="text-error ml-1 mt-1">
                  {$editCriteriaErrors.criteriaFields?.[i].maxPoints?.[0] ??
                    ""}</small
                >
              </td>
              <td>
                <button
                  type="button"
                  class="btn btn-error btn-outline mb-2"
                  on:click={() => {
                    removeEditCriteriaField(i);
                  }}><i class="fa-solid fa-xmark" /></button
                >
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <button
      class="btn btn-primary btn-outline text-base-100 mt-5"
      type="button"
      on:click={() => {
        addEditCriteriaField({
          name: "",
          maxPoints: 0,
          criteriaId: "",
        });
      }}
    >
      <i class="fa-solid fa-plus mr-1" />
      Add Criteria Field</button
    >
    <button class="btn btn-primary text-base-100 mt-5" type="submit">
      <i class="fa-regular fa-floppy-disk mr-2 text-lg" />
      Save</button
    >
  </form>
</Modal>
<ConfirmDialog
  isOpen={isDeleteConfimationOpen}
  close={() => {
    isDeleteConfimationOpen = false;
  }}
  onConfirm={onConfirmDelete}
  title="Delete Criteria!"
  text="Are you sure you want to delete this criteria?"
/>
<Toaster />

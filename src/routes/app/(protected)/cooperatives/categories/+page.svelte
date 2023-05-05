<script lang="ts">
  import TextField from "$lib/components/form/TextField.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import { createForm } from "felte";
  import { validator } from "@felte/validator-yup";
  import type { CooperativeCategory } from "$lib/definitions/types";
  import {
    CreateCooperativeCategoryValidation,
    EditCooperativeCategoryValidation,
  } from "$lib/definitions/schema";
  import toast, { Toaster } from "svelte-french-toast";
  import axios from "axios";
  import { invalidate } from "$app/navigation";
  import ConfirmDialog from "$lib/components/ui/ConfirmDialog.svelte";
  import SelectField from "$lib/components/form/SelectField.svelte";

  let isAddCategoryModalOpen = false;
  let isEditCategoryModalOpen = false;
  let isDeleteConfimationOpen = false;
  export let data;
  const {
    form: addCategoryForm,
    errors: addCategoryErrors,
    reset: resetAddCategoryForm,
  } = createForm({
    onSubmit: async (body) => {
      try {
        await axios.post("/api/cooperatives/categories", body);
        toast.success("Category has been added.");
        invalidate((url) => url.pathname == "/api/cooperatives/categories");
      } catch {
        toast.error("Unknown error occured, Please try again");
      } finally {
        resetAddCategoryForm();
        isAddCategoryModalOpen = false;
      }
    },
    extend: [
      validator({
        schema: CreateCooperativeCategoryValidation,
        level: "error",
        castValues: true,
      }),
    ],
  });

  const {
    form: editCategoryForm,
    data: editCategoryData,
    errors: editCategoryErrors,
  } = createForm({
    onSubmit: async (body) => {
      try {
        await axios.put(`/api/cooperatives/categories/${body.id}`, body);
        toast.success("Category has been updated.");
        invalidate((url) => url.pathname == "/api/cooperatives/categories");
      } catch {
        toast.error("Unknown error occured, Please try again");
      } finally {
        isEditCategoryModalOpen = false;
      }
    },
    extend: [
      validator({
        schema: EditCooperativeCategoryValidation,
        level: "error",
        castValues: true,
      }),
    ],
  });

  const edit = (category: CooperativeCategory) => {
    editCategoryData.set({
      id: category.id,
      name: category.name,
      requiredAssets: category.requiredAssets,
      criteriaId: category.criteriaId ?? "",
    });
    isEditCategoryModalOpen = true;
  };
  let selectedCategory: CooperativeCategory;
  const initDeleteConfirmDialog = (category: CooperativeCategory) => {
    selectedCategory = category;
    isDeleteConfimationOpen = true;
  };
  const onConfirmDelete = async () => {
    try {
      await axios.delete(`/api/cooperatives/categories/${selectedCategory.id}`);
      toast.success("Category has been deleted.");
      invalidate((url) => url.pathname == "/api/cooperatives/categories");
    } catch {
      toast.error("Unknown error occured, Please try again");
    } finally {
      isDeleteConfimationOpen = false;
    }
  };
</script>

<div>
  <h1 class="text-lg font-semibold mb-3 text-gray-500">
    Cooperative Categories
  </h1>
  <div class="container bg-base-100 w-full p-3 rounded mb-8">
    <button
      class="btn modal-button btn-primary mb-3 text-white"
      on:click={() => {
        isAddCategoryModalOpen = true;
      }}
    >
      <i class="fa-solid fa-plus mr-1" />Add Category</button
    >
    <div class="overflow-x-auto">
      <table class="table w-full">
        <!-- head -->
        <thead>
          <tr>
            <th>Category</th>

            <th>Required Asset Level</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {#each data?.categories as category}
            <tr>
              <td class="font-semibold">{category.name}</td>
              <td
                >{category.requiredAssets.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 0,
                })}</td
              >
              <td>
                <button
                  class="btn btn-secondary btn-outline"
                  on:click={() => {
                    edit(category);
                  }}><i class="fa-regular fa-pen-to-square" /></button
                >
                <button
                  class="btn btn-error btn-outline"
                  on:click={() => {
                    initDeleteConfirmDialog(category);
                  }}><i class="fa-solid fa-trash" /></button
                >
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<Modal
  isOpen={isAddCategoryModalOpen}
  close={() => {
    isAddCategoryModalOpen = false;
  }}
>
  <form use:addCategoryForm>
    <h1 class="text-lg font-bold text-gray-500">Add Category</h1>
    <TextField
      label="Category name"
      name="name"
      type="text"
      error={$addCategoryErrors?.name}
    />
    <TextField
      label="Required Assets"
      name="requiredAssets"
      type="number"
      error={$addCategoryErrors?.requiredAssets}
      step=".01"
    />
    <div
      class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5"
    >
      <i class="fa-regular fa-address-card" /> REWARD SCORING CRITERIA
    </div>
    <SelectField name="criteriaId" error={$addCategoryErrors?.criteriaId?.[0]}>
      {#each data.criterias as criteria}
        <option value={criteria.id}> {criteria.name}</option>
      {/each}
    </SelectField>
    <button class="btn btn-primary text-base-100 mt-5" type="submit">
      <i class="fa-regular fa-floppy-disk mr-2 text-lg" />
      Save</button
    >
  </form>
</Modal>
<Modal
  isOpen={isEditCategoryModalOpen}
  close={() => {
    isEditCategoryModalOpen = false;
  }}
>
  <form use:editCategoryForm>
    <h1 class="text-lg font-bold text-gray-500">Edit Category</h1>
    <TextField
      value={$editCategoryData?.name}
      label="Category name"
      name="name"
      type="text"
      error={$editCategoryErrors?.name}
    />
    <TextField
      value={$editCategoryData?.requiredAssets}
      label="Required Assets"
      name="requiredAssets"
      type="number"
      error={$editCategoryErrors?.requiredAssets}
      step=".01"
    />
    <div
      class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5"
    >
      <i class="fa-regular fa-address-card" /> REWARD SCORING CRITERIA
    </div>
    <SelectField
      value={$editCategoryData?.criteriaId}
      name="criteriaId"
      error={$editCategoryErrors.criteriaId?.[0]}
    >
      {#each data.criterias as criteria}
        <option value={criteria.id}> {criteria.name}</option>
      {/each}
    </SelectField>
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
  title="Delete Category?"
  text="Are you sure you want to delete this category?"
/>
<Toaster />

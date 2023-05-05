<script lang="ts">
  import { invalidate, invalidateAll } from "$app/navigation";
  import CooperativeSelector from "$lib/components/cooperative-selector/CooperativeSelector.svelte";
  import SelectField from "$lib/components/form/SelectField.svelte";
  import TextField from "$lib/components/form/TextField.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import type {
    Cooperative,
    CriteriaFieldPoint,
    DefaultPoint,
  } from "$lib/definitions/types";
  import axios from "axios";
  import { createForm } from "felte";
  import { validator } from "@felte/validator-yup";
  import {
    EditCriteriaFieldPointValidation,
    EditDefaultCriteriaPointValidation,
    GiveRewardValidation,
  } from "$lib/definitions/schema.js";
  import toast, { Toaster } from "svelte-french-toast";
  import StatsCard from "./StatsCard.svelte";
  import { onMount } from "svelte";
  import { PointTypes } from "$lib/internal/default_points";

  export let data;

  let isAssignModalOpen = false;
  let isEditDefaultPointsOpen = false;
  let isEditCriteriaFieldPointsOpen = false;
  let selectedCategoryId: string = "";
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
    },
    onSubmit: async (body) => {
      try {
        await axios.post("/api/recognitions", body);
        toast.success("Reward given successfully");
      } catch {
        toast.error("Unknown error occured, please try again later.");
      } finally {
        closeAssignModal();
        resetAssignForm();
      }
    },
    extend: [
      validator({
        schema: GiveRewardValidation,
        castValues: true,
        level: "error",
      }),
    ],
  });

  let selectedCooperative: Cooperative;
  const giveReward = async (cooperative: Cooperative) => {
    selectedCooperative = cooperative;
    assignFormData.update((prev) => ({
      ...prev,
      cooperativeId: cooperative.id ?? "",
    }));
    openAssignModal();
  };

  onMount(() => {
    selectedCategoryId = localStorage.getItem("selectedCategory") ?? "";
  });
  const onSelectCategory = (event: Event) => {
    if (!event?.target) return;
    const select = event.target as HTMLSelectElement;
    localStorage.setItem("selectedCategory", select.value);
    selectedCategoryId = select.value;
  };
  const closeAssignModal = () => {
    isAssignModalOpen = false;
  };

  const openAssignModal = () => {
    isAssignModalOpen = true;
  };

  const {
    form: editDefaultCriteriaPointsForm,
    data: editDefaultCriteriaPointsData,
    errors: editDefaultCriteriaPointsFormErrors,
    reset: resetEditDefaultCriteriaPointsForm,
  } = createForm({
    initialValues: {
      name: "",
      cooperativeId: "",
      categoryId: "",
      financialPerformancePoints: 0,
      organizationManagementPoints: 0,
      type: "",
    },
    onSubmit: async (body) => {
      try {
        await axios.post("/api/rewards/points/default", body);
        invalidateAll();
        toast.success("Points assigned successfully");
      } catch (error) {
        toast.error("Unknown error occured, Please try again later.");
      } finally {
        resetEditDefaultCriteriaPointsForm();
        isEditDefaultPointsOpen = false;
      }
    },
    extend: [
      validator({
        schema: EditDefaultCriteriaPointValidation,
        castValues: true,
        level: "error",
      }),
    ],
  });

  const {
    form: editCriteriaFieldPointsForm,
    data: editCriteriaFieldPointsData,
    errors: editCriteriaFieldPointsErrors,
    reset: resetEditCriteriaFieldPointsForm,
  } = createForm({
    initialValues: {
      name: "",
      cooperativeId: "",
      categoryId: "",
      criteriaFieldId: "",
      points: 0,
    },
    onSubmit: async (body) => {
      try {
        await axios.post("/api/rewards/points/field", body);
        invalidateAll();
        toast.success("Points assigned successfully");
      } catch (error) {
        toast.error("Unknown error occured, Please try again later.");
      } finally {
        isEditCriteriaFieldPointsOpen = false;
        resetEditCriteriaFieldPointsForm();
      }
    },
    extend: [
      validator({
        schema: EditCriteriaFieldPointValidation,
        castValues: true,
        level: "error",
      }),
    ],
  });
  const editDefaultCriteriaPoints = (points: DefaultPoint) => {
    editDefaultCriteriaPointsData.set({
      name: points.name ?? "",
      cooperativeId: points.cooperativeId,
      categoryId: points.categoryId,
      financialPerformancePoints: points.financialPerformancePoints,
      organizationManagementPoints: points.organizationManagementPoints,
      type: points.type ?? "",
    });
    isEditDefaultPointsOpen = true;
  };
  const editCriteriaFieldPoints = (points: CriteriaFieldPoint) => {
    editCriteriaFieldPointsData.set({
      categoryId: points.categoryId,
      cooperativeId: points.cooperativeId,
      criteriaFieldId: points.criteriaFieldId,
      points: points.points,
      name: points.name ?? "",
    });
    isEditCriteriaFieldPointsOpen = true;
  };
  const clearDefaultCriteriaPoints = async (points: DefaultPoint) => {
    try {
      await axios.post("/api/rewards/points/default", points);
      invalidateAll();
      toast.success("Points has been cleared.");
    } catch (error) {
      toast.error("Unknown error occured, Please try again later.");
    }
  };

  const clearCriteriaFieldPoints = async (points: CriteriaFieldPoint) => {
    try {
      await axios.post("/api/rewards/points/field", points);
      invalidateAll();
      toast.success("Points has been cleared.");
    } catch (error) {
      toast.error("Unknown error occured, Please try again later.");
    }
  };
  $: criteriaFieldPoints =
    data.categories
      .find((c) => c.id === selectedCategoryId)
      ?.criteriaFieldPoints.reduce<Record<string, CriteriaFieldPoint>>(
        (a, c) => {
          const key = `${c.categoryId}_${c.criteriaFieldId}_${c.cooperativeId}`;
          a[key] = c;
          return a;
        },
        {}
      ) ?? {};
</script>

<div class="container bg-base-100 w-full p-3 rounded pb-4">
  <div>
    <SelectField value={selectedCategoryId} on:change={onSelectCategory}>
      <option>Select category</option>
      {#each data.categories as category}
        <option value={category.id}>{category.name}</option>
      {/each}
    </SelectField>
  </div>
</div>

{#each data.categories as category}
  {#if selectedCategoryId === category.id}
    <h1 class="text-lg font-semibold text-gray-500 mt-5 ml-2">
      {category.name}
    </h1>
    {#if category.cooperatives?.length != 0}
      <button class="btn btn-primary text-white mt-3 ml-2">
        <i class="fa-solid fa-rotate-left mr-2" /> Reset Points</button
      >
    {/if}

    <div class="grid grid-cols-1 2xl:grid-cols-2 mt-5 gap-2">
      {#each category?.cooperatives ?? [] as cooperative}
        <StatsCard
          {giveReward}
          {clearCriteriaFieldPoints}
          {criteriaFieldPoints}
          {editCriteriaFieldPoints}
          {cooperative}
          {category}
          {clearDefaultCriteriaPoints}
          {editDefaultCriteriaPoints}
        />
      {/each}
    </div>
  {/if}
{/each}

<Modal isOpen={isAssignModalOpen} close={closeAssignModal}>
  <h1 class="text-lg font-bold">Give Reward</h1>
  <form use:assignForm>
    <SelectField
      label={"Reward"}
      labelFor="reward"
      name="rewardId"
      error={$assignFormErrors.rewardId?.[0]}
    >
      {#each data.rewards ?? [] as reward}
        <option value={reward?.id}>{reward.name}</option>
      {/each}
    </SelectField>
    <TextField name="date" type="date" error={$assignFormErrors?.date?.[0]} />
    <button class="btn btn-primary text-base-100 mt-3" type="submit"
      >Give</button
    >
  </form>
</Modal>

<Modal
  isOpen={isEditDefaultPointsOpen}
  close={() => {
    isEditDefaultPointsOpen = false;
  }}
>
  <h1 class="text-lg font-bold">{$editDefaultCriteriaPointsData.name}</h1>
  <form use:editDefaultCriteriaPointsForm>
    <TextField
      type="number"
      error={$editDefaultCriteriaPointsData.type === PointTypes.Financial
        ? $editDefaultCriteriaPointsFormErrors?.financialPerformancePoints?.[0]
        : $editDefaultCriteriaPointsFormErrors
            ?.organizationManagementPoints?.[0]}
      value={$editDefaultCriteriaPointsData.type === PointTypes.Financial
        ? $editDefaultCriteriaPointsData.financialPerformancePoints
        : $editDefaultCriteriaPointsData.organizationManagementPoints}
      name={$editDefaultCriteriaPointsData.type === PointTypes.Financial
        ? "financialPerformancePoints"
        : "organizationManagementPoints"}
      label="Points"
      labelFor="points"
    />
    <button class="btn btn-primary text-base-100 mt-3" type="submit"
      >Save</button
    >
  </form>
</Modal>

<Modal
  isOpen={isEditCriteriaFieldPointsOpen}
  close={() => {
    isEditCriteriaFieldPointsOpen = false;
  }}
>
  <h1 class="text-lg font-bold">{$editCriteriaFieldPointsData.name}</h1>
  <form use:editCriteriaFieldPointsForm>
    <TextField
      errors={$editCriteriaFieldPointsErrors?.points?.[0]}
      value={$editCriteriaFieldPointsData.points}
      name="points"
      label="Points"
      type="number"
    />
    <button class="btn btn-primary text-base-100 mt-3" type="submit"
      >Save</button
    >
  </form>
</Modal>
<Toaster />

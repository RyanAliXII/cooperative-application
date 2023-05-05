<script lang="ts">
  import type {
    Cooperative,
    CooperativeCategory,
    CriteriaFieldPoint,
    DefaultPoint,
  } from "$lib/definitions/types";
  import { PointTypes } from "$lib/internal/default_points";
  import ordinal from "ordinal";
  export let cooperative: Cooperative;
  export let editDefaultCriteriaPoints: (point: DefaultPoint) => void;
  export let clearDefaultCriteriaPoints: (point: DefaultPoint) => void;
  export let clearCriteriaFieldPoints: (point: CriteriaFieldPoint) => void;
  export let editCriteriaFieldPoints: (points: CriteriaFieldPoint) => void;
  export let category: CooperativeCategory;

  export let giveReward: (cooperative: Cooperative) => void;
  export let criteriaFieldPoints: Record<string, CriteriaFieldPoint>;
  type Tab = "overview" | "points_summary";
  let activeTab: Tab = "overview";
  $: isFinancialPointsOverriden =
    cooperative.rank?.overridenFinancialPerformancePoints ?? 0 > 0;
  $: isManagementPointsOverriden =
    cooperative.rank?.overridenOrganizationManagementPoints ?? 0 > 0;
</script>

<div class="card bg-base-100 shadow-xl">
  <div class="tabs">
    <button
      class="tab tab-bordered"
      class:tab-active={activeTab === "overview"}
      on:click={() => {
        activeTab = "overview";
      }}>Overview</button
    >

    <button
      class="tab tab-bordered"
      on:click={() => {
        activeTab = "points_summary";
      }}
      class:tab-active={activeTab === "points_summary"}>Points Summary</button
    >
  </div>
  <div class="card-body">
    {#if activeTab === "overview"}
      <div class="flex gap-2 items-center h-30">
        <img
          src="https://api.dicebear.com/6.x/initials/svg?seed={cooperative.name}&backgroundColor=EB7C2A"
          alt="avatar"
          class="w-12 rounded-full"
        />
        <div>
          <h2 class="card-title">{cooperative.name}</h2>
          <small class="text-gray-500">{cooperative.registrationNumber}</small>
        </div>
      </div>
      <div class="flex justify-center mt-5">
        <div class="basis-6/12 flex flex-col items-center text-success">
          <h2 class="text-xl font-bold">
            {ordinal(cooperative.rank?.rankPosition ?? 0)}
          </h2>
          <small>Position</small>
        </div>
        <div class="basis-6/12 flex flex-col items-center text-secondary">
          <h2 class="text-xl font-bold">
            {cooperative.rank?.points ?? 0}
          </h2>
          <small>Total Points</small>
        </div>
      </div>
      <div class="container bg-base-100 w-full p-3 rounded">
        <div
          class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5"
        >
          <i class="fa-regular fa-address-card" /> MEMBERS
        </div>
        <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
          <span>Members</span>
          <span class="font-bold">{cooperative?.stats?.members}</span>
        </div>
        <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
          <span>Exited Members</span>
          <span class="font-bold">{cooperative?.stats?.exitedMembers}</span>
        </div>
        <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
          <span>Exited Members Ratio</span>
          <span class="font-bold">{cooperative?.stats?.exitedRatio}%</span>
        </div>

        <div
          class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5"
        >
          <i class="fa-regular fa-address-card" /> SUMMARY
        </div>
        <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
          <span>Assets</span>
          <span class="font-bold"
            >PHP {cooperative?.stats?.assets.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) ?? 0}</span
          >
        </div>
        <div class="grid grid-cols-2 border-b px-2 py-3 mt-5">
          <span>Liquidity</span>
          <span class="font-bold"
            >PHP {cooperative?.stats?.liquidity.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) ?? 0}</span
          >
        </div>
      </div>
      <div class="card-actions justify-end">
        <button
          class="btn btn-primary text-white w-full xl:w-fit"
          on:click={() => {
            giveReward(cooperative);
          }}>Give Reward</button
        >
        <a
          href="/app/cooperatives/view/{cooperative.id}"
          class="btn btn-secondary btn-outline text-white w-full xl:w-fit"
          >View Full Details</a
        >
      </div>
    {/if}
    {#if activeTab === "points_summary"}
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Criteria</th>
              <th>System Generated Value</th>
              <th>User Defined Value</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> Financial Performance </td>
              <td
                class="font-bold"
                class:text-gray-300={isFinancialPointsOverriden}
              >
                {cooperative.rank?.financialPerformancePoints}
              </td>
              <td
                class="font-bold"
                class:text-gray-300={!isFinancialPointsOverriden}
                >{cooperative.rank?.overridenFinancialPerformancePoints}</td
              >
              <td>
                {#if !isFinancialPointsOverriden}
                  <button
                    class="btn btn-secondary text-white btn-outline"
                    on:click={() => {
                      editDefaultCriteriaPoints({
                        categoryId: category.id ?? "",
                        cooperativeId: cooperative.id ?? "",
                        financialPerformancePoints:
                          cooperative.rank
                            ?.overridenFinancialPerformancePoints ?? 0,
                        organizationManagementPoints:
                          cooperative.rank
                            ?.overridenOrganizationManagementPoints ?? 0,
                        name: "Financial Performance",
                        type: PointTypes.Financial,
                      });
                    }}><i class="fa-regular fa-pen-to-square" /></button
                  >
                {/if}

                {#if isFinancialPointsOverriden}
                  <button
                    class="btn btn-warning text-white"
                    on:click={() => {
                      clearDefaultCriteriaPoints({
                        categoryId: category.id ?? "",
                        cooperativeId: cooperative.id ?? "",
                        financialPerformancePoints: 0,
                        organizationManagementPoints:
                          cooperative.rank
                            ?.overridenOrganizationManagementPoints ?? 0,
                        name: "Financial Performance",
                        type: PointTypes.Financial,
                      });
                    }}><i class="fa-solid fa-x" /></button
                  >
                {/if}
              </td>
            </tr>
            <tr>
              <td> Organization Management </td>
              <td
                class="font-bold"
                class:text-gray-300={isManagementPointsOverriden}
              >
                {cooperative.rank?.organizationManagementPoints}
              </td>
              <td
                class="font-bold"
                class:text-gray-300={!isManagementPointsOverriden}
                >{cooperative.rank?.overridenOrganizationManagementPoints}</td
              >
              <td>
                {#if !isManagementPointsOverriden}
                  <button
                    class="btn btn-secondary text-white btn-outline"
                    on:click={() => {
                      editDefaultCriteriaPoints({
                        categoryId: category.id ?? "",
                        cooperativeId: cooperative.id ?? "",
                        financialPerformancePoints:
                          cooperative.rank
                            ?.overridenFinancialPerformancePoints ?? 0,
                        organizationManagementPoints:
                          cooperative.rank
                            ?.overridenOrganizationManagementPoints ?? 0,
                        name: "Organization Management",
                        type: PointTypes.Management,
                      });
                    }}><i class="fa-regular fa-pen-to-square" /></button
                  >
                {/if}
                {#if isManagementPointsOverriden}
                  <button
                    class="btn btn-warning text-white"
                    on:click={() => {
                      clearDefaultCriteriaPoints({
                        categoryId: category.id ?? "",
                        cooperativeId: cooperative.id ?? "",
                        financialPerformancePoints:
                          cooperative.rank
                            ?.overridenFinancialPerformancePoints ?? 0,
                        organizationManagementPoints: 0,
                        name: "Organization Management",
                        type: PointTypes.Management,
                      });
                    }}><i class="fa-solid fa-x" /></button
                  >
                {/if}
              </td>
            </tr>
            {#each category.criteria?.criteriaFields ?? [] as field}
              <tr>
                <td> {field.name} </td>
                <td class="font-bold text-gray-300">N/A</td>
                <td class="font-bold"
                  >{criteriaFieldPoints[
                    `${category.id}_${field.id}_${cooperative.id}`
                  ]?.points ?? 0}</td
                >
                <td>
                  <button
                    class="btn btn-secondary text-white btn-outline"
                    on:click={() => {
                      editCriteriaFieldPoints({
                        categoryId: category.id ?? "",
                        cooperativeId: cooperative.id ?? "",
                        criteriaFieldId: field.id ?? "",
                        points:
                          criteriaFieldPoints[
                            `${category.id}_${field.id}_${cooperative.id}`
                          ]?.points ?? 0,
                        name: field.name,
                      });
                    }}><i class="fa-regular fa-pen-to-square" /></button
                  >

                  {#if criteriaFieldPoints[`${category.id}_${field.id}_${cooperative.id}`]?.points ?? 0 != 0}
                    <button
                      class="btn btn-warning text-white"
                      on:click={() => {
                        clearCriteriaFieldPoints({
                          categoryId: category.id ?? "",
                          cooperativeId: cooperative.id ?? "",
                          criteriaFieldId: field.id ?? "",
                          points: 0,
                          name: field.name,
                        });
                      }}><i class="fa-solid fa-x" /></button
                    >
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

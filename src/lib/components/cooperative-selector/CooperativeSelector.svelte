
<script lang="ts">
    import axios from "axios";
    import TextField from "../form/TextField.svelte";
    import type { Cooperative, Member } from "$lib/definitions/types";
    let isSearchResultOpen = false
    let timer:NodeJS.Timeout;
    let cooperatives:Cooperative[] = []
    export let handleSelect: (member: Cooperative)=>void;
    export let error = ""
    const handleInput = (event: Event)=>{
    const val = (event.target as HTMLInputElement)?.value;
    if(val.length === 0){
        isSearchResultOpen = false
        return 
    }
    //debounce
    clearTimeout(timer)
    timer = setTimeout(()=>{
        searchCooperatives(val)
    }, 500)
  }
  const searchCooperatives = async(query: string)=>{
    const response = await axios.get(`/api/cooperatives?q=${query}`)
    const {data:responseData} = response.data
    cooperatives = responseData?.cooperatives ?? []
    isSearchResultOpen = true;
  }
  const handleInputBlur = (e: FocusEvent)=>{
 
  }

</script>
<TextField label="Search by cooperative name, registration number or initials"  on:input={handleInput} on:blur={handleInputBlur} error={error} /> 
<div class="relative">
        <div class="bg-base-100  w-full absolute rounded shadow mt-2 overflow-y-scroll z-10" class:hidden="{!isSearchResultOpen}"  style="max-height: 300px;"  >
            <ul class="list-none" >
                    {#each cooperatives as cooperative }
                        <li class="cursor-pointer  flex items-center gap-2 border border-b h-20 px-3" on:click={()=>{handleSelect(cooperative); isSearchResultOpen = false}} role={"button"}>
                            <div>
                                <img src="https://api.dicebear.com/6.x/initials/svg?seed={cooperative.name}&backgroundColor=EB7C2A" alt="avatar" class="w-10 rounded-full">

                            </div>
                            <div class="flex flex-col justify-center">
                            <span class="font-bold">{cooperative.name}</span>
                            <small class="text-gray-400">{cooperative.registrationNumber}</small>
                            </div>
                        
                        </li>
                    {/each}
            </ul>
        </div>
    </div>
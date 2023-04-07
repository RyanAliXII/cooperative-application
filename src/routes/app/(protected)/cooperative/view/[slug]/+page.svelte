<script lang="ts">
 

    import TextField from "$lib/components/form/TextField.svelte";
    import TextAreaField from "$lib/components/form/TextAreaField.svelte";
    import SelectField from "$lib/components/form/SelectField.svelte";
    import toast, { Toaster } from 'svelte-french-toast';
    import  axios from "axios"
    import { EditCooperativeSchema } from "$lib/definitions/schema";
    import {createForm} from "felte"
    import { validator } from '@felte/validator-yup';
  import Swal from "sweetalert2";

    export let data;
    let isViewMode = true
    const id = data?.cooperativeId
    const {form, errors, } = createForm({
        initialValues: data?.cooperative,
        onSubmit:async(body)=>{
          if(isViewMode) return
          try{
            const response = await axios.put(`/api/cooperatives/${id}`, body)
            const {data} = response.data
            toast.success("Cooperative has been updated.")
            isViewMode = true
          }
          catch{
            toast.error("Unknown error occured, while updating resource.")
          }
       
         
        },
        onError:(er)=>{
            console.log(er)
        },
        extend: validator({schema: EditCooperativeSchema, castValues: true, level:"error"}),  
    })
    const toggleMode = ()=>{
      isViewMode = !isViewMode
    }

    const recreatePassword = async()=>{
      const result = await Swal.fire({
        title:"Re-create Password",
        icon:"warning",
        text:"Are you sure you want to recreate the password for this cooperative account? This action cannot be reverted.",
        showCancelButton: true,
      })
      if(result.isConfirmed){

        try{
            const response = await axios.patch(`/api/cooperatives/${id}/accounts/password`)
            const {data} = response.data
            Swal.fire("New Password",`The new password for this cooperative account is <br> <strong>${data?.account.password}</strong> <br>. 
            Please keep the pasword since this will be the only time it will be shown.`, "info")
      
          }
          catch{
            toast.error("Unknown error occured, while creating resource.")
          }

      }
    }
    </script>
    
    <div>
      
        <h1 class="text-lg font-semibold mb-3 text-gray-500">Cooperative</h1>
        <div class="container bg-base-100 w-full  p-3 rounded">

          {#if isViewMode }
          <button class="btn btn-secondary btn-outline my-3 mx-1" on:click={toggleMode}><i class="fa-regular fa-pen-to-square mr-2" ></i> Switch to Edit Mode</button>
          {:else}
          <button class="btn btn-secondary btn-outline my-3 mx-1" on:click={toggleMode}><i class="fa-regular fa-eye mr-2"></i> Switch to View Mode</button> 
          
          {/if}
          
         
            <form use:form >
              <form use:form >
                <div class="w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2">
                    <i class="fa-regular fa-address-card"></i>  COOPERATIVE INFO
                </div>
                <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <TextField  label="Cooperative name" labelFor="name" error={$errors?.name?.[0]}  name="name" disabled={isViewMode}></TextField>
                    <TextField   label="Registration No" labelFor="registrationNumber" error={$errors?.registrationNumber?.[0]} name="registrationNumber" disabled={isViewMode}></TextField>
                    <TextField   label="Cooperative Initials" labelFor="initials" error={$errors?.initials?.[0]} name="initials" disabled={isViewMode}></TextField>  
                </div>
        
    
            <TextAreaField  label="Address" labelFor="address" error={$errors?.address?.[0]} name="address" disabled={isViewMode}>
    
            </TextAreaField>
      
    
         
            <div class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5">
                <i class="fa-regular fa-address-card"></i>  COOPERATIVE ACC. INFO
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3  gap-2">
                  <TextField label="Given name" labelFor="givenName" name="account.givenName" error={$errors?.account?.givenName?.[0]} disabled={isViewMode}>
    
                  </TextField>
                  <TextField  label="Middlename" labelFor="middleName" name="account.middleName" error={$errors?.account?.middleName?.[0]} disabled={isViewMode}>
    
                  </TextField>
                  <TextField  label="Surname" labelFor="surname" name="account.surname"  error={$errors?.account?.surname?.[0]} disabled={isViewMode}>
    
                  </TextField>
                  <TextField label="Email" labelFor="email" name="account.email" type="email"  error={$errors?.account?.email?.[0]} disabled={isViewMode}>
    
                  </TextField>
                  <div class="mt-9 ml-3">
                  <button type="button" class="btn btn-secondary" on:click={recreatePassword} disabled={ isViewMode ? true : false}><i class="fa-solid fa-rotate mr-2"></i>Re-create Password</button>
                </div>
                
            </div>
            <div class="mt-5 w-full flex justify-end">
                 <button class=" btn btn-primary px-8 py-2 mr-2 mb-2" disabled={ isViewMode ? true : false} >
                    <i class="fa-regular fa-floppy-disk mr-2 text-lg "></i>
                    Save</button>
                </div>
            </form>
        </div>
       </div>
       <Toaster/>
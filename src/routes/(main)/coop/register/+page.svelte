<script lang="ts">
 

import TextField from "$lib/components/form/TextField.svelte";
import TextAreaField from "$lib/components/form/TextAreaField.svelte";
import SelectField from "$lib/components/form/SelectField.svelte";
import toast, { Toaster } from 'svelte-french-toast';
import  axios from "axios"
import { CreateCooperativeSchema } from "$lib/definitions/schema";
import {createForm} from "felte"
import { validateSchema, validator } from '@felte/validator-yup';


const {form, errors, } = createForm({
 
    onSubmit:(data)=>{
        console.log(data)
    },
    onError:(er)=>{
        console.log(er)
    },
    extend: validator({schema: CreateCooperativeSchema, castValues: true, level:"error"}),  
})

</script>

<div>
  
    <h1 class="text-lg font-semibold mb-3 text-gray-500">Register Cooperative</h1>
    <div class="container bg-base-100 w-full  p-3 rounded">

        <form use:form >
        <div class="w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2">
            <i class="fa-regular fa-address-card"></i>  COOPERATIVE INFO
        </div>
        <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
            <TextField  label="Cooperative name" labelFor="name" error={$errors?.name?.[0]}  name="name" ></TextField>
            <TextField   label="Registration No" labelFor="registrationNumber" error={$errors?.registrationNumber?.[0]} name="registrationNumber"></TextField>
            <TextField   label="Cooperative Initials" labelFor="initials" error={$errors?.initials?.[0]} name="initials"></TextField>  
        </div>

        <TextAreaField  label="Address" labelFor="address" error={$errors?.address?.[0]} name="address">

        </TextAreaField>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <SelectField label="Province" labelFor="province" name="province" error={$errors?.province?.[0]}>
              <option disabled selected>Select Province</option>
              <option>Star Wars</option>
              <option>Harry Potter</option>
              <option>Lord of the Rings</option>
              <option>Planet of the Apes</option>
              <option>Star Trek</option>
            </SelectField>


            <SelectField label="City" labelFor="city" name="city" error={$errors?.city?.[0]} >
              <option disabled selected>Select City</option>
              <option>Star Wars</option>
              <option>Harry Potter</option>
              <option>Lord of the Rings</option>
              <option>Planet of the Apes</option>
              <option>Star Trek</option>
            </SelectField>

        </div>

     
        <div class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5">
            <i class="fa-regular fa-address-card"></i>  COOPERATIVE ACC. INFO
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3  gap-2">
              <TextField label="Given name" labelFor="givenName" name="account.givenName" error={$errors?.account?.givenName?.[0]} >

              </TextField>
              <TextField  label="Middlename" labelFor="middleName" name="account.middleName" error={$errors?.account?.middleName?.[0]}>

              </TextField>
              <TextField  label="Surname" labelFor="surname" name="account.surname"  error={$errors?.account?.surname?.[0]}>

              </TextField>
              <TextField label="Email" labelFor="email" name="account.email" type="email"  error={$errors?.account?.email?.[0]}>

              </TextField>
          
            
        </div>
        <div class="mt-5 w-full flex justify-end">
             <button class=" btn btn-primary px-8 py-2 mr-2 mb-2">
                <i class="fa-regular fa-floppy-disk mr-2 text-lg"></i>
                Save</button>
            </div>
        </form>
    </div>
   </div>
   <Toaster/>
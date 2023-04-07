
<script lang="ts">
    import SelectField from "$lib/components/form/SelectField.svelte";
    import TextAreaField from "$lib/components/form/TextAreaField.svelte";
    import TextField from "$lib/components/form/TextField.svelte";
    import {createForm} from "felte"
    import { validator } from '@felte/validator-yup';
    import { EditMemberValidationSchema } from "$lib/definitions/schema";
    import axios from "axios";
    import toast,{ Toaster} from "svelte-french-toast";
    import type { Member } from "$lib/definitions/types";
  
    let isViewMode = true
    export let data;
   
    const {form, data: body, errors} = createForm<Member>({
      initialValues: data?.member,
      extend: [validator({schema: EditMemberValidationSchema, castValues:  true })],
      onSubmit:async(body)=>{
        try{
          const response  = await axios.put(`/api/members/${data?.memberId}`, body, {
            withCredentials: true
          })
        
          toast.success("Member data has been updated.")
          isViewMode = true
        }
        catch(error){
            console.log(error)
            toast.error("Unknown error occured.")
        }
      
      }
    })
  
    const addDependent = ()=>{
      const newDependent =  {name:"", relationship:"", birthday: ""}
      body.update(prev=>{
        prev.dependents.push(newDependent)
        return prev
      })
    }
    const removeDependent = (index: number)=>{
      body.update(prev=>{
        prev.dependents = prev.dependents.filter((_, i)=>i != index)
        return prev
      })
    }
    const toggleMode = ()=>{
      isViewMode = !isViewMode
    }
   
  </script>
  <div>
    
      <h1 class="text-lg font-semibold mb-3 text-gray-500">Member</h1>
      <div class="container bg-base-100 w-full  p-3 rounded">

        {#if isViewMode }
        <button class="btn btn-secondary btn-outline my-3 mx-1" on:click={toggleMode}><i class="fa-regular fa-pen-to-square mr-2" ></i> Switch to Edit Mode</button>
        {:else}
        <button class="btn btn-secondary btn-outline my-3 mx-1" on:click={toggleMode}><i class="fa-regular fa-eye mr-2"></i> Switch to View Mode</button> 
        
        {/if}
        <form use:form>
          <div>
              <div class="w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2">
                  <i class="fa-regular fa-address-card"></i> MEMBER BASIC INFO
              </div>
              <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
                  <TextField  label="Given name" labelFor="givenName"  name="givenName" error={$errors?.givenName?.[0]} disabled={isViewMode}/>
                  <TextField   label="Middle name" labelFor="middleName"  name="middleName" error={$errors?.givenName?.[0]} disabled={isViewMode}/>
                  <TextField   label="Surname" labelFor="surname"  name="surname" error={$errors?.surname?.[0]} disabled={isViewMode}/>
                  <TextField   label="Date of Birth" labelFor="birthday"  name="birthday" type="date" error={$errors?.birthday?.[0]} disabled={isViewMode}/>
                  <SelectField label="Gender" name="gender" error={$errors?.gender?.[0]} disabled={isViewMode}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="female">Others</option>
                </SelectField>
                  <SelectField label="Educational Attainment" name="educationalAttainment" error={$errors?.educationalAttainment?.[0]} disabled={isViewMode}>
                    <option value="high-school-graduate">Highschool Graduate</option>
                    <option value="high-school-undergraduate">Highschool Undergraduate</option>
                    <option value="college-undergraduate">College Undergraduate</option>
                    <option value="college-graduate">College Graduate</option>
                </SelectField>
                  <TextField   label="Tax Identification No." labelFor="TIN"  name="TIN" error={$errors?.TIN?.[0]} disabled={isViewMode}/>
                  <SelectField label="Civil Status" name="civilStatus" error={$errors?.civilStatus?.[0]} disabled={isViewMode}>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                  </SelectField>
                  <TextField   label="Name of Spouse(If married)" labelFor="spouseName"  name="spouseName" error={$errors?.spouseName?.[0]} disabled={isViewMode}/>
              </div>
              <div class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5">
                  <i class="fa-regular fa-address-card"></i>  ADDRESSES
              </div>
              <TextAreaField  label="Present Home/ Mailing Address" labelFor="presentAddress"  name="presentAddress" error={$errors?.presentAddress?.[0]} disabled={isViewMode}/>
              <TextAreaField  label="Provincial Address" labelFor="provincialAddress"  name="provincialAddress" error={$errors?.provincialAddress?.[0]} disabled={isViewMode}/>
              <TextAreaField  label="Office Address" labelFor="officeAddress"  name="officeAddress" error={$errors?.officeAddress?.[0]} disabled={isViewMode}/>
              <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
                
              </div>
              <div class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5">
                  <i class="fa-regular fa-address-card"></i>  CONTACT INFO
              </div>
              <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
                  <TextField  label="Email" labelFor="email"  name="account.email" type="email" error={$errors?.account?.email?.[0]} disabled={isViewMode}/>
                  <TextField   label="Phone number" labelFor="mobileNumber"  name="account.mobileNumber" error={$errors?.account?.mobileNumber?.[0]}  disabled={isViewMode}/>
                  <TextField   label="Office Phone Number" labelFor="officePhoneNumber"  name="officePhoneNumber" error={$errors?.officePhoneNumber?.[0]} disabled={isViewMode}/>
                
              </div>
              <div class="bg-base-200 w-full h-10 rounded flex items-center px-2 text-gray-600 font-semibold gap-2 mt-5">
                  <i class="fa-regular fa-address-card"></i>  DEPENDENTS
              </div>
              <button class="btn btn-outline btn-primary mt-5" type="button" on:click={addDependent} disabled={isViewMode}>Add Dependent</button>
              <div class="overflow-x-auto mt-5">
                  <table class="table w-full">
                    <!-- head -->
                    <thead>
                      <tr>
                        <th>Name of Dependent/s</th>
                        <th>Relationship</th>
                        <th>Date of Birth</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each $body?.dependents ?? [] as _, i }
                      <tr>
                        <td>
                          <TextField placeholder="Dependent name" name="" bind:value={$body.dependents[i].name} type="text"  error={$errors?.dependents?.[i]?.name?.[0]} noErrorText={true} disabled={isViewMode}/>
                          <small class="text-error ml-1 mt-1"> {$errors?.dependents?.[i]?.name?.[0] ?? ""}</small>
                        </td>
  
                        <td>
                          <SelectField name="" placeholder="Your relationship with dependent" bind:value={$body.dependents[i].relationship} error={$errors?.dependents?.[i]?.relationship?.[0]} noErrorText={true} disabled={isViewMode}>
                          <option value="father">Father</option>
                          <option value="mother">Mother</option>
                          <option value="spouse">Spouse</option>
                          <option value="children">Children</option>
                          </SelectField>
                          <small class="text-error ml-1 mt-1"> {$errors?.dependents?.[i]?.relationship?.[0] ?? ""}</small>
                        </td>
                        
                        <td>
                          <TextField name=""  bind:value={$body.dependents[i].birthday} type="date" error={$errors?.dependents?.[i]?.birthday?.[0]} noErrorText={true} disabled={isViewMode}/>
                          <small class="text-error ml-1 mt-1"> {$errors?.dependents?.[i]?.relationship?.[0] ?? ""}</small>
                        </td>
                        <td>
                          <button type="button" class="btn btn-error btn-outline mb-2" on:click={()=>{removeDependent(i)}} disabled={isViewMode}><i class="fa-solid fa-xmark" ></i></button>
                   
                        </td>
                      </tr>
                      {/each}
                    
                    
                    </tbody>
                  </table>
                </div>
            </div>

            <div class="mt-5 w-full flex justify-end">
          <button class="btn btn-primary mr-2" type="submit" disabled={isViewMode}>
            <i class="fa-regular fa-floppy-disk mr-2 text-lg"></i>
            Save</button>
            </div>
        </form>
        </div>
        <Toaster/>
  </div>
<script>
  import TextField from "$lib/components/form/TextField.svelte";
  import { createForm } from "felte";
  import { date, object, string,  } from "yup";
  import { validator } from '@felte/validator-yup';
  import axios, { AxiosError } from "axios";
  import { RegisterMemberAccountSchema } from "$lib/definitions/schema";


    export let data;
    let message = ""
    const {form, data: body, errors} = createForm({
      extend: validator({schema: RegisterMemberAccountSchema, castValues: true}),
      onSubmit:async(body)=>{
        message = "" 
        try{ 
            const response = await axios.post(`/api/cooperatives/${data?.cooperative?.id}/members`, body)
            
                
        }catch(error){
            if(error instanceof AxiosError){
                message = error?.response?.data?.message
            }
        }
       
       
      }
    })
</script>

<div>
    <div class="w-96 mx-auto mb-5 mt-5">
        <h1 class="text-center text-xl">You are registering as member for {data?.cooperative?.name} </h1>
    </div>

    <div class="w-96 mx-auto">
        
    {#if message }
    <div class="alert alert-error mt-5 ">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6 text-base-100" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span class="text-base-100">{message}</span>
        </div>
    </div>  
    {/if}
        <form use:form>
            <TextField name="givenName" label="Given name" labelFor="givenName"  error={$errors?.givenName?.[0]}/>
            <TextField name="middleName" label="Middle name" labelFor="middleName" error={$errors?.middleName?.[0]}/>
            <TextField name="surname" label="Surname" labelFor="surname"  error={$errors?.surname?.[0]}/>
            <TextField name="birthday" label="Birthday" labelFor="birthday" type="date"  error={$errors?.birthdays?.[0]} />
            <div class="mt-5"></div>
            <TextField type="email" name="email" label="Email" labelFor="email"  error={$errors?.email?.[0]}></TextField>
            <TextField type="password" name="password" label="Password" labelFor="Password"   error={$errors?.password?.[0]}></TextField>
            <button class="btn btn-primary mt-3" type="submit"> Sign Up</button>
        </form>
    </div>
    
</div>
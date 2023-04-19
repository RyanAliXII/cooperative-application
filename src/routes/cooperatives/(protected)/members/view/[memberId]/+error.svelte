    <script>
    import { page } from '$app/stores';

  </script>

<section class="flex items-center p-16 " style="min-height: 100vh;">
	<div class="container flex flex-col items-center justify-center px-5 mx-auto my-8">
		<div class="max-w-md text-center">
			<h2 class="mb-8 font-extrabold text-9xl dark:text-gray-600">
				<span class="sr-only">Error</span>{$page?.status}
			</h2>
			<p class="text-2xl font-semibold md:text-3xl">{$page?.error?.message}</p>
            {#if $page?.status === 404 }
                <p class="mt-4 mb-8 dark:text-gray-400">But dont worry, you can find plenty of other things on our homepage.</p>
            {/if}

                 
            {#if $page?.status === 500}

            <p class="mt-4 mb-8 dark:text-gray-400">Oops, something went wrong. Please try again later.</p>
            {/if}
           
			<a rel="noopener noreferrer" href="/cooperative/members" class="btn btn-primary text-base-100">View Members</a>
		</div>
	</div>
</section>
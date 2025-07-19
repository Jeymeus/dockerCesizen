<template>
    <div class="row justify-content-center g-4">
        <div v-for="page in pages" :key="page.id" class="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
            <div class="card page-card text-center shadow-sm w-100">
                <div class="card-body d-flex flex-column justify-content-between">
                    <h5 class="card-title">{{ page.title }}</h5>
                    <div class="mt-3">
                        <router-link class="btn btn-warning" :to="`/page/${page.id}`">
                            Lire la suite
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps(['pages'])
</script>
  

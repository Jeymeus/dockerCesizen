<template>
    <div class="row justify-content-center g-4">
        <div v-for="page in pages" :key="page.id" class="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
            <div class="card page-card text-center shadow-sm w-100 h-100">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title mb-3">{{ page.title }}</h5>

                    <div class="flex-grow-1"></div> <!-- 🧠 pousse la vidéo en bas -->

                    <img v-if="getYoutubeThumbnail(page.url)" :src="getYoutubeThumbnail(page.url)"
                        alt="Miniature YouTube" class="img-fluid rounded mb-3" />

                    <a class="btn btn-danger mt-auto" :href="page.url" target="_blank" rel="noopener noreferrer">
                        ▶️ Regarder
                    </a>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
defineProps(['pages'])

function getYoutubeId(url) {
    const match = url?.match(/(?:v=|youtu\.be\/)([\w-]{11})/)
    return match ? match[1] : null
}

function getYoutubeThumbnail(url) {
    const id = getYoutubeId(url)
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}
</script>
  

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { publicApi, backHomeApi } from "@/utils/publicApi";

const route = useRoute();
const router = useRouter();

const base = import.meta.env.BASE_URL
const parsePublicFile = (imgURL) => {
    return imgURL ? `${base}${imgURL}` : ''
}

const article = ref(null);
const prevArticle = ref(null);
const nextArticle = ref(null);
const allNews = ref([]);

const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}


const loadData = async () => {
    try {
        // A. 抓取全部資料來做前後篇排序
        const response = await backHomeApi.get('./news/news_get.php');
        
        // B. 排序與篩選邏輯 (保留你原本的邏輯)
        // 註：PHP 的 SQL 已經寫了 ORDER BY，但這裡再排一次更保險
        let sortedData = response.data.sort((a, b) => {
            return new Date(b.published_at) - new Date(a.published_at);
        });

        const fromCategory = route.query.fromCategory;
        const fromSearch = route.query.fromSearch;
      
        if (fromCategory && fromCategory !== '全部') {
            sortedData = sortedData.filter(item => item.category === fromCategory);
        }

        if (fromSearch) {
            const keyword = fromSearch.toLowerCase();
            sortedData = sortedData.filter(item => 
                item.title.toLowerCase().includes(keyword) || 
                item.content.toLowerCase().includes(keyword)
            );
        }

        allNews.value = sortedData;

        // C. 查找當前文章、上一篇、下一篇 (注意 ID 欄位名稱從 article_id 改為 id)
        const currentId = parseInt(route.params.id);
        const currentIndex = sortedData.findIndex(item => item.id === currentId);

        if (currentIndex !== -1) {
            article.value = sortedData[currentIndex];
            prevArticle.value = currentIndex > 0 ? sortedData[currentIndex - 1] : null;
            nextArticle.value = currentIndex < sortedData.length - 1 ? sortedData[currentIndex + 1] : null;
        } else {
            // 如果在篩選清單找不到（可能直接貼網址進來），就去全部資料裡找
            const fallback = response.data.find(item => item.id === currentId);
            if (fallback) article.value = fallback;
        }

    } catch (error) {
        console.error('載入文章失敗:', error);
    }
};

watch(() => route.params.id, () => {
    loadData();
    window.scrollTo(0, 0);
});

onMounted(() => {
    loadData();
});

const goBackToList = () => {
  router.push({
    path: '/news', 
    query: {
      category: route.query.fromCategory,
      page: route.query.fromPage,
      search: route.query.fromSearch
    }
  });
};

const goToArticle = (id) => {
    router.push({ 
        name: 'NewsDetail', 
        params: { id },
        query: route.query 
    });
};
</script>

<template>
    <section class="newsDetail">
        <div class="newDetailBanner">
            <h1>最新消息</h1>
        </div>
        <div class="contentContainer" v-if="article">

            <div class="actionBar">
                <button class="btn btn-outline btn-xs" @click="goBackToList">回列表</button>
            </div>

            <div class="articleHeader">
                <div class="metaInfo">
                    <span class="date">{{ formatDate(article.published_at) }}</span>
                    <span class="category">{{ article.category }}</span>
                </div>
                <h2 class="title">{{ article.title }}</h2>
            </div>

            <div class="articleImage" v-if="article.image_path">
                <img :src="parsePublicFile(article.image_path)" :alt="article.title">
            </div>

            <article class="articleBody">
                {{ article.content }}
            </article>

            <div class="signature">
                龜途 團隊 敬啟
            </div>

            <div class="paginationNav">
                <div class="navItem prev">
                    <div v-if="prevArticle" @click="goToArticle(prevArticle.id)" class="linkWrap">
                        <button class="btn btn-outline">上一篇</button>
                        <span class="navTitle">{{ prevArticle.title }}</span>
                    </div>
                </div>
                <div class="divider">|</div>
                <div class="navItem next">
                    <div v-if="nextArticle" @click="goToArticle(nextArticle.id)" class="linkWrapNext">
                        <button class="btn btn-outline ">下一篇</button>
                        <span class="navTitle">{{ nextArticle.title }}</span>
                    </div>
                </div>
            </div>

        </div>

        <div class="contentContainer" v-else>
            <p style="text-align: center; padding: 50px;">載入中...</p>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.newsDetail {
    background-image:url('/img/News/news-bg.png');
    background-size: cover;
    width: 100%;
    height: auto;
    padding-bottom: 70px;

    .newDetailBanner {
        width: 80%;
        height: 400px;
        border-bottom: 1px solid $primary-color;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;

        h1 {
            @include font-primary;
            color: $primary-color;
        }
    }

    .contentContainer {
        width: 80%;
        margin: 70px auto 0 auto;
        background-color: rgba(255, 255, 255, 0.6);
        padding: 5%;
        border-radius: 10px;
    }
}

.btn {
    margin-bottom: 20px;

    @media(max-width:1600px) {
        //height: 40px;
        padding: 16px 10px;
    }
}


.articleHeader {
    margin-bottom: 30px;

    .metaInfo {
        @include font-body-bold;
        color: $primary-color;
        margin-bottom: 10px;
        display: flex;
        gap: 15px;
        align-items: center;
    }

    .title {
        @include font-secondary-md;
        font-weight: bold;
        color: $primary-color;
    }
}


.articleImage {
    width: 100%;
    margin-bottom: 40px;
    display: flex;
    justify-content: center;

    img {
        max-width: 100%;
        max-height: 450px;
        object-fit: cover;
    }
}

.articleBody {
    @include font-body-l;
    white-space: pre-wrap;
    text-align: justify;
    margin-bottom: 60px;
}

.signature {
    margin-top: 40px;
    margin-bottom: 60px;
    text-align: left;
}

.paginationNav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    gap: 10px;
    color: $secondary-color;

    .divider {
        font-size: 50px;

        @media(max-width:768px) {
            display: none;
        }
    }

    .navItem {
        flex: 1;
        cursor: pointer;
        transition: opacity 0.3s;
        display: flex;

        &.prev {
            justify-content: flex-start;
        }

        &.next {
            justify-content: flex-end;
            text-align: right;
        }


        .linkWrap {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        .linkWrapNext {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }

        .navTitle {
            @include font-body;
            color: $secondary-color;

            @media(max-width:768px) {
                display: none;
            }

        }
    }
}
</style>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { publicApi } from '@/utils/publicApi'

const route = useRoute();
const router = useRouter();

const base = import.meta.env.BASE_URL
const parsePublicFile = (imgURL) => {
    return imgURL ? `${base}${imgURL}` : ''
}

// 資料容器
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


// NewsDetail.vue

const loadData = async () => {
    try {
        const response = await publicApi.get('data/NewsList.json');

        // 1. 基本排序
        let sortedData = response.data.sort((a, b) => {
            return new Date(b.publish_time) - new Date(a.publish_time);
        });

        // 2. 取得網址上的篩選參數
        const fromCategory = route.query.fromCategory;
        const fromSearch = route.query.fromSearch;

        // 3. 執行「分類篩選」
        if (fromCategory && fromCategory !== '全部') {
            sortedData = sortedData.filter(item => item.category === fromCategory);
        }

        // 4. 執行「搜尋篩選」 (與列表頁邏輯一致)
        if (fromSearch) {
            const keyword = fromSearch.toLowerCase();
            sortedData = sortedData.filter(item => 
                item.title.toLowerCase().includes(keyword) || 
                item.content.toLowerCase().includes(keyword)
            );
        }

        allNews.value = sortedData;

        // 5. 計算索引值 (在「分類 + 搜尋」後的清單中找)
        const currentId = parseInt(route.params.id);
        const currentIndex = sortedData.findIndex(item => item.article_id === currentId);

        if (currentIndex !== -1) {
            article.value = sortedData[currentIndex];
            prevArticle.value = currentIndex > 0 ? sortedData[currentIndex - 1] : null;
            nextArticle.value = currentIndex < sortedData.length - 1 ? sortedData[currentIndex + 1] : null;
        } else {
            // 回退邏輯：若沒篩選到，至少要顯示文章內容
            const fallback = response.data.find(item => item.article_id === currentId);
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
        // 關鍵：將目前的 query 參數（來自列表頁的紀錄）繼續帶給下一篇文章
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
                    <span class="date">{{ formatDate(article.publish_time) }}</span>
                    <span class="category">{{ article.category }}</span>
                </div>
                <h2 class="title">{{ article.title }}</h2>
            </div>

            <div class="articleImage" v-if="article.image_url">
                <img :src="parsePublicFile(article.image_url)" :alt="article.title">
            </div>

            <article class="articleBody">
                {{ article.content }}
            </article>

            <div class="signature">
                龜途 團隊 敬啟
            </div>

            <div class="paginationNav">
                <div class="navItem prev">
                    <div v-if="prevArticle" @click="goToArticle(prevArticle.article_id)" class="linkWrap">
                        <button class="btn btn-outline">上一篇</button>
                        <span class="navTitle">{{ prevArticle.title }}</span>
                    </div>
                </div>
                <div class="divider">|</div>
                <div class="navItem next">
                    <div v-if="nextArticle" @click="goToArticle(nextArticle.article_id)" class="linkWrapNext">
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
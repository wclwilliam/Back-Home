<script setup>
import { onMounted, ref, nextTick } from 'vue';

const statsGridRef = ref(null);
const isLoading = ref(true);
const apiError = ref(null); 

const stats = ref({
    plastic_sea: 0,
    ghost_gear: 0,
    bycatch: 0,
    lives_lost: 0
});



const getApiUrl = () => {
    if (import.meta.env.VITE_API_BASE) {
        return import.meta.env.VITE_API_BASE;
    }
    
    // 備用方案
    if (import.meta.env.DEV) {
        return 'http://localhost:8888/';
    }
    return '/';
};

const animateValue = (obj, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end.toLocaleString();
        }
    };
    window.requestAnimationFrame(step);
};

const fetchApiData = async () => {
    try {
        isLoading.value = true;
        apiError.value = null;
        
        const apiBaseUrl = getApiUrl();
        const apiPath = 'news/threaten_get.php';
        const fullUrl = `${apiBaseUrl}${apiPath}`;
        
        console.log('🔍 正在呼叫 API:', fullUrl);
        console.log('📍 API Base URL:', apiBaseUrl);
        console.log('🌐 當前環境:', import.meta.env.MODE);

        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-cache',
            mode: 'cors',
        });

        console.log('📡 Response Status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP 錯誤! 狀態碼: ${response.status}`);
        }

        const result = await response.json();
        console.log("✅ 抓到資料了:", result);

        if (result.status === 'success') {
            stats.value.plastic_sea = result.data.plastic_sea.value;
            stats.value.ghost_gear = result.data.ghost_gear.value;
            stats.value.bycatch = result.data.bycatch.value;
            stats.value.lives_lost = result.data.lives_lost.value;
        } else {
            throw new Error('API 回傳狀態異常');
        }
    } catch (error) {
        console.error("❌ Fetch 發生錯誤:", error);
        apiError.value = error.message;
        
        // 使用預設值
        stats.value = {
            plastic_sea: 8000000,
            ghost_gear: 640000,
            bycatch: 9100000,
            lives_lost: 1000000
        };
    } finally {
        isLoading.value = false;
    }
};

onMounted(async () => {
    await fetchApiData();
    await nextTick();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.count-number');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    if (target > 0) {
                        animateValue(counter, 0, target, 1500);
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
    });

    if (statsGridRef.value) {
        observer.observe(statsGridRef.value);
    }
});
</script>

<template>
    <h1>海龜生態威脅</h1>
    
    <section class="threatenBox-grid container" ref="statsGridRef">

        <div class="card card-1">
            <div class="titleBox">
                <h2>海洋承受的極限</h2>
                <p>每秒鐘都在增加的威脅</p>
            </div>
        </div>

        <div class="card card-2">
            <div class="titleBox">
                <h2>台灣海洋廢棄物清理量</h2>
                <p>相當於每分鐘倒一輛垃圾車入海</p>
            </div>
            <div class="number">
                <h3 class="count-number" :data-target="Math.round(stats.plastic_sea)">0</h3>
                <p>公噸 / Tonnes + (*數據來源:海洋委員會海洋保育署114年度累計統計)</p>
            </div>
        </div>

        <div class="card card-3">
            <div class="titleBox">
                <h2>幽靈漁具</h2>
                <p>漂流在海中的隱形殺手</p>
            </div>
            <div class="number">
                <h3 class="count-number" :data-target="stats.ghost_gear">0</h3>
                <p>公噸 / Tonnes +</p>
            </div>
        </div>

        <div class="card card-4">
            <div class="titleBox">
                <h2>混獲浪費</h2>
                <p>無經濟價值被丟棄的魚獲</p>
            </div>
            <div class="number">
                <h3 class="count-number" :data-target="stats.bycatch">0</h3>
                <p>公噸 / Tonnes +</p>
            </div>
        </div>

        <div class="card card-5">
            <div class="titleBox">
                <h2>無辜生命殞落</h2>
                <p>因誤食或纏繞而死亡的海洋生物與海鳥</p>
            </div>
            <div class="number">
                <h3 class="count-number" :data-target="stats.lives_lost">0</h3>
                <p>隻 / Lives +</p>
            </div>
        </div>

    </section>

</template>

<style lang="scss" scoped>
h1 {
    @include font-secondary-md;
    color: $primary-color;
    font-weight: bold;
    text-align: center;
    margin: 67px 0;

    @media(max-width: 992px) {
        margin: 50px 0 67px 0;
    }
}

h2 {
    @include font-tertiary;
    color: $text-white;
    font-weight: bold;
}

.threatenBox-grid {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1.5fr 1fr;
    grid-auto-rows: 240px;
    gap: 10px;
}

.card {
    border-radius: 25px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.titleBox {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.number {
    display: flex;
    flex-direction: column;
    gap: 10px;

    h3 {
        font-size: $d-size-primary;
    }
}

.card-1 {
    grid-column: 1 / 2;
    background-image: url(/img/GuideView/threaten1.png);
    background-size: cover;

    @media (max-width: 768px) {
        grid-column: 1 / 3;
    }
}

.card-2 {
    grid-column: 2 / 3;
    background-image: url(/img/GuideView/threaten2.png);
    background-size: cover;

    @media (max-width: 768px) {
        grid-column: 2/ 4;
        grid-row: 2;
    }
}

.card-3 {
    grid-column: 1 / 2;
    background-image: url(/img/GuideView/threaten3.png);
    background-size: cover;

    @media (max-width: 768px) {
        grid-column: 1 / 3;
        grid-row: 3;
    }

}

.card-4 {
    grid-column: 2 / 3;
    background-image: url(/img/GuideView/threaten4.png);
    background-size: cover;

    @media (max-width: 768px) {
        grid-column: 2 / 4;
        grid-row: 4;
    }

}

.card-5 {
    background-image: url(/img/GuideView/threaten5.png);
    background-size: cover;
    grid-column: 3/ 4;
    grid-row: 1 / 3;
    background-position: center 100%;

    @media (max-width: 768px) {
        grid-column: 1 / 4;
        grid-row: 5;
    }
}
</style>
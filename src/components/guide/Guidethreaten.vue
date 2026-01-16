<script setup>
import { onMounted, ref } from 'vue';

const statsGridRef = ref(null);

// 數字滾動
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

onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.count-number');

                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = target > 5000000 ? 2000 : 1500;
                    animateValue(counter, 0, target, duration);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

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
                <h2>每年塑膠入海量</h2>
                <p>相當於每分鐘倒一輛垃圾車入海</p>
            </div>
            <div class="number">
                <h3 class="count-number" data-target="8000000">0</h3>
                <p>公噸 / Tonnes +</p>
            </div>
        </div>
        <div class="card card-3">
            <div class="titleBox">
                <h2>幽靈漁具</h2>
                <p>漂流在海中的隱形殺手</p>
            </div>
            <div class="number">
                <h3 class="count-number" data-target="640000">0</h3>
                <p>公噸 / Tonnes +</p>
            </div>
        </div>

        <div class="card card-4">
            <div class="titleBox">
                <h2>混獲浪費</h2>
                <p>無經濟價值被丟棄的魚獲</p>
            </div>
            <div class="number">
                <h3 class="count-number" data-target="9100000">0</h3>
                <p>公噸 / Tonnes +</p>
            </div>
        </div>

        <div class="card card-5">
            <div class="titleBox">
                <h2>無辜生命殞落</h2>
                <p>因誤食或纏繞而死亡的海洋生物與海鳥</p>
            </div>
            <div class="number">
                <h3 class="count-number" data-target="1000000">0</h3>
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
    @media(max-width: 768px){
        margin: 200px 0 67px 0;
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

    @media (max-width: 768px) {
        grid-column: 1 / 4;
        grid-row: 5;
        background-position: center 90%;
    }
}
</style>
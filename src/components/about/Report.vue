<template>
  <div class="report-cnn-outer container">
    <div class="report-cnn-row">
      <div class="report-cnn-text">
        <div class="report-cnn-title">
          <a href="https://edition.cnn.com"
            >這群人在沙灘上，築起海龜最後的生命防線<br />
            —CNN 深度專題報導</a
          >
        </div>
        <div class="report-cnn-desc">
          CNN
          記者走訪台灣沿海救援基地，紀錄了協會成員如何在風暴中搶救受傷與擱淺的海龜過程。經年守護的海灘除了有會殘存的「微塑膠碎粒生態系統」，新近指出海漂廢棄物明化且具侵蝕海洋棲地的破壞模式，已成為亞洲海洋守衛者組織的樣板。報導結語提到：「是人的行動為海洋打了劑力，是這群人的堅持，讓生命有機會見了回家的路。」
        </div>
      </div>
      <div class="report-cnn-img">
        <img src="@/assets/image/about/report-cnn.png" alt="CNN報導" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/color';
@import '@/assets/scss/base/font';

.report-cnn-row {
  background: $highlight-color1;
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 0;
  overflow: hidden;
  align-items: stretch;
  min-height: 320px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }
}

.report-cnn-text {
  color: $text-white;
  padding: 2.5rem 2rem 2.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  @media (max-width: 767px) {
    padding: 2rem 1.5rem;
  }
}

.report-cnn-title {
  @include font-tertiary;
  background: $primary-color;
  color: $text-white;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  @media (max-width: 767px) {
    padding: 0.8rem 1rem;
  }
}

.report-cnn-desc {
  @include font-body;
  margin-top: 0.5rem;
}

.report-cnn-img {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
</style>

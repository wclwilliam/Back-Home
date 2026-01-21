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
          記者走訪台灣沿海救援基地，紀錄了協會成員如何在風暴中搶救受傷綠蠵龜的震撼過程。報導中特別強調了協會獨有的「海龜復健進度追蹤系統」，並指出這種高度透明化且具備科學實證的救援模式，已成為亞洲海洋保育組織的標杆。報導結語提到：「當人類的行為傷害了大海，是這群人的堅持，讓生命看見了回家的路。」
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
  display: flex;
  align-items: stretch;
  min-height: 400px;

  @media (max-width: 767px) {
    flex-direction: column;
  }
}

.report-cnn-text {
  flex: 1;
  color: $text-white;
  padding: 3rem 2rem 3rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;

  @media (max-width: 767px) {
    padding: 2rem;
    order: 2;
  }
}

.report-cnn-title {
  @include font-tertiary;
  background: $primary-color;
  color: $text-white;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  margin-left: -3rem;
  padding-left: 3rem;
  width: fit-content;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  a {
    color: $text-white;
    text-decoration: none;
    display: block;
  }

  @media (max-width: 767px) {
    margin-left: -2rem;
    padding-left: 2rem;
    width: calc(100% + 1rem);
  }
}

.report-cnn-desc {
  @include font-body;
  line-height: 1.8;
  opacity: 0.9;
}

.report-cnn-img {
  flex: 1.2;
  position: relative;
  min-height: 300px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }

  @media (max-width: 767px) {
    flex: auto;
    height: 250px;
    min-height: 250px;
    position: relative;

    img {
      position: relative;
    }
  }
}
</style>

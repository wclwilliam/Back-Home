<script setup>
import { RouterLink } from 'vue-router'

const parseAssets = (fileName) => {
  return new URL(`../../assets/image/home/${fileName}`, import.meta.url).href
}
</script>
<template>
  <div class="volunteerSection">
    <img :src="parseAssets('volunteer.png')" alt="Volunteer" class="bgImage" />
    <div class="overlay"></div>
    <div class="container">
      <div class="row content">
        <div class="col-sm-4 col-md-12 col-lg-12">
          <div class="textContent">
            <h2 class="title">除了持續救援，我們更致力於改善源頭環境</h2>
            <p class="subtitle">救援只能救回個體，唯有減塑與棲地守護，才能讓未來的海龜不再受傷。</p>
          </div>
        </div>
        <div class="col-sm-4 col-md-4 col-lg-6">
          <span class="eventName">2025協會淨灘活動</span>
        </div>
        <div class="col-sm-4 col-md-8 col-lg-6 btnWrapper">
          <RouterLink to="/activity" class="btn btn-outline-white-solid btn-xxl"
            >成為志工，加入我們的行列</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.volunteerSection {
  position: relative;
  width: 100%;
  aspect-ratio: 32 / 10;
  max-height: 600px;
  overflow: hidden;

  .bgImage {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($text-color, 0.6);
    z-index: 2;
  }

  .container {
    position: relative;
    z-index: 3;
    height: 100%;
  }

  .content {
    height: 100%;
    align-content: space-between;
    padding-top: 5%;
    padding-bottom: 5%;
    color: $text-white;
  }

  .textContent {
    .title {
      @include font-secondary;
      color: $text-white;
      margin-bottom: 20px;
    }

    .subtitle {
      @include font-body-l;
      color: $text-white;
    }
  }

  .col-sm-4:nth-child(2) {
    align-self: flex-end;
  }

  .eventName {
    @include font-body;
    color: $text-white;
  }

  .btnWrapper {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }

  // 小電腦響應式
  @media (max-width: 1023px) {
    aspect-ratio: 24 / 10;

    .btn {
      padding: 16px 32px;
    }
  }

  // 平板響應式
  @media (max-width: 767px) {
    aspect-ratio: 16 / 10;

    .textContent {
      text-align: center;
    }

    .col-sm-4:nth-child(2) {
      order: 3; // 活動名稱移到最後
    }

    .eventName {
      justify-content: flex-start; // 維持左對齊
    }

    .btnWrapper {
      order: 2; // 按鈕移到中間
      justify-content: center; // 按鈕置中
      margin: 20px 0; // 增加上下間距
    }

    .btn {
      padding: 12px 24px;
    }
  }

  // 手機響應式
  @media (max-width: 480px) {
    aspect-ratio: 4 / 5;

    .content {
      padding-top: 8%;
      padding-bottom: 8%;
    }

    .textContent {
      margin-bottom: 10px;

      .title {
        margin-bottom: 32px;
      }

      .subtitle {
        line-height: 1.6;
      }
    }

    .btnWrapper {
      margin: 15px 0;
    }

    .eventName {
    }

    .btn {
      padding: 12px 24px;
    }
  }
}
</style>

<script setup>
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>
<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-main">
        <div class="footer-left">
          <div class="logo" @click="goHome">
            <img src="/public/BackHomeLogo.png" alt="Back Home Logo" />
          </div>
          
          <ul class="social-links">
            <li><a href="#"><i class="fab fa-facebook"></i> Facebook</a></li>
            <li><a href="#"><i class="fab fa-instagram"></i> Instagram</a></li>
            <li><a href="#"><i class="fab fa-youtube"></i> Youtube</a></li>
          </ul>
        </div>

        <div class="contact-info">
          <p>桃園市中壢區復興路46號8樓</p>
          <p>03-425-1108</p>
          <p>service@tibame.com</p>
        </div>

        <nav class="footer-nav">
          <ul>
            <li><RouterLink to="/about">關於協會</RouterLink></li>
            <li><RouterLink to="/News">最新消息</RouterLink></li>
            <li><RouterLink to="/guide">認識海龜</RouterLink></li>
            <li><RouterLink to="/game">海洋守護</RouterLink></li>
            <li><RouterLink to="/activity">志工活動</RouterLink></li>
            <li><RouterLink to="/donation">支持保育</RouterLink></li>
          </ul>
        </nav>
      </div>

      <hr class="divider" />

      <div class="footer-bottom">
        <p>© 2025 龜途 Back Home, copyright</p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
/* 基本設定 */
.footer {
  background-color: $primary-color; /* 深藍色背景 */
  color: #ffffff;
  padding: 20px 0;
}

/* 佈局結構 */
.footer-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 40px;
}

/* Logo 樣式 */
.logo {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  cursor: pointer;
}
.logo img {
  margin-right: 15px;
}
.logo-text {
  display: flex;
  flex-direction: column;
}


/* 社群連結 */
.social-links {
  list-style: none;
  padding: 0;
  margin: 0;
}
.social-links li {
  margin-bottom: 12px;
}
.social-links a {
  color: #ffffff;
  text-decoration: none;
  font-size: $size-body;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 聯絡資訊 */
.contact-info {
  margin-top: 100px; /* 依照圖片位置對齊 */
  line-height: 2;
  font-size: $size-body;
}

/* 導覽連結 */
.footer-nav {
        ul {
        display: flex;
        gap: 30px;
                li {
                        color: #ffffff;
                        text-decoration: none;
                        white-space: nowrap;

                }

        }
}

/* 分隔線 */
.divider {
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  margin: 40px 0 20px;
}

/* 版權宣告 */
.footer-bottom {
  text-align: right;
  font-size: $size-body;
  color: rgba(255, 255, 255, 0.8);
}

/* --- 手機版 RWD (螢幕小於 768px) --- */
@media (max-width: 768px) {
  .footer {
    padding: 40px 20px;
  }
  
  .footer-main {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-left {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footer-nav {
    flex-direction: column;
    gap: 20px;
    order: -1; /* 將導覽選單移到最上方 */
    margin-bottom: 30px;
  }

  .contact-info {
    margin-top: 20px;
  }

  .social-links {
    margin: 20px 0;
  }

  .footer-bottom {
    text-align: center;
  }
}
</style>
<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- 左側：公司資訊 -->
      <section class="footer-left">
        <h2 class="company-name">pureLife</h2>
            <div class="company-info">
							<p>客服專線：0800-123-456</p>
							<p>客服信箱：service@purelife.com</p>
							<p>客服時間：週一至週五 09:00-18:00</p>
            </div>
      </section>

      <!-- 右側：導覽連結 -->
      <section class="footer-right">
        <!-- 購物說明 -->
        <div class="footer-column">
          <h3>購物說明</h3>
          <ul>
            <li><a href="#">配送方式</a></li>
            <li><a href="/payment-info">付款方式</a></li>
          </ul>
        </div>

        <!-- 常見問題 -->
        <div class="footer-column">
          <h3>常見問題</h3>
          <ul>
            <li><a href="/faq">常見問題</a></li>
          </ul>
        </div>
      </section>
    </div>

    <!-- 底部版權 -->
    <div class="footer-bottom">
      <p>&copy; 2025 PURELIFE All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>

</script>

<style scoped>
.footer {
  background-color: #3A6B5C;
  border-top: 3px solid #fdfefe;
  padding: 3rem 0 1rem;
  margin-top: 4rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  padding-bottom: 2rem;
}

/* 左側：公司資訊 */
.footer-left {
  padding-right: 2rem;
}

.company-name {
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
  margin: 0 0 1.5rem 0;
  letter-spacing: 1px;
}

.company-info {
  color: #ffffff;
  line-height: 1.8;
}

.company-info p {
  margin: 0.5rem 0;
  font-size: 14px;
}

/* 右側：導覽連結 */
.footer-right {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.footer-column h3 {
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column li {
  margin-bottom: 0.6rem;
}

.footer-column a {
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-column a:hover {
  color: #e5e8e7;
  padding-left: 5px;
}

/* 底部版權 */
.footer-bottom {
  border-top: 1px solid #ffffff;
  padding-top: 1.5rem;
  text-align: center;
}

.footer-bottom p {
  color: #ffffff;
  font-size: 13px;
  margin: 0;
}

/* 響應式設計 */
@media (max-width: 968px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .footer-left {
    padding-right: 0;
    text-align: center;
  }

  .footer-right {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 2rem 0 1rem;
  }

  .footer-container {
    padding: 0 1rem;
    gap: 2rem;
  }

  .footer-right {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .company-name {
    font-size: 24px;
  }

  .footer-column h3 {
    font-size: 15px;
  }

  .footer-left {
    text-align: left;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 1.5rem 0 0.5rem;
  }

  .company-name {
    font-size: 22px;
    margin-bottom: 1rem;
  }

  .company-info p {
    font-size: 13px;
  }

  .footer-column a {
    font-size: 13px;
  }

  .footer-bottom p {
    font-size: 12px;
  }
}
</style>
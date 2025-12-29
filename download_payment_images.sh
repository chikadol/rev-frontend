#!/bin/bash
cd "$(dirname "$0")"

echo "결제 버튼 이미지 다운로드 중..."

# 네이버페이 버튼 (다른 URL 시도)
curl -L -o public/images/payment/naverpay-button.png \
  "https://static.pay.naver.com/button/button_pay.png" 2>/dev/null || \
curl -L -o public/images/payment/naverpay-button.png \
  "https://developers.pay.naver.com/img/button/button_pay.png" 2>/dev/null

# 토스페이먼츠 버튼
curl -L -o public/images/payment/toss-button.png \
  "https://static.toss.im/payment-button/payment-button.png" 2>/dev/null || \
curl -L -o public/images/payment/toss-button.png \
  "https://static.toss.im/logo/png/primary/toss-logo.png" 2>/dev/null

# 카카오페이 버튼
curl -L -o public/images/payment/kakaopay-button.png \
  "https://developers.kakao.com/assets/img/about/logos/kakaopay/kakaopay_button.png" 2>/dev/null || \
curl -L -o public/images/payment/kakaopay-button.png \
  "https://developers.kakao.com/assets/img/about/logos/kakaopay/kakaopay_logo.png" 2>/dev/null

echo "다운로드 완료. 파일 확인:"
ls -lh public/images/payment/*.png 2>/dev/null || echo "이미지 다운로드 실패 - 수동으로 다운로드 필요"

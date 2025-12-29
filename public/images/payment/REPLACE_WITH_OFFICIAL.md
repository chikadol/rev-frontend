# 공식 결제 버튼 이미지로 교체하기

현재는 임시 SVG 버튼을 사용하고 있습니다. 각 결제 서비스의 공식 결제 버튼 이미지로 교체하세요.

## 교체 방법

1. 각 결제 서비스의 개발자 센터에서 공식 결제 버튼 이미지를 다운로드
2. 다음 파일들을 교체:
   - `naverpay-button.svg` → `naverpay-button.png` (또는 원본 확장자 유지)
   - `toss-button.svg` → `toss-button.png`
   - `kakaopay-button.svg` → `kakaopay-button.png`

3. `src/pages/PaymentPage.tsx`에서 확장자를 `.svg`에서 `.png`로 변경 (또는 실제 확장자에 맞게)

## 다운로드 링크

- **네이버페이**: https://developers.pay.naver.com/design/brand/button
- **토스페이먼츠**: https://docs.tosspayments.com/guides/design-guide  
- **카카오페이**: https://developers.kakao.com/docs/latest/ko/kakaopay/common

각 페이지에서 제공하는 공식 버튼 이미지를 다운로드하여 이 폴더에 저장하세요.

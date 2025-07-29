# GLI Admin Frontend

## 📋 개요

GLI (Global Legal Intelligence) Platform의 관리자 프론트엔드 애플리케이션입니다. Vue 3 + TypeScript + Tailwind CSS 기반의 종합적인 관리자 대시보드로, 블록체인/Web3 토큰 관리, 회원 관리, 비즈니스 운영을 위한 고급 관리 기능을 제공합니다.

## ✨ 핵심 기능

### 🔐 인증 시스템
- **JWT 기반 인증**: 토큰 자동 갱신 및 세션 관리
- **역할 기반 접근 제어**: Super Admin, Admin 등급별 권한 관리
- **Mock 인증 지원**: 개발/프로덕션 환경별 인증 방식
- **보안 토큰 관리**: 자동 토큰 갱신 및 만료 처리

### 📊 대시보드 및 분석
- **플랫폼 통계**: 총 회원수, GLIB 토큰, 활성 거래, 플랫폼 성장률
- **실시간 활동 피드**: 최근 활동 내역 모니터링
- **빠른 액션 버튼**: 주요 기능 바로가기
- **다크/라이트 테마**: 개인화된 UI 테마 지원

### 💰 정산 관리 시스템 (핵심 기능)
3단계 정산 워크플로우 관리 시스템

#### Phase A - 조정 단계
- **정산 데이터 검증**: 정산 정보 확인 및 조정
- **데이터 무결성 검증**: 정산 데이터 유효성 검사
- **조정 내역 관리**: 정산 조정 사항 기록

#### Phase B - 잔액 확인 단계  
- **잔액 확인**: 정산 잔액 검증
- **이메일 알림**: 정산 대상자 이메일 발송
- **상태 추적**: 정산 진행 상태 실시간 모니터링

#### Phase C - 최종 확인 단계
- **최종 승인**: 정산 최종 확인 및 승인
- **출금 처리**: 정산금 출금 프로세스 관리
- **완료 처리**: 정산 완료 상태 업데이트

### 👥 회원 관리 시스템
- **회원 목록 관리**: 고급 필터링 및 검색 기능
  - 이름, 이메일, 전화번호, 아티스트명으로 검색
  - 이름, 등록일자별 정렬
- **선택적 필드 표시**: 주민번호, 계좌정보, 사업자정보 토글
- **회원 통계**: 회원 현황 요약 정보
- **외부 연동**: blnchk.com 사용자 상세 정보 연동
- **이메일 발송**: 회원 대상 이메일 발송 기능

### 🎵 ITPR (아티스트/앨범) 관리
종합적인 음악 콘텐츠 관리 시스템

#### 앨범 관리
- **전체 CRUD 작업**: 앨범 생성, 수정, 삭제
- **상태 관리**: 임시저장, 제출완료, 유통완료 등 상태 추적
- **검색 및 필터링**: 앨범명, 아티스트명, 상태별 검색
- **출시일 관리**: 앨범 출시 일정 관리
- **앨범 유형 분류**: 장르별 앨범 분류 시스템

#### 아티스트 관리
- **아티스트 프로필**: 아티스트 정보 관리
- **소속사 연동**: 기획사 정보 연결

#### 기획사 관리
- **기획사 정보**: 기획사 상세 정보 관리
- **아티스트 연결**: 기획사별 소속 아티스트 관리

### 🏢 비즈니스 콘텐츠 관리
- **카테고리별 관리**: 회사소개, 팀, 전략, 일반 콘텐츠
- **콘텐츠 발행**: 콘텐츠 생성, 수정, 발행 워크플로우
- **검색 및 필터링**: 카테고리별 콘텐츠 관리
- **리치 텍스트 편집**: 고급 텍스트 편집 기능
- **반응형 모달**: 모바일 최적화된 편집 인터페이스

### 🎨 UI 컴포넌트 라이브러리
- **AdminSidebar**: 축소 가능한 네비게이션 및 테마 토글
- **Form Components**: BaseInput, BaseSelect, BaseModal
- **BasePagination**: 페이지네이션 컴포넌트
- **Web3 Components**: Web3Provider, WalletButton, TokenBalance
- **MailPreviewModal**: 이메일 미리보기 기능

### 🔗 API 서비스 레이어
- **Axios 기반 HTTP 클라이언트**: 인터셉터 및 자동 토큰 갱신
- **에러 핸들링**: 재시도 로직 포함 에러 처리
- **Mock 데이터 지원**: 개발용 Mock 데이터 생성기
- **타입 안전성**: TypeScript 기반 API 호출
- **실제/Mock API 모드**: 개발/프로덕션 환경 분리

### 📊 상태 관리 (Pinia)
- **auth.ts**: 인증 상태 관리
- **b_settlement/**: 정산 워크플로우 상태
- **d_member/member.ts**: 회원 관리 상태
- **e_itpr/**: 아티스트/앨범 관리 상태
- **sidebar.ts**: UI 상태 관리

## 🚀 구현 상태

### ✅ 완전 구현 기능 (5개 주요 영역)

#### 1. 인증 시스템 (100%)
- JWT 토큰 관리 및 자동 갱신
- 역할 기반 접근 제어
- Mock/실제 API 지원

#### 2. 대시보드 및 분석 (100%)
- 플랫폼 주요 지표 표시
- 실시간 활동 피드
- 다크/라이트 테마

#### 3. 정산 관리 시스템 (100%)
- 3단계 정산 워크플로우
- 복잡한 상태 관리
- 실시간 진행 상황 추적

#### 4. 회원 관리 시스템 (100%)
- 고급 검색 및 필터링
- 페이지네이션
- 외부 시스템 연동

#### 5. ITPR 관리 시스템 (100%)
- 앨범/아티스트/기획사 관리
- 전체 CRUD 기능
- 상태 추적 시스템

#### 6. 비즈니스 콘텐츠 관리 (100%)
- 카테고리별 콘텐츠 관리
- 발행 워크플로우
- 리치 텍스트 에디터

### 🟡 플레이스홀더 기능 (라우터 설정 완료, UI 준비 중)

#### 1. 분석 및 리포트
- **토큰 분석**: TokenAnalyticsView.vue
- **사용자 활동**: UserActivityView.vue  
- **플랫폼 통계**: PlatformStatisticsView.vue

#### 2. 토큰 관리
- **토큰 사용처**: TokenUsageView.vue
- **배포 계획**: DistributionPlanningView.vue
- **GLIB/GLID 관리**: GLIBGLIDManagementView.vue

#### 3. Web3 통합
- **블록체인 작업**: BlockchainOperationsView.vue
- **스마트 컨트랙트**: SmartContractsView.vue
- **토큰 전송**: TokenTransfersView.vue

#### 4. 시스템 설정
- **API 설정**: APIConfigurationView.vue
- **시스템 로그**: SystemLogsView.vue
- **백업 및 복구**: BackupRecoveryView.vue

#### 5. 비즈니스 관리 (부분 구현)
- **팀 관리**: TeamManagementView.vue
- **전략 및 로드맵**: StrategyRoadmapView.vue

### 🔴 레거시 기능 (라우터 미설정)
- 통계 뷰들 (/src/views/statistics/)
- 사이트 관리 (/src/views/site/)
- 계산 로직 (/src/views/calculation/)

## 📁 파일 구조

```
gli_admin-frontend/
├── src/
│   ├── views/                    # 페이지 컴포넌트
│   │   ├── analytics/           # 분석 기능 (준비 중)
│   │   ├── business/            # 비즈니스 관리
│   │   ├── calculation/         # 계산 로직 (레거시)
│   │   ├── itpr/               # ITPR 관리
│   │   ├── member/             # 회원 관리
│   │   ├── members/            # 회원 기능 (준비 중)
│   │   ├── settings/           # 시스템 설정 (준비 중)
│   │   ├── settlement/         # 정산 관리
│   │   ├── site/              # 사이트 관리 (레거시)
│   │   ├── statistics/        # 통계 (레거시)
│   │   ├── tokens/            # 토큰 관리 (준비 중)
│   │   └── web3/              # Web3 기능 (준비 중)
│   ├── components/             # 재사용 컴포넌트
│   ├── stores/                # Pinia 상태 관리
│   │   ├── b_settlement/      # 정산 관리 상태
│   │   ├── d_member/          # 회원 관리 상태
│   │   └── e_itpr/            # ITPR 관리 상태
│   ├── services/              # API 서비스
│   ├── types/                 # TypeScript 타입
│   ├── utils/                 # 유틸리티 함수
│   └── config/                # 설정 파일
└── public/                    # 정적 자산
```

## 🛠️ 기술 아키텍처

### 프론트엔드 스택
- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript (완전한 타입 안전성)
- **Build Tool**: Vite (빠른 개발 환경)
- **Styling**: Tailwind CSS (유틸리티 우선)
- **State Management**: Pinia (Vue 3 권장)
- **HTTP Client**: Axios (인터셉터 포함)
- **Routing**: Vue Router 4

### 주요 기술 특징
- **타입 안전성**: 완전한 TypeScript 구현
- **반응형 디자인**: 모바일 우선 접근법
- **에러 핸들링**: 포괄적인 에러 처리 및 사용자 피드백
- **로딩 상태**: 일관된 로딩 인디케이터
- **폼 검증**: 클라이언트 사이드 폼 검증
- **접근성**: ARIA 레이블 및 키보드 내비게이션

### 개발 도구
- **Mock API 지원**: 개발용 완전한 Mock 데이터 시스템
- **환경 설정**: 멀티 환경 설정 지원
- **핫 모듈 교체**: Vite를 통한 빠른 개발
- **코드 품질**: ESLint/Prettier 도구

## 📊 구현 요약

GLI Admin Frontend는 **5개 주요 완전 구현 기능 영역**과 **다수의 플레이스홀더 영역**을 가진 정교한 프로덕션 레디 관리자 패널입니다. 

핵심 구현 기능들(인증, 대시보드, 정산 관리, 회원 관리, ITPR 관리, 비즈니스 콘텐츠 관리)은 블록체인/Web3 플랫폼의 디지털 자산 관리 및 회원 관리를 위한 종합적인 관리 시스템을 구성합니다.

코드베이스는 우수한 아키텍처 관행을 보여주며, 강력한 관심사 분리, 포괄적인 상태 관리, 그리고 개발 및 프로덕션 환경을 모두 지원하는 견고한 API 통합 레이어를 갖추고 있습니다.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

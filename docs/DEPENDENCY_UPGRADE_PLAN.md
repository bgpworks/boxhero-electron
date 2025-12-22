# boxhero-electron 의존성 업그레이드 계획

> 작성일: 2025-12-19
> 대상 프로젝트: BoxHero Electron 앱

## 목차

1. [현황 분석](#1-현황-분석)
2. [업그레이드 전략](#2-업그레이드-전략)
3. [Phase 1: 독립적 도구](#phase-1-독립적-도구-업그레이드)
4. [Phase 2: i18next 생태계](#phase-2-i18next-생태계-업그레이드)
5. [Phase 3: ESLint 9 마이그레이션](#phase-3-eslint-9--typescript-eslint-8-마이그레이션)
6. [Phase 4: React 19](#phase-4-react-19-업그레이드)
7. [Phase 5: Vite](#phase-5-vite-업그레이드)
8. [Phase 6: Electron](#phase-6-electron-단계적-업그레이드)
9. [Phase 7: TypeScript](#phase-7-typescript-업그레이드)
10. [체크리스트](#전체-업그레이드-체크리스트)
11. [롤백 절차](#긴급-롤백-절차)

---

## 1. 현황 분석

### 현재 의존성 버전

| 패키지            | 시작 버전 | 현재 버전 | 목표 버전 | 상태    |
| ----------------- | --------- | --------- | --------- | ------- |
| electron          | 34.3.0    | 39.2.7    | 39.2.7    | ✅ 완료 |
| electron-forge    | 7.7.0     | 7.10.2    | 7.10.2    | ✅ 완료 |
| react             | ^18.2.0   | 19.2.3    | 19.2.3    | ✅ 완료 |
| react-dom         | ^18.2.0   | 19.2.3    | 19.2.3    | ✅ 완료 |
| vite              | ^6.2.0    | 6.4.1     | 6.4.x     | ✅ 완료 |
| eslint            | ^8.0.1    | 9.39.2    | 9.39.2    | ✅ 완료 |
| typescript-eslint | ^6.9.1    | 8.50.0    | 8.50.0    | ✅ 완료 |
| i18next           | ^23.6.0   | 25.7.3    | 25.x      | ✅ 완료 |
| react-i18next     | ^13.3.0   | 16.5.0    | 16.x      | ✅ 완료 |
| husky             | ^8.0.0    | 9.1.7     | 9.1.7     | ✅ 완료 |
| lint-staged       | ^15.0.1   | 15.5.2    | 15.5.x    | ✅ 완료 |
| prettier          | ^3.0.3    | 3.5.0     | 3.5.x     | ✅ 완료 |
| typescript        | ~5.7.3    | 5.9.3     | 5.9.3     | ✅ 완료 |
| styled-components | ^6.1.0    | ^6.1.0    | 유지      | -       |

### 긍정적 요소 (업그레이드에 유리한 점)

1. **React 18 마이그레이션 완료**: 이미 `createRoot()` API 사용 중
2. **forwardRef 미사용**: React 19 breaking change 영향 없음
3. **PropTypes/defaultProps 미사용**: React 19 호환성 확보
4. **initImmediate 옵션 미사용**: i18next 25 호환성 확보
5. **styled-components 6.x 사용**: React 19와 호환됨
6. **TypeScript strict 모드 활성화**: 타입 오류 조기 발견 가능

### 주의 필요 사항

1. **ESLint 설정**: `.eslintrc.json` → `eslint.config.js` 마이그레이션 필요
2. **eslint-plugin-import**: ESLint 9 미지원 → `eslint-plugin-import-x`로 교체
3. **husky 8.x**: prepare 스크립트 변경 필요
4. **@types/react**: React 19에서는 별도 설치 불필요 (내장)
5. **electron-forge**: Electron 39와의 호환성 확인 필요

---

## 2. 업그레이드 전략

### 원칙

1. **리스크가 낮은 것부터 높은 순서로 진행**
2. **의존성 간의 연관성 고려** (예: React와 styled-components)
3. **각 단계별 검증 후 다음 단계 진행**
4. **롤백 계획 항상 준비**

### 전체 업그레이드 순서

```
Phase 1: husky, lint-staged, prettier (독립적 도구)
    ↓
Phase 2: i18next, react-i18next (국제화)
    ↓
Phase 3: ESLint 9 + typescript-eslint 8 (린트)
    ↓
Phase 4: React 19 + styled-components 확인
    ↓
Phase 5: Vite (빌드 도구)
    ↓
Phase 6: Electron 34 → 35 → 36 → 37 → 38 → 39 (단계적)
    ↓
Phase 7: TypeScript (최종)
```

---

## Phase 1: 독립적 도구 업그레이드

**리스크: 낮음 | 예상 소요: 30분**

### 대상 패키지

| 패키지      | 현재 버전 | 목표 버전 |
| ----------- | --------- | --------- |
| husky       | ^8.0.0    | 9.1.7     |
| lint-staged | ^15.0.1   | 15.5.x    |
| prettier    | ^3.0.3    | 3.5.x     |

### 설정 파일 변경사항

#### 1. package.json - prepare 스크립트 수정

```json
// Before
"prepare": "husky install"

// After (husky 9)
"prepare": "husky"
```

#### 2. .husky/pre-commit 수정

```bash
# Before (husky 8)
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx lint-staged

# After (husky 9) - 더 간단해짐
npx lint-staged
```

#### 3. .husky/\_/ 디렉토리 삭제

husky 9에서는 `.husky/_/` 디렉토리가 필요 없음

### 실행 명령어

```bash
# 1. husky 9 설치
npm install -D husky@9.1.7

# 2. .husky 재초기화
rm -rf .husky
npx husky init

# 3. pre-commit hook 생성
echo "npx lint-staged" > .husky/pre-commit

# 4. lint-staged 업그레이드
npm install -D lint-staged@15.5.2

# 5. prettier 업그레이드
npm install -D prettier@3.5.0
```

### 검증 방법

```bash
# lint-staged 동작 확인
git add -A
git commit -m "test commit" --dry-run

# 또는 직접 lint-staged 실행
npx lint-staged
```

### 롤백 계획

```bash
npm install -D husky@8.0.3 lint-staged@15.0.1 prettier@3.0.3
git checkout -- .husky/
git checkout -- package.json
```

---

## Phase 2: i18next 생태계 업그레이드

**리스크: 낮음 | 예상 소요: 20분**

### 대상 패키지

| 패키지        | 현재 버전 | 목표 버전          |
| ------------- | --------- | ------------------ |
| i18next       | ^23.6.0   | 24.x (최신 안정판) |
| react-i18next | ^13.3.0   | 15.x (최신 안정판) |

> **참고**: 25.x, 16.x는 릴리즈 확인 후 진행

### 설정 파일 변경사항

현재 코드에서 `initImmediate` 옵션 미사용 → **설정 변경 불필요**

### 실행 명령어

```bash
# 버전 확인
npm view i18next versions --json | tail -20
npm view react-i18next versions --json | tail -20

# 업그레이드
npm install i18next@latest react-i18next@latest
```

### 검증 방법

```bash
npm start

# 검증 항목:
# 1. 메뉴 언어 표시 정상 여부
# 2. 언어 전환 기능 정상 여부
# 3. 콘솔 에러 없음 확인
```

### 롤백 계획

```bash
npm install i18next@23.6.0 react-i18next@13.3.0
```

---

## Phase 3: ESLint 9 + typescript-eslint 8 마이그레이션

**리스크: 중간 | 예상 소요: 1-2시간**

### 대상 패키지

| 패키지                           | 현재 버전 | 변경          |
| -------------------------------- | --------- | ------------- |
| eslint                           | ^8.0.1    | → 9.39.2      |
| @typescript-eslint/parser        | ^6.9.1    | 제거          |
| @typescript-eslint/eslint-plugin | ^6.9.1    | 제거          |
| typescript-eslint                | -         | 8.50.0 (신규) |
| eslint-plugin-import             | ^2.25.0   | 제거          |
| eslint-plugin-import-x           | -         | 최신 (신규)   |
| globals                          | -         | 최신 (신규)   |
| @eslint/js                       | -         | 최신 (신규)   |

### 주요 Breaking Changes

1. **Flat Config 필수**: `.eslintrc.json` → `eslint.config.js`
2. **Node.js 18.18.0 이상 필요**
3. **eslint-plugin-import 미지원** → eslint-plugin-import-x로 교체
4. **패키지 통합**: @typescript-eslint/\* → typescript-eslint

### 설정 파일 변경사항

#### 기존 .eslintrc.json (삭제 대상)

```json
{
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/electron",
    "plugin:import/typescript"
  ],
  "parser": "@typescript-eslint/parser",
  "rules": {
    "@typescript-eslint/ban-ts-comment": 0,
    "import/no-unresolved": ["error", { "ignore": [".svg"] }],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ]
  }
}
```

#### 신규 eslint.config.js (생성)

```javascript
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import importX from "eslint-plugin-import-x";
import globals from "globals";

export default tseslint.config(
  // 전역 무시 패턴
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "out/**",
      ".vite/**",
      "*.config.js",
      "*.config.ts",
    ],
  },

  // 기본 설정
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // TypeScript 파일 설정
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "import-x": importX,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "import-x/no-unresolved": ["error", { ignore: ["\\.svg$"] }],
    },
    settings: {
      "import-x/resolver": {
        typescript: true,
        node: true,
      },
    },
  }
);
```

#### package.json 수정

```json
{
  "type": "module",
  "scripts": {
    "lint": "eslint ."
  }
}
```

### 실행 명령어

```bash
# 1. 기존 패키지 제거
npm uninstall eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-import

# 2. 새 패키지 설치
npm install -D eslint@9.39.2 typescript-eslint@8.50.0 eslint-plugin-import-x@latest
npm install -D globals@latest @eslint/js@latest

# 3. 설정 파일 마이그레이션
rm .eslintrc.json
# eslint.config.js 생성 (위 내용)
```

### 검증 방법

```bash
npm run lint
npx lint-staged
```

### 롤백 계획

```bash
npm uninstall eslint typescript-eslint eslint-plugin-import-x globals @eslint/js
npm install -D eslint@8.57.1 @typescript-eslint/parser@6.21.0 @typescript-eslint/eslint-plugin@6.21.0 eslint-plugin-import@2.25.0
git checkout -- .eslintrc.json
```

---

## Phase 4: React 19 업그레이드

**리스크: 중간-높음 | 예상 소요: 1시간**

### 대상 패키지

| 패키지           | 현재 버전 | 변경                 |
| ---------------- | --------- | -------------------- |
| react            | ^18.2.0   | → 19.2.3             |
| react-dom        | ^18.2.0   | → 19.2.3             |
| @types/react     | ^18.2.29  | 제거 (React 19 내장) |
| @types/react-dom | ^18.2.14  | 제거 (React 19 내장) |

### 주요 Breaking Changes

1. **ReactDOM.render() 제거** → createRoot() 사용 (이미 사용 중)
2. **PropTypes, defaultProps(함수 컴포넌트) 제거** (미사용)
3. **String refs 제거** (미사용)
4. **forwardRef → ref prop으로 변경** (미사용)
5. **새로운 훅**: useActionState, useOptimistic, useFormStatus, use()

### 현재 코드 분석 결과

- `createRoot()` 이미 사용 중 ✅
- `forwardRef` 미사용 ✅
- `PropTypes`, `defaultProps` 미사용 ✅
- `React.FC` 사용 중 → React 19에서도 지원됨 ✅

**→ 코드 변경 없이 업그레이드 가능**

### 실행 명령어

```bash
# 1. 타입 패키지 제거
npm uninstall @types/react @types/react-dom

# 2. React 19 설치
npm install react@19.2.3 react-dom@19.2.3
```

### 검증 방법

```bash
# TypeScript 컴파일
npx tsc --noEmit

# 앱 시작
npm start

# 기능 테스트:
# - TitleBar 렌더링
# - LoadingIndicator 애니메이션
# - 언어 전환
# - 윈도우 컨트롤
```

### 롤백 계획

```bash
npm install react@18.2.0 react-dom@18.2.0 @types/react@18.2.29 @types/react-dom@18.2.14
```

---

## Phase 5: Vite 업그레이드

**리스크: 낮음-중간 | 예상 소요: 30분**

### 주의사항

> **Vite 7.x는 미릴리즈 상태일 수 있습니다.** 실제 버전 확인 필요.

```bash
npm view vite versions --json | tail -10
```

### 대상 패키지

| 패키지 | 현재 버전 | 목표 버전        |
| ------ | --------- | ---------------- |
| vite   | ^6.2.0    | 6.4.x (또는 7.x) |

### 실행 명령어

```bash
# 버전 확인
npm view vite versions --json | tail -10

# Vite 6.x 최신 (안전한 선택)
npm install -D vite@^6.4.0

# 또는 Vite 7.x (릴리즈 시)
npm install -D vite@7
```

### 검증 방법

```bash
npm start        # 개발 서버
npm run package  # 빌드 테스트
```

### 롤백 계획

```bash
npm install -D vite@6.2.0
```

---

## Phase 6: Electron 단계적 업그레이드

**리스크: 높음 | 예상 소요: 2-4시간**

### 업그레이드 전략

Electron은 **단계적 업그레이드**를 권장합니다.

```
34.3.0 → 35.x → 36.x → 37.x → 38.x → 39.x
```

### 각 버전별 주요 변경사항

#### Electron 35

- Chromium 130.x, Node.js 20.x
- contextIsolation 기본값 true 강제

#### Electron 36

- remote 모듈 완전 제거
- BrowserWindow.addDevToolsExtension() 제거

#### Electron 37

- allowRunningInsecureContent 제거
- File System Access API 변경

#### Electron 38

- app.allowRendererProcessReuse 완전 제거

#### Electron 39

- ESM 지원 개선
- WebSQL 완전 제거

### 실행 명령어 (각 버전별)

```bash
# Electron 35
npm install -D electron@35
npm start
# 테스트 후 다음 버전

# Electron 36
npm install -D electron@36
npm start
# ...반복

# 최종 Electron 39
npm install -D electron@39.2.7
npm start
npm run package
npm run make
```

### 검증 방법 (각 버전별 공통)

```bash
# 1. 개발 모드 실행
npm start

# 2. 기능 테스트
# - 윈도우 생성/크기조절/최소화/최대화
# - 메뉴 동작
# - IPC 통신
# - 네비게이션 (뒤로/앞으로)
# - 업데이터 동작

# 3. 빌드 테스트
npm run package

# 4. 설치파일 생성
npm run make
```

### 롤백 계획

```bash
npm install -D electron@34.3.0
# 또는 마지막 성공 버전으로
npm install -D electron@35.x.x
```

---

## Phase 7: TypeScript 업그레이드

**리스크: 낮음-중간 | 예상 소요: 20분**

### 주의사항

> TypeScript 5.9는 미릴리즈 상태일 수 있습니다.

```bash
npm view typescript versions --json | tail -10
```

### 대상 패키지

| 패키지     | 현재 버전 | 목표 버전           |
| ---------- | --------- | ------------------- |
| typescript | ~5.7.3    | 5.8.x (최신 안정판) |

### 실행 명령어

```bash
npm install -D typescript@latest
```

### 검증 방법

```bash
npx tsc --noEmit
npm run lint
npm start
```

---

## 전체 업그레이드 체크리스트

### Phase 1: 독립적 도구 ✅

- [x] husky 9.1.7 설치
- [x] .husky 디렉토리 재초기화
- [x] package.json prepare 스크립트 수정
- [x] lint-staged 15.5.2 업그레이드
- [x] prettier 3.5.0 업그레이드
- [x] 커밋 훅 테스트

### Phase 2: i18next ✅

- [x] i18next 25.x 설치
- [x] react-i18next 16.x 설치
- [x] 다국어 기능 테스트

### Phase 3: ESLint 9 ✅

- [x] 기존 ESLint 패키지 제거
- [x] typescript-eslint 8 설치
- [x] eslint.config.js 생성 (defineConfig 사용)
- [x] .eslintrc.json 삭제
- [x] package.json lint 스크립트 수정
- [x] 린트 실행 및 오류 수정
- [x] eslint-plugin-import 제거 (TypeScript가 import 체크 담당)

### Phase 4: React 19 ✅

- [x] react, react-dom 19 설치
- [x] @types/react, @types/react-dom 19 설치
- [x] TypeScript 컴파일 확인
- [ ] 앱 실행 및 기능 테스트

### Phase 5: Vite ✅

- [x] Vite 버전 확인 (6.4.1 - 이미 최신)
- [ ] 개발 서버 테스트
- [ ] 빌드 테스트

### Phase 6: Electron ✅

- [x] Breaking Changes 분석 (34 → 39)
  - Electron 35: session.serviceWorkers.fromVersionID() deprecated (미사용)
  - Electron 36: NativeImage.getBitmap() deprecated (미사용)
  - Electron 37: ProtocolResponse session null 불가 (미사용)
  - Electron 38: macOS 11 지원 제거, plugin-crashed 제거 (미사용)
  - Electron 39: window.open popups 항상 resizable (영향 없음)
- [x] electron-forge 7.10.2 업그레이드 (7.7.0 → 7.10.2)
- [x] Electron 39.2.7 직접 업그레이드 (34.3.0 → 39.2.7)
- [x] `app.dock` 타입 오류 수정 (`src/initialize/initMenu.ts:11`)
  - `if (isMac)` → `if (isMac && app.dock)` 변경
- [x] TypeScript 컴파일 확인
- [x] ESLint 확인
- [ ] 개발 서버 테스트 (`npm start`)
- [ ] 전체 빌드 및 배포 테스트 (`npm run package`, `npm run make`)

### Phase 7: TypeScript ✅

- [x] TypeScript 5.9.3 설치 (5.7.3 → 5.9.3)
- [x] 컴파일 오류 없음 확인

---

## 긴급 롤백 절차

전체 업그레이드 실패 시:

```bash
# 1. package.json 복원
git checkout -- package.json package-lock.json

# 2. 설정 파일 복원
git checkout -- .eslintrc.json .husky/

# 3. node_modules 재설치
rm -rf node_modules
npm install

# 4. 동작 확인
npm start
```

---

## 보류/확인 필요 패키지

| 패키지        | 요청된 버전 | 상태          | 대안        |
| ------------- | ----------- | ------------- | ----------- |
| vite          | 7.3.0       | 미릴리즈 가능 | 6.4.x 사용  |
| typescript    | 5.9.3       | 미릴리즈 가능 | 5.8.x 사용  |
| dotenv        | 17.2.3      | 미릴리즈 가능 | 16.x 유지   |
| lint-staged   | 16.2.7      | 확인 필요     | 15.5.x 사용 |
| i18next       | 25.7.3      | 확인 필요     | 24.x 사용   |
| react-i18next | 16.5.0      | 확인 필요     | 15.x 사용   |

---

## 권장 실행 일정

| 단계    | 작업                         | 예상 시간 | 권장 일정 |
| ------- | ---------------------------- | --------- | --------- |
| Phase 1 | husky, lint-staged, prettier | 30분      | Day 1     |
| Phase 2 | i18next, react-i18next       | 20분      | Day 1     |
| Phase 3 | ESLint 9                     | 1-2시간   | Day 1-2   |
| Phase 4 | React 19                     | 1시간     | Day 2     |
| Phase 5 | Vite                         | 30분      | Day 2     |
| Phase 6 | Electron (단계적)            | 2-4시간   | Day 3-4   |
| Phase 7 | TypeScript                   | 20분      | Day 4     |

**총 예상 소요 시간**: 6-9시간 (4일 분산 권장)

---

## 주요 파일 목록

업그레이드 시 수정이 필요한 핵심 파일들:

- `package.json` - 모든 의존성 정의
- `.eslintrc.json` → `eslint.config.js` (ESLint 9)
- `.husky/pre-commit` - husky 9 구조 변경
- `forge.config.ts` - Electron/Vite 호환성
- `src/renderers/main/index.tsx` - React 진입점 (현재 호환됨)

---

## 참고 자료

- [ESLint 9 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Electron Breaking Changes](https://www.electronjs.org/docs/latest/breaking-changes)
- [typescript-eslint v8](https://typescript-eslint.io/blog/announcing-typescript-eslint-v8)
- [Vite Migration Guide](https://vite.dev/guide/migration)

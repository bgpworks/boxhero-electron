# BoxHero Desktop App

[박스히어로](https://www.boxhero-app.com) 데스크톱 앱

![제품목록](screenshots/item_list.png)

## NPM Scripts

### 설치

```sh
yarn install
```

### 개발

```sh
# 1회 실행
yarn compile

# watch mode로 실행
yarn watch
```

### 손 빌드

[mini-diary repo](https://github.com/samuelmeuli/mini-diary) 참고.

code sign 및 deploy 관련해서 아래 키들이 필요하다.

**MacOS (DMG)**:

apple 정책 때문에 dmg는 apple 인증(notarize) 받아야 함. [참고1](https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/) [참고2](https://github.com/electron/electron-notarize#method-notarizeopts-promisevoid)

방법1. apple id / app-specific password를 쓴다.

```
export APPLE_ID=
export APPLE_ID_PASSWORD=
```

방법2. API Key

[AppstoreConnect](https://appstoreconnect.apple.com/access/api)에서 API key 파일을 받아서 `~/private_keys` 폴더에 넣는다. (`./private_keys` 위치는 `xcrun altool` 버그(?) 때문에 인식을 못한다.)

```
export API_KEY_ID=
export API_KEY_ISSUER_ID=
```

**Windows**

`/cert` 폴더를 만들고 `www.bgpworks.com.pfx` 파일 넣음.
키스토어 위치와 비밀번호는 환경변수로 넣는다.

```
export WIN_CSC_LINK=./cert/www.bgpworks.com.pfx
export WIN_CSC_KEY_PASSWORD=[KEY STORE PASSPHRASE]
```

**Github Token**

github에 deploy함.

https://github.com/settings/tokens 에서 repo (repo_deployment, public_repo) 스콥으로 토큰 만듬.

```
export GH_TOKEN=...
```

**AWS Credential**

S3에 deploy함. ([필요권한](https://github.com/electron-userland/electron-builder/issues/1618#issuecomment-314679128))

```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

**Deploy**

```
yarn release
```

### CI Build (Github CI)

1. package.json 수정해서 버전 업데이트 & 채널 변경(:bangbang:) 버전 뒤에 `-alpha` 나 `-beta` 붙이면 됨.
1. Github PR 생성 후 코드 리뷰.
1. 해당 PR에 `/deplay` 커멘트 작성. (:warning: 해당 채널로 디플로이 됨! 위에서 채널을 변경하지 않았으면 production(`latest`)로 디플로이 됨.)
1. PR에 디플로이 상태가 업데이트 됨. (또는 [Github Actions](https://github.com/bgpworks/boxhero-electron/actions)에서 확인 가능)
1. [Github releases](https://github.com/bgpworks/boxhero-electron/releases) draft가 자동 생성되는데 changelog를 채워서 완성함. 문제가 있으면 draft 삭제.
1. 모든 테스트가 완료 되었으면, package.json을 수정하여 채널을 빼고 다시 커밋.
1. 해당 PR에 `/deplay` 커멘트 작성.
1. Github release 업데이트

#### 인증서 만료시 업데이트

##### MacOS

1. 애플 포털 또는 Xcode에서 아래 두 인증서를 재발급 받아서 로컬에 설치한다.

- Developer ID Application: BGPworks (AXBF9WS5F5)
- Developer ID Installer: BGPworks (AXBF9WS5F5)

1. `Keychain access` 앱을 켜서 저 두 인증서를 선택하고 Export 한다. 비밀번호를 적당히 설정한다.
1. 이 레포의 Settings > Secrets를 업데이트 한다.

- MAC_CERTS: 생성된 p12 파일 내용(base64) (eg. `base64 -w 0 certs.p12`)
- MAC_CERTS_PASSWORD: 위에서 설정한 비밀번호

##### Windows

1. 인증서 새로 발급 받는다.
1. 이 레포의 Settings > Secrets를 업데이트 한다.

- WINDOWS_CERTS: 발급받은 인증서 내용(base64) (eg. `base64 -w 0 www.bgpworks.com.pfx`)
- WINDOWS_CERTS_PASSWORD: 발급받은 인증서 키스토어 비밀번호

##### Apple API Key

만료가 없긴하다. [AppstoreConnect](https://appstoreconnect.apple.com/access/api) 에서 발급받은 후 Settings > Secrets를 업데이트 한다.

- API_KEY: `AuthKey_xxxxxxxxxx.p8` 내용물을 그대로 넣는다. (줄바꿈 포함)
- API_KEY_ID: AppstoreConnect 화면에 보이는 대로
- API_KEY_ISSUER_ID: AppstoreConnect 화면에 보이는 대로

##### AWS Credential

S3로 퍼블리시할 때 사용.

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

## 프로젝트 구성

- src
  - electorn - 일렉트론 관련 소스코드
    - ipc
      - 렌더러 프로세스와 통신하기 위한 각종 ipc 관련 코드들. 업데이트 관련, 내부 뷰 관련, 창 관련으로 하위 모듈이 나뉘어져 있다.
    - utils
      - manageViewState.ts - 멀티 윈도우를 지원하기 위해 현재 활성화된 window와 해당 윈도우 안의 wrapper(타이틀바), webview(웹앱 컨텐츠)를 Single Source of truth로써 하나의 state로 관리하기 위한 모듈.
      - persistWindowState.ts - 윈도우의 위치와 크기를 보존하기 위한 모듈.
    - preloads - preload 관련 코드들. 웹뷰에 일렉트론 관련 정보들을 주입한다.
    - window.ts - 메인, 업데이터 등 각종 윈도우 생성 및 관리에 관련된 코드들.
    - menu.ts - context, app menu 코드들.
  - react - 리액트 관련 소스코드
    - tsconfig.json - 리액트 코드 전용 tsconfig
    - GlobalStyle.tsx - 전역 스타일이 정의되어 있다.
    - i18next.ts - i18n 관련 설정 및 초기화 코드들.
    - fromElectron.ts - 일렉트론에 관련된 코드들을 정리해둠.
    - styles - 공용 스타일 관련 코드들
    - cssSnippets.ts - styled components 와 함께 사용하는 css 조각을 만들어내는 helper functions.
    - pages - 페이지 컴포넌트
      - main - 커스텀 타이틀바를 위시한 mainWindow 내에서 사용되는 entry component.
      - update - 업데이터 윈도우에서 사용되는 entry component.
    - components - 각종 컴포넌트들. 페이지를 구분하지 않음.
  - @types - react와 electron 에서 공동으로 사용되는 타입 정의들
    - global.d.ts 글로벌 타입 정의. Window 객체에 타입을 정의하기 위해 사용함.
    - fonts.d.ts 코드내에서 폰트를 import 할 때 경고를 피하기 위한 모듈 선언.
    - utils.ts - 각종 유틸리티성 타입들.
- locales - 국제화 관련 json들
- build - 빌드 관련 파일들
- static - 정적인 이미지, 스타일 코드들.
- templates - 웹팩 번들링에 사용되는 템플릿 html

## 주요 사항

- 로그파일 경로
  - on macOS: ~/Library/Logs/BoxHero/main.log
  - on Windows: %USERPROFILE%\AppData\Roaming\BoxHero\main.log
- 타이틀바/업데이터 UI 구성을 위해 React 사용.
- 세션 보존 및 커스텀 타이틀바 적용을 위해 BrowserWindow에 직접 앱을 띄우지 않고 Webview를 사용함.
- 자동 업데이트 구현사항
  - native auto updater에서 download-progress 이벤트가 구현되지 않았고, electron-updater의 경우 윈도우에서 동 이벤트가 발생되지 않아 electron-differential-updater를 사용함.

## 향후 과제

- 일렉트론에서 구글 인증이 안되는 관계로, 구글 인증 페이지에 한해 userAgent를 크롬으로 위장하는 방법을 사용함. 미봉책으로써 이후 개선 필요.
- PDF 출력이 되지 않음. 일렉트론 프로젝트에 관련된 패치가 나올 경우 시험 후 적용할 것.

## 인증서

MAC(.dmg)용:

- Developer ID Application: (team)
- Developer ID Installer: (team)

## 스크린샷

![제품 정보](screenshots/item_detail.png)
![대시보드](screenshots/dashboard.png)
![입출고](screenshots/stock_in.png)
![바코드 스캔](screenshots/barcode_scan.png)
![바코드 라벨 디자인](screenshots/label_design.png)
![바코드 라벨 인쇄](screenshots/label_print.png)
![입출고 내역](screenshots/transaction_history.png)
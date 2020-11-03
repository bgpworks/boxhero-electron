# BoxHero Deskptop App

electron으로 묶음.

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

**Deploy**

```
yarn release
```

### CI Build (Github CI)

[electron-builder-action](https://github.com/marketplace/actions/electron-builder-action) 사용.

1. package.json 수정해서 버전 업데이트 / 커밋.
1. v*.*.* 형식으로 테크 추가. (git tag v1.2.3)
1. 푸쉬 (git push && git push --tags)

자세한 사항은 [문서](https://github.com/marketplace/actions/electron-builder-action) 참고.


## 프로젝트 구성

- src
  - electorn - 일렉트론 관련 소스코드
  - react - 리액트 관련 소스코드
  - @types - react와 electron 에서 공동으로 사용되는 타입 정의들
- locales - 국제화 관련 json들
- build - 빌드 관련 파일들
- static - 정적인 html 페이지들
- templates - 웹팩 번들링에 사용되는 템플릿 html

## 인증서

MAC(.dmg)용:

- Developer ID Application: (team)
- Developer ID Installer: (team)
- Provisioning profile: (appId)

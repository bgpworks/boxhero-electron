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

### 빌드

### Deploy

#### DMG

`/cert` 폴더를 만들고 `boxheromac.provisionprofile`를 넣어야함.

apple 정책 때문에 dmg는 apple 인증 받아야 함. `.env` 파일을 만들고 apple id / password를 쓴다. [참고](https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/)

```
APPLEID=
APPLEIDPASS=
```

#### Windows

`/cert` 폴더를 만들고 `www.bgpworks.com.pfx` 파일 넣음. (환경 변수로 받는게 정석.)
키스토어 비밀번호는 환경변수로 넣는다.

```
export WIN_CSC_KEY_PASSWORD=
```

### Publish

github에 deploy함.

https://github.com/settings/tokens 에서 repo (repo_deployment, public_repo) 스콥으로 토근 만듬.

```
export GH_TOKEN=...
```


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

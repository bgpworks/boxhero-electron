# BoxHero Deskptop App

electron으로 묶음.

`/cert` 폴더를 만들고 `boxheromac.provisionprofile` `boxheromacdev.provisionprofile`를 넣어야함.

https://github.com/settings/tokens 에서 repo (repo_deployment, public_repo) 스콥으로 토근 만듬.

```
export GH_TOKEN=...
```

`.env` 파일을 만들고 apple id / password를 쓴다. [참고](https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/)

```
APPLEID=
APPLEIDPASS=
```

## NPM Scripts

### 설치

```sh
npm i
```

### 개발

```sh
# 1회 실행
npm start

# watch mode로 실행
npm run watch
```

### 빌드

```sh
# target window 빌드
npm run dist-win
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

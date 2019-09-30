# BoxHero Deskptop App

electron으로 묶음.

`/cert` 폴더를 만들고 `boxheromac.provisionprofile`  `boxheromacdev.provisionprofile`를 넣어야함.

https://github.com/settings/tokens 에서 repo (repo_deployment, public_repo) 스콥으로 토근 만듬.

```
export GH_TOKEN=...
```

`.env` 파일을 만들고 apple id / password를 쓴다. [참고](https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/)

```
APPLEID=
APPLEIDPASS=
```

## 설치
```
yarn install

# Mac build
yarn dist-mac

# Mac App Store Test Build
yarn dist-mas-dev

# Mac App Store Build
yarn dist-mas

# Windows build
yarn dist --win
```

## 개발

디버그 메시지 보기:
```
# Show debug message
DEBUG=* yarn start
```

실행하기:
```
yarn start
```

## 인증서

MAC(.dmg)용:
- Developer ID Application: (team)
- Developer ID Installer: (team)
- Provisioning profile: (appId)

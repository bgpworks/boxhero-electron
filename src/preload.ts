// 클라이언트단에서 electron 여부임을 식별하기 위한 전역 변수 설정.
window.BOXHERO_ELECTRON = true;

const boxheroHostnames = ['localhost', 'web.boxhero-app.com'];

const isInBoxHero = () => boxheroHostnames.includes(location.hostname);
const isInKakaoLogin = () => location.hostname === 'accounts.kakao.com';
const isInFacebookLogin = () => location.hostname === 'www.facebook.com';
const isInGoogleLogin = () => location.hostname === 'accounts.google.com';
const isInAppleLogin = () => location.hostname === 'appleid.apple.com';

const titleBarColors = {
  apple: 'transparent',
  google: 'black',
  kakao: '#ffe500',
  facebook: '#365899',
};

const makeTitleBar = (height = 38, bgColor = 'rgba(0,0,0,.3)') => {
  const titleBar = document.createElement('div');
  titleBar.style.cssText = `
    width: 100vw;
    height: ${height}px;

    -webkit-user-select: none;
    -webkit-app-region: drag;

    background-color: ${bgColor};
    
    position: fixed;
    top: 0;
    left: 0;

    z-index: 99999;
    `;

  titleBar.id = 'boxhero-electron-title';

  return titleBar;
};

const setTitleBar = (size: number, bgColor: string, mainContentSelector: string) => {
  let titleBar = makeTitleBar(size, bgColor);
  let mainContentDiv = document.body.querySelector(mainContentSelector) as HTMLDivElement;

  document.body.prepend(titleBar!);

  mainContentDiv.style.cssText = `
  margin-top: 38px;
  `;
};

const initExternTitleBar = () => {
  if (isInAppleLogin()) {
    setTitleBar(44, titleBarColors.apple, '#content');
  } else if (isInKakaoLogin()) {
    setTitleBar(38, titleBarColors.kakao, '#kakaoWrap');
  } else if (isInFacebookLogin()) {
    setTitleBar(38, titleBarColors.facebook, '#booklet');
  } else if (isInGoogleLogin()) {
    setTitleBar(38, titleBarColors.google, '.wrapper');
  }
};

process.once('loaded', () => {
  window.addEventListener('DOMContentLoaded', () => {
    /* 
    카카오/구글 로그인 등 외부 페이지를 참조하는 nativeWindow에 대해서만 기본 타이틀바를 띄움.
    박스히어로 앱에서는 자체적으로 타이틀바를 띄운다.
    */
    if (!isInBoxHero()) {
      initExternTitleBar();
    }
  });
});

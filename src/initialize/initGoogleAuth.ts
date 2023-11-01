import { session } from "electron";

/**
 * 구글 인증 페이지에서만 요청 헤더 중 userAgent를 변경해 전송한다.
 * 구글 인증이 안되는 문제에 대한 미봉책.
 * 해결책 링크 : https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow
 **/
function initGoogleAuth() {
  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ["https://accounts.google.com/*"] },
    (details, callback) => {
      const userAgentBefore = details.requestHeaders["User-Agent"];
      details.requestHeaders["User-Agent"] = userAgentBefore.replace(
        /Electron\/.*/,
        ""
      );
      callback({ cancel: false, requestHeaders: details.requestHeaders });
    }
  );
}

export default initGoogleAuth;

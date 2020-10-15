process.once('loaded', () => {
  window.addEventListener('DOMContentLoaded', () => {
    const customTitleBar = document.createElement('div');
    customTitleBar.textContent = '엄청 좋은 재고 관리 플랫폼';

    customTitleBar.style.cssText = `
        width: 100vw;
        height: 45px;
        background-color: dodgerblue;

        -webkit-user-select: none;
        -webkit-app-region: drag;

        display: flex;
        align-items: center;
        justify-content: center;

        color: white;
        font-weight: bold;
        font-size: 1.2rem;`;

    document.body.prepend(customTitleBar);
  });
});

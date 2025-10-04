console.log(
  '%cbuild from PakePlus： https://github.com/Sjj1024/PakePlus',
  'color:orangered;font-weight:bolder'
);

// -------------------- 自动保持登录 --------------------
// 假设你的网站登录信息存储在 localStorage 的 token 中
// APP 启动时尝试恢复 token
const savedTokenKey = 'token'; // 替换成你网站使用的 key
const token = localStorage.getItem(savedTokenKey);
if (token) {
  // 调用你网站的自动登录函数（确保网站里有这个函数）
  if (typeof loginWithToken === 'function') {
    loginWithToken(token);
  }
}

// 页面关闭或登录成功时，保存 token
window.addEventListener('beforeunload', () => {
  const currentToken = localStorage.getItem(savedTokenKey);
  if (currentToken) {
    localStorage.setItem(savedTokenKey, currentToken);
  }
});

// -------------------- 处理 _blank 链接 --------------------
// 改进：支持支付宝 / 微信等外部协议
const hookClick = (e) => {
  const origin = e.target.closest('a');
  if (!origin || !origin.href) return;

  const href = origin.href;
  const isBaseTargetBlank = document.querySelector('head base[target="_blank"]');

  // 判断是否外部支付协议
  if (href.startsWith('alipays://') || href.startsWith('weixin://')) {
    e.preventDefault();
    try {
      // 直接交给系统处理
      window.location.href = href;
      console.log('外部支付协议已调用：', href);
    } catch (err) {
      console.warn('外部协议调用失败：', err);
      alert('无法唤起外部应用，请使用浏览器打开完成支付。');
    }
    return;
  }

  // 正常 _blank 拦截逻辑
  if (
    (origin.target === '_blank') ||
    (origin && isBaseTargetBlank)
  ) {
    e.preventDefault();
    location.href = href;
  }
};

// -------------------- 覆盖 window.open --------------------
// 改进：允许外部协议直接唤起
window.open = function (url, target, features) {
  if (typeof url === 'string' && (url.startsWith('alipays://') || url.startsWith('weixin://'))) {
    try {
      window.location.href = url;
      console.log('外部支付唤起成功：', url);
      return;
    } catch (err) {
      console.warn('外部支付唤起失败：', err);
      alert('请检查是否安装了对应的支付App。');
      return;
    }
  }
  // 其他链接仍正常跳转
  location.href = url;
};

document.addEventListener('click', hookClick, { capture: true });

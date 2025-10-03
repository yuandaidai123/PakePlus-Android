console.log(
  '%cbuild from PakePlus： https://github.com/Sjj1024/PakePlus',
  'color:orangered;font-weight:bolder'
)

// -------------------- 自动保持登录 --------------------
// 假设你的网站登录信息存储在 localStorage 的 token 中
// APP 启动时尝试恢复 token
const savedTokenKey = 'token'; // 替换成你网站使用的 key
const token = localStorage.getItem(savedTokenKey);
if(token){
  // 调用你网站的自动登录函数（确保网站里有这个函数）
  if(typeof loginWithToken === 'function'){
    loginWithToken(token);
  }
}

// 页面关闭或登录成功时，保存 token
window.addEventListener('beforeunload', () => {
  const currentToken = localStorage.getItem(savedTokenKey);
  if(currentToken){
    localStorage.setItem(savedTokenKey, currentToken);
  }
});

// -------------------- 处理 _blank 链接 --------------------
const hookClick = (e) => {
  const origin = e.target.closest('a');
  const isBaseTargetBlank = document.querySelector('head base[target="_blank"]');
  if (
    (origin && origin.href && origin.target === '_blank') ||
    (origin && origin.href && isBaseTargetBlank)
  ) {
    e.preventDefault();
    location.href = origin.href;
  }
};

window.open = function(url, target, features){
  location.href = url;
};

document.addEventListener('click', hookClick, { capture: true });

console.log(
  '%cbuild from PakePlus： https://github.com/Sjj1024/PakePlus',
  'color:orangered;font-weight:bolder'
);

// -------------------- 自动保持登录 --------------------
const savedTokenKey = 'token'; 
const token = localStorage.getItem(savedTokenKey);
if (token && typeof loginWithToken === 'function') {
    loginWithToken(token);
}

window.addEventListener('beforeunload', () => {
    const currentToken = localStorage.getItem(savedTokenKey);
    if (currentToken) localStorage.setItem(savedTokenKey, currentToken);
});

// -------------------- 等待 jQuery 加载 --------------------
function onJqueryReady(callback) {
    if (typeof $ !== 'undefined') {
        callback();
    } else {
        setTimeout(() => onJqueryReady(callback), 50);
    }
}

onJqueryReady(function() {
    // -------------------- 处理 _blank 链接 + 支付唤起 --------------------
    const hookClick = (e) => {
        const origin = e.target.closest('a');
        if (!origin || !origin.href) return;

        const href = origin.href;
        const isBaseTargetBlank = document.querySelector('head base[target="_blank"]');

        // 支付宝 / 微信外部协议
        if (href.startsWith('alipays://') || href.startsWith('weixin://')) {
            e.preventDefault();
            try {
                window.location.href = href;
                console.log('外部支付协议已调用：', href);
            } catch (err) {
                console.warn('外部协议调用失败：', err);
                alert('无法唤起外部应用，请使用浏览器打开完成支付。');
            }
            return;
        }

        // _blank 拦截逻辑
        if ((origin.target === '_blank') || (origin && isBaseTargetBlank)) {
            e.preventDefault();
            location.href = href;
        }
    };

    // -------------------- 覆盖 window.open --------------------
    window.open = function(url, target, features) {
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
        location.href = url;
    };

    document.addEventListener('click', hookClick, { capture: true });

    console.log('custom.js 初始化完成，jQuery 已加载');
});

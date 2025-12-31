// ===== 認証システム =====

// パスワード設定（変更してください！）
const SITE_PASSWORD = 'kumakumakyotou';

// パスワードをハッシュ化する簡易関数
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// セッションをチェック
function isAuthenticated() {
    return sessionStorage.getItem('tedx_auth') === 'true';
}

// ログインページかどうかをチェック
function isLoginPage() {
    return window.location.pathname.includes('login.html');
}

// ページ保護
function protectPage() {
    if (!isLoginPage() && !isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// ログインフォーム処理
if (isLoginPage()) {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const enteredPassword = passwordInput.value;

            // パスワードをチェック
            if (enteredPassword === SITE_PASSWORD) {
                // 認証成功
                sessionStorage.setItem('tedx_auth', 'true');

                // リダイレクト先を取得（戻るページがあれば）
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect') || 'index.html';

                window.location.href = redirect;
            } else {
                // 認証失敗
                errorMessage.classList.add('show');
                passwordInput.value = '';
                passwordInput.focus();

                // 3秒後にエラーメッセージを非表示
                setTimeout(() => {
                    errorMessage.classList.remove('show');
                }, 3000);
            }
        });
    }

    // すでに認証済みの場合はトップページへ
    if (isAuthenticated()) {
        window.location.href = 'index.html';
    }
}

// ページ読み込み時に認証チェック
document.addEventListener('DOMContentLoaded', function() {
    protectPage();
});

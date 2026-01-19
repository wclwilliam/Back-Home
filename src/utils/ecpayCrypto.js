import CryptoJS from 'crypto-js'

export default function goPayment() {
    const HashKey = 'pwFHCqoQZGmho4w6';
    const HashIV = 'EkRm7iFT261dpevs';

    // 設定時間與編號
    const now = new Date();
    const tradeDate = now.getFullYear() + '/' + 
        String(now.getMonth() + 1).padStart(2, '0') + '/' + 
        String(now.getDate()).padStart(2, '0') + ' ' + 
        String(now.getHours()).padStart(2, '0') + ':' + 
        String(now.getMinutes()).padStart(2, '0') + ':' + 
        String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('MerchantTradeDate').value = tradeDate;
    document.getElementById('MerchantTradeNo').value = "TEST" + Date.now();

    // 準備參數
    const form = document.getElementById('ecpayForm');
    let params = {};
    new FormData(form).forEach((value, key) => {
        if (key !== 'CheckMacValue' && value !== "") params[key] = value;
    });

    // 1. 排序
    const sortedKeys = Object.keys(params).sort();
    
    // 2. 串接
    let rawString = `HashKey=${HashKey}`;
    sortedKeys.forEach(key => { rawString += `&${key}=${params[key]}`; });
    rawString += `&HashIV=${HashIV}`;

    // 3. URL Encode
    // 關鍵：JavaScript 的 encodeURIComponent 與 .NET 的 HttpUtility.UrlEncode 有別
    let encodedString = encodeURIComponent(rawString);

    // 4. 轉小寫
    encodedString = encodedString.toLowerCase();

    // 5. 符號替換 (嚴格依照官方表單順序)
    encodedString = encodedString
        .replace(/%20/g, '+')
        .replace(/%2d/g, '-')
        .replace(/%5f/g, '_')
        .replace(/%2e/g, '.')
        .replace(/%21/g, '!')
        .replace(/%2a/g, '*')
        .replace(/%28/g, '(')
        .replace(/%29/g, ')');

    // 6. SHA256 並轉大寫
    const checkMacValue = CryptoJS.SHA256(encodedString).toString(CryptoJS.enc.Hex).toUpperCase();
    
    document.getElementById('CheckMacValue').value = checkMacValue;
    console.log("最終待加密字串:", encodedString);
    form.submit();
}
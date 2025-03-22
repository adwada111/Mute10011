// دفع PayPal
paypal.Buttons({
    createOrder: function(data, actions) {
        const amount = document.getElementById('amount').value;
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: amount,
                    currency_code: 'USD'
                },
                payee: {
                    email_address: 'aa23457777@gmail.com' // استبدل ببريدك الإلكتروني
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            const donatorName = document.getElementById('donatorName').value;
            const message = document.getElementById('message').value;
            const amount = document.getElementById('amount').value;

            sendToStreamlabs(donatorName, message, amount);
            alert(`شكرًا ${donatorName}! تم الدفع بنجاح (${amount} دولار).`);
        });
    }
}).render('#paypal-button-container');

// إرسال التنبيه إلى Streamlabs
function sendToStreamlabs(name, message, amount) {
    const streamlabsToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6IjYxNDMyQzUxQTJCRTAzRUEyRjEyMTEzNjE4MkM3MEU1NjFEQjhEMDczODcxOUY2QzA4QkRFNzQ3ODJENUQ1OEJFNjBDOTVDMzRFMUZBNUZFNzUxOEQ0MkZBMkUxQTkwMTk1NzM3MDEyMDI2QzdGMDg3Qzk2NzkyNjE0RTA2QzJENTZCRTQyRkU4NUQzMjlDMENCRjlBRjFDQTU4OUE0QjQyMEQwNkI1QTFCMDEyMDdBRTRGNjgxRkQxREVDMDQxQzEyMDQ3M0ZERjI5Rjk1NTcwNEQ0REQwNDVDQjg2MThENDY2RDBENjYwM0MwREY1Njc4RTlDODM3N0QiLCJyZWFkX29ubHkiOnRydWUsInByZXZlbnRfbWFzdGVyIjp0cnVlLCJzdHJlYW1sYWJzX2lkIjoiNzMwNzU1OTI3Mzg5MjkzNzcyOCIsImtpY2tfaWQiOiI1ODE0NzcyNiJ9.WRz8pS7nfrh62RKDm9DVsnb19STQVLqxEMvDrxByjdw'; // استبدل برمز جديد إذا لزم الأمر
    const socket = new WebSocket('wss://sockets.streamlabs.com?token=' + streamlabsToken);
    
    socket.onopen = () => {
        socket.send(JSON.stringify({
            type: 'donation',
            name: name,
            message: message,
            amount: parseFloat(amount),
            currency: 'USD'
        }));
        setTimeout(() => socket.close(), 1000);
    };
    socket.onerror = (error) => {
        console.error('خطأ في WebSocket:', error);
        alert('حدث خطأ في الاتصال بـ Streamlabs. تحقق من الـ Console.');
    };
    socket.onmessage = (event) => {
        console.log('استجابة من Streamlabs:', event.data);
    };
}

// التحقق من الرمز السري وفتح النافذة المنبثقة
function checkSecretCode() {
    const secretCode = document.getElementById('secretCode').value;
    if (secretCode === '10011') {
        document.getElementById('testPopup').style.display = 'flex';
    } else {
        alert('الرمز السري غير صحيح! أدخل "????" للاختبار.');
    }
}

// إرسال تبرع اختباري من النافذة المنبثقة
function sendTestDonation() {
    const donatorName = document.getElementById('testDonatorName').value;
    const message = document.getElementById('testMessage').value;
    const amount = document.getElementById('testAmount').value;

    if (donatorName && message && amount) {
        sendToStreamlabs(donatorName, message, amount);
        alert(`تم إرسال تبرع اختباري: ${donatorName} - $${amount} - ${message}`);
        closePopup();
    } else {
        alert('يرجى ملء جميع الحقول!');
    }
}

// إغلاق النافذة المنبثقة
function closePopup() {
    document.getElementById('testPopup').style.display = 'none';
}
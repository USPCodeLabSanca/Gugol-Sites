
async function login(e) {
    e.preventDefault();
    const form = document.getElementById('login-form');
    const username = form.username.value;
    const password = form.password.value;
    const res = await fetch(`/user/auth`, {
        method: 'POST',
        body: JSON.stringify({'username' : username, 'password' : password}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    
    if (!res.ok || res.status == 404) {
        const text = await res.text() ?? "Erro ao logar";
        alert(text);
        return;
    }

    window.location.replace('./portal.html');
}
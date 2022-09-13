function verificar(e) {
    e.preventDefault();
    const form = document.getElementById('cad');
    username = document.getElementById('username').value;
    password = document.getElementById("password").value;
    confirm_password = document.getElementById("confirmPassword").value;
    if (password === confirm_password){
        fetch('/user', {
            method: 'POST',
            body: JSON.stringify({'username' : username, 'password' : password}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then( res => {
            if(res.ok){
                window.location.replace("/login.html");

            }
            else{
                window.alert("Nome de usuário já existe")

            }
            
        });    
    }
    else {
    window.alert("As senhas precisam ser as mesmas")
    }
}
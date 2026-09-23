# Teste:
from backend.app.classes.Conta import Usuario
def main():
    senha = input("Digite a senha: ")
    email = input("Digite o email: ")
    a = Usuario(nome="Pedro", cpf="06990889099", email=email, senha=senha )
    print(a)

if __name__ == "__main__":
    main()
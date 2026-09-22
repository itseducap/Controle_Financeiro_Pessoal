import datetime as dt

from Pessoa import Pessoa_Fisica

from helpers import check_and_normalize_email, hashing_senha
   
        
class Usuario(Pessoa_Fisica):
    def __init__(self, *, nome, cpf, email, hash_senha):
        super().__init__(nome=nome, cpf=cpf)
        self.data_criacao = dt.datetime.now()
        self.nome = nome
        self.email = email
        self.hash_senha = hash_senha

    def __str__(self):
        return f"Nome: {self.nome}, CPF: {self.cpf}, data_criação: {self.data_criacao}, Email: {self.email}"
        

    # TODO: implementar funcao registro de pagamento
    def registrar_pagamento(self, valor, destinatario):
        pass

    # ------------- GETTERS & SETTERS --------------
    
    @property
    def data_criacao(self):
        return self._data_criacao

    @data_criacao.setter
    def data_criacao(self, data:dt):
        self._data_criacao = data

    @property
    def nome(self):
        return self._nome

    @nome.setter
    def nome(self, nome):
        if type(nome) == str and len(nome) < 100:
            self._nome = nome

    @property
    def email(self):
        return self._email

    @email.setter
    def email(self, email):
        validated_email = check_and_normalize_email(email=email, check=True)
        if validated_email["error"] is not None:
            self._email = email

    @property
    def hash_senha(self):
        return self._hash_senha

    @hash_senha.setter
    def hash_senha(self, senha: str):
        try:
            self._hash_senha = hashing_senha(senha)
        except ValueError:
            print("Senha deve ser maior que 10 caracteres")


# Teste:

def main():
    print("")

if __name__ == "__main__":
    main()
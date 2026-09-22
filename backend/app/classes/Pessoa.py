class Pessoa:
    def __init__(self, nome: str):
        self.nome = nome

    @property
    def nome(self):
        return self._nome

    @nome.setter
    def nome(self, nome):
        if type(nome) == str and len(nome) < 20:
            self._nome = nome

class Pessoa_Fisica(Pessoa):
    def __init__(self,*, nome: str, cpf: str):
        super().__init__(nome)
        self.cpf = cpf

class Pessoa_Juridica(Pessoa):

    def __init__(self,*, nome: str, cnpj: str):
        super().__init__(nome)
        self.cnpj = cnpj
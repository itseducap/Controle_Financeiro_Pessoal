from abc import ABC, abstractmethod

class Transacao(ABC):
    def __init__(self):
        pass



class Receita(Transacao):
    def __init__(self):
        super().__init__()

class Despesa(Transacao):
    def __init__(self):
        super().__init__()



class Doacao(Receita):
    def __init__(self):
        super().__init__()

class Salario(Receita):
    def __init__(self):
        super().__init__()

class Servico(Receita):
    def __init__(self):
        super().__init__()
from abc import ABC, abstractmethod

class Transacao(ABC):
    def __init__(self, id, data, horario, valor, metodo_pagamento, data_vencimento, data_pagamento, remetente, categoria):
        self.id = id
        self.data = data
        self.horario = horario
        self.valor = valor
        self.metodo_pagamento = metodo_pagamento
        self.data_vencimento = data_vencimento
        self.data_pagamento = data_pagamento
        self.remetente = remetente
        self.categoria = categoria

    @abstractmethod
    def getter(self):
        pass

    @abstractmethod
    def setter(self):
        pass

    @property
    def pagador(self):
        return self._pagador

    @pagador.setter
    def pagador(self):
        self._pagador = self.pagador

    @property
    def data(self):
        return self._data
    
    @data.setter
    def data(self):
        self._data = self.data

    @property
    def horario(self):
        return self._horario
    
    @horario.setter
    def horario(self):
        self._horario = self.horario

    @property
    def valor(self):
        return self._valor

    @valor.setter
    def valor(self):
        self._valor = self.valor

    @property
    def metodo_pagamento(self):
        return self._metodo_pagamento
    
    @metodo_pagamento.setter
    def metodo_pagamento(self):
        self._metodo_pagamento = self.metodo_pagamento

    @property
    def data_vencimento(self):
        return self._data_vencimento
    
    @data_vencimento.setter
    def data_vencimento(self):
        self._data_vencimento = self.data_vencimento

    @property
    def data_pagamento(self):
        return self._data_pagamento

    @data_pagamento.setter
    def data_pagamento(self):
        self._data_pagamento = self.data_pagamento

    @property
    def remetente(self):
        return self._remetente
    
    @remetente.setter
    def remetente(self):
        self._remetente = self.remetente

    @property
    def categoria(self):
        return self._categoria
    
    @categoria.setter
    def categoria(self):
        self._categoria = self.categoria



class Receita(Transacao):
    def __init__(self, pagador, *, id, data, horario, valor, metodo_pagamento, data_vencimento, data_pagamento, remetente):
        super().__init__(id, data, horario, valor, metodo_pagamento, data_vencimento, data_pagamento, remetente)
        self.pagador = pagador

    @property
    def pagador(self):
        return self._pagador

    @pagador.setter
    def pagador(self):
        self._pagador = self.pagador

class Despesa(Transacao):
    def __init__(self, recebedor, *, id, data, horario, valor, metodo_pagamento, data_vencimento, data_pagamento, remetente):
        super().__init__(id, data, horario, valor, metodo_pagamento, data_vencimento, data_pagamento, remetente)
        self.recebedor = recebedor

    @property
    def recebedor(self):
        return self._recebedor

    @recebedor.setter
    def recebedor(self):
        self._recebedor = self.recebedor
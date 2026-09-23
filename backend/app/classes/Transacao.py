from abc import ABC, abstractmethod

class Transacao(ABC):
    def __init__(self, id, data, horario, valor, metodo_pagamento, data_vencimento, data_pagamento, remetente, categoria):
        self._id = id
        self._data = data
        self._horario = horario
        self._valor = valor
        self._metodo_pagamento = metodo_pagamento
        self._data_vencimento = data_vencimento
        self._data_pagamento = data_pagamento
        self._remetente = remetente
        self._categoria = categoria

    @abstractmethod
    def getter(self):
        pass

    @abstractmethod
    def setter(self):
        pass

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
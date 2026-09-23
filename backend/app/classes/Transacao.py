class Transacao():
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

    @property
    def pagador(self):
        return self._pagador

    @pagador.setter
    def pagador(self, valor):
        self._pagador = valor

    @property
    def data(self):
        return self._data
    
    @data.setter
    def data(self, valor):
        self._data = valor

    @property
    def horario(self):
        return self._horario
    
    @horario.setter
    def horario(self, valor):
        self._horario = valor

    @property
    def valor(self):
        return self._valor

    @valor.setter
    def valor(self, valor):
        self._valor = valor

    @property
    def metodo_pagamento(self):
        return self._metodo_pagamento
    
    @metodo_pagamento.setter
    def metodo_pagamento(self, valor):
        self._metodo_pagamento = valor

    @property
    def data_vencimento(self):
        return self._data_vencimento
    
    @data_vencimento.setter
    def data_vencimento(self, valor):
        self._data_vencimento = valor

    @property
    def data_pagamento(self):
        return self._data_pagamento

    @data_pagamento.setter
    def data_pagamento(self, valor):
        self._data_pagamento = valor

    @property
    def remetente(self):
        return self._remetente
    
    @remetente.setter
    def remetente(self, valor):
        self._remetente = valor

    @property
    def categoria(self):
        return self._categoria
    
    @categoria.setter
    def categoria(self, valor):
        self._categoria = valor

class Receita(Transacao):
    def __init__(self, pagador, *, id, data, horario, valor, metodo_pagamento, data_vencimento, data_pagamento, remetente):
        super().__init__(id, data, horario, valor, metodo_pagamento, data_vencimento, data_pagamento, remetente)
        self.pagador = pagador

    @property
    def pagador(self):
        return self._pagador

    @pagador.setter
    def pagador(self, valor):
        self._pagador = valor

class Despesa(Transacao):
    def __init__(self, recebedor, *, id, data, horario, valor, metodo_pagamento, data_vencimento, data_pagamento, remetente):
        super().__init__(id, data, horario, valor, metodo_pagamento, data_vencimento, data_pagamento, remetente)
        self.recebedor = recebedor

    @property
    def recebedor(self):
        return self._recebedor

    @recebedor.setter
    def recebedor(self, valor):
        self._recebedor = valor
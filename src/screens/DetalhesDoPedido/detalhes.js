import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, View, Button, TextInput } from 'react-native';

import { getData, deleteKey } from '../../storage';

import { adicionarItemAoPedido, editarItemDoPedido } from '../../services/api-pedido';

export default function DetalhesDoPedido({ navigation }) {
  const [produto, setProduto] = useState({});
  const [idUsuario, setIdUsuario] = useState(-1);
  const [quantidade, setQuantidade] = useState(1);

  const [itemCarrinho, setItemCarrinho] = useState({});
  const [editar, setEditar] = useState(false);

  useEffect(() => {
    // deleteKey('editar');

    async function recuperarProduto() {
      const response = await getData('produtoEmFoco');
      const responseToken = await getData('idUsuario');

      const itemCarrinho = await getData('itemCarrinho');
      const editar = await getData('editar');

      setProduto(response);
      setIdUsuario(parseInt(responseToken));
      
      setItemCarrinho(itemCarrinho);
      setEditar(editar);
  }

  recuperarProduto();   
  }, [])

  function handleQuantidade(aumentar) {
    if(aumentar) {
      (quantidade + 1) > produto.quantidadeEmEstoque ?
        setQuantidade(produto.quantidadeEmEstoque)
      :
        setQuantidade(quantidade + 1)

      return
    } 

    if(quantidade <= 1) {
      return setQuantidade(1);
    }

    return setQuantidade(quantidade - 1);
  }

  function handleAddAoCarrinho() {
    adicionarItemAoPedido(idUsuario, produto.id, quantidade)
      .then(resposta => {
        console.log(resposta)
        
        navigation.navigate('Carrinho');
      })
      .catch(erro => {
        
        console.log(erro);
      })
  }

  function handleEditarItem() {
    const novasInfos = {
      idDoClienteLogado: idUsuario,
      idProduto: produto.id,
      quantidade
    }

    editarItemDoPedido(itemCarrinho.id, novasInfos)
      .then((resposta) => {
        console.log(resposta.data);

        navigation.navigate('Carrinho');
      })
      .catch((erro) => {
        alert("Erro ao editar item!");
        console.log("Erro ao listar produtos: " + erro);

        navigation.navigate('Carrinho');
      });

      deleteKey('editar');
  }

  return (
    <>
    {Object.values(produto).length !== 0 ? 
      <View style={styles.container}>
        {console.log(produto.id, quantidade, idUsuario)}
        <Text>{produto.url}</Text>
        <Text>{produto.nome}</Text>

        <ScrollView style={{height: 130, marginVertical: 20}}>
          <Text>{produto.descricao}</Text>
        </ScrollView>

        <View>
          <Text style={{margin: 20, justifyContent: 'center'}}>Quantidade a ser comprada</Text>
          <View style={styles.containerButton2}>
            <TextInput value={quantidade.toString()} onChangeText={e => setQuantidade(e)}
              style={styles.inputQuantidade} keyboardType='numeric'
              maxLength={3} editable={false} />

              <Button title="+" onPress={() => handleQuantidade(true)} />
              <Button title="-" onPress={() => handleQuantidade(false)} />
          </View>
        </View>

        <View style={styles.containerButton}>
          {editar ?
            <Button title="Editar" onPress={() => handleEditarItem()} />
          :
            <Button title="Adicionar ao carrinho" onPress={() => handleAddAoCarrinho()} />
          }
          
          <Button title="Cancelar" onPress={() => navigation.navigate('Produtos')} />
        </View>
      </View>
    :
      <Text></Text>
    }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    width: '100%',
    // height: '80%',
    padding: 15
  },

  containerButton: {
    width: 300,
    height: 100,
    justifyContent: 'space-between',
    marginTop: 40
  },

  containerButton2: {
    flexDirection: 'row',
    width: 100,
    height: 25
  },

  inputQuantidade: {
    width: 20,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  }
});

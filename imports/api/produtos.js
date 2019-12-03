import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const ListaProdutos = new Mongo.Collection('produtos');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('produtos', function produtosPublication() {
    return ListaProdutos.find({});
  });
}

Meteor.methods({
  
  'produtos.insert'(texto, preço, descricao, categoria) {
    check(texto, String);
    check(preço, String);
    check(descricao, String);
    check(categoria, String);

    ListaProdutos.insert({
      texto,
      preco,
      descricao,
      categoria,
      createdAt: new Date(), // Data de adicao no BD
    });
  },
  'produtos.remove'(_id) {
    const produto = produtos.findOne(_id);
    ListaProdutos.remove(_id);
  }
});

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Accounts } from 'meteor/accounts-base';
import { Tasks } from '../api/tasks.js';
import { ListaProdutos } from '../api/produtos.js';
import { Mongo } from 'meteor/mongo';

import './task.js';
import './body.html';


if(Meteor.isClient){

  Template.register.events({
    'submit form': function(event) {
        event.preventDefault();
        var emailVar = event.target.registerEmail.value;
        var firstnameVar = event.target.registerFirstname.value;
        var lastnameVar = event.target.registerLastname.value;
        var passwordVar = event.target.registerPassword.value;

        Accounts.createUser({
            email: emailVar,
            firstName: firstnameVar,
            lastName: lastnameVar,
            password: passwordVar
        });
      alert('Usuário ' + firstnameVar + ' criado com sucesso!');
    }
  },

  );

  
  Template.login.events({
    'submit form': function(event){
      event.preventDefault();
      var emailVar = event.target.loginEmail.value;
      var passwordVar = event.target.loginPassword.value;

      Meteor.loginWithPassword(emailVar, passwordVar, function error() {
          Router.go('/home');
      });
    }
    });


  Template.navSuperior.events({
    'click .logout': function(event){
      event.preventDefault();
      Meteor.logout();
  }
});

  Template.dashboard.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
    },

    'click .cadastro': function(event){
      event.preventDefault();
      Router.go('cadastro-item');
    },
  });
}

Template.cadastroItem.events({
  'submit form': function(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const texto = target.texto.value;
    const preço = target.preço.value;
    const descricao = target.descricao.value;
    const categoria = target.categoria.value;

    // Insert a task into the collection
    Meteor.call('produtos.insert', texto, preço, descricao, categoria);
    alert("Item adicionado!");
    
  },
});


Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.home.helpers({
  usuarios(){
    return Meteor.users.find();
  }
});


Template.navSuperior.helpers({
  usuarios(){
    return Meteor.users.find();
  }
});

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('produtos');
});


Template.cadastroItem.helpers({
  produtos(){
    return ListaProdutos.find({}, { sort: { createdAt: -1 } });
  },
});


Template.dashboard.helpers({
  produtos(){
    return ListaProdutos.find({}, { sort: { createdAt: -1 } });
  },

  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});

Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Meteor.call('tasks.insert', text);

    // Clear form
    target.text.value = '';
  },
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});

// Rotas
Router.route('/cadastro-item', function(){
  this.render('cadastroItem',{
  });
});

Router.route('/home', function () {
  this.render('home', {
  });
});

Router.route('/', function () {
  this.render('inicio', {
  });
});
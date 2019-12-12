import '../imports/api/tasks.js';
import '../imports/api/produtos.js';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';


Accounts.onCreateUser(function(options, user) {
  // Use provided profile in options, or create an empty object
  user.profile = options.profile || {};   // Assigns first and last names to the newly created user object
  user.profile.firstName = options.firstName;
  user.profile.lastName = options.lastName;   // Returns the user object
  return user;
});

Meteor.publish('Meteor.users.initials', function ({ userIds }) {
  // Validate the arguments to be what we expect
  new SimpleSchema({
    userIds: { type: [String] }
  }).validate({ userIds });

  // Select only the users that match the array of IDs passed in
  const selector = {
    _id: { $in: userIds }
  };

  // Only return one field, `initials`
  const options = {
    fields: { initials: 1 }
  };

  return Meteor.users.find(selector, options);
});


  

  
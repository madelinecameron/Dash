import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { moment } from 'moment';

const async = require('async');

Template.eventLayout.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.eventLayout.helpers({
  content() {
    console.log("GETTING CONTENT")
    switch(this.type) {
      case 'SHIPPING':
        return getShippingInfo(this.data.code);
        break;
      case 'UNTIL':
        return getUntil(this);
        break;
      case 'TEXT':
        return this.data.text;
        break;
      case 'LIST':
        break;
      case 'WEATHER':
        return getWeather();
        break;
    }
  },
});

const getWeather = (zip) => {
  forecast.get(40.7235050,-74.0447360, (err, res, data) => {
    console.log("WEATHER: ", res, data);
  })
}

const getShippingInfo = (code) => {
  return Meteor.call('getShipment', code);
}

const getUntil = (untilObj) => {
  return {
    type: untilObj.type,
    title: untilObj.data.title,
    data: {
      until: moment(untilObj.data.date).fromNow()
    }
  }
}

const getCalculateText = (textObject) => {
  switch(textObject.type) {
    case 'DISPLAY':
      return textObject;
    case 'FINANCIALS':
      return getFinancials(textObject);
  }
}

const getFinancials = (requests) => {
  let card = { type: 'FINANCIAL', items: [] };
  async.each(requests,
    (request, done) => {
        switch(request.type) {
          case 'BALANCE':
            plaid.getBalance(requests.data.balance_access_token, (err, accounts) => {
              let balances = [];
              accounts.forEach((account) => {
                balances.push({ 
                  balance: account.balance.available,
                  accountName: account.institution_type
                });
              });
              card.items.push({ 
                type: 'BALANCE', 
                data: balances
              });
            });
            break;
          case 'INCOME':
            plaid.getIncomeUser(requests.data.income_access_token, (err, income) => {
              if(err) {
                card.items.push({ error: 'Oops! Your income couldn\'t be retrieved! Error: ' + err });
              }
              else {
                card.items.push({
                  type: 'INCOME',
                  data: income.income
                });
              }
            });
            break;
          case "YOY_INCOME":
            plaid.getIncomeUser(requests.data.income_access_token, (err, income) => {
              if(err) {
                card.items.push({ error: 'Oops! Your YOY income couldn\'t be retrieved! Error: ' + err });
              }
              else {
                card.items.push({
                  type: "YOY_INCOME",
                  data: { 
                    percent: (income.income.projected_yearly_income / income.income.last_year_income) * 100
                  }
                });
              }
            });
            break;
        }
        done();
    },
    (err) => {
      return card;
    })
}
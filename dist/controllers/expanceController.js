"use strict";

const {
  sequelize,
  User,
  Expense
} = require('../models');
const express = require('express');
const app = express();
app.use(express.json());

// Create an expense for a user and update the available balance
const createExpense = async (req, res) => {
  const {
    userId
  } = req.params;
  const {
    description,
    amount,
    date,
    category,
    type
  } = req.body;
  try {
    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Retrieve the current available balance
    let {
      available_balance
    } = await user.get();

    // Calculate the new available balance
    if (type === 'income') {
      available_balance += amount;
    } else if (type === 'expense') {
      available_balance -= amount;
    }

    // Update the available balance in the database
    await user.update({
      available_balance
    });

    // Create the expense record and associate it with the user
    const expense = await Expense.create({
      description,
      amount,
      date,
      category,
      type,
      UserId: userId
    });
    return res.status(201).json({
      message: "Expense created",
      data: expense
    });
  } catch (err) {
    console.log("error " + err);
    return res.status(500).json(err);
  }
};

// Retrieve the total expenses for a user based on a certain day, month, or year
const getTotalExpenses = async (req, res) => {
  const {
    userId
  } = req.params;
  const {
    day,
    month,
    year
  } = req.query;
  try {
    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Build the WHERE clause based on the day, month, and year
    let whereClause = {
      UserId: userId
    };
    if (day) {
      whereClause.date = {
        [Op.eq]: day
      };
    } else if (month) {
      whereClause.date = {
        [Op.like]: `${year}-${month}-%`
      };
    } else if (year) {
      whereClause.date = {
        [Op.like]: `${year}-%-%`
      };
    }

    // Calculate the total expenses
    const totalExpenses = await Expense.sum('amount', {
      where: whereClause
    });
    return res.status(200).json({
      message: "Total expenses retrieved",
      data: {
        totalExpenses
      }
    });
  } catch (err) {
    console.log("error " + err);
    return res.status(500).json(err);
  }
};

// Retrieve the balance for a user
const getBalance = async (req, res) => {
  const {
    userId
  } = req.params;
  try {
    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Calculate the total income and outcome
    const totalIncome = await Expense.sum('amount', {
      where: {
        UserId: userId,
        type: 'income'
      }
    });
    const totalOutcome = await Expense.sum('amount', {
      where: {
        UserId: userId,
        type: 'outcome'
      }
    });

    // Calculate the available balance
    const availableBalance = totalIncome - totalOutcome;

    // Get the expenses for the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const expensesLast30Days = await Expense.sum('amount', {
      where: {
        UserId: userId,
        type: 'outcome',
        date: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    // Calculate the percentage of expenses for the last 30 days
    const percentageExpensesLast30Days = expensesLast30Days / totalOutcome * 100;
    return res.status(200).json({
      message: "Balance retrieved",
      data: {
        totalIncome,
        totalOutcome,
        availableBalance,
        expensesLast30Days,
        percentageExpensesLast30Days
      }
    });
  } catch (err) {
    console.log("error " + err);
    return res.status(500).json(err);
  }
};
module.exports = {
  createUser,
  createExpense,
  getTotalExpenses,
  getBalance
};
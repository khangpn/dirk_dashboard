var express = require('express');
var router = express.Router();
const Task = require('../models').Task;
const Sequelize = require('../models').Sequelize
const Op = Sequelize.Op

/* GET task listing. */
router.get('/', function(req, res, next) {
  Task.findAll().then(tasks => {
    res.send(tasks);
  })
});

/**
* KnP: like the 
* router.get('/from/:selectedDate/offset/:offset', function(req, res, next) {
* with offset == 1
*/
router.get('/date/:selectedDate', function(req, res, next) {
  let selectedDate = Date.parse(req.params["selectedDate"])
  if (isNaN(selectedDate)) return res.send([])
  getTaskFromDate(selectedDate).then(tasks => {
    res.send(tasks);
  })
});

/**
* KnP: get tasks from a day range
* The offset start with 1, which mean entire the selectedDate
* 2 mean the entire selectedDate and the entire 1 day before and so on...
*/
router.get('/from/:selectedDate/offset/:offset', function(req, res, next) {
  let selectedDate = Date.parse(req.params["selectedDate"])
  if (isNaN(selectedDate)) return res.send([])
  let offset = Number(req.params["offset"])
  if (isNaN(offset)) offset = 1
  // KnP: move to the end of the selected date
  selectedDate = getTomorrowDate(new Date(selectedDate))
  let pastDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate() - offset
  )
  Task.findAll({
    where: {
      createdAt: {
        [Op.between]: [pastDate, selectedDate]
      }
    }
  }).then(tasks => {
    let tasksHash = {}
    for(let task of tasks) {
      let taskDateString = getDateString(task.createdAt)      
      if (!tasksHash[taskDateString] || !Array.isArray(tasksHash[taskDateString])) {
        tasksHash[taskDateString] = [task]
      } else {
        tasksHash[taskDateString].push(task)
      }
    }
    res.send(tasksHash);
  })
});

function getTaskFromDate(selectedDate) {
  if (isNaN(selectedDate)) return Promise.resolve([])
  selectedDate = new Date(selectedDate)
  let nextDate = getTomorrowDate(selectedDate)
  return Task.findAll({
    where: {
      createdAt: {
        [Op.between]: [selectedDate, nextDate]
      }
    }
  })
}

function getDateString(date) {
  return date.getFullYear() + "-" +
    (date.getMonth() + 1) + "-" +
    date.getDate()
    
}

function getTomorrowDate(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  )
}

module.exports = router;

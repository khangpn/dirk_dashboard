$(function() {
  const STATUS = {
    1: 'SUCCESS',
    2: 'WARNING',
    3: 'FAILED',
  }
  const TEXT_COLORS = {
    1: 'text-success',
    2: 'text-warning',
    3: 'text-danger',
  }

  function getDateString(date) {
    return date.getFullYear() + "-" +
      (date.getMonth() + 1) + "-" +
      date.getDate()
      
  }

  function getPastDate(date, offset) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - offset
    )
  }

  function getPastDays(today, numberOfDays) {
    let days = [ today ]
    if (!numberOfDays) return days
    for (let i = 1; i <= numberOfDays; i++) {
      days.push(getPastDate(today, i))
    }
    return days
  }

  const today = new Date()
  const pastDays = getPastDays (today, 3)
  for (let i = 0; i < pastDays.length; i++) {
    let date = pastDays[i]
    const dateString = getDateString(date) 
    $.get(`/tasks/date/${dateString}`, function(data) {
      if (data && Array.isArray(data) && data.length > 0) {
        let col = $(`div#day_${i}`)
        for (let task of data) {
          let row = $("<div></div>")
            .attr("class", `p-3 border-bottom text-center ${TEXT_COLORS[task.status]}`)
            .text(`${task.name} - ${STATUS[task.status]}`)
          col.append(row)
        }
      }
    })
  }

})

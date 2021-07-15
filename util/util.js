const moment = require("moment")

exports.errorLog = (f_name, error) => {
  console.log()
  console.log(`: =============== ${f_name} =================`)
  console.log(`DATE : ${moment().format("YYYY-MM-DD || hh:mm:ss A")}`)
  console.log(`${f_name} -> error `, error.message)
  console.log(": ===========================================")
  console.log()
}

exports.castStringToBoolean = (value) => {
  var ret
  if (value === "true") {
    ret = true
  } else {
    ret = false
  }
  return ret
}

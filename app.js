const express = require('express')
const sqlite3 = require('sqlite3')
const app = express()
const {open} = require('sqlite')
const path = require('path')
let db = null
app.use(express.json())

const filePath = path.join(__dirname, 'cricketTeam.db')

const intializeDBAndServer = async () => {
  try {
    db = await open({
      filename: filePath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server runnig at https://localhost:3000/')
    })
  } catch (error) {
    cosole.log(`Database error:${error.message}`)
    process.exit(1)
  }
}

intializeDBAndServer()

//API 1

app.get('/players/', async (req, res) => {
  const playersQuery = `SELECT * FROM cricket_team`
  const playersArray = await db.all(playersQuery)
  res.send(playersArray)
})

//API 2

app.post('/players/', async (req, res) => {
  const playerDetails = req.body
  const {playerName, jerseyNumber, role} = playerDetails
  const addQuery = `INSERT INTO cricket_team (player_name,jersey_number,role)
  VALUES
   ('${playerName}',
   ${jerseyNumber},
   '${role}');`

  const dbResponse = await db.run(addQuery)
  const playerId = dbResponse.lastID
  res.send('Player Added to Team')
})

///API 3

app.get('/players/:playerid/', async (req, res) => {
  const {playerid} = req.params
  const playerQuery = `SELECT * FROM cricket_team WHERE player_id = ${playerid};`
  const playerData = await db.get(playerQuery)
  res.send(playerData)
})

// API 4

app.put('/players/:playerId/', async (req, res) => {
  const playerId = req.params.playerId
  const UpdatingData = req.body
  const {playerName, jerseyNumber, role} = UpdatingData
  const updateQuery = `UPDATE cricket_team SET player_name = '${playerName}',
  jersey_number = ${jerseyNumber}, role = '${role}';`
  await db.run(updateQuery)
  res.send('Player Details Updated')
})

// API 5

app.delete('/players/:playerid/', async (req, res) => {
  const playerid = req.params.playerid
  const delteQuery = `DELETE FROM cricket_team WHERE player_id = ${playerid};`
  await db.run(delteQuery)
  res.send('Player Removed')
})

module.exports = app

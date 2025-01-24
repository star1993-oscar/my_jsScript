const express = require('express')
const app = express()

const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

app.use(myLogger)

function verificationUser(req, res, next) {
  console.log('[asdfasdf1]')

  next();
}
function verificationAdmin(req, res, next) {
  console.log('[asdfasdf1]')

  next();
}
app.get('/test/:id', verificationUser, (req, res, next) => {
  const { id } = req.params
  if (id == '1') {
    res.send('this is test')
    return;
  }
  console.log('[asdfasdf2]')
  next();
}, (req, res, next) => {
  console.log('[asdfasdf3]')
  res.send('everything is ok')
})
app.get('/privacy', verificationUser, verificationAdmin, (req, res, next) => {
  const { id } = req.params
  if (id == '1') {
    res.send('this is test')
    return;
  }
  console.log('[asdfasdf2]')
  next();
})

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
<title>aaaPage Title</title>
</head>
<body>

<h1>This iaaaas a Heading</h1>
<p>This is a paragraph.</p>

</body>
</html>
`)
})
const answers = {
  '1': {
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
  },
  '2': {
    "userId": 1,
    "id": 2,
    "title": "quis ut nam facilis et officia qui",
    "completed": false
  },
  '3': {
    "userId": 1,
    "id": 3,
    "title": "fugiat veniam minus",
    "completed": false
  },
  '10': {
    "userId": 1,
    "id": 10,
    "title": "illo est ratione doloremque quia maiores aut",
    "completed": true
  }
}
app.get('/todo/:id', (req, res) => {
  const { id } = req.params
  console.log(id, answers[id])
  const a = ''
  if (!a) {
    console.log('this is false')
  }

  res.json(answers[id] ? answers[id] : {})
})
// app.get('/todo/2', (req, res) => {
//   console.log(req.url)
//   res.json(
//     {
//       "userId": 1,
//       "id": 2,
//       "title": "quis ut nam facilis et officia qui",
//       "completed": false
//     }
//   )
// })

app.listen(3000)


const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.post("/", (req, res) => {
  const status = req.body.status;
  console.log('swer',status);

  if (status !== "дозвон" && status !== "недозвон") {
    return res.status(400).send("Неверное значение status");
  }

  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Ошибка сервера");
    }

    let json;
    try {
      json = JSON.parse(data);
    } catch (err) {
      console.log(err);
      json = [];
    }

    if (!Array.isArray(json)) {
      console.log("Ошибка: данные в файле не являются массивом");
      json = [];
    }

    json.push({
      status: status,
      date: new Date().toLocaleString()
    });

    fs.writeFile("data.json", JSON.stringify(json), "utf8", (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Ошибка сервера");
      }
      res.send("Значение успешно добавлено в JSON файл");
    });
  });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

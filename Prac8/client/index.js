const client = require("./client");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    client.getAll(null, (err, data) => {
        if (!err) {
            res.render("purchases", {
                results: data.purchases
            });
        }
    });
});

app.post("/save", (req, res) => {
    let newPurchase = {
        name: req.body.name,
        count: req.body.count
    };
    client.insert(newPurchase, (err, data) => {
        if (err) throw err;
        console.log("Покупка создана", data);
        res.redirect("/");
    });
});

app.post("/update", (req, res) => {
    const updatePurchase = {
        id: req.body.id,
        name: req.body.name,
        count: req.body.count
    };
    client.update(updatePurchase, (err, data) => {
        if (err) throw err;
        console.log("Покупка успешно обновлена", data);
        res.redirect("/");
    });
});

app.post("/setPurchased", (req, res) => {
    console.log(req.body.purchase_id_set);
    console.log(req.body.purchased);
    const updatePurchase = {
        id: req.body.purchase_id_set,
        purchased: req.body.purchased === 'false' ? true : false,
    };
    client.setPurchased(updatePurchase, (err, data) => {
        if (err) throw err;
        console.log("Состояние покупки успешно обновлено", data);
        res.redirect("/");
    });
});

app.post("/remove", (req, res) => {
    client.remove({ id: req.body.purchase_id }, (err, _) => {
        if (err) throw err;
        console.log("Абонент удалён");
        res.redirect("/");
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Сервер запущен на порту %d", PORT);
});
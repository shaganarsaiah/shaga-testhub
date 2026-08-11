import express from "express";
import fs from "fs";
import { exec } from "child_process";
import path from "path";

const app = express();

app.use(express.json());


app.post("/generate-test", (req, res) => {

    console.log("Generating Test...");

    const config = req.body;

    fs.writeFileSync(

        "./build/test-config.json",

        JSON.stringify(config, null, 4),

        "utf8"

    );

    exec("node build/build-test.js", (error, stdout, stderr) => {

        if (error) {

            console.error(error);

            return res.status(500).json({

                success:false

            });

        }

        console.log(stdout);

        res.json({

            success:true

        });

    });

});

app.use(express.static("."));

app.listen(3000, ()=>{

    console.log("");

    console.log("================================");

    console.log("SHAGA TestHub Server Started");

    console.log("http://localhost:3000/config.html");

    console.log("================================");

});
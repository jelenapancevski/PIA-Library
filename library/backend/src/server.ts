import express from 'express';
//za omogucavanje cros origin domena, front je na 4200 a back  na 4000 to su dva razlicita domena pa moramo omoguciti mogucnost deljenja podataka izmedju dva razlicita domena.
import cors from "cors";
import bodyParser from 'body-parser'
import mongoose from 'mongoose' //da se konektujemo na bazu podataka
import userRouter from './routers/user.routes';
import bookRouter from './routers/book.routes';

const path = require("path");


const app = express(); //Kreiramo express applikaciju koja komunicira s mongo bazom

app.use(cors()); //koristi crossorigin domain
app.use(bodyParser.json()); //podaci se salju u json formatu
app.use(bodyParser.urlencoded({extended: true}));
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req: express.Request, file: any, cb: any) => {
        cb(null, './../../library/frontend/library/src/assets/');
        //'
    },
    filename: (req: express.Request, file: any, cb: any) => {
       // console.log(req.body.filename);
        cb(null,  req.body.filename);
    }
});
var upload = multer({storage:storage});

//konekcija na bazu podataka
mongoose.connect('mongodb://localhost:27017/library');

const connection = mongoose.connection;

connection.once('open',()=>{
//kada se jednom otvori konekcija da ispisemo da je otvorena
console.log("db connection ok");
});

//Preko express-a kreiramo api

const router = express.Router(); //preusmerava zahteve tamo gde treba
//zelimo da imamo rutere za sve logicke celine npr ruteri za korisnike, knjige, itd. Raspodela zahteva tako da vise rutera se bavi tim rutama. Pravimo folder routers

router.use('/users',userRouter);
router.use('/books',bookRouter);

app.post('/uploadFile',upload.single('file'),(req: express.Request, res: express.Response, next) => {
    //const filename = req.body.filename;
    //console.log(filename);
   
});

app.use('/',router);



app.listen(4000, () => console.log(`Express server running on port 4000`));



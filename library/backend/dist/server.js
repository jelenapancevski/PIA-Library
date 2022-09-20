"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//za omogucavanje cros origin domena, front je na 4200 a back  na 4000 to su dva razlicita domena pa moramo omoguciti mogucnost deljenja podataka izmedju dva razlicita domena.
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose")); //da se konektujemo na bazu podataka
const user_routes_1 = __importDefault(require("./routers/user.routes"));
const book_routes_1 = __importDefault(require("./routers/book.routes"));
const path = require("path");
const app = (0, express_1.default)(); //Kreiramo express applikaciju koja komunicira s mongo bazom
app.use((0, cors_1.default)()); //koristi crossorigin domain
app.use(body_parser_1.default.json()); //podaci se salju u json formatu
app.use(body_parser_1.default.urlencoded({ extended: true }));
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './../../library/frontend/library/src/assets/');
        //'
    },
    filename: (req, file, cb) => {
        // console.log(req.body.filename);
        cb(null, req.body.filename);
    }
});
var upload = multer({ storage: storage });
//konekcija na bazu podataka
mongoose_1.default.connect('mongodb://localhost:27017/library');
const connection = mongoose_1.default.connection;
connection.once('open', () => {
    //kada se jednom otvori konekcija da ispisemo da je otvorena
    console.log("db connection ok");
});
//Preko express-a kreiramo api
const router = express_1.default.Router(); //preusmerava zahteve tamo gde treba
//zelimo da imamo rutere za sve logicke celine npr ruteri za korisnike, knjige, itd. Raspodela zahteva tako da vise rutera se bavi tim rutama. Pravimo folder routers
router.use('/users', user_routes_1.default);
router.use('/books', book_routes_1.default);
app.post('/uploadFile', upload.single('file'), (req, res, next) => {
    //const filename = req.body.filename;
    //console.log(filename);
});
app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));
//# sourceMappingURL=server.js.map
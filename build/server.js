"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const bluebird_1 = __importDefault(require("bluebird"));
const secrets_1 = require("./utils/secrets");
dotenv.config();
const app_1 = require("./app");
mongoose_1.default.Promise = bluebird_1.default;
mongoose_1.default.connect(secrets_1.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`MongoDB Connected`);
}).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    process.exit();
});
mongoose_1.default.set('debug', true);
const port = process.env.PORT || 3000;
process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});
app_1.app.listen(port, () => console.log(`server is running on --> http://localhost:${port}/api/v1/ecommerce`));
//# sourceMappingURL=server.js.map
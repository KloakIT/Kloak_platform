"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Stream = require("stream");
class streamUrl extends Stream.Transform {
    constructor() {
        super();
    }
    _transform(chunk, encode, next) {
        next();
    }
}
exports.default = streamUrl;

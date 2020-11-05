"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
/**
 * Home page.
 * @route GET /
 */
exports.index = (req, res) => {
    res.render("home", {
        title: "Home"
    });
};

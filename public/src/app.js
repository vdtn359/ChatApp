/*jshint esversion: 6 */
import 'angular-ui-router';
import 'angular-route';
import "angular-ui-bootstrap";
import "./auth/auth.module";
import "./chat/chat.module";
import "ng-droplet";
import authConfig from "./config/route";
import notiConfig from "./config/notification";
import {MAIN_CONTROLLER_NAME, MainController} from "./app.controller";


angular.module("ChatApp", ["ui.router", "auth", "chat", "ui-notification", "ui.bootstrap", 'ngDroplet'])
    .config(authConfig)
    .config(notiConfig)
    .controller(MAIN_CONTROLLER_NAME, MainController);

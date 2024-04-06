import {makeAutoObservable} from "mobx";

export default class ErrorStore {
    constructor() {
        makeAutoObservable(this)
    }
}
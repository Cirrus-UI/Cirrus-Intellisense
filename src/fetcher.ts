import * as css from "css";
import fetch from "node-fetch";

export default class Fetcher {

    public static async fetchStyleSheet(url: string): Promise<css.Stylesheet> {
        const data = await fetch(url);
        
        const raw = await data.text();
        return css.parse(raw);
    }
}

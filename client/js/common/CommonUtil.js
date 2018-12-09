export class CommonUtil
{
    static docid(id) {
        return document.getElementById(id);
    }

    static getUniqueToken() {
        var token = Date.now() + '-' + Math.round(Math.random()*1000);
        return token;
    }
}
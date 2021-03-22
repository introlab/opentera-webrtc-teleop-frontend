// src/config/cookie.ts

export const SESSION_COOKIE = "teleop-vue-client-85db3980-3340-47b5-8d66-e571cd497484";

export function setCookie(cname: string, cvalue: string, maxAge: number) : void{
    document.cookie = cname + "=" + cvalue + ";max-age=" + maxAge + ";path=/";
}

export function getCookie(cname: string) : string | undefined{
    const name = cname + "=";
    return document.cookie
        .split(";")
        .map(cookie => cookie.replace(/ /g, ''))
        .find(row => row.startsWith(name))
        ?.split('=')[1];
}
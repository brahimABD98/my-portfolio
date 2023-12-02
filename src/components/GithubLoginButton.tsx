import { component$, useSignal, $, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { getCookie, setSessionCookie } from "../utils/cookies";


export interface GithubLoginButtonProps {
    /**
     * The url to the backend api
     */
    url: string,
    /**
     * The client id of the github oauth app
     */
    client_id: string
}

/**
 * A button to login with Github
 * @param {GithubLoginButtonProps} props
 * 
 * basic usage :
 * all you need is to provide the url to the backend api but you have
 * to make sure to account for the code wether to use query string or path params
 * (make sure the code is the last param in the url)
 * 
 * query string example:
 * ```tsx	
 * <GithubLoginButton 
 *      url={`${url}?code=`}
 *                       ^^ don't forget the `=` sign
 *      />
 * ```
 *
 *  path params example:
 * 
 * ```tsx
 * <GithubLoginButton
 *     url={`${url}/`}
 *                 ^^ don't forget the trailing slash
 *    />
 * ```
 */
export const GithubLoginButton = component$((props: GithubLoginButtonProps) => {

    const code = useSignal("")
    const isVisible = useSignal(true)

    useVisibleTask$(async () => {

        try {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            if (getCookie("token")) {
                isVisible.value = false
            }
            const codeValue = urlParams.get('code');
            if (!codeValue)
                throw new Error("No code found")

            code.value = codeValue
        }
        catch (error) {
            console.log(error)
        }
        return () => { };
    })

    useTask$(async ({ track }) => {
        track(() => code.value)
        try {
            if (code.value) {
                const response = await fetch(checkURlFormat(props.url) + code.value);
                if (response.status == 202) {
                    const data = await response.json();
                    setSessionCookie("token", data.access_token)
                    isVisible.value = false
                    window.location.reload();
                }
            }
        } catch (error) {
            console.log("erro:", error)
        }
    });

    return (
        <>
            {isVisible.value &&
                <button onClick$={() => window.location.assign(`https://github.com/login/oauth/authorize?client_id=${props.client_id}`)} class="btn btn-success md:w-48">
                    <img src="/github.svg" class="w-6 inline mr-2" />
                    Login with Github
                </button>
            }

        </>
    );
});



const checkURlFormat = (url: string) => {
    if (!url)
        throw new Error("url is required")

    if (!url.startsWith("http"))
        throw new Error("url must start with http")

    if (url.includes("code") && !url.endsWith("=")) {
        throw new Error("url must end with = sign")
    }
    if (!url.includes("code") && !url.endsWith("/")) {
        throw new Error("url must end with a slash")
    }
    return url;
}






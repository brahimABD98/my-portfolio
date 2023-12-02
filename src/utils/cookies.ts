export const setSessionCookie = (cookieName: string, cookieValue: string) => {
    const cookieString = `${cookieName}=${cookieValue};path=/visitbook;max-age=3600`
    document.cookie = cookieString;
}
// Function to get the value of a cookie by name
export const getCookie = (cookieName: string) => {
    // Split the cookie string into an array of individual cookies
    const cookies = document.cookie.split('; ');

    // Iterate through the cookies to find the one with the specified name
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const [name, value] = cookie.split('=');

        // Trim leading and trailing whitespaces
        const trimmedName = name.trim();

        // Check if the current cookie matches the specified name
        if (trimmedName === cookieName) {
            // Return the value of the cookie
            return decodeURIComponent(value);
        }
    }

    // Return null if the cookie with the specified name is not found
    return null;
}
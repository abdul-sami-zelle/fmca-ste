export const fetcher = async (api, method, header) => {
    const response = await fetch(api, {
        method: method,
        headers: header
    })
    if(!response.ok) throw new Error("Faild to Fetch Data");
    return response.json();

}

export const simpleFetcher = async (api, method, header) => {
    const response = await fetch(api, {
        method: method,
        headers: header
    })

    const data = await response.json()
    if(!response.ok) throw new Error("Faild to Fetch Data");
    return response;

}

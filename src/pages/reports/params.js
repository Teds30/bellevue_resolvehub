export const extractQueryParams = (url) => {
    // Create an empty array to store the parameters
    const paramsArray = []

    // Check if the URL has query parameters
    const queryStringIndex = url.indexOf('?')
    if (queryStringIndex !== -1) {
        // Extract the query string
        const queryString = url.substring(queryStringIndex + 1)

        // Split the query string into individual parameters
        const params = queryString.split('&')

        // Iterate over each parameter
        params.forEach((param) => {
            // Split the parameter into key and value
            const [key, value] = param.split('=')

            // Store the key-value pair in the array
            paramsArray.push({ key, value })
        })
    }

    return paramsArray
}

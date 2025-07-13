/*

JS code to paste in the dev console on komoot.com, in order to download personal data.

- Creates a "panel" div on top of the page to show progress and debug info
- Looks for all the links on the page that contain /collection/<id>/ with <id> being an integer. The text content of each of these is a collection name.
- Displays "Found <number> collection links" in the panel and list them by name, with an "inspect" button on each
- When "inspect" is pressed, load the collection url in an iframe and parse the loaded page, looking for all links that end with /tour/<id>  - id being an integer again. These links have a textContent with the name of the tour. In the panel, under the collection line (with the name and the inspect button), we show the text "Found <number> tours", and a 'Download' button.
- Pressing 'download' will download each of the tours, with the filename in the format "<collection name> ---- <tour name>.gpx"

*/

;(function () {
    // Create and style the paneal
    const panel = document.createElement("div")
    panel.id = "download-panel"
    panel.style.position = "fixed"
    panel.style.top = "10px"
    panel.style.right = "10px"
    panel.style.width = "300px"
    panel.style.maxHeight = "90vh"
    panel.style.overflowY = "auto"
    panel.style.backgroundColor = "white"
    panel.style.border = "1px solid black"
    panel.style.padding = "10px"
    panel.style.zIndex = "10000"
    document.body.appendChild(panel)

    function log(message) {
        const p = document.createElement("p")
        p.textContent = message
        panel.appendChild(p)
    }

    function logHtml(html) {
        const div = document.createElement("div")
        div.innerHTML = html
        panel.appendChild(div)
    }

    // Find collection links
    const collectionLinks = Array.from(document.querySelectorAll('a[href*="/collection/"]')).filter((a) =>
        /\/collection\/\d+/.test(a.href),
    )

    log(`Found ${collectionLinks.length} collection links`)

    collectionLinks.forEach((link) => {
        const collectionName = link.textContent.trim()
        const collectionUrl = link.href
        const collectionDiv = document.createElement("div")
        collectionDiv.style.marginBottom = "10px"

        const collectionInfo = document.createElement("div")
        collectionInfo.textContent = `• ${collectionName}`
        collectionDiv.appendChild(collectionInfo)

        const inspectButton = document.createElement("button")
        inspectButton.textContent = "Inspect"
        collectionDiv.appendChild(inspectButton)

        const toursDiv = document.createElement("div")
        toursDiv.style.marginLeft = "20px"
        collectionDiv.appendChild(toursDiv)

        panel.appendChild(collectionDiv)

        inspectButton.addEventListener("click", () => {
            inspectButton.disabled = true
            inspectButton.textContent = "Inspecting..."

            const iframe = document.createElement("iframe")
            iframe.style.display = "none"
            iframe.src = collectionUrl

            iframe.onload = () => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
                    const tourLinks = Array.from(iframeDoc.querySelectorAll('a[href*="/tour/"]')).filter((a) =>
                        /\/tour\/\d+$/.test(a.href),
                    )

                    toursDiv.innerHTML = `Found ${tourLinks.length} tours`

                    const downloadButton = document.createElement("button")
                    downloadButton.textContent = "Download"
                    toursDiv.appendChild(downloadButton)

                    downloadButton.addEventListener("click", () => {
                        downloadButton.disabled = true
                        downloadButton.textContent = "Downloading..."

                        const downloadPromises = tourLinks.map((tourLink) => {
                            const tourNameElement = tourLink.querySelector("h3")
                            const tourName = tourNameElement ? tourNameElement.textContent.trim() : "Unnamed Tour"
                            const tourIdMatch = tourLink.href.match(/\/tour\/(\d+)$/)
                            if (tourIdMatch) {
                                const tourId = tourIdMatch[1]
                                const downloadUrl = `https://www.komoot.com/api/v007/tours/${tourId}.gpx`
                                const filename = `${collectionName} ---- ${tourName}.gpx`

                                return fetch(downloadUrl)
                                    .then((response) => {
                                        if (!response.ok) {
                                            throw new Error(`HTTP error! status: ${response.status}`)
                                        }
                                        return response.blob()
                                    })
                                    .then((blob) => {
                                        const url = window.URL.createObjectURL(blob)
                                        const a = document.createElement("a")
                                        a.style.display = "none"
                                        a.href = url
                                        a.download = filename
                                        document.body.appendChild(a)
                                        a.click()
                                        window.URL.revokeObjectURL(url)
                                        document.body.removeChild(a)
                                    })
                                    .catch((err) => console.error(`Failed to download ${filename}:`, err))
                            }
                            return Promise.resolve() // Resolve for links that don't match
                        })

                        Promise.all(downloadPromises).then(() => {
                            downloadButton.textContent = "Downloaded"
                        })
                    })
                } catch (e) {
                    toursDiv.innerHTML = "Error inspecting collection."
                    console.error("Error inspecting iframe content:", e)
                } finally {
                    document.body.removeChild(iframe)
                    inspectButton.textContent = "Inspected"
                }
            }

            document.body.appendChild(iframe)
        })
    })
})()

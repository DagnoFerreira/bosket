// @flow

import { tree } from "../tools/trees"

export const dragndrop = {
    drops: {
        // "Standard"" drop //
        selection: (target: Object, model: Object[], category: string, selection: Object[]) => {
            let updatedModel = tree(model, category).filter(e => selection.indexOf(e) < 0)
            if(target)
                target[category] = [ ...target[category], ...selection ]
            else
                updatedModel = [ ...updatedModel, ...selection ]
            return updatedModel
        },
        // Returns a list of local files/folders dropped
        filesystem: (event: DragEvent) => {
            const items = event.dataTransfer ? event.dataTransfer.items : null
            if(items && items.length > 0 && items[0].kind === "file") {
                const files = []
                for(let i = 0; i < items.length; i++) {
                    /* eslint-disable */
                    const item = (items[i] : any).webkitGetAsEntry() || items[i].getAsFile()
                    /* eslint-enable */
                    if(item) {
                        files.push(item)
                    }
                }
                return files
            }
            return null
        }
    }
}
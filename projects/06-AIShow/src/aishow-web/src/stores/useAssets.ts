export default function useAssets () {
  const allAssets = {
    images: import.meta.globEager("../assets/images/*.*")
  }

  const assetsMapping: Record<string, Record<string, {}>> = {}

  Object.entries(allAssets).forEach(([assetType, assets]) => {
    assetsMapping[assetType] = {}

    Object.entries(assets).forEach(([path, imported]) => {
      const fileName = path.split("/").slice(-1)[0]
      assetsMapping[assetType][fileName] = imported.default
    })
  })

  const getImageURL = (imageFilename: string) => assetsMapping.images[imageFilename]
  const getAssets = (assetType: string) => assetsMapping[assetType]

  return { getImageURL, getAssets }
}

export default class addToCartModal {
    description: string
    images: any[]
    prices: any
    title: string
    count: number
    addToWishlistBody: any
    constructor() {
        this.description = ""
        this.images = []
        this.title = ""
        this.count = 1
        this.addToWishlistBody = {
            showId: undefined,
            productId: undefined,
            actorId: undefined,
            coordinateId: undefined,
            retailerId: undefined,
            sceneId: undefined,
            productImageId: undefined
        }
    }
    
}